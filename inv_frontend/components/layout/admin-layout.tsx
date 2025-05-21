"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import AnimatedSidebar from "@/components/sidebar/animated-sidebar"
import Header from "@/components/header"
import { LayoutDashboard, Package, Plus, Settings } from "lucide-react"
import { selectIsLoggedIn } from "@/lib/store/selectors/auth.selector"
import { useSelector } from "react-redux"
// import { useToaster } from "@/lib/context/app-context"

const adminRoutes = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add Product",
    path: "/admin/add-product",
    icon: Plus,
  },
  {
    name: "Total Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // const router = useRouter()
  // // const { user, isAuthenticated, addNotification } = useToaster()
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     // Small delay to ensure authentication state is loaded
  //     await new Promise((resolve) => setTimeout(resolve, 100))
  //   const isAuthenticated=true
  //     // Check if user is logged in and has admin role
  //     if (!isAuthenticated) {
  //       // addNotification({
  //       //   message: "Please log in to access this page",
  //       //   type: "warning",
  //       // })
  //       router.push("/")
  //       return
  //     }

  //     if (user?.role !== "admin") {
  //       // addNotification({
  //       //   message: "You don't have permission to access this page",
  //       //   type: "error",
  //       // })
  //       router.push("/")
  //       return
  //     }

  //     setIsLoading(false)
  //   }

  //   checkAuth()
  // // }, [isAuthenticated, user, router, addNotification])
  //  },[])


  const router = useRouter()
  const pathname = usePathname();
  // const { user, isAuthenticated, addNotification } = useToaster()
  const [isLoading, setIsLoading] = useState(true)

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(
    (state: any) => state?.authentication?.me?.role
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
        role === "admin" &&
        (pathname === "/admin" || pathname === "/")
      ) {
        router.push("/admin/dashboard")
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [isLoggedIn, role, router, pathname])


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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AnimatedSidebar routes={adminRoutes} title="Admin Panel" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <motion.main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

