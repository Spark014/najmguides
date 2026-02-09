'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Unable to load trips</h2>
                <p className="text-gray-400 mb-6">
                    {error.message || "We couldn't load the upcoming trips. Please try again later."}
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => reset()} variant="outline">
                        Try again
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                </div>
            </div>
        </div>
    )
}
