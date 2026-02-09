"use client"

import * as React from "react"
import { PlannedTrip, TripRequest, JoinRequest } from "@prisma/client"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import {
    LayoutDashboard,
    Inbox,
    CheckCircle,
    Archive,
    Users,
    Plane,
    CalendarOff,
    Trash,
    Plus,
    X,
    Menu,
    LogOut
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface AdminDashboardProps {
    initialTrips: PlannedTrip[]
    initialTripRequests: TripRequest[]
    initialJoinRequests: JoinRequest[]
    initialStats: { totalCompletedTrips: number } | null
}

// Sub-components defined outside to prevent re-renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarItem = ({ id, icon: Icon, label, count, activeTab, setActiveTab }: any) => (
    <button
        type="button"
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all duration-300 group ${activeTab === id
            ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <div className={`p-2 rounded-full transition-colors ${activeTab === id ? 'bg-primary text-black' : 'bg-white/5 group-hover:bg-white/10'}`}>
            <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium tracking-wide text-sm">{label}</span>
        {count !== undefined && count > 0 && (
            <span className="ml-auto bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                {count}
            </span>
        )}
    </button>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RequestCard = ({ req, type, updateRequestStatus }: { req: any, type: 'trip' | 'join', updateRequestStatus: any }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01 }}
        className="bg-black border border-white/10 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${req.status === 'New' ? 'bg-blue-500/20 text-blue-400' :
                    req.status === 'Contacted' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {type === 'trip' ? <Plane className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">{req.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${req.status === 'New' ? 'bg-blue-500 animate-pulse' :
                            req.status === 'Contacted' ? 'bg-green-500' :
                                'bg-gray-500'
                            }`} />
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{req.status}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                {req.status !== 'Contacted' && req.status !== 'Archived' && req.status !== 'Confirmed' && (
                    <Button size="sm" className="h-9 rounded-full bg-white text-black hover:bg-gray-200 transition-colors px-4 font-medium text-xs" onClick={() => updateRequestStatus(req.id, type === 'trip' ? 'Contacted' : 'Confirmed', type)}>
                        {type === 'trip' ? 'Mark Contacted' : 'Approve'}
                    </Button>
                )}
                {req.status !== 'Archived' && req.status !== 'Rejected' && (
                    <Button size="sm" variant="outline" className="h-9 rounded-full border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all px-4 text-xs" onClick={() => updateRequestStatus(req.id, type === 'trip' ? 'Archived' : 'Rejected', type)}>
                        {type === 'trip' ? 'Archive' : 'Reject'}
                    </Button>
                )}
            </div>
        </div>

        <div className="relative z-10 bg-zinc-900/50 rounded-3xl p-5 border border-white/5 grid grid-cols-2 gap-6">
            <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Contact Info</span>
                <div className="space-y-1">
                    <div className="text-sm text-gray-300 font-medium">{req.email}</div>
                    <div className="text-sm text-gray-300 font-medium">{req.phone}</div>
                </div>
            </div>
            <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Trip Details</span>
                {type === 'trip' ? (
                    <div className="space-y-1">
                        <div className="text-sm text-primary font-bold">{req.packageType} Package</div>
                        <div className="text-sm text-gray-300">{req.travelers} Travelers • {req.departureCity}</div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="text-sm text-primary font-bold">{req.seats} Seats Requested</div>
                        <div className="text-xs text-gray-500 font-mono">ID: {req.tripId.slice(0, 8)}...</div>
                    </div>
                )}
            </div>
        </div>

        {req.notes && (
            <div className="relative z-10 mt-4 px-2">
                <p className="text-sm text-gray-400 italic">&quot;{req.notes}&quot;</p>
            </div>
        )}
    </motion.div>
)

export function AdminDashboard({ initialTrips, initialTripRequests, initialJoinRequests, initialStats }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'requests' | 'contacted' | 'archived' | 'joins' | 'trips' | 'availability'>('overview')
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

    // Auto-cleanup on mount
    React.useEffect(() => {
        fetch('/api/admin/cleanup', { method: 'POST' }).catch(err => console.error("Auto-cleanup failed:", err))
    }, [])

    // State
    const [trips, setTrips] = React.useState(initialTrips)
    const [tripRequests, setTripRequests] = React.useState(initialTripRequests)
    const [joinRequests, setJoinRequests] = React.useState(initialJoinRequests)

    // Filtered Lists
    const newTripRequests = tripRequests.filter(r => r.status === 'New')
    const contactedTripRequests = tripRequests.filter(r => r.status === 'Contacted')
    const archivedTripRequests = tripRequests.filter(r => r.status === 'Archived')
    const newJoinRequests = joinRequests.filter(r => r.status === 'New')

    // Stats
    const stats = [
        { label: "New Requests", value: newTripRequests.length, icon: Inbox, color: "text-blue-400" },
        { label: "Join Requests", value: newJoinRequests.length, icon: Users, color: "text-purple-400" },
        { label: "Active Trips", value: trips.length, icon: Plane, color: "text-primary" },
        { label: "Completed Trips", value: (initialStats?.totalCompletedTrips || 0), icon: CheckCircle, color: "text-green-400" },
    ]

    // New Trip Form State
    const [isCreatingTrip, setIsCreatingTrip] = React.useState(false)
    const [newTrip, setNewTrip] = React.useState({
        title: "", startDate: "", endDate: "", packageType: "Luxury",
        makkahNights: 5, madinahNights: 5, hotelTier: "5-star",
        totalSlots: 20, priceDisplay: "", imageUrl: ""
    })

    // Handlers
    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/admin/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTrip) })
        if (res.ok) {
            setTrips([...trips, await res.json()])
            setIsCreatingTrip(false)
            setNewTrip({ title: "", startDate: "", endDate: "", packageType: "Luxury", makkahNights: 5, madinahNights: 5, hotelTier: "5-star", totalSlots: 20, priceDisplay: "", imageUrl: "" })
        }
    }

    const handleDeleteTrip = async (id: string) => {
        if (confirm("Delete this trip?")) {
            const res = await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
            if (res.ok) setTrips(trips.filter(t => t.id !== id))
        }
    }

    const updateRequestStatus = async (id: string, status: string, type: 'trip' | 'join') => {
        // Optimistic update
        if (type === 'trip') {
            setTripRequests(tripRequests.map(r => r.id === id ? { ...r, status } : r))
        } else {
            setJoinRequests(joinRequests.map(r => r.id === id ? { ...r, status } : r))
        }

        await fetch('/api/admin/requests/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        })
    }

    // Blocked Dates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [blockedDates, setBlockedDates] = React.useState<any[]>([])
    const [newBlockedDate, setNewBlockedDate] = React.useState("")

    React.useEffect(() => {
        if (activeTab === 'availability') {
            fetch('/api/admin/availability').then(res => res.json()).then(setBlockedDates)
        }
    }, [activeTab])

    const handleBlockDate = async () => {
        if (!newBlockedDate) return
        const res = await fetch('/api/admin/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: newBlockedDate, reason: "Admin Blocked" }) })
        if (res.ok) {
            setBlockedDates([...blockedDates, await res.json()])
            setNewBlockedDate("")
        }
    }

    const handleUnblockDate = async (id: string) => {
        if (confirm("Unblock?")) {
            const res = await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' })
            if (res.ok) setBlockedDates(blockedDates.filter(d => d.id !== id))
        }
    }

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <motion.div
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="border-r border-white/5 bg-black flex flex-col relative z-20"
            >
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-white tracking-tighter">Najm<span className="text-primary">Admin</span></h1>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-1">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-3 mt-2">Main</div>
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-3 mt-8">Requests</div>
                    <SidebarItem id="requests" icon={Inbox} label="Inbox" count={newTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="contacted" icon={CheckCircle} label="Contacted" count={contactedTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="archived" icon={Archive} label="Archived" count={archivedTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="joins" icon={Users} label="Join Requests" count={newJoinRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-3 mt-8">Management</div>
                    <SidebarItem id="trips" icon={Plane} label="Planned Trips" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="availability" icon={CalendarOff} label="Availability" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="p-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-white hover:bg-white/5 rounded-full">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-transparent relative z-10">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-full mr-4 text-gray-400 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold text-white capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button size="sm" variant="outline" className="rounded-full border-white/10 hover:bg-white hover:text-black transition-all" onClick={() => fetch('/api/admin/cleanup', { method: 'POST' }).then(() => alert('Cleanup complete'))}>
                            <Trash className="w-4 h-4 mr-2" /> Cleanup
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 pt-0 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] hover:bg-zinc-900 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-4 rounded-full bg-black border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-4xl font-bold text-white tracking-tighter">{stat.value}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                                            <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {tripRequests.slice(0, 5).map(req => (
                                                <div key={req.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-all cursor-default group border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors border border-white/5">
                                                            <Inbox className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-tight">{req.fullName}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">New Request</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-medium bg-black px-3 py-1 rounded-full border border-white/5">{format(new Date(req.createdAt), 'MMM d')}</span>
                                                </div>
                                            ))}
                                            {tripRequests.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'requests' || activeTab === 'contacted' || activeTab === 'archived') && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {(activeTab === 'requests' ? newTripRequests : activeTab === 'contacted' ? contactedTripRequests : archivedTripRequests).map(req => (
                                        <RequestCard key={req.id} req={req} type="trip" updateRequestStatus={updateRequestStatus} />
                                    ))}
                                    {(activeTab === 'requests' ? newTripRequests : activeTab === 'contacted' ? contactedTripRequests : archivedTripRequests).length === 0 && (
                                        <div className="text-center py-32">
                                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                                <Inbox className="w-8 h-8" />
                                            </div>
                                            <p className="text-gray-500 font-medium">No requests found in this category.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'joins' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {newJoinRequests.map(req => (
                                        <RequestCard key={req.id} req={req} type="join" updateRequestStatus={updateRequestStatus} />
                                    ))}
                                    {newJoinRequests.length === 0 && (
                                        <div className="text-center py-32">
                                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <p className="text-gray-500 font-medium">No new join requests.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'trips' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">Planned Trips</h2>
                                    <Button onClick={() => setIsCreatingTrip(!isCreatingTrip)} className="rounded-full px-6">
                                        {isCreatingTrip ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                        {isCreatingTrip ? "Cancel" : "Create New Trip"}
                                    </Button>
                                </div>

                                {isCreatingTrip && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        onSubmit={handleCreateTrip}
                                        className="bg-zinc-900/50 p-8 rounded-[2rem] border border-white/10 space-y-6 mb-8"
                                    >
                                        <div className="grid grid-cols-2 gap-6">
                                            <input required placeholder="Trip Title" value={newTrip.title} onChange={e => setNewTrip({ ...newTrip, title: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <select value={newTrip.packageType} onChange={e => setNewTrip({ ...newTrip, packageType: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors">
                                                <option value="Luxury">Luxury</option>
                                                <option value="Comfort">Comfort</option>
                                                <option value="Budget">Budget</option>
                                            </select>
                                            <input required type="date" value={newTrip.startDate} onChange={e => setNewTrip({ ...newTrip, startDate: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input required type="date" value={newTrip.endDate} onChange={e => setNewTrip({ ...newTrip, endDate: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input required type="number" placeholder="Makkah Nights" value={newTrip.makkahNights} onChange={e => setNewTrip({ ...newTrip, makkahNights: parseInt(e.target.value) })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input required type="number" placeholder="Madinah Nights" value={newTrip.madinahNights} onChange={e => setNewTrip({ ...newTrip, madinahNights: parseInt(e.target.value) })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input placeholder="Hotel Tier" value={newTrip.hotelTier} onChange={e => setNewTrip({ ...newTrip, hotelTier: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input required type="number" placeholder="Total Slots" value={newTrip.totalSlots} onChange={e => setNewTrip({ ...newTrip, totalSlots: parseInt(e.target.value) })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input placeholder="Image URL (Unsplash)" value={newTrip.imageUrl} onChange={e => setNewTrip({ ...newTrip, imageUrl: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors col-span-2" />
                                        </div>
                                        <Button type="submit" className="w-full rounded-xl py-4 text-lg">Create Trip</Button>
                                    </motion.form>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                    {trips.map(trip => (
                                        <div key={trip.id} className="bg-zinc-900/50 border border-white/10 p-6 rounded-[2rem] flex justify-between items-center group hover:border-primary/30 transition-all hover:bg-zinc-900">
                                            <div className="flex items-center gap-4">
                                                {trip.imageUrl && <Image src={trip.imageUrl} alt={trip.title} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />}
                                                <div>
                                                    <h3 className="font-bold text-white text-lg">{trip.title}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')} • <span className="text-primary">{trip.availableSlots} slots left</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => handleDeleteTrip(trip.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">Blocked Dates</h2>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={newBlockedDate}
                                            onChange={(e) => setNewBlockedDate(e.target.value)}
                                            className="bg-black border border-white/10 rounded-full px-4 py-2 text-white outline-none focus:border-primary"
                                        />
                                        <Button onClick={handleBlockDate} disabled={!newBlockedDate} className="rounded-full">
                                            <Plus className="mr-2 h-4 w-4" /> Block Date
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {blockedDates.map(date => (
                                        <div key={date.id} className="bg-zinc-900/50 border border-white/10 p-6 rounded-[2rem] flex justify-between items-center hover:bg-zinc-900 transition-colors">
                                            <span className="text-white font-medium">
                                                {format(new Date(date.date), 'MMMM d, yyyy')}
                                            </span>
                                            <Button size="sm" variant="ghost" onClick={() => handleUnblockDate(date.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-full">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {blockedDates.length === 0 && (
                                        <div className="text-center py-20 col-span-3 text-gray-500">No dates blocked.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
