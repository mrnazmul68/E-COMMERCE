import { useState, type FormEvent } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, verifyLoginUser } from "../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { toast } from "sonner";
import Otp from "../components/common/Opt";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =(location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      setPassword("");

      if (result.requiresOtp) {
        toast.success(result.message);
        setShowOtp(true);
        return;
      }

      toast.success("Login successful!");
      navigate(returnTo);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Login failed. Please try again.",
      );
    }
  };

  return (
    <section className="w-full pt-16 py-20 min-h-screen bg-[#fdfcfb] text-black flex items-center justify-center px-4">
      <Otp
        open={showOtp}
        email={email}
        loading={loading}
        onClose={() => setShowOtp(false)}
        onSubmit={async (otp) => {
          await dispatch(verifyLoginUser({ email, otp })).unwrap();
          toast.success("Login successful!");
          setShowOtp(false);
          navigate(returnTo);
        }}
      />
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8"
      >
        <h2 className="text-3xl font-serif text-center mb-6">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to your Rupayon account
        </p>

        <div className="mb-4 relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        <div className="mb-6 relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        {/* API Error */}
        {error && (
          <p role="alert" className="text-sm text-red-600 mb-4 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black cursor-pointer text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">
            or
          </span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        {/* Google auth button */}
        <GoogleAuthButton returnTo={returnTo} />

        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-medium cursor-pointer"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
