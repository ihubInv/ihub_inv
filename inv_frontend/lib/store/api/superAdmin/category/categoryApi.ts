import { baseApi } from "../../base/baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Fetch all Categorys
    getCategory: builder.query<Category , undefined>({
      query: () => {
        return {
          url: `/api/categories`,
        };
      },
    }),
    
    // Fetch Category by ID
    getCategoryById: builder.query<Category, string>({
      query: (queryArg) => {
        return {
          url: `/api/categories/${queryArg}`, // Use correct route for fetching by ID
        };
      },
    }),
    
    // Create a new Category
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (Category) => {
        return {
          url: `/api/categories`,
          method: "POST",
          body: Category,
        };
      },
    }),
    
    // Update an Category by ID
    updateCategory: builder.mutation<Category, { id: string; updates: Partial<Category> }>({
      query: (queryArg) => {
        return {
          url: `/api/categories/${queryArg.id}`, // Use correct route for updating 
          method: "PUT",
          body: queryArg.updates,
        };
      },
    }),
  //   updateCategory: builder.mutation<Category, { id: string; updates: Partial<Category> }>({
  //   query: ({ id, updates }) => ({
  //     url: `/api//api/categories/${id}`, // ✅ PUT to category ID
  //     method: "PUT",
  //     body: updates,
  //   }),
  // }),
    // Delete an Category by ID
    deleteCategoryById: builder.mutation<void, string>({
      query: (queryArg) => {
        return {
          url: `/api/categories/${queryArg}`,
          method: "DELETE",
        };
      },
    }),
    
    // Delete all Categorys (if applicable)
    deleteCategory: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/api/categories`, // Use correct route for deleting all
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryByIdMutation,
} = userApi;



       
export type Category = Array<{
    _id: string;
    AssetName: string;
    // Make: string;
    // Model: string;
  }>;
