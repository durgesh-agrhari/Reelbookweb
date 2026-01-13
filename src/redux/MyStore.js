import {configureStore} from '@reduxjs/toolkit';

import AuthReducer from './AuthSlice';
// import PostReducer from './PostSlice';
// import ThemeSlice  from './ThemeSlice';
// import ReelReducer from './ReelSlice';
// import StoryReducer from './StorySlice';
// import UsersReducers from './UsersSlice';
// import homeFeedReducer from './store/reducers/homeFeedReducer';
// import userPostReducer from './userProfileSlice/UserPostSlice';
// import userReelReducer from './userProfileSlice/UserReelSlice';
// import userStoryReducer from './userProfileSlice/UserStorySlice';
import RandomReelReducer from './RandomReelSlice';
import randomPostSlice from './randomPostSlice';
import allUserSlice from './allUserSlice';

const MyStore = configureStore({
  reducer: {
    auth: AuthReducer,
     randomReel: RandomReelReducer,
     randomPost: randomPostSlice,
    // theme: ThemeSlice,
    // reel: ReelReducer,
    // story: StoryReducer,
    users: allUserSlice,
    // homeFeed: homeFeedReducer,
    // userPosts: userPostReducer,
    // userReels: userReelReducer,
    // userStories: userStoryReducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // disable immutability checks in development
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default MyStore;
