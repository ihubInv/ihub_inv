"use client"

import { motion } from "framer-motion"
import LoginForm from "@/components/login-form"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/50">
      <div className="w-full max-w-md space-y-8 p-8 bg-card/80 dark:bg-card/30 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
        <div className="text-center">
          <motion.h1
            className="text-3xl font-bold text-foreground neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            iHub HCI Foundation
          </motion.h1>
          <motion.h2
            className="mt-2 text-xl font-semibold text-foreground/80"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Inventory Management System
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Sign in to access your dashboard
          </motion.p>
        </div>
        <LoginForm />
        {/* <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            href="/user/login"
            className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Employee? Request equipment here
          </Link>
        </motion.div> */}

<motion.div
  className="mt-4 text-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.8 }}
  transition={{ delay: 0.7, duration: 0.5 }}
>
  <Link
    href="/superadmin/register"  // <-- Changed here
    className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
  >
    Employee? Request equipment here
  </Link>
</motion.div>



      </div>
    </div>
  )
}

