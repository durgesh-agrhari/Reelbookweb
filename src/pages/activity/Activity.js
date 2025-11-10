import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Activity.css";
import { useSelector } from "react-redux";
import backendURL, { GET_All_Users, Notification } from "../../utils/String";

const Activity = () => {
  const [loading, setLoading] = useState(true);
  // const [users, setUsers] = useState([]);
  // console.log(users)
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);
// hello
  useEffect(() => {
    // ✅ Load cached data from localStorage (if any)
    const savedUsers = localStorage.getItem("all_users");
    const savedNotifications = localStorage.getItem("user_notifications");

    // if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

    // ✅ Fetch latest data
    fetchUsers();
    fetchNotifications();
  }, [fetchNotifications]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}${GET_All_Users}`);
      const data = await res.json();
      const reversed = (data?.data || []).reverse();
      // setUsers(reversed);

      // ✅ Save to localStorage
      localStorage.setItem("all_users", JSON.stringify(reversed));
    } catch (e) {
      console.error("Error fetching users:", e);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${backendURL}${Notification}${userData._id}`);
      const data = await res.json();
      const notifs = data?.data || [];
      setNotifications(notifs);

      // ✅ Save to localStorage
      localStorage.setItem("user_notifications", JSON.stringify(notifs));
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  const earlierNotifications = useMemo(
    () => notifications.slice(0, 3),
    [notifications]
  );

  const allNotifications = useMemo(
    () => notifications.slice(3, notifications.length),
    [notifications]
  );

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="activity-container">
      <div style={{ maxWidth: "900px" }}>
        <h3 className="section-title">Earlier Notifications</h3>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : earlierNotifications.length === 0 ? (
          <p className="no-data">No notifications yet</p>
        ) : (
          <div className="notification-list">
            {earlierNotifications.map((item, index) => (
              <div key={index} className="notification-card">
                <img
                  src={
                    item.profileImage ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  alt={item.username}
                  className="notification-avatar"
                  onClick={() =>
                    navigate(`/user/${item.senderId}`, {
                      state: { uname: item.username },
                    })
                  }
                />
                <div className="notification-info">
                  <p className="notification-text">
                    <strong>{item.title}</strong>, who you might know, is on
                    Reelbook
                  </p>
                  <p className="notification-meta">
                    From: {item.username || "Unknown User"}
                  </p>
                  <p className="notification-time">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="section-title">All Notifications</h3>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : allNotifications.length === 0 ? (
          <p className="no-data">No notifications yet</p>
        ) : (
          <div className="notification-list">
            {allNotifications.map((item, index) => (
              <div key={index} className="notification-card">
                <img
                  src={
                    item.profileImage ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  alt={item.username}
                  className="notification-avatar"
                />
                <div className="notification-info">
                  <p className="notification-text">
                    <strong>{item.title}</strong>, who you might know, is on
                    Reelbook
                  </p>
                  <p className="notification-meta">
                    From: {item.username || "Unknown User"}
                  </p>
                  <p className="notification-time">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;


// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Activity.css";
// import { useSelector } from "react-redux";
// import backendURL, { GET_All_Users, Notification } from "../../utils/String";

// const Activity = () => {
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();
  

//   // Example mock user id, replace with your auth logic
// //   const userData = { _id: "USER_ID_HERE" };
//   const { userData } = useSelector((state) => state.auth);
//   useEffect(() => {
//     fetchUsers();
//     fetchNotifications();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${backendURL}${GET_All_Users}`);
//       const data = await res.json();
//       setUsers((data?.data || []).reverse());
//     } catch (e) {
//       console.error("Error fetching users:", e);
//     }
//     setLoading(false);
//   };

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(`${backendURL}${Notification}${userData._id}`);
//       const data = await res.json();
//       setNotifications(data?.data || []);
//     } catch (e) {
//       console.error("Error fetching notifications:", e);
//     }
//   };

//   const earlierNotifications = useMemo(
//     () => notifications.slice(0, 3),
//     [notifications]
//   );

//   const allNotifications = useMemo(
//     () => notifications.slice(3, users.length),
//     [notifications, users.length]
//   );

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "";
//     const date = new Date(isoDate);
//     return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   };

//   return (
//     <div className="activity-container">
//       <div style={{ maxWidth: "900px" }}>
//         {/* Header */}
//         <div className="activity-header">
//           {/* <button className="back-btn" onClick={() => navigate(-1)}>
//             ←
//           </button> */}
//           {/* <h2 className="activity-title">Activity</h2> */}
//         </div>

//         {/* Top Banner Ad Placeholder */}
//         {/* <div className="ad-banner">Banner Ad Placeholder</div> */}

//         {/* EARLIER NOTIFICATIONS */}
//         <h3 className="section-title">Earlier Notifications</h3>
//         {loading ? (
//           <div className="loader">Loading...</div>
//         ) : earlierNotifications.length === 0 ? (
//           <p className="no-data">No notifications yet</p>
//         ) : (
//           <div className="notification-list">
//             {earlierNotifications.map((item, index) => (
//               <div key={index} className="notification-card">
//                 <img
//                   src={
//                     item.profileImage ||
//                     "https://www.w3schools.com/howto/img_avatar.png"
//                   }
//                   alt={item.username}
//                   className="notification-avatar"
//                   onClick={() =>
//                     navigate(`/user/${item.senderId}`, {
//                       state: { uname: item.username },
//                     })
//                   }
//                 />
//                 <div className="notification-info">
//                   <p className="notification-text">
//                     <strong>{item.title}</strong>, who you might know, is on
//                     Reelbook
//                   </p>
//                   <p className="notification-meta">
//                     From: {item.username || "Unknown User"}
//                   </p>
//                   <p className="notification-time">{formatDate(item.createdAt)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ALL NOTIFICATIONS */}
//         <h3 className="section-title">All Notifications</h3>
//         {loading ? (
//           <div className="loader">Loading...</div>
//         ) : allNotifications.length === 0 ? (
//           <p className="no-data">No notifications yet</p>
//         ) : (
//           <div className="notification-list">
//             {allNotifications.map((item, index) => (
//               <div key={index} className="notification-card">
//                 <img
//                   src={
//                     item.profileImage ||
//                     "https://www.w3schools.com/howto/img_avatar.png"
//                   }
//                   alt={item.username}
//                   className="notification-avatar"
//                 />
//                 <div className="notification-info">
//                   <p className="notification-text">
//                     <strong>{item.title}</strong>, who you might know, is on
//                     Reelbook
//                   </p>
//                   <p className="notification-meta">
//                     From: {item.username || "Unknown User"}
//                   </p>
//                   <p className="notification-time">{formatDate(item.createdAt)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Footer Banner */}
//         {/* <div className="ad-banner">Footer Ad Placeholder</div> */}
//       </div>
//     </div>
//   );
// };

// export default Activity;
