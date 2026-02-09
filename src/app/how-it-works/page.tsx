import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { FileText, CheckCircle, CreditCard, Plane, MapPin } from "lucide-react"

export default function HowItWorksPage() {
    const steps = [
        {
            icon: FileText,
            title: "1. Submit Request",
            desc: "Fill out our simple form to tell us your dates and preferences, or choose a planned group trip."
        },
        {
            icon: CheckCircle,
            title: "2. Confirm Details",
            desc: "We review availability and send you a custom proposal with exact pricing and itinerary."
        },
        {
            icon: CreditCard,
            title: "3. Secure Booking",
            desc: "Pay a deposit to lock in your hotels and initiate the visa process."
        },
        {
            icon: Plane,
            title: "4. Finalize & Fly",
            desc: "We issue your flight tickets and send you all travel documents. You are ready to go."
        },
        {
            icon: MapPin,
            title: "5. On-Ground Guidance",
            desc: "Arrive in Saudi Arabia where our team (or partners) will assist you with transport and Ziyarah."
        }
    ]

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h1>
                    <p className="text-xl text-gray-400">
                        Your journey to the Holy Land should be peaceful, not stressful. Here is our simple process.
                    </p>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 md:before:ml-[50%] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-white/20 before:to-transparent">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">

                            {/* Icon Bubble */}
                            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-black border-2 border-primary z-10 group-hover:scale-110 transition-transform">
                                <step.icon className="w-6 h-6 text-primary" />
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-[calc(50%-3rem)] pl-20 md:pl-0 md:pr-12 md:text-right md:group-odd:pl-12 md:group-odd:pr-0 md:group-odd:text-left">
                                <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl hover:border-primary/30 transition-colors">
                                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-400">{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/plan-a-trip">
                        <Button size="lg">Start Your Journey</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
