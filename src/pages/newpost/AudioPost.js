// ReelPost.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import backendURL, { UPLOAD_AUDIO, ADD_AUDIO, UPLOAD_AUDIO_IMAGE } from "../../utils/String"; // same constants as mobile
import { useSelector } from "react-redux";
import "./ReelPost.css";



const categoriesData = [
    { id: '1', name: 'Said Song', image: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84b9428dd5c6c60d961868f6d1' },
    { id: '2', name: 'Happy song', image: "https://cdn.pixabay.com/photo/2023/10/30/14/23/ai-generated-8352992_640.jpg" },
    { id: '3', name: 'brakeup Song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '4', name: 'Love song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '5', name: 'Rap song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '6', name: 'English song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '7', name: 'Nature song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '8', name: 'Wibe song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '9', name: 'Cool song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '10', name: 'Lofi song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '11', name: 'Panjabi song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    { id: '12', name: 'Dj song', image: "https://media.timeout.com/images/106189304/750/562/image.jpg" },
    // Add more categories as needed
];
const bgColors = [
    "#FFDEE9", "#B5FFD9", "#E3DFFD", "#FFF5BA", "#DFF6FF",
    "#FFD6A5", "#E2F0CB", "#FFD9EC", "#CDE7FF"
];

const AudioPost = () => {
    // const [videoFile, setVideoFile] = useState(null);
    // const [thumbnail, setThumbnail] = useState(null);
    const [caption, setCaption] = useState("");
    const [artist, setArtist] = useState("");
    const [title, setTitle] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState("");
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);

    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [isPopular, setIsPopular] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAudioFile(file);

        // generate preview URL
        const audioURL = URL.createObjectURL(file);
        setAudioPreview(audioURL);
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);

        // generate preview URL
        const imageURL = URL.createObjectURL(file);
        setImagePreview(imageURL);
    };

    const token = useSelector((state) => state.auth.userReduxToken);

    // ✅ Load saved categories from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("savedCategories");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSelectedCategories(parsed);
            } catch { }
        }
    }, []);

    // ✅ Save to localStorage whenever categories change
    useEffect(() => {
        localStorage.setItem("savedCategories", JSON.stringify(selectedCategories));
    }, [selectedCategories]);

    // ✅ Fetch user data
    useEffect(() => {
        if (!token) return;
        axios.post(`${backendURL}/userdata`, { token })
            .then(res => setUserData(res.data.data))
            .catch(err => console.error("Error fetching user:", err));
    }, [token]);


    const toggleCategory = (cat) => {
        let updated;
        if (selectedCategories.find((c) => c.id === cat.id)) {
            updated = selectedCategories.filter((c) => c.id !== cat.id);
        } else if (selectedCategories.length < 3) {
            updated = [...selectedCategories, cat];
        } else {
            return;
        }
        setSelectedCategories(updated);
        localStorage.setItem("savedCategories", JSON.stringify(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            alert("Please select audio");
            return;
        }

        setLoading(true);
        console.log("audio file", audioFile)
        console.log("audio filee imag", imageFile)

        try {
            // 🔹 Upload Audio
            const audioForm = new FormData();
            audioForm.append("file", audioFile);

            const audioRes = await fetch(backendURL + UPLOAD_AUDIO, {
                method: "POST",
                body: audioForm,
            });
            const audioData = await audioRes.json();
            console.log("url audio", audioData)

            // 🔹 Upload Image
            let imageUrl = null;
            if (imageFile) {
                const imageForm = new FormData();
                imageForm.append("file", imageFile);

                const imageRes = await fetch(backendURL + UPLOAD_AUDIO_IMAGE, {
                    method: "POST",
                    body: imageForm,
                });
                const imageData = await imageRes.json();
                imageUrl = imageData.fileUrl;
                console.log("image url", imageUrl)
            }


            // 🔹 Final payload
            const payload = {
                userId: userData._id,
                username: userData.username,
                title: title,
                artist: artist,
                songCaption: caption,
                audioUrl: audioData.fileUrl,
                audioKey: audioData.fileName,
                isPopular: isPopular,
                coverImageUrl: imageUrl,
                category: selectedCategories,
            };

            await axios.post(backendURL + ADD_AUDIO, payload);
            console.log("payload", payload)

            alert("✅ Audio uploaded successfully");

            // reset
            setAudioFile(null);
            setAudioPreview(null);
            setImageFile(null);
            setImagePreview(null);
            setCaption("");
        } catch (err) {
            console.error(err);
            alert("❌ Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categoriesData.filter((cat) =>
        (cat?.name || "").toLowerCase().includes((search || "").toLowerCase())
    );

    useEffect(() => {
        return () => {
            if (audioPreview) URL.revokeObjectURL(audioPreview);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [audioPreview, imagePreview]);

    return (
        <div className="reel">
            <div className="container12">
                <h2 className="heading">Upload Audio</h2>
                <form onSubmit={handleSubmit} className="form">

                    <label className="label">Upload Audio</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="input"
                    />

                    {audioPreview && (
                        <div style={{ marginTop: 10 }}>
                            <audio controls src={audioPreview} />
                        </div>
                    )}


                    <label className="label">Upload Song Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="input"
                    />
                    {imagePreview && (
                        <div style={{ marginTop: 10 }}>
                            <img
                                src={imagePreview}
                                alt="Cover Preview"
                                style={{ width: 200, borderRadius: 8 }}
                            />
                        </div>
                    )}

                    <label className="label">Artist Name</label>
                    <input
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        placeholder="Enter Artist name"
                        className="input"
                    />
                    <label className="label">Song Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter song title"
                        className="input"
                    />


                    <label className="label">Song Caption</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a song caption..."
                        className="textarea"
                    />

                    <label className="label">Popular Song</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="checkbox"
                            checked={isPopular}
                            onChange={() => setIsPopular(!isPopular)}
                        />
                        <span>{isPopular ? "🔥 Popular" : "Tap to mark as Popular"}</span>
                    </div>


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
                                    <span style={{ color: 'black' }}>{cat.name}</span>
                                    <span style={{ marginLeft: "4px", cursor: "pointer", fontWeight: "bold", color: 'black' }}>✕</span>
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={() => setShowPopup(true)} className="categoryBtn"> + Choose Category </button>
                    </div>

                    <button type="submit" disabled={loading} className="button">
                        {loading ? "Uploading..." : "✅ Upload Reel"}
                    </button>
                </form>

                {showPopup && (
                    <div className="popupOverlay">
                        <div className="popup">
                            <h3 className="popupTitle">Choose Categories ( Max - 3 ) </h3>
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
                                            border: selectedCategories.find((c) => c.id === cat.id) ? "2px solid blue" : "2px solid transparent",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <img src={cat.image} alt={cat.name} className="catImg" />
                                        <p style={{ color: 'black', fontSize: '12px' }}>{cat.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="popupActions">
                                <button onClick={() => setShowPopup(false)} className="cancelBtn">❌ Cancel</button>
                                <button onClick={() => setShowPopup(false)} className="doneBtn">✅ Done</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioPost;

