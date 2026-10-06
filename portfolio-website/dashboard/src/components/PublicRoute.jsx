import { Navigate } from "react-router-dom";
import { useUserProfileQuery } from "@/redux/features/authApi";

export function PublicRoute({ children }) {
    const { data, isLoading, isFetching } = useUserProfileQuery();

    // Debug — remove after fixing
    console.log("🔍 PublicRoute data:", data);

    if (isLoading || isFetching) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
                <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
            </div>
        );
    }

    // Handle every possible backend shape
    const user =
        data?.user ??            // { user: {...} }
        data?.data?.user ??      // { data: { user: {...} } }
        data?.data ??            // { data: {...user} }
        (data?._id ? data : null); // user object directly

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
}