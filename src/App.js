import './App.css';
import React, {useState, useEffect} from 'react'; //4.5k (gzipped: 2k)
// import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
// import Homepage from './homepage/Homepage';



//import ReactGA from "react-ga"; //14.8k (gzipped: 4.9k)
import ReactGA from "react-ga4";


import Homepage from './components/homepage/Homepage';
import VideoPlayer from './components/homeVideo/VideoPlayer';
// import VideoPlayer from './components/homeVideo/VideoPlayer';



const TRACKING_ID = "G-PE3WVLWX2S"; //
ReactGA.initialize(TRACKING_ID);
// ReactGA.pageview(document.location.pathname);


function App() {

  const [theme, setTheme] = useState('')
  const toggleTheme = () => {
    theme === '' ? setTheme('light-theme') : setTheme('')
  }

  useEffect(() => {
    document.body.className = theme
  }, [theme])


  //This is helpes to send page view to google analisis
  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname);
  // },[])

  return (
    <>
     <Router>
      <Header theme={theme} toggleTheme={toggleTheme} /> 
        <Routes>

          {/* ========= Pages ============== */}
          <Route path='/' element = {<Homepage/> }/>
          <Route path="/videoplayer" element={<VideoPlayer />} />
          
        </Routes>
      </Router>
      {/* <Footer/> */}
    </>
  );
}

export default App;