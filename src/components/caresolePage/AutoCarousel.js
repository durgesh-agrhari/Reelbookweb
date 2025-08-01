import React, { useEffect, useRef } from 'react';
import './AutoCarousel.css';

const items = [
  { id: 1, image: require('../../assets/slider/1.png') },
  { id: 2, image: require('../../assets/slider/2.png')  },
  { id: 3, image: require('../../assets/slider/3.png')  },
  { id: 4, image: require('../../assets/slider/1.png')  },
  { id: 5, image: require('../../assets/slider/2.png')  },
];

const AutoCarousel = () => {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroll = () => {
      if (!container) return;

      const firstItem = container.children[0];
      const itemWidth = firstItem.offsetWidth;

      container.style.transition = 'transform 0.5s ease-in-out';
      container.style.transform = `translateX(-${itemWidth}px)`;

      setTimeout(() => {
        container.style.transition = 'none';
        container.appendChild(firstItem);
        container.style.transform = 'translateX(0)';
      }, 500);
    };

    intervalRef.current = setInterval(scroll, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const pauseScrolling = () => clearInterval(intervalRef.current);
  const resumeScrolling = () => {
    intervalRef.current = setInterval(() => {
      const container = containerRef.current;
      const firstItem = container.children[0];
      const itemWidth = firstItem.offsetWidth;

      container.style.transition = 'transform 0.5s ease-in-out';
      container.style.transform = `translateX(-${itemWidth}px)`;

      setTimeout(() => {
        container.style.transition = 'none';
        container.appendChild(firstItem);
        container.style.transform = 'translateX(0)';
      }, 500);
    }, 1000);
  };

  return (
    <div className="carousel-wrapper" onMouseEnter={pauseScrolling} onMouseLeave={resumeScrolling}>
      <div className="carousel-container" ref={containerRef}>
        {items.map((item) => (
          <div className="carousel-item" key={item.id}>
            <img src={item.image} alt={`Slide ${item.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;
