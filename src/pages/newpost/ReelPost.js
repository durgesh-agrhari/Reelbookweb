// ReelPost.js
import React, { useState, useRef } from "react";

const categoriesData = [
    { id: '1', name: 'Motivation', image: 'https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg' },
    { id: '2', name: 'Gym Video', image: 'https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg' },
    { id: '3', name: 'Sports', image: 'https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900' },
    { id: '4', name: 'Girls-Video', image: 'https://photosnow.org/wp-content/uploads/2024/04/cute-girl-pic-cartoon_17.jpg' },
    { id: '5', name: 'Boy-Atitude', image: 'https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/166f296a084c378a004d21fcf78d04f9.jpeg?x-oss-process=style%2Fthumb' },
    { id: '6', name: 'Bhopury', image: 'https://source.boomplaymusic.com/group10/M00/04/28/3230e655b91b4422bf9badcbbf9ee649_464_464.jpg' },
    { id: '7', name: 'Shayari', image: 'https://sc0.blr1.cdn.digitaloceanspaces.com/article/153856-eamvrlxriu-1611577633.jpeg' },
    { id: '8', name: 'Love-Music', image: 'https://img.freepik.com/premium-photo/lofi-music-beautiful-anime-girl-listen-music_485374-1330.jpg' },
    { id: '9', name: 'Comedy', image: 'https://imgeng.jagran.com/images/2024/05/08/article/image/thegreatindiankapilshow-1715169002824.jpg' },
    { id: '10', name: 'Parlour', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWMlgfivmUvNK4Ro0IG4T-KtYWuNJbhkzZQ&s' },
    { id: '11', name: 'Mehadi', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOEBJMjpR7cUI5dDRCQTbC0vfDM2jYEu3rA&s' },
    { id: '12', name: 'Sweet Selfy Girls', image: 'https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_883.jpg' },
    { id: '13', name: 'Nail Art', image: 'https://i.pinimg.com/736x/e0/0c/81/e00c814d2820c76438efbee151e4d21e.jpg' },
    { id: '14', name: 'Hair Style', image: 'https://i.pinimg.com/236x/82/a2/40/82a240dd15dcfd5bc84c2542662e0f75.jpg' },
    { id: '15', name: 'Art Sketch', image: 'https://i.ytimg.com/vi/NBOfvz2iaE0/maxresdefault.jpg' },
    { id: '16', name: 'Cat Lover', image: 'https://images.ctfassets.net/ub3bwfd53mwy/5zi8myLobtihb1cWl3tj8L/45a40e66765f26beddf7eeee29f74723/6_Image.jpg?w=750' },
    { id: '17', name: 'Dog Lover', image: 'https://t4.ftcdn.net/jpg/01/16/17/35/360_F_116173569_djlZMlMzdRG1fPd71tvhJ11Y8EEopjkJ.jpg' },
    { id: '18', name: 'Cooking', image: 'https://hips.hearstapps.com/hmg-prod/images/one-pot-meals-1616159616.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*' },
    { id: '19', name: 'Car Lover', image: 'https://preview.redd.it/here-she-is-the-new-temerario-what-do-yall-think-v0-ezkkox8152jd1.jpg?width=1080&crop=smart&auto=webp&s=45dcc449b83073c44a879377600c83593bf61026' },
    { id: '20', name: 'Byke Lover', image: 'https://i.pinimg.com/236x/45/fb/f5/45fbf5364558bc1f3a155122279d8ad3.jpg' },
    { id: '21', name: 'Salfie Poas Boy', image: 'https://i.pinimg.com/originals/ca/3c/6b/ca3c6b76a0f2d3708e06330354b5fae8.jpg' },
    { id: '22', name: 'Singing', image: 'https://thumbs.dreamstime.com/b/sexy-young-girl-singer-singing-contrast-silhouette-sexy-singer-girl-singing-dancing-sexy-female-red-concert-dress-dancing-173265918.jpg' },
    { id: '23', name: 'Dancing Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCk6f2rhe5YhpC_tBii2RteOj39kcQRyJImA&s' },
    { id: '24', name: 'Nature', image: 'https://5.imimg.com/data5/SELLER/Default/2023/3/TF/BK/UW/103578143/3d-nature-wallpaper-500x500.jpg' },
    { id: '25', name: 'God Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6g7cgN9ldehh_kDnh0PF1R2xNszaQzm_SIDVGZ62SDsHLkuTNvPWHYojsGbBOwazVg4&usqp=CAU' },
    { id: '26', name: 'Bajan Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGIlItZm69HFnFKh_ROr8biTG2xQu9lTWXSDK4_a6IwLqcT8f7AE9QuTXo5iR1XSUcoo&usqp=CAU' },
    { id: '27', name: 'Temple', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92zihWSb5UoidrJ5NY_ih0HWXVa1V96AsQw&s' },
    { id: '28', name: 'GF Talk Convesation', image: 'https://t4.ftcdn.net/jpg/04/59/82/89/360_F_459828924_ANMZD5IqA4io5iAKWbK7bsPwnTmjYABC.jpg' },
    { id: '29', name: 'Speeking', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXstrZVD0Z1qtnrlhDJyFkCSE4VksAp81TpA&s' },
    { id: '30', name: 'Interview', image: 'https://static.wixstatic.com/media/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg' },
    { id: '31', name: 'Trading', image: 'https://img.freepik.com/premium-vector/trading-logo-with-chart-concept_11481-675.jpg?semt=ais_hybrid' },
    { id: '32', name: 'Bussines Idea', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bdCOESyvHbw9KspkGSrnxFW_CTA6eOPDkQ&s' },
    { id: '33', name: 'Earn Pocket Mony', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EeQnwM2hMvlE_GHDNTooPCQgrje48fEX2t9jsP23EBAjoALyU7_Qn2cITXX2E2k1zRc&usqp=CAU' },
    { id: '34', name: 'Video or photo Editing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB8_FwanhrD1gZtyj7dE5sBy1mWqz9t_vEdw&s' },
    { id: '35', name: 'Skin care', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwpOqBwO1rmh5dcZ9_xf6ZvfWvWGfTL_DYw&s' },
    { id: '36', name: 'Animay', image: 'https://i.pinimg.com/236x/62/48/03/624803bee204bc2b7761449dcc502821.jpg' },
    { id: '37', name: 'Youtuber', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAXdgfVxpAQfJLpRo9WBmPZKoq3WYaDW27chTAHpqSAcN-to4v5ILwLl3Xwd8rSj69uuY&usqp=CAU' },
    { id: '38', name: 'FlimWord', image: 'https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2022/03/Bollywood-celebs-investing-ft-1-1-150x150.jpg' },
    { id: '39', name: 'Magic', image: 'https://media.istockphoto.com/id/537316429/photo/high-contrast-image-of-magician-hand-with-magic-wand.jpg?s=612x612&w=0&k=20&c=GbnLRDGmfQI_x9CQnOsxefKnJLxAAWHbH6PLpTuQQeY=' },
    { id: '40', name: 'Ai Modal', image: 'https://static.vecteezy.com/system/resources/previews/033/504/750/non_2x/sexy-girl-generative-ai-free-photo.jpg' },
    { id: '41', name: 'Story Video', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi8hg5_EibznkZCY8q_FHMgEThpgUE4sQuxg&s' },
    { id: '42', name: 'Reality Show', image: 'https://paulamrozowicz.com/wp-content/uploads/2013/12/reality1.jpg?w=884' },
    // Add more categories as needed
];

const bgColors = [
    "#FFDEE9", "#B5FFD9", "#E3DFFD", "#FFF5BA", "#DFF6FF",
    "#FFD6A5", "#E2F0CB", "#FFD9EC", "#CDE7FF"
];

const ReelPost = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [caption, setCaption] = useState("");
    const [credit, setCredit] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState("");

    const videoRef = useRef();

    // Handle video upload & generate thumbnail
    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(URL.createObjectURL(file));

            const videoEl = document.createElement("video");
            videoEl.src = URL.createObjectURL(file);
            videoEl.currentTime = 1;

            videoEl.onloadeddata = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 300;
                canvas.height = 533; // 9:16 ratio
                const ctx = canvas.getContext("2d");
                ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL("image/png"));
            };
        }
    };

    const toggleCategory = (cat) => {
        if (selectedCategories.find((c) => c.id === cat.id)) {
            setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id));
        } else if (selectedCategories.length < 3) {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const reelData = {
            caption,
            credit,
            thumbnail,
            videoFile,
            categories: selectedCategories,
        };
        console.log("📤 Reel Uploaded:", reelData);
        alert("Reel uploaded successfully!");
    };

    const filteredCategories = categoriesData.filter((cat) =>
        (cat?.name || "").toLowerCase().includes((search || "").toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Upload Reel</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Video Upload */}
                <label style={styles.label}>Upload Video</label>
                <input type="file" accept="video/*" onChange={handleVideoUpload} style={styles.input} />

                <div style={{ justifyContent: 'center', alignItems: 'center', alignSelf:'center' }}>
                    {/* Video + Thumbnail side by side */}
                    {(videoFile || thumbnail) && (
                        <div style={styles.rowPreview}>
                            {videoFile && (
                                <video ref={videoRef} src={videoFile} controls style={styles.videoPreview} />
                            )}
                            {thumbnail && (
                                <div style={styles.thumbnailBox}>
                                    <img src={thumbnail} alt="Thumbnail" style={styles.thumbnailPreview} />
                                    <p style={styles.thumbText}>Auto Thumbnail</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Caption */}
                <label style={styles.label}>Caption</label>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    style={styles.textarea}
                />

                {/* Category */}
                <label style={styles.label}>Category (max 3)</label>
                <div style={styles.selectedRow}>
                    {selectedCategories.map((cat, i) => (
                        <div
                            key={cat.id}
                            style={{
                                ...styles.categoryChip,
                                backgroundColor: bgColors[i % bgColors.length],
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
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
                    <button
                        type="button"
                        style={styles.categoryBtn}
                        onClick={() => setShowPopup(true)}
                    >
                        + Choose Category
                    </button>
                </div>


                {/* Credit */}
                <label style={styles.label}>Give Credit (Optional)</label>
                <input
                    type="text"
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder="Enter username for credit"
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    ✅ Upload Reel
                </button>
            </form>

            {/* Popup for categories */}
            {showPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h3 style={styles.popupTitle}>Choose Categories ( Max - 3 ) </h3>
                        <div style={styles.popupActions}>
                            <button onClick={() => setShowPopup(false)} style={styles.cancelBtn}>
                                ❌ Cancel
                            </button>
                            <button onClick={() => setShowPopup(false)} style={styles.doneBtn}>
                                ✅ Done
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                        <div style={styles.categoryGrid}>
                            {filteredCategories.map((cat, i) => (
                                <div
                                    key={cat.id}
                                    style={{
                                        ...styles.categoryCard,
                                        backgroundColor: bgColors[i % bgColors.length],
                                        border: selectedCategories.find((c) => c.id === cat.id)
                                            ? "2px solid #007BFF"
                                            : "2px solid transparent",
                                    }}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    <img src={cat.image} alt={cat.name} style={styles.catImg} />
                                    <p style={{ color: 'black', fontSize: '12px' }}>{cat.name}</p>
                                </div>
                            ))}
                        </div>

                        <div style={styles.popupActions}>
                            <button onClick={() => setShowPopup(false)} style={styles.cancelBtn}>
                                ❌ Cancel
                            </button>
                            <button onClick={() => setShowPopup(false)} style={styles.doneBtn}>
                                ✅ Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: "700px", margin: "20px auto", padding: "20px" },
    heading: { textAlign: "center", marginBottom: "20px", color: "#333" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    label: { fontWeight: "600", fontSize: "14px", color: "#ebdcdcff" },
    input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
    textarea: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "60px" },
    button: {
        padding: "12px",
        backgroundColor: "green",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
    },
    rowPreview: { display: "flex", gap: "20px", marginTop: "10px" },
    videoPreview: { width: "30%", borderRadius: "10px", aspectRatio: "9/16", objectFit: "cover" },
    thumbnailBox: { width: "30%", textAlign: "center" },
    thumbnailPreview: {
        width: "100%",
        borderRadius: "10px",
        aspectRatio: "9/16",
        objectFit: "cover",
    },
    thumbText: { fontSize: "12px", color: "#666", marginTop: "5px" },
    selectedRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
    categoryChip: {
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        cursor: "pointer",
    },
    categoryBtn: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #007BFF",
        background: "green",
        cursor: "pointer",
        color:'white',
    },
    popupOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
    },
    popupTitle: { textAlign: "center", marginBottom: "10px", color: "#0b0b0bff" },
    searchInput: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    categoryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
        gap: "15px",
    },
    categoryCard: {
        borderRadius: "10px",
        padding: "5px",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.3s",
    },
    catImg: { width: "100px", height: "100px", marginBottom: "5px", borderRadius: "5px" },
    popupActions: { display: "flex", justifyContent: "space-between", marginTop: "15px" },
    cancelBtn: {
        flex: 1,
        marginRight: "10px",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        background: "#ccc",
        cursor: "pointer",
        marginBottom: "10px"
    },
    doneBtn: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        background: "green",
        color: "#fff",
        cursor: "pointer",
        marginBottom: "10px"
    },
};

export default ReelPost;


// // ReelPost.js
// import React, { useState, useRef } from "react";

// // Your category dataset
// const categories = [
//   { id: '1', name: 'Motivation', image: 'https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg' },
//   { id: '2', name: 'Gym Video',  image:'https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg' },
//   { id: '3', name: 'Sports',  image:'https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900'  },
//   { id: '4', name: 'Girls-Video',  image:'https://photosnow.org/wp-content/uploads/2024/04/cute-girl-pic-cartoon_17.jpg'  },
//   { id: '5', name: 'Boy-Atitude' ,  image:'https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/166f296a084c378a004d21fcf78d04f9.jpeg?x-oss-process=style%2Fthumb' },
//   { id: '6', name: 'Bhopury' ,  image:'https://source.boomplaymusic.com/group10/M00/04/28/3230e655b91b4422bf9badcbbf9ee649_464_464.jpg' },
//   { id: '7', name: 'Shayari' ,  image:'https://sc0.blr1.cdn.digitaloceanspaces.com/article/153856-eamvrlxriu-1611577633.jpeg'  },
//   { id: '8', name: 'Love-Music' ,  image:'https://img.freepik.com/premium-photo/lofi-music-beautiful-anime-girl-listen-music_485374-1330.jpg' },
//   { id: '9', name: 'Comedy',  image:'https://imgeng.jagran.com/images/2024/05/08/article/image/thegreatindiankapilshow-1715169002824.jpg'  },
//   { id: '10', name: 'Parlour' ,  image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWMlgfivmUvNK4Ro0IG4T-KtYWuNJbhkzZQ&s' },
//   { id: '11', name: 'Mehadi',  image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOEBJMjpR7cUI5dDRCQTbC0vfDM2jYEu3rA&s'  },
//   { id: '12', name: 'Sweet Selfy Girls' ,  image:'https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_883.jpg' },
//   { id: '13', name: 'Nail Art',  image:'https://i.pinimg.com/736x/e0/0c/81/e00c814d2820c76438efbee151e4d21e.jpg' },
//   { id: '14', name: 'Hair Style',  image:'https://i.pinimg.com/236x/82/a2/40/82a240dd15dcfd5bc84c2542662e0f75.jpg'  },
//   { id: '15', name: 'Art Sketch' ,  image:'https://i.ytimg.com/vi/NBOfvz2iaE0/maxresdefault.jpg' },
//   { id: '16', name: 'Cat Lover',  image:'https://images.ctfassets.net/ub3bwfd53mwy/5zi8myLobtihb1cWl3tj8L/45a40e66765f26beddf7eeee29f74723/6_Image.jpg?w=750'  },
//   { id: '17', name: 'Dog Lover',  image:'https://t4.ftcdn.net/jpg/01/16/17/35/360_F_116173569_djlZMlMzdRG1fPd71tvhJ11Y8EEopjkJ.jpg'  },
//   { id: '18', name: 'Cooking',  image:'https://hips.hearstapps.com/hmg-prod/images/one-pot-meals-1616159616.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*'  },
//   { id: '19', name: 'Car Lover' ,  image:'https://preview.redd.it/here-she-is-the-new-temerario-what-do-yall-think-v0-ezkkox8152jd1.jpg?width=1080&crop=smart&auto=webp&s=45dcc449b83073c44a879377600c83593bf61026' },
//   { id: '20', name: 'Byke Lover',  image:'https://i.pinimg.com/236x/45/fb/f5/45fbf5364558bc1f3a155122279d8ad3.jpg'  },
//   { id: '21', name: 'Salfie Poas Boy',  image:'https://i.pinimg.com/originals/ca/3c/6b/ca3c6b76a0f2d3708e06330354b5fae8.jpg'  },
//   { id: '22', name: 'Singing',  image:'https://thumbs.dreamstime.com/b/sexy-young-girl-singer-singing-contrast-silhouette-sexy-singer-girl-singing-dancing-sexy-female-red-concert-dress-dancing-173265918.jpg'  },
//   { id: '23', name: 'Dancing Video'  ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCk6f2rhe5YhpC_tBii2RteOj39kcQRyJImA&s' },
//   { id: '24', name: 'Nature',image:'https://5.imimg.com/data5/SELLER/Default/2023/3/TF/BK/UW/103578143/3d-nature-wallpaper-500x500.jpg'  },
//   { id: '25', name: 'God Video' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6g7cgN9ldehh_kDnh0PF1R2xNszaQzm_SIDVGZ62SDsHLkuTNvPWHYojsGbBOwazVg4&usqp=CAU' },
//   { id: '26', name: 'Bajan Video' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGIlItZm69HFnFKh_ROr8biTG2xQu9lTWXSDK4_a6IwLqcT8f7AE9QuTXo5iR1XSUcoo&usqp=CAU' },
//   { id: '27', name: 'Temple',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92zihWSb5UoidrJ5NY_ih0HWXVa1V96AsQw&s'  },
//   { id: '28', name: 'GF Talk Convesation' ,image:'https://t4.ftcdn.net/jpg/04/59/82/89/360_F_459828924_ANMZD5IqA4io5iAKWbK7bsPwnTmjYABC.jpg' },
//   { id: '29', name: 'Speeking' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXstrZVD0Z1qtnrlhDJyFkCSE4VksAp81TpA&s' },
//   { id: '30', name: 'Interview' ,image:'https://static.wixstatic.com/media/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg' },
//   { id: '31', name: 'Trading',image:'https://img.freepik.com/premium-vector/trading-logo-with-chart-concept_11481-675.jpg?semt=ais_hybrid'  },
//   { id: '32', name: 'Bussines Idea' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bdCOESyvHbw9KspkGSrnxFW_CTA6eOPDkQ&s' },
//   { id: '33', name: 'Earn Pocket Mony' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EeQnwM2hMvlE_GHDNTooPCQgrje48fEX2t9jsP23EBAjoALyU7_Qn2cITXX2E2k1zRc&usqp=CAU' },
//   { id: '34', name: 'Video or photo Editing',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB8_FwanhrD1gZtyj7dE5sBy1mWqz9t_vEdw&s'  },
//   { id: '35', name: 'Skin care' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwpOqBwO1rmh5dcZ9_xf6ZvfWvWGfTL_DYw&s' },
//   { id: '36', name: 'Animay' ,image:'https://i.pinimg.com/236x/62/48/03/624803bee204bc2b7761449dcc502821.jpg' },
//   { id: '37', name: 'Youtuber',image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAXdgfVxpAQfJLpRo9WBmPZKoq3WYaDW27chTAHpqSAcN-to4v5ILwLl3Xwd8rSj69uuY&usqp=CAU'  },
//   { id: '38', name: 'FlimWord',image:'https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2022/03/Bollywood-celebs-investing-ft-1-1-150x150.jpg'  },
//   { id: '39', name: 'Magic' ,image:'https://media.istockphoto.com/id/537316429/photo/high-contrast-image-of-magician-hand-with-magic-wand.jpg?s=612x612&w=0&k=20&c=GbnLRDGmfQI_x9CQnOsxefKnJLxAAWHbH6PLpTuQQeY=' },
//   { id: '40', name: 'Ai Modal' ,image:'https://static.vecteezy.com/system/resources/previews/033/504/750/non_2x/sexy-girl-generative-ai-free-photo.jpg' },
//   { id: '41', name: 'Story Video' ,image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi8hg5_EibznkZCY8q_FHMgEThpgUE4sQuxg&s' },
//   { id: '42', name: 'Reality Show' ,image:'https://paulamrozowicz.com/wp-content/uploads/2013/12/reality1.jpg?w=884' },
//   // Add more categories as needed
// ];

// const ReelPost = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [credit, setCredit] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);

//   const videoRef = useRef();

//   // Handle video upload & generate thumbnail
//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setVideoFile(URL.createObjectURL(file));

//       const videoEl = document.createElement("video");
//       videoEl.src = URL.createObjectURL(file);
//       videoEl.currentTime = 1;

//       videoEl.onloadeddata = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = 300;
//         canvas.height = 500;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
//         setThumbnail(canvas.toDataURL("image/png"));
//       };
//     }
//   };

//   const toggleCategory = (category) => {
//     if (selectedCategories.find((c) => c.id === category.id)) {
//       // remove
//       setSelectedCategories(selectedCategories.filter((c) => c.id !== category.id));
//     } else if (selectedCategories.length < 3) {
//       // add
//       setSelectedCategories([...selectedCategories, category]);
//     } else {
//       alert("You can select only 3 categories.");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const reelData = {
//       caption,
//       credit,
//       categories: selectedCategories,
//       thumbnail,
//       videoFile,
//     };
//     console.log("📤 Reel Uploaded:", reelData);
//     alert("Reel uploaded successfully!");
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Upload Reel</h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         {/* Upload Video */}
//         <label style={styles.label}>Upload Video</label>
//         <input type="file" accept="video/*" onChange={handleVideoUpload} style={styles.input} />

//         {/* Video + Thumbnail Row */}
//         {(videoFile || thumbnail) && (
//           <div style={styles.rowBox}>
//             {videoFile && (
//               <video ref={videoRef} src={videoFile} controls style={styles.videoPreview} />
//             )}
//             {thumbnail && (
//               <div style={styles.thumbBox}>
//                 <img src={thumbnail} alt="Thumbnail" style={styles.thumbnailPreview} />
//                 <p style={styles.thumbText}>Auto Thumbnail</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Caption */}
//         <label style={styles.label}>Caption</label>
//         <textarea
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           placeholder="Write a caption..."
//           style={styles.textarea}
//         />

//         {/* Category */}
//         <label style={styles.label}>Category</label>
//         <button type="button" onClick={() => setShowCategoryModal(true)} style={styles.chooseBtn}>
//           + Choose Category
//         </button>

//         {/* Show selected categories */}
//         <div style={styles.selectedWrapper}>
//           {selectedCategories.map((cat) => (
//             <div key={cat.id} style={styles.selectedItem}>
//               <img src={cat.image} alt={cat.name} style={styles.selectedImage} />
//               <span style={styles.selectedName}>{cat.name}</span>
//             </div>
//           ))}
//         </div>

//         {/* Credit */}
//         <label style={styles.label}>Give Credit (Optional)</label>
//         <input
//           type="text"
//           value={credit}
//           onChange={(e) => setCredit(e.target.value)}
//           placeholder="Enter username for credit"
//           style={styles.input}
//         />

//         <button type="submit" style={styles.uploadBtn}>
//           Upload Reel
//         </button>
//       </form>

//       {/* Category Modal */}
//       {showCategoryModal && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalBox}>
//             <h3>Select up to 3 Categories</h3>
//             <div style={styles.catGrid}>
//               {categories.map((cat) => (
//                 <div
//                   key={cat.id}
//                   style={{
//                     ...styles.catCard,
//                     border: selectedCategories.find((c) => c.id === cat.id)
//                       ? "3px solid green"
//                       : "1px solid #ddd",
//                   }}
//                   onClick={() => toggleCategory(cat)}
//                 >
//                   <img src={cat.image} alt={cat.name} style={styles.catImage} />
//                   <p style={styles.catName}>{cat.name}</p>
//                 </div>
//               ))}
//             </div>
//             <button onClick={() => setShowCategoryModal(false)} style={styles.doneBtn}>
//               Done
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { maxWidth: "800px", margin: "20px auto", padding: "20px", borderRadius: "10px", backgroundColor: "#f9f9f9", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
//   heading: { textAlign: "center", marginBottom: "20px", color: "#333" },
//   form: { display: "flex", flexDirection: "column", gap: "15px" },
//   label: { fontWeight: "600", fontSize: "14px", color: "#444" },
//   input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" },
//   textarea: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "60px", resize: "none", fontSize: "14px" },
//   rowBox: { display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" },
//   videoPreview: { width: "300px", height: "500px", objectFit: "cover", borderRadius: "10px" },
//   thumbBox: { textAlign: "center" },
//   thumbnailPreview: { width: "300px", height: "500px", objectFit: "cover", borderRadius: "10px" },
//   thumbText: { fontSize: "12px", color: "#666", marginTop: "5px" },
//   chooseBtn: { padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
//   selectedWrapper: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" },
//   selectedItem: { display: "flex", alignItems: "center", gap: "5px", backgroundColor: "#eee", padding: "5px 10px", borderRadius: "8px" },
//   selectedImage: { width: "30px", height: "30px", borderRadius: "5px", objectFit: "cover" },
//   selectedName: { fontSize: "13px", fontWeight: "500", color:'black' },
//   uploadBtn: { padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
//   modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" },
//   modalBox: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "700px", width: "90%", maxHeight: "90%", overflowY: "auto" },
//   catGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "15px" },
//   catCard: { borderRadius: "10px", overflow: "hidden", cursor: "pointer", textAlign: "center", background: "#fafafa" },
//   catImage: { width: "100%", height: "120px", objectFit: "cover" },
//   catName: { padding: "5px", fontSize: "14px", fontWeight: "500" ,color:'black' },
//   doneBtn: { marginTop: "20px", padding: "10px 20px", backgroundColor: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
// };

// export default ReelPost;

// // // ReelPost.js
// // import React, { useState, useRef } from "react";

// // const categoriesList = [
// //   { id: 1, name: "Motivation", img: "https://i.ibb.co/7ykz5XK/motivation.jpg" },
// //   { id: 2, name: "Comedy", img: "https://i.ibb.co/0Dq9chB/comedy.jpg" },
// //   { id: 3, name: "Education", img: "https://i.ibb.co/HtJY5x2/education.jpg" },
// //   { id: 4, name: "Music", img: "https://i.ibb.co/ZM9Jc2T/music.jpg" },
// //   { id: 5, name: "Travel", img: "https://i.ibb.co/vhP5gY3/travel.jpg" },
// // ];

// // const ReelPost = () => {
// //   const [videoFile, setVideoFile] = useState(null);
// //   const [thumbnail, setThumbnail] = useState(null);
// //   const [caption, setCaption] = useState("");
// //   const [credit, setCredit] = useState("");
// //   const [selectedCategories, setSelectedCategories] = useState([]);
// //   const [showCategoryPopup, setShowCategoryPopup] = useState(false);

// //   const videoRef = useRef();

// //   // Handle video upload & generate thumbnail
// //   const handleVideoUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setVideoFile(URL.createObjectURL(file));

// //       // Generate thumbnail
// //       const videoEl = document.createElement("video");
// //       videoEl.src = URL.createObjectURL(file);
// //       videoEl.currentTime = 1;

// //       videoEl.onloadeddata = () => {
// //         const canvas = document.createElement("canvas");
// //         canvas.width = 360;
// //         canvas.height = 640;
// //         const ctx = canvas.getContext("2d");
// //         ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
// //         setThumbnail(canvas.toDataURL("image/png"));
// //       };
// //     }
// //   };

// //   // Handle category selection
// //   const toggleCategory = (cat) => {
// //     if (selectedCategories.includes(cat)) {
// //       setSelectedCategories(selectedCategories.filter((c) => c !== cat));
// //     } else if (selectedCategories.length < 3) {
// //       setSelectedCategories([...selectedCategories, cat]);
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const reelData = {
// //       caption,
// //       credit,
// //       selectedCategories,
// //       thumbnail,
// //       videoFile,
// //     };
// //     console.log("📤 Reel Uploaded:", reelData);
// //     alert("Reel uploaded successfully!");
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2 style={styles.heading}>Upload Reel</h2>

// //       <form onSubmit={handleSubmit} style={styles.form}>
// //         {/* Upload Button */}
// //         <label htmlFor="videoUpload" style={styles.uploadBtn}>
// //           <span style={{ marginRight: "8px" }}>📹</span> Choose Video
// //         </label>
// //         <input
// //           id="videoUpload"
// //           type="file"
// //           accept="video/*"
// //           onChange={handleVideoUpload}
// //           style={{ display: "none" }}
// //         />

// //         {/* Video + Thumbnail side by side */}
// //         <div style={styles.rowPreview}>
// //           {videoFile && (
// //             <video
// //               ref={videoRef}
// //               src={videoFile}
// //               controls
// //               style={styles.mediaPreview}
// //             />
// //           )}
// //           {thumbnail && (
// //             <div style={styles.thumbnailBox}>
// //               <img src={thumbnail} alt="Thumbnail" style={styles.mediaPreview} />
// //               <p style={styles.thumbText}>Auto Thumbnail</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Caption */}
// //         <label style={styles.label}>Caption</label>
// //         <textarea
// //           value={caption}
// //           onChange={(e) => setCaption(e.target.value)}
// //           placeholder="Write a caption..."
// //           style={styles.textarea}
// //         />

// //         {/* Credit */}
// //         <label style={styles.label}>Give Credit (Optional)</label>
// //         <input
// //           type="text"
// //           value={credit}
// //           onChange={(e) => setCredit(e.target.value)}
// //           placeholder="Enter username for credit"
// //           style={styles.input}
// //         />

// //         {/* Category */}
// //         <label style={styles.label}>Category (max 3)</label>
// //         <button
// //           type="button"
// //           style={styles.categoryBtn}
// //           onClick={() => setShowCategoryPopup(true)}
// //         >
// //           Select Categories
// //         </button>

// //         <div style={styles.selectedCatBox}>
// //           {selectedCategories.map((cat, i) => (
// //             <span key={i} style={styles.catTag}>
// //               {cat}
// //             </span>
// //           ))}
// //         </div>

// //         <button type="submit" style={styles.button}>
// //           🚀 Upload Reel
// //         </button>
// //       </form>

// //       {/* Category Popup */}
// //       {showCategoryPopup && (
// //         <div style={styles.popupOverlay}>
// //           <div style={styles.popup}>
// //             <h3>Select up to 3 Categories</h3>
// //             <div style={styles.popupGrid}>
// //               {categoriesList.map((cat) => (
// //                 <div
// //                   key={cat.id}
// //                   style={{
// //                     ...styles.catCard,
// //                     border: selectedCategories.includes(cat.name)
// //                       ? "2px solid #28a745"
// //                       : "2px solid transparent",
// //                   }}
// //                   onClick={() => toggleCategory(cat.name)}
// //                 >
// //                   <img src={cat.img} alt={cat.name} style={styles.catImg} />
// //                   <p>{cat.name}</p>
// //                 </div>
// //               ))}
// //             </div>
// //             <button
// //               style={styles.doneBtn}
// //               onClick={() => setShowCategoryPopup(false)}
// //             >
// //               ✅ Done
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     maxWidth: "700px",
// //     margin: "20px auto",
// //     padding: "20px",
// //     borderRadius: "10px",
// //     backgroundColor: "#fff",
// //     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// //   },
// //   heading: {
// //     textAlign: "center",
// //     marginBottom: "20px",
// //     color: "#222",
// //   },
// //   form: {
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: "15px",
// //   },
// //   label: { fontWeight: "600", fontSize: "14px", color: "#444" },
// //   input: {
// //     padding: "10px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     fontSize: "14px",
// //   },
// //   textarea: {
// //     padding: "10px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     minHeight: "60px",
// //     resize: "none",
// //     fontSize: "14px",
// //   },
// //   uploadBtn: {
// //     backgroundColor: "#28a745",
// //     color: "#fff",
// //     padding: "12px",
// //     textAlign: "center",
// //     borderRadius: "8px",
// //     cursor: "pointer",
// //     fontWeight: "600",
// //     fontSize: "15px",
// //     display: "inline-flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   rowPreview: {
// //     display: "flex",
// //     gap: "15px",
// //     justifyContent: "center",
// //     flexWrap: "wrap",
// //   },
// //   mediaPreview: {
// //     width: "180px",
// //     height: "320px",
// //     objectFit: "cover",
// //     borderRadius: "10px",
// //     border: "1px solid #ddd",
// //   },
// //   thumbnailBox: { textAlign: "center" },
// //   thumbText: { fontSize: "12px", color: "#666", marginTop: "5px" },
// //   categoryBtn: {
// //     padding: "10px",
// //     border: "1px solid #28a745",
// //     borderRadius: "8px",
// //     background: "#fff",
// //     cursor: "pointer",
// //     fontWeight: "600",
// //     color: "#28a745",
// //   },
// //   selectedCatBox: {
// //     display: "flex",
// //     gap: "8px",
// //     flexWrap: "wrap",
// //   },
// //   catTag: {
// //     backgroundColor: "#28a745",
// //     color: "#fff",
// //     padding: "6px 12px",
// //     borderRadius: "20px",
// //     fontSize: "12px",
// //   },
// //   button: {
// //     padding: "12px",
// //     backgroundColor: "#007BFF",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "8px",
// //     fontSize: "16px",
// //     cursor: "pointer",
// //   },
// //   popupOverlay: {
// //     position: "fixed",
// //     top: 0,
// //     left: 0,
// //     width: "100vw",
// //     height: "100vh",
// //     backgroundColor: "rgba(0,0,0,0.6)",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   popup: {
// //     background: "#fff",
// //     padding: "20px",
// //     borderRadius: "10px",
// //     width: "90%",
// //     maxWidth: "500px",
// //     textAlign: "center",
// //   },
// //   popupGrid: {
// //     display: "grid",
// //     gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
// //     gap: "15px",
// //     marginTop: "15px",
// //   },
// //   catCard: {
// //     border: "2px solid transparent",
// //     borderRadius: "8px",
// //     cursor: "pointer",
// //     overflow: "hidden",
// //     transition: "0.3s",
// //   },
// //   catImg: { width: "100%", height: "100px", objectFit: "cover" },
// //   doneBtn: {
// //     marginTop: "15px",
// //     backgroundColor: "#28a745",
// //     color: "#fff",
// //     padding: "10px 15px",
// //     borderRadius: "8px",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// // };

// // export default ReelPost;


// // // ReelPost.js
// // import React, { useState, useRef } from "react";

// // const ReelPost = () => {
// //   const [videoFile, setVideoFile] = useState(null);
// //   const [thumbnail, setThumbnail] = useState(null);
// //   const [caption, setCaption] = useState("");
// //   const [category, setCategory] = useState("");
// //   const [credit, setCredit] = useState("");

// //   const videoRef = useRef();

// //   // Handle video upload & generate thumbnail
// //   const handleVideoUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setVideoFile(URL.createObjectURL(file));

// //       // Generate thumbnail
// //       const videoEl = document.createElement("video");
// //       videoEl.src = URL.createObjectURL(file);
// //       videoEl.currentTime = 1; // 1 sec snapshot

// //       videoEl.onloadeddata = () => {
// //         const canvas = document.createElement("canvas");
// //         canvas.width = 300;
// //         canvas.height = 200;
// //         const ctx = canvas.getContext("2d");
// //         ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
// //         setThumbnail(canvas.toDataURL("image/png"));
// //       };
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const reelData = {
// //       caption,
// //       category,
// //       credit,
// //       thumbnail,
// //       videoFile,
// //     };
// //     console.log("📤 Reel Uploaded:", reelData);
// //     alert("Reel uploaded successfully!");
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2 style={styles.heading}>Upload Reel</h2>

// //       <form onSubmit={handleSubmit} style={styles.form}>
// //         {/* Video Upload */}
// //         <label style={styles.label}>Upload Video</label>
// //         <input
// //           type="file"
// //           accept="video/*"
// //           onChange={handleVideoUpload}
// //           style={styles.input}
// //         />

// //         {videoFile && (
// //           <div style={styles.previewBox}>
// //             <video
// //               ref={videoRef}
// //               src={videoFile}
// //               controls
// //               style={styles.videoPreview}
// //             />
// //           </div>
// //         )}

// //         {/* Thumbnail Preview */}
// //         {thumbnail && (
// //           <div style={styles.thumbnailBox}>
// //             <img
// //               src={thumbnail}
// //               alt="Thumbnail"
// //               style={styles.thumbnailPreview}
// //             />
// //             <p style={styles.thumbText}>Auto Generated Thumbnail</p>
// //           </div>
// //         )}

// //         {/* Caption */}
// //         <label style={styles.label}>Caption</label>
// //         <textarea
// //           value={caption}
// //           onChange={(e) => setCaption(e.target.value)}
// //           placeholder="Write a caption..."
// //           style={styles.textarea}
// //         />

// //         {/* Category */}
// //         <label style={styles.label}>Category</label>
// //         <select
// //           value={category}
// //           onChange={(e) => setCategory(e.target.value)}
// //           style={styles.select}
// //         >
// //           <option value="">Select Category</option>
// //           <option value="Motivation">Motivation</option>
// //           <option value="Comedy">Comedy</option>
// //           <option value="Education">Education</option>
// //           <option value="Music">Music</option>
// //           <option value="Travel">Travel</option>
// //         </select>

// //         {/* Credit */}
// //         <label style={styles.label}>Give Credit (Optional)</label>
// //         <input
// //           type="text"
// //           value={credit}
// //           onChange={(e) => setCredit(e.target.value)}
// //           placeholder="Enter username for credit"
// //           style={styles.input}
// //         />

// //         <button type="submit" style={styles.button}>
// //           Upload Reel
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     maxWidth: "600px",
// //     margin: "20px auto",
// //     padding: "20px",
// //     borderRadius: "10px",
// //     backgroundColor: "#f9f9f9",
// //     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
// //   },
// //   heading: {
// //     textAlign: "center",
// //     marginBottom: "20px",
// //     color: "#333",
// //   },
// //   form: {
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: "15px",
// //   },
// //   label: {
// //     fontWeight: "600",
// //     fontSize: "14px",
// //     color: "#444",
// //   },
// //   input: {
// //     padding: "10px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     fontSize: "14px",
// //   },
// //   textarea: {
// //     padding: "10px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     minHeight: "60px",
// //     resize: "none",
// //     fontSize: "14px",
// //   },
// //   select: {
// //     padding: "10px",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     fontSize: "14px",
// //   },
// //   button: {
// //     padding: "12px",
// //     backgroundColor: "#007BFF",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "8px",
// //     fontSize: "16px",
// //     cursor: "pointer",
// //     transition: "0.3s",
// //   },
// //   previewBox: {
// //     marginTop: "10px",
// //     display: "flex",
// //     justifyContent: "center",
// //   },
// //   videoPreview: {
// //     width: "100%",
// //     borderRadius: "10px",
// //   },
// //   thumbnailBox: {
// //     textAlign: "center",
// //   },
// //   thumbnailPreview: {
// //     width: "100%",
// //     maxWidth: "300px",
// //     borderRadius: "10px",
// //     marginTop: "10px",
// //   },
// //   thumbText: {
// //     fontSize: "12px",
// //     color: "#666",
// //   },
// // };

// // export default ReelPost;
