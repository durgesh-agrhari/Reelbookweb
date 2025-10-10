import React, { useState } from "react";
import "./Feedback.css";
import feedbackImg from "../../assets/feedback.webp";
import backendURL from "../../utils/String";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      alert("⚠️ Please write some feedback before submitting!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/feedback/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Feedback submitted successfully!");
        setFormData({ name: "", text: "" });
      } else {
        alert(`❌ Failed to send feedback: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("⚠️ Server error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <div className="feedback-form">
          <h1>Feedback</h1>
          <p>
            We value your feedback. Let us know what you think about our app or platform.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Your Name (optional)</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name or leave blank"
              value={formData.name}
              onChange={handleChange}
              className="inputbox"
            />

            <label>Your Feedback</label>
            <textarea
              rows="7"
              name="text"
              placeholder="Write your feedback here..."
              value={formData.text}
              onChange={handleChange}
              className="textarea12"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="feedback-image">
          <img src={feedbackImg} alt="Feedback" />
        </div>
      </div>
    </div>
  );
};

export default Feedback;


// import React from 'react';
// // import feedbackImg from '../../assets/contactus.png'; // put a relevant image in assets folder
// import feedbackImg from '../../assets/feedback.webp'; // put a relevant image in assets folder
// import './Feedback.css';

// const Feedback = () => {
//   return (
//     <div className="feedback-container">
//       <div className="feedback-content">
//         <div className="feedback-form">
//           <h1>Feedback</h1>
//           <p>We value your feedback. Let us know what you think about our app or platform.</p>

//           <form>
//             <label>Your Feedback</label>
//             <textarea rows="7" placeholder="Write your feedback here..." className='textarea12' />
//             <button type="submit">Submit</button>
//           </form>
//         </div>

//         <div className="feedback-image">
//           <img src={feedbackImg} alt="Feedback" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feedback;
