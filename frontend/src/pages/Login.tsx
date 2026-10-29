import { useEffect, useState, type FormEvent } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSignup = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail("")
    setPassword("")
    
  };

  return (
    <section className="w-full pt-16 py-20 min-h-screen bg-[#fdfcfb] flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8"
      >
        <h2 className="text-3xl font-serif text-center mb-6">Create Account</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Join Rupayon for exclusive borka collections
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
            placeholder="Password (at least 8 characters)"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/register" className="text-black font-medium">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;