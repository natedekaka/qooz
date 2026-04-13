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
| 📝 **Import Soal** | Import soal dari file JSON/CSV |
| 📅 **Jadwal Kuis** | Jadwalkan kuis dengan waktu tertentu |
| 📊 **Rekap Kehadiran** | Catat kehadiran dan skor siswa |
| 🔄 **Duplikasi Kuis** | Salin kuis yang sudah ada |
| 🎨 **Modern UI** | Tampilan menarik dan responsif |
| 🏆 **Leaderboard** | Podium top 3 dan ranking semua player |

---

## 🚀 Cara Install & Jalankan

### Prasyarat
- Podman atau Docker
- Tidak perlu install Node.js terpisah (sudah ada di container)

### Jalankan Aplikasi

```bash
# Clone repository
git clone https://github.com/natedekaka/qooz.git
cd qooz

# Jalankan semua service (DB + API + Web)
podman-compose up -d
```

Selesai! Semua akan otomatis berjalan:

| Service | URL |
|---------|-----|
| 🌐 **Web App** | http://localhost:3000 |
| 🔌 **API** | http://localhost:8080/qooz/api |
| 🗄️ **Database** | http://localhost:8081 (phpMyAdmin) |

---

## 🌐 Akses Aplikasi

| Service | URL | Keterangan |
|---------|-----|------------|
| 🌐 **Frontend** | http://localhost:3000 | Aplikasi utama (laptop) |
| 🌐 **Frontend (HP)** | http://[IP-LAPTOP]:3000 | Akses dari HP |
| 🔌 **API** | http://localhost:8080/qooz/api | Backend PHP |
| 🗄️ **phpMyAdmin** | http://localhost:8081 | Manage database |

### Cek IP Laptop (untuk akses dari HP)

```bash
ip addr show | grep "inet " | grep -v "127.0.0.1"
```

---

## 📖 Menu Aplikasi

### Untuk Guru (Host)

| Menu | URL | Deskripsi |
|------|-----|-----------|
| **Kuis** | /host | Buat & kelola kuis |
| **Import** | /import | Import soal dari JSON/CSV |
| **Jadwal** | /schedule | Jadwalkan kuis |
| **Kehadiran** | /attendance | Rekap kehadiran siswa |

### Untuk Siswa (Player)

1. Buka **http://[IP-LAPTOP]:3000** di HP
2. Pilih **"Tampilan Siswa"**
3. Masukkan **Game PIN** dari guru
4. Masukkan nama dan gabung

---

## 📥 Import Soal

### Format JSON
```json
[
  {
    "teks_soal": "Apa ibukota Indonesia?",
    "opsi_1": "Jakarta",
    "opsi_2": "Bandung",
    "opsi_3": "Surabaya",
    "opsi_4": "Medan",
    "jawaban_benar": 1,
    "waktu_detik": 20
  }
]
```

### Format CSV
```
teks_soal,opsi_1,opsi_2,opsi_3,opsi_4,jawaban_benar,waktu_detik
"Apa ibukota Indonesia?","Jakarta","Bandung","Surabaya","Medan",1,20
```

---

## 🏆 Sistem Skor & Ranking

| Jawaban | Poin | Penjelasan |
|---------|------|------------|
| ✅ Benar (Cepat) | ~1000 | Jawaban benar dengan waktu singkat |
| ✅ Benar (Lambat) | ~500 | Jawaban benar tapi lambat |
| ❌ Salah | 0 | Jawaban salah |

---

## 🔧 Perintah (Commands)

```bash
# Start semua container
podman-compose up -d

# Stop semua container
podman-compose down

# Restart container
podman-compose restart

# Rebuild jika ada perubahan
podman-compose up -d --build

# Lihat log
podman logs qooz-web
podman logs qooz-api
podman logs qooz-db
```

---

## 🛠️ Troubleshooting

### HP tidak bisa akses?

```bash
# Cek IP laptop
ip addr show | grep "inet " | grep -v "127.0.0.1"

# Allow firewall (Linux)
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
```

### Container tidak jalan?

```bash
podman-compose down
podman-compose up -d --build
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
  <img src="https://img.shields.io/badge/Podman-2496ED?style=flat-square&logo=podman" alt="Podman">
</p>

---

## 📝 Requirements

| Software | Versi Minimal |
|----------|--------------|
| Podman/Docker | Latest |
| RAM | 2GB |

---

## 📜 License

MIT License - **Natedekaka** - 2026
