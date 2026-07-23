import { useParams, Link } from "wouter"
import { useGetCourse, useListCourseLessons } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Play, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  Lock, 
  ChevronLeft,
  FileText,
  Headphones,
  Edit3
} from "lucide-react"

export default function CourseDetail() {
  const { courseId } = useParams()
  const id = parseInt(courseId || "0")
  
  const { data: course, isLoading: courseLoading } = useGetCourse(id, { 
    query: { enabled: !!id, queryKey: ['getCourse', id] } 
  })
  
  const { data: lessons, isLoading: lessonsLoading } = useListCourseLessons(id, { 
    query: { enabled: !!id, queryKey: ['listCourseLessons', id] } 
  })

  if (courseLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <Skeleton className="h-[40vh] w-full rounded-none" />
        <div className="max-w-4xl mx-auto p-6 -mt-20">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!course) return <div className="p-10 text-center">Course not found</div>

  const completedCount = lessons?.filter(l => l.isCompleted).length || 0;
  const totalLessons = lessons?.length || 1;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const getLessonIcon = (type: string) => {
    switch(type) {
      case 'theory': return <BookOpen size={18} />;
      case 'practice': return <Edit3 size={18} />;
      case 'listening': return <Headphones size={18} />;
      case 'test': return <FileText size={18} />;
      default: return <BookOpen size={18} />;
    }
  }

  return (
    <div className="flex-1 overflow-y-auto relative bg-muted/10">
      {/* Hero Banner */}
      <div className="relative pt-8 pb-32 px-6 lg:px-12 text-white" style={{ backgroundColor: course.coverColor }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm font-medium transition-colors">
            <ChevronLeft size={16} /> Back to Catalog
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-transparent">{course.level}</Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-transparent">{course.category}</Badge>
            <Badge className="bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border-transparent">{course.difficulty}</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 max-w-3xl">{course.title}</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            {course.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2"><BookOpen size={18} /> {course.lessonCount} Lessons</span>
            <span className="flex items-center gap-2"><Clock size={18} /> {Math.round(course.duration / 60)} Hours</span>
            <span className="flex items-center gap-2 text-amber-300"><Award size={18} /> {course.xpReward} XP Reward</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative -mt-20 z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Syllabus */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-1 shadow-lg">
              <div className="bg-muted rounded-xl p-6 mb-2">
                <h2 className="text-xl font-display font-bold mb-2">Syllabus</h2>
                <div className="flex items-center gap-4 text-sm">
                  <Progress value={progressPercent} className="flex-1 h-2" />
                  <span className="font-bold text-primary">{progressPercent}%</span>
                </div>
              </div>
              
              <div className="px-2 pb-2 space-y-1">
                {lessonsLoading ? (
                  [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
                ) : (
                  lessons?.map((lesson, idx) => {
                    const isLocked = lesson.isLocked && !lesson.isCompleted;
                    return (
                      <Link key={lesson.id} href={isLocked ? '#' : `/lessons/${lesson.id}`}>
                        <div className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                          isLocked 
                            ? 'opacity-60 cursor-not-allowed bg-transparent' 
                            : 'hover:bg-muted cursor-pointer'
                        }`}>
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                            lesson.isCompleted ? 'bg-green-500/10 text-green-500' :
                            isLocked ? 'bg-muted text-muted-foreground' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {lesson.isCompleted ? <CheckCircle2 size={20} /> :
                             isLocked ? <Lock size={18} /> :
                             getLessonIcon(lesson.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base truncate flex items-center gap-2">
                              {idx + 1}. {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mt-1">
                              <span className="uppercase tracking-wider">{lesson.type}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {lesson.duration}m</span>
                            </div>
                          </div>
                          
                          {!isLocked && !lesson.isCompleted && (
                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                              <Play size={16} fill="currentColor" />
                            </Button>
                          )}
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 shadow-lg border-primary/20">
              <div className="p-6 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Play size={40} fill="currentColor" className="ml-1" />
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-1">Ready to learn?</h3>
                  <p className="text-sm text-muted-foreground">Jump right into the material</p>
                </div>
                
                <Button className="w-full h-14 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(0,176,199,0.3)]">
                  {course.isEnrolled ? (completedCount > 0 ? "Continue Learning" : "Start Course") : "Enroll Now"}
                </Button>
                
                <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                  <Award size={14} className="text-amber-500" /> Complete course to earn badge
                </p>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
