import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api";

interface User {
  id?: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  guestId: string;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface UserApiResponse {
  user: User;
  token: string;
}

// Local storage
const userInfo = localStorage.getItem("userInfo");

const userFromStorage: User | null = userInfo
  ? (JSON.parse(userInfo) as User)
  : null;

const initialGuestId: string =
  localStorage.getItem("guestId") || `guest_${Date.now()}`;

localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState: AuthState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>("/auth/login", userData);
    console.log(response.data.user)
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    localStorage.setItem("userToken", response.data.token);

    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }

    return rejectWithValue("Something went wrong");
  }
});

// Register thunk
export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<UserApiResponse>(
      "/auth/register",
      userData,
    );

    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    localStorage.setItem("userToken", response.data.token);

    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");

      // guestId remains unchanged
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
