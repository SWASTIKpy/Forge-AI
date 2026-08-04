import { saveImprovement } from "@/lib/workspace-api";

export const runtime = "nodejs";

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON request body." }, { status: 400 });
  }

  const result = await saveImprovement(
    input && typeof input === "object" ? input : {}
  );
  if (!result.ok) {
    return Response.json({ message: result.message }, { status: result.status });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(sse({ type: "thinking", text: "Saving your request…" })));
      controller.enqueue(encoder.encode(sse({ type: "done", ...result.value })));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
