// EarningDashboard.js

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
// import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserPosts } from '../../../../redux/userProfileSlice/UserPostSlice';
import { fetchUserReels } from '../../../../redux/userProfileSlice/UserReelSlice';
import { fetchUserStories } from '../../../../redux/userProfileSlice/UserStorySlice';
import backendURL from '../../../../utils/Strings';
import axios from 'axios';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const EarningDashboard = () => {
  const navigation = useNavigation();
  const { userData } = useSelector(s => s.auth);
  const THEME = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const monthName = new Date().toLocaleString('default', { month: 'long' });


  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchUserPosts(userData._id));
      dispatch(fetchUserReels(userData._id));
      dispatch(fetchUserStories(userData._id));
    }
  }, [userData?._id]);

  const { data: posts } = useSelector(s => s.userPosts);
  const { data: reels } = useSelector(s => s.userReels);
  const { data: stories } = useSelector(s => s.userStories);

  const [views, setViews] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = userData?._id;

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        const response = await axios.get(`${backendURL}/reel/totalViewsByUser/${userId}`);
        setViews(response.data.totalViews || 0);
      } catch (error) {
        console.error('Error fetching total views:', error.message);
        setViews(0);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedPostCount = async () => {
      try {
        const res = await axios.get(`${backendURL}/post/likedPosts/count/${userId}`);
        setLikedCount(res.data.totalLikedPosts || 0);
      } catch (error) {
        console.error('Error fetching liked post count:', error);
      }
    };

    if (userId) {
      fetchTotalViews();
      fetchLikedPostCount();
    }
  }, [userId]);

  const reelsCount = reels?.length || 0;
  const postsCount = posts?.length || 0;
  const storiesCount = stories?.length || 0;
  const viewsCount = views || 0;
  const likesCount = likedCount || 0;

  const coinsFromReels = reelsCount * 5;
  const coinsFromPosts = postsCount * 2;
  const coinsFromStories = storiesCount * 1;
  const coinsFromViews = Math.floor(viewsCount / 10);
  const coinsFromLikes = Math.floor(likesCount / 10);

  const totalCoins =
    coinsFromReels + coinsFromPosts + coinsFromStories + coinsFromViews + coinsFromLikes;

  // import axios from 'axios';

  const handleUpdateEarnings = async () => {
    try {
      const userId = userData._id; // Make sure `user` exists
      const selectedMonth = '2025-08'; // Should be a valid string like '2025-08'
      // const selectedMonth = currentMonth; // Should be a valid string like '2025-08'
      const coins = 100;
      const breakdown = {
        reels: coinsFromReels || 0,
        posts: coinsFromPosts || 0,
        stories: coinsFromStories || 0,
        views: coinsFromViews || 0,
        likes: coinsFromLikes || 0,
      };

      await updateMonthlyEarnings({ userId, selectedMonth, coins, breakdown });
    } catch (err) {
      console.log('❌ Final error handler:', err.message);
    }
  };


  const updateMonthlyEarnings = async ({ userId, selectedMonth, coins, breakdown }) => {
    try {
      if (!userId || !selectedMonth || coins == null || !breakdown) {
        throw new Error('Missing required data for updating earnings');
      }

      const payload = {
        userId,
        month: selectedMonth, // e.g., '2025-08'
        coins,
        breakdown,
      };

      // console.log('Sending payload to backend:', payload);

      // const res = await axios.post('http://your-backend-url.com/api/earnings/update', payload);
      const res = await axios.post('https://reelbook-cgarbbexgdd5a5dn.canadacentral-01.azurewebsites.net/user-earnings/update', payload);
      // console.log('✅ Earnings updated successfully:', res.data);
      return res.data;
    } catch (err) {
      console.log('❌ Error updating monthly earnings:', err.message);
      if (err.response?.data) {
        console.log('Server response:', err.response.data);
      }
      throw err;
    }
  };

  useEffect(() => {
    if (userId && totalCoins > 0) {
      updateMonthlyEarnings();
      handleUpdateEarnings()
    }
  }, [totalCoins]);


  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (totalCoins >= 100) {
      setTimeout(() => {
        setShowCongrats(true);
      }, 1000);
    }
  }, [totalCoins]);

  const coinToRupee = (coins) => ((coins / 100) * 5).toFixed(2); // 100 coins = ₹5

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.data === 'LIGHT' ? 'white' : 'black' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} color={THEME.data === 'LIGHT' ? 'black' : 'white'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
          Your Rewards
        </Text>
        <View style={{ width: 30 }} />
      </View>

      {/* User Info */}
      <View style={styles.userBox}>
        <Image source={{ uri: userData?.profilePic }} style={styles.avatar} />
        <View style={{ marginLeft: 15 }}>
          <Text style={[styles.userName, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
            Hello, {userData?.name}
          </Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>
            You have posted {reelsCount} Reels, {postsCount} Posts, {storiesCount} Stories
          </Text>
        </View>
      </View>

      {/* Coin Summary */}
      <Animatable.View animation="bounceIn" style={styles.coinBox}>
        <Text style={{ color: 'green', alignSelf: 'center', fontSize: 14, fontWeight: '600' }}>
          This month earning, {monthName}
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Image
            source={require('../../../../assets/logo/earning.png')}
            style={{ width: 100, height: 100, marginRight: 30 }}
          />
          <View>
            <Text style={styles.coinText}>{totalCoins} Coins</Text>
            <Text style={styles.rupeeText}>₹ {coinToRupee(totalCoins)}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* <TouchableOpacity style={{ backgroundColor: 'green', marginHorizontal: 18, padding: 10, borderRadius: 10 }} onPress={() => navigation.navigate('EarningHistory')}>
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 14, fontWeight: '600' }}>View Payout History</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{ backgroundColor: 'green', marginHorizontal: 18, padding: 10, borderRadius: 10 }}
        onPress={() => navigation.navigate('EarningHistory', {
          coins: totalCoins,
          rupees: coinToRupee(totalCoins),
        })}
      >
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 14, fontWeight: '600' }}>
          View Payout History
        </Text>
      </TouchableOpacity>

      {/* Breakdown */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.breakdownContainer}>
          <RewardItem title="Reels" count={reelsCount} coin={5} />
          <RewardItem title="Posts" count={postsCount} coin={2} />
          <RewardItem title="Stories" count={storiesCount} coin={1} />
          <RewardItem title="Views" count={Math.floor(viewsCount / 10)} coin={1} />
          <RewardItem title="Likes" count={Math.floor(likesCount / 10)} coin={1} />
        </View>

        <Text style={{ alignSelf: 'center', fontSize: 20, color: 'green', fontWeight: 'bold' }}> -: Rules :-</Text>

        <TouchableOpacity>
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>
              Step 1 : Upload 50 Short Videos and 30 pictures
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>
              Step 2 : 1 hour daily activity required
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={[styles.stepBox, styles.greenBox]}>
            <Text style={styles.stepText}>
              Step 3 : Video must not violate policy
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>
              Step 4 : Don’t upload sexual content.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>
              Step 5: Now you are eligible for earning.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={[styles.stepBox, { backgroundColor: '#c29a4c' }]}>
            <Text style={styles.stepText}>
              Note :- You can make fan page and earn also
            </Text>
            <Text style={styles.stepText}>
              Note :- 100 coins value ₹5
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* 🎉 Congrats Modal */}
      <Modal isVisible={showCongrats} onBackdropPress={() => setShowCongrats(false)}>
        <View style={styles.modalView}>
          {/* You can uncomment Lottie if you add animation file */}
          {/* <LottieView
            source={require('../../../../assets/likeGif/welcome.json')}
            autoPlay
            loop={false}
            style={{ height: 200 }}
          /> */}
          {/* <Video source={require('../../../../assets/likeGif/welcome.gif')} style={{width:100, height:100}} /> */}

          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={{ textAlign: 'center', color: '#555' }}>
            You've earned over 100 coins and unlocked a reward!
          </Text>
          <TouchableOpacity onPress={() => setShowCongrats(false)} style={styles.dismissBtn}>
            <Text style={{ color: 'white' }}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const RewardItem = ({ title, count, coin }) => (
  <View style={styles.rewardItem}>
    <Text style={styles.rewardTitle}>{title}</Text>
    <Text style={styles.rewardCount}>{count} × {coin}</Text>
    <Text style={styles.rewardCoin}>{count * coin} Coins</Text>
  </View>
);

export default EarningDashboard;

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'gold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinBox: {
    // flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },
  coinText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f9a825',
    marginTop: 10,
  },
  rupeeText: {
    fontSize: 16,
    color: '#444',
  },
  breakdownContainer: {
    padding: 15,
  },
  rewardItem: {
    backgroundColor: '#e8eaf6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardCount: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  rewardCoin: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 10,
  },
  dismissBtn: {
    marginTop: 15,
    backgroundColor: '#388e3c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  }, stepBox: {
    paddingVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#2b303b',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    paddingLeft: 10,
    marginTop: 15,
    opacity: 0.8,
  },
  greenBox: {
    backgroundColor: '#227023',
  },
  stepText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


// // EarningDashboard.js

// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Modal from 'react-native-modal';
// import * as Animatable from 'react-native-animatable';
// import LottieView from 'lottie-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { fetchUserPosts } from '../../../../redux/userProfileSlice/UserPostSlice';
// import { fetchUserReels } from '../../../../redux/userProfileSlice/UserReelSlice';
// import { fetchUserStories } from '../../../../redux/userProfileSlice/UserStorySlice';
// import backendURL from '../../../../utils/Strings';
// import axios from 'axios';


// const { width } = Dimensions.get('window');

// const EarningDashboard = () => {
//   const navigation = useNavigation();
//   const { userData } = useSelector(s => s.auth);
//   const THEME = useSelector(state => state.theme);
//   console.log("user data ", userData)

//   //  const { userData } = useSelector(s => s.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (userData?._id) {
//       dispatch(fetchUserPosts(userData._id));
//       dispatch(fetchUserReels(userData._id));
//       dispatch(fetchUserStories(userData._id));
//     }
//   }, [userData?._id]);

//   const { data: posts, loading: loadingPosts } = useSelector(s => s.userPosts);
//   const { data: reels, loading: loadingReels } = useSelector(s => s.userReels);
//   const { data: stories, loading: loadingStories } = useSelector(s => s.userStories);

//   const [feeds, setFeeds] = useState(posts);
//   // const [reels, setReels] = useState([]);
//   const [storys, setStorys] = useState(stories);
//   console.log("er reel", reels.length, " er posts", feeds.length, "er story", storys.length)

//   const [views, setViews] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Replace this with the logged-in user's ID dynamically if needed
//   const userId = userData._id;
//   console.log("userid", userId)
//   console.log("total views", views)

//   useEffect(() => {
//     const fetchTotalViews = async () => {
//       try {
//         const response = await axios.get(`${backendURL}/reel/totalViewsByUser/${userId}`);
//         setViews(response.data.totalViews);
//       } catch (error) {
//         console.error('Error fetching total views:', error.message);
//         setViews(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTotalViews();
//   }, [userId]);

//    const [likedCount, setLikedCount] = useState(0);

//   const fetchLikedPostCount = async () => {
//     try {
//       const res = await axios.get(
//         `${backendURL}/post/likedPosts/count/${userId}`
//       );
//       setLikedCount(res.data.totalLikedPosts);
//     } catch (error) {
//       console.error('Error fetching liked post count:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLikedPostCount();
//   }, []);

//   console.log("like count ", likedCount)

//   const [totalCoins, setTotalCoins] = useState(0);
//   const [showCongrats, setShowCongrats] = useState(false);

//   // Dummy earned data (could be fetched)
//   const earnedData = {
//     reels: 25, // 25 * 5 = 125
//     posts: 40, // 40 * 2 = 80
//     stories: 50, // 50 * 1 = 50
//   };

//   useEffect(() => {
//     const coins =
//       earnedData.reels * 5 + earnedData.posts * 2 + earnedData.stories * 1;
//     setTotalCoins(coins);

//     if (coins >= 100) {
//       setTimeout(() => {
//         setShowCongrats(true);
//       }, 1000);
//     }
//   }, []);

//   const coinToRupee = (coins) => ((coins / 100) * 5).toFixed(2);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: THEME.data === 'LIGHT' ? 'white' : 'black' }}>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back-outline" size={30} color={THEME.data === 'LIGHT' ? 'black' : 'white'} />
//         </TouchableOpacity>
//         <Text style={[styles.headerText, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
//           Your Rewards
//         </Text>
//         <View style={{ width: 30 }} />
//       </View>

//       {/* User Info */}
//       <View style={styles.userBox}>
//         <Image source={{ uri: userData?.profilePic }} style={styles.avatar} />
//         <View style={{ marginLeft: 15 }}>
//           <Text style={[styles.userName, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
//             Hello, {userData?.name}
//           </Text>
//           <Text style={{ fontSize: 14, color: 'gray' }}>Keep earning by creating!</Text>
//         </View>
//       </View>

//       {/* Coin Summary */}
//       <Animatable.View animation="bounceIn" style={styles.coinBox}>
//         <Image
//           source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4021/4021819.png' }}
//           style={{ width: 50, height: 50 }}
//         />
//         <Text style={styles.coinText}>{totalCoins} Coins</Text>
//         <Text style={styles.rupeeText}>₹ {coinToRupee(totalCoins)}</Text>
//       </Animatable.View>

//       {/* Breakdown */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
//         <View style={styles.breakdownContainer}>
//           <RewardItem title="Reels" count={earnedData.reels} coin={5} />
//           <RewardItem title="Posts" count={earnedData.posts} coin={2} />
//           <RewardItem title="Stories" count={earnedData.stories} coin={1} />
//         </View>
//       </ScrollView>

//       {/* 🎉 Congrats Modal */}
//       <Modal isVisible={showCongrats} onBackdropPress={() => setShowCongrats(false)}>
//         <View style={styles.modalView}>
//           {/* <LottieView
//             source={require('../../../../assets/congrats.json')} // Add your animation here
//             autoPlay
//             loop={false}
//             style={{ height: 200 }}
//           /> */}
//           <Text style={styles.congratsText}>Congratulations!</Text>
//           <Text style={{ textAlign: 'center', color: '#555' }}>
//             You've earned over 100 coins and unlocked a reward!
//           </Text>
//           <TouchableOpacity onPress={() => setShowCongrats(false)} style={styles.dismissBtn}>
//             <Text style={{ color: 'white' }}>Dismiss</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const RewardItem = ({ title, count, coin }) => (
//   <View style={styles.rewardItem}>
//     <Text style={styles.rewardTitle}>{title}</Text>
//     <Text style={styles.rewardCount}>{count} items</Text>
//     <Text style={styles.rewardCoin}>{count * coin} Coins</Text>
//   </View>
// );

// export default EarningDashboard;

// const styles = StyleSheet.create({
//   header: {
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   userBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     margin: 15,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: 'gold',
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   coinBox: {
//     margin: 15,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   coinText: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#f9a825',
//     marginTop: 10,
//   },
//   rupeeText: {
//     fontSize: 16,
//     color: '#444',
//   },
//   breakdownContainer: {
//     padding: 15,
//   },
//   rewardItem: {
//     backgroundColor: '#e8eaf6',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//   },
//   rewardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   rewardCount: {
//     fontSize: 14,
//     marginTop: 5,
//     color: '#555',
//   },
//   rewardCoin: {
//     fontSize: 16,
//     color: '#1b5e20',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   modalView: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//   },
//   congratsText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#388e3c',
//     marginBottom: 10,
//   },
//   dismissBtn: {
//     marginTop: 15,
//     backgroundColor: '#388e3c',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
// });


// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import React from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Header from './Header';
// import {Divider, Image} from 'react-native-elements';
// import {useNavigation} from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useSelector} from 'react-redux';
// import { color1 } from '../../../../utils/Colors';

// const EarningDestboard = () => {
//   const navigation = useNavigation();
//   const {userData} = useSelector(s => s.auth);
//   const THEME  = useSelector(state=>state.theme)
//   const data = [
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//     {
//       rupies: 234,
//     },
//   ];
//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor:  THEME.data == 'LIGHT' ? 'white' : 'black'}}>
//       {/* <Header /> */}
//       <View
//         style={{
//           flexDirection: 'row',
//           padding: 10,
//           justifyContent: 'space-between',
//         }}>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.goBack();
//           }}>
//           <Ionicons size={30} name="arrow-back-outline" style={{color: THEME.data == 'LIGHT' ? 'black' : 'white'}} />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.goBack();
//           }}>
//           <Text style={{color: THEME.data == 'LIGHT' ? 'black' : 'white', fontSize: 20}}>Back</Text>
//         </TouchableOpacity>
//       </View>
//       <Divider width={1} />
//       <ScrollView>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             height: 80,
//             alignItems: 'center',
//             paddingHorizontal: 20,
//             marginTop:10
//           }}>
//           <View style={{flexDirection: 'row', alignItems: 'center'}}>
//             <Image source={{uri:userData?.profilePic}} style={styles.imgav} />
//             <View style={{marginLeft: 10}}>
//               <Text style={{fontSize: 14, fontWeight: 'bold', color: THEME.data == 'LIGHT' ? 'black' : 'white'}}>
//                 Hi, {userData?.name}
//               </Text>
//               <Text style={{fontSize: 16, fontWeight: 'bold', color: THEME.data == 'LIGHT' ? 'black' : 'white'}}>
//                 Your Performance
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.btn}>
//             <Text style={{color:THEME.data == 'LIGHT' ? 'black' : 'white'}}>My Transactions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.earnigbox}>
//           <View>
//             <Text
//               style={{
//                 color: 'white',
//                 fontSize: 18,
//                 fontWeight: 'bold',
//                 opacity: 0.6,
//               }}>
//               Your Earning
//             </Text>
//             <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold'}}>
//               $1475.
//               <Text
//                 style={{
//                   color: 'white',
//                   fontSize: 22,
//                   fontWeight: 'bold',
//                   opacity: 0.7,
//                 }}>
//                 00
//               </Text>
//             </Text>
//           </View>

//           <View>
//             <TouchableOpacity

//               style={{
//                 backgroundColor: 'green',
//                 borderRadius: 10,
//                 borderRightWidth: 2,
//                 borderLeftWidth: 2,
//                 borderColor: 'gold',
//                 padding: 5,
//                 paddingLeft: 5,
//                 paddingRight: 5,
//               }}>
//               <Text style={{fontWeight: 'bold', fontSize: 16}}>
//                 {' '}
//                 <Text style={{color: 'gold', fontWeight: 'bold', fontSize: 18}}>
//                   ${' '}
//                 </Text>
//                 Withdraw
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View>
//             <View style={{alignItems: 'center'}}>
//               <Image
//                 source={{
//                   uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2OFGTX_S9j3Xgg8EQUj_nHbWeJs6wsdW5VBwKRfn6MHctItE2_zJO5DTtFopGnbm1BzY&usqp=CAU',
//                 }}
//                 style={{
//                   width: 100,
//                   height: 50,
//                   borderRadius: 5,
//                 }}
//               />
//             </View>
//           </View>
//         </View>

//         <View style={{flexDirection: 'row'}}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {data.map((data, index) => (
//               <View style={styles.subbox} key={index}>
//                 <Text
//                   style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>
//                   Last Month
//                 </Text>
//                 <Text
//                   style={{
//                     color: 'blue',
//                     fontWeight: 'bold',
//                     fontSize: 14,
//                     opacity: 0.7,
//                   }}>
//                   Payout
//                 </Text>
//                 <Text style={{fontWeight: 'bold', fontSize: 14}}>
//                   $ {data.rupies}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//         <View>
//           <Text
//             style={{
//               fontSize: 18,
//               fontWeight: 'bold',
//               marginLeft: 15,
//               marginTop: 15,
//               color: THEME.data == 'LIGHT' ? 'black' : 'white',
//             }}>
//             Rules For Monitazation
//           </Text>
//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingVertical: 10,
//                 marginHorizontal: 15,
//                 backgroundColor: '#2b303b',
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: 'white',
//                 paddingLeft: 10,
//                 marginTop: 30,
//                 opacity: 0.8,
//               }}>
//               <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
//                 Step 1 : Uploade 50 Sort Video and 30 pictures
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingVertical: 10,
//                 marginHorizontal: 15,
//                 backgroundColor: '#2b303b',
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: 'white',
//                 paddingLeft: 10,
//                 marginTop: 15,
//                 opacity: 0.8,
//               }}>
//               <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
//                 Step 2 : 1 hours daily activity require
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingVertical: 10,
//                 marginHorizontal: 15,
//                 backgroundColor: '#227023',
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: 'white',
//                 paddingLeft: 10,
//                 marginTop: 15,
//                 opacity: 0.8,
//               }}>
//               <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
//                 Step 3 : Video must be not voilated Policey
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingVertical: 10,
//                 marginHorizontal: 15,
//                 backgroundColor: '#2b303b',
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: 'white',
//                 paddingLeft: 10,
//                 marginTop: 15,
//                 opacity: 0.8,
//               }}>
//               <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
//                 Step 4 : Dont't upload sexul content.
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingVertical: 10,
//                 marginHorizontal: 15,
//                 backgroundColor: '#2b303b',
//                 borderRadius: 10,
//                 borderWidth: 2,
//                 borderColor: 'white',
//                 paddingLeft: 10,
//                 marginTop: 15,
//                 opacity: 0.8,
//               }}>
//               <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
//                 Step 5 : Now you are aligibal for earning.
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default EarningDestboard;

// const styles = StyleSheet.create({
//   earnigbox: {
//     margin: 10,
//     backgroundColor: '#242120',
//     padding: 5,
//     paddingLeft: 10,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   subbox: {
//     margin: 10,
//     backgroundColor: 'gray',
//     width: 100,
//     height: 110,
//     padding: 10,
//     borderRadius: 10,
//     borderColor: 'gray',
//     borderWidth: 2,
//   },
//   imgav: {
//     width: 60,
//     height: 60,
//     borderColor: 'white',
//     borderWidth: 2,
//     borderRadius: 100,
//     borderColor: 'gray',
//     // backgroundColor: color1,
//   },
//   btn: {
//     borderColor: 'gray',
//     borderWidth: 2,
//     padding: 10,
//     borderRadius: 10,
//   },
// });
