export default function AnalysisLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 animate-pulse">
      {/* header */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-white/10 rounded-xl" />
        <div className="rounded-2xl bg-white/5 p-8 flex gap-6">
          <div className="w-32 h-44 bg-white/10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-24 bg-white/10 rounded-lg" />
            <div className="h-8 w-72 bg-white/10 rounded-xl" />
            <div className="h-4 w-48 bg-white/10 rounded-lg" />
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 bg-white/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-white/5 h-20" />
        ))}
      </div>
    </div>
  );
}
