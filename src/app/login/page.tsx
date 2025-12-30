'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { signIn } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to log in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center px-6 relative overflow-hidden">
            {/* Catchy Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-50/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-12 border border-slate-100">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Agentic</span>
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">SaaS Solutions</span>
                        </div>
                    </Link>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Log in to your operational core</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
                            <p className="text-rose-600 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1">
                                Operational Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1">
                                Secure Key
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Authenticating...' : 'Establish Connection'}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-10">
                        New Operator?{' '}
                        <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
