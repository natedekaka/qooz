'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateTournamentPage() {
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [maxPeserta, setMaxPeserta] = useState(8)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('qooz_user')) {
      router.push('/login')
    }
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)

    try {
      const response = await api.tournament.create(user.id, judul, deskripsi, maxPeserta)
      if (response.success && response.tournament) {
        router.push(`/tournament/${response.tournament.id}`)
      } else {
        setError(response.error || 'Gagal membuat turnamen')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/tournament" className="text-white hover:text-white/80">
            ← Kembali
          </Link>
        </div>

        <div className="qooz-card">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Turnamen Baru</h1>
          <p className="text-gray-500 mb-6">Buat turnamen kuis untuk kompetisi yang seru!</p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Turnamen
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="qooz-input"
                placeholder="Contoh: Turnamen Informatika Kelas X"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi (Opsional)
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="qooz-input"
                placeholder="Deskripsi turnamen..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maksimal Peserta
              </label>
              <select
                value={maxPeserta}
                onChange={(e) => setMaxPeserta(parseInt(e.target.value))}
                className="qooz-input"
              >
                <option value={4}>4 Peserta</option>
                <option value={8}>8 Peserta</option>
                <option value={16}>16 Peserta</option>
                <option value={32}>32 Peserta</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !judul}
              className="qooz-btn qooz-btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Membuat...' : 'Buat Turnamen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
