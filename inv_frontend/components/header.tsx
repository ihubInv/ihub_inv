"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, LogOut, Settings, User, Moon, Sun } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/lib/theme-config"
// import { useToaster } from "@/lib/context/app-context"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSelector } from "react-redux"
import { authenticationSlice } from "@/lib/store/slices/auth.slice"
import store from "@/lib/store"
import { useToaster } from "@/lib/context/use-toaster"
// import { useRouter } from "next/navigation"
export default function Header() {
  const router = useRouter()
  const {  notifications, removeNotification ,addNotification} = useToaster()
  const { theme, toggleTheme } = useTheme()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  
  const user = useSelector(
    (state: any) => state?.authentication?.me?.user
  );
  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.length)
  }, [notifications])

  // const handleLogout = () => {
  //   // logout()
  // }
// const { addNotification } = useToaster()
  // const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    store.dispatch(authenticationSlice.actions.logout());
    router.push("/")
    addNotification({
      message: "Logged out successfully!",
      type: "success",
    })
  };
  // const role = useSelector(
  //   (state: any) => state?.authentication?.me?.user.role
  // );


  const handleSettings = () => {
    // if (user?.role === "admin") {
    //   router.push("/admin/settings")
    // } else {
    //   router.push("/superadmin/settings")
    // }
    if (user.role === "superadmin") {
      router.push("/superadmin/dashboard")
    } else if (user.role === "admin") {
      router.push("/admin/dashboard")
    } else if(user.role === "user") {
      router.push("/user/dashboard")
    }
   
 


  }
  // const notifications:any=[]
  // const removeNotification=()=>{

  // }

  return (
    <motion.header
      className="border-b border-border/50 bg-card/80 backdrop-blur-md px-4 py-3 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-xl font-semibold text-foreground neon-text">iHub HCI Foundation - Inventory Management</h1>
      </div>
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30 shadow-[0_0_5px_rgba(var(--primary-rgb),0.3)]"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>

        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <div className="relative">
              <NeonButton variant="neon" size="icon">
                <Bell className="h-5 w-5" />
              </NeonButton>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-card/90 backdrop-blur-md border-border/50">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications?.map((notification:any) => (
                    <div key={notification.id} className="p-4 flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm">{notification?.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 rounded-full hover:bg-background/20"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <NeonButton variant="neon" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </NeonButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/80 backdrop-blur-md border-border/50">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}

