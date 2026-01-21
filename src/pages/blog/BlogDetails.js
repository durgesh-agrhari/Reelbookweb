import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./blogdetails.css";

const sampleBlogs = {
  1: {
    title: "How to Grow on Reelbook",
    image: "https://picsum.photos/500/300",
    desc1: "Reelbook is a powerful platform to grow your audience...",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc2: "Use hashtags, post consistently, and engage...",
    author: "John Doe",
    date: "02 Dec 2025",
    views: 1500,
  },
  2: {
    title: "Top 10 Earning Tips",
    image: "https://picsum.photos/500/302",
    desc1: "Learn the best earning strategies...",
    youtube: "",
    desc2: "Share reels daily and use trending sounds...",
    author: "Ayesha Khan",
    date: "28 Nov 2025",
    views: 2400,
  },
};

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    setBlog(sampleBlogs[id]);
  }, [id]); // ✅ ESLint satisfied

  if (!blog) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    return (
    <div className="detail-container">

      <h2 className="detail-title">{blog.title}</h2>

      <img className="detail-image" src={blog.image} alt="" />

      <p className="detail-text">{blog.desc1}</p>

      {blog.youtube && (
        <iframe
          className="detail-video"
          src={blog.youtube}
          title="YouTube Video"
          allowFullScreen
        ></iframe>
      )}

      <p className="detail-text">{blog.desc2}</p>

      <div className="detail-info">
        <span>✍️ {blog.author}</span>
        <span>📅 {blog.date}</span>
        <span>👁 {blog.views} views</span>
      </div>

      <div className="detail-actions">
        <button>👍 Like</button>
        <button>👎 Dislike</button>
        <button>🔗 Share</button>
      </div>
    </div>
  );
};

export default BlogDetails;


// // BlogDetails.js
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./blogdetails.css";

// const BlogDetails = () => {
//   const { id } = useParams();
//   const [blog, setBlog] = useState(null);

//   const sampleBlogs = {
//     1: {
//       title: "How to Grow on Reelbook",
//       image: "https://picsum.photos/500/300",
//       desc1: "Reelbook is a powerful platform to grow your audience...",
//       youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       desc2: "Use hashtags, post consistently, and engage...",
//       author: "John Doe",
//       date: "02 Dec 2025",
//       views: 1500,
//     },
//     2: {
//       title: "Top 10 Earning Tips",
//       image: "https://picsum.photos/500/302",
//       desc1: "Learn the best earning strategies...",
//       youtube: "",
//       desc2: "Share reels daily and use trending sounds...",
//       author: "Ayesha Khan",
//       date: "28 Nov 2025",
//       views: 2400,
//     }
//   };

// useEffect(() => {
//   setBlog(sampleBlogs[id]);
// }, [id, sampleBlogs]);


//   if (!blog) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

//   return (
//     <div className="detail-container">

//       <h2 className="detail-title">{blog.title}</h2>

//       <img className="detail-image" src={blog.image} alt="" />

//       <p className="detail-text">{blog.desc1}</p>

//       {blog.youtube && (
//         <iframe
//           className="detail-video"
//           src={blog.youtube}
//           title="YouTube Video"
//           allowFullScreen
//         ></iframe>
//       )}

//       <p className="detail-text">{blog.desc2}</p>

//       <div className="detail-info">
//         <span>✍️ {blog.author}</span>
//         <span>📅 {blog.date}</span>
//         <span>👁 {blog.views} views</span>
//       </div>

//       <div className="detail-actions">
//         <button>👍 Like</button>
//         <button>👎 Dislike</button>
//         <button>🔗 Share</button>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;
