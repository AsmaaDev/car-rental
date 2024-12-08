import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function UsersList({ users = [] }) {
  const [userData, setuserData] = useState(users);
  const [editinguser, setEditinguser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
   
  });

  useEffect(() => {
    setuserData(users);
  }, [users]);

  // Handle form data change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2>users</h2>

       
        {/* Table for users */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.length > 0 ? (
                userData.map((user) => (
                  <tr key={user._id}>
                    <td>{user.make}</td>
                    <td>{user.model}</td>
                    <td>{user.year}</td>
                    <td>{user.rental_price}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
