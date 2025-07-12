import React from 'react'
import '../style/about.css'
import { useEffect } from 'react'

import aboutImg from "../../images/about-us.jpg"

const chooseData = [
  {
    icon: 'ri-wifi-line',
    title: 'First working process',
    desc: 'Making learning easier and more convenient for you. Data Structure. Data structures are the problem - solving pillars of coding.'
  },
  {
    icon: 'ri-team-line',
    title: 'Discovered team',
    desc: 'Discovered team is a dynamic group of skilled professionals dedicated to uncovering innovative solutions for our clients.'
  },
  {
    icon: 'ri-time-line',
    title: '24/7 times access',
    desc: 'Enjoy round-the-clock access with our 24/7 service, ensuring convenience and support whenever you need it.'
  },  
]



const About = () => {
  useEffect(() => {
    window.scrollTo(0,0)
  }, [])
  return (
    <section id='about'>
        <div className='container'>
            <div className='about__wrapper'>
                <div className='about__content'>
                <h6 className='subtitle'>Why choose us</h6>
                <h2>Speciliest in aviding client on</h2>
                <h2 className='highlight'>financial challenges</h2>
                {/* <p className='discription about__content-desc'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo consequatur amet quibusdam placeat.</p> */}

                <div>
                  {
                    chooseData.map((item, index) => (
                      <div className="choose__us-item" key={index}>
                      <span className='choose__us-icon'><i class={item.icon}></i></span>
                      <div>
                        <h4 className="choose__us-title">{item.title}</h4>
                        <p className="discription">{item.desc}</p>
                      </div>
                      </div>
                    ))
                  }
                </div>
                </div>
                <div className='about__img'>
                  <img src={aboutImg} alt="" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default About
