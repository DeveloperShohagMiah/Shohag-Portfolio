import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
});

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery,
    tagTypes: [
        "User",
        "Profile",
        "Project",
        "Service",
        "Skill",
        "Blog",
        "Faq",
        "Testimonial",
        "Message",
        "About",
    ],
    endpoints: () => ({}),
});

export default apiSlice;