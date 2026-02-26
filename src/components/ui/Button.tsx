"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

// Since I don't have radix-ui installed, I'll implement a simpler version or install it.
// Actually, I'll just implement a standard button without slot for now to save time on dependencies, 
// or I can install class-variance-authority and clsx/tailwind-merge which I already did.
// Wait, I didn't install class-variance-authority. I'll just use clsx and tailwind-merge.



interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "water-capsule-gold text-white font-bold bg-primary/20",
      outline: "water-capsule text-white",
      ghost: "hover:bg-white/10 text-gray-300 rounded-full",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{
          scale: 0.85,
          filter: "brightness(0.7)",
          y: 2
        }}
        whileHover={{
          scale: 1.05,
          filter: "brightness(1.2)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
