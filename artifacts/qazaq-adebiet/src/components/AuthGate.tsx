import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/AdminLogin';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Supabase session error:', error);
          if (mounted) {
            setSession(null);
          }
          return;
        }

        if (mounted) {
          setSession(data.session);
        }
      } catch (error) {
        console.error('Auth error:', error);

        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0318] flex items-center justify-center">
        <div className="text-white text-xl">Жүктелуде...</div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}