import React, { useState } from "react";
import "./PhotoPost.css"; // Import CSS

const PhotoPost = () => {
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");

  // Handle photo select
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  // Handle upload
  const handleUpload = (e) => {
    e.preventDefault();
    if (!photo) {
      alert("Please select a photo!");
      return;
    }

    const postData = {
      photo,
      caption,
    };

    console.log("📤 Photo Uploaded:", postData);
    alert("✅ Photo uploaded successfully!");
  };

  return (
    <div className="container">
    <div className="photo-container">
      <h2 className="photo-heading">Upload Photo</h2>

      <form onSubmit={handleUpload} className="photo-form">
        {/* Custom Upload Button */}
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
        {photo && (
          <div className="preview-box">
            <img src={photo} alt="Preview" className="preview-img" />
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="caption-textarea"
        />

        {/* Upload Button */}
        <button type="submit" className="upload-button">
          🚀 Upload Photo
        </button>
      </form>
    </div>
    </div>
  );
};

export default PhotoPost;
