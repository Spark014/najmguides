import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function PackagesPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: packages } = await supabase.from('Package').select('*').order('order', { ascending: true })

    return (
        <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Packages</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transparent pricing and clear inclusions. Choose the level of comfort that suits you best.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20 place-content-center">
                    {packages?.map((pkg) => (
                        <div key={pkg.id} className={`flex flex-col relative group transition-all duration-300 rounded-[32px] p-8 backdrop-blur-2xl ${pkg.isPopular
                            ? 'bg-black border border-primary/30 shadow-[0_8px_32px_rgba(212,175,55,0.12)] hover:shadow-[0_12px_48px_rgba(212,175,55,0.18)]'
                            : 'bg-zinc-900/60 border border-white/5 hover:bg-zinc-900/80'
                            }`}>
                            {pkg.isPopular && (
                                <div className="absolute top-6 right-6 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold tracking-wide z-10 shadow-sm">
                                    POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold mb-3 ${pkg.isPopular ? 'text-white gold-gradient-text' : 'text-white'}`}>{pkg.title}</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">{pkg.description}</p>
                            </div>

                            <div className="flex-grow space-y-4 mb-8">
                                <ul className="space-y-3">
                                    {pkg.features?.map((item: string, i: number) => (
                                        <li key={i} className={`flex items-start text-sm ${pkg.isPopular ? 'text-white' : 'text-gray-300'}`}>
                                            <div className={`p-0.5 rounded-full mr-3 shrink-0 mt-0.5 ${pkg.isPopular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {pkg.notes && pkg.notes.length > 0 && (
                                    <div className={`mt-6 pt-6 border-t ${pkg.isPopular ? 'border-white/10' : 'border-white/5'}`}>
                                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${pkg.isPopular ? 'text-primary' : 'text-gray-500'}`}>Notes</p>
                                        <ul className="space-y-2">
                                            {pkg.notes.map((note: string, i: number) => (
                                                <li key={i} className={`text-xs flex items-center ${pkg.isPopular ? 'text-gray-300' : 'text-gray-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${pkg.isPopular ? 'bg-primary' : 'bg-gray-600'}`} />
                                                    {note}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto">
                                <div className="mb-6">
                                    <p className="text-2xl font-bold text-white">{pkg.price} <span className="text-sm font-normal text-gray-400">per person</span></p>
                                    <p className="text-[10px] text-gray-500 mt-1">Final price confirmed after flight ticketing.</p>
                                </div>
                                <Link href={`/plan-a-trip?package=${pkg.title.toLowerCase().replace(' umrah', '').replace(' ', '-')}`}>
                                    <Button className={`w-full h-12 rounded-full font-semibold transition-all duration-300 ${pkg.isPopular
                                        ? 'shadow-[0_4px_14px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02]'
                                        : 'border border-white/10 text-white hover:bg-white hover:text-black hover:scale-[1.02]'
                                        }`} variant={pkg.isPopular ? 'primary' : 'ghost'}>
                                        Select {pkg.title.replace(' Umrah', '')}
                                    </Button>
                                </Link>
                                <Link href="/contact" className={`block mt-3 text-center text-sm transition-colors ${pkg.isPopular ? 'text-primary/70 hover:text-primary' : 'text-gray-400 hover:text-white'}`}>
                                    Contact for details →
                                </Link>
                            </div>
                        </div>
                    ))}
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
