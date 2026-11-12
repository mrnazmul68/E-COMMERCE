import { useState, type FormEvent } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ConfirmationPage from "../components/common/ConirmationPage";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const location = useLocation();
  const returnTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  //Redux state
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const message = await dispatch(
        registerUser({ name, email, password }),
      ).unwrap();

      setRegisteredEmail(email);
      setShowConfirmation(true);
      toast.success(message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Register failed. Please try again.",
      );
    }
  };

  return (
    <section className="w-full pt-16 py-20 min-h-screen text-black bg-[#fdfcfb] flex items-center justify-center px-4">
      <ConfirmationPage open={showConfirmation} email={registeredEmail} />
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8"
      >
        <h2 className="text-3xl font-serif text-center mb-6">Create Account</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Join Rupayon for exclusive borka collections
        </p>

        <div className="mb-4 relative">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

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
            placeholder="Password (at least 8 characters)"
            autoComplete="new-password"
            minLength={8}
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
          className="w-full cursor-pointer bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">
            or
          </span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleAuthButton returnTo={returnTo} />

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium cursor-pointer\">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
