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
  try {
    const body = await request.json();
    const { action, email, password, nama } = body;

    if (action === 'login') {
      const result = await fetchAPI('auth/index.php', { action: 'login', email, password });
      return NextResponse.json(result);
    }
    
    if (action === 'register') {
      const result = await fetchAPI('auth/index.php', { action: 'register', email, password, nama });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Auth route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
