"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin-layout"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, Filter, Edit, Trash2, FileDown, Printer, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { useToaster } from "@/lib/context/app-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const products = [
  {
    id: "P001",
    name: "Dell Laptop",
    make: "Dell",
    model: "Latitude 5420",
    serial: "DL5420-001",
    quantity: 10,
    issuedTo: "IT Department",
  },
  {
    id: "P002",
    name: "HP Monitor",
    make: "HP",
    model: "24f",
    serial: "HP24F-002",
    quantity: 15,
    issuedTo: "Admin Department",
  },
  {
    id: "P003",
    name: "Logitech Keyboard",
    make: "Logitech",
    model: "K380",
    serial: "LGK380-003",
    quantity: 20,
    issuedTo: "Finance Department",
  },
  {
    id: "P004",
    name: "Apple iPad",
    make: "Apple",
    model: "iPad Pro 11",
    serial: "AIPP11-004",
    quantity: 5,
    issuedTo: "Executive Team",
  },
  {
    id: "P005",
    name: "Samsung Printer",
    make: "Samsung",
    model: "SL-M2020W",
    serial: "SSM2020W-005",
    quantity: 3,
    issuedTo: "HR Department",
  },
]

export default function Products() {
  // const { addNotification } = useToaster()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    make: "",
    issuedTo: "",
    minQuantity: "",
  })
  const tableRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    applyFilters(term, filters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(searchTerm, newFilters)
  }

  const applyFilters = (term: string, currentFilters: typeof filters) => {
    let filtered = [...products]

    // Apply search term
    if (term) {
      filtered = filtered.filter(
        (product) =>
          product.id.toLowerCase().includes(term) ||
          product.name.toLowerCase().includes(term) ||
          product.make.toLowerCase().includes(term) ||
          product.model.toLowerCase().includes(term) ||
          product.serial.toLowerCase().includes(term) ||
          product.issuedTo.toLowerCase().includes(term),
      )
    }

    // Apply make filter
    if (currentFilters.make) {
      filtered = filtered.filter((product) => product.make.toLowerCase() === currentFilters.make.toLowerCase())
    }

    // Apply issuedTo filter
    if (currentFilters.issuedTo) {
      filtered = filtered.filter((product) => product.issuedTo.toLowerCase() === currentFilters.issuedTo.toLowerCase())
    }

    // Apply minQuantity filter
    if (currentFilters.minQuantity) {
      const minQty = Number.parseInt(currentFilters.minQuantity)
      filtered = filtered.filter((product) => product.quantity >= minQty)
    }

    setFilteredProducts(filtered)
  }

  const resetFilters = () => {
    setFilters({
      make: "",
      issuedTo: "",
      minQuantity: "",
    })
    applyFilters(searchTerm, {
      make: "",
      issuedTo: "",
      minQuantity: "",
    })
    setIsFilterDialogOpen(false)
  }

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    // In a real app, you would call an API to delete the product
    console.log(`Deleting product ${productToDelete}`)

    // Filter out the deleted product
    const updatedProducts = filteredProducts.filter((product) => product.id !== productToDelete)
    setFilteredProducts(updatedProducts)

    // addNotification({
    //   message: "Product deleted successfully",
    //   type: "success",
    // })

    setIsDeleteDialogOpen(false)
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["ID", "Name",  "Model", "Serial", "Quantity", "Issued To"]
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [
          product.id,
          `"${product.name}"`,
          // `"${product.make}"`,
          `"${product.model}"`,
          `"${product.serial}"`,
          product.quantity,
          `"${product.issuedTo}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "products.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // addNotification({
    //   message: "Products exported to CSV",
    //   type: "success",
    // })
  }

  const printTable = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const tableHTML = tableRef.current?.innerHTML || ""

    printWindow.document.write(`
      <html>
        <head>
          <title>Products Table</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Products Inventory</h1>
          <table>${tableHTML}</table>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()

    // addNotification({
    //   message: "Print job sent",
    //   type: "info",
    // })
  }

  const exportToPDF = () => {
    // In a real app, you would use a library like jsPDF
    // addNotification({
    //   message: "PDF export functionality would be implemented with jsPDF",
    //   type: "info",
    // })
  }

  // Get unique makes and departments for filters
  const uniqueMakes = [...new Set(products.map((product) => product.make))]
  const uniqueDepartments = [...new Set(products.map((product) => product.issuedTo))]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <motion.h1
            className="text-2xl font-bold text-foreground neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Total Products
          </motion.h1>
          <motion.div
            className="mt-4 flex space-x-2 sm:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NeonButton variant="neon" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </NeonButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <NeonButton variant="neon" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </NeonButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card/80 backdrop-blur-md border-border/50">
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Export to CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export to PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printTable} className="cursor-pointer">
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Product Inventory</CardTitle>
                <div className="mt-4 sm:mt-0 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full sm:w-[300px] bg-background/50 border-border/50 focus:border-primary input-neon"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50" ref={tableRef}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      {/* <TableHead className="hidden md:table-cell">Make</TableHead> */}
                      <TableHead className="hidden md:table-cell">Model</TableHead>
                      <TableHead className="hidden lg:table-cell">Serial</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Issued To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="font-medium">{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{product.make}</TableCell>
                          <TableCell className="hidden md:table-cell">{product.model}</TableCell>
                          <TableCell className="hidden lg:table-cell">{product.serial}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.issuedTo}</TableCell>
                          <TableCell className="text-right">
                            <NeonButton variant="neonGreen" size="sm" className="mr-2">
                              <Edit className="h-4 w-4" />
                            </NeonButton>
                            <NeonButton variant="neonPurple" size="sm" onClick={() => openDeleteDialog(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </NeonButton>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <NeonButton variant="neonPurple" onClick={handleDelete}>
              Delete
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>Apply filters to narrow down the product list.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* <div className="space-y-2">
              <Label htmlFor="make-filter">Make</Label>
              <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
                <SelectTrigger id="make-filter" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  <SelectItem value="all">All Makes</SelectItem>
                  {uniqueMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="department-filter">Department</Label>
              <Select value={filters.issuedTo} onValueChange={(value) => handleFilterChange("issuedTo", value)}>
                <SelectTrigger id="department-filter" className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-quantity">Minimum Quantity</Label>
              <Input
                id="min-quantity"
                type="number"
                min="0"
                value={filters.minQuantity}
                onChange={(e) => handleFilterChange("minQuantity", e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary input-neon"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <NeonButton variant="neon" onClick={() => setIsFilterDialogOpen(false)}>
              Apply Filters
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

