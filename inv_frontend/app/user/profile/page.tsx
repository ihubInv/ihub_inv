"use client"
import { motion } from "framer-motion"
import UserLayout from "@/components/layout/user-layout"
// import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Laptop, Monitor, Package, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetRequestsQuery } from "@/lib/store/api/users/requestApi"
import { useSelector } from "react-redux"

export default function UserProfilePage() {
  // const { user, requests } = useUser()
  const router = useRouter()
  // const { user, requests } = useUser()
      const { data: requestsData, isLoading } = useGetRequestsQuery()
      // console.log(requests)
      const requests=requestsData?.data




      // const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(
    (state: any) => state?.authentication?.me
  );
  console.log("user",user)

  // Filter user's approved requests
  const approvedRequests = requests?.filter((req:any) => req.userId === user?.id && req.status === "approved")

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((part:any) => part[0])
      ?.join("")
      ?.toUpperCase()
  }

  const getItemIcon = (request: (typeof requests)[0]) => {
    if (request?.itemType === "Hardware") {
      if (request?.itemName?.toLowerCase()?.includes("laptop")) {
        return <Laptop className="h-5 w-5 text-primary" />
      } else if (request?.itemName?.toLowerCase()?.includes("monitor")) {
        return <Monitor className="h-5 w-5 text-primary" />
      } else {
        return <Package className="h-5 w-5 text-primary" />
      }
    } else {
      return <FileText className="h-5 w-5 text-primary" />
    }
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <motion.h1
          className="text-2xl font-bold text-foreground neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Profile
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="mt-4 w-full">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Department:</span>
                        <span className="text-sm font-medium">{user?.department}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Position:</span>
                        <span className="text-sm font-medium">{user?.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Join Date:</span>
                        <span className="text-sm font-medium">
                          {new Date(user?.joinDate || "").toLocaleDateString()}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle>My Equipment</CardTitle>
                <CardDescription>Equipment and resources assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedRequests?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No equipment assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedRequests?.map((request:any, index:any) => (
                      <motion.div
                        key={request?._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">{getItemIcon(request)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{request?.itemName}</h4>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Assigned
                              </Badge>
                            </div>

                              {request?.specifications ? (
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                {Object.entries(request?.specifications)?.map(([key, value]:any) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-xs text-muted-foreground capitalize">{key}:</span>
                                    <span className="text-xs font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-1">No detailed specifications available</p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                Assigned on {new Date(request?.responseDate || "").toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  )
}

