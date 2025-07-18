import React from 'react';
import './DownloadApp.css';
import androidImg from '../../assets/logo.jpeg';       // Android app logo
import iosImg from '../../assets/logo.jpeg';               // iOS app logo
import screen1 from '../../assets/feedback.webp';          // App screen preview
import screen2 from '../../assets/feedback.webp';
import screen3 from '../../assets/feedback.webp';

const DownloadApp = () => {
  return (
    <div className="download-container">
      <div className="download-content">
        <h1>📱 Get the App Now</h1>
        <p>Experience our app on Android and iOS with a sleek and fast interface.</p>

        <div className="download-buttons">
          <a
            href="https://play.google.com/store/apps/details?id=your.android.package"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={androidImg} alt="Download on Play Store" />
          </a>
          <a
            href="https://apps.apple.com/us/app/your-ios-app-id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={iosImg} alt="Download on App Store" />
          </a>
        </div>

        <div className="screenshot-gallery">
          <img src={screen1} alt="App Screenshot 1" />
          <img src={screen2} alt="App Screenshot 2" />
          <img src={screen3} alt="App Screenshot 3" />
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
