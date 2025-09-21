// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from 'axios';
// import backendURL, {STORYS} from '../utils/Strings';

// export const fetchStorys = createAsyncThunk('storys/fetchAllStorys', async () => {
//   const res = await axios.get(`${backendURL}${STORYS}`);
//   return res.data.data.reverse();
// });

// const StorySlice = createSlice({
//   name: 'storys',
//   initialState: {
//     storys: [],
//     loading: false,
//     error: false,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchStorys.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchStorys.fulfilled, (state, action) => {
//         state.loading = false;
//         state.storys = action.payload;
//       })
//       .addCase(fetchStorys.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default StorySlice.reducer;
