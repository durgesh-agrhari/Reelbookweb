import React from 'react'
import './footer.css'
import Newsletter from '../UI/Newsletter'
import { useEffect } from 'react'

const quickLinks01 = [
    {
        path:"/codechef-contest-solution",
        display:"CodeChef"
    },
    {
        path:"/codeforces-contest-solution",
        display:"CodeForces"
    },
    {
        path:"/leedcode-contest-solution",
        display:"LeedCode"
    },
]

const quickLinks02 = [
    {
        path:"/array-basic-questions",
        display:"DSA"
    },
    {
        path:"/web-development",
        display:"Web"
    },
    {
        path:"/job-home",
        display:"Job"
    },
]

const quickLinks03 = [
    {
        path:"/array-basic-questions",
        display:"Array"
    },
    {
        path:"/string-basic-questions",
        display:"String"
    },
    {
        path:"#",
        display:"Sorting"
    },
]
const Footer = () => {

    const Year = new Date().getFullYear()

    useEffect(() => {
        window.scrollTo(0,0)
      },[]);

    const newTab=url=>{
        window.open(url)
    }
  return (
    <>
    <Newsletter/>
    <footer className='footer'>
        <div className="container">
            <div className="footer__wrapper">
                <div className="footer__logo">
                    <h2>Reelbook</h2>
                    <p className="discription">Grow with us </p>

                    <p className='small__text discription'>Making learning easier and more convenient for you. Data Structure. Data structures are the problem - solving pillars of coding.</p>
                </div>

                <div className="footer__quick-link">
                    <div className="quick__link-title">Solutions</div>
                    <ul className="quick__links">
                        {
                            quickLinks01.map((item, index) => (
                                <li className="quick__link-item" key={index}><a href={item.path}> {item.display}</a></li>
                            ))
                        }
                    </ul>
                </div>
                <div className="footer__quick-link">
                    <div className="quick__link-title">Courses</div>
                    <ul className="quick__links">
                        {
                            quickLinks02.map((item, index) => (
                                <li className="quick__link-item" key={index}><a href={item.path}> {item.display}</a></li>
                            ))
                        }
                    </ul>
                </div>
                <div className="footer__quick-link">
                    <div className="quick__link-title">Tutorials</div>
                    <ul className="quick__links">
                        {
                            quickLinks03.map((item, index) => (
                                <li className="quick__link-item" key={index}><a href={item.path}> {item.display}</a></li>
                            ))
                        }
                    </ul>
                </div>

            </div>
            <hr className='line'/>
            <div className='team__member-social'>
                <span><button className='socal' onClick={()=> newTab('https://www.youtube.com/@GrowupCode')} ><i class="ri-youtube-line"></i></button></span>

                <span><button className='socal' onClick={()=> newTab('https://www.linkedin.com/company/growup-code/')}> <i class="ri-linkedin-fill"></i></button></span>

                <span><button className='socal' onClick={()=> newTab('https://twitter.com/GrowupCode')}><i class="ri-twitter-line"></i></button></span>

                <span><button className='socal' onClick={()=> newTab('https://www.instagram.com/growupcode/')}><i class="ri-instagram-line"></i></button></span>

                <span><button className='socal' onClick={()=> newTab('https://www.facebook.com/profile.php?id=100091595381812')}><i class="ri-facebook-fill"></i></button></span>
            </div>
            <p className='copyright'>Copyright {Year} , developed by Durgesh Agrhari. All rights reserved</p>
        </div>
    </footer>
    </>
  )
}

export default Footer
