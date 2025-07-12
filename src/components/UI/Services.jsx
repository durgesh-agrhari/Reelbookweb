import React from 'react'
import "../style/services.css"
import { useEffect } from 'react'

const serviceData = [
    {
        icon: 'ri-apps-line',
        title: 'DSA Course',
        desc: 'Data structures are the problem-solving pillars of coding. Learn all the foundational knowledge about all of the popular data structure that you need.',
        link: "https://growupcode.com/array-basic-questions"
    },
    {
        icon: 'ri-code-s-slash-line',
        title: 'Web Deelopment',
        desc: 'Get access to hand-picked coding interview questions across categories & difficulty levels that will prepare you for every interview you would encounter.',
        link: "https://growupcode.com/web-development"
    },
    {
        icon: 'ri-store-3-line',
        title: 'Job Search',
        desc: 'Ace the placement interviews by being knowledgeable in all well-known data structures, popular problem-solving methods, and core computer sciences.',
        link: "https://growupcode.com/job-home"
    },
    {
        icon: 'ri-bar-chart-2-line',
        title: 'Video Tutorials',
        desc: 'Learn in-depth conceptual overviews, how to approach an algorithm, how to implement it & how to optimize it.Learn new concepts daily & productivity.',
        link: "https://growupcode.com/soon"
    },
]

const Services = () => {
    useEffect(() => {
        window.scrollTo(0,0)
      }, [])
  return (
    <section className='service' id='service'>
        <div className='container'>
            <div className='service__top-content'>
                <h6 className='subtitle'> Our Services</h6>
                <h2>Save time manage your coding skills with</h2>
                <h2 className='highlight'>Our best services</h2>
            </div>

            <div className='service__item-wrapper'>
                {
                    serviceData.map((item, index) => (
                        <div className='service__item' key={index}>
                        <a href={item.link} target='blank'>
                        <span className='service__icon'><i class={item.icon}></i></span>
                        <h3 className='service__title'>{item.title}</h3>
                        <p className='discription'>{item.desc}</p>
                        </a>
                        </div>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Services
