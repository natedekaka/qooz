'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Tournament } from '@/types'

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkUser = () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
    fetchTournaments(JSON.parse(userStr).id)
  }

  const fetchTournaments = async (userId: string) => {
    try {
      const response = await api.tournament.list(userId)
      if (response.tournaments) {
        setTournaments(response.tournaments)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => { checkUser() }, [])

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      setup: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      finished: 'bg-blue-100 text-blue-700'
    }
    const labels: Record<string, string> = {
      setup: ' Persiapan ',
      active: ' Berlangsung ',
      finished: ' Selesai '
    }
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/host" className="qooz-title text-3xl md:text-4xl">
              Turnamen
            </Link>
            <p className="text-white/80 mt-1">Kelola turnamen kuis</p>
          </div>
          <Link
            href="/tournament/create"
            className="qooz-btn qooz-btn-primary"
          >
            + Buat Turnamen
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="qooz-card text-center py-12">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-gray-500 mb-4">Belum ada turnamen</p>
            <Link href="/tournament/create" className="qooz-btn qooz-btn-primary inline-block">
              Buat Turnamen Pertama
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {tournaments.map((t) => (
              <Link
                key={t.id}
                href={`/tournament/${t.id}`}
                className="qooz-card hover:scale-105 transition-transform group relative"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.judul}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {t.deskripsi || 'Tidak ada deskripsi'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  {statusBadge(t.status)}
                  <span className="text-gray-400">
                    {t.total_peserta || 0}/{t.max_participants} peserta
                  </span>
                </div>
                {t.status === 'finished' && (
                  <div className="mt-2 text-xs text-gray-400">
                    {t.total_rounds} putaran
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
