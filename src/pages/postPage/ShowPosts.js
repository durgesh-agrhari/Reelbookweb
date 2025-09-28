import React, { useState, useEffect } from "react";
import "./ShowPosts.css";

const ShowPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoomImage, setZoomImage] = useState(null);

    // Optional: error handling
    const [error, setError] = useState(null);

useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://reelbookapi.site/post/getallPosts");
            if (!res.ok) throw new Error("Failed to fetch posts: " + res.status);
            const data = await res.json();
            if (isMounted) {
                setPosts((Array.isArray(data) ? data : data.data ?? []).reverse());
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Error fetching posts:", err);
                if (isMounted) setError(err.message);
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    fetchPosts();

    return () => {
        isMounted = false; // cleanup only
    };
}, []);

    //   console.log("posts", posts)
    if (loading) {
        return <div className="loading">Loading posts...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="maipost">
            <div className="posts-container" >
                {posts.map((post) => (
                    <div key={post._id || post.id} className="post-card">
                        {/* Profile + Username */}
                        <div className="post-header">
                            <img
                                src={post.profilePic || post.imageurl} // adjust field names
                                alt={post.username || "user"}
                                className="profile-pic"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://via.placeholder.com/35";
                                }}
                            />
                            <span className="usernamePost">
                                <div>
                                    @{post.username || post.userName || "Unknown"}
                                </div>
                            </span>
                        </div>

                        {/* Image */}
                        <div className="post-image" onClick={() => setZoomImage(post.imageurl || post.imageUrl)}>
                            <img
                                src={post.imageurl}
                                alt={post.description || ""}
                                className="main-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://via.placeholder.com/300";
                                }}
                            />
                        </div>

                        {/* Description */}
                        <p className="description">
                            {post.description || ""}
                        </p>

                        {/* Buttons */}
                        <div className="post-actions">
                            <button>❤️ Like</button>
                            <button>💬 Comment</button>
                            <button>🔗 Share</button>
                        </div>
                    </div>
                ))}

                {/* Zoom Modal */}
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
