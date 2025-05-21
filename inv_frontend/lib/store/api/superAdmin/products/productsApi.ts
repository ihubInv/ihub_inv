import { baseApi } from "../../base/baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Fetch all assets
    getProducts: builder.query<Products[], void>({
      query: () => {
        return {
          url: `/api/assets`,
        };
      },
    }),
    
    // Fetch asset by ID
    getProductsById: builder.query<Products, string>({
      query: (queryArg) => {
        return {
          url: `/api/assets/${queryArg}`,
        };
      },
    }),
    
    // Create a new asset
    createProducts: builder.mutation<Products, Partial<Products>>({
      query: (Products) => {
        return {
          url: `/api/assets`,
          method: "POST",
          body: Products,
        };
      },
    }),

      // Create a new asset
      bulkUploadProducts: builder.mutation<Products, Partial<Products>>({
        query: (Products) => {
          return {
            url: `/api/assets/bulk-upload`,
            method: "POST",
            body: Products,
          };
        },
      }),
    
    // Update an asset by ID
    updateProducts: builder.mutation<Products, { id: string; updates: Partial<Products> }>({
      query: (queryArg) => {
        return {
          url: `/api/assets/${queryArg.id}`,
          method: "PUT",
          body: queryArg.updates,
        };
      },
    }),
    
    // Delete an asset by ID
    deleteProductsById: builder.mutation<void, string>({
      query: (queryArg) => {
        return {
          url: `/api/assets/${queryArg}`,
          method: "DELETE",
        };
      },
    }),
    
    // Delete all assets (if applicable)
    deleteProducts: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/api/assets_delete`, // Use correct route for deleting all if implemented
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useCreateProductsMutation,
  useBulkUploadProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useDeleteProductsByIdMutation,
} = userApi;

export interface Products {
  count?:number;
  data?:{
    _id:any;    
    sessionStartDate?: Date; // Date type for session start
    sessionEndDate?: Date;   // Date type for session end
    uniqueID?: string;       // Unique identifier
    purchaseDate?: Date;     // Date type for purchase
    invoiceNumber?: string;  // Invoice number
    assetName?: string;      // Asset name
    makeModel?: string;      // Make and model
    productSerialNumber?: string; // Product serial number
    vendorName?: string;     // Vendor's name
    quantity?: number;       // Quantity of Productss
    rateIncludingTaxes?: number; // Rate with taxes included
    similarName?: string;    // A similar or related name
    category?: any,
    issuedTo?: string;   

  }
  success?:boolean;
  total?:number;
           // Unique identifier
     // To whom the product is issued
}


