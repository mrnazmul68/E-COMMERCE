
import { useState, type FormEvent } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { toast } from "sonner";
import Otp from "../components/common/Opt";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const message = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(message);
      setShowOtp(true);
      setPassword("");
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
        onClose={() => setShowOtp(false)}
        onVerified={() => {
          setShowOtp(false);
          navigate("/");
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

        <p className="text-sm text-center mt-6 text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-black font-medium cursor-pointer">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
