import { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Target,
  FileText,
  ClipboardList,
} from 'lucide-react';

import ubtKtjData from '@/data/ubtKtjData';
import UbtLessonBuilder from './UbtLessonBuilder';
import UbtInteractiveWorksheet from './UbtInteractiveWorksheet';

interface Props {
  onSelectLesson?: (lessonId: number) => void;
}

export default function TchUbtKtj({ onSelectLesson }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);


const [builderLessonId, setBuilderLessonId] = useState<number | null>(null);
const [interactiveLessonId, setInteractiveLessonId] = useState<number | null>(null);
    useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectLesson?.(id);
  };

  const builderLesson = ubtKtjData.find(
    (lesson) => lesson.id === builderLessonId
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <BookOpen size={21} className="text-white" />
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">
              ҰБТ-ға дайындық — 34 сағаттық КТЖ
            </h2>

            <p className="text-gray-500 text-sm">
              Қазақ әдебиеті пәні бойынша күнтізбелік-тақырыптық жоспар
            </p>
          </div>

        </div>

        <div className="mt-4 flex items-center gap-2">

          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            34 сабақ
          </span>

          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs">
            34 сағат
          </span>

        </div>
      </div>


      {/* LESSON LIST */}
      <div className="space-y-3">

        {ubtKtjData.map((lesson) => {

          const selected = selectedId === lesson.id;

          return (
            <div
              key={lesson.id}
              className={`w-full rounded-2xl border overflow-hidden ${
                selected
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/4 border-white/8'
              }`}
            >

              {/* LESSON HEADER */}
              <button
                onClick={() => handleSelect(lesson.id)}
                className="w-full text-left"
              >

                <div className="p-4 flex items-start gap-4">

                  {/* NUMBER */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      selected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/8 text-gray-400'
                    }`}
                  >
                    {lesson.id}
                  </div>


                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">

                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">
                      {lesson.section}
                    </div>

                    <h3 className="text-white font-semibold text-sm leading-relaxed">
                      {lesson.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-2">

                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock size={11} />
                        {lesson.hours} сағат
                      </span>

                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <Target size={11} />
                        ҰБТ
                      </span>

                    </div>

                  </div>


                  <ChevronRight
                    size={17}
                    className={`flex-shrink-0 mt-2 transition-transform ${
                      selected
                        ? 'text-emerald-400 rotate-90'
                        : 'text-gray-600'
                    }`}
                  />

                </div>

              </button>


              {/* SELECTED LESSON */}
              {selected && (
                <div className="border-t border-white/8 px-4 py-4 bg-black/10">

                  <div className="text-xs text-gray-500 mb-1">
                    Оқу мақсаты
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {lesson.objective}
                  </p>


                  <div className="text-xs text-gray-500 mt-4 mb-1">
                    ҰБТ-ға дайындық бағыты
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {lesson.ubtDirection}
                  </p>


                  {/* BUILDER BUTTONS */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBuilderLessonId(lesson.id);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition"
                    >
                      <FileText size={17} />
                      ҚМЖ жасау / өңдеу
                    </button>


                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBuilderLessonId(lesson.id);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition"
                    >
                      <ClipboardList size={17} />
                      Жұмыс дәптерін жасау / өңдеу
                    </button>
                    <button
  onClick={(e) => {
    e.stopPropagation();
    setInteractiveLessonId(lesson.id);
  }}
  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition"
>
  <ClipboardList size={17} />
  Жұмыс дәптерін орындау
</button>

                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>


      {/* BUILDER MODAL
          Бұл блок map-тың сыртында орналасқан.
      */}
      {builderLesson && (
        <UbtLessonBuilder
          lessonId={builderLesson.id}
          lessonTitle={builderLesson.title}
          section={builderLesson.section}
          objective={builderLesson.objective}
          onClose={() => setBuilderLessonId(null)}
        />
      )}
{interactiveLessonId !== null && (
  <UbtInteractiveWorksheet
    lessonId={interactiveLessonId}
    lessonTitle={
      ubtKtjData.find(
        (lesson) => lesson.id === interactiveLessonId
      )?.title
    }
    onClose={() => setInteractiveLessonId(null)}
  />
)}
    </div>
  );
}