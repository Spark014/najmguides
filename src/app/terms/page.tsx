export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Terms & Policies</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Pricing & Flight Fares</h2>
                        <p>
                            All prices provided in initial quotes are estimates based on current availability. Flight fares are subject to change until the ticket is issued. We will always confirm the final price with you before booking.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Deposits & Payments</h2>
                        <p>
                            A non-refundable deposit is required to secure your hotel and visa processing. The remaining balance must be paid in full at least 14 days before your departure date. We accept bank transfers and major credit cards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Cancellation & Refunds</h2>
                        <p>
                            Cancellations made more than 30 days before departure may be eligible for a partial refund, excluding the non-refundable deposit and any unrecoverable costs (e.g., visa fees). Cancellations within 30 days are generally non-refundable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Visa Responsibility</h2>
                        <p>
                            While we assist with visa processing, it is the client&apos;s responsibility to provide accurate and valid documentation. We are not responsible for visa rejections due to incorrect information or government decisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">On-Ground Conduct</h2>
                        <p>
                            We expect all pilgrims to conduct themselves with respect and adhere to the laws of Saudi Arabia. We reserve the right to withdraw services from anyone behaving inappropriately.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
