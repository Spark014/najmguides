"use client"

import * as React from "react"
import { PlannedTrip, TripRequest, JoinRequest } from "@prisma/client"
import { Button } from "@/components/ui/Button"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfToday } from "date-fns"
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
    LogOut,
    Briefcase,
    Loader2,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NextImage from "next/image"

interface Package {
    id: string
    title: string
    [key: string]: any
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 px-6 py-4 liquid-glass-dark squircle shadow-2xl ${type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
    >
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </div>
        <div>
            <h4 className="font-bold text-sm tracking-wide uppercase">{type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm font-medium text-white/90">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4 opacity-50" />
        </button>
    </motion.div>
)

// ... (inside AdminDashboard component)
interface AdminDashboardProps {
    initialTrips: PlannedTrip[]
    initialTripRequests: TripRequest[]
    initialJoinRequests: JoinRequest[]
    initialStats: { totalCompletedTrips: number } | null
}

// Sub-components defined outside to prevent re-renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarItem = ({ id, icon: Icon, label, count, activeTab, setActiveTab }: any) => (
    <motion.button
        type="button"
        whileTap={{ scale: 0.9, y: 1, filter: "brightness(0.9)" }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all duration-300 group ${activeTab === id
            ? 'water-capsule text-white shadow-lg'
            : 'text-gray-400 hover:text-white'
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
    </motion.button>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RequestCard = ({ req, type, updateRequestStatus }: { req: any, type: 'trip' | 'join', updateRequestStatus: any }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01 }}
        className="liquid-glass p-6 squircle relative overflow-hidden group shadow-2xl border border-white/5"
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
                {req.status === 'Archived' && (
                    <Button size="sm" variant="outline" className="h-9 rounded-full border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all px-4 text-xs" onClick={() => {
                        updateRequestStatus(req.id, 'Deleted', type)
                    }}>
                        <Trash className="w-3 h-3 mr-2" /> Delete
                    </Button>
                )}
                {req.status !== 'Archived' && req.status !== 'Rejected' && (
                    <Button size="sm" variant="outline" className="h-9 rounded-full border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all px-4 text-xs" onClick={() => updateRequestStatus(req.id, type === 'trip' ? 'Archived' : 'Rejected', type)}>
                        {type === 'trip' ? 'Archive' : 'Reject'}
                    </Button>
                )}
            </div>
        </div>

        <div className="relative z-10 liquid-glass-input rounded-3xl p-5 grid grid-cols-2 gap-6">
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
                        {req.startDateRange && (
                            <div className="text-xs text-gray-400 mt-1">
                                Preferred Start: <span className="text-white font-medium">{format(new Date(req.startDateRange), 'MMMM d, yyyy')}</span>
                            </div>
                        )}
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

interface Package {
    id: string
    title: string
    description: string
    price: string
    features: string[]
    notes: string[]
    isPopular: boolean
    order: number
}

// ... existing AdminDashboardProps ...

export function AdminDashboard({ initialTrips, initialTripRequests, initialJoinRequests, initialStats }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'requests' | 'contacted' | 'archived' | 'joins' | 'trips' | 'availability' | 'packages'>('overview')
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

    // ... existing useEffect ...

    // State
    const [trips, setTrips] = React.useState(initialTrips)
    const [tripRequests, setTripRequests] = React.useState(initialTripRequests)
    const [joinRequests, setJoinRequests] = React.useState(initialJoinRequests)
    const [packages, setPackages] = React.useState<Package[]>([])

    // Notification State
    const [toast, setToast] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    React.useEffect(() => {
        if (activeTab === 'packages') {
            fetch('/api/admin/packages').then(res => res.json()).then(setPackages)
        }
    }, [activeTab])

    // Filtered Lists
    // Inbox: Show everything that is NOT Archived, Deleted, or Completed.
    const inboxTripRequests = tripRequests.filter(r =>
        r.status !== 'Archived' &&
        r.status !== 'Deleted' &&
        r.status !== 'Completed'
    )
    const newTripRequests = tripRequests.filter(r => r.status === 'New')
    const contactedTripRequests = tripRequests.filter(r => r.status === 'Contacted')
    const archivedTripRequests = tripRequests.filter(r => r.status === 'Archived')
    const newJoinRequests = joinRequests.filter(r => r.status !== 'Archived' && r.status !== 'Deleted' && r.status !== 'Completed')

    // Stats
    const stats = [
        { label: "Inbox", value: inboxTripRequests.length, icon: Inbox, color: "text-blue-400" },
        { label: "Join Requests", value: newJoinRequests.length, icon: Users, color: "text-purple-400" },
        { label: "Active Trips", value: trips.length, icon: Plane, color: "text-primary" },
        { label: "Completed Trips", value: (initialStats?.totalCompletedTrips || 0), icon: CheckCircle, color: "text-green-400" },
    ]

    // Trip Management State
    const [isCreatingTrip, setIsCreatingTrip] = React.useState(false)
    const [editingTrip, setEditingTrip] = React.useState<PlannedTrip | null>(null)
    const [fetchedPackages, setFetchedPackages] = React.useState<Package[]>([])
    const [tripForm, setTripForm] = React.useState({
        title: "", startDate: "", endDate: "", packageType: "Luxury",
        makkahNights: 5, madinahNights: 5, hotelTier: "5-star",
        totalSlots: 20, priceDisplay: "", imageUrl: ""
    })

    React.useEffect(() => {
        // Fetch Packages
        fetch('/api/packages')
            .then(res => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFetchedPackages(data)
                    // Set default package type if available
                    if (data.length > 0 && !editingTrip) {
                        setTripForm(prev => ({ ...prev, packageType: data[0].title }))
                    }
                }
            })
            .catch(err => console.error("Failed to fetch packages", err))
    }, [])

    // Handlers
    // Handlers
    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/admin/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tripForm) })
        if (res.ok) {
            setTrips([...trips, await res.json()])
            setIsCreatingTrip(false)
            setTripForm({ title: "", startDate: "", endDate: "", packageType: "Luxury", makkahNights: 5, madinahNights: 5, hotelTier: "5-star", totalSlots: 20, priceDisplay: "", imageUrl: "" })
            showToast("Trip created successfully", "success")
        } else {
            showToast("Failed to create trip", "error")
        }
    }

    const handleUpdateTrip = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTrip) return
        const res = await fetch(`/api/admin/trips?id=${editingTrip.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tripForm) })
        if (res.ok) {
            const updated = await res.json()
            setTrips(trips.map(t => t.id === updated.id ? updated : t))
            setEditingTrip(null)
            setTripForm({ title: "", startDate: "", endDate: "", packageType: "Luxury", makkahNights: 5, madinahNights: 5, hotelTier: "5-star", totalSlots: 20, priceDisplay: "", imageUrl: "" })
            showToast("Trip updated successfully", "success")
        } else {
            showToast("Failed to update trip", "error")
        }
    }

    const startEditTrip = (trip: PlannedTrip) => {
        setEditingTrip(trip)
        setTripForm({
            title: trip.title,
            startDate: format(new Date(trip.startDate), 'yyyy-MM-dd'),
            endDate: format(new Date(trip.endDate), 'yyyy-MM-dd'),
            packageType: trip.packageType,
            makkahNights: trip.makkahNights,
            madinahNights: trip.madinahNights,
            hotelTier: trip.hotelTier,
            totalSlots: trip.totalSlots,
            priceDisplay: trip.priceDisplay || "",
            imageUrl: trip.imageUrl || ""
        })
        setIsCreatingTrip(false)
    }

    const handleDeleteTrip = async (id: string) => {
        if (confirm("Delete this trip?")) {
            const res = await fetch(`/api/admin/trips?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTrips(trips.filter(t => t.id !== id))
                showToast("Trip deleted", "success")
            } else {
                showToast("Failed to delete trip", "error")
            }
        }
    }

    const updateRequestStatus = async (id: string, status: string, type: 'trip' | 'join') => {
        if (status === 'Deleted') {
            if (!confirm("Permanently delete this request? This cannot be undone.")) return

            // Optimistic Remove
            if (type === 'trip') {
                setTripRequests(tripRequests.filter(r => r.id !== id))
            } else {
                setJoinRequests(joinRequests.filter(r => r.id !== id))
            }

            const res = await fetch(`/api/admin/requests/delete?id=${id}&type=${type}`, { method: 'DELETE' })
            if (res.ok) {
                showToast("Request permanently deleted", "success")
            } else {
                showToast("Failed to delete request", "error")
            }
        } else {
            // Optimistic update
            if (type === 'trip') {
                setTripRequests(tripRequests.map(r => r.id === id ? { ...r, status } : r))
            } else {
                setJoinRequests(joinRequests.map(r => r.id === id ? { ...r, status } : r))
            }

            const res = await fetch('/api/admin/requests/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })

            if (!res.ok) {
                showToast("Failed to update status", "error")
            } else {
                showToast(`Request marked as ${status}`, "success")
            }
        }
    }

    // Blocked Dates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [blockedDates, setBlockedDates] = React.useState<any[]>([])
    const minDate = addMonths(startOfToday(), 3)
    const [viewDate, setViewDate] = React.useState(minDate)
    const [selectionStart, setSelectionStart] = React.useState<Date | null>(null)
    const [selectionEnd, setSelectionEnd] = React.useState<Date | null>(null)

    React.useEffect(() => {
        if (activeTab === 'availability') {
            fetch('/api/admin/availability')
                .then(res => res.json())
                .then((data: any[]) => {
                    // Fix timezone shifting issue by ignoring timezone data
                    setBlockedDates(data.map(d => ({ ...d, parsedDate: d.date.split('T')[0] })))
                })
        }
    }, [activeTab])

    const handleBlockRange = async () => {
        if (!selectionStart) return

        let datesToBlock: string[] = []

        if (selectionEnd) {
            // Range
            const start = selectionStart < selectionEnd ? selectionStart : selectionEnd
            const end = selectionStart < selectionEnd ? selectionEnd : selectionStart
            const days = eachDayOfInterval({ start, end })
            datesToBlock = days.map(d => format(d, 'yyyy-MM-dd'))
        } else {
            // Single
            datesToBlock = [format(selectionStart, 'yyyy-MM-dd')]
        }

        const res = await fetch('/api/admin/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dates: datesToBlock, reason: "Admin Blocked" })
        })

        if (res.ok) {
            // Refresh blocked dates
            fetch('/api/admin/availability')
                .then(res => res.json())
                .then((data: any[]) => {
                    setBlockedDates(data.map(d => ({ ...d, parsedDate: d.date.split('T')[0] })))
                })
            setSelectionStart(null)
            setSelectionEnd(null)
            showToast("Dates blocked successfully", "success")
        } else {
            showToast("Failed to block dates", "error")
        }
    }

    const handleUnblockDate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent selection when clicking unblock
        const res = await fetch(`/api/admin/availability?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            setBlockedDates(blockedDates.filter(d => d.id !== id))
            showToast("Date unblocked", "success")
        } else {
            showToast("Failed to unblock", "error")
        }
    }

    const handleDateClick = (date: Date) => {
        if (isBefore(date, minDate)) return;
        if (!selectionStart || (selectionStart && selectionEnd)) {
            setSelectionStart(date)
            setSelectionEnd(null)
        } else {
            // If clicking the same date, treat as single selection
            if (isSameDay(date, selectionStart)) {
                return // Already selected
            }
            // Set end date
            if (isBefore(date, selectionStart)) {
                setSelectionEnd(selectionStart)
                setSelectionStart(date)
            } else {
                setSelectionEnd(date)
            }
        }
    }

    // Package Management State
    const [isCreatingPackage, setIsCreatingPackage] = React.useState(false)
    const [editingPackage, setEditingPackage] = React.useState<Package | null>(null)
    const [packageForm, setPackageForm] = React.useState<Partial<Package>>({
        title: "", description: "", price: "", features: [], notes: [], isPopular: false
    })

    const handleCreatePackage = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/admin/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packageForm)
        })
        if (res.ok) {
            setPackages([...packages, await res.json()].sort((a, b) => a.order - b.order))
            setIsCreatingPackage(false)
            setPackageForm({ title: "", description: "", price: "", features: [], notes: [], isPopular: false })
            showToast("Package created", "success")
        } else {
            showToast("Failed to create package", "error")
        }
    }

    const [isPkgSubmitting, setIsPkgSubmitting] = React.useState(false)

    const handleUpdatePackage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPackage || isPkgSubmitting) return
        setIsPkgSubmitting(true)
        try {
            const res = await fetch(`/api/admin/packages/${editingPackage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageForm)
            })
            if (res.ok) {
                const updated = await res.json()
                setPackages(packages.map(p => p.id === updated.id ? updated : p))
                setEditingPackage(null)
                setPackageForm({ title: "", description: "", price: "", features: [], notes: [], isPopular: false })
                showToast("Package updated", "success")
            } else {
                showToast('Failed to update package.', 'error')
            }
        } catch (err) {
            console.error(err)
            showToast('An error occurred.', 'error')
        } finally {
            setIsPkgSubmitting(false)
        }
    }

    const handleDeletePackage = async (id: string) => {
        if (confirm("Delete this package?")) {
            const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setPackages(packages.filter(p => p.id !== id))
                showToast("Package deleted", "success")
            } else {
                showToast("Failed to delete package", "error")
            }
        }
    }

    const startEditPackage = (pkg: Package) => {
        setEditingPackage(pkg)
        setPackageForm(pkg)
        setIsCreatingPackage(false)
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
                    <SidebarItem id="requests" icon={Inbox} label="Inbox" count={inboxTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="contacted" icon={CheckCircle} label="Contacted" count={contactedTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="archived" icon={Archive} label="Archived" count={archivedTripRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="joins" icon={Users} label="Join Requests" count={newJoinRequests.length} activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-3 mt-8">Management</div>
                    <SidebarItem id="trips" icon={Plane} label="Planned Trips" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SidebarItem id="packages" icon={Briefcase} label="Packages" activeTab={activeTab} setActiveTab={setActiveTab} />
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
                                            className="liquid-glass-dark p-6 squircle hover:scale-[1.02] transition-transform group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-4 rounded-full liquid-glass ${stat.color} group-hover:scale-110 transition-transform`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-4xl font-bold text-white tracking-tighter">{stat.value}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider pl-1">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="liquid-glass-dark squircle p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[...tripRequests, ...joinRequests]
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .slice(0, 5)
                                            .map((req, index) => {
                                                const isTrip = 'packageType' in req
                                                const isLatest = index === 0
                                                // If it's the latest, force the "New" look. Otherwise use status.
                                                // If status is 'New' but not latest, show as 'Pending' or standard gray.
                                                const displayStatus = isLatest ? 'New' : (req.status === 'New' ? 'Pending' : req.status)

                                                return (
                                                    <motion.div key={req.id}
                                                        onClick={() => setActiveTab(isTrip ? 'requests' : 'joins')}
                                                        whileTap={{ scale: 0.95, filter: "brightness(0.9)" }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                        className="flex items-center justify-between p-4 water-capsule hover:bg-white/10 transition-colors cursor-pointer group shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 transition-colors ${isLatest ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20' :
                                                                req.status === 'Contacted' ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' :
                                                                    'bg-gray-500/10 text-gray-400 group-hover:bg-gray-500/20'
                                                                }`}>
                                                                {isTrip ? <Inbox className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white leading-tight">{req.fullName}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className={`text-[10px] uppercase tracking-wider font-medium ${isLatest ? 'text-blue-400 animate-pulse' :
                                                                        req.status === 'Contacted' ? 'text-green-400' :
                                                                            'text-gray-500'
                                                                        }`}>{displayStatus}</span>
                                                                    <span className="text-[10px] text-gray-600">•</span>
                                                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{isTrip ? 'Trip Request' : 'Join Request'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-medium bg-black px-3 py-1 rounded-full border border-white/5">{format(new Date(req.createdAt), 'MMM d')}</span>
                                                    </motion.div>
                                                )
                                            })}
                                        {(tripRequests.length + joinRequests.length) === 0 && <p className="text-gray-500 text-center py-4">No recent activity.</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'requests' || activeTab === 'contacted' || activeTab === 'archived') && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {(activeTab === 'requests' ? inboxTripRequests : activeTab === 'contacted' ? contactedTripRequests : archivedTripRequests).map(req => (
                                        <RequestCard key={req.id} req={req} type="trip" updateRequestStatus={updateRequestStatus} />
                                    ))}
                                    {(activeTab === 'requests' ? inboxTripRequests : activeTab === 'contacted' ? contactedTripRequests : archivedTripRequests).length === 0 && (
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

                                {isCreatingTrip || editingTrip ? (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0, y: -20, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, height: 'auto', y: 0, filter: "blur(0px)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip}
                                        className="liquid-glass-dark p-8 squircle border border-white/10 space-y-6 mb-8 overflow-hidden shadow-2xl"
                                    >
                                        <h3 className="text-lg font-bold text-white mb-4">{editingTrip ? 'Edit Trip' : 'New Trip'}</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Trip Title</label>
                                                <input required placeholder="Summer Youth Group" value={tripForm.title} onChange={e => setTripForm({ ...tripForm, title: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Package Type</label>
                                                <select value={tripForm.packageType} onChange={e => setTripForm({ ...tripForm, packageType: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors appearance-none">
                                                    {fetchedPackages.length > 0 ? (
                                                        fetchedPackages.map(pkg => (
                                                            <option key={pkg.id} value={pkg.title}>{pkg.title}</option>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <option value="Luxury">Luxury</option>
                                                            <option value="Comfort">Comfort</option>
                                                            <option value="Budget">Budget</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Start Date</label>
                                                <input required type="date" value={tripForm.startDate} onChange={e => setTripForm({ ...tripForm, startDate: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">End Date</label>
                                                <input required type="date" value={tripForm.endDate} onChange={e => setTripForm({ ...tripForm, endDate: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Makkah Nights</label>
                                                <input required type="number" placeholder="5" value={tripForm.makkahNights} onChange={e => setTripForm({ ...tripForm, makkahNights: parseInt(e.target.value) })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Madinah Nights</label>
                                                <input required type="number" placeholder="5" value={tripForm.madinahNights} onChange={e => setTripForm({ ...tripForm, madinahNights: parseInt(e.target.value) })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Hotel Tier</label>
                                                <input placeholder="Economy" value={tripForm.hotelTier} onChange={e => setTripForm({ ...tripForm, hotelTier: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Total Slots</label>
                                                <input required type="number" placeholder="40" value={tripForm.totalSlots} onChange={e => setTripForm({ ...tripForm, totalSlots: parseInt(e.target.value) })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <label className="text-sm text-gray-400 font-medium ml-1">Image URL</label>
                                                <input placeholder="https://images.unsplash.com/..." value={tripForm.imageUrl} onChange={e => setTripForm({ ...tripForm, imageUrl: e.target.value })} className="w-full liquid-glass-input rounded-xl p-4 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button type="submit" className="flex-1 rounded-xl py-4 text-lg">{editingTrip ? 'Update Trip' : 'Create Trip'}</Button>
                                            <Button type="button" variant="outline" onClick={() => { setIsCreatingTrip(false); setEditingTrip(null) }} className="flex-1 rounded-xl py-4 text-lg">Cancel</Button>
                                        </div>
                                    </motion.form>
                                ) : null}

                                <div className="grid grid-cols-1 gap-4">
                                    {trips.map(trip => (
                                        <motion.div key={trip.id} whileHover={{ scale: 1.01 }} className="liquid-glass border border-white/10 p-6 squircle flex justify-between items-center group transition-colors hover:bg-white/5">
                                            <div className="flex items-center gap-4">
                                                {trip.imageUrl && <NextImage src={trip.imageUrl} alt={trip.title} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />}
                                                <div>
                                                    <h3 className="font-bold text-white text-lg">{trip.title}</h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')} • <span className="text-primary">{trip.availableSlots} slots left</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => startEditTrip(trip)} className="text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDeleteTrip(trip.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">Blocked Dates</h2>
                                    <div className="flex gap-4 items-center">
                                        {selectionStart && (
                                            <div className="text-sm text-gray-400">
                                                Selected: <span className="text-white font-bold">{format(selectionStart, 'MMM d')}</span>
                                                {selectionEnd && <> - <span className="text-white font-bold">{format(selectionEnd, 'MMM d')}</span></>}
                                            </div>
                                        )}
                                        <Button onClick={handleBlockRange} disabled={!selectionStart} className="rounded-full">
                                            {selectionStart && selectionEnd
                                                ? `Block ${eachDayOfInterval({ start: selectionStart, end: selectionEnd }).length} Days`
                                                : "Block Selected"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="liquid-glass-dark squircle border border-white/10 p-8 shadow-2xl">
                                    {/* Month Navigation */}
                                    <div className="flex items-center justify-between mb-8">
                                        <Button size="sm" variant="ghost" onClick={() => setViewDate(addMonths(viewDate, -1))} className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></Button>
                                        <h3 className="text-xl font-bold text-white">{format(viewDate, 'MMMM yyyy')}</h3>
                                        <Button size="sm" variant="ghost" onClick={() => setViewDate(addMonths(viewDate, 1))} className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/10"><ChevronRight className="w-5 h-5" /></Button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-4 mb-4">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                            <div key={d} className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {(() => {
                                            const start = startOfMonth(viewDate)
                                            const end = endOfMonth(viewDate)
                                            const days = eachDayOfInterval({ start, end })

                                            // Padding days
                                            const startDay = start.getDay()
                                            const padding = Array.from({ length: startDay }, (_, i) => i)

                                            return (
                                                <>
                                                    {padding.map(i => <div key={`pad-${i}`} />)}
                                                    {days.map((day, i) => {
                                                        const dateStr = format(day, 'yyyy-MM-dd')
                                                        const isBlocked = blockedDates.some(bd => bd.parsedDate === dateStr)
                                                        const blockedId = blockedDates.find(bd => bd.parsedDate === dateStr)?.id

                                                        const isSelected = selectionStart && (
                                                            isSameDay(day, selectionStart) ||
                                                            (selectionEnd && isSameDay(day, selectionEnd)) ||
                                                            (selectionEnd && isAfter(day, selectionStart) && isBefore(day, selectionEnd))
                                                        )

                                                        const isStart = selectionStart && isSameDay(day, selectionStart)
                                                        const isEnd = selectionEnd && isSameDay(day, selectionEnd)
                                                        const isPastBookingWindow = isBefore(day, minDate)

                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={() => !isPastBookingWindow && handleDateClick(day)}
                                                                className={`aspect-square rounded-xl flex items-center justify-center transition-all border relative overflow-hidden ${isPastBookingWindow
                                                                    ? 'bg-black/20 border-white/5 text-gray-800 cursor-not-allowed opacity-50'
                                                                    : isBlocked
                                                                        ? 'bg-red-500/10 border-red-500/30 text-red-500 cursor-pointer' // Blocked style
                                                                        : isStart || isEnd
                                                                            ? 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] ring-offset-2 ring-offset-black scale-[1.05] z-10 font-bold cursor-pointer'
                                                                            : isSelected
                                                                                ? 'bg-primary/20 border-primary/50 text-primary cursor-pointer'
                                                                                : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer'
                                                                    }`}
                                                            >
                                                                <span className="text-sm font-medium relative z-10">{format(day, 'd')}</span>
                                                                {isBlocked && (
                                                                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                                                                        <Button size="sm" variant="ghost" onClick={(e) => blockedId && handleUnblockDate(blockedId, e)} className="h-6 w-6 p-0 rounded-full bg-red-500 text-white hover:bg-red-600">
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })()}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-6 text-center">Click start date, then end date to select a range.</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'packages' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-white">Packages</h2>
                                    {!isCreatingPackage && !editingPackage && (
                                        <Button onClick={() => { setIsCreatingPackage(true); setEditingPackage(null); setPackageForm({ title: "", description: "", price: "", features: [], notes: [], isPopular: false }) }} className="rounded-full px-6">
                                            <Plus className="mr-2 h-4 w-4" /> Create New Package
                                        </Button>
                                    )}
                                </div>

                                {(isCreatingPackage || editingPackage) && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage}
                                        className="bg-zinc-900/50 p-8 rounded-[2rem] border border-white/10 space-y-6 mb-8"
                                    >
                                        <h3 className="text-lg font-bold text-white mb-4">{editingPackage ? 'Edit Package' : 'New Package'}</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <input required placeholder="Title" value={packageForm.title} onChange={e => setPackageForm({ ...packageForm, title: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <input required placeholder="Price Display (e.g. From $1,500)" value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })} className="bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            <div className="col-span-2">
                                                <input required placeholder="Description" value={packageForm.description} onChange={e => setPackageForm({ ...packageForm, description: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm text-gray-400 block mb-2">Features (one per line)</label>
                                                <textarea required value={Array.isArray(packageForm.features) ? packageForm.features.join('\n') : ''} onChange={e => setPackageForm({ ...packageForm, features: e.target.value.split('\n') })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors h-32" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm text-gray-400 block mb-2">Notes (one per line)</label>
                                                <textarea value={Array.isArray(packageForm.notes) ? packageForm.notes.join('\n') : ''} onChange={e => setPackageForm({ ...packageForm, notes: e.target.value.split('\n') })} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none transition-colors h-24" />
                                            </div>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" checked={packageForm.isPopular} onChange={e => setPackageForm({ ...packageForm, isPopular: e.target.checked })} className="rounded border-gray-600 bg-black text-primary" />
                                                <span className="text-white">Mark as Popular</span>
                                            </label>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button type="submit" className="flex-1 rounded-xl py-4 text-lg">{editingPackage ? 'Update' : 'Create'}</Button>
                                            <Button type="button" variant="outline" onClick={() => { setIsCreatingPackage(false); setEditingPackage(null) }} className="flex-1 rounded-xl py-4 text-lg">Cancel</Button>
                                        </div>
                                    </motion.form>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                                    {packages.map(pkg => (
                                        <div key={pkg.id} className={`bg-zinc-900/50 border ${pkg.isPopular ? 'border-primary/50' : 'border-white/10'} p-6 rounded-[2rem] flex flex-col relative group hover:bg-zinc-900 transition-all`}>
                                            {pkg.isPopular && <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded">POPULAR</div>}
                                            <h3 className="font-bold text-white text-lg mb-2">{pkg.title}</h3>
                                            <p className="text-primary font-medium text-sm mb-4">{pkg.price}</p>
                                            <p className="text-gray-400 text-xs mb-4 line-clamp-3">{pkg.description}</p>

                                            <div className="mt-auto flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => startEditPackage(pkg)} className="flex-1 rounded-full border-white/10 text-xs">Edit</Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDeletePackage(pkg.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 rounded-full px-2">
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <AnimatePresence>
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>
            </div >
        </div >
    )
}
