import React, { useState, useEffect } from "react";

const DummyUploader = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let interval;
    if (uploading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 1; // increment +1 per second
        });
      }, 1000); // every 1 second
    }
    return () => clearInterval(interval);
  }, [uploading]);

  const startUpload = () => {
    setProgress(0);
    setUploading(true);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        Upload Progress: {progress}%
      </p>
      <button
        onClick={startUpload}
        disabled={uploading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Start Upload"}
      </button>
    </div>
  );
};

export default DummyUploader;
