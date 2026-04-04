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
          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🚀 Cara Install & Menjalankan</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-purple-700"> Menggunakan Podman/Docker:</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`# Clone atau masuk ke direktori project
cd ~/qooz

# Build dan jalankan container
podman-compose up -d

# Jika ada masalah, bisa rebuild:
podman-compose build
podman-compose up -d`}</pre>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700"> Tanpa Docker (langsung):</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`# Install dependencies
cd ~/qooz
npm install

# Jalankan development server
npm run dev

# Atau untuk production:
npm run build
npm run start`}</pre>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700"> Akses Aplikasi:</h3>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li><strong>Web App:</strong> http://192.168.18.126:3000 atau http://localhost:3000</li>
                  <li><strong>API:</strong> http://localhost:8090</li>
                  <li><strong>phpMyAdmin:</strong> http://localhost:8091 (root / qooz_root_pass)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700"> Login Default:</h3>
                <p className="ml-4 mt-1">
                  Email: <code className="bg-gray-100 px-1">guru@test.com</code><br/>
                  Password: <code className="bg-gray-100 px-1">guru123</code>
                </p>
              </div>
            </div>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Apa itu Qooz?</h2>
            <p className="text-gray-600">
              Qooz adalah aplikasi kuis interaktif mirip Kahoot untuk pembelajaran di kelas. 
              Guru membuat kuis dan siswa menjawab melalui HP/laptop secara real-time.
            </p>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📺 Cara Jadi Guru (Host)</h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Buka <strong>http://[IP-SERVER]:3000/host</strong> di browser (ganti [IP-SERVER] dengan IP server Anda)</li>
              <li>Login: Email <code className="bg-gray-100 px-1">guru@test.com</code>, Password <code className="bg-gray-100 px-1">guru123</code></li>
              <li>Klik <strong>&quot;+ Buat Kuis Baru&quot;</strong></li>
              <li>Masukkan judul kuis (contoh: &quot;Kuis Informatika Kelas X&quot;)</li>
              <li>Klik <strong>&quot;+ Tambah Soal&quot;</strong> untuk menambah pertanyaan</li>
              <li>Isi pertanyaan dan opsi jawaban (A, B, C, D)</li>
              <li>Pilih jawaban yang benar (1=A, 2=B, 3=C, 4=D)</li>
              <li>Tentukan waktu per soal (dalam detik)</li>
              <li>Klik <strong>&quot;Simpan&quot;</strong> untuk menyimpan soal</li>
              <li>Ulangi untuk menambah soal lainnya</li>
              <li>Klik <strong>&quot;Mulai Kuis&quot;</strong></li>
              <li>Berikan <strong>Game PIN</strong> kepada siswa</li>
            </ol>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📱 Cara Jadi Siswa (Player)</h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Pastikan HP/laptop terhubung ke jaringan WiFi yang sama dengan server</li>
              <li>Buka <strong>http://[IP-SERVER]:3000/play</strong> di browser HP (ganti [IP-SERVER] dengan IP server)</li>
              <li>Masukkan <strong>Game PIN</strong> dari guru</li>
              <li>Masukkan nama kamu</li>
              <li>Klik <strong>&quot;Gabung&quot;</strong></li>
              <li>Tunggu guru memulai kuis</li>
              <li>Klik salah satu opsi (A/B/C/D) untuk menjawab</li>
              <li>Lihat hasil: &quot;BENAR!&quot; atau &quot;SALAH!&quot;</li>
              <li>Selesai, lihat skor dan peringkat!</li>
            </ol>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🏆 Cara Kerja Skor</h2>
            <ul className="space-y-1 text-gray-700 list-disc list-inside ml-4">
              <li><strong>Jawaban benar + cepat</strong> = skor tinggi (max 1000 poin)</li>
              <li><strong>Jawaban benar + lambat</strong> = skor rendah (min 500 poin)</li>
              <li><strong>Jawaban salah</strong> = 0 poin</li>
            </ul>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🎮 Cara Memulai Game</h2>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Siswa sudah bergabung (lihat di daftar pemain)</li>
              <li>Klik <strong>&quot;Mulai Kuis&quot;</strong></li>
              <li>Ada hitung mundur 3 detik</li>
              <li>Soal pertama muncul</li>
              <li>Siswa menjawab dengan klik opsi A/B/C/D</li>
              <li><strong>Setelah waktu habis (atau semua siswa sudah menjawab)</strong>:</li>
              <ul className="ml-6 list-disc list-inside text-purple-700">
                <li>Klik <strong>&quot;Akhiri & Hitung Skor&quot;</strong> untuk menghitung skor siswa</li>
              </ul>
              <li>Lihat hasil sementara (siapa benar/salah)</li>
              <li>Klik <strong>&quot;Soal Berikutnya&quot;</strong> untuk lanjut ke soal berikutnya</li>
              <li>Ulangi hingga semua soal selesai</li>
              <li>Klik <strong>&quot;Selesai&quot;</strong> untuk lihat podium/leaderboard</li>
            </ol>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">🔧 Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Skor selalu 0</h3>
                <p className="text-gray-600">
                  <strong>Wajib klik tombol &quot;Akhiri & Hitung Skor&quot; setelah waktu soal habis!</strong><br/>
                  Tanpa mengklik tombol ini, skor siswa tidak akan dihitung. Tombol ini ada di layar game guru setelah setiap soal.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tidak bisa akses dari HP</h3>
                <p className="text-gray-600">Pastikan HP terhubung ke jaringan WiFi yang sama dengan server.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Siswa tidak bisa gabung</h3>
                <p className="text-gray-600">Pastikan Game PIN benar dan game belum selesai.</p>
              </div>
            </div>
          </div>

          <div className="qooz-card">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📊 Kapasitas</h2>
            <table className="w-full text-gray-700">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Siswa</th>
                  <th className="p-2 text-left">RAM</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2">10-20</td><td className="p-2">1 GB</td><td className="p-2 text-green-600">✅ Lancar</td></tr>
                <tr className="bg-gray-50"><td className="p-2">30-50</td><td className="p-2">2 GB</td><td className="p-2 text-green-600">✅ Lancar</td></tr>
                <tr><td className="p-2">50+</td><td className="p-2">4 GB+</td><td className="p-2 text-yellow-600">⚠️ Perlu server kuat</td></tr>
              </tbody>
            </table>
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
