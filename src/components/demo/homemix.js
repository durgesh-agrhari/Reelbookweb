// HomeMixProMax.js
import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import ReelGrid from './HomeProMaxVAP/ReelGrid';
import AdSection from './HomeProMaxVAP/AdSection';
import PhotoPost from './HomeProMaxVAP/PhotoPost';
import axios from 'axios';

import backendURL, { DELETE_POST, FOLLOW_USER, LIKE_POST, UPDATE_POST } from '../../utils/Strings';

import { fetchPosts } from '../../redux/PostSlice';
import { fetchUsers } from '../../redux/UsersSlice';

import PostOptionModal from '../../components/postComponents/PostOptionModal';
import Loader from '../../components/Loader';
import PostUpdateModal from '../../components/postComponents/PostUpdateModal';
import ReportContentModal from '../../components/postComponents/ReportContentModal';
import RepoartResionModal from '../../components/postComponents/RepoartResionModal';

import VideoHomeSimmer from '../../components/simmereffect/VideoHomeSimmer';
import PostSimmer from '../../components/simmereffect/PostSimmer';
import { useInstaContext } from '../../context/InstaContext';

const HomeMixProMax = () => {

  const dispatch = useDispatch();
  const { reels } = useSelector(state => state.reel);
  const { posts } = useSelector(state => state.post);
  const { userData } = useSelector(state => state.auth);
  const THEME = useSelector(state => state.theme);

  const [openOption, setopenOption] = useState(false);
  const [openReport, setopenReport] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openReportResionModal, setOpenReportResionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Memoize derived values
  const reelSetCount = useMemo(() => Math.ceil((reels?.length || 0) / 6), [reels]);
  const postSetCount = useMemo(() => Math.ceil((posts?.length || 0) / 2), [posts]);
  const maxSetLength = useMemo(() => Math.max(reelSetCount, postSetCount), [reelSetCount, postSetCount]);

  const dynamicAds = useMemo(() =>
    Array.from({ length: maxSetLength }, (_, i) => ({
      id: `ad-${i}`,
      type: 'AD',
      title: `Ad #${i + 1}`
    })), [maxSetLength]
  );

  // ✅ Wrap functions with useCallback so they are stable references
  const deletePost = useCallback(async () => {
    try {
      setLoading(true);
      await fetch(`${backendURL}${DELETE_POST}/${selectedItem._id}`, { method: 'DELETE' });
      dispatch(fetchPosts());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedItem]);

  const updatePost = useCallback(async (caption) => {
    try {
      const body = JSON.stringify({ userId: userData._id, caption, username: userData.username });
      await fetch(`${backendURL}${UPDATE_POST}/${selectedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      dispatch(fetchPosts());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, userData, selectedItem]);

  // const likePost = useCallback(async (item) => {
  //   try {
  //     const body = JSON.stringify({ userId: userData._id });
  //     await fetch(`${backendURL}${LIKE_POST}/${item._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body
  //     });
  //     dispatch(fetchPosts());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [dispatch, userData]);
  const { fcmToken } = useInstaContext();

//   const likePost = useCallback(async (item) => {
//   try {
//     const body = JSON.stringify({ userId: userData._id });

//     // ✅ Like API
//     await fetch(`${backendURL}${LIKE_POST}/${item._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body,
//     });

//     // ✅ Refresh posts in Redux
//     dispatch(fetchPosts());

//     // ✅ Prepare notification payload
//     const payload = {
//       token: fcmToken, // 👈 FCM token of post owner (make sure it's included in item)
//       title: `${userData.username} liked your post ❤️`,
//       body: `${userData.username} liked your photo`,
//       senderId: userData._id,
//       receiverId: item.userId, // post owner
//       profileImage: userData.profilePic || "",
//       fileName: "",
//       username: userData.username,
//       screen: "notification",
//       id: item._id,
//     };

//     // ✅ Send notification
//     await axios.post(`${backendURL}/notification/send-notification`, payload);

//     console.log("📤 Like notification sent to post owner");
//   } catch (error) {
//     console.error("❌ Like/Notification Error:", error.response?.data || error.message);
//   }
// }, [dispatch, userData]);


const likePost = useCallback(async (item) => {
  try {
    const body = JSON.stringify({ userId: userData._id });

    // ✅ Like API
    await fetch(`${backendURL}${LIKE_POST}/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // ✅ Refresh posts in Redux
    dispatch(fetchPosts());

    // ✅ Log user activity (increment postLikes by 1)
    try {
      await axios.post(`${backendURL}/user-activity/log`, {
        userId: userData._id,
        postLikes: 1, // increment by 1
      });
      console.log("✅ Post like logged in user activity");
    } catch (error) {
      console.error("❌ Error logging post like activity:", error.message);
    }

    // ✅ Prepare notification payload
    const payload = {
      token: fcmToken || "", // 👈 make sure your post object has fcmToken of the post owner
      title: `${userData.username} liked your post ❤️`,
      body: `${userData.username} liked your photo`,
      senderId: userData._id,
      receiverId: item.userId, // post owner
      profileImage: userData.profilePic || "",
      fileName: "",
      username: userData.username,
      screen: "notification",
      id: item._id,
    };

    // ✅ Send notification
    await axios.post(`${backendURL}/notification/send-notification`, payload);

    console.log("📤 Like notification sent to post owner");
  } catch (error) {
    console.error("❌ Like/Notification Error:", error.response?.data || error.message);
  }
}, [dispatch, userData]);

  // const followUser = useCallback(async (id) => {
  //   try {
  //     const body = JSON.stringify({ userId: userData._id });
  //     await fetch(`${backendURL}${FOLLOW_USER}/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body
  //     });
  //     dispatch(fetchPosts());
  //     dispatch(fetchUsers());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [dispatch, userData]);

  const followUser = useCallback(async (id, photo) => {
  try {
    const body = JSON.stringify({ userId: userData._id });

    // ✅ Follow API
    await fetch(`${backendURL}${FOLLOW_USER}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // ✅ Refresh Redux data
    dispatch(fetchPosts());
    dispatch(fetchUsers());

    // ✅ Prepare notification payload
    const payload = {
      token: fcmToken, // 👈 FCM token of the user being followed
      title: `${userData.username} started following you 👤`,
      body: `Say hello to ${userData.username}!`,
      senderId: userData._id,       // current user
      receiverId: photo.userId,  // followed user
      profileImage: userData.profilePic || "",
      fileName: "",
      username: userData.username,
      screen: "notification",
      id: "",
    };

    // ✅ Send notification
    await axios.post(`${backendURL}/notification/send-notification`, payload);

    console.log("📤 Follow notification sent to:", photo?.username);
  } catch (error) {
    console.error("❌ Follow/Notification Error:", error.response?.data || error.message);
  }
}, [dispatch, userData]);


  const checkFollow = useCallback((id) => {
    return userData?.following?.includes(id);
  }, [userData]);

  // ✅ Memoize renderContentSet
  const renderContentSet = useMemo(() => {
    return Array.from({ length: maxSetLength }, (_, i) => {
      const videoSet = reels?.slice(i * 6, (i + 1) * 6) || [];
      const photoSet = posts?.slice(i * 2, (i + 1) * 2) || [];
      const ad = dynamicAds[i];

      return (
        <View key={`set-${i}`}>
          {!!videoSet.length && <ReelGrid videos={videoSet} allVideos={reels} />}
          <AdSection ads={[ad]} />
          {photoSet.map((photo, idx) => (
            <PhotoPost
              key={`photo-${i}-${idx}`}
              photo={photo}
              isFollowed={checkFollow(photo.userId)}
              onClickOptions={() => { setSelectedItem(photo); setopenOption(true); }}
              onClickLike={() => likePost(photo)}
              onFollow={() => followUser(photo.userId,photo )}
              onReportOption={() => { setSelectedItem(photo); setopenReport(true); }}
            />
          ))}
        </View>
      );
    });
  }, [maxSetLength, reels, posts, dynamicAds, checkFollow, likePost, followUser]);


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: THEME.data === 'LIGHT' ? 'white' : 'black', marginTop: 10 }
      ]}
    >
      {!reels?.length && !posts?.length ? (
        <View style={styles.emptyContainer}>
          <VideoHomeSimmer />
          <PostSimmer />
        </View>
      ) : (
        // ✅ Just render the memoized content (no FlatList hack with [1])
        <FlatList
          data={renderContentSet}
          renderItem={({ item }) => item}
          keyExtractor={(_, index) => `render-block-${index}`}
        />
      )}

      <PostOptionModal
        visible={openOption}
        onClose={() => setopenOption(false)}
        onClick={option => {
          setopenOption(false);
          if (option === 2) deletePost();
          else if (option === 1) setOpenUpdateModal(true);
        }}
      />

      <Loader visible={loading} />

      <PostUpdateModal
        data={selectedItem}
        visible={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onClick={caption => {
          setOpenUpdateModal(false);
          updatePost(caption);
        }}
      />

      <ReportContentModal
        visible={openReport}
        onClose={() => setopenReport(false)}
        onClick={option => {
          setopenReport(false);
          if (option === 2) {
            // downloadPost(); // Implement this if needed
          } else if (option === 1) {
            setOpenReportResionModal(true);
          }
        }}
      />

      <RepoartResionModal
        data={selectedItem}
        visible={openReportResionModal}
        onClose={() => setOpenReportResionModal(false)}
        onClick={reason => {
          setOpenReportResionModal(false);
          // reportPost(reason); // Implement this if needed
        }}
      />
    </View>
  );
};

export default HomeMixProMax;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4
  },
  emptyContainer: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  }
});


      {/* {!reels?.length && !posts?.length ? (
        <View style={styles.emptyContainer}>
          <VideoHomeSimmer />
          <PostSimmer />
        </View>
      ) : (
        <FlatList
          data={[1]} // render once
          renderItem={renderContentSet}
          keyExtractor={(_, index) => `render-block-${index}`}
        />
      )} */}

  // const dispatch = useDispatch();
  // const isFocused = useIsFocused();

  // const { reels } = useSelector(state => state.reel);
  // const { posts } = useSelector(state => state.post);
  // const { userData } = useSelector(state => state.auth);
  // const THEME = useSelector(state => state.theme);

  // const [openOption, setopenOption] = useState(false);
  // const [openReport, setopenReport] = useState(false);
  // const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // const [openReportResionModal, setOpenReportResionModal] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  // const [loading, setLoading] = useState(false);

  // const reelSetCount = Math.ceil((reels?.length || 0) / 6);
  // const postSetCount = Math.ceil((posts?.length || 0) / 2);
  // const maxSetLength = Math.max(reelSetCount, postSetCount);

  // const dynamicAds = Array.from({ length: maxSetLength }, (_, i) => ({
  //   id: `ad-${i}`,
  //   type: 'AD',
  //   title: `Ad #${i + 1}`
  // }));

  // const deletePost = async () => {
  //   try {
  //     setLoading(true);
  //     await fetch(`${backendURL}${DELETE_POST}/${selectedItem._id}`, { method: 'DELETE' });
  //     dispatch(fetchPosts());
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const updatePost = async caption => {
  //   try {
  //     const body = JSON.stringify({
  //       userId: userData._id,
  //       caption,
  //       username: userData.username
  //     });

  //     await fetch(`${backendURL}${UPDATE_POST}/${selectedItem._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body
  //     });

  //     dispatch(fetchPosts());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const likePost = async item => {
  //   try {
  //     const body = JSON.stringify({ userId: userData._id });

  //     await fetch(`${backendURL}${LIKE_POST}/${item._id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body
  //     });

  //     dispatch(fetchPosts());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const followUser = async id => {
  //   try {
  //     const body = JSON.stringify({ userId: userData._id });

  //     await fetch(`${backendURL}${FOLLOW_USER}/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body
  //     });

  //     dispatch(fetchPosts());
  //     dispatch(fetchUsers());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const checkFollow = id => {
  //   return userData?.following?.includes(id);
  // };

  // const renderContentSet = () => {
  //   return Array.from({ length: maxSetLength }, (_, i) => {
  //     const videoSet = reels?.slice(i * 6, (i + 1) * 6) || [];
  //     const photoSet = posts?.slice(i * 2, (i + 1) * 2) || [];
  //     const ad = dynamicAds[i];

  //     return (
  //       <View key={`set-${i}`}>
  //         {!!videoSet.length && <ReelGrid videos={videoSet} allVideos={reels} />}
  //         <AdSection ads={[ad]} />
  //         {photoSet.map((photo, idx) => (
  //           <PhotoPost
  //             key={`photo-${i}-${idx}`}
  //             photo={photo}
  //             isFollowed={checkFollow(photo.userId)}
  //             onClickOptions={() => {
  //               setSelectedItem(photo);
  //               setopenOption(true);
  //             }}
  //             onClickLike={() => likePost(photo)}
  //             onFollow={() => followUser(photo.userId)}
  //             onReportOption={() => {
  //               setSelectedItem(photo);
  //               setopenReport(true);
  //             }}
  //           />
  //         ))}
  //       </View>
  //     );
  //   });
  // };
