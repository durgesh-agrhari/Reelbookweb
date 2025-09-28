// DeleteUser.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DeleteUser.css";
import { useSelector } from "react-redux";

const DeleteUser = () => {
  const { id } = useParams(); // get user id from route param
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://reelbookapi.site/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ User deleted successfully!");
        setTimeout(() => navigate("/"), 2000); // redirect after 2s
      } else {
        const err = await res.json();
        setMessage(`❌ Error: ${err.message || "Failed to delete user"}`);
      }
    } catch (error) {
      setMessage("❌ Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };
 const { userData} = useSelector((state) => state.auth);
  return (
    <div className="delete-container">
      <div className="delete-card">
        <h2>Delete User</h2>
        <p style={{color:'black'}}>Are you sure you want to delete this user</p>
        <code className="user-id">{id}</code>
        <code className="user-id">{userData?.name}</code>

        <div className="buttons">
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default DeleteUser;
