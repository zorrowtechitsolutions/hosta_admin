import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bloodApi = createApi({
  reducerPath: "blood",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({

    //  Get all discussion (reading)

    getAllBlood: builder.query({
      query: () => "/api/donors",
    }),



  }),
});

export const {
    useGetAllBloodQuery, 
  } =  bloodApi; 
  