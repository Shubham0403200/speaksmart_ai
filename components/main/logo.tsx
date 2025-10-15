import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Mic className="text-black dark:text-white w-6 h-6" />
      <span className="text-base md:text-lg font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-bl from-[#111111] via-[#444444] to-[#222222]">
        SpeakSmart AI
      </span>
    </div>
  );
};
