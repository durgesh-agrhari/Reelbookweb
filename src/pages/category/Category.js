import React, { useState } from 'react';
import './Category.css';

const categories = [
  {
    title: 'Motivation',
    count: 14,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    title: 'Gym',
    count: 1,
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    title: 'Sports',
    count: 2,
    image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Girls',
    count: 17,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    title: 'Attitude',
    count: 2,
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    title: 'Bhojpuri',
    count: 8,
    image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Sayari',
    count: 7,
    image: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    title: 'Lovemusic',
    count: 9,
    image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Comedy',
    count: 4,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];
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
        {categories.map((cat, index) => (
          <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
            <img src={cat.image} alt={cat.title} className="category-image" />
            <div className="category-info">
              <div className="category-title">{cat.title}</div>
              <div className="category-count">({cat.count}) ▶</div>
            </div>
          </div>
        ))}
      </div>
       <div className="category-subheading">👦 For Girls Category</div>
      <div className="category-row">
        {categories.map((cat, index) => (
          <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
            <img src={cat.image} alt={cat.title} className="category-image" />
            <div className="category-info">
              <div className="category-title">{cat.title}</div>
              <div className="category-count">({cat.count}) ▶</div>
            </div>
          </div>
        ))}
      </div>

       <div className="category-subheading">👦 Comman Category</div>
      <div className="category-row">
        {categories.map((cat, index) => (
          <div className="category-card" key={index} onClick={() => handleCardClick(cat.title)}>
            <img src={cat.image} alt={cat.title} className="category-image" />
            <div className="category-info">
              <div className="category-title">{cat.title}</div>
              <div className="category-count">({cat.count}) ▶</div>
            </div>
          </div>
        ))}
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


// import React from 'react';
// import './Category.css';

// const categories = [
//   {
//     title: 'Motivation',
//     count: 14,
//     image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   {
//     title: 'Gym',
//     count: 1,
//     image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   {
//     title: 'Sports',
//     count: 2,
//     image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80',
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
//   return (
//     <div className="category-container">
//       <h1 className="category-heading">Choose Video Category</h1>
//       <div className="category-subheading">👦 For Boys Category</div>

//       <div className="category-grid">
//         {categories.map((cat, index) => (
//           <div className="category-card" key={index}>
//             <img src={cat.image} alt={cat.title} className="category-image" />
//             <div className="category-info">
//               <div className="category-title">{cat.title}</div>
//               <div className="category-count">({cat.count}) ▶</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Category;
