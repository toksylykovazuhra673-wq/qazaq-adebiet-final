import { useEffect, useState } from 'react';
import {
  FileText,
  ClipboardList,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';

interface LessonBuilderProps {
  lessonId: number;
  lessonTitle: string;
  section: string;
  objective: string;
  onClose: () => void;
}

interface QmjData {
  topic: string;
  objective: string;
  lessonObjective: string;
  criteria: string;
  values: string;
  resources: string;
  lessonStart: string;
  lessonMiddle: string;
  lessonEnd: string;
  teacherAction: string;
  studentAction: string;
  descriptors: string;
  assessment: string;
  differentiation: string;
  reflection: string;
  homework: string;
}

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

const emptyQmj: QmjData = {
  topic: '',
  objective: '',
  lessonObjective: '',
  criteria: '',
  values: '',
  resources: '',
  lessonStart: '',
  lessonMiddle: '',
  lessonEnd: '',
  teacherAction: '',
  studentAction: '',
  descriptors: '',
  assessment: '',
  differentiation: '',
  reflection: '',
  homework: '',
};

export default function UbtLessonBuilder({
  lessonId,
  lessonTitle,
  section,
  objective,
  onClose,
}: LessonBuilderProps) {
  const [activeMode, setActiveMode] = useState<'qmj' | 'worksheet'>('qmj');

  const [qmj, setQmj] = useState<QmjData>({
    ...emptyQmj,
    topic: lessonTitle,
    objective,
  });

  const [tasks, setTasks] = useState<WorksheetTask[]>([]);
  useEffect(() => {
  const savedQmj = localStorage.getItem(`ubt-qmj-${lessonId}`);
  const savedWorksheet = localStorage.getItem(
    `ubt-worksheet-${lessonId}`
  );

  if (savedQmj) {
    try {
      setQmj(JSON.parse(savedQmj));
    } catch {
      console.error('ҚМЖ дерегін оқу қатесі');
    }
  }

  if (savedWorksheet) {
    try {
      setTasks(JSON.parse(savedWorksheet));
    } catch {
      console.error('Жұмыс дәптері дерегін оқу қатесі');
    }
  }
}, [lessonId]);

  const updateQmj = (field: keyof QmjData, value: string) => {
    setQmj((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTask = (type: WorksheetTask['type']) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        question: '',
        options:
          type === 'test'
            ? ['', '', '', '']
            : [],
        correctAnswer: '',
        points: 1,
        

matchingPairs: type === 'matching' ? [] : undefined,
      },
    ]);
  };

  const updateTask = (
    id: number,
    field: keyof WorksheetTask,
    value: string | number | string[]
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              [field]: value,
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const saveQmj = () => {
    localStorage.setItem(
      `ubt-qmj-${lessonId}`,
      JSON.stringify(qmj)
    );

    alert('ҚМЖ сақталды');
  };

  const saveWorksheet = () => {
    localStorage.setItem(
      `ubt-worksheet-${lessonId}`,
      JSON.stringify(tasks)
    );

    alert('Жұмыс дәптері сақталды');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">

      <div className="max-w-6xl mx-auto bg-[#111827] rounded-2xl border border-white/10 overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">

          <div>
            <div className="text-xs text-emerald-400 mb-1">
              {section}
            </div>

            <h2 className="text-white font-bold text-lg">
              {lessonId}-тақырып. {lessonTitle}
            </h2>

            <p className="text-gray-500 text-xs mt-1">
              Мұғалімнің жеке ҚМЖ және жұмыс дәптері конструкторы
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
          >
            <X size={20} />
          </button>

        </div>

        {/* TABS */}
        <div className="flex gap-2 p-4 border-b border-white/10">

          <button
            onClick={() => setActiveMode('qmj')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
              activeMode === 'qmj'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            <FileText size={17} />
            ҚМЖ конструкторы
          </button>

          <button
            onClick={() => setActiveMode('worksheet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
              activeMode === 'worksheet'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            <ClipboardList size={17} />
            Жұмыс дәптері
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-5">

          {activeMode === 'qmj' && (
            <div className="space-y-5">

              <BuilderField
                label="Сабақ тақырыбы"
                value={qmj.topic}
                onChange={(v) => updateQmj('topic', v)}
              />

              <BuilderField
                label="Оқу мақсаты"
                value={qmj.objective}
                onChange={(v) => updateQmj('objective', v)}
                textarea
              />

              <BuilderField
                label="Сабақ мақсаты"
                value={qmj.lessonObjective}
                onChange={(v) =>
                  updateQmj('lessonObjective', v)
                }
                textarea
              />

              <BuilderField
                label="Бағалау критерийлері"
                value={qmj.criteria}
                onChange={(v) =>
                  updateQmj('criteria', v)
                }
                textarea
              />

              <BuilderField
                label="Құндылықтар"
                value={qmj.values}
                onChange={(v) =>
                  updateQmj('values', v)
                }
                textarea
              />

              <BuilderField
                label="Ресурстар"
                value={qmj.resources}
                onChange={(v) =>
                  updateQmj('resources', v)
                }
                textarea
              />

              <div className="grid md:grid-cols-2 gap-4">

                <BuilderField
                  label="Сабақтың басы"
                  value={qmj.lessonStart}
                  onChange={(v) =>
                    updateQmj('lessonStart', v)
                  }
                  textarea
                />

                <BuilderField
                  label="Сабақтың ортасы"
                  value={qmj.lessonMiddle}
                  onChange={(v) =>
                    updateQmj('lessonMiddle', v)
                  }
                  textarea
                />

              </div>

              <BuilderField
                label="Сабақтың соңы"
                value={qmj.lessonEnd}
                onChange={(v) =>
                  updateQmj('lessonEnd', v)
                }
                textarea
              />

              <BuilderField
                label="Мұғалім әрекеті"
                value={qmj.teacherAction}
                onChange={(v) =>
                  updateQmj('teacherAction', v)
                }
                textarea
              />

              <BuilderField
                label="Оқушы әрекеті"
                value={qmj.studentAction}
                onChange={(v) =>
                  updateQmj('studentAction', v)
                }
                textarea
              />

              <BuilderField
                label="Дескрипторлар"
                value={qmj.descriptors}
                onChange={(v) =>
                  updateQmj('descriptors', v)
                }
                textarea
              />

              <BuilderField
                label="Бағалау"
                value={qmj.assessment}
                onChange={(v) =>
                  updateQmj('assessment', v)
                }
                textarea
              />

              <BuilderField
                label="Саралау"
                value={qmj.differentiation}
                onChange={(v) =>
                  updateQmj('differentiation', v)
                }
                textarea
              />

              <BuilderField
                label="Рефлексия"
                value={qmj.reflection}
                onChange={(v) =>
                  updateQmj('reflection', v)
                }
                textarea
              />

              <BuilderField
                label="Үй тапсырмасы"
                value={qmj.homework}
                onChange={(v) =>
                  updateQmj('homework', v)
                }
                textarea
              />

              <div className="flex justify-end pt-4">

                <button
                  onClick={saveQmj}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  <Save size={17} />
                  ҚМЖ-ны сақтау
                </button>

              </div>

            </div>
          )}

          {activeMode === 'worksheet' && (
            <div className="space-y-5">

              {/* ADD TASKS */}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <h3 className="text-white font-semibold mb-3">
                  Тапсырма қосу
                </h3>

                <div className="flex flex-wrap gap-2">

                  <AddTaskButton
                    label="Тест"
                    onClick={() => addTask('test')}
                  />

                  <AddTaskButton
                    label="Сәйкестендіру"
                    onClick={() => addTask('matching')}
                  />

                  <AddTaskButton
                    label="Мәтінмен жұмыс"
                    onClick={() => addTask('text')}
                  />

                  <AddTaskButton
                    label="Ашық жауап"
                    onClick={() => addTask('open')}
                  />

                </div>

              </div>

              {/* TASK LIST */}

              {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Әзірге тапсырма қосылған жоқ.
                  <br />
                  Жоғарыдағы батырмалар арқылы тапсырма қосыңыз.
                </div>
              )}

              {tasks.map((task, index) => (
                <TaskEditor
                  key={task.id}
                  task={task}
                  index={index}
                  onChange={updateTask}
                  onDelete={deleteTask}
                />
              ))}

              {tasks.length > 0 && (
                <div className="flex justify-end pt-4">

                  <button
                    onClick={saveWorksheet}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  >
                    <Save size={17} />
                    Жұмыс дәптерін сақтау
                  </button>

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* FIELD */

function BuilderField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-200 p-3 outline-none focus:border-emerald-500/50"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-200 p-3 outline-none focus:border-emerald-500/50"
        />
      )}
    </div>
  );
}

/* ADD TASK BUTTON */

function AddTaskButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

/* TASK EDITOR */

function TaskEditor({
  task,
  index,
  onChange,
  onDelete,
}: {
  task: WorksheetTask;
  index: number;
  onChange: (
    id: number,
    field: keyof WorksheetTask,
    value: string | number | string[]
  ) => void;
  onDelete: (id: number) => void;
}) {
  const typeName = {
    test: 'ҰБТ тесті',
    matching: 'Сәйкестендіру',
    text: 'Мәтінмен жұмыс',
    open: 'Ашық жауап',
  }[task.type];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-center justify-between mb-4">

        <div>
          <span className="text-emerald-400 text-xs">
            {index + 1}-тапсырма
          </span>

          <h3 className="text-white font-semibold">
            {typeName}
          </h3>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
        >
          <Trash2 size={17} />
        </button>

      </div>

      <textarea
        value={task.question}
        onChange={(e) =>
          onChange(
            task.id,
            'question',
            e.target.value
          )
        }
        placeholder="Тапсырманың мәтінін енгізіңіз..."
        rows={4}
        className="w-full rounded-xl bg-black/20 border border-white/10 text-gray-200 p-3 mb-4 outline-none"
      />

      {task.type === 'test' && (
        <div className="space-y-2">

          <p className="text-xs text-gray-500">
            Жауап нұсқалары
          </p>

          {task.options.map((option, i) => (
            <input
              key={i}
              value={option}
              onChange={(e) => {
                const options = [...task.options];
                options[i] = e.target.value;

                onChange(
                  task.id,
                  'options',
                  options
                );
              }}
              placeholder={`${String.fromCharCode(65 + i)}) Жауап`}
              className="w-full rounded-xl bg-black/20 border border-white/10 text-gray-200 p-3"
            />
          ))}

          <input
            value={task.correctAnswer}
            onChange={(e) =>
              onChange(
                task.id,
                'correctAnswer',
                e.target.value
              )
            }
            placeholder="Дұрыс жауап: A, B, C немесе D"
            className="w-full rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-gray-200 p-3"
          />

        </div>
      )}

      
          
        

      <div className="mt-4 flex items-center gap-3">

        <label className="text-sm text-gray-400">
          Ұпай:
        </label>

        <input
          type="number"
          min={1}
          value={task.points}
          onChange={(e) =>
            onChange(
              task.id,
              'points',
              Number(e.target.value)
            )
          }
          className="w-20 rounded-lg bg-black/20 border border-white/10 text-white p-2"
        />

      </div>

    </div>
  );
}