import React from 'react'
// import "../style/Hero.css"
import "../../components/style/GoogleLogin.css"
import {  useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from '../../firebaseConfig/Config'

// import heroDarkImg from '../../assets/tclogo.png'
// import lightImg from "../../assets/tclogo.png"
const LoginGoogle = ({ theme }) => {

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    async function signIn() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            navigate('/UserProfile')
            console.log("Google user:", user);
        } catch (error) {
            console.error("Google login error:", error);
        }
    }

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
                        <button className='google-btn'>
                         
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"  // ← replace with your own image
                                    alt="arrow"
                                    style={{ width: '150px', height: '40px', borderRadius: '10px' }}
                                />
                          
                        </button>


                    </div>

                    <div className='right12'>

                        <div style={{ backgroundColor: '#1a1e24', padding: 80, borderRadius: 20 }}>
                            <h3 className='highlight1'>Login with Google</h3>
                            <div className='hero__btns'>
                                <button style={{ borderRadius: '10px' }} onClick={signIn} >
                                    <div to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src="https://www.drupal.org/files/issues/2020-01-26/google_logo.png"  // ← replace with your own image
                                            alt="arrow"
                                            style={{ width: '300px', height: '60px' }}
                                        />
                                    </div>
                                </button>
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </section>
    )
}

export default LoginGoogle
