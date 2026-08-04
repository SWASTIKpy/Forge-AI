import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "./generated/prisma/client";
import { db } from "./prisma";
import { CREDIT_COST_PER_GENERATION } from "./constants";
import type { FileData, Message } from "@/types/workspace";

type GenerateRequest = {
  workspaceId?: unknown;
  messages?: unknown;
  fileData?: unknown;
};

export type ApiResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; message: string };

export async function getAuthenticatedDatabaseUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  return db.user.findUnique({
    where: { clerkId },
    select: { id: true, credits: true, plan: true },
  });
}

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    (message.imageUrl === undefined || typeof message.imageUrl === "string")
  );
}

function isFileData(value: unknown): value is FileData {
  if (!value || typeof value !== "object") return false;
  const fileData = value as Record<string, unknown>;
  return (
    !!fileData.files &&
    typeof fileData.files === "object" &&
    !!fileData.dependencies &&
    typeof fileData.dependencies === "object"
  );
}

function titleFromPrompt(prompt: string) {
  return prompt
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60)
    .replace(/[.?!,:;]+$/, "") || "Untitled project";
}

export function createStarterFiles(prompt: string, title: string): FileData {
  const safePrompt = JSON.stringify(prompt);
  const safeTitle = JSON.stringify(title);

  return {
    title,
    dependencies: {},
    files: {
      "/App.js": {
        code: `const prompt = ${safePrompt};
const title = ${safeTitle};

export default function App() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#0f172a", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      <section style={{ maxWidth: 720, margin: "0 auto", padding: 32, borderRadius: 20, background: "#1e293b", boxShadow: "0 20px 50px rgba(0,0,0,.25)" }}>
        <p style={{ color: "#38bdf8", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Forge starter</p>
        <h1 style={{ fontSize: 36, margin: "12px 0" }}>{title}</h1>
        <p style={{ lineHeight: 1.6, color: "#cbd5e1" }}>{prompt}</p>
        <button style={{ marginTop: 24, border: 0, borderRadius: 10, padding: "12px 18px", background: "#38bdf8", color: "#082f49", fontWeight: 700, cursor: "pointer" }} onClick={() => alert("Your Forge starter app is running!")}>Try it</button>
      </section>
    </main>
  );
}`,
      },
    },
  };
}

export async function saveGeneration(input: GenerateRequest): Promise<ApiResult<{
  workspaceId: string;
  fileData: FileData;
  creditsRemaining: number;
  assistantMessage: string;
}>> {
  const user = await getAuthenticatedDatabaseUser();
  if (!user) return { ok: false, status: 401, message: "Sign in before generating." };
  if (user.credits < CREDIT_COST_PER_GENERATION) {
    return { ok: false, status: 402, message: "Not enough credits." };
  }

  const messages = Array.isArray(input.messages)
    ? input.messages.filter(isMessage)
    : [];
  const latestPrompt = [...messages].reverse().find((message) => message.role === "user")?.content;
  if (!latestPrompt?.trim()) {
    return { ok: false, status: 400, message: "A prompt is required." };
  }

  const workspaceId = typeof input.workspaceId === "string" ? input.workspaceId : null;
  const existingFileData = isFileData(input.fileData) ? input.fileData : null;
  const title = existingFileData?.title ?? titleFromPrompt(latestPrompt);
  const fileData = existingFileData ?? createStarterFiles(latestPrompt, title);
  const assistantMessage = existingFileData
    ? "Saved your follow-up request. Configure an AI provider to have Forge modify the project automatically."
    : `Created a runnable starter project for **${title}**. Configure an AI provider to generate a tailored application from your prompt.`;
  const savedMessages: Message[] = [...messages, { role: "assistant", content: assistantMessage }];

  const workspace = await db.$transaction(async (tx) => {
    const debit = await tx.user.updateMany({
      where: { id: user.id, credits: { gte: CREDIT_COST_PER_GENERATION } },
      data: { credits: { decrement: CREDIT_COST_PER_GENERATION } },
    });
    if (debit.count !== 1) return null;

    if (workspaceId) {
      const existingWorkspace = await tx.workspace.findFirst({
        where: { id: workspaceId, userId: user.id },
        select: { id: true },
      });
      if (existingWorkspace) {
        return tx.workspace.update({
          where: { id: existingWorkspace.id },
          data: {
            title,
            messages: savedMessages as unknown as Prisma.InputJsonValue,
            fileData: fileData as unknown as Prisma.InputJsonValue,
          },
          select: { id: true },
        });
      }
    }

    return tx.workspace.create({
      data: {
        title,
        userId: user.id,
        messages: savedMessages as unknown as Prisma.InputJsonValue,
        fileData: fileData as unknown as Prisma.InputJsonValue,
      },
      select: { id: true },
    });
  });

  if (!workspace) return { ok: false, status: 402, message: "Not enough credits." };

  return {
    ok: true,
    value: {
      workspaceId: workspace.id,
      fileData,
      creditsRemaining: user.credits - CREDIT_COST_PER_GENERATION,
      assistantMessage,
    },
  };
}

export async function saveImprovement(input: {
  workspaceId?: unknown;
  userRequest?: unknown;
  fileData?: unknown;
}): Promise<ApiResult<{ fileData: FileData; creditsRemaining: number; summary: string }>> {
  const user = await getAuthenticatedDatabaseUser();
  if (!user) return { ok: false, status: 401, message: "Sign in before improving." };
  if (user.plan !== "pro") return { ok: false, status: 403, message: "A Pro plan is required for Improve." };
  if (user.credits < CREDIT_COST_PER_GENERATION) return { ok: false, status: 402, message: "Not enough credits." };

  const workspaceId = typeof input.workspaceId === "string" ? input.workspaceId : null;
  const userRequest = typeof input.userRequest === "string" ? input.userRequest.trim() : "";
  const fileData = isFileData(input.fileData) ? input.fileData : null;
  if (!workspaceId || !userRequest || !fileData) {
    return { ok: false, status: 400, message: "A workspace, request, and project files are required." };
  }

  const summary = "Saved the improvement request. Configure an AI provider to apply code changes automatically.";
  const updated = await db.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: { id: workspaceId, userId: user.id },
      select: { id: true, messages: true },
    });
    if (!workspace) return null;

    const debit = await tx.user.updateMany({
      where: { id: user.id, credits: { gte: CREDIT_COST_PER_GENERATION } },
      data: { credits: { decrement: CREDIT_COST_PER_GENERATION } },
    });
    if (debit.count !== 1) return null;

    const priorMessages = Array.isArray(workspace.messages)
      ? workspace.messages.filter(isMessage)
      : [];
    await tx.workspace.update({
      where: { id: workspace.id },
      data: {
        messages: [...priorMessages, { role: "user", content: userRequest }, { role: "assistant", content: summary }] as unknown as Prisma.InputJsonValue,
        fileData: fileData as unknown as Prisma.InputJsonValue,
      },
    });
    return true;
  });

  if (!updated) return { ok: false, status: 404, message: "Workspace not found or not enough credits." };
  return { ok: true, value: { fileData, creditsRemaining: user.credits - CREDIT_COST_PER_GENERATION, summary } };
}
