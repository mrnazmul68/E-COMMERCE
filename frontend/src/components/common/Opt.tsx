import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "../../redux/store";
import { verifyLoginUser } from "../../redux/slices/authSlice";


interface OtpProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

const OTP_LENGTH = 6;

const Otp = ({
  open,
  email,
  onClose,
  onVerified,
}: OtpProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector(
    (state: RootState) => state.auth,
  );

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!open) return null;

  // Handle input change
  const handleChange = (
    value: string,
    index: number,
  ) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedData) return;

    const updatedOtp = Array(OTP_LENGTH).fill("");

    pastedData.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(
      pastedData.length,
      OTP_LENGTH - 1,
    );

    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(
        verifyLoginUser({
          email,
          otp: code,
        }),
      ).unwrap();

      toast.success("Login successful!");

      setOtp(Array(OTP_LENGTH).fill(""));

      onVerified();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "OTP verification failed",
      );

      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleClose = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-5 top-5 text-xl text-zinc-400 transition hover:text-white disabled:opacity-50"
          aria-label="Close OTP popup"
        >
          &times;
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <h2 className="mb-3 text-2xl font-semibold text-white">
            Verify Your Email
          </h2>

          <p className="text-sm leading-6 text-zinc-400">
            We've sent a verification code to
          </p>

          <p className="mt-1 break-all font-medium text-white">
            {email}
          </p>
        </div>

        {/* OTP inputs */}
        <div className="mb-8 flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
              disabled={loading}
              className="h-12 w-11 rounded-lg border border-white/10 bg-black text-center text-xl font-semibold text-white outline-none transition focus:border-white/60 disabled:opacity-50 sm:h-14 sm:w-12"
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={
            loading || otp.some((digit) => digit === "")
          }
          className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Didn't receive the code? Please try again later.
        </p>
      </div>
    </div>
  );
};

export default Otp;