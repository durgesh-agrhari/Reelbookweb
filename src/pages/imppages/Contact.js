import React from 'react';
import './Contact.css';
import contactImg from '../../assets/contactus.png';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-form">
          <h1>Contact Us</h1>
          <p>Have questions, feedback, or need help? Reach out to us below!</p>

          <form>
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Message</label>
            <textarea rows="5" placeholder="Write your message..." />

            <button type="submit">Send Message</button>
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
