type NotificationType = {
    id: string
    message: string
    type: "success" | "error" | "info" | "warning"
    timestamp: Date
  }
  
  type NotifierFn = (notification: Omit<NotificationType, "id" | "timestamp">) => void
  
  let notifier: NotifierFn | null = null
  
  export const setNotifier = (fn: NotifierFn) => {
    notifier = fn
  }
  
  export const notify = (notification: Omit<NotificationType, "id" | "timestamp">) => {
    if (notifier) {
      notifier(notification)
    } else {
      console.warn("Notifier is not initialized")
    }
  }
  