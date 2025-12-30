'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/lib/auth/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { tenantsApi, type Tenant, type TenantCreate, type TenantUpdate } from '@/lib/api/tenants'
import { messagesApi, type Message } from '@/lib/api/messages'

export default function DashboardPage() {
    const { user, loading: authLoading } = useRequireAuth()
    const { signOut } = useAuth()
    const router = useRouter()

    const [tenant, setTenant] = useState<Tenant | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showSetupForm, setShowSetupForm] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null)

    // Form state for tenant setup/update
    const [formData, setFormData] = useState<TenantCreate>({
        name: '',
        whatsapp_phone_number_id: '',
        whatsapp_access_token: '',
    })

    const [updateData, setUpdateData] = useState<TenantUpdate>({
        name: '',
        whatsapp_access_token: '',
    })

    useEffect(() => {
        if (!authLoading && user) {
            fetchTenantData()
        }
    }, [authLoading, user])

    const fetchTenantData = async () => {
        try {
            setLoading(true)
            const tenantData = await tenantsApi.getMyTenant()
            setTenant(tenantData)
            setUpdateData({
                name: tenantData.name,
                whatsapp_access_token: '', // Keep empty unless updating
            })
            setShowSetupForm(false)

            const messagesData = await messagesApi.list({ limit: 100 })
            setMessages(messagesData)

            if (messagesData.length > 0) {
                const firstMsg = messagesData[0]
                const contactNumber = firstMsg.direction === 'inbound' ? firstMsg.sender_number : firstMsg.recipient_number
                setSelectedNumber(contactNumber)
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setShowSetupForm(true)
                setTenant(null)
            } else {
                setError(err.message || 'Failed to load data')
            }
        } finally {
            setLoading(false)
        }
    }

    const conversations = useMemo(() => {
        const groups: Record<string, Message[]> = {}

        messages.forEach(msg => {
            const contactNumber = msg.direction === 'inbound' ? msg.sender_number : msg.recipient_number
            if (!groups[contactNumber]) {
                groups[contactNumber] = []
            }
            groups[contactNumber].push(msg)
        })

        return Object.entries(groups).map(([number, msgs]) => ({
            number,
            latestMessage: msgs[0],
            messages: [...msgs].reverse()
        })).sort((a, b) =>
            new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
        )
    }, [messages])

    const selectedChat = useMemo(() =>
        conversations.find(c => c.number === selectedNumber),
        [conversations, selectedNumber])

    const handleSetupSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const newTenant = await tenantsApi.create(formData)
            setTenant(newTenant)
            setShowSetupForm(false)
            fetchTenantData()
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to create tenant')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const cleanUpdate: TenantUpdate = {}
            if (updateData.name) cleanUpdate.name = updateData.name
            if (updateData.whatsapp_access_token) cleanUpdate.whatsapp_access_token = updateData.whatsapp_access_token

            const updatedTenant = await tenantsApi.update(cleanUpdate)
            setTenant(updatedTenant)
            setIsSettingsOpen(false)
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    if (authLoading || loading) {
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-indigo-900 font-black tracking-tighter uppercase text-xs">Initializing Portal...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white px-20 h-16 border-b border-slate-100 flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-100">
                        A
                    </div>
                    <div>
                        <span className="text-sm font-black text-slate-900 tracking-tighter block leading-none uppercase">Agentic SaaS</span>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5 block">Business Portal</span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    {tenant && (
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm7-2c.05-.33.07-.66.07-1s-.02-.67-.07-1l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1a8.448 8.448 0 0 0-1.73-1l-.39-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.39 2.65c-.63.26-1.22.6-1.73 1l-2.49-1c-.22-.09-.49.01-.61.22l-2 3.46c-.13.22-.07.49.12.64L5 10.5c-.05.33-.07.66-.07 1s.02.67.07 1l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.4 1.08.73 1.69 1l.39 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18.48-.42l.39-2.65c.61-.27 1.17-.6 1.69-1l2.49 1c.22.09.49-.01.61-.22l2-3.46c.12-.22.07-.49-.12-.64L19 13.5z"></path></svg>
                            Settings
                        </button>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-800 tracking-tight">{user?.email}</span>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-0.5">{tenant?.name || 'No Brand Linked'}</span>
                    </div>
                    <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 px-3 py-1.5 rounded-full">Sign Out</button>
                </div>
            </nav>

            {/* Main Application Interface */}
            <div className="flex-1 flex w-full h-[calc(100vh-64px)] overflow-hidden relative">
                {error && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[60] p-4 bg-white border border-rose-100 rounded-xl shadow-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <p className="text-xs text-slate-700 font-bold">{error}</p>
                        <button onClick={() => setError('')} className="ml-2 text-slate-400 hover:text-slate-600 font-bold">×</button>
                    </div>
                )}

                {/* Settings Overlay / Modal */}
                {isSettingsOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-8">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] p-12 border border-slate-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter uppercase">Brand Settings</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Update your operational credentials.</p>
                                </div>
                                <button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Business Identity</label>
                                    <input type="text" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">WhatsApp Access Token</label>
                                    <input type="password" value={updateData.whatsapp_access_token} onChange={(e) => setUpdateData({ ...updateData, whatsapp_access_token: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="•••••••• (leave blank to keep current)" />
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 py-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">Cancel</button>
                                    <button type="submit" disabled={loading} className="flex-[2] py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showSetupForm ? (
                    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-12 border border-slate-100">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Initialize Portal</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Configure your business communication core.</p>
                            <form onSubmit={handleSetupSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Business Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">WhatsApp ID</label>
                                        <input type="text" value={formData.whatsapp_phone_number_id} onChange={(e) => setFormData({ ...formData, whatsapp_phone_number_id: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="Meta ID" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">System Token</label>
                                        <input type="password" value={formData.whatsapp_access_token} onChange={(e) => setFormData({ ...formData, whatsapp_access_token: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="••••••••" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50 mt-4">Confirm Integration</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex h-full">
                        {/* Sidebar: Interaction Logs */}
                        <div className="w-[400px] border-r border-slate-50 flex flex-col bg-white shrink-0 z-10">
                            <div className="p-8 pb-4">
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter uppercase">
                                    Interactions
                                    <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-100">Live Logs</span>
                                </h2>
                                <div className="bg-slate-50 rounded-2xl flex items-center px-5 py-3.5 group transition-all focus-within:ring-2 focus-within:ring-indigo-100">
                                    <svg viewBox="0 0 24 24" width="16" height="16" className="text-slate-400"><path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.194-3.997-4.008zm-5.207 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg>
                                    <input type="text" placeholder="Filter interactions..." className="bg-transparent border-none outline-none flex-1 px-4 text-xs font-bold text-slate-900 placeholder:text-slate-300" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                                {conversations.length === 0 ? (
                                    <div className="p-16 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-200">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No active traffic</p>
                                    </div>
                                ) : (
                                    conversations.map((chat) => (
                                        <div
                                            key={chat.number}
                                            onClick={() => setSelectedNumber(chat.number)}
                                            className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all rounded-[2rem] group ${selectedNumber === chat.number ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative group-hover:border-indigo-100 transition-colors">
                                                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                                                <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Log</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`text-[13px] font-bold truncate ${selectedNumber === chat.number ? 'text-indigo-950' : 'text-slate-800'}`}>{chat.number}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                                        {new Date(chat.latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 font-bold truncate tracking-tight">
                                                    {chat.latestMessage.direction === 'outbound' ? 'Out: ' : 'In: '}{chat.latestMessage.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Area: Interaction History */}
                        <div className="flex-1 flex flex-col bg-slate-50/30 relative overflow-hidden">
                            {selectedChat ? (
                                <>
                                    {/* Interaction Header */}
                                    <div className="h-[90px] bg-white/80 backdrop-blur-md px-12 flex items-center justify-between border-b border-slate-100 shrink-0 z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-slate-100">
                                                <svg viewBox="0 0 24 24" width="20" height="20" className="text-white"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg leading-tight flex items-center gap-3 tracking-tighter">
                                                    {selectedChat.number}
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-pulse"></span>
                                                </h3>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Operational Channel</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interaction Flow View */}
                                    <div className="flex-1 overflow-y-auto px-16 py-12 flex flex-col space-y-4 z-10">
                                        {selectedChat.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                                            >
                                                <div className={`max-w-[75%] group relative`}>
                                                    <div className={`px-6 py-4 rounded-[1.75rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-sm font-medium tracking-tight leading-relaxed ${msg.direction === 'outbound'
                                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
                                                        }`}>
                                                        {msg.text}
                                                    </div>
                                                    <div className={`flex items-center gap-3 mt-2 px-1 ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-slate-300">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {msg.direction === 'outbound' && (
                                                            <div className="flex text-indigo-400">
                                                                <svg viewBox="0 0 16 11" width="12" height="8"><path fill="currentColor" d="M11.003 1.45L4.273 8.18l-2.008-2.008L1.13 7.308l3.143 3.143 7.865-7.865-1.135-1.136zm2.862 0L6 9.317l-1.135-1.135-.865.865 2 2 7.865-7.865-1-.867z"></path></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Interaction Input */}
                                    <div className="shrink-0 p-10 pt-0 z-10">
                                        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-2.5 pl-8 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-5 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                            <input
                                                type="text"
                                                placeholder="Dispatch operational response..."
                                                className="flex-1 border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300 py-4 bg-transparent"
                                            />
                                            <button className="w-12 h-12 bg-indigo-50/30 hover:bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-colors">
                                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.47 1.647 3.971 1.647a5.58 5.58 0 0 0 3.972-1.647l9.582-9.582a4.437 4.437 0 0 0-6.276-6.276l-9.22 9.22a.977.977 0 1 0 1.381 1.382l9.22-9.22a2.483 2.483 0 0 1 3.513 3.513l-9.582 9.582a3.626 3.626 0 0 1-5.129-5.129l8.28-8.28a.977.977 0 1 0-1.381-1.382l-8.28 8.28a5.571 5.571 0 0 0-1.647 3.971z"></path></svg>
                                            </button>
                                            <button className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-95">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-1"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-16 z-10">
                                    <div className="text-center max-w-sm">
                                        <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-slate-50 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Terminal Ready</h2>
                                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em] leading-loose">
                                            Select an operational thread from the logs to review high-speed coordination logs and interaction history.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
