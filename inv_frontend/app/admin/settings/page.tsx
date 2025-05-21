"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layout/admin-layout"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Moon, Sun, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/lib/theme-config"
// import { useToaster } from "@/lib/context/app-context"

export default function Settings() {
  // const { user, addNotification } = useToaster()
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const { theme, toggleTheme } = useTheme()

  const [uiSettings, setUiSettings] = useState({
    enableAnimations: true,
    enableSoundEffects: false,
    sidebarCollapsed: false,
  })

  // Load user data and settings
  useEffect(() => {
    // if (user) {
    //   setProfileData({
    //     name: user.name || "Admin User",
    //     email: user.email || "admin@ihub.com",
    //     phone: "+91 9876543210",
    //   })
    // }

    // Load UI settings from localStorage
    const storedSettings = localStorage.getItem("ui-settings")
    if (storedSettings) {
      try {
        setUiSettings(JSON.parse(storedSettings))
      } catch (error) {
        console.error("Failed to parse UI settings", error)
      }
    }
  // }, [user])
}, [])


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUiSettingChange = (name: string, value: boolean) => {
    setUiSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess("")
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the data to your API here
      console.log("Profile data:", profileData)

      setSuccess("Profile updated successfully")
      // addNotification({
      //   message: "Profile updated successfully",
      //   type: "success",
      // })
    } catch (err) {
      setError("Failed to update profile")
      // addNotification({
      //   message: "Failed to update profile",
      //   type: "error",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsSubmitting(true)
    setSuccess("")
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the data to your API here
      console.log("Password data:", passwordData)

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setSuccess("Password updated successfully")
      // addNotification({
      //   message: "Password updated successfully",
      //   type: "success",
      // })
    } catch (err) {
      setError("Failed to update password")
      // addNotification({
      //   message: "Failed to update password",
      //   type: "error",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUiSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess("")
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage
      localStorage.setItem("ui-settings", JSON.stringify(uiSettings))

      setSuccess("UI settings updated successfully")
      // addNotification({
      //   message: "UI settings updated successfully",
      //   type: "success",
      // })

      // Apply sidebar collapsed state
      localStorage.setItem("sidebar-collapsed", String(uiSettings.sidebarCollapsed))

      // Apply animations setting
      document.documentElement.classList.toggle("reduce-motion", !uiSettings.enableAnimations)
    } catch (err) {
      setError("Failed to update UI settings")
      // addNotification({
      //   message: "Failed to update UI settings",
      //   type: "error",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          Settings
        </motion.h1>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert className="bg-green-500/10 border-green-500/30 dark:bg-green-500/20 dark:border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Success</AlertTitle>
              <AlertDescription className="text-green-500/90">{success}</AlertDescription>
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <NeonButton type="submit" disabled={isSubmitting} variant="neon">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </NeonButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <Separator className="my-4" />

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="bg-background/50 border-border/50 focus:border-primary input-neon"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <NeonButton type="submit" disabled={isSubmitting} variant="neon">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </NeonButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the appearance and behavior of the interface.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUiSettingsSubmit} className="space-y-6">
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Theme</Label>
                          <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                        </div>
                        <NeonButton
                          type="button"
                          onClick={toggleTheme}
                          variant="neon"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {theme === "dark" ? (
                            <>
                              <Sun className="h-4 w-4" />
                              <span>Light Mode</span>
                            </>
                          ) : (
                            <>
                              <Moon className="h-4 w-4" />
                              <span>Dark Mode</span>
                            </>
                          )}
                        </NeonButton>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableAnimations">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable or disable UI animations.</p>
                        </div>
                        <Switch
                          id="enableAnimations"
                          checked={uiSettings.enableAnimations}
                          onCheckedChange={(checked) => handleUiSettingChange("enableAnimations", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableSoundEffects">Sound Effects</Label>
                          <p className="text-sm text-muted-foreground">Enable or disable UI sound effects.</p>
                        </div>
                        <Switch
                          id="enableSoundEffects"
                          checked={uiSettings.enableSoundEffects}
                          onCheckedChange={(checked) => handleUiSettingChange("enableSoundEffects", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sidebarCollapsed">Sidebar Default State</Label>
                          <p className="text-sm text-muted-foreground">Set the default state of the sidebar.</p>
                        </div>
                        <Switch
                          id="sidebarCollapsed"
                          checked={uiSettings.sidebarCollapsed}
                          onCheckedChange={(checked) => handleUiSettingChange("sidebarCollapsed", checked)}
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <NeonButton type="submit" disabled={isSubmitting} variant="neon">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Settings"
                        )}
                      </NeonButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

