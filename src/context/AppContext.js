// AppContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebaseConfig/Config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import backendURL from "../utils/String";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState("light");


  // ✅ Restore from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ✅ Email + Password login
  const loginWithEmail = async (fdata) => {
    try {
      const res = await fetch(`${backendURL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fdata),
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        const loggedInUser = data.user || { email: fdata.email };

        setUser(loggedInUser);
        setToken(data.data);

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("authToken", data.data);

        return { success: true };
      } else {
        throw new Error(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Email login failed:", err);
      return { success: false, message: err.message };
    }
  };

  // ✅ Google login
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;

      const idToken = await loggedInUser.getIdToken();

      const payload = {
        email: loggedInUser.email,
        name: loggedInUser.displayName,
        photoURL: loggedInUser.photoURL,
        firebaseToken: idToken,
      };

      const res = await fetch(`${backendURL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authToken", data.token);
        return { success: true };
      } else {
        throw new Error(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("❌ Google login error:", error.message);
      return { success: false, message: error.message };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  // ✅ Keep Firebase sync (only for Google logins)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setUser(currentUser);
        setToken(idToken);

        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("authToken", idToken);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, token, theme, setTheme, loginWithEmail, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};



// // AppContext.js
// import React, { createContext, useState, useEffect } from "react";
// import { auth, googleProvider } from "../firebaseConfig/Config";
// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [theme, setTheme] = useState("light");


//   // ✅ Email + Password login (same as app)
//   const loginWithEmail = async (fdata) => {
//     try {
//       const res = await fetch(`${backendURL}/signin`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(fdata),
//       });

//       const data = await res.json();
//       if (res.ok && !data.error) {
//         setUser(data.user || { email: fdata.email });
//         setToken(data.data); // backend token

//         localStorage.setItem("user", JSON.stringify(data.user || { email: fdata.email }));
//         localStorage.setItem("authToken", data.data);

//         return { success: true };
//       } else {
//         throw new Error(data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("❌ Email login failed:", err);
//       return { success: false, message: err.message };
//     }
//   };

//   // ✅ Google login
//   const login = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const loggedInUser = result.user;

//       const idToken = await loggedInUser.getIdToken();

//       const payload = {
//         email: loggedInUser.email,
//         name: loggedInUser.displayName,
//         photoURL: loggedInUser.photoURL,
//         firebaseToken: idToken,
//       };

//       const res = await fetch(`${backendURL}/google-login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         setUser(data.user);
//         setToken(data.token);

//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem("authToken", data.token);
//         return { success: true };
//       } else {
//         throw new Error(data.message || "Google login failed");
//       }
//     } catch (error) {
//       console.error("❌ Google login error:", error.message);
//       return { success: false, message: error.message };
//     }
//   };

//   // ✅ Logout
//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch {}
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//   };

//   // ✅ Auto check Firebase state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const idToken = await currentUser.getIdToken();
//         setUser(currentUser);
//         setToken(idToken);

//         localStorage.setItem("user", JSON.stringify(currentUser));
//         localStorage.setItem("authToken", idToken);
//       } else {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("authToken");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AppContext.Provider
//       value={{ user, token, theme, setTheme, loginWithEmail, login, logout }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };


// // AppContext.js
// import React, { createContext, useState, useEffect } from "react";
// import { auth, googleProvider } from "../firebaseConfig/Config";
// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// // import { useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [theme, setTheme] = useState("light");
//   // const navigate = useNavigate()

// const login = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const loggedInUser = result.user;

//     console.log("google details", loggedInUser)
//     // Firebase ID Token
//     const idToken = await loggedInUser.getIdToken();

//     // Create payload with extra user data
//     const payload = {
      
//       email: loggedInUser.email,
//       name: loggedInUser.displayName,
//       photoURL: loggedInUser.photoURL,
//       googleuid : user.data.user.uid,
//       firebaseToken: idToken,
//     };
//     console.log("payload", payload)
//     console.log("name",loggedInUser.displayName )

//     // Send to backend
//     const res = await fetch("/google-login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//     console.log("server response", data);

//     if (res.ok && data.success) {
//       setUser(data.user);
//       setToken(data.token);

//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("authToken", data.token);
//       // navigate('/UserProfile')

//       return data.user;
//     } else {
//       throw new Error(data.message || "Login failed");
//     }
//   } catch (error) {
//     console.error("❌ Google login error:", error.message);
//     throw error;
//   }
// };


//   // 🔹 Logout
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem("user");
//       localStorage.removeItem("authToken");
//       // navigate('/GoogleLogin')
//       console.log("✅ User logged out");
//     } catch (error) {
//       console.error("❌ Google logout error:", error);
//     }
//   };

//   // 🔹 Auto-check Firebase auth state on refresh
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const idToken = await currentUser.getIdToken();
//         setUser(currentUser);
//         setToken(idToken);

//         localStorage.setItem("user", JSON.stringify(currentUser));
//         localStorage.setItem("authToken", idToken);
//       } else {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("authToken");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, token, theme, setTheme, login, logout }}>
//       {children}
//     </AppContext.Provider>
//   );
// };


// import React, { createContext, useState, useEffect } from "react";
// import { auth, googleProvider } from "../firebaseConfig/Config";
// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// // import backendURL from "../utils/String";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [theme, setTheme] = useState("light");

//   // 🔹 Login with Google
//   // const login = async () => {
//   //   try {
//   //     const result = await signInWithPopup(auth, googleProvider);
//   //     const loggedInUser = result.user;
//   //     const idToken = await loggedInUser.getIdToken();

//   //     // Save to state + localStorage
//   //     setUser(loggedInUser);
//   //     setToken(idToken);
//   //     localStorage.setItem("user", JSON.stringify(loggedInUser));
//   //     localStorage.setItem("authToken", idToken);

//   //     console.log("✅ User logged in:", loggedInUser);
//   //     return loggedInUser;
//   //   } catch (error) {
//   //     console.error("❌ Google login error:", error);
//   //     throw error;
//   //   }
//   // };

//   // AppContext.js (Web)
// const login = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const loggedInUser = result.user;

//     // ✅ Firebase ID Token
//     const idToken = await loggedInUser.getIdToken();

//     // ✅ Send to backend
//     const res = await fetch("/google-login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ idToken }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       setUser(data.user);
//       setToken(data.token);

//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("authToken", data.token);

//       console.log("✅ Backend user:", data.user);
//     } else {
//       throw new Error("Login failed");
//     }

//     return loggedInUser;
//   } catch (error) {
//     console.error("❌ Google login error:", error);
//     throw error;
//   }
// };


//   // 🔹 Logout
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem("user");
//       localStorage.removeItem("authToken");
//       console.log("✅ User logged out");
//     } catch (error) {
//       console.error("❌ Google logout error:", error);
//     }
//   };

//   // 🔹 Check Firebase auth state on refresh
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const idToken = await currentUser.getIdToken();
//         setUser(currentUser);
//         setToken(idToken);

//         localStorage.setItem("user", JSON.stringify(currentUser));
//         localStorage.setItem("authToken", idToken);
//       } else {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("authToken");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, token, theme, setTheme, login, logout }}>
//       {children}
//     </AppContext.Provider>
//   );
// };


// import React, { createContext, useState, useEffect } from "react";
// import { auth, googleProvider } from "../firebaseConfig/Config";
// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// // 1️⃣ Create context
// export const AppContext = createContext();

// // 2️⃣ Create provider
// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [theme, setTheme] = useState("light");

//   // 🔹 Login with Google
//   const login = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const loggedInUser = result.user;
//       const idToken = await loggedInUser.getIdToken();

//       // Save in state + localStorage
//       setUser(loggedInUser);
//       setToken(idToken);
//       localStorage.setItem("authToken", idToken);

//       console.log("✅ User logged in:", loggedInUser);
//       return loggedInUser;
//     } catch (error) {
//       console.error("❌ Google login error:", error);
//       throw error;
//     }
//   };

//   // 🔹 Logout
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem("authToken");
//       console.log("✅ User logged out");
//     } catch (error) {
//       console.error("❌ Google logout error:", error);
//     }
//   };

//   // 🔹 Check Firebase auth state on refresh
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const idToken = await currentUser.getIdToken();
//         setUser(currentUser);
//         setToken(idToken);
//         localStorage.setItem("authToken", idToken);
//       } else {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("authToken");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, token, theme, setTheme, login, logout }}>
//       {children}
//     </AppContext.Provider>
//   );
// };



// // import React, { createContext, useState } from "react";

// // // 1️⃣ Create context
// // export const AppContext = createContext();

// // // 2️⃣ Create provider component
// // export const AppProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);   // Example state
// //   const [theme, setTheme] = useState("light");

// //   return (
// //     <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
// //       {children}
// //     </AppContext.Provider>
// //   );
// // };
