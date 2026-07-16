import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}

export default function AccordionSection({
  id,
  title,
  icon,
  badge,
  children,
  defaultOpen = false,
  accentColor = 'from-violet-500 to-purple-600',
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      id={id}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors group"
      >
        {/* icon bubble */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
        >
          {icon}
        </div>

        <span className="flex-1 text-white font-semibold text-lg leading-tight">
          {title}
        </span>

        {badge !== undefined && (
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-sm font-medium">
            {badge}
          </span>
        )}

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
