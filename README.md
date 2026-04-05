# Qooz - Quiz App

Aplikasi kuis interaktif terinspirasi dari Quizizz.

## Requirements

- Node.js 20+
- Podman atau Docker
- npm atau yarn

## Quick Start

```bash
# Jalankan semua service
./install.sh start

# Atau langkah demi langkah:
./install.sh install   # Install dependencies + start API
./install.sh web       # Start web dev server
```

## Akses

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| API | http://localhost:8090/qooz/api |
| phpMyAdmin | http://localhost:8091 |

## Akses dari HP

Pastikan HP dan laptop satu jaringan WiFi yang sama, lalu buka:
```
http://192.168.x.x:3000
```
(Ganti dengan IP laptop kamu)

Cek IP laptop: `./install.sh status`

## Commands

```bash
./install.sh start    # Start everything
./install.sh install  # Install deps + start API
./install.sh api      # Start API & DB only
./install.sh web      # Start web server only
./install.sh stop     # Stop all services
./install.sh status   # Show status
```

## Development

```bash
# Manual start
npm install
npm run dev

# Akses web API
# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8090/qooz/api
```

## Troubleshooting

**HP tidak bisa akses:**
```bash
# Cek firewall
sudo firewall-cmd --list-ports
# Atau disable sementara:
sudo ufw disable
```

**Container tidak jalan:**
```bash
podman compose down
podman compose up -d
podman logs qooz-api
```
