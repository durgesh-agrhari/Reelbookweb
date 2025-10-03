import React from 'react';
import './DownloadApp.css';
// import androidImg from '../../assets/logo.jpeg';       // Android app logo
// import iosImg from '../../assets/logo.jpeg';               // iOS app logo
import screen1 from '../../assets/ScreenShots/1.png';          // App screen preview
import screen2 from '../../assets/ScreenShots/2.png';          // App screen preview
import screen3 from '../../assets/ScreenShots/3.png';          // App screen preview
import screen4 from '../../assets/ScreenShots/4.png';          // App screen preview
import screen5 from '../../assets/ScreenShots/5.png';          // App screen preview
import screen6 from '../../assets/ScreenShots/6.png';          // App screen preview
import screen7 from '../../assets/ScreenShots/7.png';          // App screen preview
import screen8 from '../../assets/ScreenShots/8.png';          // App screen preview
import { Link } from 'react-router-dom';

const DownloadApp = () => {
  return (
    <div className="download-container">
      <div className="download-content">
        <h1>📱 Get the App Now</h1>
        <p className='hh'>Experience our app on Android and iOS with a sleek and fast interface.</p>

        {/* <div className="download-buttons">
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
        </div> */}

        <div className='right12'>

          <div>
            <h3 className='highlight1'>Download from play store and App Store</h3>
            <div className='hero__btns'>
              <button style={{ borderRadius: '10px' }}>
                <Link to='https://play.google.com/store/apps/details?id=your.android.package' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"  // ← replace with your own image
                    alt="arrow"
                    style={{ width: '160px', height: '50px' }}
                  />
                </Link>
              </button>
              <button style={{ borderRadius: '10px' }}>
                <Link to='https://apps.apple.com/us/app/your-ios-app-id' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src="https://w7.pngwing.com/pngs/327/888/png-transparent-aivalable-on-the-app-store-hd-logo.png"  // ← replace with your own image
                    alt="arrow"
                    style={{ width: '160px', height: '50px', borderRadius: '10px' }}
                  />
                </Link>
              </button>


            </div>
          </div>


        </div>

        <h3 className='highlight1'>Screens on Mobile</h3>
        <div className="screenshot-gallery">
          <img src={screen1} alt="App Screenshot 1" />
          <img src={screen2} alt="App Screenshot 2" />
          <img src={screen3} alt="App Screenshot 3" />
          <img src={screen4} alt="App Screenshot 4" />
          <img src={screen5} alt="App Screenshot 5" />
          <img src={screen6} alt="App Screenshot 6" />
          <img src={screen7} alt="App Screenshot 7" />
          <img src={screen8} alt="App Screenshot 8" />

        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
