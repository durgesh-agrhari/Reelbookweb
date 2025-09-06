// src/Navigation.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/Header/Header";
import '../App.css';
// Pages
import Homepage from "../components/homepage/Homepage";
import VideoPlayer from "../components/homeVideo/VideoPlayer";
import Category from "../pages/category/Category";
import PrivacyPolicy from "../pages/imppages/PrivacyPolicy";
import Contact from "../pages/imppages/Contact";
import Feedback from "../pages/imppages/Feedback";
import DownloadApp from "../pages/imppages/DownloadApp";
import LoginGoogle from "../pages/auth/LoginGoogle";
import UserProfile from "../pages/profile/UserProfile";

const Navigation = () => {
  const [theme, setTheme] = useState("");
  const toggleTheme = () => {
    setTheme(theme === "" ? "light-theme" : "");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/videoplayer" element={<VideoPlayer />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/DownloadApp" element={<DownloadApp />} />
        <Route path="/LoginGoogle" element={<LoginGoogle />} />
        <Route path="/UserProfile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
