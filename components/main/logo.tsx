import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import { Rajdhani } from 'next/font/google'; 

export const playfair = Rajdhani({
  subsets: ['latin'],
  weight: ['600', '700'], 
  variable: '--font-playfair', 
  display: 'swap',
});

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Mic className="text-black dark:text-white w-4 h-4 md:w-6 md:h-6" />
      <span className={cn(
        "text-lg md:text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-bl from-[#111111] via-[#444444] to-[#222222]",
        playfair.className // Apply the font class directly
      )}>
        SpeakSmart AI
      </span>
    </div>
  );
};