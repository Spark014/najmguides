"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterEffectProps {
    text: string
    className?: string
}

export function TypewriterEffect({ text, className }: TypewriterEffectProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 100) // Typing speed
            return () => clearTimeout(timeout)
        }
    }, [currentIndex, text])

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
            />
        </motion.span>
    )
}
