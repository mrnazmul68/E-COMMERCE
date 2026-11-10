import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { api, broadcastLogout, broadcastSession } from "../../lib/axios";
import { setAccessToken } from "../../lib/token";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "guest";

interface AuthState {
  user: User | null;
  guestId: string;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}
interface VerifyLoginCredentials {
  email: string;
  otp: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}


export interface UserApiResponse {
  success: boolean;
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
  };
  message: string;
}

// Remove credentials left behind by the previous localStorage-based auth.
localStorage.removeItem("accessToken");
localStorage.removeItem("userInfo");

const initialGuestId: string =
  localStorage.getItem("guestId") || `guest_${Date.now()}`;

localStorage.setItem("guestId", initialGuestId);

const initialState: AuthState = {
  user: null,
  guestId: initialGuestId,
  status: "idle",
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>("/auth/login", userData);
    const { message } = response.data;

    return message;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }

    return rejectWithValue("Something went wrong");
  }
});

// Verify LoginUser thunk
export const verifyLoginUser = createAsyncThunk<
  User,
  VerifyLoginCredentials,
  { rejectValue: string }
>("auth/login/verify-user", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>(
      "/auth/login/verify-user",
      userData,
    );
    const { user, accessToken } = response.data.data;

    setAccessToken(accessToken);
    broadcastSession({ accessToken, user });

    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }

    return rejectWithValue("Something went wrong");
  }
});

// Register thunk
export const registerUser = createAsyncThunk<
  string,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>(
      "/auth/register",
      userData,
    );
    const { message } = response.data;

    return message;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});

// Verify Register thunk

export const verifyRegisterUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/register/verify-user", async (token, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>(
      `/auth/register/verify-user/${token}`,
    );

    const { user, accessToken } = response.data.data;

    setAccessToken(accessToken);
    broadcastSession({ accessToken, user });

    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});

// Logout thunk
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        /*
         * 401 means the session is already gone. Treat it as a successful
         * local logout instead of trapping the user in a broken state.
         */
        if (error.response?.status === 401) {
          setAccessToken(null);
          broadcastLogout();
          return;
        }

        return rejectWithValue(
          error.response?.data?.message || "Logout failed",
        );
      }

      return rejectWithValue("Logout failed");
    }

    setAccessToken(null);
    broadcastLogout();
  },
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "authenticated";
      state.loading = false;
      state.error = null;
    },

    setGuest: (state) => {
      state.user = null;
      state.status = "guest";
      state.loading = false;
    },

    clearAuth: (state) => {
      state.user = null;
      state.status = "guest";
      state.loading = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    //*Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
    //* Verify user login
    builder
      .addCase(verifyLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(verifyLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        state.status = state.user ? "authenticated" : "guest";
      });

    // *Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Register failed";
      });
    //*verify register
    builder
      .addCase(verifyRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(verifyRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        state.status = state.user ? "authenticated" : "guest";
      });

    //* Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "guest";
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Logout failed";
      });
  },
});

export const { setCredentials, setGuest, clearAuth, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
