import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("reels");
  const [previewItem, setPreviewItem] = useState(null); // ✅ for preview modal
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/LoginGoogle");
  }

  // Dummy reels & posts
  const reels = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    video: `https://picsum.photos/300/500?random=${i + 1}`,
    type: "reel",
  }));

  const posts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    image: `https://picsum.photos/400/400?random=${i + 10}`,
    type: "post",
  }));

  return (
    <div className="profile-container">
      {/* Cover Photo */}
      <div className="cover-photo"></div>

      {/* Profile Info */}
      <div className="profile-info">
        <img
          src={
            user?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
          }
          alt="Profile"
          className="profile-i"
        />
        <h2 style={{ color: "black", marginTop: "30px" }}>
          {user?.displayName || "User Name"}
        </h2>
        <p>{user?.email}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div>
            <h4 style={{ color: "black" }}>120</h4>
            <p>Posts</p>
          </div>
          <div>
            <h4 style={{ color: "black" }}>5.2k</h4>
            <p>Followers</p>
          </div>
          <div>
            <h4 style={{ color: "black" }}>280</h4>
            <p>Following</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-actions">
          <button
            onClick={() => navigate("/ReelPost")}
            className="btn primary"
          >
            Upload Reel
          </button>
          <button
            onClick={() => navigate("/PhotoPost")}
            className="btn secondary"
          >
            Upload Post
          </button>
          <button
            onClick={() => navigate("/StoryPost")}
            className="btn secondary"
          >
            Upload Story
          </button>
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

      {/* Conditional Content */}
      <div className="posts-grid">
        {activeTab === "reels" &&
          reels.map((reel) => (
            <div
              key={reel.id}
              className="post-item"
              onClick={() => setPreviewItem(reel)}
            >
              <img src={reel.video} alt="Reel" />
            </div>
          ))}

        {activeTab === "posts" &&
          posts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => setPreviewItem(post)}
            >
              <img src={post.image} alt="Post" />
            </div>
          ))}
      </div>

      {/* ✅ Preview Modal */}
      {previewItem && (
        <div className="preview-overlay" onClick={() => setPreviewItem(null)}>
          <div
            className="preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            {previewItem.type === "reel" ? (
              <video
                src={previewItem.video}
                controls
                autoPlay
                style={{ maxHeight: "80vh", borderRadius: "10px" }}
              />
            ) : (
              <img
                src={previewItem.image}
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
