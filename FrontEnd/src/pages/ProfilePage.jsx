import React from 'react';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <h1>User Profile</h1>
        <div className="profile-details">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Role:</strong> Patient</p>
        </div>
        <button className="btn btn-primary">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;