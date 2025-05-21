"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import UserLayout from "@/components/layout/user-layout"
import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { NeonButton } from "@/components/ui/neon-button"
import { Laptop, Monitor, Package, FileText, Search, PlusCircle, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useGetRequestsQuery } from "@/lib/store/api/users/requestApi"
import { useSelector } from "react-redux"

export default function UserRequestsPage() {
  const router = useRouter()
  // const { user, requests } = useUser()
  const { data: requestsData, isLoading } = useGetRequestsQuery()
  // console.log(requests)
  const requests:any=requestsData?.data




  // const isLoggedIn = useSelector(selectIsLoggedIn);
const user = useSelector(
(state: any) => state?.authentication?.me
);
console.log("user",user)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter user's requests
  const userRequests = requests?.filter((req:any) => req.userId === user?.id)
console.log("userRequests",requests)
  // Filter by status
  const pendingRequests = userRequests?.filter((req:any) => req.status === "pending")
  const approvedRequests = userRequests?.filter((req:any) => req.status === "approved")
  const rejectedRequests = userRequests?.filter((req:any) => req.status === "rejected")

  // Filter by search term
  const filterRequests = (reqs: any) => {
    debugger
    if (!searchTerm) return reqs

    const term = searchTerm.toLowerCase()
    return reqs.filter(
      (req:any) =>
        req.itemName.toLowerCase().includes(term) ||
        req.itemType.toLowerCase().includes(term) ||
        req.reason.toLowerCase().includes(term),
    )
  }

  const getItemIcon = (request: any) => {
    if (request.itemType === "Hardware") {
      if (request.itemName.toLowerCase().includes("laptop")) {
        return <Laptop className="h-5 w-5 text-primary" />
      } else if (request.itemName.toLowerCase().includes("monitor")) {
        return <Monitor className="h-5 w-5 text-primary" />
      } else {
        return <Package className="h-5 w-5 text-primary" />
      }
    } else {
      return <FileText className="h-5 w-5 text-primary" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <UserLayout>
      <div className="space-y-6">
      <div className="flex items-center gap-2">
          <NeonButton variant="outline" size="sm" onClick={() => router.push("/user/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </NeonButton>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h1
            className="text-2xl font-bold text-foreground neon-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Requests
          </motion.h1>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8 w-full sm:w-[250px] bg-background/50 border-border/50 focus:border-primary input-neon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <NeonButton variant="neon" size="sm" onClick={() => router.push("/user/new-request")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </NeonButton>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Equipment Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">All ({userRequests?.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pendingRequests?.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedRequests?.length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedRequests?.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderRequestList(filterRequests(userRequests))}</TabsContent>

                <TabsContent value="pending">{renderRequestList(filterRequests(pendingRequests))}</TabsContent>

                <TabsContent value="approved">{renderRequestList(filterRequests(approvedRequests))}</TabsContent>

                <TabsContent value="rejected">{renderRequestList(filterRequests(rejectedRequests))}</TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </UserLayout>
  )

  function renderRequestList(requestList: any) {
    debugger
    if (requestList?.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No requests found</p>
          {searchTerm ? (
            <NeonButton variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </NeonButton>
          ) : (
            <NeonButton variant="neon" onClick={() => router.push("/user/new-request")}>
              Make a new request
            </NeonButton>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {requestList
          ?.sort((a:any, b:any) => new Date(b.requestDate).getTime() - new Date(a?.requestDate).getTime())
          ?.map((request:any, index:any) => (
            <motion.div
              key={request?._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-start p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => router.push(`/user/requests/${request?._id}`)}
            >
              <div className="mr-3 mt-0.5">{getItemIcon(request)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{request?.itemName}</h4>
                  <div className="flex items-center">
                    {getStatusIcon(request?.status)}
                    <Badge
                      className={`ml-2 ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    Requested on {new Date(request?.requestDate)?.toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium">
                    Urgency: {request?.urgency?.charAt(0)?.toUpperCase() + request?.urgency?.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    )
  }
}

