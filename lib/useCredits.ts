'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

type CreditsEventDetail = { credits?: number };

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/credits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCredits(json.credits ?? 0);
    } catch {
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ilk yükleme
    refresh();

    // try-on sonrası anlık güncelleme için event dinle
    const onCreditsUpdate = (e: Event) => {
      const ce = e as CustomEvent<CreditsEventDetail>;
      if (typeof ce.detail?.credits === 'number') {
        setCredits(ce.detail.credits);
      } else {
        // credits değeri gelmediyse tekrar fetch et
        refresh();
      }
    };

    window.addEventListener('credits:update', onCreditsUpdate);
    return () => window.removeEventListener('credits:update', onCreditsUpdate);
  }, [refresh]);

  return { credits, loading, refresh };
}
