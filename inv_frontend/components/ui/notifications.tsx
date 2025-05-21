"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useToaster } from "@/lib/context/use-toaster"

export function Notifications() {
  const { notifications, removeNotification } = useToaster()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => {
          // Determine icon based on notification type
          let Icon = Info
          let bgColor = "bg-blue-500/10 border-blue-500/30"
          let textColor = "text-blue-500"

          if (notification.type === "success") {
            Icon = CheckCircle
            bgColor = "bg-green-500/10 border-green-500/30"
            textColor = "text-green-500"
          } else if (notification.type === "error") {
            Icon = AlertCircle
            bgColor = "bg-red-500/10 border-red-500/30"
            textColor = "text-red-500"
          } else if (notification.type === "warning") {
            Icon = AlertTriangle
            bgColor = "bg-yellow-500/10 border-yellow-500/30"
            textColor = "text-yellow-500"
          }

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${bgColor} ${textColor} p-4 rounded-lg border shadow-lg backdrop-blur-md flex items-start gap-3`}
            >
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 rounded-full hover:bg-background/20"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

