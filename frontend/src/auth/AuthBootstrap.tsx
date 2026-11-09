import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import FullPageLoader from "../components/common/FullPageLoader";
import { refreshSession, type SessionPayload } from "../lib/axios";
import {
  clearAuth,
  setCredentials,
  setGuest,
} from "../redux/slices/authSlice";
import type { AppDispatch } from "../redux/store";

export default function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    refreshSession()
      .then((session) => {
        if (alive) dispatch(setCredentials(session.user));
      })
      .catch(() => {
        if (alive) dispatch(setGuest());
      })
      .finally(() => {
        if (alive) setReady(true);
      });

    return () => {
      alive = false;
    };
  }, [dispatch]);

  useEffect(() => {
    const handleLogout = () => {
      dispatch(clearAuth());
    };

    const handleSession = (event: Event) => {
      const session = (event as CustomEvent<SessionPayload>).detail;

      if (session?.user) {
        dispatch(setCredentials(session.user));
      }
    };

    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:session", handleSession);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:session", handleSession);
    };
  }, [dispatch]);

  if (!ready) {
    return <FullPageLoader />;
  }

  return <Outlet />;
}
