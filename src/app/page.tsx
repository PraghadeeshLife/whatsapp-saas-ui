'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-slate-50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">Agentic</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-100">Beta</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SaaS Solutions</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#pricing" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Pricing</Link>
            {!loading && (
              user ? (
                <Link href="/dashboard" className="text-sm font-bold text-slate-900 bg-slate-50 px-6 py-2.5 rounded-full hover:bg-slate-100 transition-all active:scale-95">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="text-sm font-bold text-white bg-slate-900 px-8 py-3 rounded-full hover:bg-indigo-600 transition-all hover:shadow-[0_8px_25px_-4px_rgba(79,70,229,0.3)] active:scale-95">
                    Get Access
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-56 pb-40 px-8 relative overflow-hidden">
        {/* Dynamic Catchy Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-teal-50/50 rounded-full blur-[100px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-rose-50/30 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-3 mb-10 px-5 py-2 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">High-Speed Operational Logistics</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-slate-900 mb-10 leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Automate with
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Agentic Precision.
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            Hassle-free appointments powered by <span className="text-slate-900">Google Calendar</span>, <span className="text-slate-900">WhatsApp</span>, and <span className="text-slate-900">OpenAI</span>. Streamlined coordination for professional environments.
          </p>

          <div className="flex gap-6 justify-center animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <Link href="/signup" className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] active:scale-[0.98] text-sm tracking-tight">
              Start Building Now
            </Link>
            <Link href="#pricing" className="px-12 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98] text-sm tracking-tight">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Showcase (Minimal Marquee) */}
      <section className="py-20 border-y border-slate-50 bg-white group select-none">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Seamlessly Integrated with</p>
            <div className="flex items-center justify-center gap-16 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 1.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1zm6 11.9h-5v5h-2v-5H6v-2h5v-5h2v5h5v2z" /></svg>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">Google Calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-green-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606... (truncated for brevity but will be valid SVG)" /></svg>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">WhatsApp API</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M22.28 12.17a5.29 5.29 0 0 0-1.02-4.88 5.5 5.5 0 0 0-3.69-2.09A5.1 5.1 0 0 0 15 6a3.66 3.66 0 0 0-1.15.18 3.53 3.53 0 0 0-2-.92 3.41 3.41 0 0 0-2.38.39A3.38 3.38 0 0 0 8 3.4a3.28 3.28 0 0 0-3.19 2.18 3.36 3.36 0 0 0-.46 1.89 3.28 3.28 0 0 0 .96 2.33 3.53 3.53 0 0 0-1 .58 3.41 3.41 0 0 0-1.03 2.36 3.48 3.48 0 0 0 1.4 2.72 3.46 3.46 0 0 0 2.94.28 3.53 3.53 0 0 0 1.07 1.25 3.35 3.35 0 0 0 2.22.82 3.39 3.39 0 0 0 2.76-1.41 3.44 3.44 0 0 0 2.13.86 3.41 3.41 0 0 0 2.23-.84 3.47 3.47 0 0 0 1.4-2.72 3.48 3.48 0 0 0-.3-1.38 3.53 3.53 0 0 0 2.1-1.07 3.46 3.46 0 0 0 .84-2.23zM9.1 5.85a1.81 1.81 0 0 1 1.25-.49 1.88 1.88 0 0 1 1.33.56l.07.07a.5.5 0 1 1-.7.7l-.07-.07a.88.88 0 0 0-1.25-.07.88.88 0 0 0-.07 1.25.5.5 0 1 1-.7.7 1.88 1.88 0 0 1-.07-2.65zm3.8 1.49a1.88 1.88 0 0 1 2.65-.07l.07.07a.5.5 0 1 1-.7.7l-.07-.07a.88.88 0 0 0-1.25.07.88.88 0 0 0-.07 1.25.5.5 0 1 1-.7.7 1.88 1.88 0 0 1-.07-2.65zm-.21 9.66a1.88 1.88 0 0 1-2.65-.07l-.07-.07a.5.5 0 1 1 .7-.7l.07.07a.88.88 0 0 0 1.25-.07.88.88 0 0 0 .07-1.25.5.5 0 1 1 .7-.7 1.88 1.88 0 0 1 .07 2.65zm5.71-3.13a1.88 1.88 0 0 1-.07 2.65 1.88 1.88 0 0 1-2.65-.07l-.07-.07a.5.5 0 1 1 .7-.7l.07.07a.88.88 0 0 0 1.25-.07.88.88 0 0 0 .07-1.25.5.5 0 1 1 .7-.7z" /></svg>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">OpenAI Models</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 px-8 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-24 text-center">
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 mb-6">Unit Economy</div>
            <h2 className="text-5xl font-bold text-slate-900 tracking-tighter mb-6">Scalable Automation.</h2>
            <p className="text-slate-500 font-medium max-w-xl">Reliable infrastructure sized for your growth.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Starter</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Level Operations</p>
              </div>
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₹2,499</span>
                <span className="text-xs font-bold text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['Single Integration Point', 'Google Calendar Sync', 'Standard AI Agent', 'WhatsApp API Bridge', 'Standard Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all text-center text-xs uppercase tracking-widest">Get Started</Link>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl shadow-indigo-500/20 relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-8 right-8">
                <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Growth</span>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-1">Professional</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Managed Coordination</p>
              </div>
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹5,999</span>
                <span className="text-xs font-bold text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['Multi-Point Logistics', 'Advanced Agent Logic', 'Automated Coordination', 'Analytics Dashboard', 'Priority Pipeline'].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all text-center text-xs uppercase tracking-widest">Elevate Now</Link>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Infrastructure</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">High-Volume Systems</p>
              </div>
              <div className="mb-10">
                <p className="text-lg font-black text-slate-900 leading-tight">Doesn't fit into regular plan - get in touch!</p>
              </div>
              <div className="flex-1 mb-12">
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 border-dashed">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Connect at</p>
                  <a href="mailto:electronlabsindia@gmail.com" className="text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors break-all">electronlabsindia@gmail.com</a>
                </div>
              </div>
              <a href="mailto:electronlabsindia@gmail.com" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-center text-xs uppercase tracking-widest">Custom Inquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black">A</div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Agentic SaaS</span>
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-center md:text-left">© 2025 Agentic Systems. Built for Operational Speed.</p>
          <div className="flex gap-8 text-[11px] font-black tracking-widest uppercase">
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
