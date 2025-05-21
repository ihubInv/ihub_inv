"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SuperAdminLayout from "@/components/layout/superadmin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Users, BarChart } from "lucide-react"
import AnimatedChart from "@/components/charts/animated-chart"
import CategoryBreakdown from "@/components/dashboard/category-breakdown"
import { useTheme } from "@/lib/theme-config"
import { mockItems } from "@/lib/data/mock-items"
import EmployeeRequests from "@/components/dashboard/employee-requests"
import { useGetProductsQuery } from "@/lib/store/api/superAdmin/products/productsApi"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"


export default function SuperAdminDashboard() {
  const { data: products } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
console.log("PRODUCTS:>>>>",  products?.total)
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { theme } = useTheme();

  // Build `items` from `products` and match category name and type
  const items = products?.data?.map((asset: any) => {
    const category = categoryList?.data?.find(
      (cat: any) => cat._id === asset.Category._id
    );
    return {
      id: asset._id,
      name: asset.AssetName,
      category: category?.name || "Unknown",
      type: category?.type === "Intangible" ? "Intangible" : "Tangible",
      department: asset.IssuedTo || "Unassigned",
      quantity: asset.Quantity || 0,
      value: asset.RateIncludingTaxes || 0,
      status: asset.Status || "Unknown",
      purchaseDate: asset.PurchaseDate,
      expiryDate: asset.SessionEndDate || undefined,
      location: "", // Optional: update if you have this info
      vendor: asset.VendorName || "Unknown",
    };
  }) || [];

  // Unique category names
  const categories = Array.from(new Set(categoryList?.data?.map((cat: any) => cat.name)));

  // Aggregate data per category
  const categoryData = categories.map((category) => {
    const categoryItems = items.filter((item: { category: unknown }) => item.category === category);
    const tangibleItems = categoryItems.filter((item: { type: string }) => item.type === "Tangible");
    const intangibleItems = categoryItems.filter((item: { type: string }) => item.type === "Intangible");

    return {
      category,
      totalItems: categoryItems.length,
      totalValue: categoryItems.reduce((sum: any, item: { value: any }) => sum + item.value, 0),
      tangibleCount: tangibleItems.length,
      tangibleValue: tangibleItems.reduce((sum: any, item: { value: any }) => sum + item.value, 0),
      intangibleCount: intangibleItems.length,
      intangibleValue: intangibleItems.reduce((sum: any, item: { value: any }) => sum + item.value, 0),
    };
  });

  // Chart values
  const categoriesName = categoryData.map((item) => item.category);
  const totalValues = categoryData.map((item) => item.totalValue);

  console.log("CATEGORIES NAME:>>>>", categoriesName);
  console.log("TOTAL VALUES:>>>>", totalValues);
  console.log("CATEGORY DATA:>>>>", categoryData);

  // Chart dataset example (update based on your chart library)
  function countIssuedTo(data: any) {
    const issuedToList = data?.data?.map((item: any) => item.IssuedTo).filter(Boolean); // filter removes null/undefined
    const uniqueIssuedTo = new Set(issuedToList);
    
    return {
      totalIssuedTo: issuedToList?.length,
      uniqueIssuedToCount: uniqueIssuedTo?.size,
      uniqueIssuedToList: Array?.from(uniqueIssuedTo)
    };
  }
  
  // Example usage with your JSON:
  const jsonData = {
    // Paste your JSON here
  };
  
  const result = countIssuedTo(products);
  console.log("Total IssuedTo:", result.totalIssuedTo);
  console.log("Unique IssuedTo Count:", result.uniqueIssuedToCount);
  console.log("Unique IssuedTo List:", result.uniqueIssuedToList);
  console.log("DATA:>>>>",result?.uniqueIssuedToCount || 0)

  // const dashboardData = {
  //   totalAssets: products?.total || 0,
  //   assetValue: items?.reduce((sum: any, item: { value: any }) => sum + item.value, 0),
  //   allocatedAssets: result?.uniqueIssuedToCount || 0,
  //   categories: categories?.length,
  // };

  // const [data,setData] = useState(dashboardData);



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

  // Monthly asset acquisition data
  const monthlyAssetData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Asset Acquisitions",
        data: [45, 60, 75, 55, 80, 95],
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Asset Value (₹ thousands)",
        data: [150, 180, 210, 165, 220, 245],
        backgroundColor: colors.green,
        borderColor: colors.green,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  }

  // Asset allocation data
  const assetAllocationData = {
    labels: ["IT Department", "Admin", "Finance", "HR", "Operations", "Executive"],
    datasets: [
      {
        label: "Allocated Assets",
        data: [120, 85, 65, 40, 22, 10],
        backgroundColor: [colors.blue, colors.purple, colors.pink, colors.green, colors.yellow, colors.red],
        borderWidth: 1,
      },
    ],
  }

  // // Asset category distribution
  // const assetCategoryData = {
  //   labels: categories,
  //   datasets: [
  //     {
  //       label: "Asset Count",
  //       data: [210, 150, 95, 65, 40, 18],
  //       backgroundColor: colors.blue,
  //       borderColor: colors.blue,
  //       borderWidth: 1,
  //     },
  //   ],
  // }


  const assetCategoryData = {
    labels: categoriesName,
    datasets: [
      {
        label: "Total Asset Value",
        data: totalValues,
        backgroundColor: theme === "dark" ? "#4B9CD3" : "#36A2EB",
        borderColor: theme === "dark" ? "#4B9CD3" : "#36A2EB",
        borderWidth: 1,
      },
    ],
  };
  
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
    <SuperAdminLayout>
      <div className="space-y-6">
        <motion.h1
          className="text-2xl font-bold text-foreground neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Super Admin Dashboard
        </motion.h1>

        <div className="grid gap-4 md:grid-cols-4">
          <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Package className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{products?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Items in inventory</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={1} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asset Value</CardTitle>
                <DollarSign className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹{items?.reduce((sum: any, item: { value: any }) => sum + item.value, 0)}</div>
                <p className="text-xs text-muted-foreground">Total value of assets</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={2} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allocated Assets</CardTitle>
                <Users className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{result?.uniqueIssuedToCount || 0  }</div>
                <p className="text-xs text-muted-foreground">Assets currently allocated</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={3} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <BarChart className="h-4 w-4 text-primary animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{categories?.length} </div>
                <p className="text-xs text-muted-foreground">Asset categories</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedChart title="Monthly Asset Acquisition" type="line" data={monthlyAssetData} />

          <AnimatedChart title="Asset Allocation by Department" type="pie" data={assetAllocationData} />
        </div>

        <motion.div variants={cardVariants} custom={4} initial="hidden" animate="visible">
          <EmployeeRequests />
        </motion.div>

        <motion.div variants={cardVariants} custom={5} initial="hidden" animate="visible">
          <CategoryBreakdown items={mockItems} title="Asset Categories" />
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedChart title="Asset Category Distribution" type="bar" data={assetCategoryData} />

          <motion.div variants={cardVariants} custom={6} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">10 Laptops purchased</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <div className="text-sm font-medium">₹450,000</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Office furniture</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <div className="text-sm font-medium">₹125,000</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Software licenses</p>
                      <p className="text-xs text-muted-foreground">Last week</p>
                    </div>
                    <div className="text-sm font-medium">₹75,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

