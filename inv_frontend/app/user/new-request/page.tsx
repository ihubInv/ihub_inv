"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import UserLayout from "@/components/layout/user-layout"
import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NeonButton } from "@/components/ui/neon-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useCreateRequestMutation, useGetRequestsQuery } from "@/lib/store/api/users/requestApi"

// Item types and categories
const itemTypes = [
  { value: "Hardware", label: "Hardware" },
  { value: "Software", label: "Software" },
  { value: "Peripherals", label: "Peripherals" },
  { value: "Furniture", label: "Furniture" },
  { value: "Other", label: "Other" },
]

const itemCategories = {
  Hardware: [
    { value: "Laptop", label: "Laptop" },
    { value: "Desktop", label: "Desktop" },
    { value: "Monitor", label: "Monitor" },
    { value: "Server", label: "Server" },
    { value: "Tablet", label: "Tablet" },
    { value: "Other", label: "Other Hardware" },
  ],
  Software: [
    { value: "Operating System", label: "Operating System" },
    { value: "Office Suite", label: "Office Suite" },
    { value: "Design Software", label: "Design Software" },
    { value: "Development Tools", label: "Development Tools" },
    { value: "Security Software", label: "Security Software" },
    { value: "Other", label: "Other Software" },
  ],
  Peripherals: [
    { value: "Keyboard", label: "Keyboard" },
    { value: "Mouse", label: "Mouse" },
    { value: "Headset", label: "Headset" },
    { value: "Webcam", label: "Webcam" },
    { value: "Printer", label: "Printer" },
    { value: "Other", label: "Other Peripherals" },
  ],
  Furniture: [
    { value: "Chair", label: "Chair" },
    { value: "Desk", label: "Desk" },
    { value: "Cabinet", label: "Cabinet" },
    { value: "Whiteboard", label: "Whiteboard" },
    { value: "Other", label: "Other Furniture" },
  ],
  Other: [
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Books", label: "Books" },
    { value: "Training Materials", label: "Training Materials" },
    { value: "Other", label: "Other Items" },
  ],
}

export default function NewRequestPage() {
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation()
  const { data: user, isLoading } = useGetRequestsQuery()
  console.log(user)
  const router = useRouter()
  // const { user, addRequest, isLoading } = useUser()

  const [formData, setFormData] = useState({
    itemType: "",
    itemName: "",
    customItemName: "",
    reason: "",
    urgency: "medium",
    additionalInfo: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.itemType) {
      setError("Please select an item type")
      return
    }

    if (!formData.itemName && !formData.customItemName) {
      setError("Please select or enter an item name")
      return
    }

    if (!formData.reason) {
      setError("Please provide a reason for your request")
      return
    }

    // Prepare request data
    const requestData:any = {
      itemType: formData.itemType,
      itemName: formData.itemName === "Other" ? formData.customItemName : formData.itemName,
      reason: formData.reason,
      urgency: formData.urgency as "low" | "medium" | "high",
      additionalInfo: formData.additionalInfo,
    }

    // Submit request
    const result:any = await createRequest(requestData)

    if (result.success) {
      setSuccess(true)

      // Reset form
      setFormData({
        itemType: "",
        itemName: "",
        customItemName: "",
        reason: "",
        urgency: "medium",
        additionalInfo: "",
      })

      // Redirect after a short delay
      router.push("/user/requests")
      setTimeout(() => {
       
      }, 2000)
    } else {
      setError(result.message || "Failed to submit request")
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
    <UserLayout>
        <div className="flex items-center gap-2">
          <NeonButton variant="outline" size="sm" onClick={() => router.push("/user/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </NeonButton>
        </div>
      <div className="max-w-2xl mx-auto">
        <motion.h1
          className="text-2xl font-bold text-foreground neon-text mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          New Equipment Request
        </motion.h1>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-green-500/10 border-green-500/30 dark:bg-green-500/20 dark:border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-green-500 mb-2">Request Submitted Successfully!</h2>
                  <p className="text-green-500/90 mb-6">
                    Your request has been submitted and is pending approval. You will be redirected to your requests
                    page.
                  </p>
                  <NeonButton variant="outline" onClick={() => router.push("/user/requests")}>
                    View My Requests
                  </NeonButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
          
        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Request Equipment</CardTitle>
              <CardDescription>
                Fill out this form to request equipment or resources you need for your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="itemType">Item Type</Label>
                  <Select
                    value={formData.itemType}
                    onValueChange={(value) => {
                      handleSelectChange("itemType", value)
                      handleSelectChange("itemName", "")
                    }}
                  >
                    <SelectTrigger id="itemType" className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                      {itemTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {formData.itemType && (
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Select value={formData.itemName} onValueChange={(value) => handleSelectChange("itemName", value)}>
                      <SelectTrigger id="itemName" className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                        {itemCategories[formData.itemType as keyof typeof itemCategories]?.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {formData.itemName === "Other" && (
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="customItemName">Specify Item</Label>
                    <Input
                      id="customItemName"
                      name="customItemName"
                      placeholder="Enter item name"
                      value={formData.customItemName}
                      onChange={handleChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </motion.div>
                )}

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Explain why you need this item for your work"
                    value={formData.reason}
                    onChange={handleChange}
                    className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleSelectChange("urgency", value)}>
                    <SelectTrigger id="urgency" className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                      <SelectItem value="low">Low - Nice to have</SelectItem>
                      <SelectItem value="medium">Medium - Important but not urgent</SelectItem>
                      <SelectItem value="high">High - Urgent need</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Any specific requirements or preferences"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="min-h-[80px] bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <NeonButton type="submit" className="w-full" disabled={isLoading} variant="neon">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </NeonButton>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
          </>
         
        )}
      </div>
    </UserLayout>
  )
}

