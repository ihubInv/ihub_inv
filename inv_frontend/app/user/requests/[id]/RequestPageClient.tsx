"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import UserLayout from "@/components/layout/user-layout"
// import { useUser } from "@/lib/context/user-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NeonButton } from "@/components/ui/neon-button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, CheckCircle, XCircle, Laptop, Monitor, Package, FileText } from "lucide-react"
import { useGetRequestByIdQuery } from "@/lib/store/api/users/requestApi"

export default function RequestPage({ id }: { id: string }) {
  console.log("id", id)
  const router = useRouter()
  const [request, setRequest] = useState<any>(undefined)

  const { data: requestById, isLoading } = useGetRequestByIdQuery(id)

  useEffect(() => {
    if (!isLoading) {
      const requestData = requestById?.data

      if (!requestData) {
        router.push('/user/requests')
        return
      }

      setRequest(requestData)
    }
  }, [id, requestById, isLoading])

  if (!request) {
    return (
      <UserLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-16 w-16 relative">
            <div className="h-full w-full border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }

  const getStatusIcon = () => {
    switch (request.status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const getItemIcon = () => {
    if (request.itemType === "Hardware") {
      if (request.itemName.toLowerCase().includes("laptop")) {
        return <Laptop className="h-6 w-6 text-primary" />
      } else if (request.itemName.toLowerCase().includes("monitor")) {
        return <Monitor className="h-6 w-6 text-primary" />
      } else {
        return <Package className="h-6 w-6 text-primary" />
      }
    } else {
      return <FileText className="h-6 w-6 text-primary" />
    }
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <NeonButton variant="outline" size="sm" onClick={() => router.push("/user/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </NeonButton>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {getItemIcon()}
                <CardTitle>{request.itemName}</CardTitle>
              </div>
              <Badge
                className={
                  request.status === "approved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                }
              >
                {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Request Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Item Type:</span>
                        <span className="text-sm font-medium">{request.itemType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Urgency:</span>
                        <span className="text-sm font-medium capitalize">{request.urgency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Request Date:</span>
                        <span className="text-sm font-medium">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <div className="flex items-center">
                          {getStatusIcon()}
                          <span className="text-sm font-medium ml-1 capitalize">{request.status}</span>
                        </div>
                      </div>
                      {request.responseDate && (
                        <div className="flex justify-between">
                          <span className="text-sm">Response Date:</span>
                          <span className="text-sm font-medium">
                            {new Date(request.responseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {request?.responseBy && (
                        <div className="flex justify-between">
                          <span className="text-sm">Responded By:</span>
                          <span className="text-sm font-medium">
                            {request.responseBy.name || "Unknown"}
                          </span>
                        </div>
                      )}



                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reason for Request</h3>
                  <p className="mt-2 text-sm">{request.reason}</p>
                </div>

                {request.responseNote && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Admin Response</h3>
                      <p className="mt-2 text-sm">{request.responseNote}</p>
                    </div>
                  </>
                )}

                {request.status === "approved" && request.specifications && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Item Specifications</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(request.specifications).map(([key, value]: any) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm capitalize">{key}:</span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </UserLayout>
  )
}

