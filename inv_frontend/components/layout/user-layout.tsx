"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "@/lib/theme-config"
// import { useToaster } from "@/lib/context/app-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, User, FileText, LogOut, PlusCircle, Moon, Sun, Menu, X } from "lucide-react"
import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "@/lib/store/selectors/auth.selector"
import store from "@/lib/store"
import { authenticationSlice } from "@/lib/store/slices/auth.slice"

export default function UserLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter()
//   // const { user, isAuthenticated, logout } = useToaster()
//   const { theme, toggleTheme } = useTheme()
//   // const [isLoading, setIsLoading] = useState(true)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const isLoading=true
//   useEffect(() => {
//     const checkAuth = async () => {
//       // Small delay to ensure authentication state is loaded
//       await new Promise((resolve) => setTimeout(resolve, 100))
//   const isAuthenticated=true
//       // Check if user is logged in
//       if (!isAuthenticated) {
//         router.push("/user/login")
//         return
//       }

//       setIsLoading(false)
//     }

//     checkAuth()
//   // }, [isAuthenticated, router])
// },[])


// const { user, isAuthenticated, logout } = useToaster()


const { theme, toggleTheme } = useTheme()
// const [isLoading, setIsLoading] = useState(true)
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

// useEffect(() => {
//   const checkAuth = async () => {
//     // Small delay to ensure authentication state is loaded
//     await new Promise((resolve) => setTimeout(resolve, 100))
//     // Check if user is logged in
//     if (!isAuthenticated) {
//       router.push("/user/login")
//       return
//     }

//     setIsLoading(false)
//   }

//   checkAuth()
// // }, [isAuthenticated, router])
// },[])





const router = useRouter()
  const pathname = usePathname();
  // const { user, isAuthenticated, addNotification } = useToaster()
  const [isLoading, setIsLoading] = useState(true)

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(
    (state: any) => state?.authentication?.me
  );

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!isLoggedIn) {
        router.push("/")
        return
      }
      // Only redirect to dashboard if on /superadmin or /
      if (
        user.role === "user" &&
        (pathname === "/user" || pathname === "/")
      ) {
        router.push("/user/dashboard")
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [isLoggedIn, user, router, pathname])

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    store.dispatch(authenticationSlice.actions.logout());
    router.push("/")
  };


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 relative">
          <div className="h-full w-full border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-primary/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/user/dashboard" className="text-xl font-semibold text-foreground neon-text">
            iHub Employee Portal
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full bg-primary/10 text-primary border border-primary/30"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.button
            className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30 shadow-[0_0_5px_rgba(var(--primary-rgb),0.3)]"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/80 backdrop-blur-md border-border/50">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <span className="text-xs text-muted-foreground">{user?.department}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/user/dashboard")} className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/requests")} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>My Requests</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/new-request")} className="cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Request</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-card/90 backdrop-blur-md border-b border-border/50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              href="/user/dashboard"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/user/profile"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            <Link
              href="/user/requests"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText size={18} />
              <span>My Requests</span>
            </Link>
            <Link
              href="/user/new-request"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>New Request</span>
            </Link>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <button
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <button
                className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </nav>
        </motion.div>
      )}

      {/* Main content */}
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  )
}

