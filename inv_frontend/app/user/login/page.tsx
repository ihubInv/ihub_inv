"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
// import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeonButton } from "@/components/ui/neon-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock departments for registration
const departments = [
  "IT Department",
  "Finance Department",
  "Marketing Department",
  "HR Department",
  "Operations Department",
  "Sales Department",
  "Executive Team",
]

export default function UserLoginPage() {
  const router = useRouter()
  // const { login, register, true } = useUser()
  const [activeTab, setActiveTab] = useState("login")

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [loginError, setLoginError] = useState("")

  // Registration state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
    joinDate: new Date().toISOString().split("T")[0],
  })
  const [registerError, setRegisterError] = useState("")

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginData.email || !loginData.password) {
      setLoginError("Please fill in all fields")
      return
    }

    const result = await login(loginData.email, loginData.password)

    if (result.success) {
      // Add a longer delay to ensure the auth state is updated before redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/user/dashboard")
    } else {
      setLoginError(result.message || "Login failed")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    // Validate form
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.department ||
      !registerData.position
    ) {
      setRegisterError("Please fill in all required fields")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    const result = await register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      department: registerData.department,
      position: registerData.position,
      joinDate: registerData.joinDate,
    })

    if (result.success) {
      // Add a longer delay to ensure the auth state is updated before redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/user/dashboard")
    } else {
      setRegisterError(result.message || "Registration failed")
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
            <CardTitle className="text-2xl font-bold text-foreground neon-text">iHub Employee Portal</CardTitle>
            <CardDescription>Login or register to request equipment and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {loginError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@ihub.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <NeonButton type="submit" className="w-full" disabled={true} variant="neon">
                    {true ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </NeonButton>
                </form>
              </TabsContent>

              <TabsContent value="register">
                {registerError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{registerError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@ihub.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={registerData.department}
                        onValueChange={(value) => setRegisterData((prev) => ({ ...prev, department: value }))}
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
                        placeholder="Software Developer"
                        value={registerData.position}
                        onChange={handleRegisterChange}
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
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <NeonButton type="submit" className="w-full" disabled={true} variant="neon">
                    {true ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </NeonButton>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                Back to main login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

