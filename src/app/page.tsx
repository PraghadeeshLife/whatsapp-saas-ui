'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">Simplify</span>
                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-100">Beta</span>
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Smart Booking</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#pricing" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
            {!loading && (
              user ? (
                <Link href="/dashboard" className="text-sm font-bold text-slate-900 bg-slate-100 px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all active:scale-95">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="text-sm font-bold text-white bg-slate-900 px-8 py-3 rounded-full hover:bg-indigo-600 transition-all hover:shadow-[0_8px_25px_-4px_rgba(79,70,229,0.3)] active:scale-95">
                    Start Now
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
            <Link href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-600">Pricing</Link>
            {!loading && (
              user ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-900 bg-slate-100 px-6 py-4 rounded-2xl text-center">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-600 py-2">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white bg-slate-900 px-8 py-4 rounded-2xl text-center">
                    Start Now
                  </Link>
                </>
              )
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 md:pt-56 pb-24 md:pb-40 px-6 md:px-8 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] md:w-[60%] h-[70%] bg-indigo-50/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[60%] md:w-[50%] h-[60%] bg-teal-50/50 rounded-full blur-[80px] md:blur-[100px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-3 mb-8 md:mb-10 px-4 md:px-5 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-slate-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Effortless Appointments for Everyone</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 md:mb-10 leading-[1.1] md:leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Bookings made
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {' '}Smart & Simple.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 mb-10 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            Automate your appointments using <span className="text-slate-900">Google Calendar</span>, <span className="text-slate-900">WhatsApp</span>, and <span className="text-slate-900">Smart AI</span>. Built for business owners who want to save time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <Link href="/signup" className="px-10 md:px-12 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] active:scale-[0.98] text-sm tracking-tight text-center">
              Get Started for Free
            </Link>
            <Link href="#pricing" className="px-10 md:px-12 py-4 md:py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98] text-sm tracking-tight text-center">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Showcase (Refined with Real Logos) */}
      <section className="py-16 md:py-20 border-y border-slate-100 bg-white group select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Works seamlessly with</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-all duration-700 px-4">
              <div className="flex items-center gap-3">
                <img src="https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png" alt="Google Calendar" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-700">Google Calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://www.vectorlogo.zone/logos/whatsapp/whatsapp-icon.svg" alt="WhatsApp" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-700">WhatsApp</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-slate-700">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M22.28 7.53a5.24 5.24 0 0 0-1.12-3.1 5.25 5.25 0 0 0-4.14-2.15 5.25 5.25 0 0 0-4.75 3.01 5.25 5.25 0 0 0-4.75-3.01 5.25 5.25 0 0 0-4.14 2.15 5.25 5.25 0 0 0-1.12 3.1 5.25 5.25 0 0 0 1.23 3.32 5.25 5.25 0 0 0-1.23 3.32 5.25 5.25 0 0 0 1.12 3.1 5.25 5.25 0 0 0 4.14 2.15 5.25 5.25 0 0 0 4.75-3.01 5.25 5.25 0 0 0 4.75 3.01 5.25 5.25 0 0 0 4.14-2.15 5.25 5.25 0 0 0 1.12-3.1 5.25 5.25 0 0 0-1.23-3.32 5.25 5.25 0 0 0 1.23-3.32zm-2.07 6.44c-.11.19-.24.37-.38.54l-3.32-1.92v-3.79l3.32-1.92c.14.17.27.35.38.54.34.58.52 1.25.52 1.95s-.18 1.37-.52 1.95s-.18 1.37-.52 1.8zm-7.92 7.03c-.22 0-.44-.02-.66-.07-.35-.07-.68-.2-.98-.38l3.32-1.92h3.79l-3.32 1.92c-.17.14-.35.27-.54.38-.58.34-1.25.52-1.95.52s-.36-.02-.66-.45zM4.17 13.97a3.52 3.52 0 0 1-.52-1.95c0-.7.18-1.37.52-1.95.11-.19.24-.37.38-.54l3.32 1.92v3.79l-3.32 1.92c-.14-.17-.27-.35-.38-.54zm7.92-7.03c.22 0 .44.02.66.07.35.07.68.2.98.38l-3.32 1.92H6.62l3.32-1.92c.17-.14.35-.27.54-.38.58-.34 1.25-.52 1.95-.52s.36.02.66.45zM6.62 10.15l3.32 1.92v3.79l-3.32 1.92V10.15zm7.46 3.79l-3.32 1.92L7.44 13.94l3.32-1.92 3.32 1.92zM12 12l2.64 1.53c0 .02.01.03.01.05v3.13l-2.61-1.51L12 12zm0 0l-2.64-1.53c0-.02-.01-.03-.01-.05V7.29l2.61 1.51L12 12z" />
                  </svg>
                </div>
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-700">OpenAI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-40 px-6 md:px-8 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] md:blur-[120px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 mb-6">Pricing Plans</div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter mb-6">Grows with your Business.</h2>
            <p className="text-sm md:text-lg text-slate-600 font-medium max-w-xl">Choose a plan that fits your current needs. Upgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Starter</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Perfect for Beginners</p>
              </div>
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₹2,499</span>
                <span className="text-xs font-bold text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['Single WhatsApp Number', 'Google Calendar Sync', 'Smart AI Assistant', 'Automatic Reminders', 'Standard Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all text-center text-[10px] uppercase tracking-widest">Get Started</Link>
            </div>

            <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-800 shadow-2xl shadow-indigo-500/20 relative flex flex-col transform lg:-translate-y-4">
              <div className="absolute top-8 right-8">
                <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Popular</span>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">For Growing Teams</p>
              </div>
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹5,999</span>
                <span className="text-xs font-bold text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['Up to 3 WhatsApp Numbers', 'Advanced AI Customization', 'Automatic Booking Flow', 'Activity Dashboard', 'Priority Phone Support'].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all text-center text-[10px] uppercase tracking-widest">Choose Professional</Link>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Requirements</p>
              </div>
              <div className="mb-10">
                <p className="text-lg font-black text-slate-900 leading-tight">Need something else? Get in touch!</p>
              </div>
              <div className="flex-1 mb-12">
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-200 border-dashed">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Send us an email</p>
                  <a href="mailto:electronlabsindia@gmail.com" className="text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors break-all">electronlabsindia@gmail.com</a>
                </div>
              </div>
              <a href="mailto:electronlabsindia@gmail.com" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-center text-[10px] uppercase tracking-widest">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter mb-6">Built for your Industry.</h2>
            <p className="text-sm md:text-lg text-slate-600 font-medium max-w-xl">We are laser-focused on solving scheduling problems for specific businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {/* Card 1: Medical (Live) */}
            <div className="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"></path></svg>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Now
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Clinics & Doctors</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Optimized for General Practitioners, Physiotherapists, and Specialists. Handle patient queues, follow-ups, and cancellations automatically.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Physiotherapy
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Dental Clinics
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Specialists
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Sports (Coming Soon) */}
            <div className="group relative bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity grayscale">
                <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
              </div>
              <div className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-300">
                  Coming Soon
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Sports & Recreation</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Smart booking for Box Cricket, Badminton Courts, and Football Turfs. Group bookings and membership management coming down the line.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Box Cricket
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Football Turfs
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Badminton Courts
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-20 px-6 md:px-8 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black">A</div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Simplify SaaS</span>
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-center md:text-left leading-relaxed">© 2025 Simplify Systems. Making appointments easy.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[11px] font-black tracking-widest uppercase">
            <Link href="#" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
