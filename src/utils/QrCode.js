import React, { useState } from "react";
import QRCode from "react-qr-code";

const QrCode = () => {
  const [url, setUrl] = useState(
    "https://apps.apple.com/us/app/reelbook/id6755233312"
  );

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Generate QR Code</h2>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />

      {/* QR Code Box */}
      {url && (
        <div style={styles.qrBox}>
          <QRCode
            size={256}
            value={url}
            viewBox="0 0 256 256"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default QrCode;
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
  },
  heading: {
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "600",
  },
  input: {
    width: "300px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  qrBox: {
    marginTop: "20px",
    padding: "20px",
    border: "2px solid #000",
    borderRadius: "10px",
    backgroundColor: "#fff",
    width: "260px",
  },
};


// import React from "react";

// import QRCode from "react-qr-code";
// const QrCode = () => {

//   return (
//     <div >
//           <QRCode
//             size={256}
//             style={{ height: "auto", maxWidth: "40%", width: "40%" }}
//             value={'https://apps.apple.com/us/app/reelbook/id6755233312'}
//             viewBox={`0 0 256 256`}
//         />
//     </div>
//   );
// };

// export default QrCode;
