import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ReelDeepLink = () => {
  const { reelId } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReelData = async () => {
      try {
        const response = await fetch(`https://reelbookapi.site/reel/getReel/${reelId}`);
        const data = await response.json();
        
        if (data.status && data.data) {
          setReel(data.data);
        }
      } catch (error) {
        console.error('Error fetching reel data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (reelId) {
      fetchReelData();
    }
  }, [reelId]);

  useEffect(() => {
    // Try to open app immediately
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading reel data...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{reel?.caption || 'Reelbook Reel'}</title>
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={`${reel?.username || 'Reelbook User'} on Reelbook`} />
        <meta property="og:description" content={reel?.caption || 'Watch this reel on Reelbook'} />
        <meta property="og:url" content={`https://reelbookapp.com/reel/${reelId}`} />
        <meta property="og:image" content={reel?.thumbnillurl} />
        <meta property="og:video" content={reel?.videourl || reel?.hlsUrl} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="720" />
        <meta property="og:video:height" content="1280" />
        <meta property="og:site_name" content="Reelbook" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={`${reel?.username || 'Reelbook User'} on Reelbook`} />
        <meta name="twitter:description" content={reel?.caption || 'Watch this reel on Reelbook'} />
        <meta name="twitter:image" content={reel?.thumbnillurl} />
        <meta name="twitter:site" content="@reelbook" />
        
        {/* Additional SEO meta tags */}
        <meta name="description" content={reel?.caption || `Watch this reel by ${reel?.username || 'Reelbook User'} on Reelbook`} />
        <meta name="keywords" content={`reel, video, social, reelbook, ${reel?.username || ''}`} />
        
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
          <p>Loading reel: {reelId}</p>
          {reel?.username && <p>By: {reel.username}</p>}
          {reel?.caption && <p>"{reel.caption}"</p>}
          <p>If app doesn't open automatically, you'll be redirected to Play Store.</p>
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
