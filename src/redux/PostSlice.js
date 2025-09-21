// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from 'axios';
// import backendURL, {FEEDS} from '../utils/Strings';

// export const fetchPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
//   const res = await axios.get(`${backendURL}${FEEDS}`);
//   return res.data.data.reverse();
// });

// const PostSlice = createSlice({
//   name: 'posts',
//   initialState: {
//     posts: [],
//     loading: false,
//     error: false,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchPosts.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.posts = action.payload;
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // export const {setAuthData} = PostSlice.actions; //thunks amd saga
// export default PostSlice.reducer;
