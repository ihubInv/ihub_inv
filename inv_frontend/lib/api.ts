// // // API service for making requests to the backend

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// // // Helper function for making API requests
// // async function fetchAPI(endpoint: string, options: RequestInit = {}) {
// //   const url = `${API_URL}${endpoint}`

// //   // Get token from localStorage if available
// //   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

// //   // Set default headers
// //   const headers = {
// //     "Content-Type": "application/json",
// //     ...(token && { "x-auth-token": token }),
// //     ...options.headers,
// //   }

// //   const response = await fetch(url, {
// //     ...options,
// //     headers,
// //   })

// //   // Handle non-JSON responses
// //   const contentType = response.headers.get("content-type")
// //   if (contentType && contentType.indexOf("application/json") !== -1) {
// //     const data = await response.json()

// //     // If response is not ok, throw error with message from server
// //     if (!response.ok) {
// //       throw new Error(data.message || "Something went wrong")
// //     }

// //     return data
// //   }

// //   // For non-JSON responses
// //   if (!response.ok) {
// //     throw new Error("Something went wrong")
// //   }

// //   return await response.text()
// // }

// // // Auth API
// // export const authAPI = {
// //   login: async (email: string, password: string) => {
// //     return fetchAPI("/users/login", {
// //       method: "POST",
// //       body: JSON.stringify({ email, password }),
// //     })
// //   },

// //   register: async (userData: any) => {
// //     return fetchAPI("/users/register", {
// //       method: "POST",
// //       body: JSON.stringify(userData),
// //     })
// //   },

// //   registerAdmin: async (userData: any) => {
// //     return fetchAPI("/auth/register-admin", {
// //       method: "POST",
// //       body: JSON.stringify(userData),
// //     })
// //   },

// //   registerSuperAdmin: async (userData: any) => {
// //     return fetchAPI("/auth/register-superadmin", {
// //       method: "POST",
// //       body: JSON.stringify(userData),
// //     })
// //   },

// //   getProfile: async () => {
// //     return fetchAPI("/users/me")
// //   },

// //   updateProfile: async (profileData: any) => {
// //     return fetchAPI("/users/profile", {
// //       method: "PUT",
// //       body: JSON.stringify(profileData),
// //     })
// //   },
// // }

// // // Users API
// // export const usersAPI = {
// //   getUsers: async (params: any = {}) => {
// //     const queryParams = new URLSearchParams()

// //     // Add all params to query string
// //     Object.entries(params).forEach(([key, value]) => {
// //       if (value !== undefined && value !== null) {
// //         queryParams.append(key, String(value))
// //       }
// //     })

// //     const queryString = queryParams.toString()
// //     return fetchAPI(`/users${queryString ? `?${queryString}` : ""}`)
// //   },

// //   getUser: async (userId: string) => {
// //     return fetchAPI(`/users/${userId}`)
// //   },

// //   updateUser: async (userId: string, userData: any) => {
// //     return fetchAPI(`/users/${userId}`, {
// //       method: "PUT",
// //       body: JSON.stringify(userData),
// //     })
// //   },

// //   deleteUser: async (userId: string) => {
// //     return fetchAPI(`/users/${userId}`, {
// //       method: "DELETE",
// //     })
// //   },

// //   changeUserRole: async (userId: string, role: string) => {
// //     return fetchAPI(`/users/${userId}/role`, {
// //       method: "PUT",
// //       body: JSON.stringify({ role }),
// //     })
// //   },

// //   changeUserStatus: async (userId: string, isActive: boolean) => {
// //     return fetchAPI(`/users/${userId}/status`, {
// //       method: "PUT",
// //       body: JSON.stringify({ isActive }),
// //     })
// //   },
// // }

// // // Requests API
// // export const requestsAPI = {
// //   createRequest: async (requestData: any) => {
// //     return fetchAPI("/requests", {
// //       method: "POST",
// //       body: JSON.stringify(requestData),
// //     })
// //   },

// //   getUserRequests: async (params: any = {}) => {
// //     const queryParams = new URLSearchParams()

// //     // Add all params to query string
// //     Object.entries(params).forEach(([key, value]) => {
// //       if (value !== undefined && value !== null) {
// //         queryParams.append(key, String(value))
// //       }
// //     })

// //     const queryString = queryParams.toString()
// //     return fetchAPI(`/requests/user${queryString ? `?${queryString}` : ""}`)
// //   },

// //   getAllRequests: async (params: any = {}) => {
// //     const queryParams = new URLSearchParams()

// //     // Add all params to query string
// //     Object.entries(params).forEach(([key, value]) => {
// //       if (value !== undefined && value !== null) {
// //         queryParams.append(key, String(value))
// //       }
// //     })

// //     const queryString = queryParams.toString()
// //     return fetchAPI(`/requests${queryString ? `?${queryString}` : ""}`)
// //   },

// //   getRequest: async (requestId: string) => {
// //     return fetchAPI(`/requests/${requestId}`)
// //   },

// //   approveRequest: async (requestId: string, approvalData: any) => {
// //     return fetchAPI(`/requests/${requestId}/approve`, {
// //       method: "PUT",
// //       body: JSON.stringify(approvalData),
// //     })
// //   },

// //   rejectRequest: async (requestId: string, rejectionData: any) => {
// //     return fetchAPI(`/requests/${requestId}/reject`, {
// //       method: "PUT",
// //       body: JSON.stringify(rejectionData),
// //     })
// //   },

// //   deleteRequest: async (requestId: string) => {
// //     return fetchAPI(`/requests/${requestId}`, {
// //       method: "DELETE",
// //     })
// //   },

// //   getRequestStats: async () => {
// //     return fetchAPI("/requests/stats")
// //   },
// // }

// // // Assets API
// // export const assetsAPI = {
// //   createAsset: async (assetData: any) => {
// //     return fetchAPI("/assets", {
// //       method: "POST",
// //       body: JSON.stringify(assetData),
// //     })
// //   },

// //   getAssets: async (params: any = {}) => {
// //     const queryParams = new URLSearchParams()

// //     // Add all params to query string
// //     Object.entries(params).forEach(([key, value]) => {
// //       if (value !== undefined && value !== null) {
// //         queryParams.append(key, String(value))
// //       }
// //     })

// //     const queryString = queryParams.toString()
// //     return fetchAPI(`/assets${queryString ? `?${queryString}` : ""}`)
// //   },

// //   getAsset: async (assetId: string) => {
// //     return fetchAPI(`/assets/${assetId}`)
// //   },

// //   updateAsset: async (assetId: string, assetData: any) => {
// //     return fetchAPI(`/assets/${assetId}`, {
// //       method: "PUT",
// //       body: JSON.stringify(assetData),
// //     })
// //   },

// //   deleteAsset: async (assetId: string) => {
// //     return fetchAPI(`/assets/${assetId}`, {
// //       method: "DELETE",
// //     })
// //   },

// //   assignAsset: async (assetId: string, userId: string) => {
// //     return fetchAPI(`/assets/${assetId}/assign`, {
// //       method: "PUT",
// //       body: JSON.stringify({ userId }),
// //     })
// //   },

// //   unassignAsset: async (assetId: string) => {
// //     return fetchAPI(`/assets/${assetId}/unassign`, {
// //       method: "PUT",
// //     })
// //   },

// //   getAssetStats: async () => {
// //     return fetchAPI("/assets/stats")
// //   },
// // }

// // // Categories API
// // export const categoriesAPI = {
// //   getCategories: async () => {
// //     return fetchAPI("/categories")
// //   },

// //   createCategory: async (categoryData: any) => {
// //     return fetchAPI("/categories", {
// //       method: "POST",
// //       body: JSON.stringify(categoryData),
// //     })
// //   },

// //   updateCategory: async (categoryId: string, categoryData: any) => {
// //     return fetchAPI(`/categories/${categoryId}`, {
// //       method: "PUT",
// //       body: JSON.stringify(categoryData),
// //     })
// //   },

// //   deleteCategory: async (categoryId: string) => {
// //     return fetchAPI(`/categories/${categoryId}`, {
// //       method: "DELETE",
// //     })
// //   },
// // }





// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// // Helper function for making API requests with error handling & token management



// // async function fetchAPI(endpoint: string, options: RequestInit = {}) {
// //   debugger
// //   const url = `${API_URL}${endpoint}`;

// //   // Retrieve token from localStorage
// //   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// //   // Set default headers
// //   const headers: HeadersInit = {
// //     "Content-Type": "application/json",
// //     ...(token ? { Authorization: `Bearer ${token}` } : {}), // Attach token if available
// //     ...options.headers,
// //   };

// //   try {
// //     const response = await fetch(url, { ...options, headers });

// //     // Handle unauthorized access (token expired)
// //     if (response.status === 401) {
// //       console.warn("Unauthorized request. Redirecting to login...");
// //       localStorage.removeItem("token");
// //       window.location.href = "/login";
// //       throw new Error("Session expired. Please log in again.");
// //     }

// //     // Check response type
// //     const contentType = response.headers.get("content-type");

// //     if (contentType?.includes("application/json")) {
// //       const data = await response.json();

// //       if (!response.ok) {
// //         console.error("API Error:", data);
// //         throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
// //       }
// //       return data;
// //     }

// //     if (!response.ok) {
// //       console.error("Non-JSON API Error:", response);
// //       throw new Error(`Error ${response.status}: ${response.statusText}`);
// //     }

// //     return await response.text();
// //   } catch (error: unknown) {
// //     console.error("Fetch Error:", error);
// //     if (error instanceof Error) {
// //       throw new Error(error.message);
// //     }
// //     throw new Error("An unexpected error occurred while making the request.");
// //   }
// // }



// // async function fetchAPI(endpoint: string, options: RequestInit = {}) {
// //   debugger;
// //   const url = `${API_URL}${endpoint}`;

// //   // Retrieve token from localStorage
// //   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

// //   // Set default headers
// //   const headers: HeadersInit = {
// //     "Content-Type": "application/json",
// //     ...(token ? { Authorization: `Bearer ${token}` } : {}), // Attach token if available
// //     ...options.headers,
// //   };

// //   try {
// //     const response = await fetch(url, { ...options, headers });

// //     console.log("🔍 API Response:", response);
// //     console.log("📡 Status:", response.status);
// //     console.log("📝 Headers:", response.headers);

// //     // Handle Unauthorized Access (Token Expired)
// //     if (response.status === 401) {
// //       console.warn("⚠️ Unauthorized request. Redirecting to login...");
// //       localStorage.removeItem("token");
// //       window.location.href = "/login";
// //       throw new Error("Session expired. Please log in again.");
// //     }

// //     // Handle No Content Response (204)
// //     if (response.status === 204) {
// //       console.warn("ℹ️ No Content Received (204)");
// //       return null;
// //     }

// //     // Get Content-Type
// //     const contentType = response.headers.get("content-type");

// //     if (contentType?.includes("application/json")) {
// //       const data = await response.json();

// //       if (!response.ok) {
// //         console.error("❌ API Error:", data);
// //         throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
// //       }
// //       return data;
// //     }

// //     // Handle Non-JSON Responses
// //     const textData = await response.text();
// //     if (!response.ok) {
// //       console.error("❌ API Error (Non-JSON):", textData);
// //       throw new Error(`Error ${response.status}: ${response.statusText} - ${textData}`);
// //     }

// //     return textData;
// //   } catch (error: unknown) {
// //     console.error("🚨 Fetch Error:", error);
    
// //     if (error instanceof Error) {
// //       throw new Error(`Fetch API Error: ${error.message}`);
// //     }
    
// //     throw new Error("An unexpected error occurred while making the request.");
// //   }
// // }
// async function fetchAPI(endpoint: string, options: RequestInit = {}) {
//   debugger
//   const url = `${API_URL}${endpoint}`;

//   // Retrieve token from localStorage safely
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Set default headers (Explicitly typed as Record<string, string>)
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...options.headers as Record<string, string>, // Ensures headers remain string-based
//   };

//   // Attach token only if it exists
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   try {
//     const response = await fetch(url, { ...options, headers });

//     console.log("🔍 API Response:", response);
//     console.log("📡 Status:", response.status);
//     console.log("📝 Headers:", response.headers);

//     // Handle Unauthorized Access (Token Expired)
//     if (response.status === 401) {
//       console.warn("⚠️ Unauthorized request detected.");

//       // Instead of redirecting immediately, return an error status
//       return { error: "unauthorized", status: 401 };
//     }

//     // Handle No Content Response (204)
//     if (response.status === 204) {
//       console.warn("ℹ️ No Content Received (204)");
//       return null;
//     }

//     // Get Content-Type
//     const contentType = response.headers.get("content-type");

//     if (contentType?.includes("application/json")) {
//       const data = await response.json();

//       if (!response.ok) {
//         console.error("❌ API Error:", data);
//         return { error: data.message || `Error ${response.status}: ${response.statusText}`, status: response.status };
//       }
//       return data;
//     }

//     // Handle Non-JSON Responses
//     const textData = await response.text();
//     if (!response.ok) {
//       console.error("❌ API Error (Non-JSON):", textData);
//       return { error: `Error ${response.status}: ${response.statusText} - ${textData}`, status: response.status };
//     }

//     return textData;
//   } catch (error: unknown) {
//     console.error("🚨 Fetch Error:", error);

//     if (error instanceof Error) {
//       return { error: `Fetch API Error: ${error.message}`, status: 500 };
//     }

//     return { error: "An unexpected error occurred while making the request.", status: 500 };
//   }
// }

// // --- AUTH API ---
// export const authAPI = {
//   login: async (email: string, password: string) => {
//     debugger
//     const data = await fetchAPI(`${API_URL}/users/login`, {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     // Store token after successful login
//     if (data.token) {
//       localStorage.setItem("token", data.token);
//     }

//     return data;
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   },

//   getProfile: async () => fetchAPI("/api/users/me"),
//   updateProfile: async (profileData: any) =>
//     fetchAPI("/users/profile", {
//       method: "PUT",
//       body: JSON.stringify(profileData),
//     }),
// };

// // --- USERS API ---
// export const usersAPI = {
//   getUsers: async (params: any = {}) => {
//     const queryParams = new URLSearchParams(params).toString();
//     return fetchAPI(`/users${queryParams ? `?${queryParams}` : ""}`);
//   },

//   getUser: async (userId: string) => fetchAPI(`/users/${userId}`),

//   updateUser: async (userId: string, userData: any) =>
//     fetchAPI(`/users/${userId}`, {
//       method: "PUT",
//       body: JSON.stringify(userData),
//     }),

//   deleteUser: async (userId: string) =>
//     fetchAPI(`/users/${userId}`, { method: "DELETE" }),
// };

// // --- REQUESTS API ---
export const requestsAPI = {
  createRequest: async (requestData: any) =>
    fetchAPI("/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),

  getUserRequests: async (params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchAPI(`/api/requests/user${queryParams ? `?${queryParams}` : ""}`);
  },

  getAllRequests: async (params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchAPI(`/requests${queryParams ? `?${queryParams}` : ""}`);
  },

  getRequest: async (requestId: string) => fetchAPI(`/requests/${requestId}`),

  approveRequest: async (requestId: string, approvalData: any) =>
    fetchAPI(`/requests/${requestId}/approve`, {
      method: "PUT",
      body: JSON.stringify(approvalData),
    }),

  rejectRequest: async (requestId: string, rejectionData: any) =>
    fetchAPI(`/requests/${requestId}/reject`, {
      method: "PUT",
      body: JSON.stringify(rejectionData),
    }),

  deleteRequest: async (requestId: string) =>
    fetchAPI(`/requests/${requestId}`, { method: "DELETE" }),
};

// // --- ASSETS API ---
// export const assetsAPI = {
//   createAsset: async (assetData: any) =>
//     fetchAPI("/assets", {
//       method: "POST",
//       body: JSON.stringify(assetData),
//     }),

//   getAssets: async (params: any = {}) => {
//     const queryParams = new URLSearchParams(params).toString();
//     return fetchAPI(`/assets${queryParams ? `?${queryParams}` : ""}`);
//   },

//   getAsset: async (assetId: string) => fetchAPI(`/assets/${assetId}`),

//   updateAsset: async (assetId: string, assetData: any) =>
//     fetchAPI(`/assets/${assetId}`, {
//       method: "PUT",
//       body: JSON.stringify(assetData),
//     }),

//   deleteAsset: async (assetId: string) =>
//     fetchAPI(`/assets/${assetId}`, { method: "DELETE" }),
// };

// // --- CATEGORIES API ---
// export const categoriesAPI = {
//   getCategories: async () => fetchAPI("/categories"),

//   createCategory: async (categoryData: any) =>
//     fetchAPI("/categories", {
//       method: "POST",
//       body: JSON.stringify(categoryData),
//     }),

//   updateCategory: async (categoryId: string, categoryData: any) =>
//     fetchAPI(`/categories/${categoryId}`, {
//       method: "PUT",
//       body: JSON.stringify(categoryData),
//     }),

//   deleteCategory: async (categoryId: string) =>
//     fetchAPI(`/categories/${categoryId}`, { method: "DELETE" }),
// };
