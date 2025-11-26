import React, { useEffect } from 'react'
import "../style/Hero.css"
import { Link } from 'react-router-dom'

const Social = ({ theme }) => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className='hero__section'>
            <div className='container'>
                <div className='hero__wrapper'>

                    {/* Left Side - Social Media Icons */}
                    <div className='hero__content' style={{marginTop:'50px'}}>
                        <div className='social-icons'>
                            <h3 className='highlight'>Follow Us</h3>
                            <div className='social-links'>
                                <a href="https://www.youtube.com/@reelbookapp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="https://www.instagram.com/reelbookapp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61581772550243" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="https://x.com/reelbookapp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/reelbook/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                                {/* <a href="https://www.reddit.com/user/reelbookapp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-reddit"></i>
                                </a> */}
                                <a href="https://medium.com/@reelbookapp" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-medium"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - App Download Buttons */}
                    <div className='right12'>
                        <div>
                            <h3 className='highlight1' style={{marginTop:'50px'}} >Download from Play Store and App Store</h3>
                            <div className='hero__btns'>
                                <button style={{ borderRadius: '10px' }}>
                                    <Link to='https://play.google.com/store/apps/details?id=com.reelbook' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                                            alt="Google Play"
                                            style={{ width: '160px', height: '50px' }}
                                        />
                                    </Link>
                                </button>
                                <button style={{ borderRadius: '10px' }}>
                                    <Link to='https://apps.apple.com/in/app/reelbook-app/id6755233312' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src="https://w7.pngwing.com/pngs/327/888/png-transparent-aivalable-on-the-app-store-hd-logo.png"
                                            alt="App Store"
                                            style={{ width: '160px', height: '50px', borderRadius: '10px' }}
                                        />
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Social
