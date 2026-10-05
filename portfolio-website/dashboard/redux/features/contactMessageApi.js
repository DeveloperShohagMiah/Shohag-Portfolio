import { apiSlice } from "./apiSlice";

export const contactMessagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMessages: builder.query({
            query: () => "/contact-messages",
            providesTags: ["ContactMessage"],
        }),
        updateMessageStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/contact-messages/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["ContactMessage"],
        }),
        replyToMessage: builder.mutation({
            query: ({ id, reply }) => ({
                url: `/contact-messages/${id}/reply`,
                method: "PATCH",
                body: { reply },
            }),
            invalidatesTags: ["ContactMessage"],
        }),
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `/contact-messages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContactMessage"],
        }),
    }),
});

export const {
    useGetAllMessagesQuery,
    useUpdateMessageStatusMutation,
    useReplyToMessageMutation,
    useDeleteMessageMutation,
} = contactMessagesApi;