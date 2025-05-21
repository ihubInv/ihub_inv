"use client"

import type React from "react"

import { useState, useEffect } from "react"
import SuperAdminLayout from "@/components/layout/superadmin-layout"
import { Button } from "@/components/ui/button"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserPlus, MoreHorizontal, Shield, User, UserCog } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
// import { useToaster } from "@/lib/context/app-context"
import { useRouter } from "next/navigation"
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
} from "@/lib/store/api/users/usersApi"

// User type definition
type UserType = {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "superadmin"
  department: string
  position: string
  joinDate: string
  isActive: boolean
}

export default function UsersManagement() {
  const router = useRouter()
  // const { addNotification } = useToaster()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false)
  const [userToChangeRole, setUserToChangeRole] = useState<UserType | null>(null)
  const [newRole, setNewRole] = useState<string>("")

  // RTK Query hooks
  const { data: users = [], isLoading: isFetchingUsers, isError, refetch } = useGetUsersQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation()
  const [changeUserStatus, { isLoading: isChangingStatus }] = useChangeUserStatusMutation()

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term) ||
          user.position.toLowerCase().includes(term),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Shield className="h-4 w-4 text-primary" />
      case "admin":
        return <UserCog className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-primary/20 text-primary"
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const openDeleteDialog = (id: string) => {
    setUserToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const openChangeRoleDialog = (user: UserType) => {
    setUserToChangeRole(user)
    setNewRole(user.role)
    setIsChangeRoleDialogOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete).unwrap()
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
      refetch()
    } catch (error) {
      console.error("Failed to delete user:", error)
      // addNotification({
      //   message: "Failed to delete user. Please try again.",
      //   type: "error",
      // })
    }
  }

  const handleChangeRole = async () => {
    if (!userToChangeRole || !newRole) return

    try {
      await changeUserRole({ id: userToChangeRole.id, role: newRole as "user" | "admin" | "superadmin" }).unwrap()
      setIsChangeRoleDialogOpen(false)
      setUserToChangeRole(null)
      refetch()
    } catch (error) {
      console.error("Failed to change user role:", error)
      // addNotification({
      //   message: "Failed to change user role. Please try again.",
      //   type: "error",
      // })
    }
  }

  const handleToggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      await changeUserStatus({ id, isActive: !currentStatus }).unwrap()
      refetch()
    } catch (error) {
      console.error("Failed to toggle user status:", error)
      // addNotification({
      //   message: "Failed to update user status. Please try again.",
      //   type: "error",
      // })
    }
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="mt-4 flex space-x-2 sm:mt-0">
            <NeonButton
              variant="neon"
              size="sm"
              onClick={() => router.push("/superadmin/register")}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </NeonButton>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="mt-4 sm:mt-0 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden lg:table-cell">Position</TableHead>
                    <TableHead className="hidden xl:table-cell">Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetchingUsers ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700 ml-auto"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <Badge className={`ml-2 ${getRoleBadgeClass(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.position}</TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClass(user.isActive)}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openChangeRoleDialog(user)}>
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.isActive)}>
                                {user.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(user.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
        <DialogContent className="bg-card/90 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>Update the role for {userToChangeRole?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-user"
                  name="role"
                  value="user"
                  checked={newRole === "user"}
                  onChange={() => setNewRole("user")}
                  className="h-4 w-4 text-primary"
                />
                <label htmlFor="role-user" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" /> User
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={newRole === "admin"}
                  onChange={() => setNewRole("admin")}
                  className="h-4 w-4 text-primary"
                />
                <label htmlFor="role-admin" className="text-sm font-medium flex items-center">
                  <UserCog className="h-4 w-4 mr-2" /> Admin
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-superadmin"
                  name="role"
                  value="superadmin"
                  checked={newRole === "superadmin"}
                  onChange={() => setNewRole("superadmin")}
                  className="h-4 w-4 text-primary"
                />
                <label htmlFor="role-superadmin" className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2" /> Super Admin
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeRoleDialogOpen(false)}>
              Cancel
            </Button>
            <NeonButton variant="neon" onClick={handleChangeRole}>
              Update Role
            </NeonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  )
}

