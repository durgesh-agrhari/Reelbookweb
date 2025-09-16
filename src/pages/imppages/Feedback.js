import React from 'react';
// import feedbackImg from '../../assets/contactus.png'; // put a relevant image in assets folder
import feedbackImg from '../../assets/feedback.webp'; // put a relevant image in assets folder
import './Feedback.css';

const Feedback = () => {
  return (
    <div className="feedback-container">
      <div className="feedback-content">
        <div className="feedback-form">
          <h1>Feedback</h1>
          <p>We value your feedback. Let us know what you think about our app or platform.</p>

          <form>
            <label>Your Feedback</label>
            <textarea rows="7" placeholder="Write your feedback here..." className='textarea12' />
            <button type="submit">Submit</button>
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
