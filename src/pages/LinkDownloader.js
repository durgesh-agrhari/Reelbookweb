import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function LinkDownloader() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleDownload = async () => {
    if (!link.trim()) return alert("Please paste an Instagram link");

    setLoading(true);
    setVideoUrl("");
    try {
      const res = await axios.post("http://localhost:3000/api/instagram", { url: link });
      if (res.data.success) {
        setVideoUrl(res.data.videoUrl);
      } else {
        alert("No video found!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch video");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>📸 Instagram Video Downloader</h1>
      <input
        type="text"
        placeholder="Paste Instagram video URL..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Fetching..." : "Download"}
      </button>

      {videoUrl && (
        <div className="video-section">
          <video width="320" height="560" controls src={videoUrl}></video>
          <a href={videoUrl} download className="download-btn">
            ⬇️ Download Video
          </a>
        </div>
      )}
    </div>
  );
}

export default LinkDownloader;


// // frontend/src/components/LinkDownloader.js
// import React, { useState } from "react";
// import axios from "axios";

// const LinkDownloader = () => {
//   const [link, setLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleDownload = async () => {
//     if (!link.trim()) {
//       setError("Please enter a link first");
//       return;
//     }

//     try {
//       setError("");
//       setLoading(true);
//       setResult(null);

//       const { data } = await axios.post("http://localhost:3000/link/download-video", { link });

//       setResult(data);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Download failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>📥 Link Downloader</h2>
//       <input
//         type="text"
//         placeholder="Paste YouTube or Instagram link"
//         value={link}
//         onChange={(e) => setLink(e.target.value)}
//         style={styles.input}
//       />
//       <button onClick={handleDownload} disabled={loading} style={styles.button}>
//         {loading ? "Downloading..." : "Download"}
//       </button>

//       {error && <p style={styles.error}>{error}</p>}

//       {result && (
//         <div style={styles.result}>
//           <h3>✅ Download Ready!</h3>
//           {result.thumbnailUrl && (
//             <img
//               src={result.thumbnailUrl}
//               alt="thumbnail"
//               style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
//             />
//           )}
//           <a href={result.fileUrl} download style={styles.downloadLink}>
//             ⬇️ Click to Save Video
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: 600,
//     margin: "40px auto",
//     textAlign: "center",
//     fontFamily: "Arial, sans-serif",
//   },
//   input: {
//     width: "80%",
//     padding: "10px",
//     fontSize: 16,
//     border: "1px solid #ccc",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   button: {
//     padding: "10px 20px",
//     backgroundColor: "#0095f6",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 16,
//   },
//   error: { color: "red", marginTop: 10 },
//   result: { marginTop: 20 },
//   downloadLink: {
//     display: "inline-block",
//     marginTop: 10,
//     padding: "10px 20px",
//     backgroundColor: "#28a745",
//     color: "white",
//     textDecoration: "none",
//     borderRadius: 8,
//   },
// };

// export default LinkDownloader;

// // // src/App.js
// // import React, { useState } from 'react';

// // function LinkDownloader() {
// //   const [postUrl, setPostUrl] = useState('');
// //   const [videoUrl, setVideoUrl] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   async function handleFetch(e) {
// //     e && e.preventDefault();
// //     setError(null);
// //     setVideoUrl(null);
// //     if (!postUrl) return setError('Paste an Instagram post URL first');

// //     try {
// //       setLoading(true);
// //       const resp = await fetch(`/api/resolve?url=${encodeURIComponent(postUrl)}`);
// //       const data = await resp.json();
// //       if (!resp.ok) throw new Error(data.error || 'Failed to resolve video');
// //       setVideoUrl(data.videoUrl); // we also use stream endpoint for the preview
// //     } catch (err) {
// //       setError(err.message || 'Unknown error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Inter, Arial, sans-serif' }}>
// //       <h1>Instagram Video Downloader</h1>
// //       <form onSubmit={handleFetch} style={{ display: 'flex', gap: 8 }}>
// //         <input
// //           value={postUrl}
// //           onChange={e => setPostUrl(e.target.value)}
// //           placeholder="https://www.instagram.com/p/SHORTCODE/  or /reel/..."
// //           style={{ flex: 1, padding: '10px 12px', fontSize: 16 }}
// //         />
// //         <button type="submit" disabled={loading} style={{ padding: '10px 14px' }}>
// //           {loading ? 'Fetching...' : 'Fetch'}
// //         </button>
// //       </form>

// //       {error && <div style={{ marginTop: 12, color: 'crimson' }}>{error}</div>}

// //       {videoUrl && (
// //         <div style={{ marginTop: 20 }}>
// //           <h3>Preview</h3>
// //           {/* Use backend stream route to avoid CORS issues */}
// //           <video
// //             controls
// //             style={{ width: '100%', maxHeight: '70vh', background: '#000' }}
// //             src={`/api/stream?url=${encodeURIComponent(postUrl)}`}
// //           />
// //           <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
// //             <a href={`/api/download?url=${encodeURIComponent(postUrl)}`}>
// //               <button>Download (via server)</button>
// //             </a>
// //             <button
// //               onClick={() => {
// //                 navigator.clipboard?.writeText(videoUrl);
// //                 alert('Direct video URL copied to clipboard (may be temporary).');
// //               }}
// //             >
// //               Copy direct URL
// //             </button>
// //           </div>
// //           <p style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
// //             Note: direct URL may expire or be protected. Use the download button for reliability.
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default LinkDownloader;
