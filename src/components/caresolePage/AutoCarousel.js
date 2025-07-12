import React, { useEffect, useRef } from 'react';
import './AutoCarousel.css';

const items = [
  { id: 1, image: 'https://picsum.photos/id/1015/300/200' },
  { id: 2, image: 'https://picsum.photos/id/1016/300/200' },
  { id: 3, image: 'https://picsum.photos/id/1018/300/200' },
  { id: 4, image: 'https://picsum.photos/id/1020/300/200' },
  { id: 5, image: 'https://picsum.photos/id/1021/300/200' },
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
