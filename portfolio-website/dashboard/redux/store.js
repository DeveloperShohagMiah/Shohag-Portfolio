import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/apiSlice";

import { authApi } from "./features/authApi";
import { aboutApi } from "./features/aboutApi"
import { servicesApi } from "./features/serviceApi";
import { skillsApi } from "./features/skillApi";
import { projectsApi } from "./features/projectApi";
import { blogApi } from "./features/blogsApi";
import { profileApi } from "./features/profileApi";
import { contactMessagesApi } from "./features/contactMessageApi";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)

})