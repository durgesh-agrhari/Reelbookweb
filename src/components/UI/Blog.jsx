import React from 'react'
import "../style/blog.css"
import videoImg from "../../images/video.png"
import articleImg from "../../images/article.png"
import caseStudy from "../../images/case-study.png"
import { useEffect } from 'react'

const blogData = [
    {
        imgUrl: videoImg,
        title: 'Video',
        desc: 'To know our work . watch some video f.....',
        linkUrl: "#"
    },
    {
        imgUrl: articleImg,
        title: 'Artical',
        desc: 'To know our work . watch some Articles A.....',
        linkUrl: "#"
    },
    {
        imgUrl: caseStudy,
        title: 'Case Study',
        desc: 'To know our work . watch some Case stydy C.....',
        linkUrl: "#"
    },
]

const Blog = () => {
    
useEffect(() => {
    window.scrollTo(0,0)
  }, [])

  return (
    <section id='blog' className='blog'>
        <div className="container">
            <div className="blog__top-content">
                <h6 className="subtitle">Our Blog</h6>
                <h2>Let's have a look from our <span className='highlight'>recent blog</span></h2>
            </div>

            <div className="blog__wrapper">
                {
                    blogData.map((item, index) => (
                        <div className="blog__item" key={index}>
                        <h3>{item.title}</h3>
                        <div className="blog__img">
                            <img src={item.imgUrl} alt="Blog" />
                        </div>
                        <p className="discription">To know our work . watch sime video f.....</p>
                        <div>
                            <a href={item.linkUrl} className="learn__more"><i class="ri-arrow-right-line"></i></a>
                        </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Blog
