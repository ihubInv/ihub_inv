import { baseApi } from "../base/baseApi";
export const userApi = baseApi
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      getImages: builder.query<any, void>({
        query: () => {
          return {
            url: `/api/all_student_image`,
          };
        },
      }),
      getImageById: builder.query<any, void>({
        query: (queryArg) => {
          return {
            url: `/api/image_download/${queryArg}`,
          };
        },
      }),
      uploadImages: builder.mutation<any, any>({
        query: (item) => {
          return {
            url: `/api/imageUpload`,
            method: "POST",
            body: item,
          };
        },
      }),
      updateImage: builder.mutation<any, any>({
        query: (queryArg) => {
          return {
            url: `/api/update_student_image/${queryArg.id}`,
            method: "PUT",
            body: queryArg,
          };
        },
      }),
      deleteImageById: builder.mutation<any, any>({
        query: (queryArg) => {
          return {
            url: `/api/delete_student_image/${queryArg}`,
            method: "DELETE",
          };
        },
      }),
      deleteAllImage: builder.mutation<any, any>({
        query: () => {
          return {
            url: `/api/delete_all_student_images`,
            method: "DELETE",
          };
        },
      }),


    }),
  });

export const {
  useGetImagesQuery,
  useGetImageByIdQuery,
  useUploadImagesMutation,
  useUpdateImageMutation,
  useDeleteAllImageMutation,
  useDeleteImageByIdMutation,
} = userApi;



