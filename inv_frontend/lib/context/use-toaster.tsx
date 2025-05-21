"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type NotificationType = {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  timestamp: Date
}


type AppContextType = {
 
  notifications: NotificationType[]
  addNotification: (notification: Omit<NotificationType, "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {

  const [notifications, setNotifications] = useState<NotificationType[]>([])
  

  const addNotification = (notification: Omit<NotificationType, "id" | "timestamp">) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <AppContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useToaster() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useToaster must be used within an AppProvider")
  }
  return context
}







// "use client"

// import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// // Notification type definition
// type NotificationType = {
//   id: string
//   message: string
//   type: "success" | "error" | "info" | "warning"
//   timestamp: Date
//   duration?: number // Optional custom duration per notification
// }

// // Context type
// type AppContextType = {
//   notifications: NotificationType[]
//   addNotification: (
//     notification: Omit<NotificationType, "id" | "timestamp">
//   ) => void
//   removeNotification: (id: string) => void
//   clearNotifications: () => void
// }

// const AppContext = createContext<AppContextType | undefined>(undefined)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [notifications, setNotifications] = useState<NotificationType[]>([])

//   const addNotification = (
//     notification: Omit<NotificationType, "id" | "timestamp">
//   ) => {
//     const newNotification: NotificationType = {
//       ...notification,
//       id: crypto.randomUUID(),
//       timestamp: new Date(),
//     }

//     setNotifications((prev) => [newNotification, ...prev])

//     const duration = notification.duration ?? 5000

//     // Auto-remove notification after duration
//     setTimeout(() => {
//       removeNotification(newNotification.id)
//     }, duration)
//   }

//   const removeNotification = (id: string) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.id !== id)
//     )
//   }

//   const clearNotifications = () => {
//     setNotifications([])
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         notifications,
//         addNotification,
//         removeNotification,
//         clearNotifications,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// // Custom hook for using toaster
// export function useToaster() {
//   const context = useContext(AppContext)
//   if (context === undefined) {
//     throw new Error("useToaster must be used within an AppProvider")
//   }
//   return context
// }
