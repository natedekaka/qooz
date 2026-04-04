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
  const userId = searchParams.get('user_id');
  const quizId = searchParams.get('id');

  if (action === 'list' && userId) {
    return fetchAPI(`quiz/index.php?action=list&user_id=${userId}`);
  }
  if (action === 'detail' && quizId) {
    return fetchAPI(`quiz/index.php?action=detail&id=${quizId}`);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, user_id, quiz_id, judul, deskripsi, question_id, soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik } = body;

  if (action === 'create') {
    return fetchAPI('quiz/index.php', { action: 'create', user_id, quiz_id, judul, deskripsi });
  }
  if (action === 'delete') {
    return fetchAPI('quiz/index.php', { action: 'delete', user_id, quiz_id });
  }
  if (action === 'add_question') {
    return fetchAPI('quiz/index.php', { action: 'add_question', user_id, quiz_id, soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik });
  }
  if (action === 'update_question') {
    return fetchAPI('quiz/index.php', { action: 'update_question', user_id, question_id, soal, opsi_1, opsi_2, opsi_3, opsi_4, jawaban_benar, waktu_detik });
  }
  if (action === 'delete_question') {
    return fetchAPI('quiz/index.php', { action: 'delete_question', user_id, quiz_id, question_id });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
