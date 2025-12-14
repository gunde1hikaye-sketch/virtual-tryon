'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setCredits(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/credits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        setCredits(json.credits ?? 0);
      } catch {
        setCredits(0);
      } finally {
        setLoading(false);
      }
    };

    loadCredits();
  }, []);

  return { credits, loading };
}
