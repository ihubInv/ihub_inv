"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin-layout"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useToaster } from "@/lib/context/app-context"

export default function AddProduct() {
  // const { addNotification } = useToaster()
  const [formData, setFormData] = useState({
    uniqueId: "",
    itemName: "",
    make: "",
    modelNumber: "",
    serialNumber: "",
    quantity: "",
    issuedTo: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateField = (name: string, value: string) => {
    let fieldError = ""

    switch (name) {
      case "uniqueId":
        if (!value) fieldError = "Unique ID is required"
        else if (!/^[A-Za-z0-9-]+$/.test(value)) fieldError = "Unique ID can only contain letters, numbers, and hyphens"
        break
      case "itemName":
        if (!value) fieldError = "Item name is required"
        break
      case "quantity":
        if (!value) fieldError = "Quantity is required"
        if (value && !/^\d+$/.test(value)) fieldError = "Quantity must be a number"
        if (value && Number.parseInt(value) <= 0) fieldError = "Quantity must be greater than 0"
        break
      default:
        break
    }

    return fieldError
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate on change
    const fieldError = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    Object.entries(formData).forEach(([name, value]) => {
      const fieldError = validateField(name, value.toString())
      if (fieldError) {
        newErrors[name] = fieldError
        hasErrors = true
      }
    })

    setErrors(newErrors)

    if (hasErrors) {
      setError("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)
    setSuccess(false)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send the data to your API here
      console.log("Product data:", formData)

      // Reset form
      setFormData({
        uniqueId: "",
        itemName: "",
        make: "",
        modelNumber: "",
        serialNumber: "",
        quantity: "",
        issuedTo: "",
      })

      setSuccess(true)
      // addNotification({
      //   message: "Product added successfully!",
      //   type: "success",
      // })
    } catch (err) {
      setError("Failed to add product. Please try again.")
      // addNotification({
      //   message: "Failed to add product",
      //   type: "error",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          Add New Product
        </motion.h1>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert className="bg-green-500/10 border-green-500/30 dark:bg-green-500/20 dark:border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Success</AlertTitle>
              <AlertDescription className="text-green-500/90">Product has been added successfully.</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/30 dark:bg-red-500/20 dark:border-red-500/30"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="uniqueId">Unique ID</Label>
                  <Input
                    id="uniqueId"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleChange}
                    required
                    className={`bg-background/50 border-border/50 focus:border-primary input-neon ${
                      errors.uniqueId ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.uniqueId && <p className="text-xs text-red-500 mt-1">{errors.uniqueId}</p>}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className={`bg-background/50 border-border/50 focus:border-primary input-neon ${
                      errors.itemName ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.itemName && <p className="text-xs text-red-500 mt-1">{errors.itemName}</p>}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="modelNumber">Model Number</Label>
                  <Input
                    id="modelNumber"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className={`bg-background/50 border-border/50 focus:border-primary input-neon ${
                      errors.quantity ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="issuedTo">Issued To</Label>
                  <Input
                    id="issuedTo"
                    name="issuedTo"
                    value={formData.issuedTo}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <NeonButton type="submit" className="mt-4" disabled={isSubmitting} variant="neon">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </NeonButton>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

