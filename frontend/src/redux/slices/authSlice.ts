import { createAsyncThunk } from "@reduxjs/toolkit";

const userInfo = localStorage.getItem("userInfo");

const userFromStorage = userInfo ? JSON.parse(userInfo) : null;

const initialGuestId: string =
  localStorage.getItem("guestId") || `guest_${Date.now()}`;

localStorage.setItem("guestId", initialGuestId);

interface User {
    id?:string,
    name: string,
    email:string
}

interface AuthState {
  user: User | null;
  guestId: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// export const loginUser = createAsyncThunk()