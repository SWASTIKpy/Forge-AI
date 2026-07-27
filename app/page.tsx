"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { BlueTitle, GrayTitle } from "@/components/reusables";
import {cn} from "@/lib/utils";
import { useRef, useState } from "react";
import { useRouter } from "next/dist/client/components/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const {isSignedIn} = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-white/20">
      <section className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
        <HoleBackground
          className="absolute inset-0 -z-10"
          strokeColor="rgba(255, 255, 255, 0.05)"
          showLines={false}
          showDiscs={false}
           style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10">
          <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
              in Beta Stage
          </Badge>
        <h1 className="mx-auto max-w-5xl font-fira text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl z-10">
          <GrayTitle>Build Projects</GrayTitle>
          <br />
          <span className="whitespace-nowrap text-[0.75em]">
            <BlueTitle>Which match your vision.</BlueTitle>
          </span>
        </h1>
        </div>

        {/*prompt input*/}
        <div className="mt-12 relative mx-auto w-full max-w-2xl rounded-lg border ">
          <div className={cn("rounded-2xl border bg#-[#111111] duration-200",
            isFocused
            ? "border-white/20 ring-1 ring-white/8"
            :"border-white/8",
          )}>
              <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base"
              style={{ minHeight: 56, maxHeight: 200 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
