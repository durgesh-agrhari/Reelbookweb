import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../utils/String";

// Constants
const PAGE_SIZE = 6;
const MAX_POSTS = 100;

// ✅ Async thunk to fetch random posts (paginated)
export const fetchRandomPosts = createAsyncThunk(
  "randomPost/fetchRandomPosts",
  async (page, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/post/getallPosts?_limit=${PAGE_SIZE}&_page=${page}`
      );
      const data = await response.json();

      return {
        posts: data.data || [],
        page,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return rejectWithValue(error.message);
    }
  }
);

const randomPostSlice = createSlice({
  name: "randomPost",
  initialState: {
    posts: [],
    page: 1,
    loading: false,
    hasMore: true,
  },
  reducers: {
    // 🔄 Pull-to-refresh / manual reset
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
    },

    // 🧹 Optional cleanup when leaving screen
    cleanupPosts: (state) => {
      if (state.posts.length > 30) {
        state.posts = state.posts.slice(-30);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomPosts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRandomPosts.fulfilled, (state, action) => {
        const newPosts = action.payload.posts;

        state.loading = false;

        if (newPosts.length > 0) {
          const combined = [...state.posts, ...newPosts];

          // ✅ Keep last MAX_POSTS only
          state.posts =
            combined.length > MAX_POSTS
              ? combined.slice(-MAX_POSTS)
              : combined;

          state.page += 1;
          state.hasMore = newPosts.length === PAGE_SIZE;
        } else {
          state.hasMore = false;
        }
      })

      .addCase(fetchRandomPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetPosts, cleanupPosts } = randomPostSlice.actions;
export default randomPostSlice.reducer;
