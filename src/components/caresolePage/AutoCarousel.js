import React, { useEffect, useRef, useState } from 'react';
import './AutoCarousel.css';

const items = [
  { id: 1, image: require('../../assets/slider/11.png') },
  { id: 2, image: require('../../assets/slider/2222.png') },
  { id: 3, image: require('../../assets/slider/3333.png') },
  { id: 4, image: require('../../assets/slider/4444.png') },
  { id: 5, image: require('../../assets/slider/5555.png') },
];

const AutoCarousel = () => {
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollForward = () => {
    const container = containerRef.current;
    if (!container) return;

    const firstItem = container.children[0];
    const itemWidth = firstItem.offsetWidth;

    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(-${itemWidth + 10}px)`;

    setTimeout(() => {
      container.style.transition = 'none';
      container.appendChild(firstItem);
      container.style.transform = 'translateX(0)';
    }, 500);

    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const scrollBackward = () => {
    const container = containerRef.current;
    if (!container) return;

    const lastItem = container.children[container.children.length - 1];
    const itemWidth = lastItem.offsetWidth;

    container.style.transition = 'none';
    container.insertBefore(lastItem, container.children[0]);
    container.style.transform = `translateX(-${itemWidth + 10}px)`;

    setTimeout(() => {
      container.style.transition = 'transform 0.5s ease-in-out';
      container.style.transform = 'translateX(0)';
    }, 10);

    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(scrollForward, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const pauseScrolling = () => {
    clearInterval(intervalRef.current);
    setIsPaused(true);
  };
  const resumeScrolling = () => {
    setIsPaused(false);
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pauseScrolling();
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) scrollForward();
      else scrollBackward();
    }
    resumeScrolling();
  };

  const handleDotClick = (index) => {
    const container = containerRef.current;
    if (!container) return;

    // Pause auto scroll briefly
    pauseScrolling();

    // Calculate number of moves
    let moves = index - activeIndex;

    if (moves === 0) return; // already active

    if (moves > 0) {
      for (let i = 0; i < moves; i++) {
        scrollForward();
      }
    } else {
      for (let i = 0; i < -moves; i++) {
        scrollBackward();
      }
    }

    setActiveIndex(index);
    resumeScrolling();
  };


  return (
    <div
      className="carousel-outer"
      onMouseEnter={pauseScrolling}
      onMouseLeave={resumeScrolling}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-wrapper">
        <div className="carousel-container" ref={containerRef}>
          {items.map((item) => (
            <div className="carousel-item" key={item.id}>
              <img src={item.image} alt={`Slide ${item.id}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots below carousel */}
      {/* <div className="carousel-dots">
        {items.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div> */}
      {/* Dots below carousel */}
      <div className="carousel-dots">
        {items.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)} // ⬅️ Add this
          ></span>
        ))}
      </div>

    </div>
  );
};

export default AutoCarousel;
