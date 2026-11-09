import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "../components/common/FullPageLoader";
import type { RootState } from "../redux/store";

export function PublicOnlyRoute() {
  const { user, status } = useSelector((state: RootState) => state.auth);

  if (status === "idle" || status === "loading") {
    return <FullPageLoader />;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/"}
        replace
      />
    );
  }

  return <Outlet />;
}
