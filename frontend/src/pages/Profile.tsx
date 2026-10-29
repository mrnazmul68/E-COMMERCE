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

const Profile = () => {
  const [profile, setProfile] = useState<AccountProfile>(demoProfile);
  const [isEditing, setIsEditing] = useState(false);

  const updateField = (field: "firstName" | "lastName" | "email" | "phone", value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
    toast.success("Profile updated for this demo");
  };

  const recentOrders = demoOrders.slice(0, 2);
  const activeOrders = demoOrders.filter(
    (order) => order.status === "In transit" || order.status === "Processing",
  ).length;

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-white sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <ChevronRight size={13} />
            <span className="text-neutral-300">My account</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
            Your space
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Account <span className="text-orange-500">overview</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your details, addresses, and recent orders.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/15 text-lg font-bold text-orange-400">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{profile.firstName} {profile.lastName}</p>
                <p className="truncate text-xs text-neutral-500">{profile.email}</p>
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
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Package size={17} /> My orders
                <ArrowRight size={15} className="ml-auto" />
              </Link>
              <a
                href="#saved-address"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <MapPin size={17} /> Saved address
              </a>
            </nav>
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/40 p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                <ShieldCheck size={15} className="text-orange-400" />
                Member since {profile.memberSince}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Total orders", value: demoOrders.length, icon: Package },
                { label: "In progress", value: activeOrders, icon: ArrowRight },
                { label: "Lifetime spend", value: formatTaka(17440), icon: ShieldCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-[#101010] p-4 sm:p-5">
                  <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-white/[0.06] text-orange-400">
                    <Icon size={17} />
                  </div>
                  <p className="text-xs text-neutral-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold sm:text-xl">{value}</p>
                </div>
              ))}
            </section>

            <section
              id="personal-information"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Personal information</h2>
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
                  {([
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["email", "Email address"],
                    ["phone", "Phone number"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-xs font-medium text-neutral-400">{label}</span>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={profile[field]}
                        readOnly={!isEditing}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={`h-11 w-full rounded-xl border bg-black/50 px-3.5 text-sm text-white outline-none transition ${
                          isEditing
                            ? "border-white/15 focus:border-orange-500/70"
                            : "border-white/[0.06] text-neutral-300"
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
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-300 transition hover:bg-white/[0.05]"
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
                  <p className="mt-1 text-sm text-neutral-500">Your default delivery location.</p>
                </div>
                <MapPin size={19} className="text-orange-400" />
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-black/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium">{profile.address.label}</span>
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-400">
                    Default
                  </span>
                </div>
                <p className="text-sm leading-6 text-neutral-400">
                  {profile.address.street}<br />
                  {profile.address.city}, {profile.address.postalCode}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Recent orders</h2>
                  <p className="mt-1 text-sm text-neutral-500">A quick look at your latest purchases.</p>
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
                  <div key={order.id} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={order.items[0].image}
                        alt=""
                        className="size-12 shrink-0 rounded-lg bg-neutral-800 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{order.id}</p>
                        <p className="mt-1 text-xs text-neutral-500">{order.placedAt}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">{formatTaka(getOrderTotal(order))}</p>
                      <p className="mt-1 text-xs text-orange-400">{order.status}</p>
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
