"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
// import { useToaster } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"
import SuperAdminLayout from "@/components/layout/superadmin-layout"

export default function CreateAdminPage() {
  const router = useRouter()
  // const { addNotification } = useToaster()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "IT",
    position: "Admin",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          role: "admin",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin account")
      }

      setSuccess(true)
      // addNotification({
      //   message: "Admin account created successfully!",
      //   type: "success",
      // })

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "IT",
        position: "Admin",
      })
    } catch (error) {
      console.error("Error creating admin:", error)
      setError(error instanceof Error ? error.message : "Failed to create admin account")
      // addNotification({
      //   message: error instanceof Error ? error.message : "Failed to create admin account",
      //   type: "error",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SuperAdminLayout>
      <div className="container mx-auto py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-md mx-auto shadow-lg border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Admin Account</CardTitle>
              <CardDescription className="text-center">
                Create a new admin account with limited privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background"
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="IT"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Admin"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>

                {error && <div className="text-sm text-red-500 dark:text-red-400">{error}</div>}

                {success && (
                  <div className="flex items-center text-sm text-green-500 dark:text-green-400">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Admin account created successfully!
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SuperAdminLayout>
  )
}

