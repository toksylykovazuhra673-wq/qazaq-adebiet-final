import { useState } from "react"
import { useListCoursesByLevel } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "wouter"
import { Search, BookOpen, Clock, Award, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function Courses() {
  const { data: levels, isLoading } = useListCoursesByLevel()
  const [search, setSearch] = useState("")

  const filteredLevels = levels?.map(level => ({
    ...level,
    courses: level.courses.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(level => level.courses.length > 0) || []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-card border-b px-6 py-12 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">Course Catalog</h1>
            <p className="text-lg text-muted-foreground mb-8">Discover courses tailored for your educational level. From school curriculum to advanced research.</p>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                placeholder="Search courses, topics..." 
                className="pl-10 h-12 rounded-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-16">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          </div>
        ) : filteredLevels.length > 0 ? (
          filteredLevels.map((level, levelIdx) => (
            <motion.div 
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-display font-bold">{level.label}</h2>
                <Badge variant="secondary" className="px-3 py-1 text-sm">{level.courses.length} courses</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {level.courses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (levelIdx * 0.1) + (idx * 0.05) }}
                  >
                    <Link href={`/courses/${course.id}`}>
                      <Card className="h-full flex flex-col overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                        <div className="h-32 relative overflow-hidden">
                          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: course.coverColor }}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-transparent">
                              {course.difficulty}
                            </Badge>
                            {course.isEnrolled && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                <Play size={14} fill="currentColor" />
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.description}</p>
                          
                          <div className="pt-4 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.lessonCount}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {Math.round(course.duration / 60)}h</span>
                            <span className="flex items-center gap-1.5 text-amber-500"><Award size={14} /> {course.xpReward}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
