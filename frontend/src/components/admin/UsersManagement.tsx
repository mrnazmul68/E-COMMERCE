import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Eye, EyeOff, Trash2, UserPlus, UserRound, Users } from "lucide-react";
import { toast } from "sonner";

type UserRole = "customer" | "admin";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

const STORAGE_KEY = "nexora.admin.users";

const initialUsers: ManagedUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    createdAt: "Jan 12, 2026",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "customer",
    createdAt: "Feb 03, 2026",
  },
];

const getInitialUsers = (): ManagedUser[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialUsers;

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialUsers;

    return parsed.filter(
      (user): user is ManagedUser =>
        typeof user === "object" &&
        user !== null &&
        typeof (user as ManagedUser).id === "string" &&
        typeof (user as ManagedUser).name === "string" &&
        typeof (user as ManagedUser).email === "string" &&
        ((user as ManagedUser).role === "customer" ||
          (user as ManagedUser).role === "admin"),
    );
  } catch {
    return initialUsers;
  }
};

const today = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

type DeleteUserDialogProps = {
  user: ManagedUser;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteUserDialog = ({
  user,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimeout = useRef<number | null>(null);

  const startClose = useCallback((callback: () => void) => {
    if (closingRef.current) return;

    closingRef.current = true;
    setIsClosing(true);
    closeTimeout.current = window.setTimeout(callback, 170);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") startClose(onCancel);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, startClose]);

  useEffect(
    () => () => {
      if (closeTimeout.current !== null) {
        window.clearTimeout(closeTimeout.current);
      }
    },
    [],
  );

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel deleting user"
        onClick={() => startClose(onCancel)}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${
          isClosing
            ? "animate-admin-dialog-backdrop-out"
            : "animate-admin-dialog-backdrop-in"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        aria-describedby="delete-user-description"
        className={`relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/60 ${
          isClosing
            ? "animate-admin-dialog-panel-out"
            : "animate-admin-dialog-panel-in"
        }`}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <Trash2 size={20} />
        </span>

        <h2 id="delete-user-title" className="mt-4 text-lg font-semibold">
          Delete user?
        </h2>
        <p
          id="delete-user-description"
          className="mt-2 text-sm leading-6 text-neutral-400"
        >
          <span className="font-medium text-white">{user.name}</span> (
          {user.email}) will be permanently removed. This action cannot be
          undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            disabled={isClosing}
            onClick={() => startClose(onCancel)}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isClosing}
            onClick={() => startClose(onConfirm)}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState<ManagedUser[]>(getInitialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setFormError("Name must be at least 2 characters long.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
      setFormError("A user with this email already exists.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    const newUser: ManagedUser = {
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `user-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: "customer",
      createdAt: today(),
    };

    setUsers((current) => [newUser, ...current]);
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    toast.success(`${newUser.name} created as a customer.`);
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    const target = users.find((user) => user.id === id);
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, role } : user)),
    );

    if (target) {
      toast.success(
        `${target.name} is now ${role === "admin" ? "an admin" : "a customer"}.`,
      );
    }
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    setUsers((current) =>
      current.filter((user) => user.id !== userToDelete.id),
    );
    toast.success(`${userToDelete.name} deleted.`);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
            Administration
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Users <span className="text-orange-500">management</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Create accounts, manage roles, and remove users from your store.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3.5 py-2 text-xs font-medium text-neutral-400">
          <Users size={15} className="text-orange-400" />
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </div>

      {/* Create user */}
      <section className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">Create user</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Add a new account with name, email, and password.
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <UserPlus size={19} />
          </span>
        </div>

        <form onSubmit={handleCreateUser} noValidate>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-neutral-400">
                Full name
              </span>
              <div className="relative">
                <UserRound
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-neutral-400">
                Email address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-neutral-400">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 pr-11 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 transition hover:bg-white/5 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
          </div>

          {formError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-400"
            >
              {formError}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500">
              New accounts are created with the customer role.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 active:scale-[0.99]"
            >
              <UserPlus size={16} />
              Create user
            </button>
          </div>
        </form>
      </section>

      {/* Users list */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <h3 className="text-base font-semibold">All users</h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            Change a role from the dropdown or delete an account.
          </p>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_150px_120px_44px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 md:grid">
          <span>User</span>
          <span>Role</span>
          <span>Created</span>
          <span className="text-right">Delete</span>
        </div>

        {users.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-4 px-4 py-4 transition hover:bg-white/2 md:grid md:grid-cols-[minmax(0,1fr)_150px_120px_44px] md:items-center md:gap-4 md:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/6 text-sm font-semibold text-orange-400">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {user.email}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600 md:hidden">
                      Joined {user.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:contents">
                  <div>
                    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600 md:hidden">
                      Role
                    </span>
                    <select
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(
                          user.id,
                          event.target.value as UserRole,
                        )
                      }
                      aria-label={`Role for ${user.name}`}
                      className={`h-9 w-full max-w-36 cursor-pointer rounded-lg border px-2.5 text-xs font-medium outline-none transition md:w-auto ${
                        user.role === "admin"
                          ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                          : "border-white/10 bg-white/3 text-neutral-300 hover:border-white/20"
                      }`}
                    >
                      <option
                        value="customer"
                        className="bg-neutral-900 text-white"
                      >
                        Customer
                      </option>
                      <option
                        value="admin"
                        className="bg-neutral-900 text-white"
                      >
                        Admin
                      </option>
                    </select>
                  </div>

                  <p className="hidden text-xs text-neutral-500 md:block">
                    {user.createdAt}
                  </p>

                  <button
                    type="button"
                    onClick={() => setUserToDelete(user)}
                    aria-label={`Delete ${user.name}`}
                    title={`Delete ${user.name}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center justify-self-end rounded-lg border border-white/10 text-neutral-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-12 text-center">
            <Users size={28} className="mx-auto text-neutral-700" />
            <p className="mt-3 text-sm font-medium text-neutral-300">
              No users yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Create the first user using the form above.
            </p>
          </div>
        )}
      </section>

      {userToDelete && (
        <DeleteUserDialog
          user={userToDelete}
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default UsersManagement;
