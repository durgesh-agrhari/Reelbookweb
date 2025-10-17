import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AllCategoryItem from './AllCategoryItem';
import styles from '../reelsStyle';
import GradientButton from '../../../components/comp/GradientButton';
import backendURL, {
  DELETE_REEL,
  FOLLOW_USER,
  LIKE_REEL,
  REEL_VIEWS_POST,
  UPDATE_REEL,
} from '../../../utils/Strings';
import axios from 'axios';
import ReelOptionModal from '../../../components/reelComponents/ReelOptionModal';
import Loader from '../../../components/Loader';
import ReelUpdateModal from '../../../components/reelComponents/ReelUpdateModal';
import ReelReportContentModal from '../../../components/reelComponents/ReelReportContentModal';
import ReelRepoartResionModal from '../../../components/reelComponents/ReelRepoartResionModal';
import { fetchReels } from '../../../redux/ReelSlice';
import ReelsShimmer from '../../../components/simmereffect/ReelsShimmer';
import AdReelItem from '../AdReelItem';
import { useInstaContext } from '../../../context/InstaContext';

const { height } = Dimensions.get('window');

// Helper to insert ads
const insertAdsEveryNth = (data = [], n = 10) => {
  const result = [];
  data.forEach((item, index) => {
    result.push(item);
    if ((index + 1) % n === 0) {
      result.push({ _id: `ad-${index}`, isAd: true });
    }
  });
  return result;
};

// Simple Ad Component (replace with AdMob if needed)
const AdComponent = () => (
  <View style={{ height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
    <Text style={{ color: 'white', fontSize: 24 }}>Sponsored Ad</Text>
  </View>
);

const AllCategory = () => {
  const isFocused = useFocusEffect(() => () => setIsPlaying(null));
  const navigation = useNavigation();
  const params = useRoute().params;
  const dispatch = useDispatch();

  const { reels } = useSelector(state => state.reel);
  const { userData } = useSelector(state => state.auth);

  const [videoList, setVideoList] = useState(insertAdsEveryNth(params.videoList, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(null);
  const flatListRef = useRef(null);

  const [autoScroll, setAutoScroll] = useState(false);
  const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openReportResionModal, setOpenReportResionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      incrementViewCount(index);
      setCurrentIndex(index);
      setIsPlaying(viewableItems[0].item._id);
    }
  }, [videoList]);

  // const incrementViewCount = async (index) => {
  //   const item = videoList[index];
  //   if (item?.isAd) return;
  //   try {
  //     await axios.post(`${backendURL}${REEL_VIEWS_POST}/${item._id}`);
  //     // console.log(`✅ View incremented for reel: ${item._id}`);
  //   } catch (err) {
  //     console.log(`❌ Failed to increment view for ${item._id}`, err);
  //   }
  // };

  const incrementViewCount = async (index) => {
  try {
    const item = videoList[index];
    if (item?.isAd) return;

    // ✅ Increment view count for the reel
    await axios.post(`${backendURL}${REEL_VIEWS_POST}/${item._id}`);

    // ✅ Log user activity (reel scrolled)
    try {
      await axios.post(`${backendURL}/user-activity/log`, {
        userId: userData._id,
        reelsScrolled: 1, // increment by 1 scroll
      });
      // console.log(`✅ Reel scroll logged for reel: ${item._id}`);
    } catch (activityErr) {
      console.error("❌ Error logging reel scroll:", activityErr.message);
    }
  } catch (err) {
    console.error("❌ Failed to increment view:", err.message);
  }
};

  const deleteReel = () => {
    if (!selectedItem?._id) return;
    setLoading(true);
    fetch(`${backendURL}${DELETE_REEL}/${selectedItem._id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        dispatch(fetchReels());
        setVideoList(prev => prev.filter(r => r._id !== selectedItem._id));
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
      caption,
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
  //     .then(() => dispatch(fetchReels()))
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
      .then(() => dispatch(fetchReels()))
      .catch(console.log);
  };

  const checkFollow = id => userData?.following?.includes(id);

  if (!reels || reels.length === 0 || !videoList || videoList.length === 0) {
    return <ReelsShimmer />;
  }

  return (
    <View style={{ flex: 1, borderTopRightRadius: 20 }}>
      <StatusBar hidden={false} backgroundColor="#0b1321" barStyle="light-content" />

      <FlatList
        data={videoList}
        keyExtractor={(item, index) => item._id || `key-${index}`}
        renderItem={({ item, index }) =>
          item?.isAd ? (
            <AdReelItem />
          ) : (
            <AllCategoryItem
              data={item}
              index={index}
              currentIndex={currentIndex}
              flatListRef={flatListRef}
              dataLength={videoList.length}
              isPlaying={index === currentIndex && isFocused}
              setCurrentIndex={setCurrentIndex}
              autoScroll={autoScroll}
              tenSecondAutoScroll={tenSecondAutoScroll}
              setAutoScroll={setAutoScroll}
              setTenSecondAutoScroll={setTenSecondAutoScroll}
              screenActive={isFocused}
              cat={params?.selectedCategory}
              isFollowed={checkFollow(item.userId)}
              onClickOptions={() => {
                setSelectedItem(item);
                setOpenOption(true);
              }}
              onClickLike={() => likeReel(item)}
              onFollow={() => followUser(item.userId)}
              onReportOption={() => {
                setSelectedItem(item);
                setOpenReport(true);
              }}
            />
          )
        }
        pagingEnabled
        ref={flatListRef}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      <View style={styles.fixedButtons}>
        <TouchableOpacity style={styles.button}>
          <GradientButton title="Back to Home" link="BottomTab" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryVv')}>
          <GradientButton title="Explore Category" link="BottomTab" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ReelOptionModal
        visible={openOption}
        onClose={() => setOpenOption(false)}
        onClick={x => {
          setOpenOption(false);
          if (x === 2) deleteReel();
          else if (x === 1) setOpenUpdateModal(true);
        }}
      />
      <Loader visible={loading} />
      <ReelUpdateModal
        data={selectedItem}
        visible={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onClick={updateReel}
      />
      <ReelReportContentModal
        visible={openReport}
        onClose={() => setOpenReport(false)}
        onClick={x => {
          setOpenReport(false);
          if (x === 1) setOpenReportResionModal(true);
        }}
      />
      <ReelRepoartResionModal
        data={selectedItem}
        visible={openReportResionModal}
        onClose={() => setOpenReportResionModal(false)}
        onClick={x => {
          setOpenReportResionModal(false);
          // Implement reportPost(x) if needed
        }}
      />
    </View>
  );
};

export default AllCategory;


// import React, { useState, useRef, useCallback } from 'react';
// import {
//   View,
//   FlatList,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
//   TouchableOpacity,
//   Text,
// } from 'react-native';
// import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { useIsFocused } from '@react-navigation/native';
// import AllCategoryItem from './AllCategoryItem';
// import styles from '../reelsStyle';
// import GradientButton from '../../newpostScreen/photopost/comp/GradientButton';
// import backendURL, { DELETE_REEL, FOLLOW_USER, LIKE_REEL, REEL_VIEWS_POST, UPDATE_REEL } from '../../../utils/Strings';
// import axios from 'axios';
// import ReelOptionModal from '../../../components/reelComponents/ReelOptionModal';
// import Loader from '../../../components/Loader';
// import ReelUpdateModal from '../../../components/reelComponents/ReelUpdateModal';
// import ReelReportContentModal from '../../../components/reelComponents/ReelReportContentModal';
// import ReelRepoartResionModal from '../../../components/reelComponents/ReelRepoartResionModal';
// import { fetchReels } from '../../../redux/ReelSlice';
// import ReelsShimmer from '../../../components/simmereffect/ReelsShimmer';
// const { height } = Dimensions.get('window');

// const AllCategory = () => {
//   const isFocused = useIsFocused();
//   const navigation = useNavigation();
//   const params = useRoute().params;

//   const [videoList, setVideoList] = useState(params.videoList);
//   const { reels } = useSelector(state => state.reel);
//   const dispatch = useDispatch();

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(null);
//   const flatListRef = useRef(null);
//   const [autoScroll, setAutoScroll] = useState(false);
//   const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);

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
//     await axios.post(backendURL + REEL_VIEWS_POST + `/${videoList[reelId]._id}`);
//     // await axios.post(`http://172.20.10.14:3000/reel/increaseView/${reelId}`);
//     console.log(`✅ View incremented for reel: ${reelId}`);
//   } catch (err) {
//     console.log(`❌ Failed to increment view for ${reelId}`, err);
//   }
// };

//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   // @@@@@@@@@@@@@@@@@  backend code......
//   const {userData} = useSelector(s => s.auth);
//   const [openOption, setopenOption] = useState(false);
//   const [openReport, setopenReport] = useState(false);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);
//   const [openReportResionModal, setOpenReportResionModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(false);

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

//   // ✅ Show loader if data is missing or empty
//   if (!reels || reels.length === 0 || !videoList || videoList.length === 0) {
//     return <ReelsShimmer />;
//   }

//   return (
//     <View style={{ flex: 1, borderTopRightRadius: 20 }}>
//       <StatusBar hidden={false} backgroundColor="#0b1321" barStyle="light-content" />
      
//       <FlatList
//         data={videoList}
//         keyExtractor={(item, index) => item._id || index.toString()}
//         renderItem={({ item, index }) => (
//           <AllCategoryItem
//             data={item}
//             index={index}
//             currentIndex={currentIndex}
//             flatListRef={flatListRef}
//             dataLength={reels.length}
//             isPlaying={index === currentIndex && isFocused}
//             setCurrentIndex={setCurrentIndex}
//             autoScroll={autoScroll}
//             tenSecondAutoScroll={tenSecondAutoScroll}
//             setAutoScroll={setAutoScroll}
//             setTenSecondAutoScroll={setTenSecondAutoScroll}
//             screenActive={isFocused}
//             cat={params?.selectedCategory}

//             isFollowed={checkFollow(item.userId)}
//             onClickOptions={() => {
//               setSelectedItem(item);
//               setopenOption(true);
//             }}
//             onClickLike={() => likeReel(item)}
//             onFollow={() => followUser(item.userId)}
//             onReportOption={() => {
//               setSelectedItem(item);
//               setopenReport(true);
//             }}
//           />
//         )}
//         pagingEnabled
//         ref={flatListRef}
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//         onViewableItemsChanged={handleViewableItemsChanged} // ✅ use correct one
//         viewabilityConfig={viewConfigRef.current}
//         showsVerticalScrollIndicator={false}
//         getItemLayout={(data, index) => ({
//           length: height, 
//           offset: height * index,   
//           index,
//         })}
//         snapToAlignment="start"
//         decelerationRate="fast"
//       />

//       <View style={styles.fixedButtons}>
//         <TouchableOpacity style={styles.button}>
//           <GradientButton title=" Back to Home " link="BottomTab" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryVv')}>
//           <GradientButton title=" Explore Category " link="BottomTab" />
//         </TouchableOpacity>
//       </View>

//       <ReelOptionModal
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
//     </View>
//   );
// };

// export default AllCategory;



//working code 

// import React, {useState, useRef, useEffect, useCallback} from 'react';
// import {
//   View,
//   FlatList,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import axios from 'axios';
// import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
// import MotivationItem from './MotivationItem';
// import { useSelector } from 'react-redux';
// import AllCategoryItem from './AllCategoryItem';
// import styles from '../reelsStyle';
// import GradientButton from '../../newpostScreen/photopost/comp/GradientButton';
// import { useIsFocused } from '@react-navigation/native'; // ✅ Import this

// const {height, width} = Dimensions.get('window');

// const AllCategory = () => {
//   const isFocused = useIsFocused();

//   const navigation = useNavigation();
//   const params = useRoute().params;
//   const [videoList, setVideoList] = useState(params.videoList);
//   const {reels} = useSelector(s => s.reel);
//   // console.log("category wala all reels => ", reels)
//   // console.log("category wala all videolist => ", videoList)


//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(null);
//   const flatListRef = useRef(null);
//   const [autoScroll, setAutoScroll] = useState(false);
//   const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);

//   // const { reels } = useSelector(s => s.reel);
//   // const [videodata, setVideodata] = useState(() => {
//   //   const filteredReels= reels.map(reel=>{
//   //     if(reel.category.filter(cat=>cat.id=='1').length>0){
//   //       // console.log("hii", reel)
//   //       return reel;
//   //     }
//   //   }).filter(reel=> reel!=undefined)
//   //   console.log("filtered", filteredReels)
//   //     return filteredReels
//   // });

 
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         setIsPlaying(null); // Stop playing videos when unfocused
//       };
//     }, []),
//   );

//   const handleViewableItemsChanged = useCallback(({viewableItems}) => {
//     if (viewableItems.length > 0) {
//       const index = viewableItems[0].index;
//       setCurrentIndex(index);
//       setIsPlaying(viewableItems[0].item.id); // Only play the visible video
//     }
//   }, []);

//   const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
//   // const {reels} = useSelector(s => s.reel);
//   // console.log("reel video data 10 per page", reels)

//   return (
//     <View style={{flex: 1, borderTopRightRadius: 20}}>
//       <StatusBar
//         hidden={false}
//         backgroundColor="#0b1321"
//         barStyle="light-content"
//       />
//       <FlatList
//         data={videoList}
//         keyExtractor={(item, index) => item._id || index.toString()}
//         renderItem={({ item, index }) => (
//           <AllCategoryItem
//             data={item}
//             index={index}
//             currentIndex={currentIndex}
//             flatListRef={flatListRef}
//             dataLength={reels.length} // ✅ FIXED
//             isPlaying={index === currentIndex && isFocused} // ✅ ADD isFocused check
//             setCurrentIndex={setCurrentIndex}
//             // isPlaying={index === currentIndex} // ✅ FIXED
//             autoScroll={autoScroll}
//             tenSecondAutoScroll={tenSecondAutoScroll}
//             setAutoScroll={setAutoScroll}
//             setTenSecondAutoScroll={setTenSecondAutoScroll}
//             screenActive={isFocused} // ✅ Also pass separately if needed
//             cat={params?.selectedCategory}
//           />
//         )}
//         // onViewableItemsChanged={onViewRef.current}
//         pagingEnabled
//         ref={flatListRef}
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//         onViewableItemsChanged={handleViewableItemsChanged} // ✅ use correct one
//         // onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewConfigRef.current}
//         showsVerticalScrollIndicator={false}
//         getItemLayout={(data, index) => ({
//           length: height,
//           offset: height * index,   
//           index,
//         })}
//       />
//      <View style={styles.fixedButtons}>
//         <TouchableOpacity style={styles.button}>
//         <GradientButton
//               title=" Back to Home "
//               link="BottomTab"
//             />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryVv')}>
//         <GradientButton
//               title=" Explore Category "
//               link="BottomTab"
//             />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default AllCategory;







// import React, {useState, useRef, useEffect, useCallback} from 'react';
// import {
//   View,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   Image,
//   StatusBar,
//   Animated,
// } from 'react-native';

// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {data as initialData} from '../Database';
// import styles from '../reelsStyle';
// const likeGif = require('../../../assets/likeGif/like.png'); // Your GIF path
// import {
//   useNavigation,
//   useFocusEffect,
//   useRoute,
// } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import GradientButton from '../../newpostScreen/photopost/comp/GradientButton';
// import AllCategoryItem from './AllCategoryItem';

// const {height, width} = Dimensions.get('window');

// const AllCategory = () => {
//   const params = useRoute().params;
//   const navigation = useNavigation();
//   const [videoList, setVideoList] = useState(params.videoList);
//   const {reels} = useSelector(s => s.reel);
//   console.log("category wala all reels => ", reels)
//   console.log("category wala all videolist => ", videoList)

  
//   // const navigation = useNavigation();
//   // const [data, setData] = useState(
//   //   videoList.map(item => ({...item, showLikeAnimation: false})), // Add showLikeAnimation state to each item
//   // );
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(null);
//   const [videoDuration, setVideoDuration] = useState(5000); // Default video duration if unknown

//   const flatListRef = useRef(null);


//   // Handle video pause when navigating away
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         setIsPlaying(null); // Stop playing videos when unfocused
//       };
//     }, []),
//   );

//   const handleViewableItemsChanged = useCallback(({viewableItems}) => {
//     if (viewableItems.length > 0) {
//       const index = viewableItems[0].index;
//       setCurrentIndex(index);
//       setIsPlaying(viewableItems[0].item.id); // Only play the visible video
//     }
//   }, []);

//   const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});


//   return (
//     <View style={{flex: 1, borderTopRightRadius: 20}}>
//       <StatusBar
//         hidden={false}
//         backgroundColor="#0b1321"
//         barStyle="light-content"
//       />
//       <FlatList
//         data={videoList}
//         renderItem={({item}) => <AllCategoryItem data={item} cat={params?.selectedCategory}/>}
//         pagingEnabled
//         ref={flatListRef}
//         initialNumToRender={1} // Render only 1 item initially to save memory
//         maxToRenderPerBatch={2} // Render 2 items at a time
//         windowSize={2} // Increase flatlist performance by rendering fewer items offscreen
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewConfigRef.current}
//         showsVerticalScrollIndicator={false}
//         getItemLayout={(data, index) => ({
//           length: height,
//           offset: height * index,
//           index,
//         })} // Optimize list layout
//       />
  
//      <View style={styles.fixedButtons}>
//         <TouchableOpacity style={styles.button}>
//         <GradientButton
//               title=" Back to Home "
//               link="HomeScreen"
//             />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//         <GradientButton
//               title=" Explore Category "
//               link="VideoCategoryPage"
//             />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
      
// export default AllCategory;



// import React, {useState, useRef, useEffect, useCallback} from 'react';
// import {
//   View,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   Image,
//   StatusBar,
//   Animated,
// } from 'react-native';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import {data as initialData} from '../Database';
// import styles from '../reelsStyle';
// // const likeGif = require('../../../../assets/likeGif/like.png'); // Your GIF path
// const likeGif = require('../../../../assets/likeGif/like.png'); // Your GIF path
// import {useNavigation, useFocusEffect} from '@react-navigation/native';
// import GradientButton from '../../newpostScreen/photopost/comp/GradientButton';

// const {height, width} = Dimensions.get('window');
// const exp =
//   'https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png';
// const music =
//   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0pqNkbdmjxtSehC6hp0wkFRBPwW6GCqUbvv2Ngrhstg&s';

// const Gym = () => {
//   const navigation = useNavigation();
//   const [follow, setFollow] = useState(false);
//   const [data, setData] = useState(
//     initialData.map(item => ({...item, showLikeAnimation: false})), // Add showLikeAnimation state to each item
//   );
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(null);
//   const [autoScroll, setAutoScroll] = useState(false);
//   const [tenSecondAutoScroll, setTenSecondAutoScroll] = useState(false);
//   const [muted, setMuted] = useState(false);
//   const [showMuteIcon, setShowMuteIcon] = useState(false);
//   const [videoDuration, setVideoDuration] = useState(5000); // Default video duration if unknown

//   const flatListRef = useRef(null);
//   const autoScrollTimeoutRef = useRef(null); // Reference for auto-scroll timeout

//   // Handle auto-scroll with video duration or 10 seconds
//   useEffect(() => {
//     if (autoScroll || tenSecondAutoScroll) {
//       const scrollTime = tenSecondAutoScroll ? 10000 : videoDuration;
//       if (scrollTime > 0) {
//         autoScrollTimeoutRef.current = setTimeout(() => {
//           if (flatListRef.current && currentIndex < data.length - 1) {
//             flatListRef.current.scrollToIndex({index: currentIndex + 1});
//           }
//         }, scrollTime);
//       }
//     }

//     // Clear timeout when component is unmounted or settings change
//     return () => clearTimeout(autoScrollTimeoutRef.current);
//   }, [currentIndex, videoDuration, autoScroll, tenSecondAutoScroll]);

//   const handleLike = index => {
//     const updatedData = [...data];
//     updatedData[index].like = !updatedData[index].like; // Toggle like state for the specific item
//     updatedData[index].showLikeAnimation = true; // Show GIF animation for the specific item
//     setData(updatedData); // Update the data state with the new like state

//     setTimeout(() => {
//       const updatedDataWithHiddenAnimation = [...updatedData];
//       updatedDataWithHiddenAnimation[index].showLikeAnimation = false; // Hide the GIF after 500ms
//       setData(updatedDataWithHiddenAnimation);
//     }, 600);
//   };
//   //flip like img
//   const flipAnim = useRef(new Animated.Value(0)).current; // Animated value for flip
//   const [flipped, setFlipped] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFlipped(!flipped);
//       startFlipAnimation();
//     }, 350); // auto-flip every second

//     return () => clearInterval(interval); // Clean up on component unmount
//   }, [flipped]);

//   const startFlipAnimation = () => {
//     Animated.timing(flipAnim, {
//       toValue: flipped ? 0 : 1,
//       duration: 500, // Animation duration
//       useNativeDriver: true,
//     }).start();
//   };

//   const flipRotation = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '180deg'], // Rotate between 0 and 180 degrees
//   });

//   const handleMute = () => {
//     setMuted(!muted);
//     setShowMuteIcon(true);
//     setTimeout(() => setShowMuteIcon(false), 1000);
//   };

//   const handleLoad = meta => {
//     setVideoDuration(meta.duration * 1000); // Set video duration in milliseconds
//   };

//   // Handle video pause when navigating away
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         setIsPlaying(null); // Stop playing videos when unfocused
//       };
//     }, []),
//   );

//   const handleViewableItemsChanged = useCallback(({viewableItems}) => {
//     if (viewableItems.length > 0) {
//       const index = viewableItems[0].index;
//       setCurrentIndex(index);
//       setIsPlaying(viewableItems[0].item.id); // Only play the visible video
//     }
//   }, []);

//   const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

//   const renderItem = useCallback(
//     ({item, index}) => (
//       <View
//         style={{
//           height: height,
//           width: width,
//           justifyContent: 'center',
//           position: 'relative',
//         }}>
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={handleMute}
//           style={{flex: 1}}>
//           <Video
//             source={{uri: item.url}}
//             style={{width: '100%', height: '100%'}}
//             muted={muted}
//             paused={isPlaying !== item.id} // Play only the current video
//             resizeMode="cover"
//             repeat
//             onLoad={handleLoad} // Set video duration when loaded
//             bufferConfig={{
//               minBufferMs: 7000,
//               maxBufferMs: 15000,
//               bufferForPlaybackMs: 2500,
//               bufferForPlaybackAfterRebufferMs: 5000,
//             }}
//             onLoadStart={() => console.log('Loading video...')}
//             onBuffer={() => console.log('Buffering video...')}
//             onError={e => console.error('Video error: ', e)}
//             automaticallyWaitsToMinimizeStalling
//             progressUpdateInterval={1000} // Increase interval to avoid overloading with progress updates
//           />
//           {showMuteIcon && (
//             <View style={styles.muteIconContainer}>
//               <Icon
//                 name={muted ? 'volume-off' : 'volume-up'}
//                 size={50}
//                 color="#fff"
//               />
//             </View>
//           )}
//         </TouchableOpacity>

//         <View style={styles.camerabtn}>
//           <TouchableOpacity onPress={() => navigation.navigate('AddNewPost')}>
//             <Feather name="camera" style={{fontSize: 35, color: 'white'}} />
//           </TouchableOpacity>
//           {/* Auto-scroll toggles */}
//           <TouchableOpacity onPress={() => setAutoScroll(!autoScroll)}>
//             <FontAwesome6
//               name={autoScroll ? 'toggle-on' : 'toggle-off'}
//               style={{
//                 fontSize: 35,
//                 color: autoScroll ? 'gray' : 'white',
//                 marginTop: 10,
//               }}
//             />
//           </TouchableOpacity>
//           <Text style={{color: 'white', fontSize: 14, fontWeight: '500'}}>
//             Auto Scroll
//           </Text>

//           <TouchableOpacity
//             onPress={() => setTenSecondAutoScroll(!tenSecondAutoScroll)}>
//             <FontAwesome6
//               name={tenSecondAutoScroll ? 'toggle-on' : 'toggle-off'}
//               style={{
//                 fontSize: 35,
//                 color: tenSecondAutoScroll ? 'gray' : 'white',
//                 marginTop: 10,
//               }}
//             />
//           </TouchableOpacity>
//           <Text style={{color: 'white', fontSize: 14, fontWeight: '500'}}>
//             10s Auto
//           </Text>
//         </View>

//         {/* video category */}
//         <View style={styles.videocategory}>
//           <Text style={styles.categoryText}>Category : Gym</Text>

//           {/* Nature Profile */}
//           <View style={styles.profileRow}>
//             <TouchableOpacity>
//               <Image
//                 source={{uri: item.profilePic}}
//                 style={styles.profileImage}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.profileText}>Sports</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Animal Profile */}
//           <View style={styles.profileRow}>
//             <TouchableOpacity>
//               <Image
//                 source={{uri: item.profilePic}}
//                 style={styles.profileImage}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.profileText}>Cute girls</Text>
//             </TouchableOpacity>
//           </View>

//           {/* More Option */}
//           <View style={styles.moreRow}>
//             <TouchableOpacity>
//               <Image source={{uri: exp}} style={styles.moreIcon} />
//             </TouchableOpacity>
//             <TouchableOpacity
//             // onPress={() => navigation.navigate('VideoCategoryPage')}
//             >
//               <Text style={styles.moreText}>More</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Profile Image and Description */}
//         <View style={styles.profileContainer}>
//           <Image source={{uri: item.profilePic}} style={styles.profilePic} />
//           <Text style={styles.description}>ReelBook</Text>

//           <TouchableOpacity
//             style={{width: follow ? 82 : 72}}
//             onPress={() => setFollow(!follow)}>
//             <View
//               style={{
//                 width: '100%',
//                 height: 30,
//                 borderWidth: follow ? 1 : 1,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderColor: follow ? 'gray' : 'white',
//                 borderRadius: 8,
//                 marginLeft: 5,
//               }}>
//               <Text
//                 style={{
//                   color: follow ? 'white' : 'white',
//                   fontWeight: 'bold',
//                   opacity: 0.8,
//                 }}>
//                 {follow ? 'Following' : 'Follow'}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Profile Image and Description */}
//         <View style={styles.discription}>
//           <Text style={styles.description}>
//             {/* {item.description} */}
//             {item.description.length > 105
//               ? item.description.slice(0, 105).toLowerCase() + '...'
//               : item.description.toUpperCase()}
//           </Text>
//         </View>
//         <View style={styles.craditbox}>
//           <Text>
//             {' '}
//             <Text style={{color: 'green', fontWeight: 'bold'}}>
//               Cradit
//             </Text> :{' '}
//             <Text style={{color: '#1668db', fontWeight: 'bold'}}>@</Text>
//             {'elvish_yadav'}
//           </Text>
//         </View>

//         <View style={styles.iconContainer}>
//           <TouchableOpacity
//             onPress={() => handleLike(index)}
//             style={styles.iconbackground}>
//             <AntDesign
//               name={item.like ? 'heart' : 'hearto'}
//               style={{
//                 fontSize: 30,
//                 color: item.like ? 'red' : 'white',
//                 marginTop: 0,
//               }}
//             />
//           </TouchableOpacity>

//           {/* Like Animation (GIF shown when liked) */}
//           {item.showLikeAnimation && (
//             // <Image
//             //   source={likeGif}
//             //   style={[
//             //     styles.giflike,
//             //     {transform: [{scaleX: flipped ? -1 : 1}]},
//             //   ]}
//             // />
//             <View style={styles.containerLike}>
//               <Animated.Image
//                 source={require('../../../assets/likeGif/like.png')}
//                 style={[
//                   styles.giflike,
//                   {transform: [{rotateY: flipRotation}]}, // Flip animation using rotateY
//                 ]}
//               />
//             </View>
//           )}
//           <Text style={styles.actionCount}>325k</Text>
//           <TouchableOpacity>
//             <MaterialCommunityIcons
//               name="comment-text-outline"
//               style={styles.icon}
//             />
//           </TouchableOpacity>
//           <Text style={styles.actionCount}>22k</Text>

//           <TouchableOpacity>
//             <FontAwesome name="share" style={styles.icon} />
//           </TouchableOpacity>
//           <Text style={styles.actionCount}>86k</Text>

//           <TouchableOpacity>
//             <Feather name="more-vertical" style={styles.icon} />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('MusicScreen')}>
//             <Image source={{uri: music}} style={styles.musicImage} />
//           </TouchableOpacity>
//           <Text style={styles.musicText}>🎶</Text>
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#131517',
//             height:60,
//             margin:0,
//             padding:0,
//           }}>
//           <TouchableOpacity style={[styles.reelbtn,{marginTop:-10}]}>
//             <GradientButton
//               title="Back to Home"
//               link="HomeScreen"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.reelbtn,{marginTop:-10}]}
//             onPress={() => {
//               navigation.navigate('HomeScreen');
//             }}>
//             <GradientButton
//               title="Explore Category"
//               link="VideoCategoryPage"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     ),
//     [isPlaying, muted, showMuteIcon, autoScroll, tenSecondAutoScroll, data],
//   );

//   return (
//     <View style={{flex: 1, borderTopRightRadius: 20}}>
//       <StatusBar
//         hidden={false}
//         backgroundColor="#0b1321"
//         barStyle="light-content"
//       />
//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         pagingEnabled
//         ref={flatListRef}
//         initialNumToRender={1} // Render only 1 item initially to save memory
//         maxToRenderPerBatch={2} // Render 2 items at a time
//         windowSize={2} // Increase flatlist performance by rendering fewer items offscreen
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewConfigRef.current}
//         showsVerticalScrollIndicator={false}
//         getItemLayout={(data, index) => ({
//           length: height,
//           offset: height * index,
//           index,
//         })} // Optimize list layout
//       />
//     </View>
//   );
// };

// export default Gym;
