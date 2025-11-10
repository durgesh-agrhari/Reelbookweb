import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VideoPlayer.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRandomReels } from '../../redux/RandomReelSlice';

import like from '../../assets/likebtn.png';
import liked from "../../assets/liked.png";
import comment from '../../assets/comment.png';
import share from '../../assets/share.png';
import views from '../../assets/eye21.png';
import logo from '../../assets/logo123.png';
import backendURL, { REEL_VIEWS_POST } from '../../utils/String';

const VideoPlayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const { reels, page, hasMore, loading } = useSelector(
    (state) => state.randomReel
  );

  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState(state?.currentIndex || 0);
  const [videoList, setVideoList] = useState(state?.videoList || []);

  const [isLiked, setIsLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const video = videoList[index];

  // 🔁 When Redux reels update (after fetching next page), append to list
  useEffect(() => {
    if (reels && reels.length > videoList?.length) {
      setVideoList(reels);
    }
  }, [videoList.length]);

  // ✅ Fetch more videos automatically when near the end
  useEffect(() => {
    if (index >= videoList?.length - 2 && hasMore && !loading) {
      dispatch(fetchRandomReels(page));
    }
  }, [index, videoList?.length, hasMore, loading, page, dispatch]);

  // ✅ Increment view count when video changes
  useEffect(() => {
    if (video?._id) incrementViewCount(video._id);
    if (videoRef.current) videoRef.current.load();
  }, [index, video]);

  const incrementViewCount = async (videoId) => {
    try {
      await axios.post(`${backendURL}${REEL_VIEWS_POST}/${videoId}`);
      // console.log("✅ View count incremented:", videoId);
    } catch (err) {
      console.error("❌ Failed to increment view count:", err.message);
    }
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const handleNext = () => {
    if (index < videoList?.length - 1) {
      setIndex(index + 1);
    } else if (hasMore && !loading) {
      // Load next batch automatically
      dispatch(fetchRandomReels(page));
    } else {
      console.log("🎬 End of list");
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setShowPopup(true); // simulate action popup
  };

  if (!video) return <div>No video data found. Please go back.</div>;

  return (
    <div className="video-player-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <img
          src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
          alt="Back"
          className="back-icon"
        />
        Back
      </button>

      {loading && <div className="loader"></div>}

      <video
        ref={videoRef}
        src={video.videourl}
        autoPlay
        muted={muted}
        playsInline
        className="video-fullscreen"
        onClick={handleVideoClick}
        onLoadStart={() => console.log("Loading...")}
        onCanPlay={() => console.log("Ready")}
      />

      <div className="video-info">
        <img
          src={video.userProfilePic || "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"}
          alt="profile"
          className="profile-img"
        />
        <div className="text-info">
          <div className="name">{video.username}</div>
          <div className="caption">{video.caption}</div>
          <div className="views">{(video.views || 0) + 1} views</div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="like-btn" onClick={toggleLike}>
          <img src={isLiked ? liked : like} alt="Like" className="likeicon" />
          <h6>{video.likes?.length || 0}</h6>
        </button>

        <button title="Comment" onClick={() => setShowPopup(true)}>
          <img src={comment} alt="Comment" className="likeicon" />
          <h6>{video.comments?.length || 0}</h6>
        </button>

        <button title="Share" onClick={() => setShowPopup(true)}>
          <img src={share} alt="Share" className="likeicon" />
          <h6>{video.shareviews || 0}</h6>
        </button>

        <button title="View" onClick={() => setShowPopup(true)}>
          <img src={views} alt="View" className="likeicon" style={{ width: '100%', height: 20 }} />
          <h6>{video.views || 0}</h6>
        </button>

        <button onClick={handleVideoClick}>
          {muted ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/5949/5949045.png"
              alt="Muted"
              className="arrow-icon-sound"
            />
          ) : (
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-unmute-icon-download-in-svg-png-gif-file-formats--octicons-by-github-vol-1-pack-miscellaneous-icons-433180.png?f=webp"
              alt="Unmuted"
              className="arrow-icon-sound"
            />
          )}
        </button>
      </div>

      <div className="action-buttons-upanddown">
        <button onClick={handlePrev}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25637.png"
            alt="Up"
            className="arrow-icon"
          />
        </button>
        <button onClick={handleNext}>
          <img
            src="https://cdn-icons-png.freepik.com/512/61/61932.png"
            alt="Down"
            className="arrow-icon"
          />
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowPopup(false)}>
              ✕
            </button>
            <img src={logo} alt="Reelbook" className="popup-logo" />
            <h3 style={{ color: 'black' }}>Get the Full Experience!</h3>
            <p style={{ color: 'black' }}>
              Download the Reelbook App to Like, Comment & Share videos instantly.
            </p>
            <button
              className="download-btn"
              onClick={() =>
                window.open(
                  'https://play.google.com/store/apps/details?id=com.reelbook',
                  '_blank'
                )
              }
            >
              📲 Download Reelbook App
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;


// import React, { useRef, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './VideoPlayer.css';
// import axios from 'axios';

// import like from '../../assets/likebtn.png';
// import liked from "../../assets/liked.png";
// import comment from '../../assets/comment.png';
// import share from '../../assets/share.png';
// import views from '../../assets/eye21.png';
// import logo from '../../assets/logo123.png';
// import backendURL, { REEL_VIEWS_POST } from '../../utils/String';

// const VideoPlayer = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);

//   const [muted, setMuted] = useState(false);
//   const [index, setIndex] = useState(state?.currentIndex || 0);
//   const videoList = state?.videoList || [];
//   const [loading, setLoading] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const video = videoList[index];

//   // ✅ Automatically increase view count when video changes
//   useEffect(() => {
//     if (video?._id) incrementViewCount(video._id);
//     if (videoRef.current) videoRef.current.load();
//   }, [index, video]);

//   const incrementViewCount = async (videoId) => {
//     try {
//       await axios.post(`${backendURL}${REEL_VIEWS_POST}/${videoId}`);
//       console.log("✅ View count incremented:", videoId);
//     } catch (err) {
//       console.error("❌ Failed to increment view count:", err.message);
//     }
//   };

//   const handleVideoClick = () => {
//     if (!videoRef.current) return;
//     videoRef.current.muted = !videoRef.current.muted;
//     setMuted(videoRef.current.muted);
//   };

//   const handleNext = () => setIndex((prev) => (prev + 1) % videoList.length);
//   const handlePrev = () => setIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));

//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//     setShowPopup(true); // simulate action popup
//   };

//   if (!video) return <div>No video data found. Please go back.</div>;

//   return (
//     <div className="video-player-container">
//       <button onClick={() => navigate(-1)} className="back-button">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
//           alt="Back"
//           className="back-icon"
//         />
//         Back
//       </button>

//       {loading && <div className="loader"></div>}

//       <video
//         ref={videoRef}
//         src={video.videourl}
//         autoPlay
//         muted={muted}
//         playsInline
//         className="video-fullscreen"
//         onClick={handleVideoClick}
//         onLoadStart={() => setLoading(true)}
//         onCanPlay={() => setLoading(false)}
//       />

//       <div className="video-info">
//         <img
//           src={video.userProfilePic || "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"}
//           alt="profile"
//           className="profile-img"
//         />
//         <div className="text-info">
//           <div className="name">{video.username}</div>
//           <div className="caption">{video.caption}</div>
//           <div className="views">{(video.views || 0) + 1} views</div>
//         </div>
//       </div>

//       <div className="action-buttons">
//         <button className="like-btn" onClick={toggleLike}>
//           <img src={isLiked ? liked : like} alt="Like" className="likeicon" />
//           <h6>{video.likes?.length || 0}</h6>
//         </button>

//         <button title="Comment" onClick={() => setShowPopup(true)}>
//           <img src={comment} alt="Comment" className="likeicon" />
//           <h6>{video.comments?.length || 0}</h6>
//         </button>

//         <button title="Share" onClick={() => setShowPopup(true)}>
//           <img src={share} alt="Share" className="likeicon" />
//           <h6>{video.shareviews || 0}</h6>
//         </button>

//          <button title="View" onClick={() => setShowPopup(true)} >
//           <img src={views} alt="View" className="likeicon" style={{width:'100%', height:20}}/>
//           <h6>{video.views || 0}</h6>
//         </button>

//         <button onClick={handleVideoClick}>
//           {muted ? (
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/5949/5949045.png"
//               alt="Muted"
//               className="arrow-icon-sound"
//             />
//           ) : (
//             <img
//               src="https://cdn.iconscout.com/icon/free/png-256/free-unmute-icon-download-in-svg-png-gif-file-formats--octicons-by-github-vol-1-pack-miscellaneous-icons-433180.png?f=webp"
//               alt="Unmuted"
//               className="arrow-icon-sound"
//             />
//           )}
//         </button>
//       </div>

//       <div className="action-buttons-upanddown">
//         <button onClick={handlePrev}>
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/25/25637.png"
//             alt="Up"
//             className="arrow-icon"
//           />
//         </button>
//         <button onClick={handleNext}>
//           <img
//             src="https://cdn-icons-png.freepik.com/512/61/61932.png"
//             alt="Down"
//             className="arrow-icon"
//           />
//         </button>
//       </div>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <button className="close-popup" onClick={() => setShowPopup(false)}>
//               ✕
//             </button>
//             <img src={logo} alt="Reelbook" className="popup-logo" />
//             <h3 style={{color:'black'}}>Get the Full Experience!</h3>
//             <p  style={{color:'black'}} >Download the Reelbook App to Like, Comment & Share videos instantly.</p>
//             <button
//               className="download-btn"
//               onClick={() => window.open("https://play.google.com/store/apps/details?id=com.reelbook", "_blank")}
//             >
//               📲 Download Reelbook App
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;


// import React, { useRef, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './VideoPlayer.css';

// import like from '../../assets/likebtn.png';
// import comment from '../../assets/comment.png';
// import share from '../../assets/share.png';
// import liked from "../../assets/liked.png";
// import backendURL from '../../utils/String';


// const VideoPlayer = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(false);
//   const [index, setIndex] = useState(state?.currentIndex || 0);
//   const videoList = state?.videoList || [];
//   const [loading, setLoading] = useState(true);
//   const [isLiked, setIsLiked] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const video = videoList[index];

//   // ✅ Automatically increase view count when video changes
//   useEffect(() => {
//     if (video) {
//       incrementViewCount(video._id);
//       if (videoRef.current) videoRef.current.load();
//     }
//   }, [index]);

//   const incrementViewCount = async (videoId) => {
//     try {
//       await fetch(`${backendURL}/reel/view/${videoId}`, {
//         method: "POST",
//       });
//       console.log("✅ View count incremented:", videoId);
//     } catch (err) {
//       console.error("❌ Failed to update view count", err);
//     }
//   };

//   if (!video) return <div>No video data found. Please go back.</div>;

//   const handleVideoClick = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !vid.muted;
//       setMuted(vid.muted);
//     }
//   };

//   const handleNext = () => setIndex((prev) => (prev + 1) % videoList.length);
//   const handlePrev = () => setIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));

//   // ✅ Handle Like/Comment/Share actions — show popup
//   const handleActionClick = (action) => {
//     console.log(`User clicked ${action}`);
//     setShowPopup(true);
//   };

//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//     handleActionClick("like");
//   };

//   return (
//     <div className="video-player-container">
//       <button onClick={() => navigate(-1)} className="back-button">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
//           alt="Back"
//           className="back-icon"
//         />
//         Back
//       </button>

//       {loading && <div className="loader"></div>}

//       <video
//         ref={videoRef}
//         src={video.videourl}
//         autoPlay
//         muted={muted}
//         playsInline
//         className="video-fullscreen"
//         onClick={handleVideoClick}
//         onLoadStart={() => setLoading(true)}
//         onCanPlay={() => setLoading(false)}
//       />

//       <div className="video-info">
//         <img
//           src={video.userProfilePic || "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"}
//           alt="profile"
//           className="profile-img"
//         />
//         <div className="text-info">
//           <div className="name">{video.username}</div>
//           <div className="caption">{video.caption}</div>
//           <div className="views">{(video.views || 0) + 1} views</div>
//         </div>
//       </div>

//       <div className="action-buttons">
//         {/* Like */}
//         <button title="Like" className="icons">
//           <button className="like-btn" onClick={toggleLike}>
//             <img src={isLiked ? liked : like} alt="Like" className="likeicon" />
//           </button>
//           <h6>{video.likes?.length || 0}</h6>
//         </button>

//         {/* Comment */}
//         <button title="Comment" onClick={() => handleActionClick("comment")}>
//           <img src={comment} alt="Comment" className="likeicon" />
//           <h6>{video.comments?.length || 0}</h6>
//         </button>

//         {/* Share */}
//         <button title="Share" onClick={() => handleActionClick("share")}>
//           <img src={share} alt="Share" className="likeicon" />
//           <h6>{video.shareviews || 0}</h6>
//         </button>

//         {/* Sound toggle */}
//         <button className="next1" onClick={handleVideoClick}>
//           {muted ? (
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/5949/5949045.png"
//               alt="Muted"
//               className="arrow-icon-sound"
//             />
//           ) : (
//             <img
//               src="https://cdn.iconscout.com/icon/free/png-256/free-unmute-icon-download-in-svg-png-gif-file-formats--octicons-by-github-vol-1-pack-miscellaneous-icons-433180.png?f=webp"
//               alt="Unmuted"
//               className="arrow-icon-sound"
//             />
//           )}
//         </button>
//       </div>

//       <div className="action-buttons-upanddown">
//         <button className="next" onClick={handlePrev}>
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/25/25637.png"
//             alt="Up"
//             className="arrow-icon"
//           />
//         </button>
//         <button className="next" onClick={handleNext}>
//           <img
//             src="https://cdn-icons-png.freepik.com/512/61/61932.png"
//             alt="Down"
//             className="arrow-icon"
//           />
//         </button>
//       </div>

//       {/* ✅ Popup Modal for App Download */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <button className="close-popup" onClick={() => setShowPopup(false)}>
//               ✕
//             </button>
//             <img
//               src="/logo192.png"
//               alt="Reelbook"
//               className="popup-logo"
//             />
//             <h3>Get the Full Experience!</h3>
//             <p>Download the Reelbook App to Like, Comment & Share videos instantly.</p>
//             <button
//               className="download-btn"
//               onClick={() => window.open("https://play.google.com/store/apps/details?id=com.reelbook", "_blank")}
//             >
//               📲 Download Reelbook App
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;

// import React, { useRef, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './VideoPlayer.css';

// import like from '../../assets/likebtn.png'
// import comment from '../../assets/comment.png'
// import share from '../../assets/share.png' 
// import liked from "../../assets/liked.png"

// const VideoPlayer = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(false);
//   const [index, setIndex] = useState(state?.currentIndex || 0);
//   const videoList = state?.videoList || [];
//   const [loading, setLoading] = useState(true);

//   const video = videoList[index];

//     const [isLiked, setIsLiked] = useState(false);

//   const toggleLike = () => {
//     setIsLiked(!isLiked);
//   }

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.load();
//     }
//   }, [index]);

//   if (!video) return <div>No video data found. Please go back.</div>;

//   const handleVideoClick = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !vid.muted;
//       setMuted(vid.muted);
//     }
//   };

//   const handleNext = () => {
//     setIndex((prev) => (prev + 1) % videoList.length);
//   };

//   const handlePrev = () => {
//     setIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));
//   };

//   return (
//     <div className="video-player-container">
//       <button onClick={() => navigate(-1)} className="back-button">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
//           alt="Back"
//           className="back-icon"
//         />
//         Back
//       </button>
//        {loading && <div className="loader"></div>}

//       <video
//         ref={videoRef}
//         src={video.videourl}
//         autoPlay
//         muted={muted}
//         playsInline
//         className="video-fullscreen"
//         onClick={handleVideoClick}
//          onLoadStart={() => setLoading(true)}
//         onCanPlay={() => setLoading(false)}
//       />

//       <div 
//       className="video-info"
//       >
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
//           alt="profile"
//           className="profile-img"
//         />
//         <div className="text-info">
//           <div className="name">{video.username}</div>
//           <div className="caption">{video.caption}</div>
//           <div className="views">{video.views} views</div>
//         </div>
//       </div>

//       <div className="action-buttons">
        
//         <button title="Like" className='icons'>
//           {/* <img src={like} alt="Like" className="likeicon"/>  */}
//           <button className="like-btn" onClick={toggleLike}>
//             <img 
//               src={isLiked ? liked : like} 
//               alt="Like" 
//               className="likeicon"
//             />
//           </button>
//           <h6>

//           {video.likes?.length || 0}
//           </h6>
//         </button>
//         <button title="Comment"><img src={comment}
//         alt="Like"
//           className="likeicon"
//            /> <h6>
//              {video.comments?.length || 0}
//             </h6></button>
//         <button title="Share"><img src={share}
//         alt="Like"
//           className="likeicon"
//            />
//            <h6>{video.shareviews || 0} </h6>  </button>

//         <button className="next1" onClick={handleVideoClick}>
//           {
//             muted ?  <img
//             src="https://cdn-icons-png.flaticon.com/512/5949/5949045.png"
//             alt="Up"
//             className="arrow-icon-sound"
//           /> :  <img
//             src="https://cdn.iconscout.com/icon/free/png-256/free-unmute-icon-download-in-svg-png-gif-file-formats--octicons-by-github-vol-1-pack-miscellaneous-icons-433180.png?f=webp"
//             alt="Up"
//             className="arrow-icon-sound"
//           />
//           }
         
         
//         </button>
//       </div>

//       <div className="action-buttons-upanddown">
//         <button className="next" onClick={handlePrev}>
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/25/25637.png"
//             alt="Up"
//             className="arrow-icon"
//           />
//         </button>
//         <button className="next" onClick={handleNext}>
//           <img
//             src="https://cdn-icons-png.freepik.com/512/61/61932.png"
//             alt="Down"
//             className="arrow-icon"
//           />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;


// import React, { useRef, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './VideoPlayer.css';

// const VideoPlayer = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(true);
//   const [index, setIndex] = useState(state?.currentIndex || 0);
//   const videoList = state?.videoList || [];

//   const video = videoList[index];

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.load();
//     }
//   }, [index]);

//   if (!video) return <div>No video data found. Please go back.</div>;

//   const handleVideoClick = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !vid.muted;
//       setMuted(vid.muted);
//     }
//   };

//   const handleNext = () => {
//     setIndex((prev) => (prev + 1) % videoList.length);
//   };

//   const handlePrev = () => {
//     setIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));
//   };

//   return (
//     <div className="video-player-container">
//       <button onClick={() => navigate(-1)} className="back-button">
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjJU_rvpYtHoqbe1XD1XO125pUiL0VevM1XccZ8fF4H0qcxfsVku6a6AcfVVl2qg0YC6s&usqp=CAU"
//           alt="Back"
//           className="back-icon"
//         />
//         Back
//       </button>


//       <video
//         ref={videoRef}
//         src={video.src}
//         autoPlay
//         muted={muted}
//         playsInline
//         className="video-fullscreen"
//         onClick={handleVideoClick}
//       />

//       <div className="video-info">
//         <img src={video.profile} alt="profile" className="profile-img" />
//         <div className="text-info">
//           <div className="name">{video.name}</div>
//           <div className="username">{video.username}</div>
//           <div className="views">{video.views}</div>
//         </div>
//       </div>

//       <div className="action-buttons">
//         <button title="Like">👍</button>
//         <button title="Comment">💬</button>
//         <button title="Share">🔗</button>
//         <button title="Custom">MC</button>
//       </div>

//       {/* <div className="action-buttons-upanddown">
//         <button className='next' onClick={handlePrev}>Previous</button>
//         <button className='next' onClick={handleNext}>Next</button>
//       </div> */}
//       <div className="action-buttons-upanddown">
//   <button className='next' onClick={handlePrev}>
//     <img src="https://cdn-icons-png.flaticon.com/512/25/25637.png" alt="Up" className="arrow-icon" />
//   </button>
//   <button className='next' onClick={handleNext}>
//     <img src="https://cdn-icons-png.freepik.com/512/61/61932.png" alt="Down" className="arrow-icon" />
//   </button>
// </div>

//     </div>
//   );
// };

// export default VideoPlayer;


// import React, { useRef, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './VideoPlayer.css';

// const VideoPlayer = () => {
//   const { state: video } = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const [muted, setMuted] = useState(true);

//   if (!video) {
//     return <div>No video data. Please go back.</div>;
//   }

//   const handleVideoClick = () => {
//     const vid = videoRef.current;
//     if (vid) {
//       vid.muted = !vid.muted;
//       setMuted(vid.muted);
//     }
//   };

//   return (
//     <div className="video-player-container">
//       <button onClick={() => navigate(-1)} className="back-button">← Back</button>

//       <video
//         ref={videoRef}
//         src={video.src}
//         autoPlay
//         muted={muted}
//         playsInline
//         className="video-fullscreen"
//         onClick={handleVideoClick}
//       />

//       {/* Overlay user info at bottom-left */}
//       <div className="video-info">
//         <img src={video.profile} alt="profile" className="profile-img" />
//         <div className="text-info">
//           <div className="name">{video.name}</div>
//           <div className="username">{video.username}</div>
//           <div className="views">{video.views}</div>
//         </div>
//       </div>

//       {/* Right side action buttons */}
//       <div className="action-buttons">
//         <button title="Like">👍</button>
//         <button title="Comment">💬</button>
//         <button title="Share">🔗</button>
//         <button title="Share">MC</button>
//       </div>

//        <div className="action-buttons-upanddown">
//         <button title="Like" className='next'>Previous</button>
//         <button title="Comment" className='next'>Next</button>
//       </div>
      
//     </div>
//   );
// };

// export default VideoPlayer;


// // import React from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import './VideoPlayer.css';

// // const VideoPlayer = () => {
// //   const { state: video } = useLocation();
// //   const navigate = useNavigate();

// //   if (!video) {
// //     return <div>No video data. Please go back.</div>;
// //   }

// //   return (
// //     <div className="video-player-container">
// //       <button onClick={() => navigate(-1)} className="back-button">← Back</button>

// //       <video src={video.src} controls autoPlay className="video-fullscreen" />

// //       <div className="video-info">
// //         <img src={video.profile} alt="profile" className="profile-img" />
// //         <div className="text-info">
// //           <div className="name">{video.name}</div>
// //           <div className="username">{video.username}</div>
// //           <div className="views">{video.views}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoPlayer;
