"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Plane, Hotel, FileCheck, UserCheck, ArrowRight, ShieldCheck, CreditCard, HeartHandshake } from "lucide-react"
import { TypewriterEffect } from "@/components/ui/TypewriterEffect"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Home() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [0.5, 0])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Placeholder */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-primary text-sm font-medium tracking-widest uppercase">Najm Guides</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6">
              <TypewriterEffect text="Umrah Made Simple." className="gold-gradient-text" />
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Experience a spiritual journey like no other. Premium guidance, luxury stays, and complete peace of mind.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/plan-a-trip">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-300">
                Plan My Umrah
              </Button>
            </Link>
            <Link href="/planned-trips">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full backdrop-blur-sm border-white/20 hover:bg-white hover:text-black transition-all">
                View Planned Trips
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto mb-2"></div>
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* What We Handle */}
      <section className="py-32 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">We Handle Everything</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Focus on your worship while we take care of the logistics.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: Plane, title: "Flights", desc: "Best routes from US" },
              { icon: Hotel, title: "Hotels", desc: "Luxury & proximity" },
              { icon: FileCheck, title: "Visa", desc: "Hassle-free processing" },
              { icon: UserCheck, title: "Guidance", desc: "Expert on-ground support" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-[2.5rem] text-center group hover:-translate-y-2 hover:bg-zinc-900 transition-all duration-500"
                variants={fadeInUp}
              >
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform border border-white/5 shadow-lg">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="py-32 bg-zinc-950">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Choose Your Path</h2>
            <p className="text-gray-400 text-lg">Tailored to your schedule or join our community.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="relative group overflow-hidden rounded-[3rem] h-[500px]"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <h3 className="text-4xl font-bold text-white mb-4">Custom Trip</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-md">You choose the dates. We build the itinerary around you.</p>
                <Link href="/plan-a-trip">
                  <Button className="w-full rounded-full py-6 text-lg group-hover:bg-white group-hover:text-black transition-all">
                    Plan My Dates <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative group overflow-hidden rounded-[3rem] h-[500px]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1537181534458-15c006dfbd4a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <h3 className="text-4xl font-bold text-white mb-4">Planned Trips</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-md">Join a group led by our experienced guides on fixed dates.</p>
                <Link href="/planned-trips">
                  <Button variant="outline" className="w-full rounded-full py-6 text-lg bg-white/10 border-white/20 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md">
                    View Upcoming Trips <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-32 bg-black">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Packages Designed for You</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] hover:bg-zinc-900/50 transition-colors">
              <h3 className="text-3xl font-bold text-white mb-6">Budget</h3>
              <ul className="space-y-4 text-gray-400 mb-10">
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-gray-600 mr-3" /> 3-4 Star Hotels</li>
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-gray-600 mr-3" /> 10-15 min walk to Haram</li>
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-gray-600 mr-3" /> Shared Transport</li>
              </ul>
              <Link href="/packages">
                <Button variant="outline" className="w-full rounded-full py-6 border-white/10 hover:bg-white hover:text-black">View Details</Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-zinc-900 border border-primary/20 p-10 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-6 py-2 rounded-bl-2xl">POPULAR</div>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-3xl font-bold text-white mb-6 gold-gradient-text">Luxury</h3>
              <ul className="space-y-4 text-gray-400 mb-10 relative z-10">
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-primary mr-3" /> 5 Star Hotels</li>
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-primary mr-3" /> Steps away from Haram</li>
                <li className="flex items-center"><CheckIcon className="w-6 h-6 text-primary mr-3" /> Private Luxury Transport</li>
              </ul>
              <Link href="/packages">
                <Button className="w-full rounded-full py-6 shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all relative z-10">View Details</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: ShieldCheck, title: "Transparent Process", desc: "No hidden fees. What you see is what you pay." },
              { icon: CreditCard, title: "Secure Payments", desc: "Clear payment stages and secure handling." },
              { icon: HeartHandshake, title: "24/7 Support", desc: "We are with you every step of the way." },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="space-y-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-lg">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <motion.div
          className="relative z-10 container px-4 mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to start your journey?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Let us handle the details so you can focus on what matters most.</p>
          <Link href="/plan-a-trip">
            <Button size="lg" className="text-lg px-12 py-8 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300">
              Start Planning Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
