import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import backendURL, {
  DELETE_REEL,
  FOLLOW_USER,
  LIKE_REEL,
  REEL_VIEWS_POST,
  UPDATE_REEL,
  USER_REEL_DATA,
} from '../../utils/Strings';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ShowReelsProfileItem from './ShowReelsProfileItem';
import GradientButton from '../../components/comp/GradientButton';
import { fetchReels } from '../../redux/ReelSlice';
import ReelOptionModal from '../../components/reelComponents/ReelOptionModal';
import Loader from '../../components/Loader';
import ReelUpdateModal from '../../components/reelComponents/ReelUpdateModal';
import ReelReportContentModal from '../../components/reelComponents/ReelReportContentModal';
import ReelRepoartResionModal from '../../components/reelComponents/ReelRepoartResionModal';
import ReelsShimmer from '../../components/simmereffect/ReelsShimmer';
import AdReelItem from '../reelsScreen/AdReelItem';
import { useInstaContext } from '../../context/InstaContext';

const { width, height } = Dimensions.get('window');

const ShowReelsProfile = () => {
  const { userData } = useSelector(s => s.auth);
  const route = useRoute();
  const flatListRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const insertAdsEveryFiveReels = (reelsArray) => {
    const result = [];
    for (let i = 0; i < reelsArray.length; i++) {
      result.push(reelsArray[i]);
      if ((i + 1) % 5 === 0) {
        result.push({ type: 'ad', id: `ad-${i}` }); // Insert ad object
      }
    }
    return result;
  };

  const getUserReelData = async (id) => {
    try {
      const response = await fetch(`${backendURL}${USER_REEL_DATA}/${id}`);
      const json = await response.json();
      const reversedData = json.data.reverse();
      const dataWithAds = insertAdsEveryFiveReels(reversedData);
      setReels(dataWithAds);
      setCurrentIndex(route.params.index || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reel data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserReelData(route.params.userId);
  }, []);

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const params = useRoute().params;
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);
  const [videoDuration, setVideoDuration] = useState(5000);
  const autoScrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!autoScroll && !tenSecondAutoScroll) return;
    clearTimeout(autoScrollTimeoutRef.current);
    const scrollTime = tenSecondAutoScroll ? 10000 : videoDuration;
    autoScrollTimeoutRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (flatListRef?.current && nextIndex < reels.length) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, scrollTime);
    return () => clearTimeout(autoScrollTimeoutRef.current);
  }, [currentIndex, videoDuration, autoScroll, tenSecondAutoScroll]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsPlaying(null);
      };
    }, [])
  );


  // const incrementViewCount = async (reelIndex) => {
  //   const item = reels[reelIndex];
  //   if (item?.type === 'ad') return;
  //   try {
  //     await axios.post(backendURL + REEL_VIEWS_POST + `/${item._id}`);
  //     // console.log(`✅ View incremented for reel: ${item._id}`);
  //   } catch (err) {
  //     console.log(`❌ Failed to increment view for ${item._id}`, err);
  //   }
  // };

    const incrementViewCount = async (reelIndex) => {
  try {
   const item = reels[reelIndex];
   if (item?.type === 'ad') return;

    // ✅ Increment view count for the reel
    await axios.post(backendURL + REEL_VIEWS_POST + `/${item._id}`);

    // ✅ Log user activity (reel scrolled)
    try {
      await axios.post(`${backendURL}/user-activity/log`, {
        userId: userData._id,
        reelsScrolled: 1, // increment by 1 scroll
      });
      console.log(`✅ Reel scroll logged for reel: ${item._id}`);
    } catch (activityErr) {
      console.error("❌ Error logging reel scroll:", activityErr.message);
    }
  } catch (err) {
    console.error("❌ Failed to increment view:", err.message);
  }
};

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      // console.log("index id..  ", index)
      incrementViewCount(index);
      setCurrentIndex(index);
      setIsPlaying(viewableItems[0].item.id);
    }
  }, []);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });


  const [openOption, setopenOption] = useState(false);
  const [openReport, setopenReport] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openReportResionModal, setOpenReportResionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const deleteReel = () => {
    setLoading(true);
    fetch(`${backendURL}${DELETE_REEL}/${selectedItem._id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        dispatch(fetchReels());
        setReels(prev => prev.filter(r => r._id !== selectedItem._id));
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const updateReel = caption => {
    setLoading(true);
    const body = JSON.stringify({
      userId: userData._id,
      caption: caption,
      username: userData.username,
    });

    fetch(`${backendURL}${UPDATE_REEL}/${selectedItem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        dispatch(fetchReels());
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  // const likeReel = item => {
  //   const body = JSON.stringify({ userId: userData._id });
  //   fetch(`${backendURL}${LIKE_REEL}/${item._id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body,
  //   })
  //     .then(res => res.json())
  //     .then(() => {
  //       dispatch(fetchReels());
  //     })
  //     .catch(console.log);
  // };


    const { fcmToken } = useInstaContext();
      const likeReel = (item) => {
      const body = JSON.stringify({ userId: userData._id });
    
      fetch(`${backendURL}${LIKE_REEL}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      })
        .then((res) => res.json())
        .then(async () => {
          // ✅ Refresh Redux reels
          dispatch(fetchReels());
    
          // ✅ Prepare notification payload
          const payload = {
            token: fcmToken, // 👈 FCM token of reel owner (make sure you pass it with item)
            title: `${userData.username} liked your reel ❤️`,
            body: `${userData.username} liked your video`,
            senderId: userData._id,
            receiverId: item.userId, // reel owner
            profileImage: userData.profilePic || "",
            fileName: "",
            username: userData.username,
            screen: "notification",
            id: item._id,
          };
    
          // ✅ Send notification
          try {
            await axios.post(`${backendURL}/notification/send-notification`, payload);
            console.log("📤 Like notification sent to reel owner");
          } catch (err) {
            console.error("❌ Notification error:", err?.response?.data || err.message);
          }
        })
          .then(async () => {
    dispatch(fetchReels());

    // ✅ Log user activity (increment reelLikes by 1)
    try {
      await axios.post(`${backendURL}/user-activity/log`, {
        userId: userData._id,
        reelLikes: 1, // increment by 1
      });
      console.log("✅ Reel like logged in user activity");
    } catch (error) {
      console.error("❌ Error logging user activity:", error.message);
    }

    // ✅ Send notification (existing logic)
    const payload = {
      token: fcmToken,
      title: `${userData.username} liked your reel ❤️`,
      body: `${userData.username} liked your video`,
      senderId: userData._id,
      receiverId: item.userId,
      profileImage: userData.profilePic || "",
      fileName: "",
      username: userData.username,
      screen: "notification",
      id: item._id,
    };

    // await axios.post(`${backendURL}/notification/send-notification`, payload);
  })

        .catch((err) => {
          console.error("❌ Like API error:", err);
        });
    };
   

  const followUser = id => {
    const body = JSON.stringify({ userId: userData._id });
    fetch(`${backendURL}${FOLLOW_USER}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(res => res.json())
      .then(() => {
        dispatch(fetchReels());
      })
      .catch(console.log);
  };

  const checkFollow = id => {
    return userData?.following?.includes(id);
  };

  // const AdComponent = () => (
  //   <View style={{ height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
  //     <Text style={{ color: 'white', fontSize: 18 }}>Sponsored Ad</Text>
  //     <Image
  //       source={{ uri: 'https://via.placeholder.com/300x500.png?text=Ad' }}
  //       style={{ width: 300, height: 500, marginTop: 20 }}
  //       resizeMode="contain"
  //     />
  //   </View>
  // );

    const AdComponent = () => (  <AdReelItem /> );
  if (loading) {
    return <ReelsShimmer />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={reels}
        pagingEnabled
        keyExtractor={(item, index) => item?._id ? item._id : `ad-${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item?.type === 'ad') {
            return <AdComponent />;
          }
          return (
            <ShowReelsProfileItem
              data={item}
              index={index}
              currentIndex={currentIndex}
              isFollowed={checkFollow(item.userId)}
              onClickOptions={() => {
                setSelectedItem(item);
                setopenOption(true);
              }}
              onClickLike={() => likeReel(item)}
              onFollow={() => followUser(item.userId)}
              onReportOption={() => {
                setSelectedItem(item);
                setopenReport(true);
              }}
            />
          );
        }}
        ref={flatListRef}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        snapToInterval={height}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={route.params.index || 0}
      />
      <View style={styles.fixedButtons}>
        <TouchableOpacity style={styles.button}>
          <GradientButton title=" Back to Home " link="BottomTab" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryVv')}>
          <GradientButton title=" Explore Category " link="BottomTab" />
        </TouchableOpacity>
      </View>

      <ReelOptionModal
        visible={openOption}
        onClose={() => setopenOption(false)}
        onClick={x => {
          setopenOption(false);
          if (x === 2) deleteReel();
          else if (x === 1) setOpenUpdateModal(true);
        }}
      />
      <Loader visible={loading} />
      <ReelUpdateModal
        data={selectedItem}
        visible={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onClick={x => {
          setOpenUpdateModal(false);
          updateReel(x);
        }}
      />
      <ReelReportContentModal
        visible={openReport}
        onClose={() => setopenReport(false)}
        onClick={x => {
          setopenReport(false);
          if (x === 2) {
          } else if (x === 1) setOpenReportResionModal(true);
        }}
      />
      <ReelRepoartResionModal
        data={selectedItem}
        visible={openReportResionModal}
        onClose={() => setOpenReportResionModal(false)}
        onClick={x => {
          setOpenReportResionModal(false);
        }}
      />
    </SafeAreaView>
  );
};

export default ShowReelsProfile;

const styles = StyleSheet.create({
  reelContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'black',
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captionContainer: {
    flex: 1,
  },
  caption: {
    color: 'white',
    fontSize: 14,
  },
  iconsContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fixedButtons: {
    position: 'absolute',
    bottom: 10,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    paddingVertical: 5,
    borderRadius: 12,
  },
  button: {
    borderRadius: 5,
  },
});


// import {
//     Dimensions,
//     FlatList,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     ActivityIndicator,
//     TouchableOpacity,
// } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Entypo from 'react-native-vector-icons/Entypo';
// import backendURL, { DELETE_REEL, FOLLOW_USER, LIKE_REEL, REEL_VIEWS_POST, UPDATE_REEL, USER_REEL_DATA } from '../../utils/Strings';
// import Video from 'react-native-video';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// // import styles from '../reelsScreen/reelsStyle';
// import ShowReelsProfileItem from './ShowReelsProfileItem';
// import GradientButton from '../../components/comp/GradientButton';
// import { fetchReels } from '../../redux/ReelSlice';
// import ReelOptionModal from '../../components/reelComponents/ReelOptionModal';
// import Loader from '../../components/Loader';
// import ReelUpdateModal from '../../components/reelComponents/ReelUpdateModal';
// import ReelReportContentModal from '../../components/reelComponents/ReelReportContentModal';
// import ReelRepoartResionModal from '../../components/reelComponents/ReelRepoartResionModal';
// import ReelsShimmer from '../../components/simmereffect/ReelsShimmer';

// const { width, height } = Dimensions.get('window');

// const ShowReelsProfile = () => {
//     const { userData } = useSelector(s => s.auth);
//     const route = useRoute();
//     const flatListRef = useRef(null);
//     const [reels, setReels] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         getUserReelData(route.params.userId);
//     }, []);

//     const getUserReelData = async (id) => {
//         try {
//             const response = await fetch(`${backendURL}${USER_REEL_DATA}/${id}`);
//             const json = await response.json();
//             const reversedData = json.data.reverse();
//             setReels(reversedData);
//             setCurrentIndex(route.params.index || 0);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching reel data:", err);
//             setLoading(false);
//         }
//     };

//     const onViewRef = useRef(({ viewableItems }) => {
//         if (viewableItems.length > 0) {
//             setCurrentIndex(viewableItems[0].index);
//         }
//     });

//     // const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

//     /// @@@@@@@@@@@@@@ other code auto , backend an dfrontend logic from allCat .........
//     /// @@@@@@@@@@@@@@ other code auto , backend an dfrontend logic from allCat .........
//     /// @@@@@@@@@@@@@@ other code auto , backend an dfrontend logic from allCat .........
    
//      const isFocused = useIsFocused();
//   const navigation = useNavigation();
//   const params = useRoute().params;

//   const [videoList, setVideoList] = useState(params.videoList);
// //   const { reels } = useSelector(state => state.reel);
//   const dispatch = useDispatch();

// //   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(null);
// //   const flatListRef = useRef(null);
//   const [autoScroll, setAutoScroll] = useState(false);
//   const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);
//   const [videoDuration, setVideoDuration] = useState(5000); // Default video duration if unknown
//   const autoScrollTimeoutRef = useRef(null); // Reference for auto-scroll timeout
  

//       useEffect(() => {
//           if (!autoScroll && !tenSecondAutoScroll) return;
  
//           clearTimeout(autoScrollTimeoutRef.current); // Clear existing timer
//           const scrollTime = tenSecondAutoScroll ? 10000 : videoDuration;
  
//           autoScrollTimeoutRef.current = setTimeout(() => {
//               const nextIndex = currentIndex + 1;
//               if (flatListRef?.current && nextIndex < dataLength) {
//                   flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
//                   setCurrentIndex(nextIndex);
//               }
//           }, scrollTime);
  
//           return () => clearTimeout(autoScrollTimeoutRef.current);
//       }, [currentIndex, videoDuration, autoScroll, tenSecondAutoScroll]);

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         setIsPlaying(null);
//       };
//     }, [])
//   );

//   const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const index = viewableItems[0].index;
//       console.log("index id..  ", index)
//       incrementViewCount(index); // No check — allow multiple views
//       setCurrentIndex(index);
//       setIsPlaying(viewableItems[0].item.id);
//     }
//   }, []);

//   const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  
//     //  views logic
// const incrementViewCount = async (reelId) => {
//   try {
//     await axios.post(backendURL + REEL_VIEWS_POST + `/${reels[reelId]._id}`);
//     // await axios.post(`http://172.20.10.14:3000/reel/increaseView/${reelId}`);
//     console.log(`✅ View incremented for reel: ${reelId}`);
//     // console.log("view increased")
//   } catch (err) {
//     console.log(`❌ Failed to increment view for ${reelId}`, err);
//   }
// };

//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
// //   const {userData} = useSelector(s => s.auth);
//   const [openOption, setopenOption] = useState(false);
//   const [openReport, setopenReport] = useState(false);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);
//   const [openReportResionModal, setOpenReportResionModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
// //   const [loading, setLoading] = useState(false);

//     const deleteReel = () => {
//     setLoading(true);
//     fetch(`${backendURL}${DELETE_REEL}/${selectedItem._id}`, {method: 'DELETE'})
//       .then(res => res.json())
//       .then(() => {
//         setLoading(false);
//         dispatch(fetchReels());
//         setVideodata(videodata.filter(r => r._id !== selectedItem._id));
//       })
//       .catch(error => {
//         setLoading(false);
//         console.log(error);
//       });
//   };

//   const updateReel = caption => {
//     setLoading(true);
//     const body = JSON.stringify({
//       userId: userData._id,
//       caption: caption,
//       username: userData.username,
//     });

//     fetch(`${backendURL}${UPDATE_REEL}/${selectedItem._id}`, {
//       method: 'PUT',
//       headers: {'Content-Type': 'application/json'},
//       body,
//     })
//       .then(res => res.json())
//       .then(() => {
//         setLoading(false);
//         dispatch(fetchReels());
//       })
//       .catch(error => {
//         setLoading(false);
//         console.log(error);
//       });
//   };

//   const likeReel = item => {
//     const body = JSON.stringify({ userId: userData._id });
//     fetch(`${backendURL}${LIKE_REEL}/${item._id}`, {
//       method: 'PUT',
//       headers: {'Content-Type': 'application/json'},
//       body,
//     })
//       .then(res => res.json())
//       .then(() => {
//         dispatch(fetchReels());
//       })
//       .catch(console.log);
//   };

//   const followUser = id => {
//     const body = JSON.stringify({ userId: userData._id });
//     fetch(`${backendURL}${FOLLOW_USER}/${id}`, {
//       method: 'PUT',
//       headers: {'Content-Type': 'application/json'},
//       body,
//     })
//       .then(res => res.json())
//       .then(() => {
//         dispatch(fetchReels());
//       })
//       .catch(console.log);
//   };

//   const checkFollow = id => {
//     return userData?.following?.includes(id);
//   };

// //   // ✅ Show loader if data is missing or empty
// //   if (!reels || reels.length === 0 || !videoList || videoList.length === 0) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b1321' }}>
// //         <ActivityIndicator size="large" color="green" />
// //          <Text style={{color: 'white', marginTop: 10}}>Loading reels or no network...</Text>
// //       </View>
// //     );
// //   }


//     // if (loading) {
//     //     return (
//     //         // <View style={styles.loaderContainer}>
//     //         //     <ActivityIndicator size="large" color="red" />
//     //         // </View>
//     //               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b1321' }}>
//     //     <ActivityIndicator size="large" color="green" />
//     //      <Text style={{color: 'white', marginTop: 10}}>Loading reels or no network...</Text>
//     //   </View>
//     //     );
//     // }

//      if (loading) {
//         return <ReelsShimmer />;
//     }
//     // console.log("reels babu ", reels)
//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
//             <FlatList
//                 // ref={flatListRef}
//                 data={reels}
//                 pagingEnabled
//                 keyExtractor={(item, index) => item._id || index.toString()}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({item, index}) => (
//                     <ShowReelsProfileItem
//                       data={item}
//                       index={index}
//                       currentIndex={currentIndex}
//                                  isFollowed={checkFollow(item.userId)}
//                       onClickOptions={() => {
//                         setSelectedItem(item);
//                         setopenOption(true);
//                       }}
//                       onClickLike={() => likeReel(item)}
//                       onFollow={() => followUser(item.userId)}
//                       onReportOption={() => {
//                         setSelectedItem(item);
//                         setopenReport(true);
//                       }}
//                     //   flatListRef={flatListRef}
//                     //   dataLength={reels.length}
//                     //   isPlaying={index === currentIndex && isFocused}
//                     //   setCurrentIndex={setCurrentIndex}
//                     />
//                   )}

                      
//                 ref={flatListRef}
//                 initialNumToRender={5}
//                 maxToRenderPerBatch={10}
//                 windowSize={5}
//                 onViewableItemsChanged={handleViewableItemsChanged} // ✅ use correct one
//                 viewabilityConfig={viewConfigRef.current}
//                 // showsVerticalScrollIndicator={false}
//                 snapToInterval={height} // height of each page
//                 getItemLayout={(data, index) => ({
//                   length: height, 
//                   offset: height * index,   
//                   index,
//                 })}
//                 snapToAlignment="start"
//                 decelerationRate="fast"
//                 initialScrollIndex={route.params.index || 0}
//             />
//         <View style={styles.fixedButtons}>
//         <TouchableOpacity style={styles.button}>
//           <GradientButton title=" Back to Home " link="BottomTab" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryVv')}>
//           <GradientButton title=" Explore Category " link="BottomTab" />
//         </TouchableOpacity>
//       </View>

//         <ReelOptionModal
//         visible={openOption}
//         onClose={() => setopenOption(false)}
//         onClick={x => {
//           setopenOption(false);
//           if (x === 2) deleteReel();
//           else if (x === 1) setOpenUpdateModal(true);
//         }}
//       />
//       <Loader visible={loading} />
//       <ReelUpdateModal
//         data={selectedItem}
//         visible={openUpdateModal}
//         onClose={() => setOpenUpdateModal(false)}
//         onClick={x => {
//           setOpenUpdateModal(false);
//           updateReel(x);
//         }}
//       />
//       <ReelReportContentModal
//         visible={openReport}
//         onClose={() => setopenReport(false)}
//         onClick={x => {
//           setopenReport(false);
//           if (x === 2) {} // downloadPost()
//           else if (x === 1) setOpenReportResionModal(true);
//         }}
//       />
//       <ReelRepoartResionModal
//         data={selectedItem}
//         visible={openReportResionModal}
//         onClose={() => setOpenReportResionModal(false)}
//         onClick={x => {
//           setOpenReportResionModal(false);
//           // reportPost(x);
//         }}
//       />
//         </SafeAreaView>
//     );
// };

// export default ShowReelsProfile;

// const styles = StyleSheet.create({
//     reelContainer: {
//         width: width,
//         height: height,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         backgroundColor: 'black',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         position: 'absolute',
//         backgroundColor: 'black',
//     },
//     overlay: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'flex-end',
//         padding: 20,
//     },
//     username: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     bottomContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     captionContainer: {
//         flex: 1,
//     },
//     caption: {
//         color: 'white',
//         fontSize: 14,
//     },
//     iconsContainer: {
//         alignItems: 'center',
//     },
//     iconText: {
//         color: 'white',
//         fontSize: 12,
//         marginBottom: 10,
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//     },
//     fixedButtons: {
//   position: 'absolute',
//   bottom: 4,
//   left: 4,
//   right: 4,
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   backgroundColor:'black',
//   paddingVertical: 5,
//   borderRadius:12 
// },
// button: {
//   borderRadius: 5,
// },
// });


// import {
//     Dimensions,
//     FlatList,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     TouchableOpacity,
//     Animated,
//     ActivityIndicator,
// } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Entypo from 'react-native-vector-icons/Entypo';
// import backendURL, { USER_REEL_DATA } from '../../utils/Strings';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/FontAwesome';
// // import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// // import AntDesign from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import GradientButton from '../newpostScreen/photopost/comp/GradientButton';
// import { useSelector } from 'react-redux';
// // const likeGif = require('../../assets');
// const likeGif = require('../../assets/likeGif/like.png');

// const { width, height } = Dimensions.get('window');

// const ShowReelsProfile = () => {
//     const { userData } = useSelector(s => s.auth);
//     const [reels, setReels] = useState([]);
//     const [data, setData] = useState(reels);


//     useEffect(() => {
//         getUserReelData(route.params.userId)
//     }, []);
//     const getUserReelData = id => {
//         fetch(backendURL + USER_REEL_DATA + '/' + id)
//             .then(res => res.json())
//             .then(json => {
//                 json.data.reverse();
//                 setReels(json.data);
//             });
//     };
//     // console.log("Reels data = ", reels)

//     const route = useRoute();
//     const [currentSong, setCurrentsong] = useState(route.params.index);
//     const ref = useRef(null);

//     useEffect(() => {
//         if (reels.length > 0 && currentSong < reels.length) {
//             setTimeout(() => {
//                 ref.current?.scrollToIndex({
//                     animated: true,
//                     index: currentSong,
//                 });
//             }, 500);
//         }
//     }, [reels]); // Run effect when `feeds` is updated
    


//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <View>
//                 <FlatList
//                     showsVerticalScrollIndicator={false}
//                     ref={ref}
//                     pagingEnabled
//                     data={reels}
//                     keyExtractor={(item, index) => item._id || index.toString()}
//                     renderItem={({ item, index }) => {
//                         return (
//                             <View style={styles.reelContainer} key={index}>
//                                 <Image source={{ uri: item.thumbnillurl }} style={styles.image} />
//                                 <Video source={{ uri: item.videourl }} style={styles.image}  />
//                                 <View style={styles.overlay}>

//                                     <View style={styles.bottomContainer}>
//                                         <View style={styles.captionContainer}>
//                                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                                 <Image source={{ uri: 'https://www.w3schools.com/howto/img_avatar2.png' }} style={{ width: 40, height: 40, borderRadius: 50, marginRight: 5 }} />
//                                                 <Text style={styles.username}>@{item.username}</Text>
//                                             </View>
//                                             <Text style={styles.caption}>{item.caption}🥰😎</Text>
//                                         </View>

//                                         <View style={styles.iconsContainer}>
//                                             <AntDesign name="hearto" size={24} color="white" />
//                                             <Text style={styles.iconText}>325k</Text>
//                                             <Feather name="message-circle" size={24} color="white" />
//                                             <Text style={styles.iconText}>22k</Text>
//                                             <Entypo name="share" size={24} color="white" />
//                                             <Text style={styles.iconText}>86k</Text>
//                                             <Feather name="eye" size={24} color="white" />
//                                             <Text style={styles.iconText}>{item.views}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             </View>
//                         );
//                     }}
//         // ref={flatListRef}
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={5}

//                 />

//     </View>
//         </SafeAreaView>
//     );
// };

// export default ShowReelsProfile;


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     reelContainer: {
//         width: width,
//         height: height,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         backgroundColor:'black'
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         position: 'absolute',
//         backgroundColor:'black',
//         borderRadius:10,
//     },
//     overlay: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'flex-end',
//         padding: 20,
//     },
//     username: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     bottomContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     captionContainer: {
//         flex: 1,
//     },
//     caption: {
//         color: 'white',
//         fontSize: 14,
//     },
//     iconsContainer: {
//         alignItems: 'center',
//     },
//     iconText: {
//         color: 'white',
//         fontSize: 12,
//         marginBottom: 10,
//     },
// });




// import {
//     Dimensions,
//     FlatList,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
//     Image,
//     TouchableOpacity,
//     Animated,
//     ActivityIndicator,
// } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Entypo from 'react-native-vector-icons/Entypo';
// import backendURL, { USER_REEL_DATA } from '../../utils/Strings';
// import Video from 'react-native-video';
// import styles from '../reelsScreen/reelsStyle';
// import Icon from 'react-native-vector-icons/FontAwesome';
// // import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// // import AntDesign from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import GradientButton from '../newpostScreen/photopost/comp/GradientButton';
// import { useSelector } from 'react-redux';
// // const likeGif = require('../../assets');
// const likeGif = require('../../assets/likeGif/like.png');

// const { width, height } = Dimensions.get('window');

// const ShowReelsProfile = () => {
//     const flatListRef = useRef(null);
//     const { userData } = useSelector(s => s.auth);
//     const [reels, setReels] = useState([]);
//     const [data, setData] = useState(reels);
//     useEffect(() => {
//         getUserReelData(route.params.userId)
//     }, []);
//     const getUserReelData = id => {
//         fetch(backendURL + USER_REEL_DATA + '/' + id)
//             .then(res => res.json())
//             .then(json => {
//                 json.data.reverse();
//                 setReels(json.data);
//             });
//     };
//     // console.log("Reels data = ", reels)

//     const route = useRoute();
//     const [currentSong, setCurrentsong] = useState(route.params.index);
//     const ref = useRef(null);

//     useEffect(() => {
//         if (reels.length > 0 && currentSong < reels.length) {
//             setTimeout(() => {
//                 ref.current?.scrollToIndex({
//                     animated: true,
//                     index: currentSong,
//                 });
//             }, 500);
//         }
//     }, [reels]); // Run effect when `feeds` is updated
    
//     // 2222222222222222222222222222222
//       const isFocused = useIsFocused();
    
//       const navigation = useNavigation();
//       const [currentIndex, setCurrentIndex] = useState(0);
//       const [isPlaying, setIsPlaying] = useState(null);
//     //   const flatListRef = useRef(null);
//       const [autoScroll, setAutoScroll] = useState(false);
//       const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);
    
//     //   const { reels } = useSelector(s => s.reel);
     
//       useFocusEffect(
//         useCallback(() => {
//           return () => {
//             setIsPlaying(null); // Stop playing videos when unfocused
//           };
//         }, []),
//       );
    
//       const handleViewableItemsChanged = useCallback(({viewableItems}) => {
//         if (viewableItems.length > 0) {
//           const index = viewableItems[0].index;
//           setCurrentIndex(index);
//           setIsPlaying(viewableItems[0].item.id); // Only play the visible video
//         }
//       }, []);
    
//       const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

//     //   23456789999999922222222222222222222222

//       const [follow, setFollow] = useState(false);
//       const [isBuffering, setIsBuffering] = useState(false);
//       const [muted, setMuted] = useState(false);;
//       const [videoDuration, setVideoDuration] = useState(5000); // Default video duration if unknown
//       const [loading, setLoading] = useState(false);
//       const [showMuteIcon, setShowMuteIcon] = useState(false);
//       const [modalVisible, setModalVisible] = useState(false);
//       const [showLikeAnimation, setShowLikeAnimation] = useState(false);
//       const [like, setLike] = useState(false);
//       const autoScrollTimeoutRef = useRef(null); // Reference for auto-scroll timeout
  
//       const handleMute = () => {
//           setMuted(!muted);
//           setShowMuteIcon(true);
//           setTimeout(() => setShowMuteIcon(false), 1000);
//       };
  
//       const handleLike = () => {
//           setLike(prev => !prev);
//           setShowLikeAnimation(true);
//           startFlipAnimation();
//           setTimeout(() => setShowLikeAnimation(false), 600);
//       };
  
//       const flipAnim = useRef(new Animated.Value(0)).current;
//       const [flipped, setFlipped] = useState(false);
  
  
//       useEffect(() => {
//           const interval = setInterval(() => {
//               setFlipped(prev => !prev);
//               startFlipAnimation();
//           }, 350);
//           return () => clearInterval(interval);
//       }, []);
  
//       const startFlipAnimation = () => {
//           flipAnim.setValue(0);
//           Animated.timing(flipAnim, {
//               toValue: 1,
//               duration: 500,
//               useNativeDriver: true,
//           }).start();
//       };
  
//       const flipRotation = flipAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: ['0deg', '180deg'],
//       });
  
  
//       useEffect(() => {
//           if (!autoScroll && !tenSecondAutoScroll) return;
  
//           clearTimeout(autoScrollTimeoutRef.current); // Clear existing timer
//           const scrollTime = tenSecondAutoScroll ? 10000 : videoDuration;
  
//           autoScrollTimeoutRef.current = setTimeout(() => {
//               const nextIndex = currentIndex + 1;
//               if (flatListRef?.current && nextIndex < dataLength) {
//                   flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
//                   setCurrentIndex(nextIndex);
//               }
//           }, scrollTime);
  
//           return () => clearTimeout(autoScrollTimeoutRef.current);
//       }, [currentIndex, videoDuration, autoScroll, tenSecondAutoScroll]);

      

//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <View>
//                 <FlatList
//                     showsVerticalScrollIndicator={false}
//                     showsHorizontalScrollIndicator={false}
//                     pagingEnabled
//                     data={reels}
//                     keyExtractor={(item, index) => item._id || index.toString()}
//                     renderItem={({ item, index }) => {
//                         return (
//                             <View
//                             style={{
//                                 height,
//                                 width,
//                                 justifyContent: 'center',
//                                 position: 'relative',
//                                 backgroundColor: 'black',
//                             }}
//                              key={index}>
//                             <TouchableOpacity activeOpacity={1} onPress={handleMute} style={{ flex: 1 }}>
//                                 {!item.videourl ? (
//                                     <>
//                                         <Image source={{ uri: item.thumbnillurl }} style={styles.thumbnail} />
//                                         <ActivityIndicator size="large" color="#13bd40" style={styles.spinner} />
//                                     </>
//                                 ) : (
//                                     <Video
//                                         source={{ uri: item.videourl }}
//                                         style={{
//                                             width: '100%',
//                                             height: '100%',
//                                             borderTopRightRadius: 20,
//                                             borderTopLeftRadius: 20,
//                                             overflow: 'hidden',
//                                         }}
//                                         muted={muted}
//                                         // paused={isPlaying !== data._id} // Play only the current video 
//                                         // paused={isPlaying !== item._id} // Play only the current video 
//                                         // paused={currentIndex !== index}
//                                         // paused={index === currentIndex && isFocused}
//                                         // paused={index !== currentIndex || !isFocused}
//                                         // paused={!isFocused}
//                                         paused={currentIndex !== index || !isFocused}
//                                         // paused={false}
//                                         // paused={!isPlaying} // ✅ Video only plays when it's the current one
//                                         // paused={index === currentIndex && isFocused} // ✅ Video only plays when it's the current one
//                                         resizeMode="cover"
//                                         repeat
//                                         onLoadStart={() => setLoading(true)}
//                                         // onLoad={() => setLoading(false)}
//                                         onLoad={(meta) => {
//                                             setLoading(false);
//                                             if (meta?.duration) {
//                                                 setVideoDuration(meta.duration * 1000); // Convert to ms
//                                             }
//                                         }}
//                                         onBuffer={({ isBuffering }) => setLoading(isBuffering)}
//                                         // onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)} //ustome
//                                         // onError={e => console.error('Video error: ', e)}
//                                         bufferConfig={{
//                                             minBufferMs: 7000,
//                                             maxBufferMs: 15000,
//                                             bufferForPlaybackMs: 2500,
//                                             bufferForPlaybackAfterRebufferMs: 5000,
//                                         }}
//                                         progressUpdateInterval={1000}
//                                     />
//                                 )}
                
//                                 {showMuteIcon && (
//                                     <View style={styles.muteIconContainer}>
//                                         {muted ? <Ionicons name={'volume-mute-sharp'} size={50} color="#fff" /> : <Icon name={'volume-up'} size={50} color="#fff" />}
//                                     </View>
//                                 )}
                
//                                 {loading && (
//                                     <ActivityIndicator
//                                         size="large"
//                                         color="white"
//                                         style={{
//                                             position: 'absolute',
//                                             top: '50%',
//                                             left: '50%',
//                                             transform: [{ translateX: -20 }, { translateY: -20 }],
//                                         }}
//                                     />
//                                 )}
//                             </TouchableOpacity>
                
//                             {isBuffering && (
//                                 <View style={{ 
//                                     position: 'absolute', 
//                                     top: 0, 
//                                     left: 0, 
//                                     right: 0, 
//                                     bottom: 0, 
//                                     justifyContent: 'center', 
//                                     alignItems: 'center', 
//                                     backgroundColor: 'rgba(0,0,0,0.1)' // optional dim
//                                 }}>
                                  
//                                     {/* You could also add a spinner or shimmer over the thumbnail */}
//                                     {/* <ActivityIndicator color="white" size="large" style={{ position: 'absolute' }} /> */}
//                                     <Image source={{ uri: data.thumbnillurl }} style={{ width: '100%', height: '100%' }}
//                                     resizeMode="cover" />
//                                     <ActivityIndicator size="large" color="#13bd40" style={styles.spinner} />
//                                 </View>
//                                 )}
                
                            
//                             {/* Camera button and auto-scroll toggles */}
                
//                             <View style={styles.camerabtn}>
//                                 <TouchableOpacity onPress={() => navigation.navigate('AddNewPost')}>
//                                     <Feather name="camera" style={{ fontSize: 35, color: 'white' }} />
//                                 </TouchableOpacity>
//                                 {/* Auto-scroll toggles */}
//                                 <TouchableOpacity onPress={() => setAutoScroll(!autoScroll)}>
//                                     <FontAwesome6
//                                         name={autoScroll ? 'toggle-on' : 'toggle-off'}
//                                         style={{
//                                             fontSize: 35,
//                                             color: autoScroll ? 'gray' : 'white',
//                                             marginTop: 10,
//                                         }}
//                                     />
//                                 </TouchableOpacity>
//                                 <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>
//                                     Auto Scroll
//                                 </Text>
                
//                                 <TouchableOpacity
//                                     onPress={() => setTenSecondAutoScroll(!tenSecondAutoScroll)}>
//                                     <FontAwesome6
//                                         name={tenSecondAutoScroll ? 'toggle-on' : 'toggle-off'}
//                                         style={{
//                                             fontSize: 35,
//                                             color: tenSecondAutoScroll ? 'gray' : 'white',
//                                             marginTop: 10,
//                                         }}
//                                     />
//                                 </TouchableOpacity>
//                                 <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>
//                                     10s Auto
//                                 </Text>
//                                 <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>
//                                     Scroll
//                                 </Text>
//                             </View>
                
                
//                             {/* Video category */}
//                             <View style={styles.videocategory}>
//                                 <Text style={styles.categoryText}>You</Text>
//                             </View>
                
//                             {/* Profile Image & Follow */}
//                             <View style={styles.profileContainer}>
//                                 <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
//                                 <Text style={styles.description}>{item.username}</Text>
//                                 {/* <TouchableOpacity style={{ width: follow ? 82 : 72 }} onPress={() => setFollow(!follow)}>
//                                     <View
//                                         style={{
//                                             width: '100%',
//                                             height: 30,
//                                             borderWidth: 1,
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                             borderColor: follow ? 'gray' : 'white',
//                                             borderRadius: 8,
//                                             marginLeft: 5,
//                                         }}>
//                                         <Text style={{ color: 'white', fontWeight: 'bold', opacity: 0.8 }}>
//                                             {follow ? 'Following' : 'Follow'}
//                                         </Text>
//                                     </View>
//                                 </TouchableOpacity> */}
//                             </View>
                
//                             {/* Profile Image and Description */}
//                             <View style={styles.discription}>
//                                 <Text style={styles.description}>
//                                     {item.caption}
//                                     {/* {data.caption}
//                                     {data.caption.length > 80
//                                         ? data.caption.slice(0, 80).toLowerCase() + '...'
//                                         : data.caption.toUpperCase()} */}
//                                 </Text>
//                             </View>
                
//                             <View style={styles.craditbox}>
//                                 <Text style={{ color: 'white' }} >
//                                     {' '}
//                                     <Text style={{ color: 'green', fontWeight: 'bold' }}>
//                                         Cradit
//                                     </Text> :{' '}
//                                     <Text style={{ color: '#1668db', fontWeight: 'bold' }}>@ </Text>
//                                     {'elvish_yadav'}
//                                 </Text>
//                             </View>
                
//                             {/* Like, Comment, Share */}
//                             <View style={styles.iconContainer}>
//                                 <TouchableOpacity onPress={handleLike} style={styles.iconbackground}>
//                                     <AntDesign
//                                         name={like ? 'heart' : 'hearto'}
//                                         style={{
//                                             fontSize: 25,
//                                             color: like ? 'red' : 'white',
//                                             marginTop: 0,
//                                         }}
//                                     />
//                                 </TouchableOpacity>
                
//                                 {showLikeAnimation && (
//                                     <View style={styles.containerLike}>
//                                         <Animated.Image
//                                             source={likeGif}
//                                             style={[styles.giflike, { transform: [{ rotateY: flipRotation }] }]}
//                                         />
//                                     </View>
//                                 )}
//                                 <Text style={styles.actionCount}>325k</Text>
                
//                                 <TouchableOpacity onPress={() =>
//                                     navigation.push('ReelComments', {
//                                         id: item._id,
//                                     })
//                                 }>
//                                     <MaterialCommunityIcons name="comment-text-outline" style={styles.icon} />
//                                 </TouchableOpacity>
//                                 <Text style={styles.actionCount}>{item.comments.length}</Text>
                
//                                 <TouchableOpacity>
//                                     <FontAwesome name="share" style={styles.icon} />
//                                 </TouchableOpacity>
//                                 <Text style={styles.actionCount}>86k</Text>
                
//                                 <TouchableOpacity>
//                                     <FontAwesome name="eye" style={styles.icon} />
//                                 </TouchableOpacity>
//                                 <Text style={styles.actionCount}>861k</Text>
                
//                                 <TouchableOpacity onPress={() => setModalVisible(true)}>
//                                     <Feather name="more-vertical" style={styles.icon} />
//                                 </TouchableOpacity>
//                             </View>
// {/*                 
//                             <Modal
//                                 animationType="slide"
//                                 transparent
//                                 visible={modalVisible}
//                                 onRequestClose={() => setModalVisible(false)}>
//                                 <View style={styles.modalContainer}>
//                                     <View style={styles.modalContent}>
//                                         <Text style={styles.modalText}>This is a pop-up message!</Text>
//                                         <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                                             <Text style={styles.closeButtonText}>Close</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                             </Modal> */}
//                         </View>
//                         );
//                     }}
//         // ref={flatListRef}
//         // ref={flatListRef}
//         ref={ref}
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//         // onViewableItemsChanged={handleViewableItemsChanged} // ✅ use correct one
//         onViewableItemsChanged={handleViewableItemsChanged} // ✅ use correct one
//         // onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewConfigRef.current}
//         // showsVerticalScrollIndicator={false}
//         getItemLayout={(data, index) => ({
//           length: height,
//           offset: height * index,   
//           index,
//         })}
//                 />
//                 <View style={styles.fixedButtons}>
//         <TouchableOpacity style={styles.button}>
//           <GradientButton
//             title=" Back to Home "
//             link="BottomTab"
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <GradientButton
//             title=" Explore Category "
//             link="BottomTab"
//           />
//         </TouchableOpacity>
//       </View>

//             </View>
//         </SafeAreaView>
//     );
// };

// export default ShowReelsProfile;


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     reelContainer: {
//         width: width,
//         height: height,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         backgroundColor:'black'
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         position: 'absolute',
//         backgroundColor:'black',
//         borderRadius:10,
//     },
//     overlay: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'flex-end',
//         padding: 20,
//     },
//     username: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     bottomContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     captionContainer: {
//         flex: 1,
//     },
//     caption: {
//         color: 'white',
//         fontSize: 14,
//     },
//     iconsContainer: {
//         alignItems: 'center',
//     },
//     iconText: {
//         color: 'white',
//         fontSize: 12,
//         marginBottom: 10,
//     },
// });

