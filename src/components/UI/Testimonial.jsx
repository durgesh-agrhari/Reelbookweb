import React from 'react'
import "../style/testimonial.css"
import { useEffect } from 'react'

import Slider from 'react-slick'

import ava01 from "../../images/ava-1.jpg"
import ava02 from "../../images/ava-2.jpg"
import ava03 from "../../images/ava-3.jpg"

const Testimonial = () => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay:true,
        autoplaySpeed:3000,
        slidesToShow:1,
        slidesToScroll:1,
        swipeToSlide:true,
    };
    useEffect(() => {
        window.scrollTo(0,0)
      }, [])
  return (
    <section>
        <div className="container">
            <div className="slider__content-top">
                <h6 className='subtitle'>Testimonials</h6>
                <h2>Trusted by more than {" "}<span className='highlight'>5,000 Customers</span></h2>
            </div>
            <div className="slider__wrapper">
                <Slider {...settings}>
                    <div className='slider__item'>
                        <p className="discription1">Best DSA paid Course one could ever come across online. Affordable but got delivered more than that what it costed. Variety of question top notch Definitely better than those costing 20-25 K.</p>

                        <div className="customer__details">
                            <div className="customer__img">
                                <img src={ava01} alt="testimonial" />
                            </div>
                            <div>
                                <h5 className='customer__name'>Aprub Goyal</h5>
                                <p className="discription">CS Branch</p>
                            </div>
                        </div>
                    </div>

                    <div className='slider__item'>
                        <p className="discription1">This was the best, course I ever completed. You won't believe I'm graduating from BBA, but his teaching made me start loving coding. Now just because of this course I am looking for a job in IT.</p>

                        <div className="customer__details">
                            <div className="customer__img">
                                <img src={ava02} alt="testimonial" />
                            </div>
                            <div>
                                <h5 className='customer__name'>Riya viakal </h5>
                                <p className="discription">IT Branch</p>
                            </div>
                        </div>
                    </div>

                    <div className='slider__item'>
                        <p className="discription1">Reelbook played a very important role during my placement session. All the lectures of placement related subjects like DSA OS, DBMS were available there.</p>

                        <div className="customer__details">
                            <div className="customer__img">
                                <img src={ava03} alt="testimonial" />
                            </div>
                            <div>
                                <h5 className='customer__name'>Rohan Goyal</h5>
                                <p className="discription">CSE Brnach</p>
                            </div>
                        </div>
                    </div>

                </Slider>
            </div>
        </div>
    </section>
  )
}

export default Testimonial
