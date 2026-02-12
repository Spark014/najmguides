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
                        <div key={pkg.id} className={`flex flex-col relative group transition-all duration-300 rounded-[2.5rem] p-8 ${pkg.isPopular
                            ? 'bg-black border border-primary/50 shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]'
                            : 'bg-zinc-900/50 border border-white/5 hover:bg-zinc-900'
                            }`}>
                            {pkg.isPopular && (
                                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-4 py-1.5 rounded-bl-xl tracking-wider">PREMIUM</div>
                            )}

                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold mb-3 ${pkg.isPopular ? 'text-white gold-gradient-text' : 'text-white'}`}>{pkg.title}</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">{pkg.description}</p>
                            </div>

                            <div className="flex-grow space-y-4 mb-8">
                                <ul className="space-y-3">
                                    {pkg.features?.map((item: string, i: number) => (
                                        <li key={i} className={`flex items-start text-sm ${pkg.isPopular ? 'text-white' : 'text-gray-300'}`}>
                                            <Check className={`w-5 h-5 mr-3 shrink-0 ${pkg.isPopular ? 'text-primary' : 'text-gray-500'}`} />
                                            <span>{item}</span>
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
                                    <Button className={`w-full rounded-full transition-all ${pkg.isPopular
                                        ? 'shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
                                        : 'border border-white/10 text-white hover:bg-white hover:text-black'
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
