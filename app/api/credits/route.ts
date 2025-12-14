import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      credits: data.credits ?? 0,
    });
  } catch (e) {
    console.error('CREDIT FETCH ERROR', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
