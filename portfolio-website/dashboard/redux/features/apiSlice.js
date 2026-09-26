import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        userRegistration: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data
            })
        }),

        userLogin: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            })
        }),

        userLogout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        })
    })
})

export const { useUserRegistrationMutation, useUserLoginMutation, useUserLogoutMutation } = apiSlice;