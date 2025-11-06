import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./EarningActivity.css"; // optional for styling

const EarningActivity = () => {
  const navigate = useNavigate();

  return (
    <div className="activityc">
    <div className="earning-activity-container">
      {/* Header */}
      <div className="header">
        <FaArrowLeft
          size={22}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h2>Earning Activity</h2>
      </div>

      {/* Banner */}
      <div className="banner">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4202/4202843.png"
          alt="activity"
        />
        <p>Track your daily activity & start earning with Reelbook!</p>
      </div>

      {/* Info Section */}
      <section className="info-section">
        <h3>📊 What is Earning Activity?</h3>
        <p>
          Earning Activity helps you track your daily engagement on the Reelbook
          app. Every scroll, like, and minute spent watching videos earns you
          coins that can be converted into real money!
        </p>
      </section>

      {/* How It Works */}
      <section className="info-section">
        <h3>⚙️ How It Works</h3>
        <ul className="lititle">
          <li>1 Reel Scroll = 1 Coin</li>
          <li>1 Reel Like = 1 Coin</li>
          <li>1 Photo Like = 1 Coin</li>
          <li>1 Active Hour = 1 Coin</li>
          <li>1 Refered User = 1000 Coin</li>
          <li>1 Referal code use  = 500 Coin</li>
        </ul>
      </section>

      {/* Conversion Info */}
      <section className="info-section">
        <h3>💰 Conversion Rate</h3>
        <p>2000 Coins = ₹1</p>
      </section>

      {/* Withdraw Info */}
      <section className="info-section">
        <h3>🏦 Withdraw Rules</h3>
        <ul className="lititle">
          <li>You can withdraw only after completing 1 full month.</li>
          <li>Minimum withdraw amount: ₹1 or above.</li>
          <li>
            After completing one month, you’ll get a{" "}
            <span style={{ color: "green", fontWeight: "700" }}>Withdraw</span>{" "}
            button in the activity section.
          </li>
        </ul>
      </section>

      {/* Motivation */}
      <section className="info-section">
        <h3>🔥 Earn More, Scroll More!</h3>
        <p>
          The more you scroll, watch, and interact with content, the more coins
          you’ll earn. Stay consistent every day and convert your fun time into
          earnings.
        </p>
      </section>

      {/* CTA */}
      {/* <div className="cta-container">
        <button
          className="cta-button"
          onClick={() => navigate("/activity-user")}
        >
          Go to My Activity
        </button> 
      </div>*/}

      <p className="footer">© 2025 Reelbook - Earn by Your Activity</p>
    </div>
    </div>
  );
};

export default EarningActivity;
