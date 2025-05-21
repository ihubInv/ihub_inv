"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(var(--neon-blue-rgb),0.5)] hover:shadow-[0_0_15px_rgba(var(--neon-blue-rgb),0.8)] hover:bg-primary/20 dark:text-primary dark:hover:text-primary-foreground",
        neonPurple:
          "bg-[hsl(var(--neon-purple))]/10 text-[hsl(var(--neon-purple))] border border-[hsl(var(--neon-purple))]/30 shadow-[0_0_10px_rgba(var(--neon-purple-rgb),0.5)] hover:shadow-[0_0_15px_rgba(var(--neon-purple-rgb),0.8)] hover:bg-[hsl(var(--neon-purple))]/20 dark:text-[hsl(var(--neon-purple))] dark:hover:text-white",
        neonGreen:
          "bg-[hsl(var(--neon-green))]/10 text-[hsl(var(--neon-green))] border border-[hsl(var(--neon-green))]/30 shadow-[0_0_10px_rgba(var(--neon-green-rgb),0.5)] hover:shadow-[0_0_15px_rgba(var(--neon-green-rgb),0.8)] hover:bg-[hsl(var(--neon-green))]/20 dark:text-[hsl(var(--neon-green))] dark:hover:text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    )
  },
)
NeonButton.displayName = "NeonButton"

export { NeonButton, buttonVariants }

