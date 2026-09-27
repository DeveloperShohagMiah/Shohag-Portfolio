import { apiSlice } from "./apiSlice";

export const aboutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAbout: builder.query({
            query: () => "/about",
            providesTags: ["About"],
        }),
        updateAbout: builder.mutation({
            query: (data) => ({
                url: "/about",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["About"],
        }),
    }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;