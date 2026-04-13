'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Quiz } from '@/types'

interface Template {
  id: string
  judul: string
  deskripsi: string
  kategori: string
  jumlah_soal: number
  is_public: boolean
  created_at: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUseModal, setShowUseModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState({ judul: '', deskripsi: '', kategori: '', isPublic: false })
  const [newQuizJudul, setNewQuizJudul] = useState('')
  
  const router = useRouter()

  const checkUser = () => {
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userStr)
    fetchTemplates(user.id)
  }

  const fetchTemplates = async (userId: string) => {
    try {
      const response = await api.template.list(userId, true)
      if (response.templates) {
        setTemplates(response.templates)
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkUser()
  }, [])

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      const response = await api.template.create(user.id, newTemplate.judul, newTemplate.deskripsi, newTemplate.kategori, newTemplate.isPublic)
      if (response.success) {
        setShowCreateModal(false)
        setNewTemplate({ judul: '', deskripsi: '', kategori: '', isPublic: false })
        fetchTemplates(user.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const useTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userStr = localStorage.getItem('qooz_user')
    if (!userStr || !selectedTemplate) return
    const user = JSON.parse(userStr)

    try {
      const response = await api.template.useTemplate(user.id, selectedTemplate.id, newQuizJudul)
      if (response.success && response.quiz) {
        setShowUseModal(false)
        setNewQuizJudul('')
        router.push(`/host/${response.quiz.id}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Yakin ingin menghapus template ini?')) return

    const userStr = localStorage.getItem('qooz_user')
    if (!userStr) return
    const user = JSON.parse(userStr)

    try {
      await api.template.delete(user.id, id)
      setTemplates(templates.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
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
            <p className="text-white/80 mt-1">Template Kuis</p>
          </div>
          <div className="flex gap-2">
            <Link href="/host" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
              Kuis
            </Link>
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
              Keluar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="qooz-card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <div className="text-4xl font-bold">{templates.length}</div>
            <div className="text-blue-100">Total Template</div>
          </div>
          <div className="qooz-card">
            <button onClick={() => setShowCreateModal(true)} className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors min-h-[100px]">
              <span className="text-4xl mb-2">+</span>
              <span className="font-semibold">Buat Template Baru</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Template Anda</h2>
        
        {templates.length === 0 ? (
          <div className="qooz-card text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada template</p>
            <p className="text-gray-400 text-sm mb-4">Buat template dari kuis yang sudah ada di menu Kuis</p>
            <Link href="/host" className="qooz-btn qooz-btn-primary">
              Buat Kuis Dulu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="qooz-card hover:scale-105 transition-transform group relative">
                <button onClick={() => deleteTemplate(template.id)} className="absolute top-4 right-4 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{template.judul}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {template.deskripsi || 'Tidak ada deskripsi'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  {template.kategori && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {template.kategori}
                    </span>
                  )}
                  {template.is_public && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Publik
                    </span>
                  )}
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {template.jumlah_soal} soal
                  </span>
                </div>
                <button onClick={() => { setSelectedTemplate(template); setShowUseModal(true) }} className="qooz-btn qooz-btn-primary w-full">
                  Gunakan Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="qooz-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buat Template Baru</h2>
            <form onSubmit={createTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Template</label>
                <input type="text" value={newTemplate.judul} onChange={(e) => setNewTemplate({...newTemplate, judul: e.target.value})} className="qooz-input" placeholder="Contoh: Template UTS Matematika" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={newTemplate.deskripsi} onChange={(e) => setNewTemplate({...newTemplate, deskripsi: e.target.value})} className="qooz-input" placeholder="Deskripsi template..." rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select value={newTemplate.kategori} onChange={(e) => setNewTemplate({...newTemplate, kategori: e.target.value})} className="qooz-input">
                  <option value="">Pilih kategori...</option>
                  <option value="Matematika">Matematika</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Informatika">Informatika</option>
                  <option value="PKn">PKn</option>
                  <option value="Agama">Agama</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPublic" checked={newTemplate.isPublic} onChange={(e) => setNewTemplate({...newTemplate, isPublic: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="isPublic" className="text-sm text-gray-700">Jadikan template publik</label>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700">Batal</button>
                <button type="submit" className="flex-1 qooz-btn qooz-btn-primary">Buat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUseModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="qooz-card w-full max-w-md animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gunakan Template</h2>
            <p className="text-gray-600 mb-4">Template: {selectedTemplate.judul}</p>
            <form onSubmit={useTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kuis Baru</label>
                <input type="text" value={newQuizJudul} onChange={(e) => setNewQuizJudul(e.target.value)} className="qooz-input" placeholder="Masukkan judul kuis" required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowUseModal(false); setNewQuizJudul('') }} className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700">Batal</button>
                <button type="submit" className="flex-1 qooz-btn qooz-btn-primary">Buat Kuis</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
