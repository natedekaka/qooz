# Qooz - Aplikasi Kuis Interaktif Gratis untuk Pembelajaran Lebih Seru!

![Qooz - Kuis Interaktif Real-Time](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgPHFBYQpFOAqhKNPvqCH_RHYfLQ1kng3xTRzx0vPQq0vM5c3u8wJ7b9m6KXQ8L6cVQvJjWv8xH0dI5V5a8H2kJ9m0Q/s1600/qooz-banner.jpg)

## 📌 Apa itu Qooz?

**Qooz** adalah aplikasi kuis interaktif real-time yang memungkinkan guru membuat kuis dan siswa bisa menjawab langsung melalui HP atau laptop mereka. Aplikasi ini terinspirasi dari **Quizizz**, tapi lebih **simpel, gratis, dan mudah digunakan**!

Bayangkan: satu laptop guru bisa menampilkan soal, dan seluruh siswa di kelas bisa menjawab bersamaan melalui HP mereka. Skor langsung muncul! Seru, kan? 🎮

---

## ✨ Fitur Unggulan Qooz

| Fitur | Keterangan |
|-------|-----------|
| 🎮 **Real-Time** | Siswa menjawab dan skor langsung tampil di layar |
| 📱 **Multi-Device** | Host di laptop, player di HP |
| ⚡ **Fast Response** | Skor berdasarkan kecepatan jawaban |
| 🎨 **Modern UI** | Tampilan menarik dan responsif |
| 🔒 **Anti-Duplicate** | Nama player tidak bisa sama |
| 📊 **Live Chart** | Grafik jawaban tampil langsung |
| 🔧 **Mudah Diinstall** | Install dalam hitungan menit |

---

## 🎯 Siapa yang Bisa Menggunakan Qooz?

### 1. **Guru & Pendidik**
- Buat kuis untuk berbagai mata pelajaran
- Monitoring progress siswa secara real-time
- Buat pembelajaran jadi lebih interaktif

### 2. **Pelatih & Fasilitator**
- Training korporat
- Workshop interaktif
- Ice breaking session

### 3. **Semua Orang!**
- Kuis keluarga
- Game edukasi anak
- Trivia party

---

## 💰 Berapa Harganya?

**GRATIS! Sepenuhnya Gratis!**

Qooz adalah aplikasi open-source yang bisa digunakan siapa saja tanpa perlu membayar sepeser pun. Mau dipakai di sekolah, rumah, atau kantor? Silakan!

---

## 📥 Cara Download & Install

### Prasyarat
- Laptop/Komputer
- Node.js 20+
- Podman atau Docker

### Langkah Instalasi:

**1. Clone Repository**
```
git clone https://github.com/natedekaka/qooz.git
```

**2. Masuk ke Folder**
```
cd qooz
```

**3. Install Dependencies**
```
npm install
```

**4. Jalankan Aplikasi**
```
./install.sh start
```

**5. Selesai!** Buka browser dan akses:
- **Web App:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8091 (untuk manajemen database)

---

## 📖 Cara Penggunaan

### 🎓 Untuk Guru (Host)

1. Buka **http://localhost:3000/host**
2. Login atau daftar akun
3. Klik **"+ Buat Kuis Baru"**
4. Tambahkan pertanyaan (soal pilihan ganda A, B, C, D)
5. Klik **"Mulai Kuis"**
6. Berikan **Game PIN** ke siswa
7. Klik **"Akhiri & Hitung Skor"** setiap selesai soal
8. Lihat hasilnya!

### 📱 Untuk Siswa (Player)

1. Buka browser di HP: **http://192.168.x.x:3000**
2. Pilih **"Tampilan Siswa"**
3. Masukkan **Game PIN** dari guru
4. Masukkan nama kamu
5. Klik **"Gabung"**
6. Tunggu guru memulai kuis
7. Jawab pertanyaan dengan cepat untuk dapat skor tinggi!

---

## 🏆 Sistem Skor

| Jawaban | Poin | Penjelasan |
|---------|------|------------|
| ✅ Benar (Cepat) | ~1000 | Jawaban benar dengan waktu singkat |
| ✅ Benar (Lambat) | ~500 | Jawaban benar tapi lambat |
| ❌ Salah | 0 | Jawaban salah |

> 💡 **Tips:** Semakin cepat menjawab dengan benar, semakin tinggi skor yang kamu dapatkan!

---

## 💻 Screenshot Tampilan

### Tampilan Host (Guru)
- Dashboard modern dengan tombol besar
- Game PIN yang jelas dan mudah dibaca
- Grafik jawaban real-time
- Leaderboard podium untuk pemenang

### Tampilan Player (Siswa)
- Tombol jawaban besar dan responsif
- Timer countdown yang menarik
- Feedback langsung (BENAR/SALAH)
- Skor dan peringkat实时

---

## 🔧 Kebutuhan Sistem

| Komponen | Minimal |
|----------|---------|
| Node.js | 20+ |
| RAM | 2 GB |
| Storage | 1 GB |
| OS | Windows, Mac, Linux |

---

## ❓ FAQ (Pertanyaan Umum)

**Q: Apakah Qooz bisa dipakai offline?**
A: Ya! Qooz berjalan di server lokal, jadi bisa digunakan tanpa koneksi internet.

**Q: Berapa maksimal siswa yang bisa join?**
A: Secara teori tidak terbatas, tapi disarankan maksimal 50-100 siswa untuk pengalaman terbaik.

**Q: Apakah bisa custom soal?**
A: Ya! Guru bisa membuat soal sendiri dengan pilihan ganda A, B, C, D.

**Q: Apakah ada fitur timer per soal?**
A: Ya! Setiap soal bisa diatur waktu sendiri-sendiri.

---

## 🌟 Testimoni

> "Qooz membuat belajar jadi lebih seru! Siswa saya jadi lebih semangat menjawab kuis." - **Guru SD, Bandung**

> "Aplikasi yang simpel tapi powerful. Mudah diinstall dan digunakan." - **Pelajar, Jakarta**

---

## 📚 Tech Stack

Qooz dibangun dengan teknologi modern:

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** PHP 8.2, MariaDB
- **Container:** Docker/Podman
- **DE:** Hyprland (Wayland)

---

## 🤝 Kontribusi & Lisensi

Qooz adalah proyek **open-source** di bawah lisensi **MIT**. Kamu bisa:

- ⭐ Berikan star di GitHub
- 🍴 Fork dan modifikasi sesuai kebutuhan
- 📝 Laporkan bug atau minta fitur baru
- 💪 Contribute kode

**GitHub Repo:** https://github.com/natedekaka/qooz

---

## 🚀 Yuk Coba Qooz Sekarang!

Jangan sampai ketinggalan! Qooz adalah solusi sempurna untuk membuat pembelajaran jadi lebih interaktif dan menyenangkan.

### 🔗 Link Penting:

| Resource | Link |
|----------|------|
| 📥 **Download/Clone** | https://github.com/natedekaka/qooz |
| 📖 **Dokumentasi** | https://github.com/natedekaka/qooz/blob/main/README.md |

---

**Tags:** #Qooz #AplikasiKuis #PembelajaranInteraktif #QuizOnline #EdTech #OpenSource #Gratis #QuizizzIndonesia

---

*Artikel ini dibuat untuk membantu guru dan pendidik Indonesia dalam menggunakan teknologi untuk pembelajaran yang lebih baik.*
