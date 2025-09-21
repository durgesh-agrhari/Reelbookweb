// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from 'axios';
// import backendURL, {GET_All_Users} from '../utils/Strings';

// export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
//   const res = await axios.get(`${backendURL}${GET_All_Users}`);
//   return res.data.data.reverse();
// });

// const UsersSlice = createSlice({
//   name: 'users',
//   initialState: {
//     users: [],
//     loading: false,
//     error: false,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchUsers.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // export const {setAuthData} = PostSlice.actions;
// export default UsersSlice.reducer;
