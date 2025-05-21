// import { baseApi } from "../base/baseApi";

// export const usersApi = baseApi.injectEndpoints({
//   overrideExisting: false,
//   endpoints: (builder) => ({
//     // Get all users
//     getRequests: builder.query<User[], void>({
//       query: () => ({
//         url: "/api/requests/user",
//       }),
//     }),
//     getAllRequests: builder.query<User[], void>({
//         query: () => ({
//           url: "/api/requests",
//         }),
//       }),
//     // Get user by ID
//     getRequestById: builder.query<User, string>({
//       query: (id) => ({
//         url: `/api/requests/${id}`,
//       }),
//     }),
//     // Create user
//     createRequest: builder.mutation<User, Partial<User>>({
//       query: (user) => ({
//         url: "/api/requests",
//         method: "POST",
//         body: user,
//       }),
//     }),
//     // Update user
//     updateRequest: builder.mutation<User, { id: string; updates: Partial<User> }>({
//       query: ({ id, updates }) => ({
//         url: `/api/requests/${id}`,
//         method: "PUT",
//         body: updates,
//       }),
//     }),
//     // Delete user
//     deleteRequest: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/api/requests/${id}`,
//         method: "DELETE",
//       }),
//     }),
//     // Change user role
//     // changeUserRole: builder.mutation<User, { id: string; role: string }>({
//     //   query: ({ id, role }) => ({
//     //     url: `/users/${id}/role`,
//     //     method: "PUT",
//     //     body: { role },
//     //   }),
//     // }),
//     // Change user status (active/inactive)
//     changeRequestStatus: builder.mutation<User, { id: string; isActive: boolean }>({
//       query: ({ id, isActive }) => ({
//         url: `/api/requests/${id}/status`,
//         method: "PUT",
//         body: { isActive },
//       }),
//     }),
//   }),
// });

// export const {
//   useGetRequestsQuery,
//   useGetAllRequestsQuery,
//   useGetRequestByIdQuery,
//   useCreateRequestMutation,
//   useUpdateRequestMutation,
//   useDeleteRequestMutation,
//   useChangeRequestStatusMutation,

//   // useChangeUserRoleMutation,
//   // useChangeUserStatusMutation,
// } = usersApi;

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "user" | "admin" | "superadmin";
//   department: string;
//   position: string;
//   joinDate: string;
//   isActive: boolean;
// } 







import { baseApi } from "../base/baseApi";
import { User } from "./usersApi";

export const usersApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ✅ Get all requests made by the logged-in user
    getRequests: builder.query<User[], void>({
      query: () => ({
        url: "/api/requests/user",
      }),
    }),
    getAllRequests: builder.query<User[], void>({
        query: () => ({
          url: "/api/requests",
        }),
      }),

    // ✅ Get request by ID
    getRequestById: builder.query<Request, string>({
      query: (id) => ({
        url: `/api/requests/${id}`,
      }),
    }),

    // ✅ Create new request
    createRequest: builder.mutation<Request, Partial<Request>>({
      query: (req) => ({
        url: "/api/requests",
        method: "POST",
        body: req,
      }),
    }),

    // ✅ Update a request (admin only)
    updateRequest: builder.mutation<Request, { id: string; updates: Partial<Request> }>({
      query: ({ id, updates }) => ({
        url: `/api/requests/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),

    // ✅ Delete request (admin only)
    deleteRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/requests/${id}`,
        method: "DELETE",
      }),
    }),

    // ✅ Approve request (admin only)
    // approveRequest: builder.mutation<Request, string>({
    //   query: (id) => ({
    //     url: `/api/request/${id}/approve`,
    //     method: "PUT",
    //   }),
    // }),

    approveRequest: builder.mutation<Request, { id: string; body: any }>({
        query: ({ id, body }) => ({
          url: `/api/requests/${id}/approve`,
          method: "PUT",
          body,
        }),
      }),

      rejectRequest: builder.mutation<Request, { id: string; body: any }>({
        query: ({ id, body }) => ({
          url: `/api/requests/${id}/reject`,
          method: "PUT",
          body,
        }),
      }),
      

    // // ✅ Reject request (admin only)
    // rejectRequest: builder.mutation<Request, string>({
    //   query: (id) => ({
    //     url: `/api/requests/${id}/reject`,
    //     method: "PUT",
    //   }),
    // }),

    // ✅ Get request stats (admin only)
    getRequestStats: builder.query<any, void>({
      query: () => ({
        url: `/api/requests/stats`,
      }),
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetAllRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
  useGetRequestStatsQuery,
} = usersApi;

// ✅ Request Type (not User!)
export interface Request {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Add any other fields relevant to your schema
}
