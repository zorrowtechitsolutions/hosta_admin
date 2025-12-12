import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./service/user";
import { bloodApi } from "./service/blood";
import { ambulanceApi } from "./service/ambulance";
import { specialityApi } from "./service/speciality";
import { doctorsApi } from "./service/doctors";
import { hospetalApi } from "./service/hospital";
import { bookingApi } from "./service/bookings";
import { bannersApi } from "./service/banners";


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [bloodApi.reducerPath]: bloodApi.reducer,
    [ambulanceApi.reducerPath]: ambulanceApi.reducer,
    [specialityApi.reducerPath]: specialityApi.reducer,
    [doctorsApi.reducerPath]: doctorsApi.reducer,
    [hospetalApi.reducerPath]: hospetalApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
        [bannersApi.reducerPath]: bannersApi.reducer,


  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(bloodApi.middleware)
      .concat(ambulanceApi.middleware)
      .concat(specialityApi.middleware)
      .concat(doctorsApi.middleware)
      .concat(hospetalApi.middleware)
      .concat(bookingApi.middleware)
      .concat(bannersApi.middleware)
});

setupListeners(store.dispatch);
