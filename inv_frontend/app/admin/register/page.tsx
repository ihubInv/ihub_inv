"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeonButton } from "@/components/ui/neon-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
// import { notification } from "@/lib/context/app-context"
import Link from "next/link"

// Departments for registration
const departments = [
  "IT Department",
  "Finance Department",
  "Marketing Department",
  "HR Department",
  "Operations Department",
  "Sales Department",
  "Executive Team",
]

export default function AdminRegisterPage() {
  const router = useRouter()
  // const { addNotification } = useToaster()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
    adminKey: "", // Special key for admin registration
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.position ||
      !formData.adminKey
    ) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Call the API to register admin
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          position: formData.position,
          adminKey: formData.adminKey,
          role: "admin",
        }),
      })

      const data = await response.json()
   console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // addNotification({
      //   message: "Admin registered successfully!",
      //   type: "success",
      // })

      // Redirect to login page
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/50 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground neon-text">Admin Registration</CardTitle>
            <CardDescription>Create a new admin account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@ihub.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department" className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Senior Manager"
                    value={formData.position}
                    onChange={handleChange}
                    className="bg-background/50 border-border/50 focus:border-primary input-neon"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminKey">Admin Registration Key</Label>
                <Input
                  id="adminKey"
                  name="adminKey"
                  type="password"
                  placeholder="Enter the admin registration key"
                  value={formData.adminKey}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
                <p className="text-xs text-muted-foreground">This key is provided by the system administrator</p>
              </div>

              <NeonButton type="submit" className="w-full" disabled={isLoading} variant="neon">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </NeonButton>

              <div className="text-center mt-4">
                <Link
                  href="/"
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

