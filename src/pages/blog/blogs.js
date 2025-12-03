// Blogs.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./blogs.css";

const Blogs = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "How to Grow on Reelbook",
      image: "https://picsum.photos/400/250",
      description: "Learn how to gain followers and boost engagement on Reelbook.",
      author: "John Doe",
      date: "02 Dec 2025",
    },
    {
      id: 2,
      title: "Top 10 Earning Tips",
      image: "https://picsum.photos/400/251",
      description: "Earn more coins with these simple and effective strategies.",
      author: "Ayesha Khan",
      date: "28 Nov 2025",
    },
    {
      id: 3,
      title: "Ad Monetization Guide",
      image: "https://picsum.photos/400/252",
      description: "Understand how ads impressions work and how to earn from ads.",
      author: "Michael Smith",
      date: "22 Nov 2025",
    },
    {
      id: 4,
      title: "Boost Your Reels",
      image: "https://picsum.photos/400/253",
      description: "Tips to make your reels go viral on Reelbook.",
      author: "Ritika Shaw",
      date: "18 Nov 2025",
    },
  ];

  return (
    <div className="blogs-container">
      <h2 className="blogs-title">Reelbook Blogs</h2>

      <div className="blogs-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <img src={blog.image} alt="" className="blog-image" />

            <h3 className="blog-title">{blog.title}</h3>

            <p className="blog-description">{blog.description}</p>

            <div className="blog-row">
              <span className="blog-author">{blog.author}</span>
              <span className="blog-date">{blog.date}</span>
            </div>

            <button
              className="learn-btn"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
