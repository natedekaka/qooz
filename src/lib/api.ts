const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/qooz/api';
console.log('API_BASE:', API_BASE);

async function fetchAPI(endpoint: string, data?: Record<string, string>) {
  const url = `${API_BASE}/${endpoint}`;

  try {
    let response;
    if (data) {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      });
    } else {
      response = await fetch(url);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: 'Invalid response', raw: text };
    }
  } catch (err) {
    console.error('API fetch error:', err);
    return { error: 'Network error' };
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('auth/index.php', { action: 'login', email, password }),
    register: (email: string, password: string, nama: string) =>
      fetchAPI('auth/index.php', { action: 'register', email, password, nama }),
  },

  quiz: {
    list: (userId: string) =>
      fetchAPI(`quiz/index.php?action=list&user_id=${userId}`),
    detail: (id: string) =>
      fetchAPI(`quiz/index.php?action=detail&id=${id}`),
    create: (userId: string, judul: string, deskripsi: string) =>
      fetchAPI('quiz/index.php', { action: 'create', user_id: userId, judul, deskripsi }),
    delete: (userId: string, quizId: string) =>
      fetchAPI('quiz/index.php', { action: 'delete', user_id: userId, quiz_id: quizId }),
    duplicate: (userId: string, quizId: string) =>
      fetchAPI('quiz/index.php', { action: 'duplicate', user_id: userId, quiz_id: quizId }),
    addQuestion: (userId: string, quizId: string, soal: string, opsi1: string, opsi2: string, opsi3: string, opsi4: string, jawaban: string | number, waktu: string | number) =>
      fetchAPI('quiz/index.php', { action: 'add_question', user_id: userId, quiz_id: quizId, soal, opsi_1: opsi1, opsi_2: opsi2, opsi_3: opsi3, opsi_4: opsi4, jawaban_benar: String(jawaban), waktu_detik: String(waktu) }),
    updateQuestion: (userId: string, questionId: string, soal: string, opsi1: string, opsi2: string, opsi3: string, opsi4: string, jawaban: string | number, waktu: string | number) =>
      fetchAPI('quiz/index.php', { action: 'update_question', user_id: userId, question_id: questionId, soal, opsi_1: opsi1, opsi_2: opsi2, opsi_3: opsi3, opsi_4: opsi4, jawaban_benar: String(jawaban), waktu_detik: String(waktu) }),
    deleteQuestion: (userId: string, quizId: string, questionId: string) =>
      fetchAPI('quiz/index.php', { action: 'delete_question', user_id: userId, quiz_id: quizId, question_id: questionId }),
  },

  template: {
    list: (userId: string, includePublic: boolean = false) =>
      fetchAPI(`template/index.php?action=list&user_id=${userId}&include_public=${includePublic}`),
    detail: (id: string) =>
      fetchAPI(`template/index.php?action=detail&id=${id}`),
    create: (userId: string, judul: string, deskripsi: string, kategori: string, isPublic: boolean) =>
      fetchAPI('template/index.php', { action: 'create', user_id: userId, judul, deskripsi, kategori, is_public: String(isPublic) }),
    duplicate: (userId: string, templateId: string) =>
      fetchAPI('template/index.php', { action: 'duplicate', user_id: userId, template_id: templateId }),
    delete: (userId: string, templateId: string) =>
      fetchAPI('template/index.php', { action: 'delete', user_id: userId, template_id: templateId }),
    useTemplate: (userId: string, templateId: string, judul: string) =>
      fetchAPI('template/index.php', { action: 'use_template', user_id: userId, template_id: templateId, judul }),
  },

  schedule: {
    list: (userId: string) =>
      fetchAPI(`schedule/index.php?action=list&user_id=${userId}`),
    upcoming: () =>
      fetchAPI('schedule/index.php?action=upcoming'),
    create: (userId: string, quizId: string, scheduledAt: string, maxPlayers: number) =>
      fetchAPI('schedule/index.php', { action: 'create', user_id: userId, quiz_id: quizId, scheduled_at: scheduledAt, max_players: String(maxPlayers) }),
    cancel: (userId: string, scheduleId: string) =>
      fetchAPI('schedule/index.php', { action: 'cancel', user_id: userId, schedule_id: scheduleId }),
    start: (userId: string, scheduleId: string) =>
      fetchAPI('schedule/index.php', { action: 'start', user_id: userId, schedule_id: scheduleId }),
    delete: (userId: string, scheduleId: string) =>
      fetchAPI('schedule/index.php', { action: 'delete', user_id: userId, schedule_id: scheduleId }),
  },

  attendance: {
    list: (scheduleId?: string, sessionId?: string) =>
      fetchAPI(`attendance/index.php?action=list&${scheduleId ? 'schedule_id=' + scheduleId : 'session_id=' + sessionId}`),
    summary: (scheduleId?: string, userId?: string) =>
      fetchAPI(`attendance/index.php?action=summary&${scheduleId ? 'schedule_id=' + scheduleId : 'user_id=' + userId}`),
    record: (sessionId: string, scheduledQuizId: string, playerId: string, namaSiswa: string, hadir: boolean, skor: number, rankedPosition: number) =>
      fetchAPI('attendance/index.php', { action: 'record', session_id: sessionId, scheduled_quiz_id: scheduledQuizId, player_id: playerId, nama_siswa: namaSiswa, hadir: String(hadir), skor: String(skor), ranked_position: String(rankedPosition) }),
  },

  game: {
    create: (quizId: string, userId: string) =>
      fetchAPI('game/index.php', { action: 'create', quiz_id: quizId, user_id: userId }),
    state: (sessionId: string) =>
      fetchAPI(`game/index.php?action=state&session_id=${sessionId}`),
    byPin: (pin: string) =>
      fetchAPI(`game/index.php?action=by_pin&pin=${pin}`),
    start: (sessionId: string) =>
      fetchAPI('game/index.php', { action: 'start', session_id: sessionId }),
    next: (sessionId: string) =>
      fetchAPI('game/index.php', { action: 'next', session_id: sessionId }),
    endQuestion: (sessionId: string) =>
      fetchAPI('game/index.php', { action: 'end_question', session_id: sessionId }),
  },

  player: {
    join: (pin: string, nama: string) =>
      fetchAPI('player/index.php', { action: 'join', pin, nama }),
    answer: (playerId: string, questionId: string, sessionId: string, jawaban: string | number, waktuMs: string | number) =>
      fetchAPI('player/index.php', { action: 'answer', player_id: playerId, question_id: questionId, session_id: sessionId, jawaban: String(jawaban), waktu_ms: String(waktuMs) }),
    score: (playerId: string) =>
      fetchAPI('player/index.php', { action: 'score', player_id: playerId }),
    state: (playerId: string) =>
      fetchAPI(`player/index.php?action=state&player_id=${playerId}`),
  },
}
