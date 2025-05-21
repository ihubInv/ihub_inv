// import {
//   BaseQueryFn,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
// // import { toast } from "react-toastify";
// import { Mutex } from "async-mutex";
// // import { apiBaseUrl } from "../components/consts/ApiUriConst";
// import store from "../store";
// import { authenticationSlice } from "../store/slices/auth.slice";
// const mutex = new Mutex();
// const apiBaseUrl="http://localhost:5000"

// const baseUrl = `${apiBaseUrl}`;




// const baseQuery = fetchBaseQuery({
//   baseUrl,
//   prepareHeaders: (headers, { getState }) => {
//     // Try Redux state first, then fallback to localStorage
//     let token: string | null = (getState as typeof store.getState)().authentication?.token;
//     if (!token && typeof window !== "undefined") {
//       token = localStorage.getItem("token");
//     }
//     if (typeof token === 'string' && token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// export const fetchbase: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   debugger
//   // wait until the mutex is available without locking it
//   await mutex.waitForUnlock();

//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error && result.error.status === 401) {
//     // checking whether the mutex is locked
//     // localStorage.removeItem("authenticationToken");
//     localStorage.removeItem("token")
//     store.dispatch(authenticationSlice.actions.logout());
//     if (!mutex.isLocked()) {
//     } else {
//       // wait until the mutex is available without locking it
//       await mutex.waitForUnlock();
//       result = await baseQuery(args, api, extraOptions);
//     }
//   } else if (result.error && result.error.status) {
//     let msg = getFirstErrorFromObject(result.error.data);
//     if (!msg) {
//       msg = `Error ${result.error.status}: Unknown error`;
//     }
//     if (!(result.error.data instanceof Blob)) {
//       // toast.error(msg);
//       console.error(msg);
//     }
//     // Always return a consistent error object
//     return { error: msg, status: result.error.status };
//   }

//   return result;
// };
// function getFirstErrorFromObject(obj: any) {
//   if (obj?.detail) {
//     if (Array.isArray(obj.detail)) {
//       const eItem = obj.detail[0];
//       if (eItem) {
//         return `${eItem.msg}`;
//       }
//     } else if (obj.detail) {
//       return obj.detail.toString();
//     }
//   }
// }




import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import store from "../store";
import { authenticationSlice } from "../store/slices/auth.slice";
// import { useToaster } from "../context/use-toaster";

// Base URL
const apiBaseUrl = "http://localhost:5000";
const baseUrl = `${apiBaseUrl}`;

// Mutex to handle concurrent requests
const mutex = new Mutex();

// const { addNotification } = useToaster()


const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    let token: string | null = (getState as typeof store.getState)().authentication?.token;

    // Fallback to localStorage
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * Centralized Error Handling Function
 */
const handleError = (errorData: any, status: number) => {
  let errorMessage = "An unknown error occurred.";

  if (errorData) {
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail[0]?.msg || errorMessage;
      } else {
        errorMessage = errorData.detail.toString();
      }
    } else if (typeof errorData === "string") {
      errorMessage = errorData;
    }
  }

  console.error(`Error ${status}: ${errorMessage}`);
  // addNotification({
  //   message: `${errorMessage}`,
  //   type: "error",
  // })

  // Dispatch error notification without blocking UI
  setTimeout(() => {
    store.dispatch(authenticationSlice.actions.setError({ message: errorMessage, status }));
  }, 0);

  return { error: errorMessage, status };
};

/**
 * Enhanced BaseQuery with Mutex and Centralized Error Handling
 */
export const fetchbase: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock(); // Ensure mutex is available

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;

    if (status === 401) {
      localStorage.removeItem("token");
      store.dispatch(authenticationSlice.actions.logout());

      if (!mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    // Handle other errors centrally
    return handleError(data, status);
  }

  return result;
};



// import {
//   BaseQueryFn,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
//   BaseQueryApi,
//   FetchBaseQueryMeta,
// } from "@reduxjs/toolkit/query";
// import { Mutex } from "async-mutex";
// import store from "../store";
// import { authenticationSlice } from "../store/slices/auth.slice";
// // import { addNotificationExternal } from "../utils/toast-external";
// import { useToaster } from "../context/use-toaster";
// const apiBaseUrl = "http://localhost:5000";
// const baseUrl = `${apiBaseUrl}`;

// const mutex = new Mutex();
// const { addNotification } = useToaster()

// const baseQuery = fetchBaseQuery({
//   baseUrl,
//   prepareHeaders: (headers, { getState }) => {
//     let token: string | null = (getState as typeof store.getState)().authentication?.token;

//     if (!token && typeof window !== "undefined") {
//       token = localStorage.getItem("token");
//     }

//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }

//     return headers;
//   },
// });

// const handleError = (errorData: any, status: number) => {
//   let errorMessage = "An unknown error occurred.";

//   if (errorData) {
//     if (errorData.detail) {
//       if (Array.isArray(errorData.detail)) {
//         errorMessage = errorData.detail[0]?.msg || errorMessage;
//       } else {
//         errorMessage = errorData.detail.toString();
//       }
//     } else if (typeof errorData === "string") {
//       errorMessage = errorData;
//     }
//   }

//   console.error(`Error ${status}: ${errorMessage}`, errorData);

//   addNotification({
//     message: errorMessage,
//     type: "error",
//   });

//   store.dispatch(authenticationSlice.actions.setError({ message: errorMessage, status }));

//   // Return error in correct shape expected by RTK Query
//   return {
//     error: {
//       status,
//       data: errorData ?? errorMessage,
//     } as FetchBaseQueryError,
//   };
// };

// export const fetchbase: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   await mutex.waitForUnlock();

//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error) {
//     const { status, data } = result.error;

//     if (status === 401) {
//       localStorage.removeItem("token");
//       store.dispatch(authenticationSlice.actions.logout());

//       if (!mutex.isLocked()) {
//         await mutex.waitForUnlock();
//         result = await baseQuery(args, api, extraOptions);
//       }
//     }

//     return handleError(data, status as number);
//   }

//   return result;
// };
