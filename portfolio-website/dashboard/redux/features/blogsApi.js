import { apiSlice } from "./apiSlice";

export const blogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query({
            query: () => "/blogs",
            providesTags: ["Blog"],
        }),
        getBlogById: builder.query({
            query: (id) => `/blogs/${id}`,
            providesTags: (result, error, id) => [{ type: "Blog", id }],
        }),
        createBlog: builder.mutation({
            query: (data) => ({
                url: "/blogs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        updateBlog: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/blogs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
        togglePublishStatus: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}/toggle-publish`,
                method: "PATCH",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useGetAllBlogsQuery,
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useTogglePublishStatusMutation,
} = blogApi;