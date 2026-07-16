import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function PlaceholderPage() {
  const [location] = useLocation();
  
  let title = 'Бөлім';
  let desc = 'Бұл бөлім жақын арада іске қосылады.';
  
  if (location === '/taldau') {
    title = 'Әдеби талдау';
    desc = 'Шығармаларды тереңірек түсінуге арналған талдаулар, эсселер мен мақалалар бөлімі жақында ашылады.';
  } else if (location === '/oyyndar') {
    title = 'Интерактивті ойындар';
    desc = 'Қазақ әдебиеті бойынша біліміңізді тексеретін қызықты ойындар мен викториналар жақында қолжетімді болады.';
  } else if (location === '/olimpiada') {
    title = 'Олимпиада';
    desc = 'Оқушылар мен студенттерге арналған республикалық әдебиет олимпиадаларының платформасы дайындалуда.';
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="container max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-12 rounded-3xl relative overflow-hidden"
        >
          {/* Decorative glowing orb behind content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-serif text-white mb-4">{title}</h1>
          <h2 className="text-xl text-accent font-medium mb-6">Жақын арада...</h2>
          
          <p className="text-lg text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
            {desc}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Басты бетке қайту</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
