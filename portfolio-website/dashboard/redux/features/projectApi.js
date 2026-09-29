import { apiSlice } from "./apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProjects: builder.query({
            query: () => "/projects",
            providesTags: ["Project"],
        }),
        getProjectById: builder.query({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: "Project", id }],
        }),
        createProject: builder.mutation({
            query: (data) => ({
                url: "/projects",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Project"],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/projects/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Project"],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),
        updateProjectStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/projects/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Project"],
        }),
    }),
});

export const {
    useGetAllProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useUpdateProjectStatusMutation,
} = projectsApi;