"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, BarChart } from "lucide-react"
import PivotTable from "@/components/tables/pivot-table"
import { useGetCategoryQuery } from "@/lib/store/api/superAdmin/category/categoryApi"
import { useGetProductsQuery } from "@/lib/store/api/superAdmin/products/productsApi"

// Types for our items
type ItemType = {
  id: string
  name: string
  category: string
  type: "Tangible" | "Intangible"
  department: string
  quantity: number
  value: number
  status: string
  purchaseDate: string
  expiryDate?: string
  location?: string
  vendor: string
}

type CategoryBreakdownProps = {
  items: ItemType[]
  title?: string
}

export default function CategoryBreakdown({  title = "Category Breakdown" }: CategoryBreakdownProps) {

  const { data: categoryList} = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


const { data: products } = useGetProductsQuery(undefined, {
  refetchOnMountOrArgChange: true,
});

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showPivot, setShowPivot] = useState(false)
  const [selectedType, setSelectedType] = useState<"Tangible" | "Intangible" | null>(null)

  // Get unique categories
//   const categories = [...new Set(categoryList?.data.map((item) => item.name))]
// console.log("CATEGORIES ????:>>>>", categories)
const cat=categoryList?.data?.map((cat:any) => cat.name)
// console.log("CAT:>>>>", cat)
const items: ItemType[] = products?.data.map((asset:any) => {
  debugger

  const category = categoryList?.data?.find((cat:any) => cat._id === asset.Category._id)
// console.log("CATEGORYgggggg:>>>>", category)
  return {
    id: asset._id,
    name: asset.AssetName,
    category: category?.name || "Unknown",
    type: category?.type === "Intangible" ? "Intangible" : "Tangible",
    department: asset.IssuedTo || "Unassigned", // Modify if needed
    quantity: asset.Quantity || 0,
    value: asset.RateIncludingTaxes || 0,
    status: asset.Status || "unknown",
    purchaseDate: asset.PurchaseDate,
    expiryDate: asset.SessionEndDate || undefined,
    location: "", // Set if you have a location field
    vendor: asset.VendorName || "Unknown",
  }
})
// console.log("ITEMS:>>>>", items)

// const categories = [...new Set(items?.map((item) => item.category))]
// console.log("CATEGORIES:>>>>", categories)
const categories=categoryList?.data?.map((cat:any) => cat.name)
// console.log("CAT:>>>>", cat)


  // Calculate totals by category and type
  const categoryData = categories?.map((category) => {
    debugger
    const categoryItems = items?.filter((item) => item.category === category)
    const tangibleItems = categoryItems?.filter((item) => item.type === "Tangible")
    const intangibleItems = categoryItems?.filter((item) => item.type === "Intangible")
    return {
      category,
      totalItems: categoryItems?.length,
      totalValue: categoryItems?.reduce((sum, item) => sum + item.value, 0),
      tangibleCount: tangibleItems?.length,
      tangibleValue: tangibleItems?.reduce((sum, item) => sum + item.value, 0),
      intangibleCount: intangibleItems?.length,
      intangibleValue: intangibleItems?.reduce((sum, item) => sum + item.value, 0),
    }
  })

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
      setSelectedType(null)
    } else {
      setExpandedCategory(category)
      setSelectedType(null)
    }
  }

  const handleTypeSelect = (type: "Tangible" | "Intangible") => {
    setSelectedType(type)
  }

  const togglePivot = () => {
    setShowPivot(!showPivot)
  }

  // Fields for pivot table
  const pivotFields = {
    category: "Category",
    type: "Type",
    department: "Department",
    status: "Status",
    vendor: "Vendor",
    quantity: "Quantity",
    value: "Value",
  }
// console.log("ITEMS:>>>>", categoryData)


function formatDate(dateString:any) {
  if (!dateString) {
    return "Invalid Date"; // Return an error message if the date is empty or undefined
  }
  
  const date = new Date(dateString);
  
  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Return an error message if the date is invalid
  }

  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad if needed
  const year = date.getFullYear(); // Get the year
  
  return `${day}-${month}-${year}`;
}



  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <motion.button
            className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30 shadow-[0_0_5px_rgba(var(--primary-rgb),0.3)]"
            onClick={togglePivot}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <BarChart className="h-5 w-5" />
          </motion.button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Tangible</TableHead>
                  <TableHead className="text-right">Intangible</TableHead>
                  <TableHead className="text-right">Total Items</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData?.map((data) => (
                  <React.Fragment key={data.category}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => toggleCategory(data.category)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {expandedCategory === data.category ? (
                            <ChevronUp className="mr-2 h-4 w-4" />
                          ) : (
                            <ChevronDown className="mr-2 h-4 w-4" />
                          )}
                          {data?.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{data?.tangibleCount}</TableCell>
                      <TableCell className="text-right">{data?.intangibleCount}</TableCell>
                      <TableCell className="text-right">{data?.totalItems}</TableCell>
                      <TableCell className="text-right">₹{data?.totalValue?.toLocaleString()}</TableCell>
                    </TableRow>

                    {expandedCategory === data.category && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-muted/10">
                            <Tabs defaultValue="tangible" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
                                <TabsTrigger value="tangible" onClick={() => handleTypeSelect("Tangible")}>
                                  Tangible ({data.tangibleCount})
                                </TabsTrigger>
                                <TabsTrigger value="intangible" onClick={() => handleTypeSelect("Intangible")}>
                                  Intangible ({data.intangibleCount})
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="tangible">
                                <div className="rounded-md border border-border/50">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted/30">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                        <TableHead>Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {items
                                        .filter((item) => item.category === data.category && item.type === "Tangible")
                                        .map((item) => (
                                          <TableRow key={item.id} className="hover:bg-muted/20">
                                            <TableCell>{item?.name}</TableCell>
                                            <TableCell>{item?.department}</TableCell>
                                            <TableCell className="text-right">{item?.quantity}</TableCell>
                                            <TableCell className="text-right">₹{item?.value?.toLocaleString()}</TableCell>
                                            <TableCell>
                                              <Badge
                                                className={
                                                  item.status === "Active"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                    : item.status === "Maintenance"
                                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                }
                                              >
                                                {item.status}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>

                              <TabsContent value="intangible">
                                <div className="rounded-md border border-border/50">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted/30">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead>Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {items
                                        .filter((item) => item.category === data.category && item.type === "Intangible")
                                        .map((item) => (
                                          <TableRow key={item.id} className="hover:bg-muted/20">
                                            <TableCell>{item?.name}</TableCell>
                                            <TableCell>{item?.department}</TableCell>
                                            <TableCell>{item?.vendor}</TableCell>
                                            <TableCell className="text-right">₹{item?.value?.toLocaleString()}</TableCell>
                                            <TableCell>{formatDate(item?.expiryDate) || "N/A"}</TableCell>
                                            <TableCell>
                                              <Badge
                                                className={
                                                  item.status === "Active"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                    : item.status === "Maintenance"
                                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                }
                                              >
                                                {item.status}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showPivot && (
          <PivotTable
            data={items}
            title="Inventory"
            initialRows="category"
            initialColumns="type"
            initialValues="value"
            fields={pivotFields}
            onClose={togglePivot}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

