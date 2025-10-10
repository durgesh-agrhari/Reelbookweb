// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Animated,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import backendURL from '../../../../utils/Strings';
// import { useSelector } from 'react-redux';

// const WithdrawRequest = () => {
//   const route = useRoute();
//   const THEME = useSelector(state => state.theme);
//   const { month, totalRupee, userName, userId } = route.params;
//   const navigation = useNavigation()

//   const [upiId, setUpiId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [requestStatus, setRequestStatus] = useState(null); // null / pending / completed
//   const [requestId, setRequestId] = useState(null); // store request ID for delete
//   const [slideAnim] = useState(new Animated.Value(300));

//   // Fetch current withdraw request status for this user and month
//   const fetchRequestStatus = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/user-earnings/allrequests/${userId}`);
//       if (res.data.status) {
//         const request = res.data.data.find(r => r.month === month);
//         if (request) {
//           setRequestStatus(request.status); // pending or completed
//           setRequestId(request._id); // store ID for deletion
//           setUpiId(request.upiId || '');
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching withdraw status:', err.message);
//     }
//   };

//   useEffect(() => {
//     fetchRequestStatus();
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleRequest = async () => {
//     if (!upiId) return Alert.alert('Error', 'Please enter UPI ID');
//     setLoading(true);
//     try {
//       const res = await axios.post(`${backendURL}/user-earnings/request`, {
//         userId,
//         month,
//         totalRupee,
//         upiId,
//       });

//       if (res.data.status) {
//         Alert.alert('Success', 'Withdrawal request submitted successfully!');
//         setRequestStatus('pending');
//         setRequestId(res.data.data._id);
//       } else {
//         Alert.alert('Error', res.data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error('Withdraw request error:', err.message);
//       Alert.alert('Error', 'Failed to submit withdraw request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!requestId) return;
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this pending withdraw request?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setLoading(true);
//             try {
//               const res = await axios.delete(`${backendURL}/user-earnings/delete/${requestId}/${userId}`);
//               if (res.data.status) {
//                 Alert.alert('Deleted', 'Withdraw request deleted successfully');
//                 setRequestStatus(null);
//                 setRequestId(null);
//                 setUpiId('');
//               } else {
//                 Alert.alert('Error', res.data.message || 'Failed to delete');
//               }
//             } catch (err) {
//               console.error('Delete withdraw error:', err.message);
//               Alert.alert('Error', 'Failed to delete withdraw request');
//             } finally {
//               setLoading(false);
//             }
//           }
//         }
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={[styles.container,{backgroundColor: THEME.data == 'LIGHT' ? 'white' : 'black'}]}>
//       <TouchableOpacity  onPress={() => navigation.goBack()} style={{alignSelf:'center', backgroundColor:'green', padding:10, borderRadius:20, paddingLeft:30, paddingRight:30, marginTop:80}}>
//         <Text>Go Back</Text>
//       </TouchableOpacity>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <Animated.View style={[styles.card, { backgroundColor: THEME.data == 'LIGHT' ? 'white' : '#729cad', transform: [{ translateY: slideAnim }] }]}>
//           <Text style={styles.header}>Withdraw Money</Text>

//           <Text style={styles.label}>User Name</Text>
//           <Text style={styles.value}>{userName}</Text>

//           <Text style={styles.label}>Month</Text>
//           <Text style={styles.value}>{month}</Text>

//           <Text style={styles.label}>Total Amount</Text>
//           <Text style={styles.value}>₹ {totalRupee}</Text>

//           {/* Show input only if no request exists */}
//           {!requestStatus && (
//             <>
//               <Text style={styles.label}>UPI ID</Text>
//               <TextInput
//                 placeholder="Enter your UPI ID"
//                 style={styles.input}
//                 value={upiId}
//                 onChangeText={setUpiId}
//               />
//             </>
//           )}

//           {loading ? (
//             <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 20 }} />
//           ) : !requestStatus ? (
//             <TouchableOpacity style={styles.button} onPress={handleRequest}>
//               <Text style={styles.buttonText}>Request Money</Text>
//             </TouchableOpacity>
//           ) : requestStatus === 'pending' ? (
//             <>
//               <View style={[styles.button, styles.pendingButton]}>
//                 <Text style={styles.buttonText}>Pending Withdraw</Text>
//               </View>
//               <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
//                 <Text style={styles.buttonText}>Delete Request</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <View style={[styles.button, styles.completedButton]}>
//               <Text style={styles.buttonText}>Completed</Text>
//             </View>
//           )}
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default WithdrawRequest;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center' },
//   card: {
//     margin: 20,
//     marginTop: 30,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
//   label: { fontSize: 14, fontWeight: '500', marginTop: 12, color: '#555' },
//   value: { fontSize: 16, fontWeight: '600', marginTop: 4 },
//   input: {
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     padding: 12,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 20,
//     alignItems: 'center',
//     shadowColor: '#2ecc71',
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
//   pendingButton: { backgroundColor: '#f1c40f' },
//   completedButton: { backgroundColor: '#3498db' },
//   deleteButton: { backgroundColor: '#e74c3c' },
// });


// // import React, { useState, useEffect } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TextInput,
// //   TouchableOpacity,
// //   KeyboardAvoidingView,
// //   Platform,
// //   SafeAreaView,
// //   Animated,
// //   Alert,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { useRoute } from '@react-navigation/native';
// // import axios from 'axios';
// // import backendURL from '../../../../utils/Strings';

// // const WithdrawRequest = () => {
// //   const route = useRoute();
// //   const { month, totalRupee, userName, userId } = route.params;

// //   const [upiId, setUpiId] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [requestStatus, setRequestStatus] = useState(null); // null / pending / completed
// //   const [slideAnim] = useState(new Animated.Value(300));

// //   // Fetch current withdraw request status for this user and month
// //   const fetchRequestStatus = async () => {
// //     try {
// //       const res = await axios.get(`${backendURL}/user-earnings/allrequests/${userId}`);
// //       if (res.data.status) {
// //         const request = res.data.data.find(r => r.month === month);
// //         if (request) setRequestStatus(request.status); // pending or completed
// //       }
// //     } catch (err) {
// //       console.error('Error fetching withdraw status:', err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRequestStatus();
// //     Animated.timing(slideAnim, {
// //       toValue: 0,
// //       duration: 500,
// //       useNativeDriver: true,
// //     }).start();
// //   }, []);

// //   const handleRequest = async () => {
// //     if (!upiId) return Alert.alert('Error', 'Please enter UPI ID');
// //     setLoading(true);
// //     try {
// //       const res = await axios.post(`${backendURL}/user-earnings/request`, {
// //         userId,
// //         month,
// //         totalRupee,
// //         upiId,
// //       });

// //       if (res.data.status) {
// //         Alert.alert('Success', 'Withdrawal request submitted successfully!');
// //         setRequestStatus('pending');
// //       } else {
// //         Alert.alert('Error', res.data.message || 'Something went wrong');
// //       }
// //     } catch (err) {
// //       console.error('Withdraw request error:', err.message);
// //       Alert.alert('Error', 'Failed to submit withdraw request');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       >
// //         <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
// //           <Text style={styles.header}>Withdraw Money</Text>

// //           <Text style={styles.label}>User Name</Text>
// //           <Text style={styles.value}>{userName}</Text>

// //           <Text style={styles.label}>Month</Text>
// //           <Text style={styles.value}>{month}</Text>

// //           <Text style={styles.label}>Total Amount</Text>
// //           <Text style={styles.value}>₹ {totalRupee}</Text>

// //           {/* Show input only if no request exists */}
// //           {!requestStatus && (
// //             <>
// //               <Text style={styles.label}>UPI ID</Text>
// //               <TextInput
// //                 placeholder="Enter your UPI ID"
// //                 style={styles.input}
// //                 value={upiId}
// //                 onChangeText={setUpiId}
// //               />
// //             </>
// //           )}

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 20 }} />
// //           ) : !requestStatus ? (
// //             <TouchableOpacity style={styles.button} onPress={handleRequest}>
// //               <Text style={styles.buttonText}>Request Money</Text>
// //             </TouchableOpacity>
// //           ) : requestStatus === 'pending' ? (
// //             <View style={[styles.button, styles.pendingButton]}>
// //               <Text style={styles.buttonText}>Pending Withdraw</Text>
// //             </View>
// //           ) : (
// //             <View style={[styles.button, styles.completedButton]}>
// //               <Text style={styles.buttonText}>Completed</Text>
// //             </View>
// //           )}
// //         </Animated.View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };

// // export default WithdrawRequest;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center' },
// //   card: {
// //     margin: 20,
// //     marginTop: 80,
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 20,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     shadowOffset: { width: 0, height: 5 },
// //     elevation: 5,
// //   },
// //   header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
// //   label: { fontSize: 14, fontWeight: '500', marginTop: 12, color: '#555' },
// //   value: { fontSize: 16, fontWeight: '600', marginTop: 4 },
// //   input: {
// //     marginTop: 6,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 12,
// //     padding: 12,
// //     fontSize: 16,
// //   },
// //   button: {
// //     backgroundColor: '#2ecc71',
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     marginTop: 20,
// //     alignItems: 'center',
// //     shadowColor: '#2ecc71',
// //     shadowOpacity: 0.4,
// //     shadowRadius: 8,
// //     shadowOffset: { width: 0, height: 4 },
// //     elevation: 4,
// //   },
// //   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// //   pendingButton: { backgroundColor: '#f1c40f' },
// //   completedButton: { backgroundColor: '#3498db' },
// // });

// // import React, { useState, useEffect } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TextInput,
// //   TouchableOpacity,
// //   KeyboardAvoidingView,
// //   Platform,
// //   SafeAreaView,
// //   Animated,
// //   Alert,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { useRoute } from '@react-navigation/native';
// // import axios from 'axios';
// // import backendURL from '../../../../utils/Strings';

// // const WithdrawRequest = () => {
// //   const route = useRoute();
// //   const { month, totalRupee, userName, userId } = route.params;

// //   const [upiId, setUpiId] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [requestStatus, setRequestStatus] = useState(null); // null / pending / completed
// //   const [slideAnim] = useState(new Animated.Value(300));

// //   // Fetch current withdraw request status for this user and month
// //   const fetchRequestStatus = async () => {
// //     try {
// //       const res = await axios.get(`${backendURL}/user-earnings/allrequests/${userId}`);
// //       if (res.data.status) {
// //         const request = res.data.data.find(r => r.month === month);
// //         if (request) setRequestStatus(request.status); // pending or completed
// //       }
// //     } catch (err) {
// //       console.error('Error fetching withdraw status:', err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRequestStatus();
// //     Animated.timing(slideAnim, {
// //       toValue: 0,
// //       duration: 500,
// //       useNativeDriver: true,
// //     }).start();
// //   }, []);

// //   const handleRequest = async () => {
// //     if (!upiId) return Alert.alert('Error', 'Please enter UPI ID');
// //     setLoading(true);
// //     try {
// //       const res = await axios.post(`${backendURL}/user-earnings/request`, {
// //         userId,
// //         month,
// //         totalRupee,
// //         upiId,
// //       });

// //       if (res.data.status) {
// //         Alert.alert('Success', 'Withdrawal request submitted successfully!');
// //         setRequestStatus('pending');
// //       } else {
// //         Alert.alert('Error', res.data.message || 'Something went wrong');
// //       }
// //     } catch (err) {
// //       console.error('Withdraw request error:', err.message);
// //       Alert.alert('Error', 'Failed to submit withdraw request');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       >
// //         <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
// //           <Text style={styles.header}>Withdraw Money</Text>

// //           <Text style={styles.label}>User Name</Text>
// //           <Text style={styles.value}>{userName}</Text>

// //           <Text style={styles.label}>Month</Text>
// //           <Text style={styles.value}>{month}</Text>

// //           <Text style={styles.label}>Total Amount</Text>
// //           <Text style={styles.value}>₹ {totalRupee}</Text>

// //           <Text style={styles.label}>UPI ID</Text>
// //           <TextInput
// //             placeholder="Enter your UPI ID"
// //             style={styles.input}
// //             value={upiId}
// //             onChangeText={setUpiId}
// //             editable={!requestStatus} // cannot edit if request already exists
// //           />

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 20 }} />
// //           ) : !requestStatus ? (
// //             <TouchableOpacity style={styles.button} onPress={handleRequest}>
// //               <Text style={styles.buttonText}>Request Money</Text>
// //             </TouchableOpacity>
// //           ) : requestStatus === 'pending' ? (
// //             <View style={[styles.button, styles.pendingButton]}>
// //               <Text style={styles.buttonText}>Pending Withdraw</Text>
// //             </View>
// //           ) : (
// //             <View style={[styles.button, styles.completedButton]}>
// //               <Text style={styles.buttonText}>Completed</Text>
// //             </View>
// //           )}
// //         </Animated.View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };

// // export default WithdrawRequest;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center' },
// //   card: {
// //     margin: 20,
// //     marginTop: 80,
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 20,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,
// //     shadowOffset: { width: 0, height: 5 },
// //     elevation: 5,
// //   },
// //   header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
// //   label: { fontSize: 14, fontWeight: '500', marginTop: 12, color: '#555' },
// //   value: { fontSize: 16, fontWeight: '600', marginTop: 4 },
// //   input: {
// //     marginTop: 6,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 12,
// //     padding: 12,
// //     fontSize: 16,
// //   },
// //   button: {
// //     backgroundColor: '#2ecc71',
// //     paddingVertical: 14,
// //     borderRadius: 12,
// //     marginTop: 20,
// //     alignItems: 'center',
// //     shadowColor: '#2ecc71',
// //     shadowOpacity: 0.4,
// //     shadowRadius: 8,
// //     shadowOffset: { width: 0, height: 4 },
// //     elevation: 4,
// //   },
// //   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// //   pendingButton: { backgroundColor: '#f1c40f' },
// //   completedButton: { backgroundColor: '#3498db' },
// // });


// // // import React, { useState } from 'react';
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   SafeAreaView,
// // //   Animated,
// // //   Alert,
// // // } from 'react-native';
// // // import { useRoute } from '@react-navigation/native';
// // // import axios from 'axios';
// // // import backendURL from '../../../../utils/Strings';

// // // const WithdrawRequest = () => {
// // //   const route = useRoute();
// // //   const { month, totalRupee, userName, userId } = route.params;

// // //   const [upiId, setUpiId] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   const slideAnim = new Animated.Value(300); // start animation from bottom

// // //   React.useEffect(() => {
// // //     Animated.timing(slideAnim, {
// // //       toValue: 0,
// // //       duration: 500,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, []);

// // //   const handleRequest = async () => {
// // //     console.log("start request")
// // //     if (!upiId) return Alert.alert('Error', 'Please enter UPI ID');
// // //     setLoading(true);
// // //     try {
// // //       const res = await axios.post(`${backendURL}/user-earnings/request`, {
// // //         userId,
// // //         month,
// // //         totalRupee,
// // //         upiId,
// // //       });

// // //       console.log("request data", res.data)

// // //       if (res.data.status) {
// // //         Alert.alert('Success', 'Withdrawal request submitted successfully!');
// // //         setUpiId('');
// // //       } else {
// // //         Alert.alert('Error', res.data.message || 'Something went wrong');
// // //       }
// // //     } catch (err) {
// // //       console.error('Withdraw request error:', err.message);
// // //       Alert.alert('Error', 'Failed to submit withdraw request');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       >
// // //         <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
// // //           <Text style={styles.header}>Withdraw Money</Text>

// // //           <Text style={styles.label}>User Name</Text>
// // //           <Text style={styles.value}>{userName}</Text>

// // //           <Text style={styles.label}>Month</Text>
// // //           <Text style={styles.value}>{month}</Text>

// // //           <Text style={styles.label}>Total Amount</Text>
// // //           <Text style={styles.value}>₹ {totalRupee}</Text>

// // //           <Text style={styles.label}>UPI ID</Text>
// // //           <TextInput
// // //             placeholder="Enter your UPI ID"
// // //             style={styles.input}
// // //             value={upiId}
// // //             onChangeText={setUpiId}
// // //           />

// // //           <TouchableOpacity style={styles.button} onPress={handleRequest} disabled={loading}>
// // //             <Text style={styles.buttonText}>{loading ? 'Requesting...' : 'Request Money'}</Text>
// // //           </TouchableOpacity>
// // //         </Animated.View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default WithdrawRequest;

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center' },
// // //   card: {
// // //     margin: 20,
// // //     marginTop: 80,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 10,
// // //     shadowOffset: { width: 0, height: 5 },
// // //     elevation: 5,
// // //   },
// // //   header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
// // //   label: { fontSize: 14, fontWeight: '500', marginTop: 12, color: '#555' },
// // //   value: { fontSize: 16, fontWeight: '600', marginTop: 4 },
// // //   input: {
// // //     marginTop: 6,
// // //     borderWidth: 1,
// // //     borderColor: '#ccc',
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     fontSize: 16,
// // //   },
// // //   button: {
// // //     backgroundColor: '#2ecc71',
// // //     paddingVertical: 14,
// // //     borderRadius: 12,
// // //     marginTop: 20,
// // //     alignItems: 'center',
// // //     shadowColor: '#2ecc71',
// // //     shadowOpacity: 0.4,
// // //     shadowRadius: 8,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     elevation: 4,
// // //   },
// // //   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// // // });


// // // import React, { useState } from 'react';
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   SafeAreaView,
// // //   Animated,
// // // } from 'react-native';
// // // import { useRoute } from '@react-navigation/native';

// // // const WithdrawRequest = () => {
// // //   const route = useRoute();
// // //   const { month, totalRupee, userName } = route.params;

// // //   const [upiId, setUpiId] = useState('');
// // //   const [loading, setLoading] = useState(false);

// // //   const slideAnim = new Animated.Value(300); // start animation from bottom

// // //   React.useEffect(() => {
// // //     Animated.timing(slideAnim, {
// // //       toValue: 0,
// // //       duration: 500,
// // //       useNativeDriver: true,
// // //     }).start();
// // //   }, []);

// // //   const handleRequest = () => {
// // //     if (!upiId) return alert('Please enter UPI ID');
// // //     setLoading(true);
// // //     setTimeout(() => {
// // //       setLoading(false);
// // //       alert(`Withdrawal requested for ₹${totalRupee} to ${upiId}`);
// // //     }, 1500);
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       >
// // //         <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
// // //           <Text style={styles.header}>Withdraw Money</Text>

// // //           <Text style={styles.label}>User Name</Text>
// // //           <Text style={styles.value}>{userName}</Text>

// // //           <Text style={styles.label}>Month</Text>
// // //           <Text style={styles.value}>{month}</Text>

// // //           <Text style={styles.label}>Total Amount</Text>
// // //           <Text style={styles.value}>₹ {totalRupee}</Text>

// // //           <Text style={styles.label}>UPI ID</Text>
// // //           <TextInput
// // //             placeholder="Enter your UPI ID"
// // //             style={styles.input}
// // //             value={upiId}
// // //             onChangeText={setUpiId}
// // //           />

// // //           <TouchableOpacity style={styles.button} onPress={handleRequest} disabled={loading}>
// // //             <Text style={styles.buttonText}>{loading ? 'Requesting...' : 'Request Money'}</Text>
// // //           </TouchableOpacity>
// // //         </Animated.View>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default WithdrawRequest;

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center' },
// // //   card: {
// // //     margin: 20,
// // //     marginTop: 80,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 10,
// // //     shadowOffset: { width: 0, height: 5 },
// // //     elevation: 5,
// // //   },
// // //   header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
// // //   label: { fontSize: 14, fontWeight: '500', marginTop: 12, color: '#555' },
// // //   value: { fontSize: 16, fontWeight: '600', marginTop: 4 },
// // //   input: {
// // //     marginTop: 6,
// // //     borderWidth: 1,
// // //     borderColor: '#ccc',
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     fontSize: 16,
// // //   },
// // //   button: {
// // //     backgroundColor: '#2ecc71',
// // //     paddingVertical: 14,
// // //     borderRadius: 12,
// // //     marginTop: 20,
// // //     alignItems: 'center',
// // //     shadowColor: '#2ecc71',
// // //     shadowOpacity: 0.4,
// // //     shadowRadius: 8,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     elevation: 4,
// // //   },
// // //   buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
// // // });
