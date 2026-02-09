import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function PackagesPage() {
    return (
        <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Packages</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transparent pricing and clear inclusions. Choose the level of comfort that suits you best.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
                    {/* Budget */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col hover:bg-zinc-900 transition-colors duration-300 group">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3">Budget Umrah</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">Ideal for first-time pilgrims and budget-conscious travellers.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8">
                            <ul className="space-y-3">
                                {[
                                    "Economy-class return flights",
                                    "Budget hotel accommodation (standard distance from Haram)",
                                    "Umrah visa processing",
                                    "On-ground Umrah guidance during the performance of Umrah",
                                    "Group-based guidance",
                                    "Trip coordination and assistance"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-300">
                                        <Check className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                                <ul className="space-y-2">
                                    <li className="text-xs text-gray-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-2" /> Larger group size</li>
                                    <li className="text-xs text-gray-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-2" /> Fixed guidance schedule</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-6">
                                <p className="text-2xl font-bold text-white">From $X,XXX <span className="text-sm font-normal text-gray-500">per person</span></p>
                                <p className="text-[10px] text-gray-500 mt-1">Final price confirmed after flight ticketing.</p>
                            </div>
                            <Link href="/plan-a-trip">
                                <Button variant="outline" className="w-full rounded-full border-white/10 hover:bg-white hover:text-black transition-all">Select Budget</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Comfort */}
                    <div className="bg-zinc-900 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden group hover:border-primary/40 transition-colors duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3">Comfort Umrah</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">Balanced option for families, elderly pilgrims, and those seeking comfort without luxury pricing.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8">
                            <ul className="space-y-3">
                                {[
                                    "Improved flight timings",
                                    "Mid-range hotel accommodation (closer to Haram)",
                                    "Umrah visa processing",
                                    "Priority on-ground Umrah guidance",
                                    "Medium-sized group",
                                    "Enhanced coordination and pacing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-200">
                                        <Check className="w-5 h-5 text-primary/70 mr-3 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                                <ul className="space-y-2">
                                    <li className="text-xs text-gray-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2" /> Reduced walking distance</li>
                                    <li className="text-xs text-gray-400 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2" /> More structured guidance</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-6">
                                <p className="text-2xl font-bold text-white">From $X,XXX <span className="text-sm font-normal text-gray-500">per person</span></p>
                                <p className="text-[10px] text-gray-500 mt-1">Final price confirmed after flight ticketing.</p>
                            </div>
                            <Link href="/plan-a-trip">
                                <Button className="w-full rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 transition-all">Select Comfort</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Luxury */}
                    <div className="bg-black border border-primary/50 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] transition-all duration-300">
                        <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-4 py-1.5 rounded-bl-xl tracking-wider">PREMIUM</div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3 gold-gradient-text">Luxury Umrah</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">Designed for pilgrims seeking maximum comfort and minimal physical strain.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-8">
                            <ul className="space-y-3">
                                {[
                                    "Best available flight options",
                                    "Premium hotel accommodation (very close to Haram)",
                                    "Umrah visa processing",
                                    "High-attention on-ground Umrah guidance",
                                    "Small group size",
                                    "Flexible scheduling"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-white">
                                        <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Notes</p>
                                <ul className="space-y-2">
                                    <li className="text-xs text-gray-300 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" /> Highest comfort level</li>
                                    <li className="text-xs text-gray-300 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" /> Maximum guide attention</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="mb-6">
                                <p className="text-2xl font-bold text-white">From $X,XXX <span className="text-sm font-normal text-gray-500">per person</span></p>
                                <p className="text-[10px] text-gray-500 mt-1">Final price confirmed after flight ticketing.</p>
                            </div>
                            <Link href="/plan-a-trip">
                                <Button className="w-full rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all">Select Luxury</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 text-center backdrop-blur-sm">
                    <p className="text-gray-400 text-sm leading-relaxed">
                        <span className="text-white font-bold block mb-2">Pricing Disclaimer</span>
                        Package prices are indicative and subject to flight availability at the time of booking. Any change in flight fares before ticketing will be reflected in the final price. Guide and service fees remain fixed.
                    </p>
                </div>
            </div>
        </div>
    )
}
