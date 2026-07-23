import { useListAchievements, useListUserAchievements } from "@workspace/api-client-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Medal, Lock, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function Achievements() {
  const { data: allAchievements, isLoading: allLoading } = useListAchievements()
  const { data: userAchievements, isLoading: userLoading } = useListUserAchievements()

  const isLoading = allLoading || userLoading

  // Map user achievements by ID for easy lookup
  const earnedMap = new Map(userAchievements?.map(ua => [ua.achievement.id, ua.earnedAt]))

  // Group achievements by category
  const grouped = allAchievements?.reduce((acc, ach) => {
    if (!acc[ach.category]) acc[ach.category] = []
    acc[ach.category].push(ach)
    return acc
  }, {} as Record<string, typeof allAchievements>) || {}

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card border rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
                <Medal size={24} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold">Achievements</h1>
            </div>
            <p className="text-muted-foreground max-w-xl text-lg">
              Earn badges by completing courses, maintaining streaks, and mastering the language.
            </p>
          </div>
          
          <div className="relative z-10 bg-background/50 backdrop-blur border rounded-2xl p-6 text-center min-w-[200px]">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Unlocked</p>
            {isLoading ? (
              <Skeleton className="h-10 w-24 mx-auto" />
            ) : (
              <div className="text-4xl font-display font-bold text-amber-500">
                {userAchievements?.length || 0} <span className="text-muted-foreground text-xl">/ {allAchievements?.length || 0}</span>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(grouped).map(([category, achs]) => (
              <div key={category} className="space-y-6">
                <h2 className="text-2xl font-display font-bold capitalize pl-2 border-l-4 border-amber-500">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {achs.map((ach) => {
                    const earnedAt = earnedMap.get(ach.id)
                    const isUnlocked = !!earnedAt

                    return (
                      <motion.div
                        key={ach.id}
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <Card className={`h-full relative overflow-hidden flex flex-col text-center p-6 transition-all ${
                          isUnlocked 
                            ? 'border-amber-500/30 bg-gradient-to-b from-card to-amber-500/5 shadow-lg shadow-amber-500/5' 
                            : 'border-border/50 bg-card/50 opacity-80'
                        }`}>
                          {isUnlocked && (
                            <div className="absolute top-0 inset-x-0 h-1 bg-amber-500"></div>
                          )}
                          
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 relative ${
                              isUnlocked ? 'bg-amber-500/20' : 'bg-muted'
                            }`}>
                              {isUnlocked ? (
                                <>
                                  <Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" size={20} />
                                  <span className="text-5xl drop-shadow-md" style={{ color: ach.color || '#f59e0b' }}>{ach.icon}</span>
                                </>
                              ) : (
                                <Lock size={32} className="text-muted-foreground" />
                              )}
                            </div>
                            
                            <h3 className={`font-bold text-xl mb-2 ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                              {ach.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {ach.description}
                            </p>
                          </div>
                          
                          <div className="pt-4 border-t w-full flex items-center justify-center text-xs font-medium">
                            {isUnlocked ? (
                              <span className="text-amber-500 flex items-center gap-1.5">
                                Unlocked on {format(new Date(earnedAt), 'MMM d, yyyy')}
                              </span>
                            ) : (
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <Lock size={12} /> Requires {ach.xpRequired} XP
                              </span>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
