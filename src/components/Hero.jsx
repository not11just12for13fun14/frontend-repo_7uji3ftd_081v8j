import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-white text-xs backdrop-blur pointer-events-none">Discord-based Musical Events</div>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow">Book Artists & Hosts with Ease</h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100/90 leading-relaxed">A premium booking platform with verified creators, smart availability, and instant notifications — built around your Discord community.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#auth" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition">Get Started</a>
            <a href="#directory" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition">Explore Directory</a>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900 pointer-events-none" />
    </section>
  )
}
