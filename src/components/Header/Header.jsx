import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import './Style.css'

import Logo1 from '../.././assets/logo123.png'

const Header = ({ theme, toggleTheme }) => {

    const headerRef = useRef(null)

    const menuRef = useRef(null)

    const headerFunc = () => {
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headerRef.current.classList.add('header__shrink')
        } else {
            headerRef.current.classList.remove('header__shrink')
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
        window.addEventListener('scroll', headerFunc)

        return () => window.removeEventListener('scroll', headerFunc)
    }, []);

    const toggleMenu = () => menuRef.current.classList.toggle('menu__active')

    return (
        <header className='header' ref={headerRef} >
            <div className='container'>
                <div className='nav_wrappe'>
                    <div className='logo'>
                        <NavLink to='/' className='menu__link'><h2> <img src={Logo1} width='30' height='30' className='logo1' alt='logo' /> Reelbook</h2></NavLink>
                    </div>

                    {/* ======== navigation ====== */}
                    <div className='navigation' ref={menuRef} onClick={toggleMenu}>
                        <ul className='menu'>
                            <li className='menu__item'>
                                <NavLink to='/' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Home</NavLink>
                            </li>
                             {/* <li className='menu__item'>
                                <NavLink to='/videoplayer' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Play</NavLink>
                            </li> */}
                            <li className='menu__item'>
                                <NavLink to='/DownloadApp' className={({ isActive }) => isActive ? 'menu__link navactive download__link' : 'menu__link download__link'}>
                                    Download App
                                </NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink to='/Category' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Category</NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink to='/PrivacyPolicy' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Privacy & Policy</NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink to='/Contact' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Contact Us</NavLink>
                            </li>
                            <li className='menu__item'>
                                <NavLink to='/Feedback' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Feedback</NavLink>
                            </li>
                        </ul>

                    </div>

                    {/* ========== light mode ========= */}
                    <div className='light__mode'>
                        <span onClick={toggleTheme} >
                            {
                                theme === 'light-theme' ? (<span><i class="ri-moon-line"></i>Dark</span>) : (<span><i class="ri-sun-line"></i>Light</span>)
                            }
                        </span>
                    </div>

                    <span className="mobile__menu" onClick={toggleMenu}>
                        <i class="ri-menu-line">
                        </i></span>
                </div>
            </div>
        </header>
    )
}

export default Header




















// import React, { useEffect, useRef } from 'react'
// import './Style.css'

// const nav__links = [
//     {
//         path:'#',
//         display:'Home'
//     },
//     {
//         path:'#dataStructure',
//         display:'DataStructure'
//     },

//     {
//         path:'#about',
//         display:'About'
//     },
//     {
//         path:'#service',
//         display:'Service'
//     },
//     {
//         path:'#projects',
//         display:'Projects'
//     },
//     {
//         path:'#blog',
//         display:'Blog'
//     },

// ]

// const Header = ({ theme, toggleTheme }) => {

//     const headerRef = useRef(null)

//     const menuRef = useRef(null)

//     const headerFunc = () => {
//         if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80 ){
//             headerRef.current.classList.add('header__shrink')
//         }else{
//             headerRef.current.classList.remove('header__shrink')
//         }
//     }

//     useEffect(() => {
//         window.addEventListener('scroll', headerFunc)

//         return ()=> window.removeEventListener('scroll', headerFunc)
//  } ,[]);

// //  const handleClick = e => {
// //     e.preventDefault()
// //     const targetAttr = e.target.getAttribute('href')
// //     const location = document.querySelector(targetAttr).offsetTop;

// //     window.scrollTop({
// //         left:0,
// //         top: location-80,
// //     });
// //  }

//    const toggleMenu = () => menuRef.current.classList.toggle('menu__active')

//   return (
//     <header className='header' ref={headerRef} >
//         <div className='container'>
//             <div className='nav_wrappe'>
//                 <div className='logo'>
//                     <h2>Reelbook</h2>
//                 </div>

//                 {/* ======== navigation ====== */}
//                 <div className='navigation' ref={menuRef} onClick={toggleMenu}>
//                     <ul className='menu'>
//                         {nav__links.map((item, index) => (
//                             <li className='menu__item' key={index}><a href={item.path} className='menu__link'>{item.display}</a></li>
//                         ))}
//                     </ul> 
//                 </div>

//                 {/* ========== light mode ========= */}
//                 <div className='light__mode'>
//                     <span onClick={toggleTheme} >
//                         {
//                         theme === 'light-theme' ? (<span><i class="ri-moon-line"></i>Dark</span>) : (<span><i class="ri-sun-line"></i>Light</span>)
//                         }
//                     </span>
//                 </div>

//                 <span className="mobile__menu" onClick={toggleMenu}>
//                     <i class="ri-menu-line">
//                 </i></span>
//             </div>
//         </div>
//     </header>
//   )
// }

// export default Header
