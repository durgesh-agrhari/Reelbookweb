import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, setAuthData } from "../../redux/AuthSlice";
import backendURL from "../../utils/String";

const UserProfile = () => {
  const { logout, token } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("reels");
  const [previewItem, setPreviewItem] = useState(null);
  const [reels, setReels] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Load token & user data into Redux
  useEffect(() => {
    if (token) {
      dispatch(setAuthData(token));
      dispatch(fetchUserData(token));
    }
  }, [token, dispatch]);

  console.log("reels", reels, "post", posts)
  // ✅ Get user data from Redux
  const { userData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // if there's no id yet, nothing to do
    if (!userData?._id) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function loadReelsAndPosts() {
      try {
        console.log("Fetching reels & posts for userId:", userData._id);

        // run both requests in parallel
        const [reelsRes, postsRes] = await Promise.all([
          fetch(`${backendURL}/reel/getFrienddata/${userData._id}`, { signal }),
          fetch(`${backendURL}/post/getFrienddata/${userData._id}`, { signal }),
        ]);

        // basic status checks
        if (!reelsRes.ok) throw new Error(`Reels fetch failed: ${reelsRes.status}`);
        if (!postsRes.ok) throw new Error(`Posts fetch failed: ${postsRes.status}`);

        const reelsJson = await reelsRes.json();
        const postsJson = await postsRes.json();

        console.log("reels response:", reelsJson);
        console.log("posts response:", postsJson);

        // adapt to API shape:
        // if API returns an array directly -> use it
        // if API returns { data: [...] } -> use data
        // const reelsArray = Array.isArray(reelsJson) ? reelsJson : (reelsJson.data ?? []);
        // const postsArray = Array.isArray(postsJson) ? postsJson : (postsJson.data ?? []);

        // setReels(reelsArray);
        // setPosts(postsArray);
        const reelsArray = Array.isArray(reelsJson) ? reelsJson : (reelsJson.data ?? []);
        const postsArray = Array.isArray(postsJson) ? postsJson : (postsJson.data ?? []);

        // reverse them so newest appears first
        setReels([...reelsArray].reverse());
        setPosts([...postsArray].reverse());

      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        console.error("Error fetching reels/posts:", err);
      }
    }

    loadReelsAndPosts();

    // cleanup: cancel fetch if component unmounts or userId changes
    return () => controller.abort();
  }, [userData?._id]); // only re-run when user id changes


  // ✅ Logout handler
  function handleLogout() {
    logout();
    navigate("/LoginGoogle");
  }

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading profile...</h2>;
  }

  return (
    <div className="profile-container">
      {/* Cover Photo */}
      <div className="cover-photo"></div>

      {/* Profile Info */}
      <div className="profile-info">
        <img
          src={
            userData?.profilePic ||
            "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
          }
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png";
          }}
          className="profile-i"
        />
        <h2 style={{ marginTop: "30px" }}>
          {userData?.name || "Loading..."}
        </h2>
        <p>@{userData?.username}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div>
            <h4 className="post">{posts?.length + reels?.length || 0}</h4>
            <p>Posts</p>
          </div>
          <div>
            <h4 className="post">{userData?.followers?.length || 0}</h4>
            <p>Followers</p>
          </div>
          <div>
            <h4 className="post">{userData?.following?.length || 0}</h4>
            <p>Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            onClick={() => navigate("/ReelPost")}
            className="btn primary"
            style={{ backgroundColor: 'green' }}
          >
            Upload Reel
          </button>
          <button
            onClick={() => navigate("/PhotoPost")}
            className="btn secondary"
          >
            Upload Post
          </button>
          {/* <button
            onClick={() => navigate("/StoryPost")}
            className="btn secondary"
          >
            Upload Story
          </button> */}
        </div>

        <button className="btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sub Navbar */}
      <div className="sub-navbar">
        <button
          className={activeTab === "reels" ? "sub-tab active" : "sub-tab"}
          onClick={() => setActiveTab("reels")}
        >
          Reels
        </button>
        <button
          className={activeTab === "posts" ? "sub-tab active" : "sub-tab"}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
      </div>

      {/* Reels & Posts Grid */}
      <div className="posts-grid">
        {activeTab === "reels" &&
          reels.map((reel) => (
            <div
              key={reel._id}
              className="post-item"
              onClick={() => setPreviewItem({ ...reel, type: "reel" })}
            >
              <video
                src={reel.videourl} // backend field (adjust if different)
                style={{ width: "160px", height: "100%", objectFit: "cover", backgroundColor: 'gray', borderRadius: '10px' }}
                muted
              />
            </div>
          ))}

        {activeTab === "posts" &&
          posts.map((post) => (
            <div
              key={post._id}
              className="post-item"
              onClick={() => setPreviewItem({ ...post, type: "post" })}
            >
              <img
                src={post.imageurl} // backend field (adjust if different)
                alt="Post"
                style={{ width: "160px", height: "100%", objectFit: "cover", backgroundColor: 'gray', borderRadius: '10px'}}
              />
            </div>
          ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="preview-overlay" onClick={() => setPreviewItem(null)}>
          <div
            className="preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            {previewItem.type === "reel" ? (
              <video
                src={previewItem.videourl}
                controls
                autoPlay
                style={{ maxHeight: "80vh", borderRadius: "10px" }}
              />
            ) : (
              <img
                src={previewItem.imageurl}
                alt="Preview"
                style={{ maxHeight: "80vh", borderRadius: "10px" }}
              />
            )}
            <button
              className="close-btn"
              onClick={() => setPreviewItem(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;



// import React, { useState, useContext, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import "./UserProfile.css";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserData, setAuthData } from "../../redux/AuthSlice";

// const UserProfile = () => {
//   const { user, logout, token } = useContext(AppContext);
//   const [activeTab, setActiveTab] = useState("reels");
//   const [previewItem, setPreviewItem] = useState(null); // ✅ for preview modal
//   const navigate = useNavigate();
//   console.log("user", user)
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(setAuthData(token));
//     dispatch(fetchUserData(token));
//   }, [token]); // 👈 runs only once after mount

//   const { userData } = useSelector((state) => state.auth);
//   console.log("userdata", userData)

//   function handleLogout() {
//     logout();
//     navigate("/LoginGoogle");
//   }

//   // Dummy reels & posts
//   const reels = Array.from({ length: 8 }, (_, i) => ({
//     id: i,
//     video: `https://picsum.photos/300/500?random=${i + 1}`,
//     type: "reel",
//   }));

//   const posts = Array.from({ length: 12 }, (_, i) => ({
//     id: i,
//     image: `https://picsum.photos/400/400?random=${i + 10}`,
//     type: "post",
//   }));

//   return (
//     <div className="profile-container">
//       {/* Cover Photo */}
//       <div className="cover-photo"></div>

//       {/* Profile Info */}
//       <div className="profile-info">
//         <img
//           src={userData?.profilePic || 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'}
//           alt="Profile"
//           onError={(e) => {
//             e.target.onerror = null; // prevent infinite loop
//             e.target.src =
//               'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';
//           }}
//           className="profile-i"
//         />
//         <h2 style={{ marginTop: "30px" }}>
//           {userData?.username || "Loading..."}
//         </h2>
//         <p>{user?.email}</p>

//         {/* Stats */}
//         <div className="profile-stats">
//           <div>
//             <h4 className="post" >120</h4>
//             <p>Posts</p>
//           </div>
//           <div>
//             <h4 className="post" >{userData?.followers?.length}</h4>
//             <p>Followers</p>
//           </div>
//           <div>
//             <h4 className="post" >{userData?.following?.length}</h4>
//             <p>Following</p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="profile-actions">
//           <button
//             onClick={() => navigate("/ReelPost")}
//             className="btn primary"
//           >
//             Upload Reel
//           </button>
//           <button
//             onClick={() => navigate("/PhotoPost")}
//             className="btn secondary"
//           >
//             Upload Post
//           </button>
//           <button
//             onClick={() => navigate("/StoryPost")}
//             className="btn secondary"
//           >
//             Upload Story
//           </button>
//         </div>

//         <button className="btn logout" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       {/* Sub Navbar */}
//       <div className="sub-navbar">
//         <button
//           className={activeTab === "reels" ? "sub-tab active" : "sub-tab"}
//           onClick={() => setActiveTab("reels")}
//         >
//           Reels
//         </button>
//         <button
//           className={activeTab === "posts" ? "sub-tab active" : "sub-tab"}
//           onClick={() => setActiveTab("posts")}
//         >
//           Posts
//         </button>
//       </div>

//       {/* Conditional Content */}
//       <div className="posts-grid">
//         {activeTab === "reels" &&
//           reels.map((reel) => (
//             <div
//               key={reel.id}
//               className="post-item"
//               onClick={() => setPreviewItem(reel)}
//             >
//               <img src={reel.video} alt="Reel" />
//             </div>
//           ))}

//         {activeTab === "posts" &&
//           posts.map((post) => (
//             <div
//               key={post.id}
//               className="post-item"
//               onClick={() => setPreviewItem(post)}
//             >
//               <img src={post.image} alt="Post" />
//             </div>
//           ))}
//       </div>

//       {/* ✅ Preview Modal */}
//       {previewItem && (
//         <div className="preview-overlay" onClick={() => setPreviewItem(null)}>
//           <div
//             className="preview-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {previewItem.type === "reel" ? (
//               <video
//                 src={previewItem.video}
//                 controls
//                 autoPlay
//                 style={{ maxHeight: "80vh", borderRadius: "10px" }}
//               />
//             ) : (
//               <img
//                 src={previewItem.image}
//                 alt="Preview"
//                 style={{ maxHeight: "80vh", borderRadius: "10px" }}
//               />
//             )}
//             <button
//               className="close-btn"
//               onClick={() => setPreviewItem(null)}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;


// import React, { useState, useContext } from "react";
// import { AppContext } from "../../context/AppContext";
// import "./UserProfile.css";
// import { useNavigate } from "react-router-dom";

// const UserProfile = () => {
//   const { user, logout } = useContext(AppContext); // ✅ use from context
//   const [activeTab, setActiveTab] = useState("reels"); // default tab
//   const navigate = useNavigate()


// function handleLogout() {
//   logout();
//   navigate("/LoginGoogle");
// }

//   // Dummy reels & posts for grid UI
//   const reels = Array.from({ length: 8 }, (_, i) => ({
//     id: i,
//     video: `https://picsum.photos/300/500?random=${i + 1}`, // placeholder
//   }));

//   const posts = Array.from({ length: 12 }, (_, i) => ({
//     id: i,
//     image: `https://picsum.photos/400/400?random=${i + 10}`,
//   }));

//   return (
//     <div className="profile-container">
//       {/* Cover Photo */}
//       <div className="cover-photo"></div>

//       {/* Profile Info */}
//       <div className="profile-info">
//         <img
//           src={
//             user?.photoURL ||
//             "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
//           }
//           alt="Profile"
//           className="profile-i"
//         />
//         <h2 style={{ color: "black", marginTop: "30px" }}>
//           {user?.displayName || "User Name"}
//         </h2>
//         <p>{user?.email}</p>

//         {/* Stats */}
//         <div className="profile-stats">
//           <div>
//             <h4 style={{ color: "black" }}>120</h4>
//             <p>Posts</p>
//           </div>
//           <div>
//             <h4 style={{ color: "black" }}>5.2k</h4>
//             <p>Followers</p>
//           </div>
//           <div>
//             <h4 style={{ color: "black" }}>280</h4>
//             <p>Following</p>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="profile-actions">
//           <button onClick={ ()=> navigate("/ReelPost")} className="btn primary">Upload Reel</button>
//           <button onClick={ ()=> navigate("/PhotoPost")} PhotoPost className="btn secondary">Upload Post</button>
//           <button onClick={ ()=> navigate("/StoryPost")} className="btn secondary">Upload Story</button>
//         </div>

//         <button className="btn logout" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       {/* Sub Navbar */}
//       <div className="sub-navbar">
//         <button
//           className={activeTab === "reels" ? "sub-tab active" : "sub-tab"}
//           onClick={() => setActiveTab("reels")}
//         >
//           Reels
//         </button>
//         <button
//           className={activeTab === "posts" ? "sub-tab active" : "sub-tab"}
//           onClick={() => setActiveTab("posts")}
//         >
//           Posts
//         </button>
//       </div>

//       {/* Conditional Content */}
//       <div className="posts-grid">
//         {activeTab === "reels" &&
//           reels.map((reel) => (
//             <div key={reel.id} className="post-item">
//               <img src={reel.video} alt="Reel" />
//             </div>
//           ))}

//         {activeTab === "posts" &&
//           posts.map((post) => (
//             <div key={post.id} className="post-item">
//               <img src={post.image} alt="Post" />
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
