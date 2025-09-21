// // redux/ThemeSlice.js
// import { createSlice } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const initialState = {
//   data: 'LIGHT', // default theme
// };

// const themeSlice = createSlice({
//   name: 'theme',
//   initialState,
//   reducers: {
//     setTheme: (state, action) => {
//       state.data = action.payload;
//     },
//   },
// });

// export const { setTheme } = themeSlice.actions;

// // Thunk to persist and change theme
// export const changeTheme = (theme) => async (dispatch) => {
//   try {
//     await AsyncStorage.setItem('APP_THEME', theme);
//     dispatch(setTheme(theme));
//   } catch (error) {
//     console.error('Failed to save theme to storage:', error);
//   }
// };

// // Thunk to load theme on app start
// export const loadTheme = () => async (dispatch) => {
//   try {
//     const storedTheme = await AsyncStorage.getItem('APP_THEME');
//     if (storedTheme) {
//       dispatch(setTheme(storedTheme));
//     }
//   } catch (error) {
//     console.error('Failed to load theme from storage:', error);
//   }
// };

// export default themeSlice.reducer;

// // import { createSlice } from "@reduxjs/toolkit";

// // export const ThemeSlice = createSlice({
// //     name: 'theme',
// //     initialState:{
// //         data:'LIGHT'
// //     },
// //     reducers:{
// //         changeTheme(state, action){
// //             state.data = action.payload
// //         }
// //     }
// // })

// // export const {changeTheme} = ThemeSlice.actions
// // export default ThemeSlice.reducer