import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: TODOの並び順を更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { todoIds } = body;

    if (!Array.isArray(todoIds)) {
      return NextResponse.json({ error: 'todoIds must be an array' }, { status: 400 });
    }

    // 各TODOのpositionを更新
    const updates = todoIds.map((id: string, index: number) =>
      supabase
        .from('todos')
        .update({ position: index })
        .eq('id', id)
    );

    await Promise.all(updates);

    return NextResponse.json({ message: 'Reorder successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

