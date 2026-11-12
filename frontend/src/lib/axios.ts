import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./token";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL, withCredentials: true });

// A separate instance keeps the refresh call outside the 401 interceptor.
const refreshClient = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface SessionPayload {
  accessToken: string;
  user: SessionUser;
}

interface AuthChannelMessage {
  type: "session" | "logout";
  session?: SessionPayload;
}

const authChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("nexora-auth")
    : null;

export const broadcastSession = (session: SessionPayload): void => {
  authChannel?.postMessage({
    type: "session",
    session,
  } satisfies AuthChannelMessage);
};

export const broadcastLogout = (): void => {
  authChannel?.postMessage({
    type: "logout",
  } satisfies AuthChannelMessage);
};

authChannel?.addEventListener(
  "message",
  (event: MessageEvent<AuthChannelMessage>) => {
    const message = event.data;

    if (message?.type === "session" && message.session) {
      setAccessToken(message.session.accessToken);
      window.dispatchEvent(
        new CustomEvent<SessionPayload>("auth:session", {
          detail: message.session,
        }),
      );
      return;
    }

    if (message?.type === "logout") {
      setAccessToken(null);
      window.dispatchEvent(new Event("auth:logout"));
    }
  },
);

let refreshPromise: Promise<SessionPayload> | null = null;

const requestRefresh = (): Promise<SessionPayload> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<{ data: SessionPayload }>("/auth/refresh")
      .then((response) => {
        const session = response.data.data;
        setAccessToken(session.accessToken);
        broadcastSession(session);
        return session;
      })
      .catch((error: unknown) => {
        setAccessToken(null);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          broadcastLogout();
          window.dispatchEvent(new Event("auth:logout"));
        }

        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

type AuthLockManager = {
  request<T>(name: string, callback: () => Promise<T>): Promise<T>;
};

const lockManager = (navigator as Navigator & { locks?: AuthLockManager })
  .locks;

/*
 * Web Locks serialise refresh across tabs. Without this, two tabs can present
 * the same refresh token at the same time; the server treats the loser as a
 * token replay and revokes the whole session family.
 */
export const refreshSession = (): Promise<SessionPayload> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  if (lockManager) {
    return lockManager.request("nexora-auth-refresh", requestRefresh);
  }

  return requestRefresh();
};

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const isAuthEndpoint = (url: string): boolean => {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    if (!original || status !== 401 || original._retry || isAuthEndpoint(url)) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const session = await refreshSession();
      original.headers.Authorization = `Bearer ${session.accessToken}`;

      try {
        return await api(original);
      } catch (retryError) {
        if (
          axios.isAxiosError(retryError) &&
          retryError.response?.status === 401
        ) {
          broadcastLogout();
          window.dispatchEvent(new Event("auth:logout"));
        }

        throw retryError;
      }
    } catch (refreshError) {
      setAccessToken(null);
      return Promise.reject(refreshError);
    }
  },
);
