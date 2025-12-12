import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannersApi = createApi({
  reducerPath: "banners",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({


     getAllHospitalBanner: builder.query({
      query: (id) => `/api/ads`,
    }),

     addAHospitalBanner: builder.mutation({
      query: ({ hospitalId,  data }) => ({
        url: `/api/hospitals/ads/${hospitalId}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
         body:  data,
      }),
    }),


    updateAHospitalBanner: builder.mutation({
        query: ({ adId, hospitalId, updateAd }) => {
          return {
            url: `/api/hospitals/${hospitalId}/ads/${adId}`,
            method: 'PUT',
            body: updateAd,
          };
        },
      }),



       deleteAHospitalBanner: builder.mutation({
      query: ({ hospitalId,
      adId} ) => ({
        url: `/api/hospitals/${hospitalId}/ads/${adId}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      }),
    }),


  }),
});



export const {
   useAddAHospitalBannerMutation,
   useGetAllHospitalBannerQuery,
   useUpdateAHospitalBannerMutation,
   useDeleteAHospitalBannerMutation
  } =  bannersApi; 
  