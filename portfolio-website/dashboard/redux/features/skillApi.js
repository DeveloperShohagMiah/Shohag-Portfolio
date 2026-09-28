import { apiSlice } from "./apiSlice";

export const skillsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllSkills: builder.query({
            query: () => "/skills",
            providesTags: ["Skill"],
        }),
        getActiveSkills: builder.query({
            query: () => "/skills/active",
            providesTags: ["Skill"],
        }),
        createSkill: builder.mutation({
            query: (data) => ({
                url: "/skills",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Skill"],
        }),
        updateSkill: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/skills/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Skill"],
        }),
        deleteSkill: builder.mutation({
            query: (id) => ({
                url: `/skills/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Skill"],
        }),
        toggleSkillStatus: builder.mutation({
            query: (id) => ({
                url: `/skills/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: ["Skill"],
        }),
    }),
});

export const {
    useGetAllSkillsQuery,
    useGetActiveSkillsQuery,
    useCreateSkillMutation,
    useUpdateSkillMutation,
    useDeleteSkillMutation,
    useToggleSkillStatusMutation,
} = skillsApi;