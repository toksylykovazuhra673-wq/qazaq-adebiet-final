import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Assignment {
  id: string;
  class_id: string;
  title: string;
  type: string;
  book_slug: string | null;
  analysis_slug: string | null;
  due_date: string | null;
  points: number;
  instructions: string | null;
  status: string;
  created_at: string;
}

interface CabAssignmentsProps {
  classId: string;
}

export default function CabAssignments({ classId }: CabAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

const [studentName, setStudentName] = useState('');
const [answer, setAnswer] = useState('');
const [submitting, setSubmitting] = useState(false);
const [success, setSuccess] = useState('');
const [mySubmissions, setMySubmissions] = useState<any[]>([]);

useEffect(() => {
  async function loadStudentName() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      '';

    if (name) {
      setStudentName(name);
    }
  }

  loadStudentName();
}, []);

  useEffect(() => {
    async function loadAssignments() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('status', 'active')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Assignments error:', error);
        setError('Тапсырмаларды жүктеу кезінде қате пайда болды.');
      } else {
        setAssignments(data ?? []);
      }

      setLoading(false);
    }

    if (classId) {
      loadAssignments();
    } else {
      setAssignments([]);
      setLoading(false);
    }
  }, [classId]);
 useEffect(() => {
  async function loadMySubmissions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Student submissions error:', error);
      return;
    }

    setMySubmissions(data ?? []);
  }

  loadMySubmissions();
}, []);

  async function submitAssignment() {
    if (!selectedAssignment) return;

    if (!studentName.trim()) {
      setError('Алдымен аты-жөніңізді жазыңыз.');
      return;
    }

    if (!answer.trim()) {
      setError('Жауабыңызды жазыңыз.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setError('Оқушы аккаунты анықталмады.');
  setSubmitting(false);
  return;
}

const { error } = await supabase
  .from('assignment_submissions')
  .insert({
    assignment_id: selectedAssignment.id,
    student_id: user.id,
    student_name: studentName.trim(),
    answer_text: answer.trim(),
    status: 'submitted',
  });

    if (error) {
      console.error('Submission error:', error);
      setError('Жауапты жіберу кезінде қате пайда болды.');
      setSubmitting(false);
      return;
    }

    setSuccess('Жауабыңыз мұғалімге сәтті жіберілді!');

    setAnswer('');
    setSelectedAssignment(null);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          Тапсырмалар жүктелуде...
        </p>
      </div>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Мұғалімнің тапсырмалары
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Мұғалім жіберген тапсырмаларды орындап,
          жауабыңызды мұғалімге жібере аласыз.
        </p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-green-700 font-medium">
            ✅ {success}
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* ASSIGNMENTS */}
      {assignments.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">📚</div>

          <h3 className="mt-3 text-lg font-semibold text-gray-700">
            Әзірге тапсырма жоқ
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Мұғалім тапсырма жіберген кезде осы жерде пайда болады.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">

          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {assignment.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Түрі: {assignment.type}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  {assignment.points} балл
                </span>

              </div>

              {/* INSTRUCTIONS */}
              {assignment.instructions && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Тапсырма:
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {assignment.instructions}
                  </p>
                </div>
              )}

              {/* DUE DATE */}
              {assignment.due_date && (
                <p className="mt-4 text-sm text-orange-600">
                  📅 Соңғы мерзім: {assignment.due_date}
                </p>
              )}

              {/* RESULT */}
{(() => {
 const mySubmission =
  mySubmissions.find(
    (submission) =>
      submission.assignment_id === assignment.id &&
      submission.status === 'graded'
  ) ||
  mySubmissions.find(
    (submission) =>
      submission.assignment_id === assignment.id
  );

  if (!mySubmission) return null;

  if (mySubmission.status === 'graded') {
    return (
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-gray-500 text-xs mb-1">
            Ұпай
          </p>

          <p className="text-blue-400 text-2xl font-bold">
            {mySubmission.score}/10
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
          <p className="text-gray-500 text-xs mb-1">
            Баға
          </p>

          <p className="text-green-400 text-2xl font-bold">
            {mySubmission.grade}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
      <p className="text-yellow-600 font-semibold">
        ⏳ Жауабыңыз жіберілді. Мұғалім тексеруде.
      </p>
    </div>
  );
})()}

{/* START BUTTON */}
<button
  onClick={() => {
    setSelectedAssignment(assignment);
    setError('');
    setSuccess('');
  }}
  className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
>
  ✏️ Тапсырманы орындау
</button>

            </div>
          ))}

        </div>
      )}

      {/* ANSWER MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedAssignment.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Максималды ұпай: {selectedAssignment.points}
                </p>
              </div>

              <button
                onClick={() => setSelectedAssignment(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            {/* STUDENT NAME */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Оқушының аты-жөні
              </label>

              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Мысалы: Аманкелді Ернұр"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-500"
              />
            </div>

            {/* ANSWER */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Жауабыңыз
              </label>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Жауабыңызды осы жерге жазыңыз..."
                rows={8}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="mt-5 flex gap-3">

              <button
                onClick={() => setSelectedAssignment(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Болдырмау
              </button>

              <button
                onClick={submitAssignment}
                disabled={submitting}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {submitting
                  ? 'Жіберілуде...'
                  : '📨 Мұғалімге жіберу'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}