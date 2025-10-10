
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Contact.css";
import contactImg from "../../assets/contactus.png";
import backendURL from "../../utils/String";

const Contact = () => {
  const { userData} = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    text: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ Auto-fill if user logged in
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = userData?._id || null;
    const { name, email, phone, text } = formData;

    if (!name || !email || !text) {
      alert("⚠️ Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${backendURL}/contact/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, email, phone, text }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Message sent successfully!");
        setFormData({
          name: userData?.name || "",
          email: userData?.email || "",
          phone: "",
          text: "",
        });
      } else {
        alert(`❌ Failed to send: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("⚠️ Server error. Please try again later.");
    }

    setSubmitting(false);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-form">
          <h1>Contact Us</h1>
          <p className="pp">
            Have questions, feedback, or need help? Reach out to us below!
          </p>

          <form onSubmit={handleSubmit}>
            <label className="pp">Name</label>
            <input
              className="inputab"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              disabled={!!userData} // disable if logged in
            />

            <label className="pp">Email</label>
            <input
              className="inputab"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!userData} // disable if logged in
            />

            <label className="pp">Phone (optional)</label>
            <input
              className="inputab"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label className="pp">Message</label>
            <textarea
              className="inputab"
              name="text"
              rows="5"
              placeholder="Write your message..."
              value={formData.text}
              onChange={handleChange}
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-image">
          <img src={contactImg} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default Contact;


// import React from 'react';
// import './Contact.css';
// import contactImg from '../../assets/contactus.png';

// const Contact = () => {
//   return (
//     <div className="contact-container">
//       <div className="contact-content">
//         <div className="contact-form">
//           <h1>Contact Us</h1>
//           <p className='pp'>Have questions, feedback, or need help? Reach out to us below!</p>

//           <form>
//             <label className='pp'>Name</label>
//             <input className='inputab' type="text" placeholder="Enter your name" />

//             <label className='pp'>Email</label>
//             <input className='inputab' type="email" placeholder="Enter your email" />

//             <label className='pp'> Message</label>
//             <textarea className='inputab' rows="5" placeholder="Write your message..." />

//             <button type="submit">Send Message</button>
//           </form>
//         </div>

//         <div className="contact-image">
//           <img src={contactImg} alt="Contact" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
