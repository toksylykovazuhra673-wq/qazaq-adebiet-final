import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Headphones,
  Users,
  AlignLeft,
  Sparkles,
  Bookmark,
  NotebookPen,
  Video,
} from "lucide-react";

import type { ReaderTab } from "@/types/book";
import type { Book } from "@/types/book";

const TABS: {
  id: ReaderTab;
  label: string;
  icon: React.ReactNode;
  check?: (b: Book) => boolean;
}[] = [
  {
    id: "text",
    label: "Мәтін",
    icon: <BookOpen size={15} />,
  },
  {
    id: "pdf",
    label: "PDF",
    icon: <FileText size={15} />,
  },
  {
    id: "video",
    label: "Видео",
    icon: <Video size={15} />,
  },
  {
    id: "audio",
    label: "Аудио",
    icon: <Headphones size={15} />,
  },
  {
    id: "characters",
    label: "Кейіпкерлер",
    icon: <Users size={15} />,
  },
  {
    id: "summary",
    label: "Мазмұны",
    icon: <AlignLeft size={15} />,
  },
  {
    id: "facts",
    label: "Деректер",
    icon: <Sparkles size={15} />,
  },
  {
    id: "bookmarks",
    label: "Белгілер",
    icon: <Bookmark size={15} />,
  },
  {
    id: "notes",
    label: "Жазбалар",
    icon: <NotebookPen size={15} />,
  },
];

interface Props {
  active: ReaderTab;
  onChange: (tab: ReaderTab) => void;
  book: Book;
  bookmarkCount: number;
  noteCount: number;
}

export default function DRTabBar({
  active,
  onChange,
  book,
  bookmarkCount,
  noteCount,
}: Props) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm transition-colors ${
              isActive
                ? "text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-reader-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-500"
              />
            )}

            {tab.icon}
            <span>{tab.label}</span>

            {tab.id === "bookmarks" && bookmarkCount > 0 && (
              <span className="rounded-full bg-violet-500/20 px-1.5 text-xs text-violet-300">
                {bookmarkCount}
              </span>
            )}

            {tab.id === "notes" && noteCount > 0 && (
              <span className="rounded-full bg-violet-500/20 px-1.5 text-xs text-violet-300">
                {noteCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}