import { useState, useRef } from "react"
import { useParams, Link, useLocation } from "wouter"
import { useGetLesson, useSubmitExercise, useSaveProgress } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { X, Check, ArrowRight, Heart, Award, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LessonViewer() {
  const { lessonId } = useParams()
  const id = parseInt(lessonId || "0")
  const [, setLocation] = useLocation()
  
  const { data: lesson, isLoading } = useGetLesson(id, {
    query: { enabled: !!id, queryKey: ['getLesson', id] }
  })

  const submitExercise = useSubmitExercise()
  const saveProgress = useSaveProgress()

  const [phase, setPhase] = useState<'theory' | 'exercises' | 'completed'>('theory')
  const [currentExIndex, setCurrentExIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState(0)

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-6 space-y-6 max-w-3xl mx-auto w-full mt-10">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!lesson) return <div>Lesson not found</div>

  const exercises = lesson.exercises || []
  const currentEx = exercises[currentExIndex]
  const totalSteps = exercises.length + 1 // theory + exercises
  const currentStep = phase === 'theory' ? 1 : phase === 'exercises' ? currentExIndex + 2 : totalSteps
  const progressPercent = (currentStep / totalSteps) * 100

  const handleStartExercises = () => {
    if (exercises.length > 0) {
      setPhase('exercises')
    } else {
      finishLesson(100)
    }
  }

  const handleCheck = () => {
    if (!selectedAnswer || isChecking) return
    setIsChecking(true)
    
    submitExercise.mutate({ exerciseId: currentEx.id, data: { answer: selectedAnswer } }, {
      onSuccess: (res) => {
        setFeedback(res.correct ? 'correct' : 'incorrect')
        if (res.correct) setScore(s => s + 1)
        setIsChecking(false)
      },
      onError: () => setIsChecking(false)
    })
  }

  const handleNext = () => {
    setFeedback(null)
    setSelectedAnswer(null)
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(i => i + 1)
    } else {
      const finalScore = Math.round((score / exercises.length) * 100)
      finishLesson(finalScore)
    }
  }

  const finishLesson = (finalScore: number) => {
    saveProgress.mutate({ data: { lessonId: id, completed: true, score: finalScore } }, {
      onSuccess: () => {
        setPhase('completed')
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Top Header/Progress */}
      <header className="flex items-center gap-4 p-4 lg:px-8 border-b sticky top-0 bg-background/90 backdrop-blur z-10">
        <Link href={`/courses/${lesson.courseId}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X size={24} />
          </Button>
        </Link>
        <div className="flex-1">
          <Progress value={progressPercent} className="h-3 bg-muted" />
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
          <Heart size={20} fill="currentColor" />
          <span>5</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 lg:p-8">
        
        {phase === 'theory' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col pb-24"
          >
            <Badge className="w-fit mb-6 bg-primary/20 text-primary hover:bg-primary/20">{lesson.type.toUpperCase()}</Badge>
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-8">{lesson.title}</h1>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Theory content goes here...</p>' }}
            />
          </motion.div>
        )}

        {phase === 'exercises' && currentEx && (
          <motion.div 
            key={currentEx.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col pb-32"
          >
            <h2 className="text-2xl font-display font-bold mb-8">{currentEx.question}</h2>
            
            {currentEx.type === 'multiple_choice' && (
              <div className="grid gap-3">
                {currentEx.options?.map((opt, i) => (
                  <button
                    key={i}
                    disabled={feedback !== null}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`p-4 rounded-xl border-2 text-left text-lg font-medium transition-all ${
                      selectedAnswer === opt 
                        ? feedback === 'correct' 
                          ? 'border-green-500 bg-green-500/10' 
                          : feedback === 'incorrect'
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {/* Add other exercise types here (fill_blank, match, etc) */}
          </motion.div>
        )}

        {phase === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center pb-24"
          >
            <div className="w-32 h-32 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              <Award size={64} />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Lesson Complete!</h1>
            <p className="text-xl text-muted-foreground mb-8">+ {lesson.xpReward} XP Earned</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
              <div className="bg-card border p-4 rounded-2xl flex flex-col items-center">
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Score</span>
                <span className="text-2xl font-bold">{Math.round((score / Math.max(1, exercises.length)) * 100)}%</span>
              </div>
              <div className="bg-card border p-4 rounded-2xl flex flex-col items-center">
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Correct</span>
                <span className="text-2xl font-bold text-green-500">{score}/{exercises.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 border-t p-4 lg:p-6 transition-colors z-20 ${
        feedback === 'correct' ? 'bg-green-500/10 border-green-500/30' :
        feedback === 'incorrect' ? 'bg-red-500/10 border-red-500/30' :
        'bg-background'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          <div className="flex-1">
            {feedback === 'correct' && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                <div className="bg-green-500 text-white rounded-full p-1"><Check size={20} /></div>
                Excellent!
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                <div className="bg-red-500 text-white rounded-full p-1"><X size={20} /></div>
                Not quite right.
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto">
            {phase === 'theory' && (
              <Button size="lg" className="w-full sm:w-auto rounded-full font-bold text-base px-8" onClick={handleStartExercises}>
                Continue <ArrowRight size={20} className="ml-2" />
              </Button>
            )}
            {phase === 'exercises' && feedback === null && (
              <Button 
                size="lg" 
                className="w-full sm:w-auto rounded-full font-bold text-base px-10" 
                disabled={!selectedAnswer || isChecking} 
                onClick={handleCheck}
              >
                Check
              </Button>
            )}
            {phase === 'exercises' && feedback !== null && (
              <Button 
                size="lg" 
                className={`w-full sm:w-auto rounded-full font-bold text-base px-10 ${
                  feedback === 'correct' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                }`} 
                onClick={handleNext}
              >
                Continue
              </Button>
            )}
            {phase === 'completed' && (
              <Link href={`/courses/${lesson.courseId}`}>
                <Button size="lg" className="w-full sm:w-auto rounded-full font-bold text-base px-10">
                  Back to Course
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
