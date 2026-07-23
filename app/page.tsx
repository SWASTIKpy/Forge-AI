import Image from "next/image";
import {Button} from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function Home() {
  return (
    <main className="min-h-screen selection:bg-white/20">
      <section className=" relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
        <Badge variant={"outline"} className="gap -2 p-4 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
          Powered by Gemini</Badge>
      </section>
    
    </main>
  );
}
