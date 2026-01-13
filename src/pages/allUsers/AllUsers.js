import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersPage, resetUsers } from "../../redux/allUserSlice";
import "./AllUsers.css";

const AllUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux state
  const { users, page, loading, hasMore } = useSelector(
    (state) => state.users
  );

  // 🔍 Local search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const observer = useRef(null);

  // ✅ Initial load (same pattern as HomeVideo)
  useEffect(() => {
    dispatch(resetUsers());
    dispatch(fetchUsersPage(1));
  }, [dispatch]);

  // ✅ Keep filtered users in sync
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) => {
          const name = user.name?.toLowerCase() || "";
          const username = user.username?.toLowerCase() || "";
          return name.includes(q) || username.includes(q);
        })
      );
    }
  }, [users, searchQuery]);

  // ✅ Infinite scroll observer (same as HomeVideo)
  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchUsersPage(page));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch, page]
  );

  return (
    <div className="all-users-container">
      <div style={{ maxWidth: "900px", width: "100%" }}>
        {/* 🔍 Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 🌀 First Load Loader */}
        {users.length === 0 && loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p className="no-users">No users found</p>
            ) : (
              filteredUsers.map((item, index) => {
                const isLast = index === filteredUsers.length - 1;

                return (
                  <div
                    ref={isLast ? lastUserRef : null}
                    key={item._id}
                    className="user-card"
                    onClick={() =>
                      navigate(`/user/${item._id}`, {
                        state: { uname: item.username },
                      })
                    }
                  >
                    <img
                      src={
                        item.profilePic ||
                        "https://www.w3schools.com/w3images/avatar2.png"
                      }
                      alt={item.name}
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src =
                          "https://www.w3schools.com/w3images/avatar2.png";
                      }}
                    />
                    <div className="user-info">
                      <h3 className="name">
                        {item.name || "Unknown Name"}
                      </h3>
                      <p>
                        {item.username || "Unknown Username"} – who you might
                        know, is on Reelbook
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 🔄 Loading more */}
        {loading && users.length > 0 && (
          <p className="loading-text">Loading more users...</p>
        )}

        {/* ❌ End reached */}
        {!hasMore && !loading && users.length > 0 && (
          <p className="end-text">No more users</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // for navigation
// import "./AllUsers.css"; // styles
// import backendURL, { GET_All_Users } from "../../utils/String";


// const AllUsers = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendURL}${GET_All_Users}`);
//       const data = await response.json();
//       const usersList = data?.data || [];
//       setUsers(usersList);
//       setFilteredUsers(usersList);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//     setLoading(false);
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === "") {
//       setFilteredUsers(users);
//     } else {
//       const filtered = users.filter((user) => {
//         const name = user.name?.toLowerCase() || "";
//         const username = user.username?.toLowerCase() || "";
//         return (
//           name.includes(query.toLowerCase()) ||
//           username.includes(query.toLowerCase())
//         );
//       });
//       setFilteredUsers(filtered);
//     }
//   };

//   return (
//     <div className="all-users-container">
//       <div style={{maxWidth:'900px'}}>
//       {/* Search Bar */}
//       <div className="search-box">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchQuery}
//           onChange={(e) => handleSearch(e.target.value)}
//         />
//       </div>

//       {/* Loader */}
//       {loading ? (
//         <div className="loader">.</div>
//       ) : (
//         <div className="user-list">
//           {filteredUsers.length === 0 ? (
//             <p className="no-users">No users found</p>
//           ) : (
//             filteredUsers.map((item) => (
//               <div
//                 key={item._id || item.username}
//                 className="user-card"
//                 onClick={() =>
//                   navigate(`/user/${item._id}`, {
//                     state: { uname: item.username },
//                   })
//                 }
//               >
//                 <img
//                   src={
//                     item.profilePic ||
//                     "https://www.w3schools.com/w3images/avatar2.png"
//                   }
//                   alt={item.name}
//                   className="user-avatar"
//                 />
//                 <div className="user-info">
//                   <h3 className="name" >{item.name || "Unknown Name"}</h3>
//                   <p>
//                     {item.username || "Unknown Username"} – who you might know,
//                     is on Reelbook
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//       </div>
//     </div>
//   );
// };

// export default AllUsers;
