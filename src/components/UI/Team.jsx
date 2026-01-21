import React from 'react'
import "../style/team.css"
import teamImg1 from "../../images/team-1.jpeg"
import teamImg2 from "../../images/team-2.jpeg"
import teamImg3 from "../../images/c1.png"
import { useEffect } from 'react'

const teamMembers = [
    {
        imgUrl: teamImg1,
        imgUrlc: teamImg3,
        name: 'Durgesh Agrhari ',
        position: 'Content Management at Reelbook',
        working: 'Work in @LTTS (SDE1)',
        socal1:'https://www.linkedin.com/in/durgesh-agrhari-b1a4341b4/',
        // socal2: 'https://twitter.com/DurgeshAgrhari1',
        socal3:'https://www.instagram.com/durgeshagrahari11/',
    },
    {
        imgUrl: teamImg2,
        imgUrlc: '',
        name: 'Himanshu Shingh',
        position: 'Manager Director at Reelbook',
        working: 'Work in @Amazon (SDE1)',
        socal1:'https://www.linkedin.com/in/himanshu-626283174/',
        // socal2: 'https://www.linkedin.com/in/himanshu-626283174/',
        socal3:'https://www.instagram.com/___himanshu___singh/',
    },
    // {
    //     imgUrl: teamImg3,
    //     name: 'Curtteny Hurry',
    //     position: 'Product developer',
    // },
    // {
    //     imgUrl: teamImg4,
    //     name: 'Curtteny Hurry',
    //     position: 'Product developer',
    // },
]

const Team = () => {
    // const newTab=url=>{
    //     window.open(url)
    // }

    useEffect(() => {
        window.scrollTo(0,0)
      }, [])
  return (
    <section>
        <div className='container'>
            <div className='team__content'>
                <h6>Our team</h6>
                <h2>Meet with <span className='highlight'>our team</span> </h2>
            </div>

            <div className='team__wrapper'>
                {
                    teamMembers.map((item,index) => (
                        <div className='team__item' key={index}>
                        <div className="team__img">
                            <img className='ceo' src={item.imgUrl} alt="" />
                        </div>
                        <div className="team__details">
                            <h4>{item.name}</h4>
                            <p className="discription">{item.position}</p>
                            <p className="discription">{item.working}</p>
                            <div className="team__img-c">
                                <img className='cc' src={item.imgUrlc} alt="" />
                            </div>

                            <div className='team__member-social'>

                                <span><a className='socal'href={item.socal1} target='blank'> <i class="ri-linkedin-fill"></i></a></span>

                                {/* <span><a className='socal'href={item.socal2} target='blank' ><i class="ri-twitter-line"></i></a></span> */}

                                <span><a className='socal'href={item.socal3} target='blank' ><i class="ri-instagram-line"></i></a></span>
                        </div>
                        </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Team
