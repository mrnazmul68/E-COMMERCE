import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  returnTo?: string;
}

const GoogleAuthButton = ({ returnTo = "/" }: GoogleAuthButtonProps) => {
  const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
  const safeReturnTo =returnTo.startsWith("/") &&!returnTo.startsWith("//") &&!returnTo.startsWith("/auth/")? returnTo: "/";
  const href = `${apiUrl}/auth/google?returnTo=${encodeURIComponent(safeReturnTo)}`;

  return (
    <a
      href={href}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20"
    >
      <FcGoogle className="h-5 w-5" aria-hidden="true" />
      Continue with Google
    </a>
  );
};

export default GoogleAuthButton;
