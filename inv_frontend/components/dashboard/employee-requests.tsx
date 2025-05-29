"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/ui/neon-button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Laptop,
  Monitor,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Search,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  useGetAllRequestsQuery , 
  useApproveRequestMutation,
  useRejectRequestMutation,
  useGetRequestStatsQuery,} from "@/lib/store/api/users/requestApi"

export default function EmployeeRequests() {
  // const { addNotification } = useToaster()
  const { data: requestsData, isLoading } = useGetAllRequestsQuery()
 
  const { data: requestsStatus } = useGetRequestStatsQuery()

 
  const [requests, setRequests] = useState<any[]>(requestsData?.data || [])
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [responseNote, setResponseNote] = useState("")
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [approveRequest] = useApproveRequestMutation()
  const [rejectRequest] = useRejectRequestMutation()
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    itemType: "all",
    search: "",
  })

  useEffect(() => {
    if (requestsStatus?.data) {
      setFilters((prev) => ({
        ...prev,
        ...requestsStatus.data,
        status: requestsStatus.data.status || "all",
        urgency: requestsStatus.data.urgency || "all",
        itemType: requestsStatus.data.itemType || "all",
        search: requestsStatus.data.search || "",
      }));
    }
    if (requestsData?.data) {
      setRequests(requestsData.data);
    }
  }, [requestsData?.data, requestsStatus?.data]);


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

  

  const handleApprove = async () => {
    debugger
    if (!selectedRequest) return;
  
    try {
      const approvalData = {
        responseNote,
        specifications,
      };
  
      await approveRequest({
        id: selectedRequest._id,
        body: approvalData,
      }).unwrap();
  
      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? {
                ...req,
                status: "approved",
                responseDate: new Date().toISOString(),
                responseNote,
                specifications,
              }
            : req
        )
      );
  
      setIsApproveDialogOpen(false);
      setResponseNote("");
      setSpecifications({});
      setSelectedRequest(null);
  
      // addNotification({
      //   message: "Request approved successfully",
      //   type: "success",
      // });
    } catch (error) {
      console.error("Error approving request:", error);
      // addNotification({
      //   message: "Failed to approve request",
      //   type: "error",
      // });
    }
  };
  




  const handleReject = async () => {
    debugger
    if (!selectedRequest) return;
  
    try {
      const rejectionData = {
        responseNote,
      };
  
      await rejectRequest({
        id: selectedRequest._id,
        body: rejectionData,
      }).unwrap();
  
      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? {
                ...req,
                status: "rejected",
                responseDate: new Date().toISOString(),
                responseNote,
              }
            : req
        )
      );
  
      setIsRejectDialogOpen(false);
      setResponseNote("");
      setSelectedRequest(null);
  
      // addNotification({
      //   message: "Request rejected",
      //   type: "info",
      // });
    } catch (error) {
      console.error("Error rejecting request:", error);
      // addNotification({
      //   message: "Failed to reject request",
      //   type: "error",
      // });
    }
  };
  

  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addSpecificationField = () => {
    const newKey = `spec${Object.keys(specifications).length + 1}`
    setSpecifications((prev) => ({
      ...prev,
      [newKey]: "",
    }))
  }

  const removeSpecificationField = (key: string) => {
    const { [key]: _, ...rest } = specifications
    setSpecifications(rest)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      urgency: "all",
      itemType: "all",
      search: "",
    })
  }

  // Filter requests according to filters and search
  const filteredRequests = requests.filter((req) => {
    // Status filter
    if (filters.status !== "all" && req.status !== filters.status) return false;
    // Urgency filter
    if (filters.urgency !== "all" && req.urgency !== filters.urgency) return false;
    // Item type filter
    if (filters.itemType !== "all" && req.itemType !== filters.itemType) return false;
    // Search filter (search in itemName, reason, user name, department)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches =
        req.itemName?.toLowerCase().includes(search) ||
        req.reason?.toLowerCase().includes(search) ||
        req.userId?.name?.toLowerCase().includes(search) ||
        req.userId?.department?.toLowerCase().includes(search);
      if (!matches) return false;
    }
    return true;
  });

  // Only show pending requests from the filtered list
  const filteredPendingRequests = filteredRequests.filter((req) => req.status === "pending");

  return (
    <>
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              <span>Employee Requests</span>
              {filteredPendingRequests.length > 0 && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  {filteredPendingRequests.length} Pending
                </Badge>
              )}
             
              
            </CardTitle>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="pl-8 w-full sm:w-[200px] bg-background/50 border-border/50 focus:border-primary input-neon"
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={isFilterOpen ? "bg-primary/10" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
 
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
            >
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses">All statuses</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div>
                <Label htmlFor="urgency-filter">Urgency</Label>
                <Select value={filters.urgency || "all"} onValueChange={(value) => handleFilterChange("urgency", value)}>
                  <SelectTrigger id="urgency-filter">
                    <SelectValue placeholder="All urgencies">All urgencies</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All urgencies</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type-filter">Item Type</Label>
                <Select value={filters.itemType || "all"} onValueChange={(value) => handleFilterChange("itemType", value)}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="All types">All types</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-start">
                    <h1 className="text-center text-muted-foreground font-bold text-2xl ">No Requests Found</h1>
                  </div>
                </div>
            </div>
          ) : filteredPendingRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPendingRequests?.map((request:any,  index:any) => {
                const user = request.userId
                console.log("request>>>",request)
                return (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">{getItemIcon(request)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{request.itemName}</h4>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        </div>

                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <User className="mr-1 h-3 w-3" />
                          <span>
                            {user?.name} {user?.department}
                          </span>
                        </div>

                        <p className="text-sm mt-2">{request.reason}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                          <Badge
                            className={`
                            ${
                              request.urgency === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                : request.urgency === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            }
                          `}
                          >
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <NeonButton
                            variant="neon"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsApproveDialogOpen(true)
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </NeonButton>

                          <NeonButton
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsRejectDialogOpen(true)
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </NeonButton>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Approve this request and provide specifications for the item.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Request Details</Label>
              <div className="p-3 rounded-md bg-muted/30 text-sm">
                <p>
                  <strong>Item:</strong> {selectedRequest?.itemName}
                </p>
                <p>
                  <strong>Requested by:</strong> {selectedRequest?.userId?.name}
                </p>
                <p>
                  <strong>Department:</strong> {selectedRequest?.userId?.department}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest?.reason}
                </p>
                <p>
                  <strong>Urgency:</strong>{" "}
                  {selectedRequest?.urgency.charAt(0).toUpperCase() + selectedRequest?.urgency.slice(1)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responseNote">Response Note</Label>
              <Textarea
                id="responseNote"
                placeholder="Add a note about this approval"
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="min-h-[80px] bg-background/50 border-border/50 focus:border-primary input-neon"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Item Specifications</Label>
                <Button variant="outline" size="sm" onClick={addSpecificationField}>
                  Add Field
                </Button>
              </div>

              {Object.keys(specifications).length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  Add specifications for the item (e.g. model, etc.)
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Specification name"
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value
                            const newSpecs = Object.entries(specifications).reduce(
                              (acc, [k, v]) => {
                                if (k === key) {
                                  acc[newKey] = v
                                } else {
                                  acc[k] = v
                                }
                                return acc
                              },
                              {} as Record<string, string>,
                            )
                            setSpecifications(newSpecs)
                          }}
                          className="bg-background/50 border-border/50 focus:border-primary input-neon"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Value"
                          value={value}
                          onChange={(e) => handleSpecificationChange(key, e.target.value)}
                          className="bg-background/50 border-border/50 focus:border-primary input-neon"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeSpecificationField(key)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <NeonButton variant="neon" onClick={handleApprove}>
              Approve Request
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this request.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Request Details</Label>
              <div className="p-3 rounded-md bg-muted/30 text-sm">
                <p>
                  <strong>Item:</strong> {selectedRequest?.itemName}
                </p>
                <p>
                  <strong>Requested by:</strong> {selectedRequest?.userId?.name}
                </p>
                <p>
                  <strong>Department:</strong> {selectedRequest?.userId?.department}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest?.reason}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejectNote">Rejection Reason</Label>
              <Textarea
                id="rejectNote"
                placeholder="Explain why this request is being rejected"
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary input-neon"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <NeonButton variant="neonPurple" onClick={handleReject}>
              Reject Request
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     
    </div>
    
    </>
  )
}

