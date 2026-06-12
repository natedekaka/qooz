'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { TournamentMatch, TournamentParticipant, Quiz } from '@/types'

export default function MatchPage() {
  const params = useParams()
  const router = useRouter()
  const tournamentId = params.id as string
  const matchId = params.matchId as string

  const [match, setMatch] = useState<TournamentMatch | null>(null)
  const [participants, setParticipants] = useState<TournamentParticipant[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState('')
  const [gamePin, setGamePin] = useState('')
  const [gameSessionId, setGameSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [gamePhase, setGamePhase] = useState<'select_quiz' | 'playing' | 'finishing' | 'done'>('select_quiz')
  const [winnerId, setWinnerId] = useState('')
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [matchRes, detailRes] = await Promise.all([
        api.tournament.matchState(matchId),
        api.tournament.detail(tournamentId)
      ])

      if (matchRes.match) {
        setMatch(matchRes.match)
        if (matchRes.match.status === 'finished') {
          setGamePhase('done')
          setWinnerId(matchRes.match.winner_id || '')
          setPlayer1Score(Number(matchRes.match.player1_score) || 0)
          setPlayer2Score(Number(matchRes.match.player2_score) || 0)
        } else if (matchRes.match.session_id) {
          setGameSessionId(matchRes.match.session_id)
          if (matchRes.game_session) {
            setGamePin(matchRes.game_session.pin)
            setGamePhase('playing')
          }
        }
      }

      if (detailRes.tournament) {
        setParticipants(detailRes.tournament.participants || [])
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  const fetchQuizzes = async () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)
    try {
      const response = await api.quiz.list(user.id)
      if (response.quizzes) {
        setQuizzes(response.quizzes.filter((q: Quiz) => q.jumlah_soal > 0))
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
    fetchQuizzes()
  }, [])

  const startMatch = async () => {
    if (!selectedQuizId) return
    setIsCreating(true)
    setError('')

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      setError('Silakan login dulu')
      setIsCreating(false)
      return
    }
    const user = JSON.parse(userStr)

    try {
      const gameRes = await api.game.create(selectedQuizId, user.id)
      if (gameRes.success && gameRes.session) {
        setGameSessionId(gameRes.session.id)
        setGamePin(gameRes.session.pin)
        setGamePhase('playing')
      } else {
        setError(gameRes.error || 'Gagal membuat game')
      }
    } catch {
      setError('Gagal membuat sesi game')
    }
    setIsCreating(false)
  }

  const finishMatch = async () => {
    if (!winnerId) {
      setError('Pilih pemenang terlebih dahulu')
      return
    }

    try {
      const response = await api.tournament.finishMatch(
        matchId,
        winnerId,
        player1Score,
        player2Score
      )
      if (response.success) {
        setGamePhase('done')
      } else {
        setError(response.error || 'Gagal menyimpan hasil')
      }
    } catch {
      setError('Terjadi kesalahan')
    }
  }

  const p1 = participants.find(p => p.id === match?.player1_id)
  const p2 = participants.find(p => p.id === match?.player2_id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="qooz-card text-center py-12">
          <p className="text-gray-500">Match tidak ditemukan</p>
          <Link href={`/tournament/${tournamentId}`} className="qooz-btn qooz-btn-primary mt-4 inline-block">
            Kembali
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/tournament/${tournamentId}`} className="text-white hover:text-white/80">
            ← Turnamen
          </Link>
        </div>

        <div className="qooz-card mb-6">
          <h1 className="text-xl font-bold text-gray-800 text-center mb-2">Pertandingan</h1>
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-2">
                {p1?.nama_peserta?.charAt(0) || '?'}
              </div>
              <p className="font-bold text-gray-800">{p1?.nama_peserta || '—'}</p>
            </div>
            <div className="text-3xl font-black text-gray-400">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-2">
                {p2?.nama_peserta?.charAt(0) || '?'}
              </div>
              <p className="font-bold text-gray-800">{p2?.nama_peserta || '—'}</p>
            </div>
          </div>
        </div>

        {gamePhase === 'select_quiz' && (
          <div className="qooz-card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Pilih Kuis untuk Match Ini</h2>

            <div className="space-y-2 mb-4">
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="qooz-input"
              >
                <option value="">— Pilih Kuis —</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.judul} ({q.jumlah_soal} soal)
                  </option>
                ))}
              </select>
              {quizzes.length === 0 && (
                <p className="text-sm text-gray-400 text-center">
                  Belum ada kuis. Buat kuis dulu di dashboard Guru.
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <button
              onClick={startMatch}
              disabled={!selectedQuizId || isCreating}
              className="qooz-btn qooz-btn-green w-full disabled:opacity-50"
            >
              {isCreating ? 'Menyiapkan...' : 'Mulai Match'}
            </button>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="qooz-card text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Match Sedang Berlangsung</h2>

            <div className="bg-purple-50 rounded-xl py-6 px-4 mb-4">
              <p className="text-gray-500 text-sm mb-1">Game PIN</p>
              <p className="text-6xl md:text-7xl font-black text-purple-600 tracking-widest">
                {gamePin}
              </p>
            </div>

            <p className="text-gray-600 mb-4">
              Kedua pemain join dengan PIN di atas melalui HP mereka.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={`/host/${selectedQuizId}/game?session=${gameSessionId}`}
                className="qooz-btn qooz-btn-primary"
                target="_blank"
              >
                Buka Layar Host
              </Link>

              <button
                onClick={() => {
                  api.game.state(gameSessionId).then(res => {
                    if (res.session?.status === 'finished') {
                      const sorted = [...(res.players || [])].sort((a: any, b: any) => b.skor_total - a.skor_total)
                      if (sorted.length >= 2) {
                        const p1Score = match?.player1_id === sorted[0].id ? sorted[0].skor_total : sorted[1].skor_total
                        const p2Score = match?.player1_id === sorted[0].id ? sorted[1].skor_total : sorted[0].skor_total
                        setPlayer1Score(p1Score || 0)
                        setPlayer2Score(p2Score || 0)

                        const p1Id = sorted[0].id
                        const relatedP = participants.find(pp =>
                          pp.nama_peserta.toLowerCase() === sorted[0].nama_siswa.toLowerCase()
                        )
                        if (relatedP) setWinnerId(relatedP.id)
                      }
                      setGamePhase('finishing')
                    } else {
                      alert('Game belum selesai. Mainkan dulu sampai selesai.')
                    }
                  })
                }}
                className="qooz-btn qooz-btn-yellow"
              >
                Game Sudah Selesai? Rekam Skor →
              </button>
            </div>
          </div>
        )}

        {gamePhase === 'finishing' && (
          <div className="qooz-card">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Rekam Hasil Match</h2>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => setWinnerId(match.player1_id || '')}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  winnerId === match.player1_id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-1">
                  {p1?.nama_peserta?.charAt(0) || '?'}
                </div>
                <p className="font-bold text-gray-800 text-sm">{p1?.nama_peserta}</p>
                <p className="text-xs text-gray-400 mt-1">Skor: {player1Score}</p>
                {winnerId === match.player1_id && (
                  <p className="text-green-600 font-bold text-xs mt-1">Pemenang</p>
                )}
              </button>

              <button
                onClick={() => setWinnerId(match.player2_id || '')}
                className={`text-center p-4 rounded-xl border-2 transition-all ${
                  winnerId === match.player2_id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-1">
                  {p2?.nama_peserta?.charAt(0) || '?'}
                </div>
                <p className="font-bold text-gray-800 text-sm">{p2?.nama_peserta}</p>
                <p className="text-xs text-gray-400 mt-1">Skor: {player2Score}</p>
                {winnerId === match.player2_id && (
                  <p className="text-green-600 font-bold text-xs mt-1">Pemenang</p>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{p1?.nama_peserta} Skor</label>
                <input
                  type="number"
                  value={player1Score}
                  onChange={(e) => setPlayer1Score(parseInt(e.target.value) || 0)}
                  className="qooz-input"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{p2?.nama_peserta} Skor</label>
                <input
                  type="number"
                  value={player2Score}
                  onChange={(e) => setPlayer2Score(parseInt(e.target.value) || 0)}
                  className="qooz-input"
                  min={0}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <button
              onClick={finishMatch}
              disabled={!winnerId}
              className="qooz-btn qooz-btn-green w-full disabled:opacity-50"
            >
              Simpan Hasil Match
            </button>
          </div>
        )}

        {gamePhase === 'done' && (
          <div className="qooz-card text-center">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Match Selesai!</h2>

            <div className="flex items-center justify-center gap-6 py-4">
              <div className={`text-center ${winnerId === match.player1_id ? 'opacity-100' : 'opacity-50'}`}>
                <p className="font-bold text-gray-800">{p1?.nama_peserta}</p>
                <p className="text-3xl font-black text-purple-600">{player1Score}</p>
                {winnerId === match.player1_id && <p className="text-green-600 font-bold">🏆 Menang</p>}
              </div>
              <div className="text-2xl font-black text-gray-300">:</div>
              <div className={`text-center ${winnerId === match.player2_id ? 'opacity-100' : 'opacity-50'}`}>
                <p className="font-bold text-gray-800">{p2?.nama_peserta}</p>
                <p className="text-3xl font-black text-purple-600">{player2Score}</p>
                {winnerId === match.player2_id && <p className="text-green-600 font-bold">🏆 Menang</p>}
              </div>
            </div>

            <Link
              href={`/tournament/${tournamentId}`}
              className="qooz-btn qooz-btn-primary mt-4 inline-block"
            >
              Kembali ke Bracket
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
