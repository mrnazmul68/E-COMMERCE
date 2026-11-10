import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { verifyRegisterUser } from "../../redux/slices/authSlice";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!token || user) return;

    const verifyEmail = async () => {
      try {
        await dispatch(verifyRegisterUser(token)).unwrap();

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verifyEmail();
  }, [token, dispatch, navigate, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
        {loading ? (
          <>
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white" />

            <h1 className="mb-3 text-2xl font-semibold text-white">
              Verifying Your Email
            </h1>

            <p className="text-sm text-zinc-400">
              Please wait while we verify your email address...
            </p>
          </>
        ) : error ? (
          <>
            <h1 className="mb-3 text-2xl font-semibold text-white">
              Verification Failed
            </h1>

            <p className="mb-6 text-sm text-red-400">{error}</p>

            <button
              onClick={() => navigate("/login")}
              className="w-full cursor-pointer rounded-lg bg-white py-3 font-semibold text-black"
            >
              Back to Login
            </button>
          </>
        ) : (
          <p className="text-zinc-400">Preparing your account...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
