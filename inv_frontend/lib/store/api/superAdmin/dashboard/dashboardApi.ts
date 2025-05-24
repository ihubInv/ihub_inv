import { baseApi } from "../../base/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/summary" }),
    }),
    getMonthlyAssets: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/monthly-assets" }),
    }),
    getAssetAllocation: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/asset-allocation" }),
    }),
    getAssetCategoryDistribution: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/asset-category-distribution" }),
    }),
    getRecentTransactions: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/recent-transactions" }),
    }),
    getCategoryBreakdown: builder.query<any, void>({
      query: () => ({ url: "/api/dashboard/category-breakdown" }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetMonthlyAssetsQuery,
  useGetAssetAllocationQuery,
  useGetAssetCategoryDistributionQuery,
  useGetRecentTransactionsQuery,
  useGetCategoryBreakdownQuery,
} = dashboardApi; 





// import { baseApi } from "../../base/baseApi";

// export const dashboardApi = baseApi.injectEndpoints({
//   overrideExisting: false,
//   endpoints: (builder) => ({
//     getDashboardSummary: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/summary"
//         };
//       },
//     }),
//     getMonthlyAssets: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/monthly-assets"
//         };
//       },
//     }),
//     getAssetAllocation: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/asset-allocation"
//         };
//       },
//     }),
//     getAssetCategoryDistribution: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/asset-category-distribution"
//         };
//       },
//     }),
//     getRecentTransactions: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/recent-transactions"
//         };
//       },
//     }),
//     getCategoryBreakdown: builder.query<any, void>({
//       query: () => {
//         return {
//           url: "/api/dashboard/category-breakdown"
//         };
//       },


//     }),
//   }),
// });

// export const {
//   useGetDashboardSummaryQuery,
//   useGetMonthlyAssetsQuery,
//   useGetAssetAllocationQuery,
//   useGetAssetCategoryDistributionQuery,
//   useGetRecentTransactionsQuery,
//   useGetCategoryBreakdownQuery,
// } = dashboardApi;
