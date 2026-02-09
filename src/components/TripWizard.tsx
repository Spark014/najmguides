"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfToday } from "date-fns"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3

export function TripWizard() {
    const searchParams = useSearchParams()
    const initialPackage = searchParams.get('package') || 'luxury'

    const [step, setStep] = React.useState<Step>(1)
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
    // Start 3 months from today
    const minDate = addMonths(startOfToday(), 3)
    const [currentMonth, setCurrentMonth] = React.useState(minDate)

    const handleNext = () => {
        if (step < 3) setStep((s) => (s + 1) as Step)
    }

    const handleBack = () => {
        if (step > 1) setStep((s) => (s - 1) as Step)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/trip-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Ensure numbers are actually numbers before sending
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
            <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Request Received!</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    We have received your trip details. One of our guides will review your request and contact you within 24–48 hours.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                    Chat on WhatsApp
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Progress Bar */}
            <div className="bg-black border-b border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-medium", step >= 1 ? "text-primary" : "text-gray-500")}>Dates</span>
                    <span className={cn("text-sm font-medium", step >= 2 ? "text-primary" : "text-gray-500")}>Preferences</span>
                    <span className={cn("text-sm font-medium", step >= 3 ? "text-primary" : "text-gray-500")}>Contact</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="p-6 md:p-8 min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h2 className="text-2xl font-bold text-white">Choose your travel window</h2>
                        <p className="text-gray-400">
                            Please select a start date at least 3 months from today ({format(minDate, 'MMMM d, yyyy')}).
                        </p>

                        {/* Custom Calendar */}
                        <div className="bg-black border border-white/10 rounded-xl p-4 max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} disabled={isBefore(addMonths(currentMonth, -1), startOfMonth(minDate))} className="p-1 hover:bg-white/10 rounded disabled:opacity-30"><ChevronLeft className="text-white" /></button>
                                <span className="text-white font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
                                <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="text-white" /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                    <span key={d} className="text-xs text-gray-500">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day) => {
                                    const isSelected = dateRange.start && isSameDay(day, dateRange.start)
                                    const isDisabled = isBefore(day, minDate)

                                    return (
                                        <button
                                            key={day.toString()}
                                            disabled={isDisabled}
                                            onClick={() => setDateRange({ ...dateRange, start: day })}
                                            className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors",
                                                isSelected && "bg-primary text-black font-bold",
                                                !isSelected && !isDisabled && "text-white hover:bg-white/10",
                                                isDisabled && "text-gray-800 cursor-not-allowed",
                                                isToday(day) && !isSelected && "border border-gray-800 text-gray-800"
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleNext} disabled={!dateRange.start}>
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h2 className="text-2xl font-bold text-white">Trip Preferences</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-sm text-gray-400 font-medium uppercase tracking-wider">Package Type</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['budget', 'comfort', 'luxury'].map((type) => (
                                        <label key={type} className={cn(
                                            "border rounded-2xl p-4 cursor-pointer transition-all flex flex-col items-center text-center gap-2 group",
                                            formData.packageType === type
                                                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                                                : "border-white/10 hover:border-white/30 hover:bg-white/5"
                                        )}>
                                            <input
                                                type="radio"
                                                name="packageType"
                                                value={type}
                                                checked={formData.packageType === type}
                                                onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                                                className="hidden"
                                            />
                                            <div className="font-bold text-white capitalize text-lg">{type}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                {type === 'budget' ? 'Essential' : type === 'comfort' ? 'Balanced' : 'Premium'}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Number of Travelers</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.travelers}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        setFormData({ ...formData, travelers: val === '' ? '' : parseInt(val) })
                                    }}
                                    className="w-full bg-black border border-white/10 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Departure Country</label>
                                <input
                                    type="text"
                                    value={formData.departureCountry}
                                    onChange={(e) => setFormData({ ...formData, departureCountry: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    placeholder="e.g. UK, USA, Canada"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Departure City</label>
                                <input
                                    type="text"
                                    value={formData.departureCity}
                                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
                                    placeholder="e.g. London"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Notes / Special Requirements</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none h-24 resize-none"
                                placeholder="Any dietary restrictions, accessibility needs, etc."
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                            <Button onClick={handleNext}>Next Step</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h2 className="text-2xl font-bold text-white">Contact Details</h2>
                        <p className="text-gray-400">Where should we send your custom quote?</p>

                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Phone / WhatsApp</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>Back</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.fullName || !formData.email}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Submit Request"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
