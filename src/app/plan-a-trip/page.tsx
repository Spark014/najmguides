import { TripWizard } from "@/components/TripWizard"

export default function PlanATripPage() {
    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan Your Custom Umrah</h1>
                <p className="text-xl text-gray-400">
                    Tell us your preferences and we&apos;ll craft the perfect spiritual journey for you.
                </p>
            </div>

            <TripWizard />
        </div>
    )
}
