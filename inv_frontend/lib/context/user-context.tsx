"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI, requestsAPI } from "@/lib/api"

type UserType = {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  profileImage?: string
}

type RequestStatus = "pending" | "approved" | "rejected"

type RequestType = {
  id: string
  userId: string
  itemType: string
  itemName: string
  reason: string
  urgency: "low" | "medium" | "high"
  status: RequestStatus
  requestDate: string
  responseDate?: string
  responseBy?: string
  responseNote?: string
  specifications?: { [key: string]: string }
}

type UserContextType = {
  user: UserType | null
  setUser: (user: UserType | null) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (
    userData: Omit<UserType, "id" | "profileImage"> & { password: string }
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  requests: RequestType[]
  addRequest: (
    request: Omit<RequestType, "id" | "userId" | "status" | "requestDate">
  ) => Promise<{ success: boolean; message?: string }>
  getRequestById: (id: string) => RequestType | undefined
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [requests, setRequests] = useState<RequestType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const userData = await authAPI.getProfile()
        setUser(userData)
        setIsAuthenticated(true)

        const userRequests = await requestsAPI.getUserRequests()
        setRequests(userRequests)
      } catch (error) {
        console.error("Failed to get user data", error)
        localStorage.removeItem("token")
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
debugger
    try {
      const response = await authAPI.login(email, password)

      localStorage.setItem("token", response.token)

      setUser(response.user)
      setIsAuthenticated(true)

      const userRequests = await requestsAPI.getUserRequests()
      setRequests(userRequests)

      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  const register = async (userData: Omit<UserType, "id" | "profileImage"> & { password: string }) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(userData.email, userData.password)

      localStorage.setItem("token", response.token)

      setUser(response.user)
      setIsAuthenticated(true)

      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")

    setUser(null)
    setIsAuthenticated(false)
    setRequests([])

    router.push("/user/login")
  }

  const addRequest = async (requestData: Omit<RequestType, "id" | "userId" | "status" | "requestDate">) => {
    if (!user) {
      return { success: false, message: "You must be logged in to make a request" }
    }

    setIsLoading(true)

    try {
      const newRequest = await requestsAPI.createRequest(requestData)

      setRequests((prev) => [...prev, newRequest])

      setIsLoading(false)
      return { success: true }
    } catch (error) {
      setIsLoading(false)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create request",
      }
    }
  }

  const getRequestById = (id: string) => {
    return requests.find((request) => request.id === id)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        register,
        logout,
        requests,
        addRequest,
        getRequestById,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
