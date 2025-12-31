'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { signUp } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signUp(email, password)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Catchy Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[80%] md:w-[60%] h-[60%] bg-indigo-50/40 rounded-full blur-[80px] md:blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[60%] md:w-[40%] h-[40%] bg-rose-50/20 rounded-full blur-[60px] md:blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 md:p-12 border border-slate-100">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center gap-3 mb-8 md:mb-10 group">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Simplify</span>
                            <span className="text-[9px] md:text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-0.5">Smart Booking</span>
                        </div>
                    </Link>

                    <div className="text-center mb-8 md:mb-10">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Get Started</h1>
                        <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">Automate your business appointments today</p>
                    </div>

                    {error && (
                        <div className="mb-6 md:mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                            <p className="text-rose-600 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 pl-1">
                                Your Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-400 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/50"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 pl-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-slate-50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-400 text-sm font-bold text-slate-900 shadow-inner shadow-slate-200/50"
                                placeholder="••••••••"
                            />
                            <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2 pl-1">Minimum 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 md:py-5 bg-slate-900 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 mt-2 md:mt-4"
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-8 md:mt-10">
                        Already have access?{' '}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
