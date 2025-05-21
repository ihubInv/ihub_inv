"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import AnimatedSidebar from "@/components/sidebar/animated-sidebar"
import Header from "@/components/header"
import { LayoutDashboard, Plus, Settings, FolderPlus, Layers, Users, UserPlus } from "lucide-react"
// import { useToaster } from "@/lib/context/app-context"
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../lib/store/selectors/auth.selector";
// import { authenticationSlice } from "@/lib/store/slices/auth.slice"
const superAdminRoutes = [
  {
    name: "Dashboard",
    path: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add Asset",
    path: "/superadmin/add-asset",
    icon: Plus,
  },
  {
    name: "Manage Categories",
    path: "/superadmin/categories",
    icon: FolderPlus,
  },
  {
    name: "Total Assets",
    path: "/superadmin/assets",
    icon: Layers,
  },
  // {
  //   name: "User Management",
  //   path: "/superadmin/users",
  //   icon: Users,
  // },
  // {
  //   name: "Create Admin",
  //   path: "/superadmin/create-admin",
  //   icon: UserPlus,
  // },
  // {
  //   name: "Settings",
  //   path: "/superadmin/settings",
  //   icon: Settings,
  // },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
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
        role === "superadmin" &&
        (pathname === "/superadmin" || pathname === "/")
      ) {
        router.push("/superadmin/dashboard")
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [isLoggedIn, role, router, pathname])
// }, [])


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
      <AnimatedSidebar routes={superAdminRoutes} title="Super Admin" />
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

