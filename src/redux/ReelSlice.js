// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from 'axios';
// import backendURL, {REELS} from '../utils/Strings';

// export const fetchReels = createAsyncThunk('reels/fetchAllReels', async () => {
//   const res = await axios.get(`${backendURL}${REELS}`);
//   // console.log("resdata",res.data)
//   return res.data.data.reverse();
// });
// const ReelSlice = createSlice({
//   name: 'reels',
//   initialState: {
//     reels: [],
//     loading: false,
//     error: false,
//   },
//   reducers: {
//     setReels: (state, action) => {
//       state.reels = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(fetchReels.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchReels.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reels = action.payload;
//       })
//       .addCase(fetchReels.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });




// export const { setReels } = ReelSlice.actions;
// export default ReelSlice.reducer;




// // const ReelSlice = createSlice({
// //   name: 'reels',
// //   initialState: {
// //     reels: [],
// //     loading: false,
// //     error: false,
// //   },
// //   reducers: {},
// //   extraReducers: builder => {
// //     builder
// //       .addCase(fetchReels.pending, state => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchReels.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.reels = action.payload;
// //       })
// //       .addCase(fetchReels.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });