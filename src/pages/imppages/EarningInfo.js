import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCoins, FaVideo, FaUsers, FaUpload } from "react-icons/fa";
import "./EarningInfo.css";

const EarningInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="info">
    <div className="earning-info-container">
      {/* Header */}
      <div className="header">
        <FaArrowLeft size={22} onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h2>How to Earn on Reelbook</h2>
      </div>

      {/* Banner */}
      <div className="banner">
        <h1>💰 Earn Real Money with Reelbook!</h1>
        <p>India's first app that rewards you for watching reels, liking photos, being active, and uploading content.</p>
        <FaCoins size={60} style={{ color: "#f9a825", marginTop: 15 }} />
      </div>

      {/* Sections */}
      <section className="section">
        <h3>📹 Content Earnings</h3>
        <p>Upload your reels, photos, and stories to Reelbook. The more engaging your content, the more coins you earn.</p>
        <ul className="lititle">
          <li>1 Reel Upload = 5 Coins</li>
          <li>1 Post Upload = 2 Coins</li>
          <li>1 Story Upload = 1 Coin</li>
        </ul>
        <FaUpload size={40} style={{ color: "#28a745", marginTop: 10 }} />
         <h3>💵 Content Coin Conversion</h3>
        <p>Convert your coins into real money and withdraw easily.</p>
        <ul className="lititle">
          <li>500 Coins = ₹1</li>
          <li>Minimum withdrawal amount: ₹1</li>
          <li>You can withdraw after completing 1 full month of activity.</li>
        </ul>
      </section>

      <section className="section">
        <h3>🎯 Activity Earnings</h3>
        <p>Earn coins while consuming content! Scroll, watch, and interact with videos and photos to increase your earnings.</p>
        <ul className="lititle">
          <li>1 Reel Scroll = 1 Coin</li>
          <li>1 Reel Like = 1 Coin</li>
          <li>1 Photo Like = 1 Coin</li>
          <li>1 Active Hour = 1 Coin</li>
          <li>1 Refered User = 1000 Coin</li>
          <li>1 Referal code use  = 500 Coin</li>
        </ul>
        <FaVideo size={40} style={{ color: "#28a745", marginTop: 10 }} />
         <h3>💵 Activity Coin Conversion</h3>
        <p>Convert your coins into real money and withdraw easily.</p>
        <ul className="lititle">
          <li>2000 Coins = ₹1</li>
          <li>Minimum withdrawal amount: ₹1</li>
          <li>You can withdraw after completing 1 full month of activity.</li>
        </ul>
      </section>

      {/* <section className="section">
        <h3>💵 Coin Conversion</h3>
        <p>Convert your coins into real money and withdraw easily.</p>
        <ul className="lititle">
          <li>5000 Coins = ₹1</li>
          <li>Minimum withdrawal amount: ₹1</li>
          <li>You can withdraw after completing 1 full month of activity.</li>
        </ul>
      </section> */}

      <section className="section">
        <h3>🔥 Why Reelbook?</h3>
        <p>
          Reelbook is the first app in India that rewards you for both <strong>consuming content</strong> and <strong>creating content</strong>. Stay active, scroll, like, upload, and earn more every day!
        </p>
        <FaUsers size={40} style={{ color: "#28a745", marginTop: 10 }} />
      </section>

      {/* CTA */}
      {/* <div className="cta-container">
        <button className="cta-button" onClick={() => navigate("/signup")}>
          Get Started & Earn
        </button>
      </div> */}

      <p className="footer">© 2025 Reelbook - Earn Money by Your Activity & Content</p>
    </div>
    </div>
  );
};

export default EarningInfo;
