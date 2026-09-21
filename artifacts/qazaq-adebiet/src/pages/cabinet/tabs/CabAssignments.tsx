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

export default function CabAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAssignments() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Assignments error:', error);
        setError('Тапсырмаларды жүктеу кезінде қате пайда болды.');
      } else {
        setAssignments(data ?? []);
      }

      setLoading(false);
    }

    loadAssignments();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">Тапсырмалар жүктелуде...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Мұғалімнің тапсырмалары
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Мұғалім жіберген тапсырмалар осы жерде көрінеді.
        </p>
      </div>

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

              {assignment.due_date && (
                <p className="mt-4 text-sm text-orange-600">
                  📅 Соңғы мерзім: {assignment.due_date}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}