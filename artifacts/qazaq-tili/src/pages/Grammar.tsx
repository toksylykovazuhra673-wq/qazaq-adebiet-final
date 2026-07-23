import { useState } from "react"
import { useListGrammarRules } from "@workspace/api-client-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookText, ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Grammar() {
  const { data: rules, isLoading } = useListGrammarRules()
  const [activeRuleId, setActiveRuleId] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  // Group rules by topic
  const groupedRules = rules?.reduce((acc, rule) => {
    if (selectedLevel && rule.level !== selectedLevel) return acc;
    if (!acc[rule.topic]) acc[rule.topic] = [];
    acc[rule.topic].push(rule);
    return acc;
  }, {} as Record<string, typeof rules>) || {};

  const levels = Array.from(new Set(rules?.map(r => r.level) || []));

  return (
    <div className="flex-1 overflow-y-auto bg-muted/10 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookText size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold">Grammar Reference</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clear, concise explanations of Kazakh grammar rules with practical examples.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedLevel(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedLevel === null ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border hover:bg-muted'
            }`}
          >
            All Levels
          </button>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedLevel === level ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border hover:bg-muted'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : Object.keys(groupedRules).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedRules).map(([topic, topicRules]) => (
              <div key={topic} className="space-y-4">
                <h2 className="text-2xl font-display font-bold text-primary pl-2 border-l-4 border-primary">{topic}</h2>
                <div className="grid gap-3">
                  {topicRules.map(rule => {
                    const isExpanded = activeRuleId === rule.id;
                    return (
                      <Card 
                        key={rule.id} 
                        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'border-primary/50 shadow-md' : 'hover:border-border/80'}`}
                      >
                        <button 
                          className="w-full p-5 text-left flex items-center justify-between"
                          onClick={() => setActiveRuleId(isExpanded ? null : rule.id)}
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">{rule.level}</Badge>
                            <span className="font-bold text-lg">{rule.title}</span>
                          </div>
                          <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CardContent className="pt-0 border-t">
                                <div className="mt-5 space-y-6">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {rule.description}
                                  </p>
                                  
                                  {rule.examples && rule.examples.length > 0 && (
                                    <div className="bg-muted/50 rounded-xl p-5 space-y-4">
                                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Examples</h4>
                                      <div className="grid gap-3">
                                        {rule.examples.map((ex, i) => (
                                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-background rounded-lg border shadow-sm">
                                            <div className="font-medium text-lg">
                                              {ex.highlight ? (
                                                <span dangerouslySetInnerHTML={{ 
                                                  __html: ex.kazakh.replace(
                                                    ex.highlight, 
                                                    `<span class="text-primary font-bold bg-primary/10 px-1 rounded">${ex.highlight}</span>`
                                                  ) 
                                                }} />
                                              ) : ex.kazakh}
                                            </div>
                                            <div className="text-muted-foreground text-sm">{ex.translation}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No grammar rules found for this level.
          </div>
        )}

      </div>
    </div>
  )
}
