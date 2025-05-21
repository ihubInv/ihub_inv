"use client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import UserLayout from "@/components/layout/user-layout"
import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NeonButton } from "@/components/ui/neon-button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Monitor, Package, FileText, Clock, CheckCircle, XCircle, User, Phone, Mail } from "lucide-react"
import { useGetRequestsQuery } from "@/lib/store/api/users/requestApi"
import { selectIsLoggedIn } from "@/lib/store/selectors/auth.selector"
import { useSelector } from "react-redux"

export default function UserDashboard() {
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
// const user={
//   id:1,
//   name:"John Doe",
//   department:"IT",
//   position:"Developer",
//   email:"john.doe@example.com"
// }
// const requests=[{
//   id:1,
//   userId:1,
//   status:"pending",
//   requestDate:"2021-01-01"
// }]
  // Filter requests by status
    const pendingRequests = requests?.filter((req:any) => req.userId === user?.id && req.status === "pending")
  const approvedRequests = requests?.filter((req:any) => req.userId === user?.id && req.status === "approved")
  const rejectedRequests = requests?.filter((req:any) => req.userId === user?.id && req.status === "rejected")

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-foreground neon-text">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            {user?.department}  {user?.position}
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={cardVariants} custom={0} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500 animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{pendingRequests?.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={1} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500 animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{approvedRequests?.length}</div>
                <p className="text-xs text-muted-foreground">Items assigned to you</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={2} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                <XCircle className="h-4 w-4 text-red-500 animate-pulse-neon" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{rejectedRequests?.length}</div>
                <p className="text-xs text-muted-foreground">Declined requests</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={cardVariants} custom={3} initial="hidden" animate="visible">
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your most recent equipment requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requests?.filter((req:any) => req.userId === user?.id).length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You haven't made any requests yet</p>
                  <NeonButton variant="neon" className="mt-4" onClick={() => router.push("/user/new-request")}>
                    Make your first request
                  </NeonButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests
                    ?.filter((req:any) => req.userId === user?.id)
                    .sort((a:any, b:any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                    .slice(0, 3)
                    .map((request:any, index:number) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => router.push(`/user/requests/${request._id}`)}
                      >
                        <div className="mr-3 mt-0.5">
                          {request.itemType === "Hardware" ? (
                            request.itemName.toLowerCase().includes("laptop") ? (
                              <Laptop className="h-5 w-5 text-primary" />
                            ) : request.itemName.toLowerCase().includes("monitor") ? (
                              <Monitor className="h-5 w-5 text-primary" />
                            ) : (
                              <Package className="h-5 w-5 text-primary" />
                            )
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{request.itemName}</h4>
                            <Badge
                              className={
                                request.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              Requested on {new Date(request.requestDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs font-medium">
                              Urgency: {request?.urgency?.charAt(0)?.toUpperCase() + request?.urgency?.slice(1)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                  <div className="text-center pt-2">
                    <NeonButton variant="outline" onClick={() => router.push("/user/requests")}>
                      View all requests
                    </NeonButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div variants={cardVariants} custom={4} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <NeonButton
                    variant="neon"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/user/new-request")}
                  >
                    <Package className="h-8 w-8 mb-2" />
                    <span>Request Equipment</span>
                  </NeonButton>

                  <NeonButton
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/user/profile")}
                  >
                    <User className="h-8 w-8 mb-2" />
                    <span>View Profile</span>
                  </NeonButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} custom={5} initial="hidden" animate="visible">
            <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you need assistance with equipment requests or have questions about the process, please contact the
                  IT department.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <span>it-support@ihub.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <span>Ext. 1234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </UserLayout>
  )
}

