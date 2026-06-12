'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Tournament, TournamentMatch, TournamentParticipant } from '@/types'

export default function TournamentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tournamentId = params.id as string

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [participants, setParticipants] = useState<TournamentParticipant[]>([])
  const [matches, setMatches] = useState<TournamentMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newParticipantName, setNewParticipantName] = useState('')

  const fetchDetail = async () => {
    try {
      const response = await api.tournament.detail(tournamentId)
      if (response.tournament) {
        setTournament(response.tournament)
        setParticipants(response.tournament.participants || [])
        setMatches(response.tournament.matches || [])
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => { if (tournamentId) fetchDetail() }, [tournamentId])

  const userId = () => {
    const u = localStorage.getItem('qooz_user')
    return u ? JSON.parse(u).id : null
  }

  const addParticipant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newParticipantName.trim()) return

    try {
      const response = await api.tournament.addParticipant(tournamentId, newParticipantName.trim())
      if (response.success) {
        setNewParticipantName('')
        fetchDetail()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const removeParticipant = async (participantId: string) => {
    if (!confirm('Hapus peserta ini?')) return
    try {
      await api.tournament.removeParticipant(tournamentId, participantId)
      fetchDetail()
    } catch (err) {
      console.error(err)
    }
  }

  const startTournament = async () => {
    if (!confirm('Mulai turnamen? Bracket akan digenerate dan tidak bisa diubah.')) return
    const uid = userId()
    if (!uid) return

    try {
      const response = await api.tournament.start(tournamentId, uid)
      if (response.success) {
        fetchDetail()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const advanceRound = async () => {
    const uid = userId()
    if (!uid) return

    try {
      const response = await api.tournament.advanceRound(tournamentId, uid)
      if (response.success) {
        fetchDetail()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="qooz-card text-center py-12">
          <p className="text-5xl mb-4">❓</p>
          <p className="text-gray-500 mb-4">Turnamen tidak ditemukan</p>
          <Link href="/tournament" className="qooz-btn qooz-btn-primary inline-block">
            Kembali
          </Link>
        </div>
      </div>
    )
  }

  const statusBadge = (status: string) => {
    const s: Record<string, string> = {
      setup: 'bg-yellow-100 text-yellow-700', active: 'bg-green-100 text-green-700', finished: 'bg-blue-100 text-blue-700'
    }
    const l: Record<string, string> = { setup: ' Persiapan ', active: ' Berlangsung ', finished: ' Selesai ' }
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s[status] || ''}`}>{l[status] || status}</span>
  }

  const matchStatusBadge = (status: string) => {
    const s: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-500', playing: 'bg-yellow-100 text-yellow-700', finished: 'bg-green-100 text-green-700'
    }
    const l: Record<string, string> = { pending: 'Tunggu', playing: 'Main', finished: 'Selesai' }
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${s[status] || ''}`}>{l[status] || status}</span>
  }

  const currentMatches = matches.filter(m => m.round === tournament.current_round)
  const allCurrentFinished = currentMatches.length > 0 && currentMatches.every(m => m.status === 'finished')
  const isLastRound = tournament.current_round >= tournament.total_rounds

  const matchesByRound: Record<number, TournamentMatch[]> = {}
  matches.forEach(m => {
    if (!matchesByRound[m.round]) matchesByRound[m.round] = []
    matchesByRound[m.round].push(m)
  })

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <Link href="/tournament" className="text-white hover:text-white/80">
            ← Turnamen
          </Link>
        </div>

        <div className="qooz-card mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{tournament.judul}</h1>
              {tournament.deskripsi && <p className="text-gray-500 mt-1">{tournament.deskripsi}</p>}
              <div className="flex flex-wrap gap-3 mt-3">
                {statusBadge(tournament.status)}
                <span className="text-sm text-gray-400">
                  {participants.length} peserta
                </span>
                <span className="text-sm text-gray-400">
                  Kode: <span className="font-mono font-bold text-purple-600">{tournament.code}</span>
                </span>
                {tournament.status !== 'setup' && (
                  <span className="text-sm text-gray-400">
                    Putaran {tournament.current_round}/{tournament.total_rounds}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {tournament.status === 'setup' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="qooz-card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Peserta ({participants.length})</h2>

              <form onSubmit={addParticipant} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  className="qooz-input flex-1"
                  placeholder="Nama peserta"
                  maxLength={30}
                />
                <button type="submit" className="qooz-btn qooz-btn-primary whitespace-nowrap">
                  Tambah
                </button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {participants.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="font-medium text-gray-700">{p.nama_peserta}</span>
                    </div>
                    <button
                      onClick={() => removeParticipant(p.id)}
                      className="text-red-400 hover:text-red-600 text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {participants.length === 0 && (
                  <p className="text-gray-400 text-center py-4">Belum ada peserta</p>
                )}
              </div>
            </div>

            <div className="qooz-card flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-5xl mb-4">🏆</p>
              <p className="text-gray-600 mb-2 font-semibold">
                {participants.length < 2
                  ? 'Tambahkan minimal 2 peserta'
                  : 'Siap memulai turnamen?'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {participants.length} dari {tournament.max_participants} peserta terdaftar
              </p>
              <button
                onClick={startTournament}
                disabled={participants.length < 2}
                className="qooz-btn qooz-btn-green disabled:opacity-50 disabled:cursor-not-allowed text-lg px-8 py-4"
              >
                Mulai Turnamen
              </button>
            </div>
          </div>
        )}

        {tournament.status !== 'setup' && matches.length > 0 && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Bracket Turnamen</h2>
                {tournament.status === 'active' && allCurrentFinished && !isLastRound && (
                  <button onClick={advanceRound} className="qooz-btn qooz-btn-primary">
                    Lanjut ke Putaran {tournament.current_round + 1} →
                  </button>
                )}
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4" style={{ minWidth: matchesByRound[1] ? Math.max(matchesByRound[1].length * 160, 600) : 600 }}>
                  {Object.entries(matchesByRound).sort(([a], [b]) => Number(a) - Number(b)).map(([roundStr, roundMatches]) => {
                    const round = Number(roundStr)
                    const matchHeight = round === 1 ? 80 : 80 * Math.pow(2, round - 1)
                    const gap = round === 1 ? 8 : 8 + 32 * (Math.pow(2, round - 1) - 1)

                    return (
                      <div key={round} className="flex flex-col" style={{ minWidth: 180 }}>
                        <div className="text-center text-sm font-bold text-white/80 mb-3 bg-white/10 rounded-full px-3 py-1">
                          {round === tournament.total_rounds ? 'Final' : `Putaran ${round}`}
                        </div>
                        <div className="flex flex-col" style={{ gap: `${gap}px` }}>
                          {roundMatches.map((match) => {
                            const p1 = participants.find(p => p.id === match.player1_id)
                            const p2 = participants.find(p => p.id === match.player2_id)

                            let p1Class = 'border-gray-300 bg-white'
                            let p2Class = 'border-gray-300 bg-white'

                            if (match.status === 'finished') {
                              if (match.winner_id === match.player1_id) {
                                p1Class = 'border-green-400 bg-green-50'
                                p2Class = 'border-red-200 bg-red-50'
                              } else if (match.winner_id === match.player2_id) {
                                p1Class = 'border-red-200 bg-red-50'
                                p2Class = 'border-green-400 bg-green-50'
                              }
                            }

                            return (
                              <div
                                key={match.id}
                                className={`border-2 rounded-xl p-3 transition-colors ${match.status === 'playing' ? 'border-yellow-400 bg-yellow-50 animate-pulse' : ''} ${match.status === 'finished' ? 'shadow-md' : 'shadow'}`}
                                style={{ minHeight: `${matchHeight}px` }}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  {matchStatusBadge(match.status)}
                                </div>

                                <div className={`px-2 py-1.5 rounded-lg mb-1 ${p1Class} border`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-800 truncate">
                                      {p1?.nama_peserta || '—'}
                                    </span>
                                    <span className="text-sm font-bold text-gray-600 ml-2">{match.player1_score || ''}</span>
                                  </div>
                                </div>

                                <div className={`px-2 py-1.5 rounded-lg ${p2Class} border`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-800 truncate">
                                      {p2?.nama_peserta || '—'}
                                    </span>
                                    <span className="text-sm font-bold text-gray-600 ml-2">{match.player2_score || ''}</span>
                                  </div>
                                </div>

                                {match.status === 'pending' && match.player1_id && match.player2_id && (
                                  <Link
                                    href={`/tournament/${tournamentId}/match/${match.id}`}
                                    className="mt-2 block text-center text-xs qooz-btn qooz-btn-green py-1 px-2"
                                  >
                                    Mainkan
                                  </Link>
                                )}

                                {match.status === 'playing' && (
                                  <Link
                                    href={`/tournament/${tournamentId}/match/${match.id}`}
                                    className="mt-2 block text-center text-xs qooz-btn qooz-btn-yellow py-1 px-2"
                                  >
                                    Lanjutkan
                                  </Link>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {tournament.status === 'active' && allCurrentFinished && isLastRound && (
              <div className="qooz-card text-center py-8">
                <p className="text-5xl mb-4">🏆</p>
                <p className="text-xl font-bold text-gray-800 mb-2">Semua match selesai!</p>
                <p className="text-gray-500">Champion akan ditentukan setelah turnamen berakhir.</p>
              </div>
            )}

            {tournament.status === 'finished' && (
              <div className="qooz-card text-center py-8">
                <p className="text-5xl mb-4">🏆</p>
                <p className="text-2xl font-bold text-gray-800 mb-2">Turnamen Selesai!</p>
                <p className="text-gray-500">
                  Champion: <span className="font-bold text-purple-600">
                    {participants.find(p => p.status === 'winner')?.nama_peserta || '—'}
                  </span>
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Link href="/tournament" className="qooz-btn qooz-btn-primary">
                    Kembali ke Daftar
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {tournament.status !== 'setup' && matches.length === 0 && (
          <div className="qooz-card text-center py-12">
            <p className="text-gray-500">Bracket sedang disiapkan...</p>
            <button onClick={fetchDetail} className="qooz-btn qooz-btn-primary mt-4">
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
