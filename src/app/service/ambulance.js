import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ambulanceApi = createApi({
  reducerPath: "ambulance",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({

    //  Get all discussion (reading)

    getAllAmbulance: builder.query({
      query: () => "/api/ambulance",
    }),


    addNewAmbulance: builder.mutation({
      query: (newAmbulance) => ({
        url: `/api/ambulance/register`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newAmbulance,
      }),
    }),


        editAmbulance: builder.mutation({
        query: ({ id, formData}) => {
          // console.log(id, formData, "iii");
          
          return {
            url: `/api/ambulance/${id}`,
            method: 'PUT',
            body: formData,
          };
        },
      }),

      deleteAmbulance: builder.mutation({
        query: (id) => ({
            url: `/api/ambulance/${id}`,
            method: 'DELETE'
        })
    })



  }),
});

export const {
    useGetAllAmbulanceQuery, 
    useAddNewAmbulanceMutation,
    useEditAmbulanceMutation,
    useDeleteAmbulanceMutation,
  } =  ambulanceApi; 
  