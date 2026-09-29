import { useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, GripVertical } from 'lucide-react';

interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface WorksheetTask {
  id: number;
  type: 'test' | 'matching' | 'text' | 'open';
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  matchingPairs?: MatchingPair[];
}

interface Props {
  lessonId: number;
  lessonTitle?: string;
  onClose?: () => void;
}

export default function UbtInteractiveWorksheet({
  lessonId,
  lessonTitle,
  onClose,
}: Props) {
  const [tasks, setTasks] = useState<WorksheetTask[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [matchingAnswers, setMatchingAnswers] = useState<
    Record<number, Record<string, string>>
  >({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`ubt-worksheet-${lessonId}`);

    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        console.error('Жұмыс дәптерін оқу қатесі');
      }
    }
  }, [lessonId]);

  const selectAnswer = (taskId: number, answer: string) => {
    if (checked) return;

    setAnswers((prev) => ({
      ...prev,
      [taskId]: answer,
    }));
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    value: string
  ) => {
    event.dataTransfer.setData('text/plain', value);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    taskId: number,
    pairId: string
  ) => {
    event.preventDefault();

    if (checked) return;

    const value = event.dataTransfer.getData('text/plain');

    setMatchingAnswers((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [pairId]: value,
      },
    }));
  };

  const checkAnswers = () => {
    let total = 0;

    tasks.forEach((task) => {
      if (task.type === 'test') {
        if (answers[task.id] === task.correctAnswer) {
          total += task.points || 1;
        }
      }

      if (task.type === 'matching' && task.matchingPairs) {
        const taskAnswers = matchingAnswers[task.id] || {};

        task.matchingPairs.forEach((pair) => {
          if (taskAnswers[pair.id] === pair.right) {
            total += task.points || 1;
          }
        });
      }
    });

    setScore(total);
    setChecked(true);
  };

  const resetWorksheet = () => {
    setAnswers({});
    setMatchingAnswers({});
    setChecked(false);
    setScore(0);
  };

  const maxScore = tasks.reduce((sum, task) => {
    if (task.type === 'matching' && task.matchingPairs) {
      return sum + task.matchingPairs.length * (task.points || 1);
    }

    return sum + (task.points || 1);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] text-white shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111827] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">
              📝 {lessonTitle || 'Жұмыс дәптері'}
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Интерактивті тапсырмаларды орындаңыз
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-6 p-6">

          {tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/20 p-10 text-center text-white/50">
              Бұл жұмыс дәптерінде әзірге тапсырма жоқ.
            </div>
          )}

          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              {/* Question */}
              <div className="mb-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {index + 1}-тапсырма
                </div>

                <h3 className="text-base font-semibold leading-relaxed">
                  {task.question}
                </h3>

                <div className="mt-1 text-xs text-white/40">
                  {task.points || 1} ұпай
                </div>
              </div>

              {/* TEST */}
              {task.type === 'test' && (
                <div className="space-y-2">
                  {task.options.map((option, optionIndex) => {
                    const letter = String.fromCharCode(65 + optionIndex);
                    const selected = answers[task.id] === option;

                    let buttonClass =
                      'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]';

                    if (selected) {
                      buttonClass =
                        'border-emerald-400 bg-emerald-400/10';
                    }

                    if (checked && option === task.correctAnswer) {
                      buttonClass =
                        'border-emerald-400 bg-emerald-400/20';
                    }

                    if (
                      checked &&
                      selected &&
                      option !== task.correctAnswer
                    ) {
                      buttonClass =
                        'border-red-400 bg-red-400/10';
                    }

                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={checked}
                        onClick={() =>
                          selectAnswer(task.id, option)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${buttonClass}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                          {letter}
                        </span>

                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MATCHING */}
              {task.type === 'matching' && (
                <div className="space-y-4">
                  {!task.matchingPairs ||
                  task.matchingPairs.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/20 p-5 text-center text-sm text-white/40">
                      Сәйкестендіру жұптары енгізілмеген.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl bg-white/[0.03] p-4">
                        <p className="mb-3 text-sm text-white/60">
                          Сол жақтағы элементті тышқанмен ұстап,
                          оң жақтағы ұяшыққа сүйреп апарыңыз.
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                          
                          {/* LEFT */}
                          <div className="space-y-2">
                            <div className="mb-2 text-sm font-semibold text-emerald-400">
                              Элементтер
                            </div>

                            {task.matchingPairs.map((pair) => (
                              <div
                                key={`left-${pair.id}`}
                                draggable={!checked}
                                onDragStart={(event) =>
                                  handleDragStart(event, pair.left)
                                }
                                className="flex cursor-grab items-center gap-2 rounded-xl border border-white/10 bg-[#1f2937] p-3 active:cursor-grabbing"
                              >
                                <GripVertical
                                  size={18}
                                  className="text-white/40"
                                />

                                <span>{pair.left}</span>
                              </div>
                            ))}
                          </div>

                          {/* RIGHT */}
                          <div className="space-y-2">
                            <div className="mb-2 text-sm font-semibold text-blue-400">
                              Сәйкестендіру орны
                            </div>

                            {task.matchingPairs.map((pair) => {
                              const current =
                                matchingAnswers[task.id]?.[pair.id];

const isCorrect =
  checked &&
  current !== pair.left

                              const isWrong =
                                checked &&
                                current &&
                                current !== pair.right;

                              return (
                                <div
                                  key={`right-${pair.id}`}
                                  onDragOver={(event) =>
                                    event.preventDefault()
                                  }
                                  onDrop={(event) =>
                                    handleDrop(
                                      event,
                                      task.id,
                                      pair.id
                                    )
                                  }
                                  className={`min-h-[52px] rounded-xl border p-3 transition ${
                                    isCorrect
                                      ? 'border-emerald-400 bg-emerald-400/10'
                                      : isWrong
                                      ? 'border-red-400 bg-red-400/10'
                                      : 'border-dashed border-white/20 bg-white/[0.02]'
                                  }`}
                                >
                                  <div className="text-xs text-white/40">
                                    Жауап:
                                  </div>

                                  <div className="mt-1 font-medium">
                                    {current || 'Мұнда сүйреп апарыңыз'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TEXT / OPEN */}
              {(task.type === 'text' || task.type === 'open') && (
                <textarea
                  disabled={checked}
                  placeholder="Жауабыңызды жазыңыз..."
                  value={answers[task.id] || ''}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [task.id]: event.target.value,
                    }))
                  }
                  className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-white/30 focus:border-emerald-400"
                />
              )}
            </div>
          ))}

          {/* RESULT */}
          {checked && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
              <CheckCircle2
                className="mx-auto mb-3 text-emerald-400"
                size={42}
              />

              <div className="text-2xl font-bold">
                Нәтиже: {score} / {maxScore}
              </div>

              <p className="mt-2 text-sm text-white/60">
                Тапсырмаларды орындау аяқталды.
              </p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 border-t border-white/10 pt-5">
            {!checked ? (
              <button
                onClick={checkAnswers}
                disabled={tasks.length === 0}
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ✓ Жауаптарды тексеру
              </button>
            ) : (
              <button
                onClick={resetWorksheet}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
              >
                <RotateCcw size={18} />
                Қайта орындау
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}