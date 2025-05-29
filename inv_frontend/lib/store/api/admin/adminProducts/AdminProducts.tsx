import { baseApi } from "../../base/baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Fetch all Productss
    getAdminProducts: builder.query<Products[], void>({
      query: () => {
        return {
          url: `/api/admin/products`,
        };
      },
    }),
    
    // Fetch Products by ID
    getAdminProductsById: builder.query<Products, string>({
      query: (queryArg) => {
        return {
          url: `/api/admin/products/${queryArg}`, // Use correct route for fetching by ID
        };
      },
    }),
    
    // Create a new Products
    createAdminProducts: builder.mutation<Products, Partial<Products>>({
      query: (Products) => {
        return {
          url: `/api/admin/products`,
          method: "POST",
          body: Products,
        };
      },
    }),
    
    // Update an Products by ID
    updateAdminProducts: builder.mutation<Products, { id: string; updates: Partial<Products> }>({
      query: (queryArg) => {
        return {
          url: `/api/admin/products/${queryArg.id}`, // Use correct route for updating
          method: "PUT",
          body: queryArg.updates,
        };
      },
    }),
    
    // Delete an Products by ID
    deleteAdminProductsById: builder.mutation<void, string>({
      query: (queryArg) => {
        return {
          url: `/api/admin/products/${queryArg}`,
          method: "DELETE",
        };
      },
    }),
    
    // Delete all Productss (if applicable)
    deleteAdminProducts: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/api/super-admin/products_delete`, // Use correct route for deleting all
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useGetAdminProductsByIdQuery,
  useCreateAdminProductsMutation,
  useUpdateAdminProductsMutation,
  useDeleteAdminProductsMutation,
  useDeleteAdminProductsByIdMutation,
} = userApi;



export interface Products {
  _id:any;              
  UniqueID: string;       
  ItemName: string;      
  // Make: string;      
  ModelNumber: string; 
  SerialNumber: string;
  Quantity: number;       
  IssuedTo: string;       
}
