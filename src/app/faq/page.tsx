
// Actually, I'll just create a simple FAQ component in the page for speed.

export default function FAQPage() {
    const faqs = [
        {
            q: "What is included in Najm Guides service?",
            a: "We handle flights, hotels, visa processing, and ground transport. We also provide on-ground guidance for performing Umrah rituals correctly."
        },
        {
            q: "Can I choose any date for my trip?",
            a: "Yes, for custom trips you can choose any date. However, some dates might be unavailable due to high demand or our team's capacity. Check the calendar on the 'Plan a Trip' page."
        },
        {
            q: "Why are some dates unavailable?",
            a: "We limit the number of pilgrims we serve to ensure high quality and personal attention. During peak seasons, slots fill up quickly."
        },
        {
            q: "How do planned trips work?",
            a: "Planned trips are group packages with fixed dates and itineraries. You join a group of other pilgrims, which is great for community and shared learning."
        },
        {
            q: "When is the pricing finalized?",
            a: "For custom trips, we give you an estimate first. The final price is confirmed when we book the flights and hotels, as market rates fluctuate."
        },
        {
            q: "What documents are required?",
            a: "You typically need a valid passport (with 6 months validity) and a passport-sized photo. We will guide you on the specific visa requirements for your country."
        },
        {
            q: "What are the payment stages?",
            a: "Usually, a deposit is required to start the booking process. The remaining balance is due before travel. We will provide a clear schedule."
        },
        {
            q: "Do you guide us during Umrah rituals?",
            a: "Yes! This is our core value. We provide guidance on how to perform Umrah according to the Sunnah, so you can worship with confidence."
        }
    ]

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-400">
                        Common questions about our services and the Umrah journey.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <details key={index} className="group bg-zinc-900 border border-white/10 rounded-xl overflow-hidden open:border-primary/50 transition-all">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors pr-4">
                                    {faq.q}
                                </h3>
                                <span className="text-primary transition-transform group-open:rotate-180">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    )
}
