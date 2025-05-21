"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle } from "lucide-react"
import AnimatedChart from "@/components/charts/animated-chart"
import CategoryBreakdown from "@/components/dashboard/category-breakdown"
import { useTheme } from "@/lib/theme-config"
import { mockItems } from "@/lib/data/mock-items"

// Mock data
const dashboardData = {
  totalStock: 245,
  issuedItems: 128,
  pendingRequests: 12,
}

export default function AdminDashboard() {
  const [data, setData] = useState(dashboardData)
  const { theme } = useTheme()

  // Chart colors based on theme
  const getChartColors = () => {
    return {
      blue: theme === "dark" ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.7)",
      purple: theme === "dark" ? "rgba(139, 92, 246, 0.8)" : "rgba(139, 92, 246, 0.7)",
      pink: theme === "dark" ? "rgba(236, 72, 153, 0.8)" : "rgba(236, 72, 153, 0.7)",
      green: theme === "dark" ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.7)",
      yellow: theme === "dark" ? "rgba(245, 158, 11, 0.8)" : "rgba(245, 158, 11, 0.7)",
      red: theme === "dark" ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.7)",
    }
  }

  const colors = getChartColors()

  // Monthly inventory data
  const monthlyInventoryData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Stock Levels",
        data: [180, 200, 210, 190, 220, 245],
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  }

  // Item categories data
  const itemCategoriesData = {
    labels: ["Electronics", "Furniture", "Office Supplies", "IT Equipment", "Stationery"],
    datasets: [
      {
        label: "Item Count",
        data: [85, 60, 45, 35, 20],
        backgroundColor: [colors.blue, colors.purple, colors.pink, colors.green, colors.yellow],
        borderWidth: 1,
      },
    ],
  }

  // Item status data
  const itemStatusData = {
    labels: ["Available", "Issued", "Under Maintenance", "Expired"],
    datasets: [
      {
        label: "Items",
        data: [117, 128, 15, 5],
        backgroundColor: [colors.green, colors.blue, colors.yellow, colors.red],
        borderWidth: 1,
      },
    ],
  }

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.h1
          className="text-2xl font-bold text-foreground neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                <Package className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.totalStock}</div>
                <p className="text-xs text-muted-foreground">Items in inventory</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={1} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issued Items</CardTitle>
                <ShoppingCart className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.issuedItems}</div>
                <p className="text-xs text-muted-foreground">Items currently issued</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={2} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{data.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Requests awaiting approval</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedChart title="Monthly Inventory Levels" type="line" data={monthlyInventoryData} />

          <AnimatedChart title="Item Categories" type="bar" data={itemCategoriesData} />
        </div>

        <motion.div variants={cardVariants} custom={3} initial="hidden" animate="visible">
          <CategoryBreakdown items={mockItems} title="Inventory Categories" />
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedChart title="Item Status" type="doughnut" data={itemStatusData} height={250} />

          <motion.div variants={cardVariants} custom={4} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">Laptop issued to John Doe</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">New monitor added to inventory</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">5 keyboards returned from IT department</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}

