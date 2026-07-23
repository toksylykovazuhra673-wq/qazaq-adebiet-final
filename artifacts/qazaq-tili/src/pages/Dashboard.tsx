import { useGetDashboardSummary, useGetRecommendedCourses, useGetRecentActivity } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StreakBadge } from "@/components/StreakBadge"
import { Trophy, Target, TrendingUp, BookOpen, Star, Clock, ChevronRight } from "lucide-react"
import { Link } from "wouter"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary()
  const { data: recommendations, isLoading: recommendationsLoading } = useGetRecommendedCourses()
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity()

  const levelProgress = summary ? (summary.totalXp / (summary.totalXp + (summary.xpToNextLevel || 100))) * 100 : 0;
  const weeklyProgress = summary?.weeklyProgress || 0;
  
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-muted/20">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & Stats Overview */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground text-lg">You're making great progress in your Kazakh journey.</p>
          </div>
          
          {summaryLoading ? (
            <Skeleton className="h-12 w-48 rounded-full" />
          ) : (
            <div className="flex items-center gap-4 bg-card p-2 pr-6 rounded-full border shadow-sm">
              <StreakBadge streak={summary?.currentStreak || 0} />
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-2 font-bold text-amber-500">
                <Trophy size={18} />
                {summary?.totalXp.toLocaleString()} XP
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level Card */}
          <Card className="md:col-span-2 border-primary/20 shadow-primary/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-primary pointer-events-none">
              <TrendingUp size={160} />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-primary fill-primary/20" size={20} /> Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-5xl font-display font-bold text-primary">{summary?.level}</span>
                    <span className="text-xl text-muted-foreground font-medium">{summary?.levelLabel || "Beginner"}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total XP: {summary?.totalXp}</span>
                      <span className="text-muted-foreground">{summary?.xpToNextLevel} XP to Level {summary && summary.level + 1}</span>
                    </div>
                    <Progress value={levelProgress} className="h-3" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Weekly Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="text-blue-500" size={18} /> Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              {summaryLoading ? (
                <Skeleton className="h-32 w-32 rounded-full" />
              ) : (
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" fill="none" stroke="currentColor" className="text-muted stroke-8" />
                    <circle cx="72" cy="72" r="60" fill="none" stroke="currentColor" strokeDasharray="377" strokeDashoffset={377 - (377 * Math.min(100, weeklyProgress)) / 100} className="text-blue-500 stroke-8 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-display font-bold">{summary?.weeklyXp}</span>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">/ {summary?.weeklyGoal || 500} XP</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Jump Back In</h2>
                <Link href="/courses" className="text-sm font-medium text-primary hover:underline">View all</Link>
              </div>
              
              <div className="grid gap-4">
                {recommendationsLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)
                ) : recommendations?.length ? (
                  recommendations.map(course => (
                    <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      <Link href={`/courses/${course.id}`}>
                        <Card className="overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="flex items-stretch">
                            <div className="w-4 flex-shrink-0" style={{ backgroundColor: course.coverColor }}></div>
                            <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <Badge variant="outline" className="mb-2">{course.level}</Badge>
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                {course.completedLessons !== undefined && course.completedLessons !== null && (
                                  <div className="text-sm font-medium text-muted-foreground w-32">
                                    <div className="flex justify-between mb-1">
                                      <span>Progress</span>
                                      <span>{Math.round((course.completedLessons / course.lessonCount) * 100)}%</span>
                                    </div>
                                    <Progress value={(course.completedLessons / course.lessonCount) * 100} className="h-1.5" />
                                  </div>
                                )}
                                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                  <ChevronRight size={20} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <Card className="p-8 text-center border-dashed">
                    <p className="text-muted-foreground">No active courses. Explore the catalog!</p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area (1/3) */}
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {activityLoading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="p-4"><Skeleton className="h-12 w-full" /></div>)
                  ) : activity?.length ? (
                    activity.map((item, i) => (
                      <div key={item.id} className="p-4 flex gap-4 items-start">
                        <div className={cn(
                          "mt-0.5 p-2 rounded-full",
                          item.type === 'lesson_complete' ? "bg-green-500/10 text-green-500" :
                          item.type === 'achievement' ? "bg-amber-500/10 text-amber-500" :
                          "bg-blue-500/10 text-blue-500"
                        )}>
                          {item.type === 'lesson_complete' ? <BookOpen size={16} /> :
                           item.type === 'achievement' ? <Trophy size={16} /> :
                           <Clock size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </div>
                        <div className="text-xs font-bold text-amber-500 shrink-0">
                          +{item.xp} XP
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
