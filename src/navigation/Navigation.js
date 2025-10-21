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
import ReelPost from "../pages/newpost/ReelPost";
import PhotoPost from "../pages/newpost/PhotoPost";
import StoryPost from "../pages/newpost/StoryPost";
import LoginEmail from "../pages/auth/LoginEmail";
import SignupForm from "../pages/auth/SignupForm";
import AllUsers from "../pages/allUsers/AllUsers";
import FriendUserProfile from "../pages/allUsers/FriendUserProfile";
import ShowPosts from "../pages/postPage/ShowPosts";
import DeleteUser from "../pages/profile/DeleteUser";
import ReelPostByLink from "../pages/newpost/ReelPostByLink";
import LinkDownloader from "../pages/LinkDownloader";
import Activity from "../pages/activity/Activity";
import EarningDashboard from "../pages/earning/EarningDashboard.js";
import EarningHistory from "../pages/earning/EarningHistory.js";
import EarningActivity from "../pages/earning/EarningActivity.js";
import EarningInfo from "../pages/imppages/EarningInfo.js";

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
        <Route path="/ReelPost" element={<ReelPost />} />
        <Route path="/PhotoPost" element={<PhotoPost />} />
        <Route path="/StoryPost" element={<StoryPost />} />
        <Route path="/LoginEmail" element={<LoginEmail />} />
        <Route path="/SignupForm" element={<SignupForm />} />
        <Route path="/AllUsers" element={<AllUsers/>} />
        <Route path="/ShowPosts" element={<ShowPosts/>} />
        <Route path="/DeleteUser/:id" element={<DeleteUser/>} />
        <Route path="/user/:id" element={<FriendUserProfile />} />
        <Route path="/ReelPostByLink" element={<ReelPostByLink />} />
        <Route path="/LinkDownloader" element={<LinkDownloader />} />
        <Route path="/Activity" element={<Activity />} />
        <Route path="/EarningDashboard" element={<EarningDashboard />} />
        <Route path="/EarningHistory" element={<EarningHistory />} />
        <Route path="/EarningActivity" element={<EarningActivity />} />
        <Route path="/EarningInfo" element={<EarningInfo />} />

      </Routes>
    </Router>
  );
};

export default Navigation;
