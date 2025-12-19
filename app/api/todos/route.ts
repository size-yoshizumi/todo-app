import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: 全てのTODOを取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: 新しいTODOを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // 現在の最大position値を取得
    const { data: maxPositionData } = await supabase
      .from('todos')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);

    const newPosition = maxPositionData && maxPositionData.length > 0
      ? maxPositionData[0].position + 1
      : 0;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        text: text.trim(),
        completed: false,
        position: newPosition,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

