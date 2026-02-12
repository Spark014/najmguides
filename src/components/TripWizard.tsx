"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfToday } from "date-fns"
import { ChevronLeft, ChevronRight, Check, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type Step = 1 | 2 | 3

interface Package {
    id: string
    title: string
    description: string
    [key: string]: any
}

interface TripWizardProps {
    packages: Package[]
}

export function TripWizard({ packages }: TripWizardProps) {
    const searchParams = useSearchParams()
    const initialPackage = searchParams.get('package') || 'luxury'

    // Fallback if no packages provided
    const displayPackages = packages && packages.length > 0 ? packages : [
        { title: 'Budget Umrah', id: 'budget', description: 'Essential' },
        { title: 'Comfort Umrah', id: 'comfort', description: 'Balanced' },
        { title: 'Luxury Umrah', id: 'luxury', description: 'Premium' }
    ]

    const [step, setStep] = React.useState<Step>(1)
    const [direction, setDirection] = React.useState(0)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSuccess, setIsSuccess] = React.useState(false)

    // Form State
    const [dateRange, setDateRange] = React.useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })
    const [formData, setFormData] = React.useState<{
        packageType: string
        travelers: number | string
        tripLength: number | string
        makkahDays: number | string
        madinahDays: number | string
        departureCountry: string
        departureCity: string
        notes: string
        fullName: string
        email: string
        phone: string
    }>({
        packageType: initialPackage,
        travelers: 2,
        tripLength: 10,
        makkahDays: 5,
        madinahDays: 5,
        departureCountry: "United States",
        departureCity: "",
        notes: "",
        fullName: "",
        email: "",
        phone: ""
    })

    // Calendar State
    const minDate = addMonths(startOfToday(), 3)
    const [currentMonth, setCurrentMonth] = React.useState(minDate)

    const handleNext = () => {
        if (step < 3) {
            setDirection(1)
            setStep((s) => (s + 1) as Step)
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setDirection(-1)
            setStep((s) => (s - 1) as Step)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/trip-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    travelers: Number(formData.travelers) || 1,
                    tripLength: Number(formData.tripLength) || 1,
                    makkahDays: Number(formData.makkahDays) || 1,
                    madinahDays: Number(formData.madinahDays) || 1,
                    startDate: dateRange.start,
                    endDate: dateRange.end
                })
            })

            if (res.ok) {
                setIsSuccess(true)
            } else {
                alert("Something went wrong. Please try again.")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calendar Helpers
    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1))

    if (isSuccess) {
        return (
            <div className="text-center py-20 px-6 space-y-8 animate-in fade-in zoom-in duration-700 max-w-lg mx-auto bg-black/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
                <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <Check className="w-12 h-12 text-black" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Request Received</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        We have received your trip details. One of our guides will review your request and contact you within 24–48 hours.
                    </p>
                </div>
                <Button
                    onClick={() => window.location.href = '/'}
                    className="w-full h-14 rounded-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                >
                    Back to Home
                </Button>
            </div>
        )
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        })
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Minimal Progress Bar */}
            <div className="flex justify-center mb-12 gap-3">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            "h-1.5 w-12 rounded-full transition-all duration-500",
                            step >= s ? "bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-white/10"
                        )}
                    />
                ))}
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
                <div className="flex-grow p-8 md:p-12 relative">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 }
                            }}
                            className="w-full"
                        >
                            {step === 1 && (
                                <div className="space-y-8 max-w-2xl mx-auto text-center">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">When are you planning to go?</h2>
                                        <p className="text-xl text-gray-400">
                                            Select a start date at least 3 months from today ({format(minDate, 'MMMM d, yyyy')}).
                                        </p>
                                    </div>

                                    {/* Gold Calendar */}
                                    <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md inline-block">
                                        <div className="flex items-center justify-between mb-8 px-2">
                                            <button onClick={prevMonth} disabled={isBefore(addMonths(currentMonth, -1), startOfMonth(minDate))} className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30 transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>
                                            <span className="text-xl font-bold text-[#D4AF37] tracking-wide">{format(currentMonth, 'MMMM yyyy')}</span>
                                            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-6 h-6 text-white" /></button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-3 text-center mb-4">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <span key={d} className="text-sm font-bold text-gray-500 uppercase tracking-widest">{d}</span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {days.map((day) => {
                                                const isSelected = dateRange.start && isSameDay(day, dateRange.start)
                                                const isDisabled = isBefore(day, minDate)

                                                return (
                                                    <button
                                                        key={day.toString()}
                                                        disabled={isDisabled}
                                                        onClick={() => setDateRange({ ...dateRange, start: day })}
                                                        className={cn(
                                                            "h-12 w-12 rounded-full flex items-center justify-center text-base font-medium transition-all duration-200 relative",
                                                            isSelected && "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110 z-10 font-bold",
                                                            !isSelected && !isDisabled && "text-white hover:bg-white/10 hover:text-[#D4AF37]",
                                                            isDisabled && "text-gray-800 cursor-not-allowed",
                                                            isToday(day) && !isSelected && "ring-1 ring-[#D4AF37]/50 text-[#D4AF37]"
                                                        )}
                                                    >
                                                        {format(day, 'd')}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-10 max-w-3xl mx-auto">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">Customize your journey</h2>
                                        <p className="text-gray-400">Tell us a bit more about your preferences.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Package Tier</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {displayPackages.map((pkg) => {
                                                    const value = pkg.title.toLowerCase().replace(' umrah', '').replace(' ', '-')
                                                    const label = pkg.title.replace(' Umrah', '')
                                                    const isSelected = formData.packageType === value
                                                    return (
                                                        <label key={pkg.id} className={cn(
                                                            "relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col gap-3 group overflow-hidden",
                                                            isSelected
                                                                ? "bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-[1.02] z-10"
                                                                : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                                                        )}>
                                                            <input
                                                                type="radio"
                                                                name="packageType"
                                                                value={value}
                                                                checked={isSelected}
                                                                onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                                                                className="hidden"
                                                            />
                                                            <div className="flex justify-between items-start">
                                                                <span className={cn("text-lg font-bold tracking-tight", isSelected ? "text-black" : "text-white")}>{label}</span>
                                                                {isSelected && <div className="bg-black/20 text-black rounded-full p-1"><Check className="w-3 h-3" /></div>}
                                                            </div>
                                                            <div className={cn("text-sm font-medium line-clamp-3 leading-relaxed", isSelected ? "text-black/80" : "text-gray-400")}>
                                                                {pkg.description}
                                                            </div>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Travelers</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={formData.travelers}
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                        setFormData({ ...formData, travelers: val === '' ? '' : parseInt(val) })
                                                    }}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-xl text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                                                />
                                            </div>

                                            <div className="space-y-6">
                                                <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Departure City</label>
                                                <input
                                                    type="text"
                                                    value={formData.departureCity}
                                                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-lg text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                                                    placeholder="e.g. London, New York"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Special Requirements</label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-lg text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none h-32 resize-none transition-all placeholder:text-gray-600 leading-relaxed"
                                                placeholder="Any dietary restrictions, accessibility needs, or specific preferences..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10 max-w-xl mx-auto text-center">
                                    <div>
                                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">Where should we create your quote?</h2>
                                        <p className="text-gray-400">We&apos;ll define the perfect itinerary and send it to you.</p>
                                    </div>

                                    <div className="space-y-5 text-left">
                                        <div className="space-y-6">
                                            <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xl text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xl text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-sm text-gray-500 font-bold uppercase tracking-widest ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xl text-white focus:bg-white/10 focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-gray-600"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="text-gray-400 hover:text-white px-6 py-3 rounded-full font-medium transition-colors hover:bg-white/5"
                        >
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            disabled={step === 1 && !dateRange.start}
                            className="h-14 px-8 rounded-full text-lg font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !formData.fullName || !formData.email}
                            className="h-14 px-10 rounded-full text-lg font-bold bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                        >
                            {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Submit Request"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
