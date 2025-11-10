import React, { useEffect } from 'react';
import '../style/about.css';
import '../style/team.css';

import aboutImg from "../../assets/reelbookbannerabout.png";
import teamImg1 from "../../assets/durgesh.jpeg";
import teamImg2 from "../../assets/ritik.jpeg";
import teamImg4 from "../../assets/hament.png";
import Social from './Social';

const chooseData = [
  {
    icon: 'ri-money-dollar-circle-line',
    title: 'Earn money by watching videos',
    desc: 'Get rewarded while enjoying your favorite content. Watch videos and earn instantly — fun and profit together!',
  },
  {
    icon: 'ri-upload-cloud-line',
    title: 'Earn money by uploading videos',
    desc: 'Share your creativity with the world. Upload your videos and earn based on your views and engagement.',
  },
  {
    icon: 'ri-bank-card-line',
    title: 'Withdraw money anytime',
    desc: 'Withdraw your earnings easily starting from ₹1 or more directly to your account — fast and secure!',
  },
  {
    icon: 'ri-layout-grid-line',
    title: 'Watch videos by category',
    desc: 'Explore content that interests you the most — browse by categories for a personalized entertainment experience.',
  },
];

const teamMembers = [
  {
    imgUrl: teamImg1,
    name: 'Durgesh Agrhari',
    position: 'Founder & CEO of Reelbook',
    working: 'Software Engineer',
    socal1: 'https://www.linkedin.com/in/durgesh-agrhari-b1a4341b4',
    socal2: 'https://x.com/durgeshzone',
    socal3: 'https://www.instagram.com/durgeshzone',
  },
  {
    imgUrl: teamImg2,
    name: 'Ritik Jain',
    position: 'Contributor',
    working: 'Software Engineer',
    socal1: 'https://www.linkedin.com/in/ravishingrj/',
    socal2: '',
    socal3: 'https://www.instagram.com/ravishing_ritik',
  },
  {
    imgUrl: teamImg4,
    name: 'Hemant Singh',
    position: 'Contributor',
    working: 'Google AdMob',
    socal1: '',
    socal2: '',
    socal3: 'https://www.instagram.com/varun2awesome?igsh=Z3dtc3E4NWI2dTBi',
  },
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='aboutus'>
      <section id='about'>
        <div className='container'>
          <div className='about__wrapper'>
            <div className='about__content'>
              <h4 className='subtitle'>Why choose us</h4>
              <h2>Reelbook — India's fastest-growing social media platform</h2>
              <h4 className='highlight' style={{color:'Gold'}}>
                Through Reelbook, <strong style={{color:'green'}}>you can earn money by your activity — a feature not available in any social media platform worldwide!</strong>
              </h4>

              <div>
                {chooseData.map((item, index) => (
                  <div className="choose__us-item" key={index}>
                    <span className='choose__us-icon'><i className={item.icon}></i></span>
                    <div>
                      <h4 className="choose__us-title">{item.title}</h4>
                      <p className="discription">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='about__img'>
              <img src={aboutImg} alt="About Reelbook" />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className='container'>
          <div className='team__content'>
            <h4 style={{color:'gray', margin:'5px'}}>Our Team</h4>
            <h2>Meet <span className='highlight'>Our Amazing Team</span></h2>
          </div>

          <div className='team__wrapper'>
            {teamMembers.map((item, index) => (
              <div className='team__item' key={index}>
                <div className="team__img">
                  <img className='ceo' src={item.imgUrl} alt={item.name} />
                </div>
                <div className="team__details">
                  <h4>{item.name}</h4>
                  <p className="discription">{item.position}</p>
                  <p className="discription">{item.working}</p>

                  <div className='team__member-social'>
                    {item.socal1 && (
                      <span>
                        <a className='socal' href={item.socal1} target='_blank' rel='noreferrer'>
                          <i className="ri-linkedin-fill"></i>
                        </a>
                      </span>
                    )}
                    {item.socal2 && (
                      <span>
                        <a className='socal' href={item.socal2} target='_blank' rel='noreferrer'>
                          <i className="ri-twitter-line"></i>
                        </a>
                      </span>
                    )}
                    {item.socal3 && (
                      <span>
                        <a className='socal' href={item.socal3} target='_blank' rel='noreferrer'>
                          <i className="ri-instagram-line"></i>
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Reelbook Section */}
        <div className='container about__bottom'>
          <h2 className='highlight1'>About Reelbook</h2>
          <p className='discription1'>
            <strong>Reelbook</strong> is a modern social media short video and photo-sharing platform
            that connects creators and viewers in a fun and rewarding way. 
            You can create, watch, and share amazing content — and the best part is,
            <strong> you can earn by your activity — a feature not available in any other social media platform in the world.</strong>
          </p>
        </div>
      </section>
      <Social/>
    </div>
  );
};

export default About;


// import React from 'react'
// import '../style/about.css'
// import { useEffect } from 'react'

// import aboutImg from "../../images/about-us.jpg"
// import "../style/team.css"
// import teamImg1 from "../../assets/durgesh.jpeg"
// import teamImg2 from "../../assets/ritik.jpeg"
// import teamImg3 from "../../images/c1.png"
// import teamImg4 from "../../assets/hament.png"

// const chooseData = [
//   {
//     icon: 'ri-wifi-line',
//     title: 'Earn mony by watching video',
//     desc: 'Making learning easier and more convenient for you. Data Structure. Data structures are the problem - solving pillars of coding.'
//   },
//   {
//     icon: 'ri-team-line',
//     title: 'Earn mony by Uploading video',
//     desc: 'Discovered team is a dynamic group of skilled professionals dedicated to uncovering innovative solutions for our clients.'
//   },
//   {
//     icon: 'ri-time-line',
//     title: 'Withedraw mony ₹1 or more',
//     desc: 'Enjoy round-the-clock access with our 24/7 service, ensuring convenience and support whenever you need it.'
//   },  
//   {
//     icon: 'ri-time-line',
//     title: 'See Video in Category wise',
//     desc: 'Enjoy round-the-clock access with our 24/7 service, ensuring convenience and support whenever you need it.'
//   },  
// ]

// const teamMembers = [
//     {
//         imgUrl: teamImg1,
//         imgUrlc: teamImg3,
//         name: 'Durgesh Agrhari ',
//         position: 'Founder of Reelbook',
//         working: 'Work in @LTTS',
//         socal1:'https://www.linkedin.com/in/durgesh-agrhari-b1a4341b4',
//         socal2: 'https://x.com/durgeshzone',
//         socal3:'https://www.instagram.com/durgeshzone',
//     },
//      {
//         imgUrl: teamImg2,
//         imgUrlc: teamImg3,
//         name: 'Ritik Jain ',
//         position: 'Contributer',
//         working: 'Work in @LTTS',
//         socal1:'https://www.linkedin.com/in/ravishingrj/',
//         socal2: '',
//         socal3:'https://www.instagram.com/ravishing_ritik',
//     },
//      {
//         imgUrl: teamImg4,
//         imgUrlc: teamImg3,
//         name: 'Hemant Singh',
//         position: 'Contributer',
//         working: 'Freelancer',
//         socal1:'',
//         socal2: '',
//         socal3:'',
//     },
// ]

// const About = () => {
//   useEffect(() => {
//     window.scrollTo(0,0)
//   }, [])
//   return (
//     <div className='aboutus'>
//     <section id='about'>
//         <div className='container'>
//             <div className='about__wrapper'>
//                 <div className='about__content'>
//                 <h4 className='subtitle'>Why choose us</h4>
//                 <h2>Reelbook is fastest growing social media plateform in india</h2>
//                 <h4 className='highlight'>through Reelbook app you can earn mony by waching video</h4>
//                 {/* <p className='discription about__content-desc'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo consequatur amet quibusdam placeat.</p> */}

//                 <div>
//                   {
//                     chooseData.map((item, index) => (
//                       <div className="choose__us-item" key={index}>
//                       <span className='choose__us-icon'><i class={item.icon}></i></span>
//                       <div>
//                         <h4 className="choose__us-title">{item.title}</h4>
//                         <p className="discription">{item.desc}</p>
//                       </div>
//                       </div>
//                     ))
//                   }
//                 </div>
//                 </div>
//                 <div className='about__img'>
//                   <img src={aboutImg} alt="" />
//                 </div>
//             </div>
//         </div>
//           <div className='container'>
//             <div className='team__content'>
//                 <h4>Our team</h4>
//                 <h2>Meet with <span className='highlight'>our team</span> </h2>
//             </div>

//             <div className='team__wrapper'>
//                 {
//                     teamMembers.map((item,index) => (
//                         <div className='team__item' key={index}>
//                         <div className="team__img">
//                             <img className='ceo' src={item.imgUrl} alt="" />
//                         </div>
//                         <div className="team__details">
//                             <h4>{item.name}</h4>
//                             <p className="discription">{item.position}</p>
//                             <p className="discription">{item.working}</p>
//                             {/* <div className="team__img-c">
//                                 <img className='cc' src={item.imgUrlc} alt="" />
//                             </div> */}

//                             <div className='team__member-social'>

//                                 <span><a className='socal'href={item.socal1} target='blank'> <i class="ri-linkedin-fill"></i></a></span>

//                                 <span><a className='socal'href={item.socal2} target='blank' ><i class="ri-twitter-line"></i></a></span>

//                                 <span><a className='socal'href={item.socal3} target='blank' ><i class="ri-instagram-line"></i></a></span>
//                         </div>
//                         </div>
//                         </div>
//                     ))
//                 }
//             </div>
//         </div>
//     </section>
//     </div>
//   )
// }

// export default About
