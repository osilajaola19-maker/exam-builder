export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animated-gradient">
      <div className="glass rounded-3xl p-12 flex flex-col items-center">
        <div className="spinner mb-6"></div>
        <p className="text-white text-xl font-semibold">Signing you in...</p>
        <p className="text-white/80 text-sm mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}
