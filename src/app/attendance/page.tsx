'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  nama_siswa: string
  hadir: boolean
  skor: number
  ranked_position: number | null
  attendance_time: string
}

interface Summary {
  total_player: number
  total_hadir: number
  totalJuara: number
  rata_skor: number
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const checkUser = () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
  }

  const fetchAttendance = async () => {
    if (!sessionId) return
    
    setIsLoading(true)
    try {
      const response = await api.attendance.list(sessionId)
      if (response.attendance) {
        setAttendance(response.attendance)
      }
      
      const summaryRes = await api.attendance.summary(undefined, sessionId)
      if (response.summary) {
        setSummary(summaryRes.summary)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  const fetchAllAttendance = async () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)
    
    setIsLoading(true)
    try {
      const response = await api.attendance.summary(undefined, user.id)
      if (response.summary) {
        setSummary(response.summary)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkUser()
    fetchAllAttendance()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('qooz_user')
    localStorage.removeItem('qooz_token')
    router.push('/')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="qooz-title text-3xl md:text-4xl">QOOZ</Link>
            <p className="text-white/80 mt-1">Rekap Kehadiran</p>
          </div>
          <div className="flex gap-2">
            <Link href="/host" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Kuis</Link>
            <Link href="/template" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Template</Link>
            <Link href="/schedule" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Jadwal</Link>
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Keluar</button>
          </div>
        </div>

        <div className="qooz-card mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cari Data Kehadiran</h3>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={sessionId} 
              onChange={(e) => setSessionId(e.target.value)} 
              placeholder="Masukkan Session ID" 
              className="qooz-input flex-1"
            />
            <button onClick={fetchAttendance} className="qooz-btn qooz-btn-primary">
              Cari
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="qooz-card bg-gradient-to-br from-blue-500 to-blue-700 text-white text-center">
              <div className="text-3xl font-bold">{summary.total_player || 0}</div>
              <div className="text-blue-100">Total Player</div>
            </div>
            <div className="qooz-card bg-gradient-to-br from-green-500 to-green-700 text-white text-center">
              <div className="text-3xl font-bold">{summary.total_hadir || 0}</div>
              <div className="text-green-100">Hadir</div>
            </div>
            <div className="qooz-card bg-gradient-to-br from-purple-500 to-purple-700 text-white text-center">
              <div className="text-3xl font-bold">{summary.totalJuara || 0}</div>
              <div className="text-purple-100">Juara 1</div>
            </div>
            <div className="qooz-card bg-gradient-to-br from-orange-500 to-orange-700 text-white text-center">
              <div className="text-3xl font-bold">{summary.rata_skor ? Math.round(summary.rata_skor) : 0}</div>
              <div className="text-orange-100">Rata-rata Skor</div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-white mb-4">Daftar Kehadiran</h2>
        
        {isLoading ? (
          <div className="qooz-card text-center py-8">
            <p className="text-gray-500">Memuat...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="qooz-card text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada data kehadiran</p>
            <p className="text-gray-400 text-sm">Masukkan Session ID untuk melihat data kehadiran</p>
          </div>
        ) : (
          <div className="qooz-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Peringkat</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      {record.ranked_position === 1 && <span className="text-2xl">🥇</span>}
                      {record.ranked_position === 2 && <span className="text-2xl">🥈</span>}
                      {record.ranked_position === 3 && <span className="text-2xl">🥉</span>}
                      {record.ranked_position && record.ranked_position > 3 && (
                        <span className="text-gray-600 font-medium">#{record.ranked_position}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{record.nama_siswa}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${record.hadir ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {record.hadir ? 'Hadir' : 'Tidak Hadir'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-purple-600">{record.skor}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(record.attendance_time).toLocaleTimeString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
