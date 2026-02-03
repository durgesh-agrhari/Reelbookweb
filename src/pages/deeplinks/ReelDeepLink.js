import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const ReelDeepLink = ({ reelId }) => {
  useEffect(() => {
    // Try to open the app immediately
    const appUrl = `reelbook://reel/${reelId}`;
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.reelbook';
    
    // Try to open app first, then fallback to Play Store
    setTimeout(() => {
      window.location.href = appUrl;
    }, 100);
    
    // Fallback to Play Store if app doesn't open
    setTimeout(() => {
      window.location.href = playStoreUrl;
    }, 2000);
  }, [reelId]);

  return (
    <>
      <Helmet>
        <title>Reel on Reelbook</title>
        <meta property="og:title" content="Check out this Reel on Reelbook" />
        <meta property="og:description" content="Watch amazing content on Reelbook" />
        <meta property="og:image" content="https://reelbook.com/logo.png" />
        <meta property="og:url" content={`https://reelbook.com/reel/${reelId}`} />
        <meta property="og:type" content="video.other" />
        <meta http-equiv="refresh" content="3; url=https://play.google.com/store/apps/details?id=com.reelbook" />
      </Helmet>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h1>🎬 Opening Reelbook App...</h1>
          <p>If the app doesn't open automatically, you'll be redirected to the Play Store.</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <a 
            href="https://play.google.com/store/apps/details?id=com.reelbook"
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              display: 'inline-block'
            }}
          >
            Download Reelbook App
          </a>
        </div>
      </div>
    </>
  );
};

export default ReelDeepLink;
