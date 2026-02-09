"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export default function AdminLoginPage() {
    const [password, setPassword] = React.useState("")
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple client-side check for prototype
        if (password === "admin123") {
            document.cookie = "admin_auth=true; path=/"
            router.push("/admin")
        } else {
            alert("Invalid password")
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
                        placeholder="Enter password"
                    />
                    <Button fullWidth type="submit">Login</Button>
                </form>
            </div>
        </div>
    )
}
