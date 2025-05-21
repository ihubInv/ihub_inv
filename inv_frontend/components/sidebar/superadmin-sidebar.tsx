"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Plus, Settings, Menu, X, FolderPlus, Layers, LogOut, UserPlus } from "lucide-react"
import store from "@/lib/store"
import { authenticationSlice } from "@/lib/store/slices/auth.slice"
import { useToaster } from "@/lib/context/use-toaster"
// import { useToaster } from "@/lib/context/app-context"

export default function SuperAdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  // const { logout } = useToaster()
  const { addNotification} = useToaster()

  const router = useRouter()

  const handleLogout = () => {
    debugger
    window.localStorage.removeItem("token");
    store.dispatch(authenticationSlice.actions.logout());
    router.push("/")
    addNotification({
      message: "Logged out successfully!",
      type: "success",
    })
  };

  const routes = [
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
    {
      name: "Settings",
      path: "/superadmin/settings",
      icon: Settings,
    },
    {
      name: "Create Admin",
      path: "/superadmin/create-admin",
      icon: UserPlus,
    },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-3 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <h2 className="text-xl font-bold text-gray-800">Super Admin Panel</h2>
        </div>
        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={cn(
                    "flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100",
                    pathname === route.path && "bg-gray-100 font-medium text-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon className="mr-3 h-5 w-5" />
                  {route.name}
                </Link>
              </li>
            ))}
            <li className="mt-auto pt-4 border-t border-border/50">
              <button
                className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                 onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout 
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

