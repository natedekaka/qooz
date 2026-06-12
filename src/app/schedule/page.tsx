'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Schedule {
  id: string
  quiz_id: string
  quiz_judul: string
  scheduled_at: string
  started_at: string | null
  status: string
  max_players: number
}

interface Quiz {
  id: string
  judul: string
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(50)
  
  const router = useRouter()

  const checkUser = () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    fetchData(user.id)
  }

  const fetchData = async (userId: string) => {
    try {
      const [scheduleRes, quizRes] = await Promise.all([
        api.schedule.list(userId),
        api.quiz.list(userId)
      ])
      if (scheduleRes.schedules) {
        setSchedules(scheduleRes.schedules)
      }
      if (quizRes.quizzes) {
        setQuizzes(quizRes.quizzes)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkUser()
  }, [])

  const createSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    const scheduledAt = `${scheduledDate} ${scheduledTime}`

    try {
      const response = await api.schedule.create(user.id, selectedQuiz, scheduledAt, maxPlayers)
      if (response.success) {
        setShowCreateModal(false)
        setSelectedQuiz('')
        setScheduledDate('')
        setScheduledTime('')
        setMaxPlayers(50)
        fetchData(user.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const startSchedule = async (scheduleId: string) => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      const response = await api.schedule.start(user.id, scheduleId)
      if (response.success && response.game) {
        alert(`Kuis dimulai! PIN: ${response.game.pin}`)
        router.push(`/host/${response.game.id}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const cancelSchedule = async (scheduleId: string) => {
    if (!confirm('Yakin ingin membatalkan jadwal ini?')) return

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      await api.schedule.cancel(user.id, scheduleId)
      fetchData(user.id)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      await api.schedule.delete(user.id, scheduleId)
      setSchedules(schedules.filter(s => s.id !== scheduleId))
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
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
            <p className="text-white/80 mt-1">Jadwal Kuis</p>
          </div>
          <div className="flex gap-2">
            <Link href="/host" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Kuis</Link>
            <Link href="/template" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Template</Link>
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Keluar</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="qooz-card bg-gradient-to-br from-green-500 to-green-700 text-white">
            <div className="text-4xl font-bold">{schedules.length}</div>
            <div className="text-green-100">Total Jadwal</div>
          </div>
          <div className="qooz-card">
            <button onClick={() => setShowCreateModal(true)} className="w-full h-full flex flex-col items-center justify-center text-green-600 hover:bg-green-50 rounded-xl transition-colors min-h-[100px]">
              <span className="text-4xl mb-2">+</span>
              <span className="font-semibold">Jadwalkan Kuis</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Jadwal Kuis</h2>
        
        {schedules.length === 0 ? (
          <div className="qooz-card text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada jadwal</p>
            <button onClick={() => setShowCreateModal(true)} className="qooz-btn qooz-btn-primary">
              Jadwalkan Kuis Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="qooz-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{schedule.quiz_judul}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>📅 {formatDate(schedule.scheduled_at)}</span>
                    <span>🕐 {formatTime(schedule.scheduled_at)}</span>
                    <span>👥 Max {schedule.max_players} player</span>
                  </div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    schedule.status === 'started' ? 'bg-green-100 text-green-700' :
                    schedule.status === 'finished' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {schedule.status === 'pending' ? 'Menunggu' :
                     schedule.status === 'started' ? 'Sedang Berlangsung' :
                     schedule.status === 'finished' ? 'Selesai' : 'Dibatalkan'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {schedule.status === 'pending' && (
                    <>
                      <button onClick={() => startSchedule(schedule.id)} className="qooz-btn qooz-btn-primary">
                        Mulai Sekarang
                      </button>
                      <button onClick={() => cancelSchedule(schedule.id)} className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-yellow-700">
                        Batal
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteSchedule(schedule.id)} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl text-red-600">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="qooz-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Jadwalkan Kuis</h2>
            <form onSubmit={createSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kuis</label>
                <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)} className="qooz-input" required>
                  <option value="">Pilih kuis...</option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>{quiz.judul}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="qooz-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="qooz-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Player</label>
                <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))} className="qooz-input" min="1" max="100" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700">Batal</button>
                <button type="submit" className="flex-1 qooz-btn qooz-btn-primary">Jadwalkan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
