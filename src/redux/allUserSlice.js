import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../utils/String";

// Constants
const PAGE_SIZE = 20;

// ✅ Async thunk to fetch paginated users
export const fetchUsersPage = createAsyncThunk(
  "users/fetchUsersPage",
  async (page, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/getallUserPage?page=${page}&limit=${PAGE_SIZE}`
      );

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(error.message);
    }
  }
);

const allUserSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    page: 1,
    loading: false,
    hasMore: true,
  },
  reducers: {
    // 🔄 Reset users (on mount / refresh)
    resetUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersPage.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.length > 0) {
          state.users = [...state.users, ...action.payload];
          state.page += 1;
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchUsersPage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetUsers } = allUserSlice.actions;
export default allUserSlice.reducer;
