import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({ streak }: { streak: number }) {
  if (!streak) return null;
  
  const isHot = streak >= 3;
  const isBlazing = streak >= 7;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm",
      isBlazing ? "bg-orange-500/20 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" : 
      isHot ? "bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"
    )}>
      <Flame size={16} className={cn(isBlazing ? "fill-orange-500 animate-pulse" : isHot ? "fill-amber-500" : "")} />
      <span>{streak}</span>
    </div>
  );
}
