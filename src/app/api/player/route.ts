import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/qooz/api';

async function fetchAPI(endpoint: string, data?: Record<string, string>) {
  const isGet = !data;
  const url = isGet 
    ? `${API_URL}/${endpoint}` 
    : `${API_URL}/${endpoint}`;
  
  try {
    const options: RequestInit = isGet 
      ? { method: 'GET' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        };
    
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: 'Invalid response', raw: text };
    }
  } catch (err) {
    console.error('API error:', err);
    return { error: 'Network error' };
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, pin, nama, player_id, question_id, session_id, jawaban, waktu_ms } = body;

  if (action === 'join') {
    return fetchAPI('player/index.php', { action: 'join', pin, nama });
  }
  if (action === 'answer') {
    return fetchAPI('player/index.php', { action: 'answer', player_id, question_id, session_id, jawaban, waktu_ms });
  }
  if (action === 'score') {
    return fetchAPI('player/index.php', { action: 'score', player_id });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const playerId = searchParams.get('player_id');

  if (action === 'state' && playerId) {
    return fetchAPI(`player/index.php?action=state&player_id=${playerId}`);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
