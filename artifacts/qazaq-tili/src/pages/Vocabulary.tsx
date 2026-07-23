import { useState } from "react"
import { useListVocabulary, useListVocabCategories } from "@workspace/api-client-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Volume2, Sparkles, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Vocabulary() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  const { data: categories, isLoading: catLoading } = useListVocabCategories()
  const { data: words, isLoading: wordsLoading } = useListVocabulary({ search, category: activeCategory || undefined })

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-8 bg-card relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between md:items-end">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Vocabulary Bank</h1>
              <p className="text-muted-foreground">Master words with spaced repetition.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search words..." 
                className="pl-10 h-12 rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar / Categories */}
        <div className="w-full lg:w-64 border-r bg-card/50 overflow-y-auto p-4 shrink-0 flex lg:flex-col gap-2 no-scrollbar">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 hidden lg:block px-2">Categories</div>
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              activeCategory === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <span>All Words</span>
          </button>
          
          {catLoading ? (
            [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)
          ) : (
            categories?.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors shrink-0 ${
                  activeCategory === cat.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {cat.color && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>}
                  {cat.label}
                </div>
                <span className={`text-xs ${activeCategory === cat.name ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {cat.count}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Main Content - Flashcards Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          {wordsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          ) : words?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
              <AnimatePresence>
                {words.map(word => (
                  <Flashcard key={word.id} word={word} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Filter size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No words found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Flashcard({ word }: { word: any }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="perspective-1000 w-full h-64 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front - Kazakh */}
        <div className="absolute inset-0 backface-hidden bg-card border shadow-sm rounded-3xl p-6 flex flex-col items-center justify-center text-center group-hover:border-primary/30 group-hover:shadow-md transition-all">
          <Badge variant="outline" className="absolute top-4 left-4">{word.level}</Badge>
          {word.audioUrl && (
            <button 
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary bg-muted rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); /* Play audio */ }}
            >
              <Volume2 size={16} />
            </button>
          )}
          
          <h2 className="text-4xl font-display font-bold mb-4 text-primary">{word.kazakh}</h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles size={14} /> Tap to flip
          </p>
        </div>

        {/* Back - Translation */}
        <div className="absolute inset-0 backface-hidden bg-primary text-primary-foreground border-primary shadow-lg rounded-3xl p-6 flex flex-col justify-center rotate-y-180">
          <h3 className="text-2xl font-bold mb-1">{word.russian}</h3>
          {word.english && <p className="text-primary-foreground/80 font-medium mb-4">{word.english}</p>}
          
          {word.examples && word.examples.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary-foreground/20 text-sm text-left">
              <p className="opacity-80 italic">"{word.examples[0]}"</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
