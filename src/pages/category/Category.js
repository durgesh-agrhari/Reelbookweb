import React, { useState } from 'react';
import './Category.css';

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCardClick = (title) => {
    setSelectedCategory(title);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="category-container">
      <h1 className="category-heading">Choose Video Category</h1>

      <div className="category-subheading">👦 For Boys Category</div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Motivation')}>
          <img src="https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg" alt="Motivation" className="category-image" />
          <div className="category-info">
            <div className="category-title">Motivation</div>
            <div className="category-count">(14) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Gym')}>
          <img src="https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg" alt="Gym" className="category-image" />
          <div className="category-info">
            <div className="category-title">Gym</div>
            <div className="category-count">(1) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Sports')}>
          <img src="https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900" alt="Sports" className="category-image" />
          <div className="category-info">
            <div className="category-title">Sports</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Motivation')}>
          <img src="https://photosnow.org/wp-content/uploads/2024/04/cute-girl-pic-cartoon_17.jpg" alt="girls" className="category-image" />
          <div className="category-info">
            <div className="category-title">Girls</div>
            <div className="category-count">(14) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Gym')}>
          <img src="https://cdn.lazyshop.com/files/9cf1cce8-c416-4a69-89ba-327f54c3c5a0/product/166f296a084c378a004d21fcf78d04f9.jpeg" alt="Attitude" className="category-image" />
          <div className="category-info">
            <div className="category-title">Attitude</div>
            <div className="category-count">(1) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Sports')}>
          <img src="https://source.boomplaymusic.com/group10/M00/04/28/3230e655b91b4422bf9badcbbf9ee649_464_464.jpg" alt="Bhojpuri" className="category-image" />
          <div className="category-info">
            <div className="category-title">Bhojpuri</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Motivation')}>
          <img src="https://sc0.blr1.cdn.digitaloceanspaces.com/article/153856-eamvrlxriu-1611577633.jpeg" alt="Sayari" className="category-image" />
          <div className="category-info">
            <div className="category-title">Sayari</div>
            <div className="category-count">(14) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Gym')}>
          <img src="https://img.freepik.com/premium-photo/lofi-music-beautiful-anime-girl-listen-music_485374-1330.jpg" alt="Lovemusic" className="category-image" />
          <div className="category-info">
            <div className="category-title">Lovemusic</div>
            <div className="category-count">(1) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Sports')}>
          <img src="https://imgeng.jagran.com/images/2024/05/08/article/image/thegreatindiankapilshow-1715169002824.jpg" alt="Comedy" className="category-image" />
          <div className="category-info">
            <div className="category-title">Comedy</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
      </div>

      <div className="category-subheading">👧 For Girls Category</div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWMlgfivmUvNK4Ro0IG4T-KtYWuNJbhkzZQ&s" alt="Parlour" className="category-image" />
          <div className="category-info">
            <div className="category-title">Parlour</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOEBJMjpR7cUI5dDRCQTbC0vfDM2jYEu3rA&s" alt="Mehadi" className="category-image" />
          <div className="category-info">
            <div className="category-title">Mehadi</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://img.fixthephoto.com/blog/images/gallery/news_preview_mob_image__preview_883.jpg" alt="SweetSelfie" className="category-image" />
          <div className="category-info">
            <div className="category-title">SweetSelfie</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://i.pinimg.com/736x/e0/0c/81/e00c814d2820c76438efbee151e4d21e.jpg" alt="NailArt" className="category-image" />
          <div className="category-info">
            <div className="category-title">Nail Art</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://i.pinimg.com/236x/82/a2/40/82a240dd15dcfd5bc84c2542662e0f75.jpg" alt="HairStyle" className="category-image" />
          <div className="category-info">
            <div className="category-title">HairStyle</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
         <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://www.kokuyocamlin.com/camel/image/catalog/artists/ak5zS2ZTeUhvWnV2NEFtaXg1QXUxQT098435/1684607773file5_org.jpg" alt="Art-Sketch" className="category-image" />
          <div className="category-info">
            <div className="category-title">Art Sketch</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://images.ctfassets.net/ub3bwfd53mwy/5zi8myLobtihb1cWl3tj8L/45a40e66765f26beddf7eeee29f74723/6_Image.jpg?w=750" alt="Cat Lover" className="category-image" />
          <div className="category-info">
            <div className="category-title">Cat Lover</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://t4.ftcdn.net/jpg/01/16/17/35/360_F_116173569_djlZMlMzdRG1fPd71tvhJ11Y8EEopjkJ.jpg" alt="Dog Lover" className="category-image" />
          <div className="category-info">
            <div className="category-title">Dog Lover</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://hips.hearstapps.com/hmg-prod/images/one-pot-meals-1616159616.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*" alt="Cooking" className="category-image" />
          <div className="category-info">
            <div className="category-title">Cooking</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>

      <div className="category-subheading">👥 Common Category</div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Sayari')}>
          <img src="https://preview.redd.it/here-she-is-the-new-temerario-what-do-yall-think-v0-ezkkox8152jd1.jpg?width=1080&crop=smart&auto=webp&s=45dcc449b83073c44a879377600c83593bf61026" alt="CarLover" className="category-image" />
          <div className="category-info">
            <div className="category-title">CarLover</div>
            <div className="category-count">(7) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Lovemusic')}>
          <img src="https://i.pinimg.com/236x/45/fb/f5/45fbf5364558bc1f3a155122279d8ad3.jpg" alt="BykeLover" className="category-image" />
          <div className="category-info">
            <div className="category-title">BykeLover</div>
            <div className="category-count">(9) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Comedy')}>
          <img src="https://i.pinimg.com/originals/ca/3c/6b/ca3c6b76a0f2d3708e06330354b5fae8.jpg" alt="Selfie Pose" className="category-image" />
          <div className="category-info">
            <div className="category-title">Selfie Pose</div>
            <div className="category-count">(4) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://thumbs.dreamstime.com/b/sexy-young-girl-singer-singing-contrast-silhouette-sexy-singer-girl-singing-dancing-sexy-female-red-concert-dress-dancing-173265918.jpg" alt="Singing" className="category-image" />
          <div className="category-info">
            <div className="category-title">Singing</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCk6f2rhe5YhpC_tBii2RteOj39kcQRyJImA&s" alt="Danceing" className="category-image" />
          <div className="category-info">
            <div className="category-title">Danceing</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://5.imimg.com/data5/SELLER/Default/2023/3/TF/BK/UW/103578143/3d-nature-wallpaper-500x500.jpg" alt="Nature" className="category-image" />
          <div className="category-info">
            <div className="category-title">Nature</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>
      <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6g7cgN9ldehh_kDnh0PF1R2xNszaQzm_SIDVGZ62SDsHLkuTNvPWHYojsGbBOwazVg4&usqp=CAU" alt="God Video" className="category-image" />
          <div className="category-info">
            <div className="category-title">God Video</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcGIlItZm69HFnFKh_ROr8biTG2xQu9lTWXSDK4_a6IwLqcT8f7AE9QuTXo5iR1XSUcoo&usqp=CAU" alt="Bajan" className="category-image" />
          <div className="category-info">
            <div className="category-title">Bajan</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ92zihWSb5UoidrJ5NY_ih0HWXVa1V96AsQw&s" alt="Temple" className="category-image" />
          <div className="category-info">
            <div className="category-title">Temple</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>

      <div className="category-subheading">🤑 Trips, Learning & Enjoy</div>
       <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://t4.ftcdn.net/jpg/04/59/82/89/360_F_459828924_ANMZD5IqA4io5iAKWbK7bsPwnTmjYABC.jpg" alt="GF Talk" className="category-image" />
          <div className="category-info">
            <div className="category-title">GF Talk</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXstrZVD0Z1qtnrlhDJyFkCSE4VksAp81TpA&s" alt="Speeking" className="category-image" />
          <div className="category-info">
            <div className="category-title">Speeking</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://static.wixstatic.com/media/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/4383bd_f3ecb8a1c3e5427291d93fafcea2d4f9~mv2.jpg" alt="Interview" className="category-image" />
          <div className="category-info">
            <div className="category-title">Interview</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>
       <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://img.freepik.com/premium-vector/trading-logo-with-chart-concept_11481-675.jpg?semt=ais_hybrid" alt="Trading" className="category-image" />
          <div className="category-info">
            <div className="category-title">Trading</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-bdCOESyvHbw9KspkGSrnxFW_CTA6eOPDkQ&s" alt="Bussines" className="category-image" />
          <div className="category-info">
            <div className="category-title">Bussines</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EeQnwM2hMvlE_GHDNTooPCQgrje48fEX2t9jsP23EBAjoALyU7_Qn2cITXX2E2k1zRc&usqp=CAU" alt="EarnMony" className="category-image" />
          <div className="category-info">
            <div className="category-title">EarnMony</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>
       <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB8_FwanhrD1gZtyj7dE5sBy1mWqz9t_vEdw&s" alt="V-Editing" className="category-image" />
          <div className="category-info">
            <div className="category-title">V-Editing</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkwpOqBwO1rmh5dcZ9_xf6ZvfWvWGfTL_DYw&s" alt="SkinCare" className="category-image" />
          <div className="category-info">
            <div className="category-title">SkinCare</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://i.pinimg.com/236x/62/48/03/624803bee204bc2b7761449dcc502821.jpg" alt="Animay" className="category-image" />
          <div className="category-info">
            <div className="category-title">Animay</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>

       <div className="category-subheading">🌐 Reel Category Update</div>
       <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAXdgfVxpAQfJLpRo9WBmPZKoq3WYaDW27chTAHpqSAcN-to4v5ILwLl3Xwd8rSj69uuY&usqp=CAU" alt="Youtuber" className="category-image" />
          <div className="category-info">
            <div className="category-title">Youtuber</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2022/03/Bollywood-celebs-investing-ft-1-1-150x150.jpg" alt="FlimWorld" className="category-image" />
          <div className="category-info">
            <div className="category-title">FlimWorld</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://media.istockphoto.com/id/537316429/photo/high-contrast-image-of-magician-hand-with-magic-wand.jpg?s=612x612&w=0&k=20&c=GbnLRDGmfQI_x9CQnOsxefKnJLxAAWHbH6PLpTuQQeY=" alt="Magic" className="category-image" />
          <div className="category-info">
            <div className="category-title">Magic</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>
       <div className="category-row">
        <div className="category-card" onClick={() => handleCardClick('Girls')}>
          <img src="https://static.vecteezy.com/system/resources/previews/033/504/750/non_2x/sexy-girl-generative-ai-free-photo.jpg" alt="Ai Modal" className="category-image" />
          <div className="category-info">
            <div className="category-title">Ai Modal</div>
            <div className="category-count">(17) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Attitude')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi8hg5_EibznkZCY8q_FHMgEThpgUE4sQuxg&s" alt="Story" className="category-image" />
          <div className="category-info">
            <div className="category-title">Story</div>
            <div className="category-count">(2) ▶</div>
          </div>
        </div>
        <div className="category-card" onClick={() => handleCardClick('Bhojpuri')}>
          <img src="https://thehartfordinformer.com/wp-content/uploads/2023/04/reality_tv_collage.jpeg" alt="RealityShow" className="category-image" />
          <div className="category-info">
            <div className="category-title">RealityShow</div>
            <div className="category-count">(8) ▶</div>
          </div>
        </div>
      </div>


      {selectedCategory && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <button className="popup-close" onClick={closeModal}>✕</button>
            <h2>{selectedCategory} Videos</h2>
            <p>To watch {selectedCategory} videos, please download our app from the Play Store.</p>
            <a
              href="https://play.google.com/store"
              className="popup-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download App
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;








// import React, { useState } from 'react';
// import './Category.css';

// const categories = [
//   {
//     title: 'Motivation',
//     count: 14,
//     image: 'https://i.pinimg.com/originals/fa/46/fa/fa46fabeafa02cd231b6c75a0a3a2d11.jpg',
//   },
//   {
//     title: 'Gym',
//     count: 1,
//     image: 'https://w0.peakpx.com/wallpaper/105/816/HD-wallpaper-sports-fitness-brown-eyes-brunette-girl-gym-model-woman.jpg',
//   },
//   {
//     title: 'Sports',
//     count: 2,
//     image: 'https://im.rediff.com/cricket/2023/jan/17kohli1.jpg?w=670&h=900',
//   },
//   {
//     title: 'Girls',
//     count: 17,
//     image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   {
//     title: 'Attitude',
//     count: 2,
//     image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   {
//     title: 'Bhojpuri',
//     count: 8,
//     image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     title: 'Sayari',
//     count: 7,
//     image: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   {
//     title: 'Lovemusic',
//     count: 9,
//     image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     title: 'Comedy',
//     count: 4,
//     image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
// ];
// const Category = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const handleCardClick = (title) => {
//     setSelectedCategory(title);
//   };

//   const closeModal = () => {
//     setSelectedCategory(null);
//   };

//   return (
//     <div className="category-container">
//       <h1 className="category-heading">Choose Video Category</h1>
//       <div className="category-subheading">👦 For Boys Category</div>
//       <div className="category-row">
//         {categories.map((cat, index) => (
//           <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
//             <img src={cat.image} alt={cat.title} className="category-image" />
//             <div className="category-info">
//               <div className="category-title">{cat.title}</div>
//               <div className="category-count">({cat.count}) ▶</div>
//             </div>
//           </div>
//         ))}
//       </div>
//        <div className="category-subheading">👦 For Girls Category</div>
//       <div className="category-row">
//         {categories.map((cat, index) => (
//           <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
//             <img src={cat.image} alt={cat.title} className="category-image" />
//             <div className="category-info">
//               <div className="category-title">{cat.title}</div>
//               <div className="category-count">({cat.count}) ▶</div>
//             </div>
//           </div>
//         ))}
//       </div>

//        <div className="category-subheading">👦 Comman Category</div>
//       <div className="category-row">
//         {categories.map((cat, index) => (
//           <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
//             <img src={cat.image} alt={cat.title} className="category-image" />
//             <div className="category-info">
//               <div className="category-title">{cat.title}</div>
//               <div className="category-count">({cat.count}) ▶</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedCategory && (
//         <div className="popup-overlay">
//           <div className="popup-modal">
//             <button className="popup-close" onClick={closeModal}>✕</button>
//             <h2>{selectedCategory} Videos</h2>
//             <p>To watch {selectedCategory} videos, please download our app from the Play Store.</p>
//             <a
//               href="https://play.google.com/store"
//               className="popup-button"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Download App
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Category;

