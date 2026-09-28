import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apiSlice";

import { authApi } from "./features/authApi";
import { aboutApi } from "./features/aboutApi"
import { servicesApi } from "./features/serviceApi";
import { skillsApi } from "./features/skillApi";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)

})