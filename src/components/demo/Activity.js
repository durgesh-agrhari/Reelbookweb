import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import backendURL from '../../../utils/Strings';

const ActivityUser = () => {
  const { userData } = useSelector(state => state.auth);
  const THEME = useSelector(state => state.theme);
  const navigation = useNavigation();

  const [activityData, setActivityData] = useState([]);
  const [tab, setTab] = useState('monthly'); // "daily" or "monthly"
  const [loading, setLoading] = useState(true);
  const [totalSummary, setTotalSummary] = useState({
    scrolls: 0,
    reelLikes: 0,
    postLikes: 0,
    hours: 0,
    coins: 0,
  });

  // --- Coin calculation logic ---
  const calculateCoins = (scrolls, reelLikes, postLikes, activeHours) => {
    const scrollCoins = scrolls * 1;
    const reelLikeCoins = reelLikes * 2;
    const postLikeCoins = postLikes * 1;
    const activeCoins = activeHours * 1;
    return scrollCoins + reelLikeCoins + postLikeCoins + activeCoins;
  };

  // --- Convert coins to ₹ ---
  const coinToRupee = (coins) => (coins / 1000).toFixed(2);

  // --- Helper to format hours as "Xh Ym" ---
  const formatHours = (hours) => {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  // --- Fetch Activity Data ---
  const fetchActivity = async () => {
    if (!userData?._id) return;
    setLoading(true);

    try {
      const url =
        tab === 'monthly'
          ? `${backendURL}/user-activity/monthly/${userData._id}`
          : `${backendURL}/user-activity/all/${userData._id}`;

      const res = await axios.get(url);
      const data = res.data?.data || [];

      const formatted = data.map((item) => {
        const scroll = item.reelsScrolled || 0;
        const reelLike = item.reelLikes || 0;
        const postLike = item.postLikes || 0;

        // --- Normalize active time ---
        let hours = 0;
        if (item.activeHours) {
          hours = item.activeHours; // Already in hours
        } else if (item.activeMinutes) {
          hours = item.activeMinutes / 60; // Convert minutes → hours
        } else if (item.activeSeconds) {
          hours = item.activeSeconds / 3600; // Convert seconds → hours
        } else if (item.activeTime) {
          const ms = Number(item.activeTime);
          hours = ms / (1000 * 60 * 60); // Convert ms → hours
        }

        hours = Number(hours.toFixed(2)); // round to 2 decimals

        // --- Calculate total coins ---
        const totalCoins = Math.floor(
          calculateCoins(scroll, reelLike, postLike, hours)
        );

        // --- Display date formatting ---
        let displayDate = '';
        if (tab === 'monthly') {
          const dateObj = item.lastUpdated ? new Date(item.lastUpdated) : new Date();
          displayDate = dateObj.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          });
        } else {
          const dateObj = item.lastUpdated ? new Date(item.lastUpdated) : new Date();
          displayDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        }

        return {
          id: Math.random().toString(),
          month: displayDate,
          scroll,
          reelLike,
          postLike,
          hours,
          totalCoins,
        };
      });

      // --- Total summary calculation ---
      const totals = formatted.reduce(
        (acc, cur) => ({
          scrolls: acc.scrolls + cur.scroll,
          reelLikes: acc.reelLikes + cur.reelLike,
          postLikes: acc.postLikes + cur.postLike,
          hours: acc.hours + cur.hours,
          coins: acc.coins + cur.totalCoins,
        }),
        { scrolls: 0, reelLikes: 0, postLikes: 0, hours: 0, coins: 0 }
      );

      setTotalSummary(totals);
      setActivityData(formatted);
    } catch (err) {
      console.error('❌ Error fetching activity:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Re-fetch when tab changes ---
  useEffect(() => {
    fetchActivity();
  }, [tab]);

  // console.log("📊 Activity Data:", activityData);

  // --- Render Each Item ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.month}>{item.month}</Text>
        <Text style={styles.stat}>
          Reels Scrolled: <Text style={styles.value}>{item.scroll}</Text>
        </Text>
        <Text style={styles.stat}>
          Reels Liked: <Text style={styles.value}>{item.reelLike}</Text>
        </Text>
        <Text style={styles.stat}>
          Photos Liked: <Text style={styles.value}>{item.postLike}</Text>
        </Text>
        <Text style={styles.stat}>
          Active Hours:{' '}
          <Text style={styles.value}>{formatHours(item.hours)}</Text>
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.label}>Coins</Text>
        <Text style={styles.coin}>{Math.floor(item.totalCoins)}</Text>
        <Text style={styles.rupee}>₹ {coinToRupee(item.totalCoins)}</Text>
      </View>
    </View>
  );

  // --- Main UI ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.data === 'LIGHT' ? '#fff' : '#000' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color={THEME.data === 'LIGHT' ? 'black' : 'white'}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
          User Activity
        </Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Profile */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: userData?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.username}>@{userData?.username}</Text>
        </View>
      </View>

      {/* Total Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Activity Summary</Text>
        <Text style={styles.summaryText}>
          Scrolls: {totalSummary.scrolls} | Reels Liked: {totalSummary.reelLikes}
        </Text>
        <Text style={styles.summaryText}>
          Posts Liked: {totalSummary.postLikes} | Active Hours: {formatHours(totalSummary.hours)}
        </Text>
        <Text style={styles.summaryCoins}>
          Total: {Math.floor(totalSummary.coins)} Coins (₹ {coinToRupee(totalSummary.coins)})
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['daily', 'monthly'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.tabButton, tab === type && styles.activeTab]}
            onPress={() => setTab(type)}
          >
            <Text style={[styles.tabText, tab === type && styles.activeTabText]}>
              {type === 'daily' ? 'Daily Activity' : 'Monthly Activity'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity List */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
      ) : activityData.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>
          No activity data found.
        </Text>
      ) : (
        <FlatList
          data={activityData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ActivityUser;

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingTop: 35 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', marginHorizontal: 15, marginVertical: 10, borderRadius: 15, padding: 15 },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 18, fontWeight: '700', color: '#333' },
  username: { fontSize: 14, color: '#666' },
  summaryCard: { backgroundColor: '#d4edda', marginHorizontal: 15, borderRadius: 15, padding: 15, alignItems: 'center', marginBottom: 10 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#155724' },
  summaryText: { fontSize: 14, color: '#155724', marginTop: 4 },
  summaryCoins: { fontSize: 15, fontWeight: '700', color: '#28a745', marginTop: 8 },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginHorizontal: 5 },
  activeTab: { backgroundColor: '#28a745' },
  tabText: { color: '#333' },
  activeTabText: { color: '#fff', fontWeight: '700' },
  card: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 8, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  left: { flex: 2 },
  right: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  month: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
  stat: { fontSize: 14, color: '#666', marginVertical: 2 },
  value: { color: '#111', fontWeight: '600' },
  label: { fontSize: 13, color: '#888' },
  coin: { fontSize: 18, fontWeight: '700', color: '#f9a825' },
  rupee: { fontSize: 14, color: '#2ecc71', marginTop: 4 },
});


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import backendURL from '../../../utils/Strings';

// const ActivityUser = () => {
//   const { userData } = useSelector(state => state.auth);
//   const THEME = useSelector(state => state.theme);
//   const navigation = useNavigation();

//   const [activityData, setActivityData] = useState([]);
//   const [tab, setTab] = useState('monthly'); // "daily" or "monthly"
//   const [loading, setLoading] = useState(true);
//   const [totalSummary, setTotalSummary] = useState({
//     scrolls: 0,
//     reelLikes: 0,
//     postLikes: 0,
//     hours: 0,
//     coins: 0,
//   });

//   // Conversion logic: 1 scroll = 1 coin, 1 post like = 1 coin, 1 reel like = 2 coins, 1 active hour = 1 coin
//   const calculateCoins = (scrolls, reelLikes, postLikes, activeHours) => {
//     const scrollCoins = scrolls * 1;
//     const reelLikeCoins = reelLikes * 2;
//     const postLikeCoins = postLikes * 1;
//     const activeCoins = activeHours * 1;
//     return scrollCoins + reelLikeCoins + postLikeCoins + activeCoins;
//   };

//   // Convert coins to ₹ (1000 coins = 1 ₹)
//   const coinToRupee = (coins) => (coins / 1000).toFixed(2);

//   // Fetch activity based on selected tab
//   const fetchActivity = async () => {
//     if (!userData?._id) return;
//     setLoading(true);
//     try {
//       const url =
//         tab === 'monthly'
//           ? `${backendURL}/user-activity/monthly/${userData._id}`
//           : `${backendURL}/user-activity/all/${userData._id}`;

//       const res = await axios.get(url);
//       const data = res.data?.data || [];

//       // Format data for UI
//     //   const formatted = data.map((item) => {
//     //     const scroll = item.reelsScrolled || 0;
//     //     const reelLike = item.reelLikes || 0;
//     //     const postLike = item.postLikes || 0;
//     //     const hours = item.activeHours || 0;
//     //     const totalCoins = calculateCoins(scroll, reelLike, postLike, hours);

//     //     // Determine display date
//     //     let displayDate = '';
//     //     if (tab === 'monthly') {
//     //       displayDate = new Date(item.year, item.month - 1).toLocaleString('default', {
//     //         month: 'long',
//     //         year: 'numeric',
//     //       });
//     //     } else {
//     //       const dateObj = item.lastUpdated ? new Date(item.lastUpdated) : new Date();
//     //       displayDate = dateObj.toLocaleDateString('en-GB', {
//     //         day: '2-digit',
//     //         month: 'short',
//     //         year: 'numeric',
//     //       });
//     //     }

//     //     return {
//     //       id: Math.random().toString(),
//     //       month: displayDate,
//     //       scroll,
//     //       reelLike,
//     //       postLike,
//     //       hours,
//     //       totalCoins,
//     //     };
//     //   });

//     const formatted = data.map((item) => {
//   const scroll = item.reelsScrolled || 0;
//   const reelLike = item.reelLikes || 0;
//   const postLike = item.postLikes || 0;
//   const hours = item.activeHours || 0;
//   const totalCoins = calculateCoins(scroll, reelLike, postLike, hours);

//   let displayDate = '';

//   if (tab === 'monthly') {
//     // Use lastUpdated if year/month not available
//     const dateObj = item.lastUpdated ? new Date(item.lastUpdated) : new Date();
//     displayDate = dateObj.toLocaleString('default', {
//       month: 'long',
//       year: 'numeric',
//     });
//   } else {
//     // Daily tab
//     const dateObj = item.lastUpdated ? new Date(item.lastUpdated) : new Date();
//     displayDate = dateObj.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   }

//   return {
//     id: Math.random().toString(),
//     month: displayDate,
//     scroll,
//     reelLike,
//     postLike,
//     hours,
//     totalCoins,
//   };
// });


//       // Calculate total summary
//       const totals = formatted.reduce(
//         (acc, cur) => ({
//           scrolls: acc.scrolls + cur.scroll,
//           reelLikes: acc.reelLikes + cur.reelLike,
//           postLikes: acc.postLikes + cur.postLike,
//           hours: acc.hours + cur.hours,
//           coins: acc.coins + cur.totalCoins,
//         }),
//         { scrolls: 0, reelLikes: 0, postLikes: 0, hours: 0, coins: 0 }
//       );

//       setTotalSummary(totals);
//       setActivityData(formatted);
//     } catch (err) {
//       console.error('❌ Error fetching activity:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivity();
//   }, [tab]);

//   console.log("activity data", activityData)

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.left}>
//         <Text style={styles.month}>{item.month}</Text>
//         <Text style={styles.stat}>
//           Reels Scrolled: <Text style={styles.value}>{item.scroll}</Text>
//         </Text>
//         <Text style={styles.stat}>
//           Reels Liked: <Text style={styles.value}>{item.reelLike}</Text>
//         </Text>
//         <Text style={styles.stat}>
//           Photos Liked: <Text style={styles.value}>{item.postLike}</Text>
//         </Text>
//         <Text style={styles.stat}>
//           Active Hours: <Text style={styles.value}>{item.hours.toFixed(1)}</Text>
//         </Text>
//       </View>
//       <View style={styles.right}>
//         <Text style={styles.label}>Coins</Text>
//         <Text style={styles.coin}>{item.totalCoins}</Text>
//         <Text style={styles.rupee}>₹ {coinToRupee(item.totalCoins)}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: THEME.data === 'LIGHT' ? '#fff' : '#000' }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={26}
//           color={THEME.data === 'LIGHT' ? 'black' : 'white'}
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={[styles.headerTitle, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
//           User Activity
//         </Text>
//         <View style={{ width: 30 }} />
//       </View>

//       {/* Profile */}
//       <View style={styles.profileCard}>
//         <Image
//           source={{ uri: userData?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
//           style={styles.profileImage}
//         />
//         <View>
//           <Text style={styles.name}>{userData?.name}</Text>
//           <Text style={styles.username}>@{userData?.username}</Text>
//         </View>
//       </View>

//       {/* Total Summary */}
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryTitle}>Total Activity Summary</Text>
//         <Text style={styles.summaryText}>
//           Scrolls: {totalSummary.scrolls} | Reels Liked: {totalSummary.reelLikes}
//         </Text>
//         <Text style={styles.summaryText}>
//           Posts Liked: {totalSummary.postLikes} | Active Hours: {totalSummary.hours.toFixed(1)}
//         </Text>
//         <Text style={styles.summaryCoins}>
//           Total: {totalSummary.coins} Coins (₹ {coinToRupee(totalSummary.coins)})
//         </Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {['daily', 'monthly'].map(type => (
//           <TouchableOpacity
//             key={type}
//             style={[styles.tabButton, tab === type && styles.activeTab]}
//             onPress={() => setTab(type)}
//           >
//             <Text style={[styles.tabText, tab === type && styles.activeTabText]}>
//               {type === 'daily' ? 'Daily Activity' : 'Monthly Activity'}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
//       ) : activityData.length === 0 ? (
//         <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>No activity data found.</Text>
//       ) : (
//         <FlatList
//           data={activityData}
//           keyExtractor={(item, index) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default ActivityUser;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingTop: 35 },
//   headerTitle: { fontSize: 20, fontWeight: '700' },
//   profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', marginHorizontal: 15, marginVertical: 10, borderRadius: 15, padding: 15 },
//   profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
//   name: { fontSize: 18, fontWeight: '700', color: '#333' },
//   username: { fontSize: 14, color: '#666' },
//   summaryCard: { backgroundColor: '#d4edda', marginHorizontal: 15, borderRadius: 15, padding: 15, alignItems: 'center', marginBottom: 10 },
//   summaryTitle: { fontSize: 16, fontWeight: '700', color: '#155724' },
//   summaryText: { fontSize: 14, color: '#155724', marginTop: 4 },
//   summaryCoins: { fontSize: 15, fontWeight: '700', color: '#28a745', marginTop: 8 },
//   tabContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
//   tabButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginHorizontal: 5 },
//   activeTab: { backgroundColor: '#28a745' },
//   tabText: { color: '#333' },
//   activeTabText: { color: '#fff', fontWeight: '700' },
//   card: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 8, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
//   left: { flex: 2 },
//   right: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   month: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
//   stat: { fontSize: 14, color: '#666', marginVertical: 2 },
//   value: { color: '#111', fontWeight: '600' },
//   label: { fontSize: 13, color: '#888' },
//   coin: { fontSize: 18, fontWeight: '700', color: '#f9a825' },
//   rupee: { fontSize: 14, color: '#2ecc71', marginTop: 4 },
// });



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import backendURL from '../../../utils/Strings';

// const ActivityUser = () => {
//   const { userData } = useSelector(state => state.auth);
//   const THEME = useSelector(state => state.theme);
//   const navigation = useNavigation();

//   const [activityData, setActivityData] = useState([]);
//   const [tab, setTab] = useState('monthly'); // "daily" or "monthly"
//   const [loading, setLoading] = useState(true);
//   const [totalSummary, setTotalSummary] = useState({
//     scrolls: 0,
//     reelLikes: 0,
//     postLikes: 0,
//     hours: 0,
//     coins: 0,
//   });

// //   // Conversion logic
// //   const calculateCoins = (scrolls, reelLikes, postLikes, activeHours) => {
// //     const scrollCoins = Math.floor(scrolls / 1000) * 1000;
// //     const reelLikeCoins = Math.floor(reelLikes / 1000) * 2000;
// //     const postLikeCoins = Math.floor(postLikes / 1000) * 1000;
// //     const activeCoins = Math.floor(activeHours) * 2000;
// //     return scrollCoins + reelLikeCoins + postLikeCoins + activeCoins;
// //   };

// //   const coinToRupee = coins => (coins / 1000).toFixed(2);

// // Conversion logic
// const calculateCoins = (scrolls, reelLikes, postLikes, activeHours) => {
//   const scrollCoins = scrolls * 1;       // 1 coin per scroll
//   const reelLikeCoins = reelLikes * 2;   // 2 coins per reel like
//   const postLikeCoins = postLikes * 1;   // 1 coin per post like
//   const activeCoins = activeHours * 1;   // 1 coin per active hour
//   return scrollCoins + reelLikeCoins + postLikeCoins + activeCoins;
// };

// // Convert coins to ₹ (1000 coins = 1 ₹)
// const coinToRupee = (coins) => (coins / 1000).toFixed(2);


//   // Fetch activity based on selected tab
//   const fetchActivity = async () => {
//     if (!userData?._id) return;
//     setLoading(true);
//     try {
//       const url =
//         tab === 'monthly'
//           ? `${backendURL}/user-activity/monthly/${userData._id}`
//           : `${backendURL}/user-activity/all/${userData._id}`;

//       const res = await axios.get(url);
//       const data = res.data?.data || [];

//       // Format data for UI
//       const formatted = data.map(item => {
//         const scroll = item.reelsScrolled || 0;
//         const reelLike = item.reelLikes || 0;
//         const postLike = item.postLikes || 0;
//         const hours = item.activeHours || 0;
//         const totalCoins = calculateCoins(scroll, reelLike, postLike, hours);

//         return {
//           id: Math.random().toString(),
//           month:
//             tab === 'monthly'
//               ? `${new Date(item.year, item.month - 1).toLocaleString('default', {
//                   month: 'long',
//                   year: 'numeric',
//                 })}`
//               : new Date(item.lastUpdated).toLocaleDateString(),
//           scroll,
//           reelLike,
//           postLike,
//           hours,
//           totalCoins,
//         };
//       });

//       // Calculate total summary (for top card)
//       const totals = formatted.reduce(
//         (acc, cur) => ({
//           scrolls: acc.scrolls + cur.scroll,
//           reelLikes: acc.reelLikes + cur.reelLike,
//           postLikes: acc.postLikes + cur.postLike,
//           hours: acc.hours + cur.hours,
//           coins: acc.coins + cur.totalCoins,
//         }),
//         { scrolls: 0, reelLikes: 0, postLikes: 0, hours: 0, coins: 0 }
//       );

//       setTotalSummary(totals);
//       setActivityData(formatted);
//     } catch (err) {
//       console.error('❌ Error fetching activity:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivity();
//   }, [tab]);
// console.log("activity data", activityData)
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.left}>
//         <Text style={styles.month}>{item.month}</Text>
//         <Text style={styles.stat}>Reels Scrolled: <Text style={styles.value}>{item.scroll}</Text></Text>
//         <Text style={styles.stat}>Reels Liked: <Text style={styles.value}>{item.reelLike}</Text></Text>
//         <Text style={styles.stat}>Photos Liked: <Text style={styles.value}>{item.postLike}</Text></Text>
//         <Text style={styles.stat}>Active Hours: <Text style={styles.value}>{item.hours.toFixed(1)}</Text></Text>
//       </View>
//       <View style={styles.right}>
//         <Text style={styles.label}>Coins</Text>
//         <Text style={styles.coin}>{item.totalCoins}</Text>
//         <Text style={styles.rupee}>₹ {coinToRupee(item.totalCoins)}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: THEME.data === 'LIGHT' ? '#fff' : '#000' }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={26}
//           color={THEME.data === 'LIGHT' ? 'black' : 'white'}
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={[styles.headerTitle, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
//           User Activity
//         </Text>
//         <View style={{ width: 30 }} />
//       </View>

//       {/* Profile */}
//       <View style={styles.profileCard}>
//         <Image
//           source={{ uri: userData?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
//           style={styles.profileImage}
//         />
//         <View>
//           <Text style={styles.name}>{userData?.name}</Text>
//           <Text style={styles.username}>@{userData?.username}</Text>
//         </View>
//       </View>

//       {/* Total Summary */}
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryTitle}>Total Activity Summary</Text>
//         <Text style={styles.summaryText}>
//           Scrolls: {totalSummary.scrolls} | Reels Liked: {totalSummary.reelLikes}
//         </Text>
//         <Text style={styles.summaryText}>
//           Posts Liked: {totalSummary.postLikes} | Active Hours: {totalSummary.hours.toFixed(1)}
//         </Text>
//         <Text style={styles.summaryCoins}>
//           Total: {totalSummary.coins} Coins (₹ {coinToRupee(totalSummary.coins)})
//         </Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         {['daily', 'monthly'].map(type => (
//           <TouchableOpacity
//             key={type}
//             style={[styles.tabButton, tab === type && styles.activeTab]}
//             onPress={() => setTab(type)}
//           >
//             <Text style={[styles.tabText, tab === type && styles.activeTabText]}>
//               {type === 'daily' ? 'Daily Activity' : 'Monthly Activity'}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
//       ) : activityData.length === 0 ? (
//         <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>No activity data found.</Text>
//       ) : (
//         <FlatList
//           data={activityData}
//           keyExtractor={(item, index) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default ActivityUser;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingTop: 35 },
//   headerTitle: { fontSize: 20, fontWeight: '700' },
//   profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', marginHorizontal: 15, marginVertical: 10, borderRadius: 15, padding: 15 },
//   profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
//   name: { fontSize: 18, fontWeight: '700', color: '#333' },
//   username: { fontSize: 14, color: '#666' },
//   summaryCard: { backgroundColor: '#d4edda', marginHorizontal: 15, borderRadius: 15, padding: 15, alignItems: 'center', marginBottom: 10 },
//   summaryTitle: { fontSize: 16, fontWeight: '700', color: '#155724' },
//   summaryText: { fontSize: 14, color: '#155724', marginTop: 4 },
//   summaryCoins: { fontSize: 15, fontWeight: '700', color: '#28a745', marginTop: 8 },
//   tabContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
//   tabButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginHorizontal: 5 },
//   activeTab: { backgroundColor: '#28a745' },
//   tabText: { color: '#333' },
//   activeTabText: { color: '#fff', fontWeight: '700' },
//   card: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 8, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
//   left: { flex: 2 },
//   right: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   month: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
//   stat: { fontSize: 14, color: '#666', marginVertical: 2 },
//   value: { color: '#111', fontWeight: '600' },
//   label: { fontSize: 13, color: '#888' },
//   coin: { fontSize: 18, fontWeight: '700', color: '#f9a825' },
//   rupee: { fontSize: 14, color: '#2ecc71', marginTop: 4 },
// });


// // ActivityUser.js

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import backendURL from '../../../utils/Strings';

// const ActivityUser = () => {
//   const { userData } = useSelector(state => state.auth);
//   const THEME = useSelector(state => state.theme);
//   const navigation = useNavigation();

//   const [activityData, setActivityData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- Conversion Logic ---
//   const calculateCoins = (scrolls, reelLikes, postLikes, activeHours) => {
//     const scrollCoins = Math.floor(scrolls / 1000) * 1000; // ₹1 per 1000 scrolls
//     const reelLikeCoins = Math.floor(reelLikes / 1000) * 2000; // ₹2 per 1000
//     const postLikeCoins = Math.floor(postLikes / 1000) * 1000; // ₹1 per 1000
//     const activeCoins = Math.floor(activeHours) * 2000; // ₹2 per hour
//     return scrollCoins + reelLikeCoins + postLikeCoins + activeCoins;
//   };

//   const coinToRupee = coins => (coins / 1000).toFixed(2);

//   // --- Fetch activity data ---
//   const fetchActivity = async () => {
//     console.log("called activity")
//     try {
//       setLoading(true);

//       const [scrollRes, reelLikeRes, postLikeRes, activeTimeRes] = await Promise.all([
//         axios.get(`${backendURL}/user-activity/all/${userData._id}`),
//         axios.get(`${backendURL}/user-activity/all/${userData._id}`),
//         axios.get(`${backendURL}/user-activity/all/${userData._id}`),
//         axios.get(`${backendURL}/user-activity/all/${userData._id}`),
//       ]);

//       const scrolls = scrollRes.data.data || [];
//       const reelLikes = reelLikeRes.data.data || [];
//       const postLikes = postLikeRes.data.data || [];
//       const activeHours = activeTimeRes.data.data || [];

//       // --- group data by month ---
//       const groupByMonth = items =>
//         items.reduce((acc, item) => {
//           const month = new Date(item.date).toLocaleString('default', {
//             month: 'long',
//             year: 'numeric',
//           });
//           if (!acc[month]) acc[month] = 0;
//           acc[month] += item.count || item.duration || 0;
//           return acc;
//         }, {});

//       const scrollsByMonth = groupByMonth(scrolls);
//       const reelLikesByMonth = groupByMonth(reelLikes);
//       const postLikesByMonth = groupByMonth(postLikes);
//       const hoursByMonth = groupByMonth(activeHours);

//       const allMonths = new Set([
//         ...Object.keys(scrollsByMonth),
//         ...Object.keys(reelLikesByMonth),
//         ...Object.keys(postLikesByMonth),
//         ...Object.keys(hoursByMonth),
//       ]);

//       const result = Array.from(allMonths).map(month => {
//         const scroll = scrollsByMonth[month] || 0;
//         const reelLike = reelLikesByMonth[month] || 0;
//         const postLike = postLikesByMonth[month] || 0;
//         const hours = hoursByMonth[month] || 0;
//         const totalCoins = calculateCoins(scroll, reelLike, postLike, hours);

//         return {
//           month,
//           scroll,
//           reelLike,
//           postLike,
//           hours,
//           totalCoins,
//         };
//       });

//       result.sort((a, b) => new Date(b.month) - new Date(a.month));
//       setActivityData(result);
//     } catch (err) {
//       console.error('❌ Error fetching activity:', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userData?._id) fetchActivity();
//   }, [userData]);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.left}>
//         <Text style={styles.month}>{item.month}</Text>
//         <Text style={styles.stat}>Reels Scrolled: <Text style={styles.value}>{item.scroll}</Text></Text>
//         <Text style={styles.stat}>Reels Liked: <Text style={styles.value}>{item.reelLike}</Text></Text>
//         <Text style={styles.stat}>Photos Liked: <Text style={styles.value}>{item.postLike}</Text></Text>
//         <Text style={styles.stat}>Active Hours: <Text style={styles.value}>{item.hours.toFixed(1)}</Text></Text>
//       </View>
//       <View style={styles.right}>
//         <Text style={styles.label}>Coins</Text>
//         <Text style={styles.coin}>{item.totalCoins}</Text>
//         <Text style={styles.rupee}>₹ {coinToRupee(item.totalCoins)}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: THEME.data === 'LIGHT' ? '#fff' : '#000' }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="arrow-back"
//           size={26}
//           color={THEME.data === 'LIGHT' ? 'black' : 'white'}
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={[styles.headerTitle, { color: THEME.data === 'LIGHT' ? 'black' : 'white' }]}>
//           User Activity
//         </Text>
//         <View style={{ width: 30 }} />
//       </View>

//       {/* Profile Section */}
//       <View style={styles.profileCard}>
//         <Image
//           source={{ uri: userData?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
//           style={styles.profileImage}
//         />
//         <View>
//           <Text style={styles.name}>{userData?.name}</Text>
//           <Text style={styles.username}>@{userData?.username}</Text>
//         </View>
//       </View>

//       <Text style={styles.sectionTitle}>Monthly Activity Summary</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
//       ) : activityData.length === 0 ? (
//         <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>No activity data found.</Text>
//       ) : (
//         <FlatList
//           data={activityData}
//           keyExtractor={(item, index) => item.month + index}
//           renderItem={renderItem}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default ActivityUser;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     paddingTop: 35,
//   },
//   headerTitle: { fontSize: 20, fontWeight: '700' },
//   profileCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     marginHorizontal: 15,
//     marginVertical: 10,
//     borderRadius: 15,
//     padding: 15,
//   },
//   profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
//   name: { fontSize: 18, fontWeight: '700', color: '#333' },
//   username: { fontSize: 14, color: '#666' },
//   sectionTitle: { fontSize: 16, color: 'green', textAlign: 'center', marginVertical: 10, fontWeight: '600' },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 14,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   left: { flex: 2 },
//   right: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   month: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 6 },
//   stat: { fontSize: 14, color: '#666', marginVertical: 2 },
//   value: { color: '#111', fontWeight: '600' },
//   label: { fontSize: 13, color: '#888' },
//   coin: { fontSize: 18, fontWeight: '700', color: '#f9a825' },
//   rupee: { fontSize: 14, color: '#2ecc71', marginTop: 4 },
// });
