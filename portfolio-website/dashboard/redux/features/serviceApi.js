import { apiSlice } from "./apiSlice";

export const servicesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query({
            query: () => "/services",
            providesTags: ["Service"],
        }),
        getServiceById: builder.query({
            query: (id) => `/services/${id}`,
            providesTags: (result, error, id) => [{ type: "Service", id }],
        }),
        createService: builder.mutation({
            query: (data) => ({
                url: "/services",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),
        updateService: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/services/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Service", id }, "Service"],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/services/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),
        toggleServiceStatus: builder.mutation({
            query: (id) => ({
                url: `/services/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Service", id }, "Service"],
        }),
    }),
});

export const {
    useGetAllServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    useToggleServiceStatusMutation,
} = servicesApi;