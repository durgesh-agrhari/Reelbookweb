import React, { useState } from 'react';
import './StoryViewer.css';

const storyData = [
    {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    },
     {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photosly.in/wp-content/uploads/2024/08/cute-girl-pic15.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    }, {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    },
     {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    },
     {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    },
     {
        id: 1,
        username: 'john_doe',
        caption: 'My trip to the mountains!',
        views: 1234,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
            { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: 2,
        username: 'jane_smith',
        caption: 'Sunset at the beach',
        views: 2345,
        media: [
            { type: 'image', url: 'https://photoswala.net/wp-content/uploads/2025/04/girl-dp_9.jpg' },
        ],
    },
    {
        id: 3,
        username: 'alice',
        caption: 'Workout session 💪',
        views: 312,
        media: [
            { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
        ],
    },
    // Add more stories as needed
];

const StoryViewer = () => {
    const [activeStory, setActiveStory] = useState(null);
    const [mediaIndex, setMediaIndex] = useState(0);

    const handleStoryClick = (story) => {
        setActiveStory(story);
        setMediaIndex(0);
    };

    const handleClose = () => {
        setActiveStory(null);
        setMediaIndex(0);
    };

    const handleNext = () => {
        if (mediaIndex < activeStory.media.length - 1) {
            setMediaIndex(mediaIndex + 1);
        }
    };

    const handlePrev = () => {
        if (mediaIndex > 0) {
            setMediaIndex(mediaIndex - 1);
        }
    };

    return (
        <>
            <div className="story-row-container">
                {storyData.map((story) => (
                    <div key={story.id} className="story-circle" onClick={() => handleStoryClick(story)}>
                        {story.media[0].type === 'image' ? (
                            <img
                                src={story.media[0].url}
                                alt="story"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    backgroundColor: 'gray'
                                }}
                            />
                        ) : (
                            <video
                                src={story.media[0].url}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    backgroundColor: 'black'
                                }}
                                muted
                                autoPlay
                                loop
                            />
                        )}

                    </div>
                ))}
            </div>

            {activeStory && (
                <div className="modal-overlay">
                    <div className="modal-content full-screen">
                        <button className="modal-close" onClick={handleClose}>×</button>

                        {activeStory.media[mediaIndex].type === 'image' ? (
                            <img src={activeStory.media[mediaIndex].url} alt="story" className="modal-media" />
                        ) : (
                            <video src={activeStory.media[mediaIndex].url} className="modal-media" controls autoPlay />
                        )}

                        <div className="story-info">
                            <h4>@{activeStory.username}</h4>
                            <p>{activeStory.caption}</p>
                            <p>{activeStory.views} views</p>
                        </div>

                        {activeStory.media.length > 1 && (
                            <div className="story-controls">
                                <button onClick={handlePrev} disabled={mediaIndex === 0}>← Prev</button>
                                <button onClick={handleNext} disabled={mediaIndex === activeStory.media.length - 1}>Next →</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default StoryViewer;
