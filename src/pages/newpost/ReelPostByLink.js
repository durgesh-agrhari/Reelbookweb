// ReelPostByLink.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import backendURL, { UPLOAD_REEL, ADD_REEL } from "../../utils/String";
import { useSelector } from "react-redux";
import "./ReelPost.css";

const categoriesData = [
  { id: '1', name: 'Motivation', image: 'https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg' },
  { id: '2', name: 'Gym Video', image: 'https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg' },
  { id: '3', name: 'Sports', image: 'https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900' },
  { id: '4', name: 'Girls-Video', image: 'https://photosnow.org/wp-content/uploads/2024/04/cute-girl-pic-cartoon_17.jpg' },
  { id: '5', name: 'Boy-Atitude', image: 'https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/166f296a084c378a004d21fcf78d04f9.jpeg?x-oss-process=style%2Fthumb' },
  // ... (rest same as before)
];

const bgColors = [
  "#FFDEE9", "#B5FFD9", "#E3DFFD", "#FFF5BA", "#DFF6FF",
  "#FFD6A5", "#E2F0CB", "#FFD9EC", "#CDE7FF"
];

const ReelPostByLink = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [caption, setCaption] = useState("");
  const [credit, setCredit] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoLink, setVideoLink] = useState(""); // ✅ NEW state for link input
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null); // ✅ for preview of link videos

  const videoRef = useRef();
  const token = useSelector((state) => state.auth.userReduxToken);

  useEffect(() => {
    if (!token) return;
    axios.post(`${backendURL}/userdata`, { token })
      .then(res => setUserData(res.data.data))
      .catch(err => console.error("Error fetching user:", err));
  }, [token]);

  // ✅ Handle file upload (same)
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoEl = document.createElement("video");
      videoEl.src = URL.createObjectURL(file);
      videoEl.currentTime = 1;

      videoEl.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 533;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/png"));
      };
    }
  };

  // ✅ NEW: Handle YouTube / Instagram link
  const handleVideoLinkDownload = async () => {
    if (!videoLink.trim()) {
      alert("Please paste a valid YouTube or Instagram link.");
      return;
    }
    setLoading(true);
    try {
      // Your backend endpoint for downloading from link
      const response = await axios.post(`${backendURL}/link/download-video`, { link: videoLink });
      // Backend should return: { fileUrl, fileName, thumbnailUrl }

      const { fileUrl, thumbnailUrl } = response.data;
      if (!fileUrl) throw new Error("Invalid video response");

      // Show preview
      setVideoPreviewUrl(fileUrl);
      setThumbnail(thumbnailUrl || null);
      setVideoFile({ fileUrl }); // virtual file
      alert("✅ Video fetched successfully!");
    } catch (err) {
      console.error("Error downloading video:", err);
      alert("❌ Failed to fetch video. Please check the link.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.find((c) => c.id === cat.id)) {
      setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // ✅ Handle Submit (works for both upload & link)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please upload or fetch a video first");
      return;
    }
    setLoading(true);

    try {
      let videoUrl = null;
      let videoKey = null;
      let thumbUrl = thumbnail;

      // If videoFile is from upload (not link)
      if (videoFile instanceof File) {
        const formDataVideo = new FormData();
        formDataVideo.append("file", videoFile);

        const uploadResponse = await fetch(backendURL + UPLOAD_REEL, {
          method: "POST",
          body: formDataVideo,
        });

        if (!uploadResponse.ok) throw new Error("Video upload failed");
        const videoRes = await uploadResponse.json();
        videoUrl = videoRes.fileUrl;
        videoKey = videoRes.fileName;

        if (thumbnail && !thumbUrl) {
          const blob = await (await fetch(thumbnail)).blob();
          const thumbFile = new File([blob], "thumb.png", { type: "image/png" });

          const formDataThumb = new FormData();
          formDataThumb.append("file", thumbFile);

          const uploadThumbRes = await fetch(backendURL + UPLOAD_REEL, {
            method: "POST",
            body: formDataThumb,
          });

          if (!uploadThumbRes.ok) throw new Error("Thumbnail upload failed");
          const thumbRes = await uploadThumbRes.json();
          thumbUrl = thumbRes.fileUrl;
        }
      } else if (videoFile.fileUrl) {
        // ✅ Video came from link
        videoUrl = videoFile.fileUrl;
        videoKey = videoUrl.split("/").pop();
      }

      const postPayload = {
        userId: userData._id,
        caption,
        creadit: credit,
        username: userData.username,
        videourl: videoUrl,
        videoKey,
        thumbnillurl: thumbUrl,
        category: selectedCategories,
      };

      await axios.post(backendURL + ADD_REEL, postPayload);

      alert("✅ Reel uploaded successfully!");
      setCaption("");
      setCredit("");
      setVideoFile(null);
      setThumbnail(null);
      setSelectedCategories([]);
      setVideoPreviewUrl(null);
      setVideoLink("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to upload reel");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categoriesData.filter((cat) =>
    (cat?.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="reel">
      <div className="container12">
        <h2 className="heading">Upload Reel (Video File or Paste Link)</h2>

        <form onSubmit={handleSubmit} className="form">
          {/* ✅ Paste Link */}
          <label className="label">Paste YouTube / Instagram Link</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Paste video link here..."
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleVideoLinkDownload}
              disabled={loading}
              className="button"
              style={{ minWidth: "160px" }}
            >
              {loading ? "Fetching..." : "🎥 Fetch Video"}
            </button>
          </div>

          <div style={{ textAlign: "center", margin: "10px 0" }}>OR</div>

          {/* ✅ Video Upload */}
          <label className="label">Upload Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="input"
          />

          {/* ✅ Preview */}
          {(videoFile || videoPreviewUrl || thumbnail) && (
            <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
              {(videoPreviewUrl || videoFile instanceof File) && (
                <video
                  ref={videoRef}
                  src={
                    videoPreviewUrl ||
                    (videoFile instanceof File ? URL.createObjectURL(videoFile) : null)
                  }
                  controls
                  className="videoPreview"
                />
              )}
              {thumbnail && (
                <div className="thumbnailBox">
                  <img src={thumbnail} alt="Thumbnail" className="thumbnailPreview" />
                  <p className="thumbText">Auto Thumbnail</p>
                </div>
              )}
            </div>
          )}

          {/* Caption */}
          <label className="label">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="textarea"
          />

          {/* Credit */}
          <label className="label">Credit (Optional)</label>
          <input
            type="text"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            placeholder="Enter username for credit"
            className="input"
          />

          {/* Category */}
          <label className="label">Category (max 3)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <div className="selectedRow">
              {selectedCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: bgColors[i % bgColors.length],
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleCategory(cat)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }}
                  />
                  <span style={{ color: "black" }}>{cat.name}</span>
                  <span style={{ marginLeft: "4px", cursor: "pointer", fontWeight: "bold", color: "black" }}>
                    ✕
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowPopup(true)}
              className="categoryBtn"
            >
              + Choose Category
            </button>
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading ? "Uploading..." : "✅ Upload Reel"}
          </button>
        </form>

        {/* Category Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popup">
              <h3 className="popupTitle">Choose Categories (Max 3)</h3>
              <div className="popupActions">
                <button onClick={() => setShowPopup(false)} className="cancelBtn">❌ Cancel</button>
                <button onClick={() => setShowPopup(false)} className="doneBtn">✅ Done</button>
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="searchInput"
              />

              <div className="categoryGrid">
                {filteredCategories.map((cat, i) => (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      background: bgColors[i % bgColors.length],
                      padding: "10px",
                      borderRadius: "6px",
                      textAlign: "center",
                      border: selectedCategories.find((c) => c.id === cat.id)
                        ? "2px solid blue"
                        : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <img src={cat.image} alt={cat.name} className="catImg" />
                    <p style={{ color: "black", fontSize: "12px" }}>{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelPostByLink;


// // ReelPost.js
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import backendURL, { UPLOAD_REEL, ADD_REEL } from "../../utils/String"; // same constants as mobile
// import { useSelector } from "react-redux"; // if you store token in redux
// // import categoriesData from "../data/categories"; // your category list
// import "./ReelPost.css";
// const categoriesData = [
//     { id: '1', name: 'Motivation', image: 'https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg' },
//     { id: '2', name: 'Gym Video', image: 'https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg' },
//     { id: '3', name: 'Sports', image: 'https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900' },
//     { id: '4', name: 'Girls-Video', image: 'https://photosnow.org/wp-content/uploads/2024/04/cute-girl-pic-cartoon_17.jpg' },
//     { id: '5', name: 'Boy-Atitude', image: 'https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/166f296a084c378a004d21fcf78d04f9.jpeg?x-oss-process=style%2Fthumb' },
//     { id: '6', name: 'Bhopury', image: 'https://source.boomplaymusic.com/group10/M00/04/28/3230e655b91b4422bf9badcbbf9ee649_464_464.jpg' },
//     { id: '7', name: 'Shayari', image: 'https://sc0.blr1.cdn.digitaloceanspaces.com/article/153856-eamvrlxriu-1611577633.jpeg' },
//     { id: '8', name: 'Love-Music', image: 'https://img.freepik.com/premium-photo/lofi-music-beautiful-anime-girl-listen-music_485374-1330.jpg' },
//     { id: '9', name: 'Comedy', image: 'https://imgeng.jagran.com/images/2024/05/08/article/image/thegreatindiankapilshow-1715169002824.jpg' },
//     { id: '10', name: 'Parlour', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWMlgfivmUvNK4Ro0IG4T-KtYWuNJbhkzZQ&s' },
//     { id: '11', name: 'Mehadi', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOEBJMjpR7cUI5dDRCQTbC0vfDM2jYEu3rA&s' },
//     { id: '12', name: 'Sweet Selfy Girls', image: 'https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_883.jpg' },
//     { id: '13', name: 'Nail Art', image: 'https://i.pinimg.com/736x/e0/0c/81/e00c814d2820c76438efbee151e4d21e.jpg' },
//     { id: '14', name: 'Hair Style', image: 'https://i.pinimg.com/236x/82/a2/40/82a240dd15dcfd5bc84c2542662e0f75.jpg' },
//     { id: '15', name: 'Art Sketch', image: 'https://i.ytimg.com/vi/NBOfvz2iaE0/maxresdefault.jpg' },
//     { id: '16', name: 'Cat Lover', image: 'https://images.ctfassets.net/ub3bwfd53mwy/5zi8myLobtihb1cWl3tj8L/45a40e66765f26beddf7eeee29f74723/6_Image.jpg?w=750' },
//     { id: '17', name: 'Dog Lover', image: 'https://t4.ftcdn.net/jpg/01/16/17/35/360_F_116173569_djlZMlMzdRG1fPd71tvhJ11Y8EEopjkJ.jpg' },
//     { id: '18', name: 'Cooking', image: 'https://hips.hearstapps.com/hmg-prod/images/one-pot-meals-1616159616.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*' },
//     { id: '19', name: 'Car Lover', image: 'https://preview.redd.it/here-she-is-the-new-temerario-what-do-yall-think-v0-ezkkox8152jd1.jpg?width=1080&crop=smart&auto=webp&s=45dcc449b83073c44a879377600c83593bf61026' },
//     { id: '20', name: 'Byke Lover', image: 'https://i.pinimg.com/236x/45/fb/f5/45fbf5364558bc1f3a155122279d8ad3.jpg' },
//     { id: '21', name: 'Salfie Poas Boy', image: 'https://i.pinimg.com/originals/ca/3c/6b/ca3c6b76a0f2d3708e06330354b5fae8.jpg' },
//     { id: '22', name: 'Singing', image: 'https://thumbs.dreamstime.com/b/sexy-young-girl-singer-singing-contrast-silhouette-sexy-singer-girl-singing-dancing-sexy-female-red-concert-dress-dancing-173265918.jpg' },
//     { id: '23', name: 'Dancing Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCk6f2rhe5YhpC_tBii2RteOj39kcQRyJImA&s' },
//     { id: '24', name: 'Nature', image: 'https://5.imimg.com/data5/SELLER/Default/2023/3/TF/BK/UW/103578143/3d-nature-wallpaper-500x500.jpg' },
//     { id: '25', name: 'God Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6g7cgN9ldehh_kDnh0PF1R2xNszaQzm_SIDVGZ62SDsHLkuTNvPWHYojsGbBOwazVg4&usqp=CAU' },
//     { id: '26', name: 'Bajan Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGIlItZm69HFnFKh_ROr8biTG2xQu9lTWXSDK4_a6IwLqcT8f7AE9QuTXo5iR1XSUcoo&usqp=CAU' },
//     { id: '27', name: 'Temple', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92zihWSb5UoidrJ5NY_ih0HWXVa1V96AsQw&s' },
//     { id: '28', name: 'GF Talk Convesation', image: 'https://t4.ftcdn.net/jpg/04/59/82/89/360_F_459828924_ANMZD5IqA4io5iAKWbK7bsPwnTmjYABC.jpg' },
//     { id: '29', name: 'Speeking', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXstrZVD0Z1qtnrlhDJyFkCSE4VksAp81TpA&s' },
//     { id: '30', name: 'Interview', image: 'https://static.wixstatic.com/media/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg' },
//     { id: '31', name: 'Trading', image: 'https://img.freepik.com/premium-vector/trading-logo-with-chart-concept_11481-675.jpg?semt=ais_hybrid' },
//     { id: '32', name: 'Bussines Idea', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bdCOESyvHbw9KspkGSrnxFW_CTA6eOPDkQ&s' },
//     { id: '33', name: 'Earn Pocket Mony', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EeQnwM2hMvlE_GHDNTooPCQgrje48fEX2t9jsP23EBAjoALyU7_Qn2cITXX2E2k1zRc&usqp=CAU' },
//     { id: '34', name: 'Video or photo Editing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB8_FwanhrD1gZtyj7dE5sBy1mWqz9t_vEdw&s' },
//     { id: '35', name: 'Skin care', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwpOqBwO1rmh5dcZ9_xf6ZvfWvWGfTL_DYw&s' },
//     { id: '36', name: 'Animay', image: 'https://i.pinimg.com/236x/62/48/03/624803bee204bc2b7761449dcc502821.jpg' },
//     { id: '37', name: 'Youtuber', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAXdgfVxpAQfJLpRo9WBmPZKoq3WYaDW27chTAHpqSAcN-to4v5ILwLl3Xwd8rSj69uuY&usqp=CAU' },
//     { id: '38', name: 'FlimWord', image: 'https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2022/03/Bollywood-celebs-investing-ft-1-1-150x150.jpg' },
//     { id: '39', name: 'Magic', image: 'https://media.istockphoto.com/id/537316429/photo/high-contrast-image-of-magician-hand-with-magic-wand.jpg?s=612x612&w=0&k=20&c=GbnLRDGmfQI_x9CQnOsxefKnJLxAAWHbH6PLpTuQQeY=' },
//     { id: '40', name: 'Ai Modal', image: 'https://static.vecteezy.com/system/resources/previews/033/504/750/non_2x/sexy-girl-generative-ai-free-photo.jpg' },
//     { id: '41', name: 'Story Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi8hg5_EibznkZCY8q_FHMgEThpgUE4sQuxg&s' },
//     { id: '42', name: 'Reality Show', image: 'https://paulamrozowicz.com/wp-content/uploads/2013/12/reality1.jpg?w=884' },
//     // Add more categories as needed
// ];




// const bgColors = [
//     "#FFDEE9", "#B5FFD9", "#E3DFFD", "#FFF5BA", "#DFF6FF",
//     "#FFD6A5", "#E2F0CB", "#FFD9EC", "#CDE7FF"
// ];

// const ReelPostByLink = () => {
//     const [videoFile, setVideoFile] = useState(null);
//     const [thumbnail, setThumbnail] = useState(null);
//     const [caption, setCaption] = useState("");
//     const [credit, setCredit] = useState("");
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [search, setSearch] = useState("");
//     const [userData, setUserData] = useState({});
//     const [loading, setLoading] = useState(false);

//     const videoRef = useRef();

//     // ✅ if you use Redux for token
//     const token = useSelector((state) => state.auth.userReduxToken);

//     // ✅ Fetch user data on mount
//     useEffect(() => {
//         if (!token) return;
//         axios.post(`${backendURL}/userdata`, { token })
//             .then(res => setUserData(res.data.data))
//             .catch(err => console.error("Error fetching user:", err));
//     }, [token]);

//     // ✅ Handle video upload & generate thumbnail
//     const handleVideoUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setVideoFile(file);

//             const videoEl = document.createElement("video");
//             videoEl.src = URL.createObjectURL(file);
//             videoEl.currentTime = 1;

//             videoEl.onloadeddata = () => {
//                 const canvas = document.createElement("canvas");
//                 canvas.width = 300;
//                 canvas.height = 533; // 9:16 ratio
//                 const ctx = canvas.getContext("2d");
//                 ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
//                 setThumbnail(canvas.toDataURL("image/png"));
//             };
//         }
//     };

//     const toggleCategory = (cat) => {
//         if (selectedCategories.find((c) => c.id === cat.id)) {
//             setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id));
//         } else if (selectedCategories.length < 3) {
//             setSelectedCategories([...selectedCategories, cat]);
//         }
//     };

//     // ✅ Upload video + thumbnail + payload (same as mobile)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!videoFile) {
//             alert("Please select a video first");
//             return;
//         }
//         setLoading(true);

//         try {
//             // --- Upload video ---
//             const formDataVideo = new FormData();
//             formDataVideo.append("file", videoFile);

//             const uploadResponse = await fetch(backendURL + UPLOAD_REEL, {
//                 method: "POST",
//                 body: formDataVideo,
//             });

//             if (!uploadResponse.ok) throw new Error("Video upload failed");
//             const videoRes = await uploadResponse.json();

//             // --- Upload thumbnail ---
//             let thumbUrl = null;
//             if (thumbnail) {
//                 const blob = await (await fetch(thumbnail)).blob();
//                 const thumbFile = new File([blob], "thumb.png", { type: "image/png" });

//                 const formDataThumb = new FormData();
//                 formDataThumb.append("file", thumbFile);

//                 const uploadThumbRes = await fetch(backendURL + UPLOAD_REEL, {
//                     method: "POST",
//                     body: formDataThumb,
//                 });

//                 if (!uploadThumbRes.ok) throw new Error("Thumbnail upload failed");
//                 const thumbRes = await uploadThumbRes.json();
//                 thumbUrl = thumbRes.fileUrl;
//             }

//             // --- Post payload ---
//             const postPayload = {
//                 userId: userData._id,
//                 caption,
//                 creadit: credit,
//                 username: userData.username,
//                 videourl: videoRes.fileUrl,
//                 videoKey: videoRes.fileName,
//                 thumbnillurl: thumbUrl,
//                 category: selectedCategories,
//             };

//             await axios.post(backendURL + ADD_REEL, postPayload);

//             alert("✅ Reel uploaded successfully!");
//             setCaption("");
//             setCredit("");
//             setVideoFile(null);
//             setThumbnail(null);
//             setSelectedCategories([]);

//         } catch (err) {
//             console.error("Upload error:", err);
//             alert("❌ Failed to upload reel");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredCategories = categoriesData.filter((cat) =>
//         (cat?.name || "").toLowerCase().includes((search || "").toLowerCase())
//     );

//     return (
//         <div className="reel">
//             <div
//                 className="container12"
//             >
//                 <h2 className="heading" >Upload Reel Buy Link ( Youtube or Instagram )</h2>
//                 <form onSubmit={handleSubmit} className="form" >
//                     {/* Video Upload */}
//                     <label className="label">Upload Video</label>
//                     <input type="file" accept="video/*" onChange={handleVideoUpload} className="input"/>
//                     <div style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
//                         {/* Preview */}
//                         {(videoFile || thumbnail) && (
//                             <div style={{ display: "flex", gap: "20px", marginTop: 10 }}>
//                                 {videoFile && (
//                                     <video ref={videoRef} src={URL.createObjectURL(videoFile)} controls className="videoPreview"/>
//                                 )}
//                                 {thumbnail && (
//                                     <div className="thumbnailBox">
//                                         <img src={thumbnail} alt="Thumbnail" className="thumbnailPreview"/>
//                                         <p className="thumbText" >Auto Thumbnail</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Caption */}
//                     <label className="label">Caption</label>
//                     <textarea
//                         value={caption}
//                         onChange={(e) => setCaption(e.target.value)}
//                         placeholder="Write a caption..."
//                         className="textarea"
//                     />

//                     {/* Credit */}
//                     <label className="label">Credit (Optional)</label>
//                     <input
//                         type="text"
//                         value={credit}
//                         onChange={(e) => setCredit(e.target.value)}
//                         placeholder="Enter username for credit"
//                       className="input"
//                     />

//                     {/* Category */}
//                     <label className="label">Category (max 3)</label>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                         {/* {selectedCategories.map((cat, i) => (
//                         <div
//                             key={cat.id}
//                             onClick={() => toggleCategory(cat)}
//                             style={{
//                                 padding: "6px 10px",
//                                 backgroundColor: bgColors[i % bgColors.length],
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             {cat.name} ✕
//                         </div>
//                     ))} */}

//                         <div className="selectedRow">
//                             {selectedCategories.map((cat, i) => (
//                                 <div
//                                     key={cat.id}
//                                     // style={{
//                                     //     ...styles.categoryChip,
//                                     //     backgroundColor: bgColors[i % bgColors.length],
//                                     //     display: "flex",
//                                     //     alignItems: "center",
//                                     //     gap: "6px",
//                                     // }}
//                                     style={{
//                                 padding: "6px 10px",
//                                 backgroundColor: bgColors[i % bgColors.length],
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                             }}
//                                     onClick={() => toggleCategory(cat)}
//                                 >
//                                     <img
//                                         src={cat.image}
//                                         alt={cat.name}
//                                         style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }}
//                                     />
//                                     <span style={{ color: 'black' }}>{cat.name}</span>
//                                     <span style={{ marginLeft: "4px", cursor: "pointer", fontWeight: "bold", color: 'black' }}>✕</span>
//                                 </div>
//                             ))}
//                         </div>


//                         <button type="button" onClick={() => setShowPopup(true)} className="categoryBtn" > + Choose Category </button>
//                     </div>

//                     <button type="submit" disabled={loading} className="button">
//                         {loading ? "Uploading..." : "✅ Upload Reel"}
//                     </button>
//                     {/* <DummyUploader /> */}

//                 </form>



//                 {/* Category Popup */}
//                 {showPopup && (
//                     <div className="popupOverlay">
//                         <div className="popup">
//                             <h3 className="popupTitle">Choose Categories ( Max - 3 ) </h3>

//                             <div className="popupActions">
//                                 <button onClick={() => setShowPopup(false)} className="cancelBtn">
//                                     ❌ Cancel
//                                 </button>
//                                 <button onClick={() => setShowPopup(false)} className="doneBtn">
//                                     ✅ Done
//                                 </button>
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 className="searchInput"
//                             />
//                             <div className="categoryGrid">
//                                 {filteredCategories.map((cat, i) => (
//                                     <div
//                                         key={cat.id}
//                                         onClick={() => toggleCategory(cat)}
//                                         style={{
//                                             background: bgColors[i % bgColors.length],
//                                             padding: "10px",
//                                             borderRadius: "6px",
//                                             textAlign: "center",
//                                             border: selectedCategories.find((c) => c.id === cat.id) ? "2px solid blue" : "2px solid transparent",
//                                             cursor: "pointer"
//                                         }}
//                                         // style={{
//                                         //     ...styles.categoryCard,
//                                         //     backgroundColor: bgColors[i % bgColors.length],
//                                         //     border: selectedCategories.find((c) => c.id === cat.id)
//                                         //         ? "2px solid #007BFF"
//                                         //         : "2px solid transparent",
//                                         // }}
//                                     >
//                                         <img src={cat.image} alt={cat.name} className="catImg"/>
//                                         <p style={{ color: 'black', fontSize: '12px' }}>{cat.name}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* <button onClick={() => setShowPopup(false)}>Done</button> */}
//                             <div className="popupActions">
//                                 <button onClick={() => setShowPopup(false)} className="cancelBtn">
//                                     ❌ Cancel
//                                 </button>
//                                 <button onClick={() => setShowPopup(false)} className="doneBtn">
//                                     ✅ Done
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };


// export default ReelPostByLink;
