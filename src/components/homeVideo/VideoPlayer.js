import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VideoPlayer.css';

import like from '../../assets/likebtn.png'
import comment from '../../assets/comment.png'
import share from '../../assets/share.png' 
import liked from "../../assets/liked.png"

const VideoPlayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState(state?.currentIndex || 0);
  const videoList = state?.videoList || [];
  const [loading, setLoading] = useState(true);

  const video = videoList[index];

    const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [index]);

  if (!video) return <div>No video data found. Please go back.</div>;

  const handleVideoClick = () => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = !vid.muted;
      setMuted(vid.muted);
    }
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % videoList.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));
  };

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
         onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
      />

      <div className="video-info">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
          alt="profile"
          className="profile-img"
        />
        <div className="text-info">
          <div className="name">{video.username}</div>
          <div className="caption">{video.caption}</div>
          <div className="views">{video.views} views</div>
        </div>
      </div>

      <div className="action-buttons">
        
        <button title="Like" className='icons'>
          {/* <img src={like} alt="Like" className="likeicon"/>  */}
          <button className="like-btn" onClick={toggleLike}>
            <img 
              src={isLiked ? liked : like} 
              alt="Like" 
              className="likeicon"
            />
          </button>
          <h6>

          {video.likes?.length || 0}M
          </h6>
        </button>
        <button title="Comment"><img src={comment}
        alt="Like"
          className="likeicon"
           /> <h6>
             {video.comments?.length || 0}k
            </h6></button>
        <button title="Share"><img src={share}
        alt="Like"
          className="likeicon"
           />
           <h6>{video.shareviews || 0}k </h6>  </button>

        <button className="next1" onClick={handleVideoClick}>
          {
            muted ?  <img
            src="https://cdn-icons-png.flaticon.com/512/5949/5949045.png"
            alt="Up"
            className="arrow-icon-sound"
          /> :  <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-unmute-icon-download-in-svg-png-gif-file-formats--octicons-by-github-vol-1-pack-miscellaneous-icons-433180.png?f=webp"
            alt="Up"
            className="arrow-icon-sound"
          />
          }
         
         
        </button>
      </div>

      <div className="action-buttons-upanddown">
        <button className="next" onClick={handlePrev}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25637.png"
            alt="Up"
            className="arrow-icon"
          />
        </button>
        <button className="next" onClick={handleNext}>
          <img
            src="https://cdn-icons-png.freepik.com/512/61/61932.png"
            alt="Down"
            className="arrow-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;


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
