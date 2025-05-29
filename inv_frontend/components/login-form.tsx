"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
// import { useToaster } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { usePostLoginMutation } from '../lib/store/api/auth/auth.api';
import { authenticationSlice } from "@/lib/store/slices/auth.slice"
import { useDispatch } from 'react-redux';
import { useToaster } from "@/lib/context/use-toaster"
export default function LoginForm() {

  const router = useRouter()
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = usePostLoginMutation();
  const { addNotification } = useToaster()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault()


    try {

      const response: any = await loginUser({ email, password }).unwrap();
      if (response?.success) {
        addNotification({
          message: "Login successful!",
          type: "success",
        })

        // Redirect based on user role
        if (response.user?.role === "superadmin") {
          router.push("/superadmin/dashboard")
        } else if (response.user?.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/user/dashboard")
        }
      } else {
        // setError(response.message || "Login failed. Please check your credentials.")
        addNotification({
          message: `${response.message} || "Login failed. Please check your credentials.`,
          type: "error",
        })

      }

      // Dispatch the setCredentials action to store user and token in Redux state
      dispatch(
        authenticationSlice.actions.setCredentials({
          user: response?.user,
          token: response?.token,
        }),
      )

    }
    catch (error) {
      addNotification({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      })

      // console.error("Login error:", error)
    }
  }



  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* <div className="mt-4">
          <p className="text-sm text-center text-muted-foreground mb-2">Demo Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={loginAsSuperAdmin} className="text-xs" disabled={isLoading}>
              SuperAdmin
            </Button>
            <Button variant="outline" size="sm" onClick={loginAsAdmin} className="text-xs" disabled={isLoading}>
              Admin
            </Button>
            <Button variant="outline" size="sm" onClick={loginAsUser} className="text-xs" disabled={isLoading}>
              User
            </Button>
          </div>
        </div> */}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/user/register" className="text-primary hover:underline">
            Register
          </Link>
        </div> */}
        <motion.div
          className="text-xs text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* <Link href="/superadmin/register" className="text-primary/70 hover:underline">
            Register as SuperAdmin
          </Link><br /> */}
          {/* <Link href="/admin/register" className="text-primary/70 hover:underline">
            Register as Admin
          </Link> */}
        </motion.div>
      </CardFooter>
    </Card>
  )
}

