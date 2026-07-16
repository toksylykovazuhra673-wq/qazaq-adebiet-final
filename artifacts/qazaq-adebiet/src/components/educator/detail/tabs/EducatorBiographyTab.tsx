import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, FlaskConical, Tag } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorBiographyTab({ educator: e }: { educator: Educator }) {
  const [expanded, setExpanded] = useState(false);

  const paragraphs = e.biography.split('\n\n').filter(Boolean);
  const preview = paragraphs.slice(0, 3);
  const rest = paragraphs.slice(3);

  return (
    <div className="space-y-8">
      {/* Meta cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 flex items-start gap-3">
          <User className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Туған жылы</p>
            <p className="text-sm text-white font-medium">{e.birthDate}</p>
            <p className="text-xs text-white/50 mt-0.5">{e.birthPlace}</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Дүние салды</p>
            <p className="text-sm text-white font-medium">{e.deathDate ?? 'Белгісіз'}</p>
            {e.deathPlace && <p className="text-xs text-white/50 mt-0.5">{e.deathPlace}</p>}
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Ғылым саласы</p>
            <p className="text-sm text-white font-medium">{e.scientificField}</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-violet-300 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Əдеби сала</p>
            <p className="text-sm text-white font-medium">{e.literaryField}</p>
          </div>
        </div>
      </div>

      {/* Biography text */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-serif text-white font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-violet-500 rounded-full block" />
          Өмірбаяны
        </h2>
        <div className="space-y-5 text-white/80 leading-relaxed text-base">
          {preview.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              {p}
            </motion.p>
          ))}

          {rest.length > 0 && (
            <>
              <motion.div
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                initial={false}
                className="overflow-hidden"
              >
                <div className="space-y-5">
                  {rest.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                {expanded ? '▲ Жасыру' : '▼ Толығырақ оқу'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Professions */}
      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Мамандықтары</h3>
        <div className="flex flex-wrap gap-2">
          {e.profession.map((p) => (
            <span key={p} className="px-3 py-1.5 bg-violet-500/15 border border-violet-500/25 rounded-full text-sm text-violet-300">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {e.tags.length > 0 && (
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Тегтер
          </h3>
          <div className="flex flex-wrap gap-2">
            {e.tags.map((t) => (
              <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
