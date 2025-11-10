import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import backendURL from "../../utils/String";
import "./EarningHistory.css";

const EarningHistory = () => {
  const { userData } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState({});
  const [withdrawing, setWithdrawing] = useState(false);

  const coinToRupee = (coins) => ((coins / 100) * 5).toFixed(2);

  // 🟩 Fetch earning data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [reelsRes, postsRes, storiesRes, viewsRes, likesRes, withdrawRes] =
        await Promise.all([
          axios.get(`${backendURL}/reel/getFrienddata/${userData._id}`),
          axios.get(`${backendURL}/post/getFrienddata/${userData._id}`),
          axios.get(`${backendURL}/story/getFriendStorydata/${userData._id}`),
          axios.get(`${backendURL}/reel/totalViewsByUser/${userData._id}`),
          axios.get(`${backendURL}/post/likedPosts/count/${userData._id}`),
          axios.get(`${backendURL}/user-earnings/allrequests/${userData._id}`),
        ]);

      const reels = reelsRes.data.data || [];
      const posts = postsRes.data.data || [];
      const stories = storiesRes.data.data || [];

      const totalViews = viewsRes.data?.totalViews || 0;
      const totalLikes = likesRes.data?.totalLikedPosts || 0;

      const groupByMonth = (items) =>
        items.reduce((acc, item) => {
          const month = new Date(item.createdAt).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          if (!acc[month]) acc[month] = { reels: 0, posts: 0, stories: 0 };
          if (item.type === "reel") acc[month].reels += 1;
          if (item.type === "post") acc[month].posts += 1;
          if (item.type === "story") acc[month].stories += 1;
          return acc;
        }, {});

      const reelsMonth = groupByMonth(reels.map((r) => ({ ...r, type: "reel" })));
      const postsMonth = groupByMonth(posts.map((p) => ({ ...p, type: "post" })));
      const storiesMonth = groupByMonth(stories.map((s) => ({ ...s, type: "story" })));

      const allMonths = { ...reelsMonth, ...postsMonth, ...storiesMonth };
      Object.keys(allMonths).forEach((month) => {
        allMonths[month].reels = reelsMonth[month]?.reels || 0;
        allMonths[month].posts = postsMonth[month]?.posts || 0;
        allMonths[month].stories = storiesMonth[month]?.stories || 0;
      });

      const totalReelsCount = reels.length || 1;
      const parsed = Object.entries(allMonths).map(([month, data]) => {
        const proportion = data.reels / totalReelsCount;
        const views = Math.round(totalViews * proportion);
        const likes = Math.round(totalLikes * proportion);

        const coinsFromReels = data.reels * 5;
        const coinsFromPosts = data.posts * 2;
        const coinsFromStories = data.stories * 1;
        const coinsFromViews = Math.floor(views / 10);
        const coinsFromLikes = Math.floor(likes / 10);

        return {
          month,
          ...data,
          views,
          likes,
          totalCoins:
            coinsFromReels +
            coinsFromPosts +
            coinsFromStories +
            coinsFromViews +
            coinsFromLikes,
        };
      });

      // 🟩 Sort by latest first
      parsed.sort((a, b) => new Date(b.month) - new Date(a.month));
      setMonthlyData(parsed);

      const requests = withdrawRes.data.data || [];
      const map = {};
      requests.forEach((r) => {
        map[r.month] = r.status;
      });
      setWithdrawRequests(map);
    } catch (err) {
      console.error("❌ Error fetching earning history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchData()
    }
  }, [userData]);

  const isCurrentMonth = (month) => {
    const now = new Date();
    const current = now.toLocaleString("default", { month: "long", year: "numeric" });
    return month === current;
  };

  // 🟩 Withdraw directly here
  const handleWithdraw = async (month, totalRupee) => {
    try {
      setWithdrawing(true);
      await axios.post(`${backendURL}/user-earnings/request`, {
        month,
        totalRupee,
        userId: userData._id,
        userName: userData.name,
      });
      alert("✅ Withdraw request submitted successfully!");
      fetchData(); // refresh data
    } catch (err) {
      console.error("❌ Withdraw failed:", err.message);
      alert("Something went wrong while requesting withdraw.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="earning-container" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {/* Header */}
        <div className="earning-header">
          <h2>Earning History</h2>
        </div>

        {/* Summary */}
        <div className="summary-box">
          <h3>Total Earning</h3>
          <p className="coins">{(monthlyData.reduce((acc, i) => acc + i.totalCoins, 0)).toFixed(0)} Coins</p>
          <p className="rupees">
            ₹ {coinToRupee(monthlyData.reduce((acc, i) => acc + i.totalCoins, 0))}
          </p>
        </div>

        <h4 style={{ textAlign: "center", color: "green", margin: "10px 0" }}>
          Month wise
        </h4>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : monthlyData.length === 0 ? (
          <p className="no-data">No earnings history found.</p>
        ) : (
          <div className="earning-list">
            {monthlyData.map((item, i) => {
              const status = withdrawRequests[item.month];
              const showWithdraw = !isCurrentMonth(item.month);
              return (
                <div className="earning-card" key={i}>
                  <div className="left">
                    <h4>{item.month} Earning</h4>
                    <p>Total Reels: <strong>{item.reels}</strong></p>
                    <p>Total Posts: <strong>{item.posts}</strong></p>
                    <p>Total Stories: <strong>{item.stories}</strong></p>
                    <p>Views: <strong>{item.views}</strong></p>
                    <p>Likes: <strong>{item.likes}</strong></p>
                    <p>
                      Coins Earned:{" "}
                      <strong style={{ color: "#f9a825" }}>{item.totalCoins}</strong>
                    </p>
                  </div>

                  <div className="right">
                    <p className="earning-label">Earning</p>
                    <p className="earning-amount">
                      ₹ {coinToRupee(item.totalCoins)}
                    </p>

                    {showWithdraw ? (
                      !status ? (
                        <button
                          className="btn withdraw"
                          disabled={withdrawing}
                          onClick={() =>
                            handleWithdraw(item.month, coinToRupee(item.totalCoins))
                          }
                        >
                          {withdrawing ? "Processing..." : "Withdraw"}
                        </button>
                      ) : status === "pending" ? (
                        <button className="btn pending">Pending Withdraw</button>
                      ) : (
                        <button className="btn completed">Completed</button>
                      )
                    ) : (
                      <p className="current-month">Current month</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

         <div className="note-box">
          <p>
            <strong style={{ color: "black" }}>Please withedraw only in mobile...</strong>
          </p>
        </div>

        <div className="note-box">
          <p>
            Note: When you have completed one month, you will get the{" "}
            <strong style={{ color: "green" }}>withdraw button</strong>.
          </p>
          <p>✅ Minimum withdraw amount: ₹1 or above.</p>
        </div>
      </div>
    </div>
  );
};

export default EarningHistory;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import "./EarningHistory.css";
// import backendURL from "../../utils/String";

// const EarningHistory = () => {
//   const { userData } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { coins = 0, rupees = 0 } = location.state || {};

//   const [loading, setLoading] = useState(true);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [withdrawRequests, setWithdrawRequests] = useState({});

//   const coinToRupee = (coins) => ((coins / 100) * 5).toFixed(2);

//   // 🟩 Fetch earning data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [reelsRes, postsRes, storiesRes, viewsRes, likesRes, withdrawRes] =
//         await Promise.all([
//           axios.get(`${backendURL}/reel/getFrienddata/${userData._id}`),
//           axios.get(`${backendURL}/post/getFrienddata/${userData._id}`),
//           axios.get(`${backendURL}/story/getFriendStorydata/${userData._id}`),
//           axios.get(`${backendURL}/reel/totalViewsByUser/${userData._id}`),
//           axios.get(`${backendURL}/post/likedPosts/count/${userData._id}`),
//           axios.get(`${backendURL}/user-earnings/allrequests/${userData._id}`),
//         ]);

//       const reels = reelsRes.data.data || [];
//       const posts = postsRes.data.data || [];
//       const stories = storiesRes.data.data || [];

//       const totalViews = viewsRes.data?.totalViews || 0;
//       const totalLikes = likesRes.data?.totalLikedPosts || 0;

//       // --- Group by month ---
//       const groupByMonth = (items) =>
//         items.reduce((acc, item) => {
//           const month = new Date(item.createdAt).toLocaleString("default", {
//             month: "long",
//             year: "numeric",
//           });
//           if (!acc[month]) acc[month] = { reels: 0, posts: 0, stories: 0 };
//           if (item.type === "reel") acc[month].reels += 1;
//           if (item.type === "post") acc[month].posts += 1;
//           if (item.type === "story") acc[month].stories += 1;
//           return acc;
//         }, {});

//       const reelsMonth = groupByMonth(reels.map((r) => ({ ...r, type: "reel" })));
//       const postsMonth = groupByMonth(posts.map((p) => ({ ...p, type: "post" })));
//       const storiesMonth = groupByMonth(
//         stories.map((s) => ({ ...s, type: "story" }))
//       );

//       const allMonths = { ...reelsMonth, ...postsMonth, ...storiesMonth };
//       Object.keys(allMonths).forEach((month) => {
//         allMonths[month].reels = reelsMonth[month]?.reels || 0;
//         allMonths[month].posts = postsMonth[month]?.posts || 0;
//         allMonths[month].stories = storiesMonth[month]?.stories || 0;
//       });

//       // --- Approximate monthly data ---
//       const totalReelsCount = reels.length || 1;
//       const parsed = Object.entries(allMonths).map(([month, data]) => {
//         const proportion = data.reels / totalReelsCount;
//         const views = Math.round(totalViews * proportion);
//         const likes = Math.round(totalLikes * proportion);

//         const coinsFromReels = data.reels * 5;
//         const coinsFromPosts = data.posts * 2;
//         const coinsFromStories = data.stories * 1;
//         const coinsFromViews = Math.floor(views / 10);
//         const coinsFromLikes = Math.floor(likes / 10);

//         return {
//           month,
//           ...data,
//           views,
//           likes,
//           totalCoins:
//             coinsFromReels +
//             coinsFromPosts +
//             coinsFromStories +
//             coinsFromViews +
//             coinsFromLikes,
//         };
//       });

//       parsed.sort((a, b) => new Date(b.month) - new Date(a.month));
//       setMonthlyData(parsed);

//       // --- Withdraw requests map ---
//       const requests = withdrawRes.data.data || [];
//       const map = {};
//       requests.forEach((r) => {
//         map[r.month] = r.status;
//       });
//       setWithdrawRequests(map);
//     } catch (err) {
//       console.error("❌ Error fetching earning history:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userData?._id) fetchData();
//   }, [userData]);

//   const isCurrentMonth = (month) => {
//     const now = new Date();
//     const current = now.toLocaleString("default", { month: "long", year: "numeric" });
//     return month === current;
//   };

//   return (
//     <div
//       className="earning-container"
//     >
//         <div style={{
//             maxWidth:'600px'
//         }}>

   
//       {/* Header */}
//       <div className="earning-header">
//         {/* <FaArrowLeft
//           size={22}
//           style={{ cursor: "pointer" }}
//           onClick={() => navigate(-1)}
//         /> */}
//         <h2>Earning History</h2>
//         {/* <div style={{ width: "20px" }} /> */}
//       </div>

//       {/* Summary */}
//       <div className="summary-box">
//         <h3>Total Earning</h3>
//         <p className="coins">{coins} Coins</p>
//         <p className="rupees">₹ {rupees}</p>
//       </div>

//       <h4 style={{ textAlign: "center", color: "green", margin: "10px 0" }}>
//         Month wise
//       </h4>

//       {loading ? (
//         <div className="loading">Loading...</div>
//       ) : monthlyData.length === 0 ? (
//         <p className="no-data">No earnings history found.</p>
//       ) : (
//         <div className="earning-list">
//           {[...monthlyData].reverse().map((item, i) => {
//             const status = withdrawRequests[item.month];
//             const showWithdraw = !isCurrentMonth(item.month);
//             return (
//               <div className="earning-card" key={i}>
//                 <div className="left">
//                   <h4>{item.month} Earning</h4>
//                   <p>Total Reels: <strong>{item.reels}</strong></p>
//                   <p>Total Posts: <strong>{item.posts}</strong></p>
//                   <p>Total Stories: <strong>{item.stories}</strong></p>
//                   <p>Views: <strong>{item.views}</strong></p>
//                   <p>Likes: <strong>{item.likes}</strong></p>
//                   <p>
//                     Coins Earned:{" "}
//                     <strong style={{ color: "#f9a825" }}>{item.totalCoins}</strong>
//                   </p>
//                 </div>

//                 <div className="right">
//                   <p className="earning-label">Earning</p>
//                   <p className="earning-amount">
//                     ₹ {coinToRupee(item.totalCoins)}
//                   </p>

//                   {showWithdraw ? (
//                     !status ? (
//                       <button
//                         className="btn withdraw"
//                         onClick={() =>
//                           navigate("/withdraw-request", {
//                             state: {
//                               month: item.month,
//                               totalRupee: coinToRupee(item.totalCoins),
//                               userName: userData.name,
//                               userId: userData._id,
//                             },
//                           })
//                         }
//                       >
//                         Withdraw
//                       </button>
//                     ) : status === "pending" ? (
//                       <button className="btn pending">Pending Withdraw</button>
//                     ) : (
//                       <button className="btn completed">Completed</button>
//                     )
//                   ) : (
//                     <p className="current-month">Current month</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className="note-box">
//         <p>
//           Note: When you have completed one month, you will get the{" "}
//           <strong style={{ color: "green" }}>withdraw button</strong>.
//         </p>
//         <p>✅ Minimum withdraw amount: ₹1 or above.</p>
//       </div>
//     </div>
//          </div>
//   );
// };

// export default EarningHistory;
