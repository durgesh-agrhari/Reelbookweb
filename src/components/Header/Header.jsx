import React, { useEffect, useRef, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Style.css';
import Logo1 from '../../assets/logo123.png';
import { AppContext } from '../../context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, setAuthData } from '../../redux/AuthSlice';
import backendURL, { Notification } from '../../utils/String';

const Header = ({ theme, toggleTheme }) => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, token } = useContext(AppContext);

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);

  // ✅ Load token & user data into Redux
  useEffect(() => {
    if (token) {
      dispatch(setAuthData(token));
      dispatch(fetchUserData(token));
    }
  }, [token, dispatch]);

  // ✅ Fetch Notifications
  useEffect(() => {
    if (userData?._id) fetchNotifications();
  }, [userData]);

  const fetchNotifications = async () => {
    const userId = userData?._id;
    if (!userId) return;
    try {
      const response = await fetch(`${backendURL}${Notification}${userId}`);
      const data = await response.json();
      const notifList = data?.data || [];
      setNotifications(notifList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const headerFunc = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      headerRef.current.classList.add('header__shrink');
    } else {
      headerRef.current.classList.remove('header__shrink');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', headerFunc);
    return () => window.removeEventListener('scroll', headerFunc);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('menu__active');

  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="nav_wrappe">
          {/* ===== Logo ===== */}
          <div className="logo">
            <NavLink to="/" className="menu__link">
              <h2>
                <img
                  src={Logo1}
                  width="30"
                  height="30"
                  className="logo1"
                  alt="logo"
                />{' '}
                Reelbook
              </h2>
            </NavLink>
          </div>

          {/* ===== Navigation ===== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu">
              <li className="menu__item">
                <NavLink
                  to="/DownloadApp"
                  className={({ isActive }) =>
                    isActive
                      ? 'menu__link navactive download__link'
                      : 'menu__link download__link'
                  }
                >
                  Download App
                </NavLink>
              </li>

              <li className="menu__item">
                <NavLink
                  to="/ShowPosts"
                  className={({ isActive }) =>
                    isActive ? 'menu__link navactive' : 'menu__link'
                  }
                >
                  Posts
                </NavLink>
              </li>

              <li className="menu__item">
                <NavLink
                  to="/Category"
                  className={({ isActive }) =>
                    isActive ? 'menu__link navactive' : 'menu__link'
                  }
                >
                  Category
                </NavLink>
              </li>

              <li className="menu__item">
                <NavLink
                  to="/AllUsers"
                  className={({ isActive }) =>
                    isActive ? 'menu__link navactive' : 'menu__link'
                  }
                >
                  All Users
                </NavLink>
              </li>

              {/* ===== More Dropdown (Desktop) ===== */}
              <li className="menu__item dropdown desktop-only">
                <span className="menu__link" style={{color:'rgb(14, 107, 238)'}}>More ▾</span>
                
                <ul className="dropdown__menu">
                  <li>
                    <NavLink to="/EarningInfo" className="dropdown__link">
                      Earning Guid
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/PrivacyPolicy" className="dropdown__link">
                      Privacy & Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Contact" className="dropdown__link">
                      Contact Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Feedback" className="dropdown__link">
                      Feedback
                    </NavLink>
                  </li>
                   <li>
                    <NavLink to="/About" className="dropdown__link">
                       About Us
                    </NavLink>
                  </li>

                 
                </ul>
              </li>

              {/* ===== Mobile-only Items ===== */}
              <li className="menu__item mobile-only">
                <NavLink to="/EarningInfo" className="menu__link">
                  Earning Guid
                </NavLink>
              </li>
              <li className="menu__item mobile-only">
                <NavLink to="/PrivacyPolicy" className="menu__link">
                  Privacy & Policy
                </NavLink>
              </li>
              <li className="menu__item mobile-only">
                <NavLink to="/Contact" className="menu__link">
                  Contact Us
                </NavLink>
              </li>
              <li className="menu__item mobile-only">
                <NavLink to="/Feedback" className="menu__link">
                  Feedback
                </NavLink>
              </li>
                 <li className="menu__item mobile-only">
                <NavLink to="/About" className="menu__link">
                  About Us
                </NavLink>
              </li>
                 

              {/* ===== Conditional User Section ===== */}
              {!user ? (
                <li className="menu__item">
                  <NavLink
                    to="/LoginGoogle"
                    className={({ isActive }) =>
                      isActive ? 'menu__link navactive' : 'menu__link'
                    }
                  >
                    Login
                  </NavLink>
                </li>
              ) : (
                <>
                  {/* ✅ Notification Tab with Badge */}
                  <li className="menu__item">
                    <NavLink
                      to="/Activity"
                      className={({ isActive }) =>
                        isActive ? 'menu__link navactive' : 'menu__link'
                      }
                    >
                      <div className="icon-with-badge">
                        <span className="notification-icon">🔔</span>
                        {notifications.length > 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '14px',
                              right: '-20px',
                              backgroundColor: 'red',
                              color: 'white',
                              borderRadius: '50%',
                              padding: '2px 6px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              lineHeight: '1',
                              minWidth: '20px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            {notifications.length > 99 ? '99+' : notifications.length}
                          </span>
                        )}

                      </div>
                    </NavLink>
                  </li>

                  {/* ✅ Profile Tab */}
                  <li className="menu__item">
                    <NavLink
                      to="/UserProfile"
                      className={({ isActive }) =>
                        isActive ? 'menu__link navactive' : 'menu__link'
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <img
                        src={
                          userData?.profilePic ||
                          'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'
                        }
                        alt="Profile"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* ===== Light/Dark Toggle ===== */}
          <div className="light__mode">
            <span onClick={toggleTheme}>
              {theme === 'light-theme' ? (
                <span>
                  <i className="ri-moon-line"></i> Dark
                </span>
              ) : (
                <span>
                  <i className="ri-sun-line"></i> Light
                </span>
              )}
            </span>
          </div>

          {/* ===== Mobile Menu Icon ===== */}
          <span className="mobile__menu" onClick={toggleMenu}>
            <i className="ri-menu-line"></i>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;


// import React, { useEffect, useRef, useContext } from 'react'
// import { NavLink } from 'react-router-dom'
// import './Style.css'
// import Logo1 from '../.././assets/logo123.png'
// import { AppContext } from '../../context/AppContext'   // ⬅️ import context
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchUserData, setAuthData } from '../../redux/AuthSlice'

// const Header = ({ theme, toggleTheme }) => {
//   const headerRef = useRef(null)
//   const menuRef = useRef(null)
//   const { user, token } = useContext(AppContext)   // ⬅️ get user from context

//   const dispatch = useDispatch();

//   // ✅ Load token & user data into Redux
//   useEffect(() => {
//     if (token) {
//       dispatch(setAuthData(token));
//       dispatch(fetchUserData(token));
//     }
//   }, [token, dispatch]);


//   // ✅ Get user data from Redux
//   const { userData } = useSelector((state) => state.auth);


//   const headerFunc = () => {
//     if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
//       headerRef.current.classList.add('header__shrink')
//     } else {
//       headerRef.current.classList.remove('header__shrink')
//     }
//   }

//   useEffect(() => {
//     window.scrollTo(0, 0)
//     window.addEventListener('scroll', headerFunc)
//     return () => window.removeEventListener('scroll', headerFunc)
//   }, []);

//   const toggleMenu = () => menuRef.current.classList.toggle('menu__active')

//   return (
//     <header className='header' ref={headerRef}>
//       <div className='container'>
//         <div className='nav_wrappe'>
//           <div className='logo'>
//             <NavLink to='/' className='menu__link'>
//               <h2>
//                 <img src={Logo1} width='30' height='30' className='logo1' alt='logo' /> Reelbook
//               </h2>
//             </NavLink>
//           </div>

//           {/* ======== navigation ====== */}
//           <div className='navigation' ref={menuRef} onClick={toggleMenu}>
//             <ul className='menu'>
//               {/* <li className='menu__item'>
//                 <NavLink to='/' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Home</NavLink>
//               </li> */}

//               <li className='menu__item'>
//                 <NavLink to='/DownloadApp' className={({ isActive }) => isActive ? 'menu__link navactive download__link' : 'menu__link download__link'}>
//                   Download App
//                 </NavLink>
//               </li>

//               <li className='menu__item'>
//                 <NavLink to='/ShowPosts' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Posts</NavLink>
//               </li>

//               <li className='menu__item'>
//                 <NavLink to='/Category' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Category</NavLink>
//               </li>

//               <li className='menu__item'>
//                 <NavLink to='/AllUsers' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>All Users</NavLink>
//               </li>



//               {/* <li className='menu__item'>
//                 <NavLink to='/Feedback' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Feedback</NavLink>
//               </li> */}

//               {/* <li className="menu__item dropdown">
//                 <span className="menu__link">More ▾</span>
//                 <ul className="dropdown__menu">
//                   <li>
//                     <NavLink to="/PrivacyPolicy" className="dropdown__link">Privacy & Policy</NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/Contact" className="dropdown__link">Contact Us</NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/Feedback" className="dropdown__link">Feedback</NavLink>
//                   </li>
//                 </ul>
//               </li> */}

//               <li className="menu__item dropdown desktop-only">
//                 <span className="menu__link">More ▾</span>
//                 <ul className="dropdown__menu">
//                   <li>
//                     <NavLink to="/PrivacyPolicy" className="dropdown__link">Privacy & Policy</NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/Contact" className="dropdown__link">Contact Us</NavLink>
//                   </li>
//                   <li>
//                     <NavLink to="/Feedback" className="dropdown__link">Feedback</NavLink>
//                   </li>
//                 </ul>
//               </li>

//               {/* Mobile-only version (no dropdown, just normal items) */}
//               <li className="menu__item mobile-only">
//                 <NavLink to="/PrivacyPolicy" className="menu__link">Privacy & Policy</NavLink>
//               </li>
//               <li className="menu__item mobile-only">
//                 <NavLink to="/Contact" className="menu__link">Contact Us</NavLink>
//               </li>
//               <li className="menu__item mobile-only">
//                 <NavLink to="/Feedback" className="menu__link">Feedback</NavLink>
//               </li>



//               {/* 👇 Conditional Menu */}
//               {!user ? (
//                 <li className='menu__item'>
//                   <NavLink to='/LoginGoogle' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Login</NavLink>
//                 </li>
//               ) : (
//                 // <li className='menu__item'>
//                 //   <NavLink to='/UserProfile' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Profile</NavLink>
//                 // </li>
//                 <li className='menu__item'>
//                   <NavLink
//                     to='/UserProfile'
//                     className={({ isActive }) =>
//                       isActive ? 'menu__link navactive' : 'menu__link'
//                     }
//                     style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
//                   >
//                     {/* Profile Image */}
//                     <img
//                       src={userData?.profilePic || 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'}
//                       alt="Profile"
//                       onError={(e) => {
//                         e.target.onerror = null; // prevent infinite loop
//                         e.target.src =
//                           'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';
//                       }}
//                       style={{
//                         width: '30px',
//                         height: '30px',
//                         borderRadius: '50%',
//                         objectFit: 'cover',
//                       }}
//                     />

//                     {/* Profile Text */}
//                     <span>Profile</span>
//                   </NavLink>
//                 </li>

//               )}


//               <li className='menu__item'>
//                 <NavLink to='/Activity' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>🔕</NavLink>
//               </li>
//             </ul>
//           </div>

//           {/* ========== light/dark mode ========= */}
//           <div className='light__mode'>
//             <span onClick={toggleTheme}>
//               {theme === 'light-theme'
//                 ? (<span><i className="ri-moon-line"></i> Dark</span>)
//                 : (<span><i className="ri-sun-line"></i> Light</span>)
//               }
//             </span>
//           </div>

//           <span className="mobile__menu" onClick={toggleMenu}>
//             <i className="ri-menu-line"></i>
//           </span>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header


// import React, { useEffect, useRef } from 'react'
// import { NavLink } from 'react-router-dom'
// import './Style.css'

// import Logo1 from '../.././assets/logo123.png'

// const Header = ({ theme, toggleTheme }) => {

//     const headerRef = useRef(null)

//     const menuRef = useRef(null)

//     const headerFunc = () => {
//         if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
//             headerRef.current.classList.add('header__shrink')
//         } else {
//             headerRef.current.classList.remove('header__shrink')
//         }
//     }
//     useEffect(() => {
//         window.scrollTo(0, 0)
//         window.addEventListener('scroll', headerFunc)

//         return () => window.removeEventListener('scroll', headerFunc)
//     }, []);

//     const toggleMenu = () => menuRef.current.classList.toggle('menu__active')

//     return (
//         <header className='header' ref={headerRef} >
//             <div className='container'>
//                 <div className='nav_wrappe'>
//                     <div className='logo'>
//                         <NavLink to='/' className='menu__link'><h2> <img src={Logo1} width='30' height='30' className='logo1' alt='logo' /> Reelbook</h2></NavLink>
//                     </div>

//                     {/* ======== navigation ====== */}
//                     <div className='navigation' ref={menuRef} onClick={toggleMenu}>
//                         <ul className='menu'>
//                             <li className='menu__item'>
//                                 <NavLink to='/' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Home</NavLink>
//                             </li>
//                              {/* <li className='menu__item'>
//                                 <NavLink to='/videoplayer' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Play</NavLink>
//                             </li> */}
//                             <li className='menu__item'>
//                                 <NavLink to='/DownloadApp' className={({ isActive }) => isActive ? 'menu__link navactive download__link' : 'menu__link download__link'}>
//                                     Download App
//                                 </NavLink>
//                             </li>
//                             <li className='menu__item'>
//                                 <NavLink to='/Category' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Category</NavLink>
//                             </li>
//                             <li className='menu__item'>
//                                 <NavLink to='/PrivacyPolicy' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Privacy & Policy</NavLink>
//                             </li>
//                             <li className='menu__item'>
//                                 <NavLink to='/Contact' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Contact Us</NavLink>
//                             </li>
//                             <li className='menu__item'>
//                                 <NavLink to='/Feedback' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Feedback</NavLink>
//                             </li>
//                               <li className='menu__item'>
//                                 <NavLink to='/LoginGoogle' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Login</NavLink>
//                             </li>
//                               <li className='menu__item'>
//                                 <NavLink to='/UserProfile' className={({ isActive }) => isActive ? 'menu__link navactive' : 'menu__link'}>Profile</NavLink>
//                             </li>
//                         </ul>

//                     </div>

//                     {/* ========== light mode ========= */}
//                     <div className='light__mode'>
//                         <span onClick={toggleTheme} >
//                             {
//                                 theme === 'light-theme' ? (<span><i class="ri-moon-line"></i>Dark</span>) : (<span><i class="ri-sun-line"></i>Light</span>)
//                             }
//                         </span>
//                     </div>

//                     <span className="mobile__menu" onClick={toggleMenu}>
//                         <i class="ri-menu-line">
//                         </i></span>
//                 </div>
//             </div>
//         </header>
//     )
// }

// export default Header




















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
