import React from 'react'
import "../style/counter.css"
import { useEffect } from 'react'

const counterData=[
    {
        number: '2.5k+',
        text: 'Videos'
    },
    {
        number: '1.8K+',
        text: 'Posts'
    },
    {
        number: '40+',
        text: 'Categoryes'
    },
    {
        number: '10k+',
        text: 'Users'
    },
]



const Counter = () => {
    useEffect(() => {
        window.scrollTo(0,0)
      }, [])
  return (
    <section className='counter' id='projects'>
        <div className='container'>
            <div className='counter__wrapper'>
                {
                    counterData.map((item, index) => (
                        <div className='counter__item' key={index}>
                        <h3 className='counter__number'>{item.number}</h3>
                        <h3 className='container__title'>{item.text}</h3>
                        </div>
                    )) 
                }
            </div>
        </div>
    </section>
  )
}

export default Counter
