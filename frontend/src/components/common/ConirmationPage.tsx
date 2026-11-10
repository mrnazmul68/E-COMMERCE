import { useEffect, useState } from "react";

interface ConfirmationPageProps {
  open: boolean;
  email: string;
}

const ConfirmationPage = ({ open, email }: ConfirmationPageProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm">
      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-[100px]" />

      {/* Main Card */}
      <div className="confirmation-bounce relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 px-7 py-7 text-center shadow-2xl sm:px-10 sm:py-8">
        {/* Email Icon */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>

          {/* Notification Badge */}
          <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-zinc-950 bg-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Check Your Email
        </h1>

        <p className="mx-auto mb-5 max-w-sm text-sm leading-6 text-zinc-400">
          We've sent you a verification email. Please check your inbox and click
          the verification link to activate your account.
        </p>

        {/* Email Address */}
        <div className="mb-5 rounded-xl border border-white/10 bg-black/60 px-4 py-3">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Verification email sent to
          </p>

          <p className="break-all text-sm font-semibold text-white">{email}</p>
        </div>

        {/* Loading Button */}
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/6 py-3 text-sm font-semibold text-zinc-300"
        >
          <span>Waiting for verification</span>

          <span className="inline-flex w-6 justify-start text-xl font-bold tracking-widest text-white">
            {dots}
          </span>
        </button>

        {/* Information */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs leading-5 text-zinc-500">
            Didn't receive the email? Check your spam folder or make sure your
            email address is correct.
          </p>
        </div>
      </div>

      {/* Bounce Animation */}
      <style>
        {`
          @keyframes confirmationBounce {
            0% {
              opacity: 0;
              transform: translateY(50px) scale(0.85);
            }
            60% {
              opacity: 1;
              transform: translateY(-10px) scale(1.03);
            }
            80% {
              transform: translateY(4px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .confirmation-bounce {
            animation: confirmationBounce 0.7s ease-out both;
          }

          @media (prefers-reduced-motion: reduce) {
            .confirmation-bounce {
              animation: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ConfirmationPage;
