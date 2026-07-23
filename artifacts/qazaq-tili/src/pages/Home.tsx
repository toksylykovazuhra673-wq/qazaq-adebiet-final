import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, type Variants } from "framer-motion"
import { useGetPlatformStats, useListFeaturedCourses } from "@workspace/api-client-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Users, BookOpen, GraduationCap, ChevronRight, Award } from "lucide-react"

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats()
  const { data: featuredCourses, isLoading: featuredLoading } = useListFeaturedCourses()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>
        
        <motion.div 
          className="z-10 max-w-4xl mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/10 px-4 py-1.5 text-sm rounded-full">
            Жаңа буын оқу платформасы
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Kazakh Language</span> with purpose.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
            A premium digital education platform for students, teachers, and professionals. From grade 1 to research level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto gap-2 rounded-full text-base font-semibold shadow-[0_0_30px_rgba(0,176,199,0.3)]">
                Start Learning <Play size={18} fill="currentColor" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base font-semibold bg-background/50 backdrop-blur-sm">
                Explore Courses
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          className="z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-y border-border/50 py-8 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { icon: Users, label: "Active Learners", value: stats?.activeLearners.toLocaleString() || "10K+", loading: statsLoading },
            { icon: BookOpen, label: "Interactive Lessons", value: stats?.totalLessons.toLocaleString() || "1.2K+", loading: statsLoading },
            { icon: GraduationCap, label: "Premium Courses", value: stats?.totalCourses.toLocaleString() || "45+", loading: statsLoading },
            { icon: Award, label: "Vocabulary Words", value: stats?.totalWords.toLocaleString() || "15K+", loading: statsLoading },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <stat.icon size={24} />
              </div>
              {stat.loading ? (
                <Skeleton className="h-8 w-20 mb-1" />
              ) : (
                <span className="text-3xl font-display font-bold">{stat.value}</span>
              )}
              <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Courses */}
      <section className="px-6 py-20 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">Featured Courses</h2>
              <p className="text-muted-foreground max-w-xl text-lg">Hand-crafted curriculum designed by top educators.</p>
            </div>
            <Link href="/courses" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
              View all courses <ChevronRight size={18} />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 w-full rounded-3xl" />)}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredCourses?.slice(0, 3).map(course => (
                <motion.div key={course.id} variants={itemVariants}>
                  <Link href={`/courses/${course.id}`} className="block group">
                    <div className="relative h-72 rounded-3xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundColor: course.coverColor }}></div>
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">{course.level}</Badge>
                        <Badge className="bg-primary/20 text-primary border-primary/20 shadow-none">{course.difficulty}</Badge>
                      </div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/40 to-transparent">
                        <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span className="flex items-center gap-1.5 text-muted-foreground"><BookOpen size={16} /> {course.lessonCount} lessons</span>
                          <span className="flex items-center gap-1.5 text-amber-500"><Award size={16} /> {course.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
