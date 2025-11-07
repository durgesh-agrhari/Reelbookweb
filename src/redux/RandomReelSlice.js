// src/redux/randomReelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../utils/String";

// Constants
const PAGE_SIZE = 18;

// ✅ Async thunk to fetch random reels (paginated)
export const fetchRandomReels = createAsyncThunk(
  "randomReel/fetchRandomReels",
  async (page, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/reel/reelspage?_limit=${PAGE_SIZE}&_page=${page}`
      );
      const data = await response.json();

      console.log("Random Reels Data:", data);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching reels:", error);
      return rejectWithValue(error.message);
    }
  }
);

const randomReelSlice = createSlice({
  name: "randomReel",
  initialState: {
    reels: [],
    page: 1,
    loading: false,
    hasMore: true,
  },
  reducers: {
    resetReels: (state) => {
      state.reels = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomReels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRandomReels.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length > 0) {
          state.reels = [...state.reels, ...action.payload];
          state.page += 1;
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchRandomReels.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetReels } = randomReelSlice.actions;
export default randomReelSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import backendURL from "../utils/String";


// // Constants
// const PAGE_SIZE = 18;

// // Async thunk to fetch reels
// export const fetchRandomReels = createAsyncThunk(
//   "randomReel/fetchRandomReels",
//   async (page, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${backendURL}/reel/reelspage?_limit=${PAGE_SIZE}&_page=${page}`
//       );
//       const data = await response.json();
//       console.log("data", data)
//       return data.data || [];
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const randomReelSlice = createSlice({
//   name: "randomReel",
//   initialState: {
//     reels: [],
//     page: 1,
//     loading: false,
//     hasMore: true,
//   },
//   reducers: {
//     resetReels: (state) => {
//       state.reels = [];
//       state.page = 1;
//       state.hasMore = true;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRandomReels.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchRandomReels.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload.length > 0) {
//           state.reels = [...state.reels, ...action.payload];
//           state.page += 1;
//         } else {
//           state.hasMore = false;
//         }
//       })
//       .addCase(fetchRandomReels.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const { resetReels } = randomReelSlice.actions;
// export default randomReelSlice.reducer;
