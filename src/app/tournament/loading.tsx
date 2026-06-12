export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
      <div className="text-white text-xl">Memuat...</div>
    </div>
  )
}
