import { useUserProfileQuery } from "@/redux/features/authApi.js";

export function useAuth() {
    const { data, isLoading, isFetching, isError, refetch } = useUserProfileQuery();

    return {
        user: data?.user || null,
        isAuthenticated: !!data?.user,
        isLoading: isLoading || isFetching,
        isError,
        refetch,
    };
}