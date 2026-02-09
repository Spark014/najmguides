"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function DiagnosisPage() {
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const runTest = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/trip-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: "Diagnostic User",
                    email: "diagnostic@example.com",
                    phone: "0000000000",
                    packageType: "luxury",
                    travelers: 1,
                    tripLength: 10,
                    makkahDays: 5,
                    madinahDays: 5,
                    departureCountry: "Test Country",
                    departureCity: "Test City",
                    notes: "Running diagnostic test"
                })
            })

            const data = await res.json()
            setResult({
                status: res.status,
                ok: res.ok,
                data: data
            })
        } catch (error: any) {
            setResult({
                error: error.message,
                details: error
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-20">
            <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>

            <Button
                onClick={runTest}
                disabled={loading}
                className="bg-primary text-black hover:bg-white mb-8"
            >
                {loading ? "Running Test..." : "Run Test Request"}
            </Button>

            {result && (
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">Result:</h2>
                    <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
