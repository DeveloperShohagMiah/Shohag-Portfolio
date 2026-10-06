import { Navigate, useLocation } from "react-router-dom";
import { useUserProfileQuery } from "@/redux/features/authApi";

export function ProtectedRoute({ children }) {
    const { data, isLoading, isFetching } = useUserProfileQuery();
    const location = useLocation();

    if (isLoading || isFetching) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
                <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
            </div>
        );
    }

    const user =
        data?.user ??
        data?.data?.user ??
        data?.data ??
        (data?._id ? data : null);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}