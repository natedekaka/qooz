# 🎯 Qooz

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-8B5CF6?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Built%20with-Next.js-000000?style=for-the-badge" alt="Next.js">
  <img src="https://img.shields.io/badge/Backend-PHP%208.2-777BB4?style=for-the-badge" alt="PHP">
</p>

> **Kuis Interaktif Real-Time** - Buat pengalaman belajar jadi lebih seru!

Qooz adalah platform kuis real-time yang memungkinkan guru membuat dan mengelola kuis sementara siswa bisa menjawab langsung melalui HP atau laptop mereka. Terinspirasi dari Quizizz, tapi lebih simpel dan bisa dijalankan di mana saja! 🚀

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|-------|-----------|
| 🎮 **Real-Time** | Siswa menjawab dan skor langsung tampil |
| 📱 **Multi-Device** | Host di laptop, player di HP |
| ⚡ **Fast Response** | Skor berdasarkan kecepatan jawaban |
| 🎨 **Modern UI** | Tampilan menarik dan responsif |
| 🔒 **Anti-Duplicate** | Nama player tidak bisa sama |
| 📊 **Live Chart** | Grafik jawaban dan skor tampil langsung |
| 🏆 **Leaderboard** | Podium top 3 dan ranking semua player |
| 🔧 **Easy Install** | Install dalam hitungan menit |

---

## 🚀 Cara Install & Jalankan

### Prasyarat
- Node.js 20+
- Podman atau Docker
- npm atau yarn

### Langkah 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/natedekaka/qooz.git
cd qooz

# Install dependencies
npm install
```

### Langkah 2: Jalankan Backend (API & Database)

```bash
# Jalankan container (API + Database + phpMyAdmin)
podman-compose up -d
```

### Langkah 3: Jalankan Frontend

```bash
# Jalankan Next.js development server
npm run dev
```

Terminal akan menampilkan IP lokal:
```
========================================
  📱 Access from HP: http://192.168.x.x:3000
========================================
```

---

## 🌐 Akses Aplikasi

| Service | URL | Keterangan |
|---------|-----|------------|
| 🌐 **Frontend** | http://localhost:3000 | Aplikasi utama (laptop) |
| 🌐 **Frontend (HP)** | http://[IP-LAPTOP]:3000 | Akses dari HP |
| 🔌 **API** | http://localhost:8080/qooz/api | Backend PHP |
| 🗄️ **phpMyAdmin** | http://localhost:8081 | Manage database |

### Cek IP Laptop

```bash
hostname -I
```

---

## 👥 Cara Penggunaan

### Untuk Guru (Host)

1. Buka **http://localhost:3000/host**
2. Login atau daftar akun
3. Klik **"+ Buat Kuis Baru"**
4. Tambahkan pertanyaan (soal pilihan ganda)
5. Klik **"Mulai Kuis"**
6. Berikan **Game PIN** ke siswa
7. Klik **"Akhiri & Hitung Skor"** setiap selesai soal
8. Lihat hasil dengan **grafik jawaban** dan **ranking**
9. Lanjutkan ke soal berikutnya!

### Untuk Siswa (Player)

1. Buka browser di HP: **http://192.168.x.x:3000**
2. Pilih **"Tampilan Siswa"**
3. Masukkan **Game PIN** dari guru
4. Masukkan nama kamu
5. Klik **"Gabung"**
6. Tunggu guru memulai kuis
7. Jawab pertanyaan dengan cepat untuk dapat skor tinggi!

---

## 🏆 Sistem Skor & Ranking

| Jawaban | Poin | Penjelasan |
|---------|------|------------|
| ✅ Benar (Cepat) | ~1000 | Jawaban benar dengan waktu singkat |
| ✅ Benar (Lambat) | ~500 | Jawaban benar tapi lambat |
| ❌ Salah | 0 | Jawaban salah |

### Fitur Ranking
- 🏆 **Podium Top 3** dengan animasi (juara 1, 2, 3)
- 📊 **Grafik Skor** semua player dengan bar chart
- 📈 **Stats**: total player, skor tertinggi, rata-rata

---

## 🔧 Perintah (Commands)

```bash
# Container commands
podman-compose up -d       # Start semua container
podman-compose down       # Stop semua container
podman-compose restart    # Restart container
podman logs qooz-api      # Lihat log API
podman logs qooz-db       # Lihat log database

# Frontend commands
npm run dev               # Start development server
npm run build             # Build production
npm run lint              # Run linter
```

---

## 🛠️ Troubleshooting

### HP tidak bisa akses?

```bash
# 1. Cek IP laptop
hostname -I

# 2. Allow firewall (Linux)
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp

# 3. Atau disable firewall sementara
sudo ufw disable
```

### Container tidak jalan?

```bash
# Rebuild dan start ulang
podman-compose down
podman-compose up -d --build

# Cek log
podman logs qooz-api
podman logs qooz-db
```

### Port sudah terpakai?

```bash
# Cek proses di port
lsof -i:3000
lsof -i:8080

# Kill proses
kill -9 <PID>

# Atau restart container
podman-compose restart
```

---

## 🏗️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=flat-square&logo=php" alt="PHP">
  <img src="https://img.shields.io/badge/MariaDB-10.11-003545?style=flat-square&logo=mariadb" alt="MariaDB">
  <img src="https://img.shields.io/badge/Docker-Podman-2496ED?style=flat-square&logo=docker" alt="Docker">
</p>

---

## 📝 Requirements

| Software | Versi Minimal |
|----------|--------------|
| Node.js | 20+ |
| npm | 10+ |
| Podman/Docker | Latest |
| RAM | 2GB |
| Storage | 1GB |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

---

## 📜 License

Project ini dilisensikan di bawah MIT License.

---

## 👨‍💻 Dibuat dengan ❤️ oleh

**Natedekaka** - 2026

---

<p align="center">
  <strong>⭐ Jika Qooz bermanfaat, jangan lupa kasih star di GitHub!</strong>
</p>
