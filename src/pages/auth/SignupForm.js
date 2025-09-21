import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupForm.css";
import backendURL from "../../utils/String";

const SignupForm = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const [fdata, setFdata] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    setErrormsg(null);
    setFdata({ ...fdata, [e.target.name]: e.target.value });
  };

  const SendtoBackend = async () => {
    setLoader(true);

    if (!fdata.name || !fdata.username || !fdata.email || !fdata.password || !fdata.cpassword) {
      setLoader(false);
      setErrormsg("All fields are required");
      return;
    }
    if (fdata.password !== fdata.cpassword) {
      setLoader(false);
      setErrormsg("Password and Confirm Password must be same");
      return;
    }

    try {
      const res = await axios.post(`${backendURL}/signup`, fdata);
      setLoader(false);
      if (res.data.error) {
        setErrormsg(res.data.error);
      } else {
        alert("✅ Account created successfully");
        navigate("/LoginEmail");
      }
    } catch (err) {
      setLoader(false);
      setErrormsg("Something went wrong");
      console.error(err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img
          src="/logo192.png"
          alt="Logo"
          className="signup-logo"
        />

        <h2 className="signup-heading">Signup with Email</h2>
        <p className="signup-subheading">Enter your details to create an account</p>

        {errormsg && <p className="error-text">{errormsg}</p>}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Enter your fullname"
            value={fdata.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={fdata.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={fdata.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group password-group">
          <input
            type={passwordIsVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={fdata.password}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setPasswordIsVisible(!passwordIsVisible)}
          >
            {passwordIsVisible ? "🙈" : "👁"}
          </span>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={fdata.cpassword}
            onChange={handleChange}
          />
        </div>

        <button className="signup-btn" onClick={SendtoBackend} disabled={loader}>
          {loader ? "Creating account..." : "Signup"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/LoginEmail")}>Login</span>
        </p>

        <p className="terms">
          By continuing you agree with <b>Reelbook</b> <br />
          <span onClick={() => navigate("/PrivacyPolicy")} className="terms-link">Terms of Use and Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
