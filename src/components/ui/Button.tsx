import * as React from "react"
import { cn } from "@/lib/utils"

// Since I don't have radix-ui installed, I'll implement a simpler version or install it.
// Actually, I'll just implement a standard button without slot for now to save time on dependencies, 
// or I can install class-variance-authority and clsx/tailwind-merge which I already did.
// Wait, I didn't install class-variance-authority. I'll just use clsx and tailwind-merge.



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-gold-light shadow-md hover:shadow-lg hover:shadow-primary/20",
      outline: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      ghost: "hover:bg-muted hover:text-white",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
    }

    return (
      <button
        ref={ref}
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
