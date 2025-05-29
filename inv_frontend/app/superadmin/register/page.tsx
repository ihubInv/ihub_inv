// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { NeonButton } from "@/components/ui/neon-button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { AlertCircle, Loader2, ArrowLeft, ShieldAlert } from "lucide-react"
// // import { useToaster } from "@/lib/context/app-context"
// import Link from "next/link"
// import { usePostSignupMutation } from "@/lib/store/api/auth/auth.api"

// // Departments for registration
// // const departments = [
// //   "IT Department",
// //   "Finance Department",
// //   "Marketing Department",
// //   "HR Department",
// //   "Operations Department",
// //   "Sales Department",
// //   "Executive Team",
// // ]

// export default function SuperAdminRegisterPage() {
//   const router = useRouter()
//   // const { addNotification } = useToaster()
//   // usePostSignupMutation
//   const [register] = usePostSignupMutation();
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     // department: "",
//     // position: "",
//     role: "superadmin", // ✅ REQUIRED
//     superAdminKey: "", // Special key for superadmin registration
//     masterKey: "", // Master key for additional security
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   // const handleSelectChange = (name: string, value: string) => {
//   //   setFormData((prev) => ({ ...prev, [name]: value }))
//   // }

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setError("")

//   //   const payload:any = {
//   //     name: formData.name,
//   //     email: formData.email,
//   //     password: formData.password,
//   //     department: formData.department,
//   //     position: formData.position,
//   //     superAdminKey: formData.superAdminKey,
//   //     masterKey: formData.masterKey,
//   //   };

//   //   // Actual API call
//   //   const response = await register(payload).unwrap();
//   //   console.log("Category Created:", response);

//   //   // Validate form
//   //   if (
//   //     !formData.name ||
//   //     !formData.email ||
//   //     !formData.password ||
//   //     !formData.department ||
//   //     !formData.position ||
//   //     !formData.superAdminKey ||
//   //     !formData.masterKey
//   //   ) {
//   //     setError("Please fill in all required fields")
//   //     return
//   //   }

//   //   if (formData.password !== formData.confirmPassword) {
//   //     setError("Passwords do not match")
//   //     return
//   //   }

//   //   if (formData.password.length < 8) {
//   //     setError("Password must be at least 8 characters for superadmin accounts")
//   //     return
//   //   }

//   //   setIsLoading(true)

//   //   try {
//   //     // Call the API to register superadmin
//   //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-superadmin`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         name: formData.name,
//   //         email: formData.email,
//   //         password: formData.password,
//   //         department: formData.department,
//   //         position: formData.position,
//   //         superAdminKey: formData.superAdminKey,
//   //         masterKey: formData.masterKey,
//   //       }),
//   //     })

//   //     const data = await response.json()

//   //     if (!response.ok) {
//   //       throw new Error(data.message || "Registration failed")
//   //     }

//   //     // addNotification({
//   //     //   message: "Super Admin registered successfully!",
//   //     //   type: "success",
//   //     // })

//   //     // Redirect to login page
//   //     router.push("/")
//   //   } catch (err: any) {
//   //     setError(err.message || "Registration failed")
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }




//   const handleSubmit = async (e: React.FormEvent) => {
//     debugger
//     e.preventDefault()
//     setError("")
  
//     // Validate form before submitting
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.password ||
//       // !formData.department ||
//       // !formData.position ||
//       !formData.superAdminKey ||
//       !formData.masterKey
//     ) {
//       setError("Please fill in all required fields")
//       return
//     }
  
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }
  
//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters for superadmin accounts")
//       return
//     }
  
//     const payload = {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       // department: formData.department,
//       // position: formData.position,
//       role: formData.role,
//       superAdminKey: formData.superAdminKey,
//       masterKey: formData.masterKey,
//     }
  
//     setIsLoading(true)
  
//     try {
//       // Call RTK Query mutation
//       const response = await register(payload).unwrap()
//       console.log("Super Admin Registered:", response)
  
//       // Redirect to login
//       router.push("/")
//     } catch (err: any) {
//       setError(err?.data?.message || "Registration failed")
//     } finally {
//       setIsLoading(false)
//     }
//   }
  

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/50 p-4">
//       <motion.div
//         className="w-full max-w-md"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
//           <CardHeader className="text-center">
//             <div className="flex items-center justify-center mb-2">
//               <ShieldAlert className="h-8 w-8 text-primary mr-2" />
//               <CardTitle className="text-2xl font-bold text-foreground neon-text">Super Admin Registration</CardTitle>
//             </div>
//             <CardDescription>Create a new super admin account with elevated privileges</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {error && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="John Doe"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="superadmin@ihub.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//               </div>

//               {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="department">Department</Label>
//                   <Select
//                     value={formData.department}
//                     onValueChange={(value) => handleSelectChange("department", value)}
//                   >
//                     <SelectTrigger id="department" className="bg-background/50 border-border/50">
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
//                       {departments.map((dept) => (
//                         <SelectItem key={dept} value={dept}>
//                           {dept}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="position">Position</Label>
//                   <Input
//                     id="position"
//                     name="position"
//                     placeholder="Chief Technology Officer"
//                     value={formData.position}
//                     onChange={handleChange}
//                     className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                   />
//                 </div>
//               </div> */}

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Must be at least 8 characters and include uppercase, lowercase, numbers, and special characters
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="superAdminKey">Super Admin Registration Key</Label>
//                 <Input
//                   id="superAdminKey"
//                   name="superAdminKey"
//                   type="password"
//                   placeholder="Enter the super admin registration key"
//                   value={formData.superAdminKey}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="masterKey">Master Security Key</Label>
//                 <Input
//                   id="masterKey"
//                   name="masterKey"
//                   type="password"
//                   placeholder="Enter the master security key"
//                   value={formData.masterKey}
//                   onChange={handleChange}
//                   className="bg-background/50 border-border/50 focus:border-primary input-neon"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   This is an additional security measure for super admin accounts
//                 </p>
//               </div>

//               <NeonButton type="submit" className="w-full" disabled={isLoading} variant="neon">
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Registering...
//                   </>
//                 ) : (
//                   "Register Super Admin"
//                 )}
//               </NeonButton>

//               <div className="text-center mt-4">
//                 <Link
//                   href="/"
//                   className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors flex items-center justify-center"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-1" />
//                   Back to login
//                 </Link>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }








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
import { AlertCircle, Loader2, ArrowLeft, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { usePostSignupMutation } from "@/lib/store/api/auth/auth.api"
import { useToaster } from "@/lib/context/use-toaster"

export default function RegisterPage() {
  const router = useRouter()
  const [register] = usePostSignupMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const {  addNotification } = useToaster()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default
    department: "",
    position: "",
    superAdminKey: "",
    masterKey: "",
  })



  const departments = [
    "IT Department",
    "Finance Department",
    "Marketing Department",
    "HR Department",
    "Operations Department",
    "Sales Department",
    "Executive Team",
  ]
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    debugger
    e.preventDefault()
    setError("")

    const { name, email, password, confirmPassword, role, department, position, superAdminKey, masterKey } = formData

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters")
    //   return
    // }

    if (role === "superadmin" && (!superAdminKey || !masterKey)) {
      setError("Superadmin credentials are required")
      return
    }

    if (role === "admin" && (!department || !position)) {
      setError("Admin credentials are required")
      return
    }

    const payload: any = {
      name,
      email,
      password,
      role,
      department
    }

    if (role === "superadmin") {
      payload.superAdminKey = superAdminKey
      payload.masterKey = masterKey
    }

    if (role === "admin") {
      payload.department = department
      payload.position = position
    }

    setIsLoading(true)

    try {
      const response = await register(payload).unwrap()
      console.log("Registered:", response)
      router.push("/")
      addNotification({
        message: "Registered successful !Please Login",
        type: "success",
      })

    } catch (err: any) {
      setError(err?.data?.message || "Registration failed")
      addNotification({
        message: "Registeration Failed",
        type: "error",
      })
      
    } finally {
      setIsLoading(false)
    }
  }

  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-md rounded-lg shadow-lg border border-border/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ShieldAlert className="h-8 w-8 text-primary mr-2" />
              <CardTitle className="text-2xl font-bold text-foreground neon-text">Register Account</CardTitle>
            </div>
            <CardDescription>Select your role and complete the registration</CardDescription>
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
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger id="role" className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-md border-border/50">
                    <SelectItem value="user" defaultValue="user">User</SelectItem>
                    {/* <SelectItem value="admin" >Admin</SelectItem> */}
                    <SelectItem value="superadmin" >Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background/50 border-border/50 focus:border-primary input-neon"
                />
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    // onValueChange={(value) => handleSelectChange("department", value)}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
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
                  {/* </div> */}
              {formData.role === "admin" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. IT, HR"
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="e.g. Manager"
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>
                </>
              )}

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

              {formData.role === "superadmin" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="superAdminKey">Super Admin Key</Label>
                    <Input
                      id="superAdminKey"
                      name="superAdminKey"
                      type="password"
                      value={formData.superAdminKey}
                      onChange={handleChange}
                      placeholder="Enter superadmin key"
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="masterKey">Master Key</Label>
                    <Input
                      id="masterKey"
                      name="masterKey"
                      type="password"
                      value={formData.masterKey}
                      onChange={handleChange}
                      placeholder="Enter master key"
                      className="bg-background/50 border-border/50 focus:border-primary input-neon"
                    />
                  </div>
                </>
              )}

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
