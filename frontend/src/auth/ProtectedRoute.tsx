import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "../components/common/FullPageLoader";
import type { RootState } from "../redux/store";

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, status } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
