import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    // public app — no cookies needed
});

export const publicApi = createApi({
    reducerPath: "publicApi",
    baseQuery,
    tagTypes: [
        "About",
        "Project",
        "Service",
        "Skill",
        "Blog",
        "Faq",
        "Testimonial",
    ],
    endpoints: (builder) => ({
        // ---------------- ABOUT ----------------
        getPublicAboutData: builder.query({
            query: () => "/about",
            providesTags: ["About"],
        }),

        // ---------------- SERVICES ----------------
        getPublicServices: builder.query({
            query: (params) => ({
                url: "/services/active",
                params, // { limit, search, ... }
            }),
            providesTags: (result) => {
                const list = result?.data ?? result ?? [];
                return Array.isArray(list)
                    ? [
                        ...list.map((s) => ({ type: "Service", id: s._id })),
                        { type: "Service", id: "LIST" },
                    ]
                    : [{ type: "Service", id: "LIST" }];
            },
        }),

        // ---------------- SKILLS ----------------
        getPublicSkills: builder.query({
            query: (params) => ({
                url: "/skills",
                params,
            }),
            providesTags: ["Skill"],
        }),

        // ---------------- PROJECTS ----------------
        getPublicProjects: builder.query({
            query: (params) => ({
                url: "/projects",
                params: { active: true, limit: 50, ...params },
            }),
            providesTags: (result) => {
                const list = result?.data?.projects ?? result?.data ?? result ?? [];
                return Array.isArray(list)
                    ? [
                        ...list.map((p) => ({ type: "Project", id: p._id })),
                        { type: "Project", id: "LIST" },
                    ]
                    : [{ type: "Project", id: "LIST" }];
            },
        }),

        getPublicProjectById: builder.query({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: "Project", id }],
        }),

        // ---------------- BLOGS ----------------
        getPublicBlogs: builder.query({
            query: (params) => ({
                url: "/blogs",
                params: { active: true, ...params },
            }),
            providesTags: (result) => {
                const list = result?.data?.blogs ?? result?.data ?? result ?? [];
                return Array.isArray(list)
                    ? [
                        ...list.map((b) => ({ type: "Blog", id: b._id })),
                        { type: "Blog", id: "LIST" },
                    ]
                    : [{ type: "Blog", id: "LIST" }];
            },
        }),

        getBlogById: builder.query({
            query: (id) => `/blogs/${id}`,
            providesTags: (result, error, id) => [{ type: "Blog", id }],
        }),

        // ---------------- FAQs ----------------
        getPublicFaqs: builder.query({
            query: (params) => ({
                url: "/faqs",
                params,
            }),
            providesTags: ["Faq"],
        }),

        // ---------------- TESTIMONIALS ----------------
        getPublicTestimonials: builder.query({
            query: (params) => ({
                url: "/testimonials",
                params,
            }),
            providesTags: ["Testimonial"],
        }),

        // ---------------- CONTACT ----------------
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/contact-messages", // ✅ matches backend route
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetPublicAboutDataQuery,
    useGetPublicServicesQuery,
    useGetPublicSkillsQuery,
    useGetPublicProjectsQuery,
    useGetPublicProjectByIdQuery,
    useGetPublicBlogsQuery,
    useGetBlogByIdQuery,
    useGetPublicFaqsQuery,
    useGetPublicTestimonialsQuery,
    useSendMessageMutation,
} = publicApi;