import { baseApi } from "../base/baseApi";

export const usersApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
      }),
    }),
    // Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
    }),
    // Create user
    createUser: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    // Update user
    updateUser: builder.mutation<User, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    // Change user role
    changeUserRole: builder.mutation<User, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
    }),
    // Change user status (active/inactive)
    changeUserStatus: builder.mutation<User, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
} = usersApi;

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  department: string;
  position: string;
  joinDate: string;
  isActive: boolean;
} 