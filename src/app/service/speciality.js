import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const specialityApi = createApi({
  reducerPath: "speciality",
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL,
    // Remove Content-Type for FormData, let browser set it
  }),
  endpoints: (builder) => ({

       getAllSpeciality: builder.query({
      query: () => `/api/speciality`,
    }),

    addASpeciality: builder.mutation({
      query: (formData) => ({
        url: `/api/speciality`,
        method: "POST",
        body: formData,
        // No headers for FormData - browser will set Content-Type automatically
      }),
    }),

    getASpeciality: builder.query({
      query: (id) => `/api/speciality/${id}`,
    }),

    updateASpeciality: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/speciality/${id}`,
        method: 'PUT',
        body: data,
        // No headers for FormData
      }),
    }),

    deleteASpeciality: builder.mutation({
      query: (id) => ({
        url: `/api/speciality/${id}`,
        method: 'DELETE'
      })
    })
  }),
});

export const {
  useAddASpecialityMutation,
  useDeleteASpecialityMutation,
  useGetASpecialityQuery,
  useGetAllSpecialityQuery,
  useUpdateASpecialityMutation
} = specialityApi;
