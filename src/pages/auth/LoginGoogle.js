import React from 'react'
// import "../style/Hero.css"
import "../../components/style/Hero.css"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

// import heroDarkImg from '../../assets/tclogo.png'
// import lightImg from "../../assets/tclogo.png"
const LoginGoogle = ({ theme }) => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className='hero__section'>
            <div className='container'>
                <div className='hero__wrapper'>
                    <div className='hero__content'>
                        <div className='left1'>
                            <h2>Download Reelbook App</h2>
                            <h2 >Enjoy 40+ Short video Category</h2>
                            <h3 className='highlight'>Be Motivated </h3>
                        </div> <br />
                        <p className='discription'>Find your intest video on Reelbook</p>
                        <button style={{ borderRadius: '10px', marginTop:'20px' }}>
                            <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"  // ← replace with your own image
                                    alt="arrow"
                                    style={{ width: '150px', height: '40px', borderRadius: '10px' }}
                                />
                            </Link>
                        </button>


                    </div>



                    <div className='right12'>

                        <div style={{ backgroundColor: '#1a1e24', padding: 80, borderRadius: 20 }}>
                            <h3 className='highlight1'>Login with Google</h3>
                            <div className='hero__btns'>
                                <button style={{ borderRadius: '10px' }}>
                                    <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src="https://www.drupal.org/files/issues/2020-01-26/google_logo.png"  // ← replace with your own image
                                            alt="arrow"
                                            style={{ width: '300px', height: '60px' }}
                                        />
                                    </Link>
                                </button>
                            </div>
                        </div>

                        {/* <div
                            style={{
                                width: '150px',
                                height: '150px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '30px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at center, #ff00cc, #3333ff, #00ccff, #00ff99)',
                                boxShadow: '10 10 40px 10px rgba(255, 0, 204, 0.4)',
                                animation: 'pulseGlow 4s infinite ease-in-out',
                            }}
                        >
                            <img
                                src={theme === 'light-theme' ? lightImg : heroDarkImg}
                                alt="hero-img"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'contain',
                                    backgroundColor: '#ffffff',
                                    padding: '10px',
                                    margin: '5px',
                                }}
                            />
                        </div> */}

                    </div>

                </div>
            </div>
        </section>
    )
}

export default LoginGoogle
