'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Quiz } from '@/types'

export default function HostPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newQuiz, setNewQuiz] = useState({ judul: '', deskripsi: '' })
  
  const router = useRouter()

  const checkUser = () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    fetchQuizzes(user.id)
  }

  const fetchQuizzes = async (userId: string) => {
    try {
      const response = await api.quiz.list(userId)
      if (response.quizzes) {
        setQuizzes(response.quizzes)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkUser()
  }, [])

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      const response = await api.quiz.create(user.id, newQuiz.judul, newQuiz.deskripsi)
      if (response.success && response.quiz) {
        setShowCreateModal(false)
        setNewQuiz({ judul: '', deskripsi: '' })
        router.push(`/host/${response.quiz.id}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteQuiz = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Yakin ingin menghapus kuis ini?')) return

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      await api.quiz.delete(user.id, id)
      setQuizzes(quizzes.filter(q => q.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const duplicateQuiz = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      const response = await api.quiz.duplicate(user.id, id)
      if (response.success && response.quiz) {
        fetchQuizzes(user.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const downloadScores = async (quiz: Quiz, e: React.MouseEvent) => {
    e.preventDefault()

    try {
      const response = await api.game.recap(quiz.id)
      const sessions = response.sessions || []
      const quizData = quizzes.find(q => q.id === quiz.id)

      const csvLines: string[] = [
        `QOOZ - Rekap Skor Kuis`,
        `Kuis: ${quizData?.judul || quiz.judul}`,
        `Diunduh: ${new Date().toLocaleString('id-ID')}`,
        '',
        'Sesi/PIN,Tanggal,Status,No,Nama,Skor',
      ]

      for (const session of sessions) {
        const players = session.players || []
        const tanggal = session.created_at ? new Date(session.created_at).toLocaleString('id-ID') : '-'
        const status = session.status === 'finished' ? 'Selesai' : session.status === 'playing' ? 'Berlangsung' : 'Lobby'

        if (players.length === 0) {
          csvLines.push(`"${session.pin}","${tanggal}","${status}",-,-,-`)
          continue
        }

        const sorted = [...players].sort((a, b) => b.skor_total - a.skor_total)
        sorted.forEach((p, i) => {
          csvLines.push(`"${session.pin}","${tanggal}","${status}",${i + 1},"${p.nama_siswa}",${p.skor_total}`)
        })
      }

      if (sessions.length === 0) {
        csvLines.push('Belum ada sesi game untuk kuis ini.')
      }

      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qooz-rekap-${quiz.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Gagal mengunduh skor')
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('qooz_user')
    localStorage.removeItem('qooz_token')
    router.push('/')
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
            <Link href="/" className="qooz-title text-3xl md:text-4xl">QOOZ</Link>
            <p className="text-white/80 mt-1">Dashboard Guru</p>
          </div>
          <div className="flex gap-2">
            <Link href="/import" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
              Import
            </Link>
            <Link href="/schedule" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
              Jadwal
            </Link>
            <Link href="/attendance" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
              Kehadiran
            </Link>
            <Link href="/tournament" className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-yellow-900 font-semibold">
              Turnamen
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="qooz-card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <div className="text-4xl font-bold">{quizzes.length}</div>
            <div className="text-purple-100">Total Kuis</div>
          </div>
          <div className="qooz-card">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full h-full flex flex-col items-center justify-center text-purple-600 hover:bg-purple-50 rounded-xl transition-colors min-h-[100px]"
            >
              <span className="text-4xl mb-2">+</span>
              <span className="font-semibold">Buat Kuis Baru</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Kuis Anda</h2>
        
        {quizzes.length === 0 ? (
          <div className="qooz-card text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada kuis</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="qooz-btn qooz-btn-primary"
            >
              Buat Kuis Pertama
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/host/${quiz.id}`}
                className="qooz-card hover:scale-105 transition-transform group relative"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => downloadScores(quiz, e)}
                    className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-600"
                    title="Download Skor"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={(e) => duplicateQuiz(quiz.id, e)}
                    className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600"
                    title="Duplikasi"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => deleteQuiz(quiz.id, e)}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600"
                    title="Hapus"
                  >
                    ×
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.judul}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {quiz.deskripsi || 'Tidak ada deskripsi'}
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {quiz.jumlah_soal} soal
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="qooz-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buat Kuis Baru</h2>
            <form onSubmit={createQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Kuis
                </label>
                <input
                  type="text"
                  value={newQuiz.judul}
                  onChange={(e) => setNewQuiz({ ...newQuiz, judul: e.target.value })}
                  className="qooz-input"
                  placeholder="Contoh: Kuis Informatika Kelas X"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={newQuiz.deskripsi}
                  onChange={(e) => setNewQuiz({ ...newQuiz, deskripsi: e.target.value })}
                  className="qooz-input"
                  placeholder="Deskripsi kuis..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 qooz-btn qooz-btn-primary"
                >
                  Buat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
