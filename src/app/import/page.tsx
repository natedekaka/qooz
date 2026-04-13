'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  nomor_soal: number
  teks_soal: string
  opsi_1: string
  opsi_2: string
  opsi_3: string
  opsi_4: string
  jawaban_benar: number
  waktu_detik: number
}

interface Quiz {
  id: string
  judul: string
  jumlah_soal: number
}

export default function ImportPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFileName(file.name)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        let parsedQuestions: Question[] = []
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(event.target?.result as string)
          parsedQuestions = Array.isArray(data) ? data : data.questions || []
        } else if (file.name.endsWith('.csv')) {
          const text = event.target?.result as string
          const lines = text.split('\n').filter(line => line.trim())
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            const question: Question = {
              nomor_soal: i,
              teks_soal: '',
              opsi_1: '',
              opsi_2: '',
              opsi_3: '',
              opsi_4: '',
              jawaban_benar: 1,
              waktu_detik: 20
            }
            
            headers.forEach((header, idx) => {
              if (header.includes('soal') || header.includes('question')) question.teks_soal = values[idx] || ''
              else if (header.includes('opsi1') || header.includes('option1')) question.opsi_1 = values[idx] || ''
              else if (header.includes('opsi2') || header.includes('option2')) question.opsi_2 = values[idx] || ''
              else if (header.includes('opsi3') || header.includes('option3')) question.opsi_3 = values[idx] || ''
              else if (header.includes('opsi4') || header.includes('option4')) question.opsi_4 = values[idx] || ''
              else if (header.includes('jawaban') || header.includes('answer')) question.jawaban_benar = parseInt(values[idx]) || 1
              else if (header.includes('waktu') || header.includes('time')) question.waktu_detik = parseInt(values[idx]) || 20
            })
            
            if (question.teks_soal) {
              parsedQuestions.push(question)
            }
          }
        }
        
        setQuestions(parsedQuestions.map((q, idx) => ({ ...q, nomor_soal: idx + 1 })))
      } catch (err) {
        console.error('Error parsing file:', err)
        alert('Error parsing file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const importQuestions = async () => {
    if (!selectedQuiz || questions.length === 0) {
      alert('Pilih kuis dan pastikan ada soal yang akan diimport')
      return
    }

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    setImporting(true)
    let successCount = 0

    try {
      for (const question of questions) {
        const response = await api.quiz.addQuestion(
          user.id,
          selectedQuiz,
          question.teks_soal,
          question.opsi_1,
          question.opsi_2,
          question.opsi_3,
          question.opsi_4,
          String(question.jawaban_benar),
          String(question.waktu_detik)
        )
        if (response.success) {
          successCount++
        }
      }

      alert(`Berhasil import ${successCount} soal!`)
      setQuestions([])
      setSelectedQuiz('')
      setUploadedFileName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error(err)
      alert('Error saat import soal')
    }

    setImporting(false)
  }

  const downloadTemplate = (format: 'json' | 'csv') => {
    const template = [
      {
        nomor_soal: 1,
        teks_soal: "Apa ibukota Indonesia?",
        opsi_1: "Jakarta",
        opsi_2: "Bandung",
        opsi_3: "Surabaya",
        opsi_4: "Medan",
        jawaban_benar: 1,
        waktu_detik: 20
      },
      {
        nomor_soal: 2,
        teks_soal: "5 + 3 = ?",
        opsi_1: "6",
        opsi_2: "7",
        opsi_3: "8",
        opsi_4: "9",
        jawaban_benar: 3,
        waktu_detik: 15
      }
    ]

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-soal.json'
      a.click()
    } else {
      const csv = 'nomor_soal,teks_soal,opsi_1,opsi_2,opsi_3,opsi_4,jawaban_benar,waktu_detik\n' +
        '1,"Apa ibukota Indonesia?","Jakarta","Bandung","Surabaya","Medan",1,20\n' +
        '2,"5 + 3 = ?","6","7","8","9",3,15'
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-soal.csv'
      a.click()
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('qooz_user')
    localStorage.removeItem('qooz_token')
    router.push('/')
  }

  const optionLabels = ['A', 'B', 'C', 'D']
  const optionColors = ['bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']

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
            <p className="text-white/80 mt-1">Import soal</p>
          </div>
          <div className="flex gap-2">
            <Link href="/host" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Kuis</Link>
            <Link href="/schedule" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Jadwal</Link>
            <Link href="/attendance" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Kehadiran</Link>
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">Keluar</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="qooz-card bg-gradient-to-br from-orange-500 to-orange-700 text-white">
            <div className="text-4xl font-bold">{questions.length}</div>
            <div className="text-orange-100">Soal di Preview</div>
          </div>
        </div>

        <div className="qooz-card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📥 Import Soal</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kuis Tujuan</label>
            <select value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)} className="qooz-input" required>
              <option value="">Pilih kuis...</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>{quiz.judul} ({quiz.jumlah_soal} soal)</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <input type="file" ref={fileInputRef} accept=".json,.csv" onChange={handleFileUpload} className="w-full p-3 border border-gray-300 rounded-lg" />
            <p className="text-sm text-gray-500 mt-1">Format: JSON atau CSV</p>
          </div>

          <div className="flex gap-4 mb-4">
            <button onClick={() => downloadTemplate('json')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm">
              📄 Download Template JSON
            </button>
            <button onClick={() => downloadTemplate('csv')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm">
              📊 Download Template CSV
            </button>
          </div>

          {uploadedFileName && (
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <span>✓</span>
              <span>File loaded: {uploadedFileName} ({questions.length} soal)</span>
            </div>
          )}

          <button onClick={importQuestions} disabled={!selectedQuiz || questions.length === 0 || importing} className="qooz-btn qooz-btn-primary w-full disabled:opacity-50">
            {importing ? 'Mengimport...' : 'Import Soal ke Kuis'}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="qooz-card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Preview Soal ({questions.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {questions.map((q, idx) => (
                <div key={idx} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">{q.teks_soal}</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {[q.opsi_1, q.opsi_2, q.opsi_3, q.opsi_4].map((opt, i) => (
                          <div key={i} className={`${optionColors[i]} text-white px-3 py-1.5 rounded text-sm flex items-center gap-2`}>
                            <span className="font-bold">{optionLabels[i]}</span>
                            <span>{opt}</span>
                            {q.jawaban_benar === i + 1 && <span className="ml-auto">✓</span>}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Waktu: {q.waktu_detik} detik</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
