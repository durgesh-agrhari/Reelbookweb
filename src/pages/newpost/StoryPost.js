// PhotoPost.js
import React, { useState } from "react";

const StoryPost = () => {
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Story Post</h2>

      <form onSubmit={handleUpload} style={styles.form}>
        {/* Custom Upload Button */}
        <label htmlFor="photo-upload" style={styles.uploadLabel}>
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
          <div style={styles.previewBox}>
            <img src={photo} alt="Preview" style={styles.previewImg} />
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          style={styles.textarea}
        />

        {/* Upload Button */}
        <button type="submit" style={styles.button}>
          🚀 Upload Photo
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  uploadLabel: {
    padding: "12px",
    textAlign: "center",
    backgroundColor: "#28a745",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "0.3s",
  },
  previewBox: {
    display: "flex",
    justifyContent: "center",
  },
  previewImg: {
    maxWidth: "60%",
    height: "auto",
    borderRadius: "10px",
    border: "2px solid #ddd",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "none",
    minHeight: "80px",
  },
  button: {
    padding: "14px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default StoryPost;
