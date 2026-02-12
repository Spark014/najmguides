import { Suspense } from "react"
import { TripWizard } from "@/components/TripWizard"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function PlanATripPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: packages } = await supabase.from('Package').select('*').order('order', { ascending: true })

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#D4AF37]/30">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#B5952F]/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto mb-16 text-center relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">Plan Your Custom Umrah</h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Tell us your preferences and we&apos;ll craft the perfect spiritual journey for you.
                </p>
            </div>

            <div className="relative z-10">
                <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
                    <TripWizard packages={packages || []} />
                </Suspense>
            </div>
        </div>
    )
}
