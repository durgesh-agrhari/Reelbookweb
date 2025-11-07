import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeVideo.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRandomReels, resetReels } from '../../redux/RandomReelSlice';

const HomeVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reels, page, loading, hasMore } = useSelector(
    (state) => state.randomReel
  );

  const observer = useRef();

  // ✅ Load first page on mount
  useEffect(() => {
    dispatch(resetReels());
    dispatch(fetchRandomReels(1));
  }, [dispatch]);

  // ✅ Infinite scroll logic
  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchRandomReels(page));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch, page]
  );

  const goToPlayer = (index) => {
    navigate('/videoplayer', {
      state: { videoList: reels, currentIndex: index },
    });
  };

  return (
    <div className="home-video-container">
      {reels.length === 0 && loading ? (
        // 🌀 Show shimmer while loading first batch
        Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="video-wrapper shimmer-wrapper">
              <div className="video-shimmer" />
              <div className="video-overlay shimmer-overlay">
                <div className="profile-pic shimmer-circle" />
                <div className="user-info shimmer-lines">
                  <div className="line short" />
                  <div className="line medium" />
                </div>
              </div>
            </div>
          ))
      ) : (
        reels.map((video, index) => {
          // 🧩 Attach observer to the last video
          if (index === reels.length - 1) {
            return (
              <div
                ref={lastVideoRef}
                key={video._id}
                className="video-wrapper"
                onClick={() => goToPlayer(index)}
              >
                <video
                  src={video.videourl}
                  muted
                  autoPlay
                  loop
                  poster={video.thumbnillurl}
                  className="video-element"
                />
                <div className="video-overlay">
                  <img
                    src={video.thumbnillurl}
                    alt="profile"
                    className="profile-pic"
                  />
                  <div className="user-info">
                    <span className="name">{video.caption}</span>
                    <span className="username"> | @{video.username}</span>
                    <h5 className="views">{video.views} views</h5>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={video._id}
                className="video-wrapper"
                onClick={() => goToPlayer(index)}
              >
                <video
                  src={video.videourl}
                  muted
                  autoPlay
                  loop
                  poster={video.thumbnillurl}
                  className="video-element"
                />
                <div className="video-overlay">
                  <img
                    src={video.thumbnillurl}
                    alt="profile"
                    className="profile-pic"
                  />
                  <div className="user-info">
                    <span className="name">{video.caption}</span>
                    <span className="username"> | @{video.username}</span>
                    <h5 className="views">{video.views} views</h5>
                  </div>
                </div>
              </div>
            );
          }
        })
      )}

      {loading && reels.length > 0 && <p className="loading-text">Loading more...</p>}
      {!hasMore && !loading && <p className="end-text">No more videos</p>}
    </div>
  );
};

export default HomeVideo;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './HomeVideo.css';
// import backendURL from '../../utils/String';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchRandomReels } from '../../redux/RandomReelSlice';

// const HomeVideo = () => {
//   const [videoList, setVideoList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();



//     const dispatch = useDispatch();
//   const { reels, page, hasMore } = useSelector(
//     (state) => state.randomReel
//   );

//   useEffect(() => {
//     dispatch(fetchRandomReels(page));
//   }, [dispatch, page]);
// console.log("reels",reels)
//   useEffect(() => {
//   fetch(`${backendURL}/reel/getallReels`)
//     .then((res) => res.json())
//     .then((result) => {
//       if (result.status && Array.isArray(result.data)) {
//         const sortedData = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setVideoList(sortedData);
//       } else {
//         console.error('Unexpected response structure:', result);
//       }
//       setLoading(false);
//     })
//     .catch((err) => {
//       console.error('Failed to fetch videos:', err);
//       setLoading(false);
//     });
// }, []);


//   const goToPlayer = (index) => {
//     navigate('/videoplayer', {
//       state: { videoList, currentIndex: index },
//     });
//   };

//   return (
//     <div className="home-video-container">
     
//       {loading
//         ? Array(6).fill(0).map((_, index) => (
//             <div key={index} className="video-wrapper shimmer-wrapper">
//               <div className="video-shimmer" />
//               <div className="video-overlay shimmer-overlay">
//                 <div className="profile-pic shimmer-circle" />
//                 <div className="user-info shimmer-lines">
//                   <div className="line short" />
//                   <div className="line medium" />
//                 </div>
//               </div>
//             </div>
//           ))
//         : videoList.map((video, index) => (
//             <div key={video._id} className="video-wrapper" onClick={() => goToPlayer(index)}>
//               <video
//                 src={video.videourl}
//                 muted
//                 autoPlay
//                 loop
//                 poster={video.thumbnillurl}
//                 className="video-element"
//               />
//               <div className="video-overlay">
//                 <img src={video.thumbnillurl} alt="profile" className="profile-pic" />
//                 <div className="user-info">
//                   <span className="name">{video.caption}</span>
//                   <span className="username"> | @{video.username}</span>
//                   <h5 className="views">{video.views} views</h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//     </div>
//   );
// };

// export default HomeVideo;



// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './HomeVideo.css';

// // const HomeVideo = () => {
// //   const [videoList, setVideoList] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetch('/reel/getallReels')
// //       .then((res) => res.json())
// //       .then((result) => {
// //         if (result.status && Array.isArray(result.data)) {
// //           setVideoList(result.data);
// //         } else {
// //           console.error('Unexpected response structure:', result);
// //         }
// //       })
// //       .catch((err) => {
// //         console.error('Failed to fetch videos:', err);
// //       });
// //   }, []);

// //   const goToPlayer = (index) => {
// //     navigate('/videoplayer', {
// //       state: { videoList, currentIndex: index },
// //     });
// //   };

// //   return (
// //     <div className="home-video-container">
// //       {videoList.map((video, index) => (
// //         <div key={video._id} className="video-wrapper" onClick={() => goToPlayer(index)}>
// //           <video
// //             src={video.videourl}
// //             muted
// //             autoPlay
// //             loop
// //             poster={video.thumbnillurl}
// //             className="video-element"
// //           />
// //           <div className="video-overlay">
// //             <img
// //               src={video.thumbnillurl}
// //               alt="profile"
// //               className="profile-pic"
// //             />
// //             <div className="user-info">
// //               <span className="name">{video.caption}</span>
// //               <span className="username"> | @{video.username}</span>
// //               <h5 className="views">{video.views} views</h5>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default HomeVideo;


// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './HomeVideo.css';

// // const videoList = [
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   // ... more videos
// // ];


// // const HomeVideo = () => {
// //   const navigate = useNavigate();

// //   const goToPlayer = (index) => {
// //     navigate('/videoplayer', {
// //       state: { videoList, currentIndex: index },
// //     });
// //   };

// //   return (
// //     <div className="home-video-container">
// //       {videoList.map((video, index) => (
// //         <div key={index} className="video-wrapper" onClick={() => goToPlayer(index)}>
// //           <video src={video.src} muted autoPlay loop className="video-element" />
// //           <div className="video-overlay">
// //             <img src={video.profile} alt="profile" className="profile-pic" />
// //             <div className="user-info">
// //               <span className="name">{video.name}</span>
// //               <span className="username">| {video.username}</span>
// //               <h5 className="views">{video.views}</h5>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default HomeVideo;


// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './HomeVideo.css';

// // const videoList = [
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //     {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   // ... more videos
// // ];

// // const HomeVideo = () => {
// //   const navigate = useNavigate();

// //   const handleClick = (video) => {
// //     navigate('/videoplayer', { state: video });
// //   };

// //   return (
// //     <div className="home-video-container">
// //       {videoList.map((video, index) => (
// //         <div
// //           key={index}
// //           className="video-wrapper"
// //           onClick={() => handleClick(video)}
// //         >
// //           <video
// //             src={video.src}
// //             className="video-element"
// //             muted
// //             autoPlay
// //             loop
// //           />
// //           <div className="video-overlay">
// //             <img src={video.profile} alt="profile" className="profile-pic" />
// //             <div className="user-info">
// //               <span className="name">{video.name}</span>
// //               <span className="username"> | {video.username}</span>
// //               <h5 className="views">{video.views}</h5>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default HomeVideo;


// // import React from 'react';
// // import './HomeVideo.css';

// // const videoList = [
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'Mike Lee',
// //     username: '@mikelee',
// //     views: '22.3K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Sara Kim',
// //     username: '@sarak',
// //     views: '5.6K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'Chris Brown',
// //     username: '@chrisb',
// //     views: '13.1K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Alice Doe',
// //     username: '@alice_doe',
// //     views: '3.7K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// // ];

// // const HomeVideo = () => {
// //   return (
// //     <div className="home-video-container">
// //       {videoList.map((video, index) => (
// //         <div key={index} className="video-wrapper">
// //           <video
// //             src={video.src}
// //             className="video-element"
// //             muted
// //             autoPlay
// //             loop
// //           />
// //           <div className="video-overlay">
// //             <img src={video.profile} alt="profile" className="profile-pic" />
// //             <div className="user-info">
// //               <span className="name">{video.name} </span>
// //               <span className="username">| {video.username}</span>  
// //              <h5 className="views">{video.views}</h5>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default HomeVideo;


// // import React, { useState } from 'react';
// // import './HomeVideo.css';

// // const videoList = [
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'John Doe',
// //     username: '@john_doe',
// //     views: '12.4K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Jane Smith',
// //     username: '@jane_smith',
// //     views: '8.9K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'Mike Lee',
// //     username: '@mikelee',
// //     views: '22.3K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Sara Kim',
// //     username: '@sarak',
// //     views: '5.6K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/mov_bbb.mp4',
// //     name: 'Chris Brown',
// //     username: '@chrisb',
// //     views: '13.1K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// //   {
// //     src: 'https://www.w3schools.com/html/movie.mp4',
// //     name: 'Alice Doe',
// //     username: '@alice_doe',
// //     views: '3.7K views',
// //     profile: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
// //   },
// // ];

// // const HomeVideo = () => {
// //   const [selectedIndex, setSelectedIndex] = useState(null);

// //   const handleNext = () => {
// //     setSelectedIndex((prev) => (prev + 1) % videoList.length);
// //   };

// //   const handlePrev = () => {
// //     setSelectedIndex((prev) =>
// //       prev === 0 ? videoList.length - 1 : prev - 1
// //     );
// //   };

// //   if (selectedIndex !== null) {
// //     const current = videoList[selectedIndex];
// //     return (
// //       <div className="video-player-wrapper">
// //         <div className="back-button" onClick={() => setSelectedIndex(null)}>← Back</div>

// //         <div className="video-scroll-container">
// //           {videoList.map((video, i) => (
// //             <div
// //               key={i}
// //               className="single-video"
// //               style={{ transform: `translateY(-${selectedIndex * 100}vh)` }}
// //             >
// //               <video src={video.src} className="full-video" controls autoPlay />

// //               <div className="overlay-info">
// //                 <img src={video.profile} alt="profile" className="profile-img" />
// //                 <div className="text-info">
// //                   <div className="name">{video.name}</div>
// //                   <div className="username">{video.username}</div>
// //                   <div className="views">{video.views}</div>
// //                 </div>
// //               </div>

// //               <div className="actions">
// //                 <button>👍 Like</button>
// //                 <button>💬 Comment</button>
// //                 <button>↗ Share</button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="nav-buttons">
// //           <button onClick={handlePrev}>⬆ Prev</button>
// //           <button onClick={handleNext}>⬇ Next</button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="home-video-container">
// //       {videoList.map((video, index) => (
// //         <div
// //           key={index}
// //           className="video-wrapper"
// //           onClick={() => setSelectedIndex(index)}
// //         >
// //           <video
// //             src={video.src}
// //             className="video-element"
// //             muted
// //             autoPlay
// //             loop
// //           />
// //           <div className="video-overlay">
// //             <img src={video.profile} alt="profile" className="profile-pic" />
// //             <div className="user-info">
// //               <span className="name">{video.name}</span>
// //               <span className="username">{video.username}</span>
// //               <span className="views">{video.views}</span>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default HomeVideo;
