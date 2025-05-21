// import { baseApi } from "../base/baseApi";
// import { Products } from "../superAdmin/products/productsApi";
// export const authApi = baseApi.injectEndpoints({
//   overrideExisting: false,
//   endpoints: (build) => ({
//     getSignup: build.query<SignupItem[], void>({
//       query: () => {
//         return {
//           url: `/api/auth/signup`,
//         };
//       },
//     }),

//     postSignup: build.mutation<SignupItem, any>({
//       query: (item) => {
//         return {
//           url: `/api/auth/register`,
//           method: "POST",
//           body: item,
//         };
//       },
//     }),
//     getLogin: build.query<AuthMeReadableCollectionResponse, null | undefined>({
//       query: () => {
//         return {
//           url: `/api/auth/me`,
//         };
//       },
//     }),
//     getLoginById: build.query<IAuthMe[], any>({
//       query: (queryArg) => {
//         return {
//           url: `/api/login/${queryArg}`,
//         };
//       },
//     }),
//     postLogin: build.mutation<AuthLoginApiResponse, any>({
      
//       query: (item) => {
//         return {
//           url: `/api/auth/login`,
//           method: "POST",
//           body: item,
//         };
//       },
//     }),
//     forgetPassword: build.mutation<forgetApiResponse, any>({
//       query: (item) => {
//         return {
//           url: `/api/forgot-password`,
//           method: "POST",
//           body: item,
//         };
//       },
//     }),
//     verifyingOTP: build.mutation<sendOtpApiResponse, any>({
//       query: (item) => {
//         return {
//           url: `/api/verifying-otp`,
//           method: "POST",
//           body: item,
//         };
//       },
//     }),
//     resetPassword: build.mutation<resetApiResponse, any>({
//       query: (item) => {
//         return {
//           url: `/api/reset-password`,
//           method: "POST",
//           body: item,
//         };
//       },
//     }),
//   }),
// });

// export const {
//   useGetSignupQuery,
//   useLazyGetLoginQuery,
//   usePostSignupMutation,
//   useGetLoginQuery,
//   usePostLoginMutation,
//   useForgetPasswordMutation,
//   useVerifyingOTPMutation,
//   useResetPasswordMutation,
// } = authApi;


// export interface SignupItem {
//   name: string; // User's name
//   email: string; // User's email
//   password: string; // User's password
//   role: 'admin' | 'superadmin'; // User's role, restricted to 'admin' or 'superadmin'
// }
// export interface IAuthMe {
//   email?: string;
//   password?: string;
//   name?: string;
//   token: AuthLoginApiResponse;
// }

// export type AuthLoginApiResponse = {
//   token: string;
//   user:Products
// };
// export type forgetApiResponse = {
//   email?: string;
//   status?: boolean;
//   expires_In?:any
// };
// export type resetApiResponse = {
//   password: string;
//   confirm_Password: string;
// };
// export type AuthMeReadableCollectionResponse = IAuthMe;
// export type AuthTag = string;
// export type sendOtpApiResponse = {
//   email: string;
// };














// // import { IAuthMe } from "../../../components/state-models";

// // /**
// //  * Types
// //  */

// // export type AuthTag = string;
// // export type AuthMeReadableCollectionResponse = IAuthMe;

// // export type AuthForgotPasswordRequest = {
// //   username: string;
// // };

// // export type AuthResetPasswordRequest = {
// //   token: string;
// //   password: string;
// // };

// // export type UpdateUserProfileApiResponse = UpdateUserProfile;
// // export type AuthLoginApiResponse = {
// //   token: string;
// //   user: {
// //     address: any;
// //     bankInformation: any;
// //     birthday: any;
// //     dateOfJoining: any;
// //     designation: any;
// //     _id: any;
// //     firstName: any;
// //     gender: any;
// //     lastName: any;
// //     userName: any;
// //     emergencyContact: any;
// //     employeeId: any;
// //     experience: any;
// //     personalInformation: any;
// //     role: any;
// //   };
// // };

// // export type AuthResetPasswordApiResponse = {
// //   detail: string;
// // };

// // export type UpdateUserProfile = {
// //   id: string;
// //   first_name?: string;
// //   last_name?: string;
// //   email: string;
// //   username: string;
// // };

// // export type UpdateUserProfileForm = {
// //   first_name?: string;
// //   last_name?: string;
// //   email: string;
// // };

// // export type UpdateUserProfileApiArg = {
// //   user_id: string;
// //   updateUserProfile: UpdateUserProfileForm;
// // };

// // export type ChangePasswordApiArg = {
// //   old_password: string;
// //   new_password: string;
// //   confirm_password: string;
// // };

// // export type AuthRegisterApiArg = {
// //   email: string;
// //   password: {
// //     password: string;
// //     confirm_password: string;
// //   };
// // };

// // export interface AuthRegisterApiResponse extends AuthRegisterApiArg {
// //   id: number;
// //   status: number;
// //   listed: boolean;
// // }

// // export type ChangePasswordApiResponse = string & { detail: string };






import { baseApi } from "../base/baseApi";
import { Products } from "../superAdmin/products/productsApi";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    // Unified register (handles user, admin, superadmin based on keys)
    postSignup: build.mutation<SignupItem, any>({
      query: (item) => ({
        url: `/api/auth/register`,
        method: "POST",
        body: item,
      }),
    }),

    // Login
    postLogin: build.mutation<AuthLoginApiResponse, any>({
      query: (item) => ({
        url: `/api/auth/login`,
        method: "POST",
        body: item,
      }),
    }),

    // Get logged-in user info
    getLogin: build.query<AuthMeReadableCollectionResponse, null | undefined>({
      query: () => ({
        url: `/api/auth/me`,
      }),
    }),

    // Optionally get user by ID (if required by feature)
    getLoginById: build.query<IAuthMe[], any>({
      query: (queryArg) => ({
        url: `/api/login/${queryArg}`,
      }),
    }),

    // Password reset flow
    forgetPassword: build.mutation<forgetApiResponse, any>({
      query: (item) => ({
        url: `/api/forgot-password`,
        method: "POST",
        body: item,
      }),
    }),

    verifyingOTP: build.mutation<sendOtpApiResponse, any>({
      query: (item) => ({
        url: `/api/verifying-otp`,
        method: "POST",
        body: item,
      }),
    }),

    resetPassword: build.mutation<resetApiResponse, any>({
      query: (item) => ({
        url: `/api/reset-password`,
        method: "POST",
        body: item,
      }),
    }),
  }),
});

export const {
  usePostSignupMutation,
  usePostLoginMutation,
  useGetLoginQuery,
  useLazyGetLoginQuery,
  useGetLoginByIdQuery,
  useForgetPasswordMutation,
  useVerifyingOTPMutation,
  useResetPasswordMutation,
} = authApi;

// Type interfaces
export interface SignupItem {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "superadmin"; // Optional for frontend clarity (used with keys)
  adminKey?: string;
  superAdminKey?: string;
  masterKey?: string;
}

export interface IAuthMe {
  email?: string;
  password?: string;
  name?: string;
  token: AuthLoginApiResponse;
}

export type AuthLoginApiResponse = {
  token: string;
  user: Products;
};

export type forgetApiResponse = {
  email?: string;
  status?: boolean;
  expires_In?: any;
};

export type resetApiResponse = {
  password: string;
  confirm_Password: string;
};

export type AuthMeReadableCollectionResponse = IAuthMe;
export type AuthTag = string;
export type sendOtpApiResponse = {
  email: string;
};
