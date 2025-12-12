


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hospetalApi = createApi({
  reducerPath: "hospital",
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL,
    // Remove Content-Type for FormData, let browser set it
  }),
  endpoints: (builder) => ({
    getAllHospital: builder.query({
      query: () => "/api/hospital",
    }),



  addAHospital: builder.mutation({
  query: ({ data }) => {
    console.log("Hospital Data:", data);   // 👈 Log here
    return {
      url: `/api/hospital/registration`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    };
  },
}),



    getAHospital: builder.query({
      query: (id) => `/api/hospital/${id}`,
    }),

    // updateAHospital: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `/api/hospital/${id}`,
    //     method: 'PUT',
    //     body: data,
    //     // No headers for FormData
    //   }),
    // }),


    updateAHospital: builder.mutation({
  query: ({ id, data }) => {
    const isForm = data instanceof FormData;

    return {
      url: `/api/hospital/details/${id}`,
      method: "PUT",
      body: isForm ? data : data,
      headers: isForm
        ? {} 
        : {
            "Content-Type": "application/json",
          },
    };
  },
}),


    deleteAHospital: builder.mutation({
      query: (id) => ({
        url: `/api/hospital/${id}`,
        method: 'DELETE'
      }),

    }),


recoveryAHospital: builder.mutation({
      query: (id) => ({
        url: `/api/hospital/${id}/recovery`,
        method: 'PUT'
      })
  })


  }),
});

export const {
   useAddAHospitalMutation,
   useDeleteAHospitalMutation,
   useGetAHospitalQuery,
   useGetAllHospitalQuery,
   useRecoveryAHospitalMutation,
   useUpdateAHospitalMutation
} = hospetalApi;