import { apiSlice } from "./apiSlice";

export const testimonialsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTestimonials: builder.query({
            query: () => "/testimonials",
            providesTags: ["Testimonial"],
        }),
        createTestimonial: builder.mutation({
            query: (data) => ({
                url: "/testimonials",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Testimonial"],
        }),
        updateTestimonial: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/testimonials/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Testimonial"],
        }),
        deleteTestimonial: builder.mutation({
            query: (id) => ({
                url: `/testimonials/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Testimonial"],
        }),
        toggleTestimonialStatus: builder.mutation({
            query: (id) => ({
                url: `/testimonials/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: ["Testimonial"],
        }),
    }),
});

export const {
    useGetAllTestimonialsQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
    useToggleTestimonialStatusMutation,
} = testimonialsApi;