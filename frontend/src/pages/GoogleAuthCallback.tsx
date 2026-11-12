import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import FullPageLoader from "../components/common/FullPageLoader";
import type { RootState } from "../redux/store";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Google sign-in was cancelled.",
  state_invalid: "The Google sign-in request expired. Please try again.",
  email_unverified: "Your Google email address is not verified.",
  account_conflict: "This email is already linked to another account.",
  account_blocked:
    "Google sign-in is not enabled for this account. Please sign in with your password.",
  google_auth_failed: "Google sign-in failed. Please try again.",
};

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, user } = useSelector((state: RootState) => state.auth);
  const handled = useRef(false);

  const error = searchParams.get("error");
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (status === "idle" || status === "loading") return;

    // React StrictMode remounts effects in development.
    if (handled.current) return;
    handled.current = true;

    if (error) {
      toast.error(
        ERROR_MESSAGES[error] ?? "Google sign-in failed. Please try again.",
      );
      // Keep an existing password session alive if OAuth was cancelled.
      navigate(user ? "/" : "/login", { replace: true });
      return;
    }

    if (status === "authenticated" && user) {
      const destination =
        returnTo?.startsWith("/") &&
        !returnTo.startsWith("//") &&
        !returnTo.startsWith("/auth/")
          ? returnTo
          : "/";

      toast.success("Signed in with Google");
      navigate(destination, { replace: true });
      return;
    }

    toast.error("Google sign-in failed. Please try again.");
    navigate("/login", { replace: true });
  }, [status, user, error, returnTo, navigate]);

  return <FullPageLoader />;
};

export default GoogleAuthCallback;
