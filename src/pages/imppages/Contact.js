import React from 'react';
import './Contact.css';
import contactImg from '../../assets/contactus.png';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-form">
          <h1>Contact Us</h1>
          <p className='pp'>Have questions, feedback, or need help? Reach out to us below!</p>

          <form>
            <label className='pp'>Name</label>
            <input className='inputab' type="text" placeholder="Enter your name" />

            <label className='pp'>Email</label>
            <input className='inputab' type="email" placeholder="Enter your email" />

            <label className='pp'> Message</label>
            <textarea className='inputab' rows="5" placeholder="Write your message..." />

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
