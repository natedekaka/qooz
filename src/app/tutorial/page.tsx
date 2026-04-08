'use client'

import Link from 'next/link'

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 p-4 md:p-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Tutorial Qooz</h1>
          <Link href="/" className="text-white underline hover:text-purple-200">
            ← Kembali
          </Link>
        </div>

        <div className="space-y-6">
          {/* Cara Install */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🚀 Cara Install & Jalankan</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-purple-700">Langkah 1: Clone & Install</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`git clone https://github.com/natedekaka/qooz.git
cd qooz
npm install`}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700">Langkah 2: Jalankan Backend (Docker)</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`podman-compose up -d`}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700">Langkah 3: Jalankan Frontend</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`npm run dev`}
                </pre>
                <p className="text-sm text-gray-500 mt-2">
                  Terminal akan menampilkan IP untuk akses dari HP
                </p>
              </div>
            </div>
          </div>

          {/* Akses Aplikasi */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🌐 Akses Aplikasi</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">LAPTOP</span>
                <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">HP</span>
                <code className="bg-gray-100 px-2 py-1 rounded">http://[IP-LAPTOP]:3000</code>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cek IP: <code className="bg-gray-100 px-1">hostname -I</code>
              </p>
            </div>
          </div>

          {/* Info Qooz */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Apa itu Qooz?</h2>
            <p className="text-gray-600">
              Qooz adalah aplikasi kuis interaktif terinspirasi dari Quizizz untuk pembelajaran di kelas. 
              Guru membuat kuis dan siswa menjawab melalui HP/laptop secara real-time dengan fitur 
              grafik jawaban live dan podium juara!
            </p>
          </div>

          {/* Cara Guru */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📺 Cara Jadi Guru (Host)</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">1.</span>
                <span>Buka <Link href="/host" className="text-purple-600 underline">http://localhost:3000/host</Link></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">2.</span>
                <span>Login atau daftar akun guru</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">3.</span>
                <span>Klik <strong>&quot;+ Buat Kuis Baru&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">4.</span>
                <span>Masukkan judul kuis (contoh: &quot;Kuis IPA Kelas 5&quot;)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">5.</span>
                <span>Klik <strong>&quot;+ Tambah Soal&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">6.</span>
                <span>Isi pertanyaan dan pilihan jawaban (A, B, C, D)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">7.</span>
                <span>Pilih jawaban yang benar & waktu per soal</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">8.</span>
                <span>Klik <strong>&quot;Mulai Kuis&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">9.</span>
                <span>Berikan <strong>Game PIN</strong> kepada siswa</span>
              </li>
            </ol>
          </div>

          {/* Cara Siswa */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📱 Cara Jadi Siswa (Player)</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Pastikan HP terhubung ke WiFi yang sama dengan laptop server</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Buka browser di HP: <strong>http://[IP-LAPTOP]:3000</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Klik <strong>&quot;Tampilan Siswa&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Masukkan <strong>Game PIN</strong> dari guru</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">5.</span>
                <span>Masukkan nama kamu, klik <strong>&quot;Gabung&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">6.</span>
                <span>Tunggu guru memulai kuis</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">7.</span>
                <span>Klik opsi (A/B/C/D) untuk menjawab</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">8.</span>
                <span>Lihat hasil dan skor!</span>
              </li>
            </ol>
          </div>

          {/* Sistem Skor */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🏆 Sistem Skor & Ranking</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">✅</span>
                <span>Benar +1000 poin (cepat) / +500 poin (lambat)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">❌</span>
                <span>Salah = 0 poin</span>
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  📊 Setelah game selesai, lihat <strong>Podium Top 3</strong> dan <strong>Grafik Skor</strong> semua player!
                </p>
              </div>
            </div>
          </div>

          {/* Cara Main Game */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🎮 Cara Memulai Game</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">1.</span>
                <span>Siswa sudah bergabung (lihat di daftar pemain)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">2.</span>
                <span>Klik <strong>&quot;Mulai Kuis&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">3.</span>
                <span>Hitung mundur 3 detik, soal pertama muncul</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">4.</span>
                <span>Siswa menjawab, waktu berjalan</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">5.</span>
                <span>Setelah waktu habis, klik <strong>&quot;Akhiri & Hitung Skor&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">6.</span>
                <span>Lihat hasil: grafik jawaban & ranking top 3</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">7.</span>
                <span>Klik <strong>&quot;Soal Berikutnya&quot;</strong> atau <strong>&quot;Selesai&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">8.</span>
                <span>Game selesai - lihat <strong>Podium & Leaderboard!</strong></span>
              </li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🔧 Troubleshooting</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">⚠️ Skor selalu 0</h3>
                <p className="text-gray-600 mt-1">
                  Wajib klik tombol <strong>&quot;Akhiri & Hitung Skor&quot;</strong> setelah waktu soal habis!
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">📱 HP tidak bisa akses</h3>
                <ul className="text-gray-600 mt-1 list-disc list-inside space-y-1">
                  <li>Pastikan HP & laptop satu jaringan WiFi</li>
                  <li>Buka: <code className="bg-gray-100 px-1">http://[IP-LAPTOP]:3000</code></li>
                  <li>Allow firewall:
                    <code className="bg-gray-100 px-1 ml-1">sudo ufw allow 3000/tcp</code>
                    <code className="bg-gray-100 px-1 ml-1">sudo ufw allow 8080/tcp</code>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">🔌 API error / tidak bisa login</h3>
                <p className="text-gray-600 mt-1">
                  Pastikan container running: <code className="bg-gray-100 px-1">podman-compose up -d</code>
                </p>
              </div>
            </div>
          </div>

          {/* Command */}
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">💻 Command Penting</h2>
            <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
              <p><span className="text-yellow-400"># Start container</span></p>
              <p>podman-compose up -d</p>
              <p className="mt-2"><span className="text-yellow-400"># Stop container</span></p>
              <p>podman-compose down</p>
              <p className="mt-2"><span className="text-yellow-400"># Start frontend</span></p>
              <p>npm run dev</p>
              <p className="mt-2"><span className="text-yellow-400"># Cek log</span></p>
              <p>podman logs qooz-api</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-white underline hover:text-purple-200">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
