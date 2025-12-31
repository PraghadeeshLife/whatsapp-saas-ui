'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/lib/auth/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { tenantsApi, type Tenant, type TenantCreate, type TenantUpdate } from '@/lib/api/tenants'
import { messagesApi, type Message } from '@/lib/api/messages'
import { resourcesApi, type Resource, type ResourceCreate } from '@/lib/api/resources'

type ViewMode = 'chats' | 'resources'

export default function DashboardPage() {
    const { user, loading: authLoading } = useRequireAuth()
    const { signOut } = useAuth()
    const router = useRouter()

    const [tenant, setTenant] = useState<Tenant | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [resources, setResources] = useState<Resource[]>([])

    // UI States
    const [currentView, setCurrentView] = useState<ViewMode>('chats')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showSetupForm, setShowSetupForm] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)

    // Chat States
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
    const [isViewChatMobile, setIsViewChatMobile] = useState(false)

    // Form state for tenant setup/update
    const [formData, setFormData] = useState<TenantCreate>({
        name: '',
        whatsapp_phone_number_id: '',
        whatsapp_access_token: '',
        google_calendar_id: '',
        google_service_account_json: ''
    })

    const [updateData, setUpdateData] = useState<TenantUpdate>({
        name: '',
        whatsapp_access_token: '',
        google_calendar_id: '',
        google_service_account_json: ''
    })

    // Resource Form Data
    const [resourceData, setResourceData] = useState<ResourceCreate>({
        name: '',
        description: '',
        external_id: ''
    })

    useEffect(() => {
        if (!authLoading && user) {
            fetchTenantData()
        }
    }, [authLoading, user])

    useEffect(() => {
        if (tenant && currentView === 'resources') {
            fetchResources()
        }
    }, [tenant, currentView])

    const fetchTenantData = async () => {
        try {
            setLoading(true)
            const tenantData = await tenantsApi.getMyTenant()
            setTenant(tenantData)
            setUpdateData({
                name: tenantData.name,
                whatsapp_access_token: '', // Keep empty unless updating
                google_calendar_id: tenantData.google_calendar_id || '',
                google_service_account_json: '' // Don't fetch sensitive JSON
            })
            setShowSetupForm(false)

            // Only fetch messages if we are in chat view or initial load
            const messagesData = await messagesApi.list({ limit: 100 })
            setMessages(messagesData)

            if (messagesData.length > 0 && !selectedNumber) {
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

    const fetchResources = async () => {
        try {
            const data = await resourcesApi.list()
            setResources(data)
        } catch (err: any) {
            setError('Failed to load resources')
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
            setError(err.response?.data?.detail || err.message || 'Failed to create business profile')
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
            if (updateData.google_calendar_id) cleanUpdate.google_calendar_id = updateData.google_calendar_id
            if (updateData.google_service_account_json) cleanUpdate.google_service_account_json = updateData.google_service_account_json

            const updatedTenant = await tenantsApi.update(cleanUpdate)
            setTenant(updatedTenant)
            setIsSettingsOpen(false)
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await resourcesApi.create(resourceData)
            setIsResourceModalOpen(false)
            setResourceData({ name: '', description: '', external_id: '' })
            fetchResources()
        } catch (err: any) {
            setError('Failed to create resource')
        }
    }

    const handleDeleteResource = async (id: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) return
        try {
            await resourcesApi.delete(id)
            fetchResources()
        } catch (err: any) {
            setError('Failed to delete resource')
        }
    }

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    const handleChatSelect = (number: string) => {
        setSelectedNumber(number)
        setIsViewChatMobile(true)
    }

    if (authLoading || loading && !tenant) {
        return (
            <div className="h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-indigo-950 font-black tracking-tighter uppercase text-xs">Opening Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white px-6 md:px-20 h-16 border-b border-slate-100 flex justify-between items-center shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-100">
                        S
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-sm font-black text-slate-900 tracking-tighter block leading-none uppercase">Simplify</span>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-0.5 block">Business Dashboard</span>
                    </div>
                </div>

                {/* View Switcher */}
                {tenant && !showSetupForm && (
                    <div className="flex items-center bg-slate-100 p-1 rounded-full">
                        <button
                            onClick={() => setCurrentView('chats')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'chats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Chats
                        </button>
                        <button
                            onClick={() => setCurrentView('resources')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'resources' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Resources
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-4 md:gap-8">
                    {tenant && (
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 bg-slate-50 px-3 md:px-4 py-2 rounded-full"
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm7-2c.05-.33.07-.66.07-1s-.02-.67-.07-1l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1a8.448 8.448 0 0 0-1.73-1l-.39-2.65c-.03-.24-.24-.42-.48-.42h-4c-.24 0-.45.18-.48.42l-.39 2.65c-.63.26-1.22.6-1.73 1l-2.49-1c-.22-.09-.49.01-.61.22l-2 3.46c-.13.22-.07.49.12.64L5 10.5c-.05.33-.07.66-.07 1s.02.67.07 1l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.4 1.08.73 1.69 1l.39 2.65c.03.24.24.42.48.42h4c.24 0 .45-.18.48-.42l.39-2.65c.61-.27 1.17-.6 1.69-1l2.49 1c.22.09.49-.01.61-.22l2-3.46c.12-.22.07-.49-.12-.64L19 13.5z"></path></svg>
                            <span className="hidden xs:inline">Settings</span>
                        </button>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-800 tracking-tight max-w-[100px] truncate md:max-w-none">{user?.email}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mt-0.5">{tenant?.name || 'My Business'}</span>
                    </div>
                    <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-full">
                        <span className="hidden xs:inline">Sign Out</span>
                        <span className="xs:hidden">Off</span>
                    </button>
                </div>
            </nav>

            {/* Main Application Interface */}
            <div className="flex-1 flex w-full h-[calc(100vh-64px)] overflow-hidden relative">
                {error && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[60] p-4 bg-white border border-rose-100 rounded-xl shadow-2xl flex items-center gap-3 w-[90%] md:w-auto animate-in slide-in-from-top-4">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <p className="text-xs text-slate-700 font-bold truncate">{error}</p>
                        <button onClick={() => setError('')} className="ml-2 text-slate-400 hover:text-slate-600 font-bold">×</button>
                    </div>
                )}

                {/* Settings Overlay / Modal */}
                {isSettingsOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4 md:p-8">
                        <div className="bg-white w-full max-w-lg rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] p-8 md:p-12 border border-slate-100 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-full">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1 tracking-tighter uppercase">Settings</h2>
                                    <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Manage your business profile.</p>
                                </div>
                                <button onClick={() => setIsSettingsOpen(false)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Business Name</label>
                                    <input type="text" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">WhatsApp Access Token</label>
                                    <input type="password" value={updateData.whatsapp_access_token} onChange={(e) => setUpdateData({ ...updateData, whatsapp_access_token: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="•••••••• (leave blank to keep)" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Google Calendar ID</label>
                                    <input type="text" value={updateData.google_calendar_id || ''} onChange={(e) => setUpdateData({ ...updateData, google_calendar_id: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="calendar-id@group.calendar.google.com" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Service Account JSON</label>
                                    <textarea value={updateData.google_service_account_json || ''} onChange={(e) => setUpdateData({ ...updateData, google_service_account_json: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900 h-24" placeholder='{"type": "service_account", ...}' />
                                </div>

                                <div className="pt-4 flex flex-col xs:flex-row gap-4">
                                    <button type="button" onClick={() => setIsSettingsOpen(false)} className="py-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-2xl hover:bg-slate-100 transition-all xs:flex-1">Cancel</button>
                                    <button type="submit" disabled={loading} className="py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50 xs:flex-[2]">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Resource Creation Modal */}
                {isResourceModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-1 tracking-tighter uppercase">Add Resource</h2>
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Create a new resource item.</p>
                                </div>
                                <button onClick={() => setIsResourceModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
                                </button>
                            </div>
                            <form onSubmit={handleCreateResource} className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Name</label>
                                    <input type="text" value={resourceData.name} onChange={(e) => setResourceData({ ...resourceData, name: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Description</label>
                                    <input type="text" value={resourceData.description || ''} onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">External ID</label>
                                    <input type="text" value={resourceData.external_id || ''} onChange={(e) => setResourceData({ ...resourceData, external_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" />
                                </div>
                                <button type="submit" className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.98] mt-4">Create Resource</button>
                            </form>
                        </div>
                    </div>
                )}

                {showSetupForm ? (
                    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                        <div className="bg-white w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 md:p-12 border border-slate-100">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Set Up Your Business</h2>
                            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-10">Choose a name and link your WhatsApp.</p>
                            <form onSubmit={handleSetupSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Your Business Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="e.g. My Awesome Shop" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">WhatsApp ID</label>
                                        <input type="text" value={formData.whatsapp_phone_number_id} onChange={(e) => setFormData({ ...formData, whatsapp_phone_number_id: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="Meta ID" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Access Token</label>
                                        <input type="password" value={formData.whatsapp_access_token} onChange={(e) => setFormData({ ...formData, whatsapp_access_token: e.target.value })} required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm font-bold text-slate-900" placeholder="••••••••" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-[0.98] disabled:opacity-50 mt-4">Create My Profile</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        {currentView === 'chats' ? (
                            <div className="flex-1 flex h-full">
                                {/* Sidebar: Messages */}
                                <div className={`w-full md:w-[400px] border-r border-slate-100 flex flex-col bg-white shrink-0 z-10 ${isViewChatMobile ? 'hidden md:flex' : 'flex'}`}>
                                    <div className="p-6 md:p-8 md:pb-4">
                                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter uppercase">
                                            Recent Chats
                                            <span className="text-[8px] md:text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-100">Live</span>
                                        </h2>
                                        <div className="bg-slate-50 rounded-2xl flex items-center px-5 py-3.5 group transition-all focus-within:ring-2 focus-within:ring-indigo-100">
                                            <svg viewBox="0 0 24 24" width="16" height="16" className="text-slate-400 group-focus-within:text-indigo-500"><path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.194-3.997-4.008zm-5.207 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg>
                                            <input type="text" placeholder="Search chats..." className="bg-transparent border-none outline-none flex-1 px-4 text-xs font-bold text-slate-900 placeholder:text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-1">
                                        {conversations.length === 0 ? (
                                            <div className="p-16 text-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-200">
                                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">No messages yet</p>
                                            </div>
                                        ) : (
                                            conversations.map((chat) => (
                                                <div
                                                    key={chat.number}
                                                    onClick={() => handleChatSelect(chat.number)}
                                                    className={`flex items-center gap-4 px-4 md:px-6 py-5 cursor-pointer transition-all rounded-[1.5rem] md:rounded-[2rem] group ${selectedNumber === chat.number ? 'bg-indigo-50 shadow-sm' : 'hover:bg-slate-50 focus-within:bg-slate-50'}`}
                                                >
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative group-hover:border-indigo-100 transition-colors">
                                                        <img src="https://www.vectorlogo.zone/logos/whatsapp/whatsapp-icon.svg" alt="WA" className="w-5 h-5 md:w-6 md:h-6 opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                            <span className={`text-[12px] md:text-[13px] font-bold truncate ${selectedNumber === chat.number ? 'text-indigo-950' : 'text-slate-800'}`}>{chat.number}</span>
                                                            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter shrink-0 ml-2">
                                                                {new Date(chat.latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] md:text-[11px] text-slate-500 font-bold truncate tracking-tight">
                                                            {chat.latestMessage.direction === 'outbound' ? 'You: ' : ''}{chat.latestMessage.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Right Area: Chat History */}
                                <div className={`flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden ${isViewChatMobile ? 'flex' : 'hidden md:flex'}`}>
                                    {selectedChat ? (
                                        <>
                                            {/* Chat Header */}
                                            <div className="h-[70px] md:h-[90px] bg-white/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between border-b border-slate-100 shrink-0 z-10">
                                                <div className="flex items-center gap-4 md:gap-5 min-w-0">
                                                    {/* Back button for mobile */}
                                                    <button
                                                        onClick={() => setIsViewChatMobile(false)}
                                                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900"
                                                    >
                                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                                                    </button>
                                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-slate-100 shrink-0">
                                                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-white"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-black text-slate-900 text-sm md:text-lg leading-tight flex items-center gap-2 md:gap-3 tracking-tighter truncate">
                                                            {selectedChat.number}
                                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-pulse shrink-0"></span>
                                                        </h3>
                                                        <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">Verified Customer</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chat Flow */}
                                            <div className="flex-1 overflow-y-auto px-6 md:px-16 py-8 md:py-12 flex flex-col space-y-4 z-10">
                                                {selectedChat.messages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                                                    >
                                                        <div className={`max-w-[85%] md:max-w-[75%] group relative`}>
                                                            <div className={`px-4 md:px-6 py-3 md:py-4 rounded-[1.25rem] md:rounded-[1.75rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-[13px] md:text-sm font-medium tracking-tight leading-relaxed ${msg.direction === 'outbound'
                                                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                                                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                                                }`}>
                                                                {msg.text}
                                                            </div>
                                                            <div className={`flex items-center gap-2 md:gap-3 mt-1.5 px-1 ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                                                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {msg.direction === 'outbound' && (
                                                                    <div className="flex text-indigo-400">
                                                                        <svg viewBox="0 0 16 11" width="10" height="6"><path fill="currentColor" d="M11.003 1.45L4.273 8.18l-2.008-2.008L1.13 7.308l3.143 3.143 7.865-7.865-1.135-1.136zm2.862 0L6 9.317l-1.135-1.135-.865.865 2 2 7.865-7.865-1-.867z"></path></svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Input Area */}
                                            <div className="shrink-0 p-4 md:p-10 md:pt-0 z-10">
                                                <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2.5 pl-4 md:pl-8 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] md:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-3 md:gap-5 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                                    <input
                                                        type="text"
                                                        placeholder="Type message..."
                                                        className="flex-1 border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 py-3 md:py-4 bg-transparent min-w-0"
                                                    />
                                                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                                        <button className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 transition-colors">
                                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.47 1.647 3.971 1.647a5.58 5.58 0 0 0 3.972-1.647l9.582-9.582a4.437 4.437 0 0 0-6.276-6.276l-9.22 9.22a.977.977 0 1 0 1.381 1.382l9.22-9.22a2.483 2.483 0 0 1 3.513 3.513l-9.582 9.582a3.626 3.626 0 0 1-5.129-5.129l8.28-8.28a.977.977 0 1 0-1.381-1.382l-8.28 8.28a5.571 5.571 0 0 0-1.647 3.971z"></path></svg>
                                                        </button>
                                                        <button className="w-11 h-11 md:w-14 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="ml-0.5"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center p-8 md:p-16 z-10">
                                            <div className="text-center max-w-sm">
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl flex items-center justify-center mx-auto mb-8 md:mb-10 border border-slate-100 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                                </div>
                                                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Select a Chat</h2>
                                                <p className="text-slate-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] leading-loose px-4">
                                                    Choose a customer from the list on the left to start chatting and managing their appointments.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Resources View */
                            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                                <div className="max-w-5xl mx-auto">
                                    <div className="flex justify-between items-end mb-10">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Resources</h2>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Manage your bookable items (Doctors, Rooms, Equipment)</p>
                                        </div>
                                        <button
                                            onClick={() => setIsResourceModalOpen(true)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                                        >
                                            + Add New
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {resources.map((resource) => (
                                            <div key={resource.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                                <button
                                                    onClick={() => handleDeleteResource(resource.id)}
                                                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                                                </button>
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.name}</h3>
                                                <p className="text-slate-500 text-xs font-medium mb-4 min-h-[1.5em]">{resource.description || 'No description provided'}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                                                        ID: {resource.id}
                                                    </div>
                                                    {resource.external_id && (
                                                        <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                                                            EXT: {resource.external_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {resources.length === 0 && (
                                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                <p className="text-slate-400 text-sm font-bold">No resources found. Create one to get started.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
