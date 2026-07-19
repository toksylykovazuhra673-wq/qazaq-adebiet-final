import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Target, Trophy, BarChart3,
  BookOpen, CheckCircle, AlertCircle, Star,
} from 'lucide-react';
import type { GradeRecord, Student, ClassRecord, Assignment } from '@/types/teacher';

interface Props {
  grades: GradeRecord[];
  students: Student[];
  classes: ClassRecord[];
  assignments: Assignment[];
}

function StatCard({ Icon, label, value, sub, color }: {
  Icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/4 border border-white/8 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-gray-700 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function ScoreBar({ label, score, count }: { label: string; score: number; count: number }) {
  const color = score >= 85 ? 'from-emerald-500 to-green-400' :
                score >= 65 ? 'from-amber-500 to-yellow-400' : 'from-red-500 to-rose-400';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400 font-medium">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">{count} баға</span>
          <span className={`font-bold ${score >= 85 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
            {score}%
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function TchAnalytics({ grades, students, classes, assignments }: Props) {
  // Overall stats
  const totalStudents = students.length;
  const totalGrades   = grades.length;
  const avgScore      = totalGrades
    ? Math.round(grades.reduce((s, g) => s + g.score, 0) / totalGrades)
    : 0;
  const passRate      = totalGrades
    ? Math.round((grades.filter(g => g.score >= 70).length / totalGrades) * 100)
    : 0;
  const excellence    = grades.filter(g => g.score >= 90).length;

  // Per-class stats
  const classStats = classes.map(cls => {
    const classGrades = grades.filter(g => g.classId === cls.id);
    const clsStudents = students.filter(s => s.classId === cls.id);
    const avg = classGrades.length
      ? Math.round(classGrades.reduce((s, g) => s + g.score, 0) / classGrades.length)
      : 0;
    return { cls, avg, count: classGrades.length, students: clsStudents.length };
  }).filter(c => c.count > 0 || c.students > 0);

  // Per grade-type
  const typeStats = ['БЖБ', 'ТЖБ', 'ҚМЖ', 'Тест', 'Жоба'].map(t => {
    const tg = grades.filter(g => g.gradeType === t);
    const avg = tg.length ? Math.round(tg.reduce((s, g) => s + g.score, 0) / tg.length) : 0;
    return { type: t, avg, count: tg.length };
  }).filter(t => t.count > 0);

  // Top students
  const studentAvgs = students.map(s => {
    const sg = grades.filter(g => g.studentId === s.id);
    const avg = sg.length ? Math.round(sg.reduce((sum, g) => sum + g.score, 0) / sg.length) : 0;
    const cls = classes.find(c => c.id === s.classId);
    return { student: s, avg, count: sg.length, clsName: cls?.name ?? '' };
  }).filter(s => s.count > 0).sort((a, b) => b.avg - a.avg);

  const top5    = studentAvgs.slice(0, 5);
  const bottom5 = studentAvgs.filter(s => s.avg < 70).slice(-5).reverse();

  // Assignment completion
  const activeAssignments = assignments.filter(a => a.status === 'active');

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard Icon={Users}       label="Барлық оқушы"   value={totalStudents}  color="from-violet-600 to-purple-500" />
        <StatCard Icon={BarChart3}   label="Орт. балл"      value={`${avgScore}%`} color="from-blue-600 to-indigo-500" sub={`${totalGrades} баға`} />
        <StatCard Icon={CheckCircle} label="Өту пайызы"     value={`${passRate}%`} color="from-emerald-600 to-teal-500" />
        <StatCard Icon={Star}        label="Үздік (≥90%)"   value={excellence}     color="from-amber-500 to-yellow-400" />
      </div>

      {/* Per-class performance */}
      {classStats.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp size={12} /> Сынып бойынша орт. балл
          </h3>
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5 space-y-4">
            {classStats.map(({ cls, avg, count, students: sc }) => (
              <ScoreBar
                key={cls.id}
                label={`${cls.name} (${sc} оқушы)`}
                score={avg}
                count={count}
              />
            ))}
          </div>
        </div>
      )}

      {/* By grade type */}
      {typeStats.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target size={12} /> Баға түрі бойынша
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {typeStats.map(t => {
              const color = t.avg >= 85 ? 'from-emerald-600 to-teal-500' :
                            t.avg >= 65 ? 'from-amber-500 to-yellow-400' : 'from-red-600 to-rose-500';
              return (
                <div key={t.type} className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white text-xs font-bold">{t.type}</span>
                  </div>
                  <div className={`text-2xl font-extrabold ${t.avg >= 85 ? 'text-emerald-400' : t.avg >= 65 ? 'text-amber-400' : 'text-red-400'}`}>
                    {t.avg}%
                  </div>
                  <div className="text-gray-600 text-[11px] mt-0.5">{t.count} баға</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two columns: top + attention */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top 5 */}
        {top5.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Trophy size={12} className="text-amber-400" /> Үздік оқушылар
            </h3>
            <div className="space-y-2">
              {top5.map((s, i) => (
                <div key={s.student.id}
                  className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
                  <span className="text-[13px] w-5 text-gray-600 font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{s.student.name}</div>
                    <div className="text-gray-600 text-[11px]">{s.clsName}</div>
                  </div>
                  <span className={`text-sm font-bold ${s.avg >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {s.avg}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needs attention */}
        {bottom5.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle size={12} className="text-orange-400" /> Назар аудару керек
            </h3>
            <div className="space-y-2">
              {bottom5.map(s => (
                <div key={s.student.id}
                  className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-2.5">
                  <AlertCircle size={14} className="text-red-400/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{s.student.name}</div>
                    <div className="text-gray-600 text-[11px]">{s.clsName}</div>
                  </div>
                  <span className="text-sm font-bold text-red-400">{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active assignments */}
      {activeAssignments.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen size={12} /> Белсенді тапсырмалар ({activeAssignments.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeAssignments.map(a => (
              <span key={a.id}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs">
                {a.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {totalGrades === 0 && (
        <div className="text-center py-16 bg-white/3 border border-white/6 rounded-2xl">
          <BarChart3 size={40} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-400 font-medium mb-1">Деректер жоқ</p>
          <p className="text-gray-600 text-sm">Баға қойғаннан кейін статистика пайда болады</p>
        </div>
      )}
    </div>
  );
}
