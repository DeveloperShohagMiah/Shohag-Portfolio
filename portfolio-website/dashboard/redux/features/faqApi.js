import apiSlice from "./apiSlice";

export const faqApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // =========================
        // Create FAQ
        // =========================
        addFaq: builder.mutation({
            query: (data) => ({
                url: "/faqs",
                method: "POST",
                body: data,
            }),

            invalidatesTags: ["FAQ"],
        }),

        // =========================
        // Get All FAQs
        // =========================
        getAllFaqs: builder.query({
            query: () => ({
                url: "/faqs",
                method: "GET",
            }),

            providesTags: ["FAQ"],
        }),

        // =========================
        // Get Active FAQs
        // =========================
        getActiveFaqs: builder.query({
            query: () => ({
                url: "/faqs/active",
                method: "GET",
            }),

            providesTags: ["FAQ"],
        }),

        // =========================
        // Update FAQ
        // =========================
        updateFaq: builder.mutation({
            query: ({ id, data }) => ({
                url: `/faqs/${id}`,
                method: "PUT",
                body: data,
            }),

            invalidatesTags: ["FAQ"],
        }),

        // =========================
        // Delete FAQ
        // =========================
        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["FAQ"],
        }),

        // =========================
        // Toggle FAQ Status
        // =========================
        toggleStatus: builder.mutation({
            query: (id) => ({
                url: `/faqs/${id}/toggle-status`,
                method: "PATCH",
            }),

            invalidatesTags: ["FAQ"],
        }),
    }),
});

export const {
    useAddFaqMutation,
    useGetAllFaqsQuery,
    useGetActiveFaqsQuery,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
    useToggleStatusMutation,
} = faqApi;