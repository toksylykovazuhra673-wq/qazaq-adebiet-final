import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
  setError('Email немесе пароль дұрыс емес.');
  setLoading(false);
  return;
}

window.location.href = '/';

setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10051f] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>

          <h1 className="text-3xl font-serif text-white mb-2">
            Мұғалім кабинеті
          </h1>

          <p className="text-white/60">
            Басқару панеліне кіру
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white/80 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email енгізіңіз"
              required
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">
              Пароль
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль енгізіңіз"
              required
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-purple-400"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 transition"
          >
            {loading ? 'Кіру орындалуда...' : 'Кіру'}
          </button>
        </form>
      </div>
    </div>
  );
}