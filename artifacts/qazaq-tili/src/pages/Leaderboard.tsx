import { useState } from "react"
import { useGetLeaderboard } from "@workspace/api-client-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StreakBadge } from "@/components/StreakBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Crown } from "lucide-react"
import { motion } from "framer-motion"

export default function Leaderboard() {
  const [period, setPeriod] = useState<"week"|"month"|"all">("week")
  
  const { data: leaderboard, isLoading } = useGetLeaderboard({ period })

  const topThree = leaderboard?.slice(0, 3) || []
  const rest = leaderboard?.slice(3) || []

  return (
    <div className="flex-1 overflow-y-auto bg-muted/10">
      <div className="relative pt-12 pb-32 px-6 lg:px-12 overflow-hidden bg-card border-b">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="w-20 h-20 mx-auto bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Trophy size={40} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold">Hall of Fame</h1>
          <p className="text-lg text-muted-foreground">Compete with other learners. Top 3 get exclusive badges!</p>
          
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-[300px] mx-auto mt-8">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 -mt-20 relative z-20 pb-20">
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-end justify-center gap-4 h-64 mb-12">
              <Skeleton className="w-32 h-40 rounded-t-3xl" />
              <Skeleton className="w-32 h-56 rounded-t-3xl" />
              <Skeleton className="w-32 h-32 rounded-t-3xl" />
            </div>
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : leaderboard?.length ? (
          <>
            {/* Podium */}
            {topThree.length > 0 && (
              <div className="flex items-end justify-center gap-2 sm:gap-6 mb-16 pt-10">
                {/* 2nd Place */}
                {topThree[1] && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center w-28 sm:w-36">
                    <div className="relative mb-4">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-slate-300 shadow-lg">
                        <AvatarImage src={topThree[1].avatar} />
                        <AvatarFallback>{topThree[1].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 -right-2 bg-slate-300 text-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-background">2</div>
                    </div>
                    <div className="text-center w-full bg-card border rounded-t-2xl pt-4 pb-2 shadow-sm h-32 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-300/20 to-transparent"></div>
                      <div className="relative z-10 px-2">
                        <p className="font-bold text-sm sm:text-base truncate">{topThree[1].name}</p>
                        <p className="text-amber-500 font-bold text-sm">{topThree[1].xp} XP</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center w-32 sm:w-44 z-10">
                    <div className="relative mb-4">
                      <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-md" size={40} />
                      <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-4 border-amber-400 shadow-xl shadow-amber-500/20">
                        <AvatarImage src={topThree[0].avatar} />
                        <AvatarFallback>{topThree[0].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 -right-2 bg-amber-400 text-amber-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-background shadow-md">1</div>
                    </div>
                    <div className="text-center w-full bg-card border border-amber-500/30 rounded-t-2xl pt-4 pb-4 shadow-lg shadow-amber-500/5 h-44 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
                      <div className="relative z-10 px-2">
                        <p className="font-bold text-base sm:text-lg truncate">{topThree[0].name}</p>
                        <p className="text-amber-500 font-bold">{topThree[0].xp} XP</p>
                        <div className="mt-2 flex justify-center"><StreakBadge streak={topThree[0].streak} /></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center w-28 sm:w-36">
                    <div className="relative mb-4">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-amber-700 shadow-lg">
                        <AvatarImage src={topThree[2].avatar} />
                        <AvatarFallback>{topThree[2].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 -right-2 bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-background">3</div>
                    </div>
                    <div className="text-center w-full bg-card border rounded-t-2xl pt-4 pb-2 shadow-sm h-28 flex flex-col justify-end relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-700/20 to-transparent"></div>
                      <div className="relative z-10 px-2">
                        <p className="font-bold text-sm sm:text-base truncate">{topThree[2].name}</p>
                        <p className="text-amber-500 font-bold text-sm">{topThree[2].xp} XP</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* List */}
            <Card className="overflow-hidden shadow-sm">
              <div className="divide-y">
                {rest.map((entry, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    key={entry.userId} 
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 font-bold text-muted-foreground text-center">
                      {entry.rank}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 shrink-0">
                      <div className="hidden sm:block">
                        <StreakBadge streak={entry.streak} />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-500">{entry.xp} XP</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border">
            <p className="text-muted-foreground">No leaderboard data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
