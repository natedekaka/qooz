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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const sessionId = searchParams.get('session_id');
  const pin = searchParams.get('pin');

  if (action === 'state' && sessionId) {
    return fetchAPI(`game/index.php?action=state&session_id=${sessionId}`);
  }
  if (action === 'by_pin' && pin) {
    return fetchAPI(`game/index.php?action=by_pin&pin=${pin}`);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, quiz_id, user_id, session_id } = body;

  if (action === 'create') {
    return fetchAPI('game/index.php', { action: 'create', quiz_id, user_id });
  }
  if (action === 'start') {
    return fetchAPI('game/index.php', { action: 'start', session_id });
  }
  if (action === 'next') {
    return fetchAPI('game/index.php', { action: 'next', session_id });
  }
  if (action === 'end_question') {
    return fetchAPI('game/index.php', { action: 'end_question', session_id });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
