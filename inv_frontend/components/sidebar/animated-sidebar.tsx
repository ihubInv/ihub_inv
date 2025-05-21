"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/lib/theme-config"
import { LogOut } from "lucide-react"
import store from "@/lib/store"
import { authenticationSlice } from "@/lib/store/slices/auth.slice"
// import { useToaster } from "@/lib/context/app-context"

type SidebarProps = {
  routes: {
    name: string
    path: string
    icon: React.ElementType
  }[]
  title: string
}

export default function AnimatedSidebar({ routes, title }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()
  // const { logout } = useToaster()

  useEffect(() => {
    // Check if the sidebar state is stored in localStorage
    const storedState = localStorage.getItem("sidebar-collapsed")
    if (storedState) {
      setIsCollapsed(storedState === "true")
    }

    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: {
      width: "250px",
      transition: { duration: 0.3 },
    },
    collapsed: {
      width: "70px",
      transition: { duration: 0.3 },
    },
  }

  // Mobile sidebar animation variants
  const mobileSidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  // Button animation variants
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  // Add logout route to the routes array
  const allRoutes = [
    ...routes,
    {
      name: "Logout",
      path: "/",
      icon: LogOut,
    },
  ]

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    store.dispatch(authenticationSlice.actions.logout());
    router.push("/")
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary/20 text-primary border border-primary/30 shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]"
          onClick={toggleMobileSidebar}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileSidebar}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar for mobile */}
      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-md border-r border-border/50 shadow-lg"
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground neon-text">{title}</h2>
                <button onClick={toggleMobileSidebar} className="p-1 rounded-full hover:bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="mt-5 px-2">
                <ul className="space-y-2">
                  {allRoutes.map((route) => (
                    <li key={route.path}>
                      {route.path === "/" ? (
                        <button
                          className="flex w-full items-center rounded-md px-4 py-2 text-foreground transition-all hover:bg-primary/10"
                          onClick={() => {
                            toggleMobileSidebar()
                            handleLogout()
                          }}
                        >
                          <route.icon className="mr-3 h-5 w-5" />
                          <span>{route.name}</span>
                        </button>
                      ) : (
                        <Link
                          href={route.path}
                          className={cn(
                            "flex items-center rounded-md px-4 py-2 text-foreground transition-all hover:bg-primary/10",
                            pathname === route.path &&
                              "bg-primary/20 text-primary shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]",
                          )}
                          onClick={toggleMobileSidebar}
                        >
                          <route.icon className="mr-3 h-5 w-5" />
                          <span>{route.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
      ) : (
        // Desktop sidebar
        <motion.aside
          className="h-screen sticky top-0 border-r border-border/50 bg-card/80 backdrop-blur-md shadow-lg z-10"
          variants={sidebarVariants}
          initial={isCollapsed ? "collapsed" : "expanded"}
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h2
                  className="text-xl font-bold text-foreground neon-text overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {title}
                </motion.h2>
              )}
            </AnimatePresence>
            <motion.button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-primary/10"
              whileHover={{ rotate: isCollapsed ? -180 : 0 }}
              animate={{ rotate: isCollapsed ? 180 : 0 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </motion.button>
          </div>
          <TooltipProvider delayDuration={300}>
            <nav className="mt-5 px-2">
              <ul className="space-y-2">
                {allRoutes.map((route) => (
                  <li key={route.path}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {route.path === "/" ? (
                            <button
                              className={cn(
                                "flex w-full items-center justify-center rounded-md p-2 text-foreground transition-all hover:bg-primary/10",
                              )}
                              onClick={handleLogout}
                            >
                              <route.icon className="h-5 w-5" />
                            </button>
                          ) : (
                            <Link
                              href={route.path}
                              className={cn(
                                "flex items-center justify-center rounded-md p-2 text-foreground transition-all hover:bg-primary/10",
                                pathname === route.path &&
                                  "bg-primary/20 text-primary shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]",
                              )}
                            >
                              <route.icon className="h-5 w-5" />
                            </Link>
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{route.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : route.path === "/" ? (
                      <button
                        className="flex w-full items-center rounded-md px-4 py-2 text-foreground transition-all hover:bg-primary/10"
                        onClick={handleLogout}
                      >
                        <route.icon className="mr-3 h-5 w-5" />
                        <span>{route.name}</span>
                      </button>
                    ) : (
                      <Link
                        href={route.path}
                        className={cn(
                          "flex items-center rounded-md px-4 py-2 text-foreground transition-all hover:bg-primary/10",
                          pathname === route.path &&
                            "bg-primary/20 text-primary shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]",
                        )}
                      >
                        <route.icon className="mr-3 h-5 w-5" />
                        <span>{route.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto pt-4 border-t border-border/50 px-2"></div>
          </TooltipProvider>
        </motion.aside>
      )}
    </>
  )
}

