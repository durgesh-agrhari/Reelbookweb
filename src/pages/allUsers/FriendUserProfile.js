import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { useParams, useLocation } from "react-router-dom";
import backendURL from "../../utils/String";

const FriendUserProfile = () => {
  const { id } = useParams(); // userId from route `/user/:id`
  const location = useLocation();
  const uname = location.state?.uname || "";

  const [activeTab, setActiveTab] = useState("reels");
  const [previewItem, setPreviewItem] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const [reels, setReels] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const signal = controller.signal;
    async function loadFriendProfile() {
      try {
        setLoading(true);

        // Fetch profile info
        const profileRes = await fetch(`${backendURL}/getuser/${id}`, {
          signal,
        });
        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profileJson = await profileRes.json();
        setFriendData(profileJson?.data || profileJson);

        // Fetch reels & posts in parallel
        const [reelsRes, postsRes] = await Promise.all([
          fetch(`${backendURL}/reel/getFrienddata/${id}`, { signal }),
          fetch(`${backendURL}/post/getFrienddata/${id}`, { signal }),
        ]);

        const reelsJson = await reelsRes.json();
        const postsJson = await postsRes.json();

        const reelsArray = Array.isArray(reelsJson)
          ? reelsJson
          : reelsJson.data ?? [];
        const postsArray = Array.isArray(postsJson)
          ? postsJson
          : postsJson.data ?? [];

        setReels([...reelsArray].reverse());
        setPosts([...postsArray].reverse());
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error loading friend profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFriendProfile();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading profile...</h2>;
  }

  if (!friendData) {
    return <h2 style={{ textAlign: "center" }}>User not found</h2>;
  }

  return (
    <div className="profile-container">
      {/* Cover Photo */}
      <div className="cover-photo"></div>

      {/* Profile Info */}
      <div className="profile-info">
        <img
          src={
            friendData?.profilePic ||
            "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
          }
          alt="Profile"
          className="profile-i"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png";
          }}
        />
        <h2 style={{ marginTop: "30px" }}>{friendData?.name || uname}</h2>
        <p>@{friendData?.username || uname}</p>

        {/* Stats */}
        <div className="profile-stats">
          <div>
            <h4 className="post">{posts?.length + reels?.length || 0}</h4>
            <p>Posts</p>
          </div>
          <div>
            <h4 className="post">{friendData?.followers?.length || 0}</h4>
            <p>Followers</p>
          </div>
          <div>
            <h4 className="post">{friendData?.following?.length || 0}</h4>
            <p>Following</p>
          </div>
        </div>
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
                src={reel.videourl}
                style={{
                  width: "160px",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "gray",
                  borderRadius: "10px",
                }}
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
                src={post.imageurl}
                alt="Post"
                style={{
                  width: "160px",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "gray",
                  borderRadius: "10px",
                }}
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

export default FriendUserProfile;
