import React, { useEffect, useState } from "react";
import "./EarningDashboard.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { fetchUserData } from "../../redux/AuthSlice";
import backendURL from "../../utils/String";

const EarningDashboard = () => {
//   const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);
  const [views, setViews] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [stories, setStories] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  const monthName = new Date().toLocaleString("default", { month: "long" });
  const userId = userData?._id;
  console.log("user details login in ", userData)

  // 🟩 Fetch user content
//   useEffect(() => {
//     if (!userId) return;

//     async function fetchAllContent() {
//       try {
//         const [reelsRes, postsRes, storiesRes] = await Promise.all([
//           fetch(`${backendURL}/reel/getFrienddata/${userId}`),
//           fetch(`${backendURL}/post/getFrienddata/${userId}`),
//           fetch(`${backendURL}/story/getUserStories/${userId}`),
//         ]);

//         const reelsData = await reelsRes.json();
//         const postsData = await postsRes.json();
//         const storiesData = await storiesRes.json();

//         setReels(reelsData.data || []);
//         setPosts(postsData.data || []);
//         setStories(storiesData.data || []);
//       } catch (err) {
//         console.error("Error fetching content:", err);
//       }
//     }

//     fetchAllContent();
//   }, [userId]);

// 🟩 Fetch user content (Axios version)
useEffect(() => {
  if (!userId) return;

  async function fetchAllContent() {
    console.log("start fetch reels cnt")
    try {
      const [reelsRes, postsRes, storiesRes] = await Promise.all([
        axios.get(`${backendURL}/reel/getFrienddata/${userId}`),
        axios.get(`${backendURL}/post/getFrienddata/${userId}`),
        // axios.get(`${backendURL}/story/getUserStories/${userId}`),
      ]);

      console.log("reel count ======> ", reelsRes)

      setReels(reelsRes.data?.data || []);
      setPosts(postsRes.data?.data || []);
      setStories(storiesRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  }

  fetchAllContent();
}, [userId]);


  // 🟨 Fetch total views & likes
  useEffect(() => {
    if (!userId) return;

    async function fetchViewsAndLikes() {
      try {
        const viewsRes = await axios.get(`${backendURL}/reel/totalViewsByUser/${userId}`);
        const likesRes = await axios.get(`${backendURL}/post/likedPosts/count/${userId}`);
        setViews(viewsRes.data.totalViews || 0);
        setLikedCount(likesRes.data.totalLikedPosts || 0);
      } catch (error) {
        console.error("Error fetching views/likes:", error);
      }
    }

    fetchViewsAndLikes();
  }, [userId]);

  // 🟦 Calculate coins
  const reelsCount = reels?.length || 0;
  const postsCount = posts?.length || 0;
  const storiesCount = stories?.length || 0;
  const coinsFromReels = reelsCount * 5;
  const coinsFromPosts = postsCount * 2;
  const coinsFromStories = storiesCount * 1;
  const coinsFromViews = Math.floor(views / 10);
  const coinsFromLikes = Math.floor(likedCount / 10);
  const totalCoins =
    coinsFromReels + coinsFromPosts + coinsFromStories + coinsFromViews + coinsFromLikes;

  const coinToRupee = (coins) => ((coins / 500) * 1).toFixed(2);

  // 🟩 Update earnings on backend
  useEffect(() => {
    if (!userId || totalCoins <= 0) return;

    async function updateEarnings() {
      const payload = {
        userId,
        month: new Date().toISOString().slice(0, 7),
        coins: totalCoins,
        breakdown: {
          reels: coinsFromReels,
          posts: coinsFromPosts,
          stories: coinsFromStories,
          views: coinsFromViews,
          likes: coinsFromLikes,
        },
      };

      try {
        await axios.post(
          `${backendURL}/user-earnings/update-status`,
          payload
        );
      } catch (err) {
        console.error("Error updating monthly earnings:", err);
      }
    }

    updateEarnings();
  }, [totalCoins,coinsFromLikes, coinsFromPosts, coinsFromReels, coinsFromStories, coinsFromViews, userId]);

  // 🎉 Congrats Modal trigger
  useEffect(() => {
    if (totalCoins >= 500) {
      const timer = setTimeout(() => setShowCongrats(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [totalCoins]);

  return (
    <div className="container-e">
    <div className="earning-dashboard">
      {/* Header */}
      <div className="header">
        {/* <button onClick={() => navigate(-1)} className="back-btn">←</button> */}
        <h2>Your Rewards</h2>
      </div>

      {/* User info */}
      <div className="user-box">
        <img
          src={userData?.profilePic}
          alt="Profile"
          className="avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
        <div>
          <h3 className="title">Hello, {userData?.name}</h3>
          <p className="title2">
            You have posted {reelsCount} Reels, {postsCount} Posts, {storiesCount} Stories
          </p>
        </div>
      </div>

      {/* Coin summary */}
      <div className="coin-summary">
        <p style={{ color: "green" }}>
          This month earning, {monthName}
        </p>
        <div className="coin-row">
          <img
            // src="/earning.png"
            src="https://cdn-icons-png.freepik.com/512/5501/5501360.png"
            alt="Earning"
            // className="earning-img"
            style={{
                width:'50px',
                height:'50px',
            }}
          />
          <div>
            <h1 className="coin-text">{totalCoins} Coins</h1>
            <p className="rupee-text">₹ {coinToRupee(totalCoins)}</p>
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={() =>
          navigate("/EarningHistory", {
            state: { coins: totalCoins, rupees: coinToRupee(totalCoins) },
          })
        }
      >
        View Payout History
      </button>

      {/* Breakdown */}
      <div className="breakdown">
        <RewardItem title="Reels" count={reelsCount} coin={5} />
        <RewardItem title="Posts" count={postsCount} coin={2} />
        <RewardItem title="Stories" count={storiesCount} coin={1} />
        <RewardItem title="Views" count={Math.floor(views / 10)} coin={1} />
        <RewardItem title="Likes" count={Math.floor(likedCount / 10)} coin={1} />
      </div>

      {/* Rules */}
      <div className="rules">
        <h3> -: Rules :- </h3>
        <p>Step 1: Upload 50 short videos and 30 pictures</p>
        <p>Step 2: 1 hour daily activity required</p>
        <p>Step 3: Video must not violate policy</p>
        <p>Step 4: Don’t upload sexual content</p>
        <p>Step 5: Now you are eligible for earning</p>
        <p>Note: You can make fan page and earn also</p>
        <p>Note: 500 coins = ₹1</p>
      </div>

      {/* 🎉 Congrats Modal */}
      {showCongrats && (
        <div className="modal-overlay" onClick={() => setShowCongrats(false)}>
          <div className="modal">
            <h2>🎉 Congratulations!</h2>
            <p>You’ve earned over 500 coins reward!</p>
            <button className="btn-primary" onClick={() => setShowCongrats(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

// 🔹 Small reusable component
const RewardItem = ({ title, count, coin }) => (
  <div className="reward-item">
    <h4>{title}</h4>
    <p>
      {count} × {coin} = <b>{count * coin} Coins</b>
    </p>
  </div>
  
);

export default EarningDashboard;
