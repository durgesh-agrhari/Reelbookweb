import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import "./AllUsers.css"; // styles
import backendURL, { GET_All_Users } from "../../utils/String";


const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}${GET_All_Users}`);
      const data = await response.json();
      const usersList = data?.data || [];
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        const name = user.name?.toLowerCase() || "";
        const username = user.username?.toLowerCase() || "";
        return (
          name.includes(query.toLowerCase()) ||
          username.includes(query.toLowerCase())
        );
      });
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="all-users-container">
      <div style={{maxWidth:'900px'}}>
      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="loader">Loading users...</div>
      ) : (
        <div className="user-list">
          {filteredUsers.length === 0 ? (
            <p className="no-users">No users found</p>
          ) : (
            filteredUsers.map((item) => (
              <div
                key={item._id || item.username}
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
                />
                <div className="user-info">
                  <h3 className="name" >{item.name || "Unknown Name"}</h3>
                  <p>
                    {item.username || "Unknown Username"} – who you might know,
                    is on Reelbook
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AllUsers;
