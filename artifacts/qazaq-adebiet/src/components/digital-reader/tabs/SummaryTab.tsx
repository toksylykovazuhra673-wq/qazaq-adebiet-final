import { motion } from 'framer-motion';
import { AlignLeft, Lightbulb, Layers, Paintbrush, Tag } from 'lucide-react';
import type { Book } from '@/types/book';

interface Props { book: Book; }

export default function SummaryTab({ book }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-4">
      <Card icon={<AlignLeft size={18} className="text-violet-400" />} title="Қысқаша мазмұны" delay={0}>
        <p className="text-gray-300 leading-relaxed">{book.summary}</p>
      </Card>

      <Card icon={<Lightbulb size={18} className="text-amber-400" />} title="Тақырыбы" delay={0.07}>
        <p className="text-gray-300 leading-relaxed">{book.theme}</p>
      </Card>

      <Card icon={<Lightbulb size={18} className="text-green-400" />} title="Идеясы" delay={0.12}>
        <p className="text-gray-300 leading-relaxed">{book.idea}</p>
      </Card>

      <Card icon={<Layers size={18} className="text-blue-400" />} title="Композициясы" delay={0.17}>
        <p className="text-gray-300 leading-relaxed">{book.composition}</p>
      </Card>

      {book.literaryDevices.length > 0 && (
        <Card icon={<Paintbrush size={18} className="text-rose-400" />} title="Көркемдегіш тәсілдері" delay={0.22}>
          <div className="flex flex-wrap gap-2">
            {book.literaryDevices.map(d => (
              <span key={d} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                {d}
              </span>
            ))}
          </div>
        </Card>
      )}

      {book.tags.length > 0 && (
        <Card icon={<Tag size={18} className="text-gray-400" />} title="Тегтер" delay={0.27}>
          <div className="flex flex-wrap gap-2">
            {book.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                #{t}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ icon, title, children, delay }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/4 border border-white/8 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
