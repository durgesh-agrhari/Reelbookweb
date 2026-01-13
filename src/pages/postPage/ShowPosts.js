import React, { useEffect, useRef, useCallback, useState } from "react";
import "./ShowPosts.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomPosts, resetPosts } from "../../redux/randomPostSlice";
import { useNavigate } from "react-router-dom";
// import { fetchRandomPosts, resetPosts } from "../../redux/randomPostSlice";

const ShowPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ✅ MUST match store key: state.randomPost
  const { posts, page, loading, hasMore } = useSelector(
    (state) => state.randomPost
  );

  const observer = useRef();
  const [zoomImage, setZoomImage] = useState(null);

  // ✅ Load first page on mount (same as HomeVideo)
  useEffect(() => {
    dispatch(resetPosts());
    dispatch(fetchRandomPosts(1));
  }, [dispatch]);

  // ✅ Infinite scroll logic (SAME AS HomeVideo)
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchRandomPosts(page));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch, page]
  );

  return (
    <div className="maipost">
      <div className="posts-container">
        {/* 🌀 First load skeleton */}
        {posts.length === 0 && loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="post-card skeleton-card">
                <div className="post-header">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text short"></div>
                </div>
                <div className="skeleton-rect"></div>
                <div className="skeleton-text"></div>
              </div>
            ))
        ) : (
          posts.map((post, index) => {
            const isLast = index === posts.length - 1;

            return (
              <div
                ref={isLast ? lastPostRef : null}
                key={post._id}
                className="post-card"
              >
                <div className="post-header"
                  onClick={() =>
                    navigate(`/user/${post.userId}`, {
                      state: { uname: post.username },
                    })
                  }
                >
                  <img
                    src={post.profilePic || post.imageurl}
                    alt="user"
                    className="profile-pic"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/35";
                    }}
                  />
                  <span className="usernamePost">
                    @{post.username || post.userName || "Unknown"}
                  </span>
                </div>

                <div
                  className="post-image"
                  onClick={() => setZoomImage(post.imageurl)}
                >
                  <img
                    src={post.imageurl}
                    alt=""
                    className="main-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>

                <p className="description">{post.description}</p>

                <div className="post-actions">
                  <button>❤️ Like</button>
                  <button>💬 Comment</button>
                  <button>🔗 Share</button>
                </div>
              </div>
            );
          })
        )}

        {/* 🔄 Loading more */}
        {loading && posts.length > 0 && (
          <p className="loading-text">Loading more...</p>
        )}

        {/* ❌ End reached */}
        {!hasMore && !loading && (
          <p className="end-text">No more posts</p>
        )}

        {/* 🔍 Image zoom */}
        {zoomImage && (
          <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
            <img src={zoomImage} alt="Zoomed" className="zoom-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowPosts;


// import React, { useState, useEffect } from "react";
// import "./ShowPosts.css";
// import backendURL from "../../utils/String";

// const ShowPosts = () => {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [zoomImage, setZoomImage] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         let isMounted = true;

//         const fetchPosts = async () => {
//             try {
//                 setLoading(true);
//                 const res = await fetch(`${backendURL}/post/getallPostsall`);
//                 if (!res.ok) throw new Error("Failed to fetch posts: " + res.status);
//                 const data = await res.json();
//                 if (isMounted) {
//                     setPosts((Array.isArray(data) ? data : data.data ?? []).reverse());
//                 }
//             } catch (err) {
//                 if (err.name !== "AbortError") {
//                     console.error("Error fetching posts:", err);
//                     if (isMounted) setError(err.message);
//                 }
//             } finally {
//                 if (isMounted) setLoading(false);
//             }
//         };

//         fetchPosts();

//         return () => {
//             isMounted = false;
//         };
//     }, []);

//     if (loading) {
//         // Render 4 skeleton cards
//         return (
//             <div className="maipost">
//                 <div className="posts-container">
//                     {[1, 2, 3, 4].map((i) => (
//                         <div key={i} className="post-card skeleton-card">
//                             <div className="post-header">
//                                 <div className="skeleton-circle"></div>
//                                 <div className="skeleton-text short"></div>
//                             </div>
//                             <div className="post-image">
//                                 <div className="skeleton-rect"></div>
//                             </div>
//                             <p className="description">
//                                 <div className="skeleton-text"></div>
//                                 <div className="skeleton-text short"></div>
//                             </p>
//                             <div className="post-actions">
//                                 <div className="skeleton-btn"></div>
//                                 <div className="skeleton-btn"></div>
//                                 <div className="skeleton-btn"></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return <div className="error">Error: {error}</div>;
//     }

//     return (
//         <div className="maipost">
//             <div className="posts-container">
//                 {posts.map((post) => (
//                     <div key={post._id || post.id} className="post-card">
//                         <div className="post-header">
//                             <img
//                                 src={post.profilePic || post.imageurl}
//                                 alt={post.username || "user"}
//                                 className="profile-pic"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = "https://via.placeholder.com/35";
//                                 }}
//                             />
//                             <span className="usernamePost">
//                                 <div>@{post.username || post.userName || "Unknown"}</div>
//                             </span>
//                         </div>
//                         <div className="post-image" onClick={() => setZoomImage(post.imageurl || post.imageUrl)}>
//                             <img
//                                 src={post.imageurl}
//                                 alt={post.description || ""}
//                                 className="main-image"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = "https://via.placeholder.com/300";
//                                 }}
//                             />
//                         </div>
//                         <p className="description">{post.description || ""}</p>
//                         <div className="post-actions">
//                             <button>❤️ Like</button>
//                             <button>💬 Comment</button>
//                             <button>🔗 Share</button>
//                         </div>
//                     </div>
//                 ))}

//                 {zoomImage && (
//                     <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
//                         <img src={zoomImage} alt="Zoomed" className="zoom-image" />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ShowPosts;



// import React, { useState, useEffect } from "react";
// import "./ShowPosts.css";
// import backendURL from "../../utils/String";

// const ShowPosts = () => {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [zoomImage, setZoomImage] = useState(null);

//     // Optional: error handling
//     const [error, setError] = useState(null);

// useEffect(() => {
//     let isMounted = true;

//     const fetchPosts = async () => {
//         try {
//             setLoading(true);
//             const res = await fetch(`${backendURL}/post/getallPostsall`);
//             if (!res.ok) throw new Error("Failed to fetch posts: " + res.status);
//             const data = await res.json();
//             if (isMounted) {
//                 setPosts((Array.isArray(data) ? data : data.data ?? []).reverse());
//             }
//         } catch (err) {
//             if (err.name !== "AbortError") {
//                 console.error("Error fetching posts:", err);
//                 if (isMounted) setError(err.message);
//             }
//         } finally {
//             if (isMounted) setLoading(false);
//         }
//     };

//     fetchPosts();

//     return () => {
//         isMounted = false; // cleanup only
//     };
// }, []);

//     //   console.log("posts", posts)
//     if (loading) {
//         return <div className="loading">Loading posts...</div>;
//     }

//     if (error) {
//         return <div className="error">Error: {error}</div>;
//     }

//     return (
//         <div className="maipost">
//             <div className="posts-container" >
//                 {posts.map((post) => (
//                     <div key={post._id || post.id} className="post-card">
//                         {/* Profile + Username */}
//                         <div className="post-header">
//                             <img
//                                 src={post.profilePic || post.imageurl} // adjust field names
//                                 alt={post.username || "user"}
//                                 className="profile-pic"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src =
//                                         "https://via.placeholder.com/35";
//                                 }}
//                             />
//                             <span className="usernamePost">
//                                 <div>
//                                     @{post.username || post.userName || "Unknown"}
//                                 </div>
//                             </span>
//                         </div>

//                         {/* Image */}
//                         <div className="post-image" onClick={() => setZoomImage(post.imageurl || post.imageUrl)}>
//                             <img
//                                 src={post.imageurl}
//                                 alt={post.description || ""}
//                                 className="main-image"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src =
//                                         "https://via.placeholder.com/300";
//                                 }}
//                             />
//                         </div>

//                         {/* Description */}
//                         <p className="description">
//                             {post.description || ""}
//                         </p>

//                         {/* Buttons */}
//                         <div className="post-actions">
//                             <button>❤️ Like</button>
//                             <button>💬 Comment</button>
//                             <button>🔗 Share</button>
//                         </div>
//                     </div>
//                 ))}

//                 {/* Zoom Modal */}
//                 {zoomImage && (
//                     <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
//                         <img src={zoomImage} alt="Zoomed" className="zoom-image" />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ShowPosts;
