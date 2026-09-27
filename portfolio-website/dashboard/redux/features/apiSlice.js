import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
});
export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery,
    tagTypes: ["User", "Serivce"],
    endpoints: () => ({
    })
})

export default apiSlice;