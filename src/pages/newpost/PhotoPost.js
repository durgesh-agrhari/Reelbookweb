import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./PhotoPost.css";
import backendURL, { ADD_POST, UPLOAD_POST } from "../../utils/String"; 

const PhotoPost = () => {
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state.auth);
  // console.log("userdata", userData)

  // 📷 Select photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  // console.log("caption", caption)

  // 🚀 Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("⚠️ Please select a photo!");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload photo file
      const formData = new FormData();
      formData.append("file", photo);

      console.log("📤 Uploading file:", photo);

      const uploadRes = await fetch(backendURL + UPLOAD_POST, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error("Upload failed: " + text);
      }

      const uploadData = await uploadRes.json();
      console.log("✅ File uploaded:", uploadData);

      // Step 2: Save post details
      const addPostObj = {
        userId: userData._id,
        caption,
        username: userData.username,
        imageurl: uploadData.fileUrl,
        fileName: uploadData.fileName,
      };

      console.log("📝 Saving post:", addPostObj);

      await axios.post(backendURL + ADD_POST, addPostObj);

      setLoading(false);
      setPhoto(null);
      setPreview(null);
      setCaption("");
      alert("✅ Photo post uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setLoading(false);
      alert("❌ Upload failed! Please try again.");
    }
  };

  return (
    <div className="post">
    <div className="container">
      <div className="photo-container">
        <h2 className="photo-heading">Upload Photo</h2>

        <form onSubmit={handleUpload} className="photo-form">
          {/* Upload button */}
          <label htmlFor="photo-upload" className="upload-label">
            📷 Choose Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />

          {/* Preview */}
          {preview && (
            <div className="preview-box">
              <img src={preview} alt="Preview" className="preview-img" />
            </div>
          )}

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="caption-textarea"
          />

          {/* Submit */}
          <button type="submit" className="upload-button" disabled={loading}>
            {loading ? "⏳ Uploading..." : "🚀 Upload Photo"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default PhotoPost;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "./PhotoPost.css";
// import backendURL, { ADD_POST, UPDATE_POST } from "../../utils/String"; // ✅ use UPLOAD_POST, not UPDATE_POST

// const PhotoPost = () => {
//   const [photo, setPhoto] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const { userData } = useSelector((state) => state.auth);

//   // Handle photo select
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPhoto(file);
//       setPreview(URL.createObjectURL(file)); // For preview
//     }
//   };

//   // Handle upload

//   // Handle upload
// const handleUpload = async (e) => {
//   e.preventDefault();

//   if (!photo) {
//     alert("⚠️ Please select a photo!");
//     return;
//   }

//   setLoading(true);

//   try {
//     // Step 1: Upload image file
//     const formData = new FormData();
//     formData.append("file", photo);

//     // ✅ Debugging FormData
//     for (let pair of formData.entries()) {
//       console.log(pair[0] + ": ", pair[1]);
//     }

//     const uploadRes = await fetch(backendURL + UPDATE_POST, {
//       method: "POST",
//       body: formData, // ✅ no headers, browser auto sets correct Content-Type
//     });

//     if (!uploadRes.ok) {
//       const text = await uploadRes.text();
//       alert("❌ Upload failed: " + text);
//       setLoading(false);
//       return;
//     }

//     const uploadData = await uploadRes.json();

//     // Step 2: Save post details in DB
//     const addPostObj = {
//       userId: userData._id,
//       caption,
//       username: userData.username,
//       imageurl: uploadData.fileUrl,
//       fileName: uploadData.fileName,
//     };

//     console.log("payload to DB:", addPostObj);

//     await axios.post(backendURL + ADD_POST, addPostObj);

//     setLoading(false);
//     setPhoto(null);
//     setPreview(null);
//     setCaption("");
//     alert("✅ Post uploaded successfully!");
//   } catch (error) {
//     console.error("Upload failed:", error);
//     setLoading(false);
//     alert("❌ Upload failed!");
//   }
// };



//   // const handleUpload = async (e) => {
//   //   e.preventDefault();

//   //   if (!photo) {
//   //     alert("⚠️ Please select a photo!");
//   //     return;
//   //   }
//   //   console.log("start loplaoding ..")

//   //   setLoading(true);

//   //   try {
//   //     // Step 1: Upload image file
//   //     const formData = new FormData();
//   //     formData.append("file", photo);

//   //     console.log("start loplaoding data", formData)

//   //     const uploadRes = await fetch(backendURL + UPDATE_POST, {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     if (!uploadRes.ok) {
//   //       const text = await uploadRes.text();
//   //       alert("❌ Upload failed: " + text);
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const uploadData = await uploadRes.json();

//   //     // Step 2: Save post details in DB
//   //     const addPostObj = {
//   //       userId: userData._id,
//   //       caption,
//   //       username: userData.username,
//   //       imageurl: uploadData.fileUrl,
//   //       fileName: uploadData.fileName,
//   //     };

//   //      console.log("start get payload", addPostObj)

//   //     await axios.post(backendURL + ADD_POST, addPostObj);

//   //      console.log("post sucess")

//   //     setLoading(false);
//   //     setPhoto(null);
//   //     setPreview(null);
//   //     setCaption("");
//   //     alert("✅ Post uploaded successfully!");
//   //   } catch (error) {
//   //     console.error("Upload failed:", error);
//   //     setLoading(false);
//   //     alert("❌ Upload failed!");
//   //   }
//   // };

//   return (
//     <div className="container">
//       <div className="photo-container">
//         <h2 className="photo-heading">Upload Photo</h2>

//         <form onSubmit={handleUpload} className="photo-form">
//           {/* Custom Upload Button */}
//           <label htmlFor="photo-upload" className="upload-label">
//             📷 Choose Photo
//           </label>
//           <input
//             id="photo-upload"
//             type="file"
//             accept="image/*"
//             onChange={handlePhotoChange}
//             style={{ display: "none" }}
//           />

//           {/* Preview */}
//           {preview && (
//             <div className="preview-box">
//               <img src={preview} alt="Preview" className="preview-img" />
//             </div>
//           )}

//           {/* Caption */}
//           <textarea
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//             placeholder="Write a caption..."
//             className="caption-textarea"
//           />

//           {/* Upload Button */}
//           <button type="submit" className="upload-button" disabled={loading}>
//             {loading ? "⏳ Uploading..." : "🚀 Upload Photo"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PhotoPost;



// // import React, { useState } from "react";
// // import { useSelector } from "react-redux";
// // import axios from "axios";
// // import "./PhotoPost.css";
// // import backendURL, { ADD_POST, UPDATE_POST } from "../../utils/String"; // same constants as mobile
// // // import { fetchPosts } from "../../redux/PostSlice";

// // const PhotoPost = () => {
// //   const [photo, setPhoto] = useState(null);
// //   const [caption, setCaption] = useState("");
// //   const [preview, setPreview] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const { userData } = useSelector((state) => state.auth);
// //   // const dispatch = useDispatch();

// //   // Handle photo select
// //   const handlePhotoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setPhoto(file);
// //       setPreview(URL.createObjectURL(file)); // For preview
// //     }
// //   };

// //   // Handle upload
// //   const handleUpload = async (e) => {
// //     e.preventDefault();

// //     if (!photo) {
// //       alert("⚠️ Please select a photo!");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // Step 1: Upload image file
// //       const formData = new FormData();
// //       formData.append("file", photo);

// //       const uploadRes = await fetch(backendURL + UPDATE_POST, {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!uploadRes.ok) {
// //         const text = await uploadRes.text();
// //         alert("❌ Upload failed: " + text);
// //         setLoading(false);
// //         return;
// //       }

// //       const uploadData = await uploadRes.json();

// //       // Step 2: Save post details in DB
// //       const addPostObj = {
// //         userId: userData._id,
// //         caption,
// //         username: userData.username,
// //         imageurl: uploadData.fileUrl,
// //         fileName: uploadData.fileName,
// //       };

// //       await axios.post(backendURL + ADD_POST, addPostObj);

// //       setLoading(false);
// //       setPhoto(null);
// //       setPreview(null);
// //       setCaption("");
// //       alert("✅ Post uploaded successfully!");

// //       // Refresh posts list
// //       // dispatch(fetchPosts());
// //     } catch (error) {
// //       console.error("Upload failed:", error);
// //       setLoading(false);
// //       alert("❌ Upload failed!");
// //     }
// //   };

// //   return (
// //     <div className="container">
// //       <div className="photo-container">
// //         <h2 className="photo-heading">Upload Photo</h2>

// //         <form onSubmit={handleUpload} className="photo-form">
// //           {/* Custom Upload Button */}
// //           <label htmlFor="photo-upload" className="upload-label">
// //             📷 Choose Photo
// //           </label>
// //           <input
// //             id="photo-upload"
// //             type="file"
// //             accept="image/*"
// //             onChange={handlePhotoChange}
// //             style={{ display: "none" }}
// //           />

// //           {/* Preview */}
// //           {preview && (
// //             <div className="preview-box">
// //               <img src={preview} alt="Preview" className="preview-img" />
// //             </div>
// //           )}

// //           {/* Caption */}
// //           <textarea
// //             value={caption}
// //             onChange={(e) => setCaption(e.target.value)}
// //             placeholder="Write a caption..."
// //             className="caption-textarea"
// //           />

// //           {/* Upload Button */}
// //           <button type="submit" className="upload-button" disabled={loading}>
// //             {loading ? "⏳ Uploading..." : "🚀 Upload Photo"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PhotoPost;


// // import React, { useState } from "react";
// // import "./PhotoPost.css"; // Import CSS

// // const PhotoPost = () => {
// //   const [photo, setPhoto] = useState(null);
// //   const [caption, setCaption] = useState("");

// //   // Handle photo select
// //   const handlePhotoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setPhoto(URL.createObjectURL(file));
// //     }
// //   };

// //   // Handle upload
// //   const handleUpload = (e) => {
// //     e.preventDefault();
// //     if (!photo) {
// //       alert("Please select a photo!");
// //       return;
// //     }

// //     const postData = {
// //       photo,
// //       caption,
// //     };

// //     console.log("📤 Photo Uploaded:", postData);
// //     alert("✅ Photo uploaded successfully!");
// //   };

// //   return (
// //     <div className="container">
// //     <div className="photo-container">
// //       <h2 className="photo-heading">Upload Photo</h2>

// //       <form onSubmit={handleUpload} className="photo-form">
// //         {/* Custom Upload Button */}
// //         <label htmlFor="photo-upload" className="upload-label">
// //           📷 Choose Photo
// //         </label>
// //         <input
// //           id="photo-upload"
// //           type="file"
// //           accept="image/*"
// //           onChange={handlePhotoChange}
// //           style={{ display: "none" }}
// //         />

// //         {/* Preview */}
// //         {photo && (
// //           <div className="preview-box">
// //             <img src={photo} alt="Preview" className="preview-img" />
// //           </div>
// //         )}

// //         {/* Caption */}
// //         <textarea
// //           value={caption}
// //           onChange={(e) => setCaption(e.target.value)}
// //           placeholder="Write a caption..."
// //           className="caption-textarea"
// //         />

// //         {/* Upload Button */}
// //         <button type="submit" className="upload-button">
// //           🚀 Upload Photo
// //         </button>
// //       </form>
// //     </div>
// //     </div>
// //   );
// // };

// // export default PhotoPost;
