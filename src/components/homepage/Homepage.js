import React from 'react'
import Counter from '../UI/Counter'
import { useState, useEffect } from 'react';
import HomeVideo from '../homeVideo/HomeVideo'
import AutoCarousel from '../caresolePage/AutoCarousel';
import Social from '../UI/Social';
import './homepage.css';

const Homepage = () => {
  const [theme] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.className = theme
  }, [theme])

  return (
    <div>
      <div className='hight' />
      <AutoCarousel />
      <div className='hight1'/>
      <h2 className='heading' style={{paddingTop:'20px'}}>Reelbook feed videos</h2>
      <HomeVideo />
      <Counter />
      <Social />
    </div>
  )
}

export default Homepage
