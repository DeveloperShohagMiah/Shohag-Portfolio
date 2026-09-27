import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiSlice from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({

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
                body: data,

            }),
            invalidatesTags: ["User"]
        }),

        userLogout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                invalid
            }),

            invalidatesTags: ["User"],
        }),

        userProfile: builder.query({
            query: () => ({
                url: "/auth/profile",
                method: "GET"
            }),
            providesTags: ["User"]
        })
    })
})

export const { useUserRegistrationMutation, useUserLoginMutation, useUserLogoutMutation, useUserProfileQuery } = authApi;