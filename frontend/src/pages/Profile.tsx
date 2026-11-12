import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MapPin,
  Package,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  demoOrders,
  demoProfile,
  formatTaka,
  getOrderTotal,
  type AccountProfile,
} from "../data/account";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import Otp from "../components/common/Opt";
import {
  enableTwoFactor,
  verifyEnableTwoFactor,
} from "../redux/slices/authSlice";

const Profile = () => {
  const [profile, setProfile] = useState<AccountProfile>(demoProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const updateField = (
    field: "firstName" | "lastName" | "email" | "phone",
    value: string,
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  //User data
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    toast.success("Profile updated for this demo");
  };

  const recentOrders = demoOrders.slice(0, 2);
  const activeOrders = demoOrders.filter(
    (order) => order.status === "In transit" || order.status === "Processing",
  ).length;

  //handle 2FA toggle
  const handleTwoFactor = async () => {
    try {
      const message = await dispatch(enableTwoFactor()).unwrap();
      toast.success(message);
      setShowOtp(true);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Something went wrong",
      );
    }
  };

  const handleTwoFactorVerify = async (otp: string) => {
    if (!user) {
      throw new Error("You must be signed in to update two-factor authentication");
    }

    const result = await dispatch(
      verifyEnableTwoFactor({ email: user.email, otp }),
    ).unwrap();

    toast.success(result.message);
    setShowOtp(false);
  };

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-8 sm:py-14 lg:px-12">
      <Otp
        open={showOtp}
        email={user?.email ?? ""}
        loading={loading}
        onClose={() => setShowOtp(false)}
        onSubmit={handleTwoFactorVerify}
      />
      <div className="mx-auto max-w-7xl">
        <div className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight size={13} />
            <span className="text-neutral-300">Profile</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/15 text-lg font-bold text-orange-400">
                {user?.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-neutral-500">
                  {user?.email}
                </p>
              </div>
            </div>
            <nav aria-label="Account navigation" className="mt-4 space-y-1">
              <a
                href="#personal-information"
                className="flex items-center gap-3 rounded-xl bg-orange-500/10 px-3 py-3 text-sm font-medium text-orange-400"
              >
                <UserRound size={17} /> Personal information
              </a>
              <Link
                to="/orders"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                <Package size={17} /> My orders
                <ArrowRight size={15} className="ml-auto" />
              </Link>
              <a
                href="#saved-address"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                <MapPin size={17} /> Saved address
              </a>
              {/* Two factor auth button */}
              <button
                type="button"
                onClick={handleTwoFactor}
                className="mt-5 w-full rounded-xl border border-orange-500/15 bg-orange-500/5 p-3 text-left transition hover:border-orange-500/30 hover:bg-orange-500/10"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-5 text-neutral-200">
                      Two-Factor Authentication
                    </p>
                  </div>
                  <div className="border border-green-500 text-green-500 rounded-2xl px-2 font-bold">
                    {user?.twoFactorEnabled ? "on" : "off"}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-3">
                  <span className="text-[11px] text-neutral-500">
                    Account security
                  </span>

                  <span className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-orange-400">
                    {user?.twoFactorEnabled ? "Disable" : "Enable"}{" "}
                    <ArrowRight size={13} />
                  </span>
                </div>
              </button>
            </nav>
            <div className="mt-5 rounded-xl border border-white/6 bg-black/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                <ShieldCheck size={15} className="text-orange-400" />
                Member since <br /> {user?.createdAt}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Total orders",
                  value: demoOrders.length,
                  icon: Package,
                },
                { label: "In progress", value: activeOrders, icon: ArrowRight },
                {
                  label: "Lifetime spend",
                  value: formatTaka(17440),
                  icon: ShieldCheck,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-[#101010] p-4 sm:p-5"
                >
                  <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-white/6 text-orange-400">
                    <Icon size={17} />
                  </div>
                  <p className="text-xs text-neutral-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold sm:text-xl">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <section
              id="personal-information"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Personal information
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Keep your contact details up to date.
                  </p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-white/20 hover:text-white"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSave}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {(
                    [
                      ["firstName", "First name"],
                      ["email", "Email address"],
                      ["phone", "Phone number"],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs font-medium text-neutral-400">
                        {label}
                      </span>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={profile[field]}
                        readOnly={!isEditing}
                        onChange={(event) =>
                          updateField(field, event.target.value)
                        }
                        className={`h-11 w-full rounded-xl border bg-black/50 px-3.5 text-sm text-white outline-none transition ${
                          isEditing
                            ? "border-white/15 focus:border-orange-500/70"
                            : "border-white/6 text-neutral-300"
                        }`}
                      />
                    </label>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                      <Check size={16} /> Save changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfile(demoProfile);
                        setIsEditing(false);
                      }}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-300 transition hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
              <p className="mt-4 text-xs text-neutral-600">
                Demo profile: changes are not saved to an account yet.
              </p>
            </section>

            <section
              id="saved-address"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Saved address</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Your default delivery location.
                  </p>
                </div>
                <MapPin size={19} className="text-orange-400" />
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {profile.address.label}
                  </span>
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-400">
                    Default
                  </span>
                </div>
                <p className="text-sm leading-6 text-neutral-400">
                  {profile.address.street}
                  <br />
                  {profile.address.city}, {profile.address.postalCode}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Recent orders</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    A quick look at your latest purchases.
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
                >
                  All orders <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.07]">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={order.items[0].image}
                        alt=""
                        className="size-12 shrink-0 rounded-lg bg-neutral-800 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {order.id}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.placedAt}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">
                        {formatTaka(getOrderTotal(order))}
                      </p>
                      <p className="mt-1 text-xs text-orange-400">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
