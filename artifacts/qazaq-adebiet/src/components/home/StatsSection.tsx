import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, FileCheck, Gamepad2 } from 'lucide-react';
import statsData from '@/data/stats.json';

// Utility for animating numbers
function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(String(value).replace(/,/g, ""));
    if (start === end) return;
    
    const incrementTime = (duration * 1000) / end;
    
    // Smooth step approach for larger numbers
    let current = 0;
    const stepTime = Math.max(incrementTime, 20); // ms per frame
    const steps = (duration * 1000) / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.ceil(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection() {
  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Авторлар", value: statsData.authors },
    { icon: <BookOpen className="w-6 h-6" />, label: "Шығармалар", value: statsData.works },
    { icon: <FileCheck className="w-6 h-6" />, label: "Тесттер", value: statsData.tests },
    { icon: <Gamepad2 className="w-6 h-6" />, label: "Ойындар", value: statsData.games },
  ];

  return (
    <section className="py-12 relative z-10 -mt-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 text-center border-t-2 border-t-primary/20"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-primary mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
                <Counter value={stat.value} />+
              </h3>
              <p className="text-violet-200 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
