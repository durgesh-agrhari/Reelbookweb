import React, { useState } from "react";
import { auth } from "../../firebaseConfig/Config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reels"); // default tab

  async function logout() {
    try {
      await signOut(auth);
      navigate("/LoginGoogle");
      console.log("Google user logout");
    } catch (error) {
      console.error("Google logout error:", error);
    }
  }

  // Dummy reels & posts for grid UI
  const reels = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    video: `https://picsum.photos/300/500?random=${i + 1}`, // placeholder
  }));

  const posts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    image: `https://picsum.photos/400/400?random=${i + 10}`,
  }));

  return (
    <div className="profile-container">
      {/* Cover Photo */}
      <div className="cover-photo"></div>

      {/* Profile Info */}
      <div className="profile-info">
        <img
          src={
            auth?.currentUser?.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
          }
          alt="Profile123"
          className="profile-i"
        />
        <h2 style={{ color: "black", marginTop:'30px' }}>
          {auth?.currentUser?.displayName || "User Name"}
        </h2>
        <p>{auth?.currentUser?.email}</p>

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
          <button className="btn primary">Upload Reel</button>
          <button className="btn secondary">Upload Post</button>
          <button className="btn secondary">Upload Story</button>
        </div>

        <button className="btn logout" onClick={logout}>
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
            <div key={reel.id} className="post-item">
              <img src={reel.video} alt="Reel" />
            </div>
          ))}

        {activeTab === "posts" &&
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <img src={post.image} alt="Post" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserProfile;
