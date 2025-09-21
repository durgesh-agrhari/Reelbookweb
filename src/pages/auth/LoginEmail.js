import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import "../../components/style/GoogleLogin.css";
import { useDispatch } from "react-redux";
import { fetchUserData, setAuthData } from "../../redux/AuthSlice";

const LoginEmail = () => {
  const { loginWithEmail, loginWithGoogle, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [fdata, setFdata] = useState({ email: "", password: "" });
  const [errormsg, setErrormsg] = useState("");
  const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Handle Email Login
  async function handleEmailLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrormsg("");

    if (!fdata.email || !fdata.password) {
      setErrormsg("All fields are required");
      setLoading(false);
      return;
    }

    const result = await loginWithEmail(fdata);
    dispatch(setAuthData(token));
    dispatch(fetchUserData(token));
    setLoading(false);

    if (result.success) {
      navigate("/UserProfile");
    } else {
      setErrormsg(result.message);
    }
  }

  // ✅ Handle Google Login
  async function handleGoogleLogin() {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate("/UserProfile");
    } else {
      setErrormsg(result.message);
    }
  }

  return (
    <section className="hero__section">
      <div className="container">
        <div className="hero__wrapper">
          <div className="hero__content">
            <div className="left1">
              <h2>Download Reelbook App</h2>
              <h2>Enjoy 40+ Short video Category</h2>
              <h3 className="highlight">Be Motivated</h3>
            </div>
            <br />
            <p className="discription">Find your interest video on Reelbook</p>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                alt="Play Store"
                style={{ width: "150px", height: "40px", borderRadius: "10px" }}
              />
            </button>
          </div>

          <div className="right12">
            <div style={{ backgroundColor: "#1a1e24", padding: 40, borderRadius: 20 }}>
              <h3 className="highlight1">Login with Email</h3>

              {errormsg && <p style={{ color: "red" }}>{errormsg}</p>}

              <form onSubmit={handleEmailLogin}>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={fdata.email}
                  onChange={(e) => setFdata({ ...fdata, email: e.target.value })}
                  style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
                />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={fdata.password}
                  onChange={(e) => setFdata({ ...fdata, password: e.target.value })}
                  style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
                />

                <button type="submit" disabled={loading} style={{ borderRadius: "10px", padding: "10px 20px",width: '100%', backgroundColor:'green' , color:'white', fontSize:'16px', alignSelf:'center'}}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p style={{ marginTop: "15px", color: "white" }}>
                Don’t have an account?{"  "}
              </p>

              <button type="submit" onClick={() => navigate("/SignupForm")} style={{ borderRadius: "10px", padding: "10px 20px",width: '100%', backgroundColor:'gray' , color:'white', fontSize:'16px', alignSelf:'center', marginTop:'10px'}}>
                  Signup
                </button>

                 <p style={{ marginTop: "15px", color: "white" }}>
                Forget Password ? {" "}
                <span style={{ color: "orange", fontSize:'11px' }}> || Password you can change in mobile app only </span>
              </p>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LoginEmail;


// import React, { useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../../context/AppContext";
// import "../../components/style/GoogleLogin.css";

// const LoginEmail = () => {
//   const { login } = useContext(AppContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);


// async function handleLogin() {
//   try {
//     const user = await login();
//     console.log("✅ Logged in user:", user);
//     navigate("/UserProfile");
//   } catch (error) {
//     console.error("❌ Login failed:", error);
//   }
// }



//   return (
//     <section className="hero__section">
//       <div className="container">
//         <div className="hero__wrapper">
//           <div className="hero__content">
//             <div className="left1">
//               <h2>Download Reelbook App</h2>
//               <h2>Enjoy 40+ Short video Category</h2>
//               <h3 className="highlight">Be Motivated</h3>
//             </div>
//             <br />
//             <p className="discription">Find your interest video on Reelbook</p>
//             <button className="google-btn">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
//                 alt="Play Store"
//                 style={{ width: "150px", height: "40px", borderRadius: "10px" }}
//               />
//             </button>
//           </div>
                       

//           <div className="right12">
//             <div style={{ backgroundColor: "#1a1e24", padding: 80, borderRadius: 20 }}>
//               <h3 className="highlight1">Login with Email</h3>
//               <div className="hero__btns">
//                 <button style={{ borderRadius: "10px" }} onClick={handleLogin}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                       textDecoration: "none",
//                       color: "inherit",
//                     }}
//                   >
//                     {/* add here emali and password field for login */}
//                    <h3 style={{padding:10}}>Login</h3>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginEmail;

