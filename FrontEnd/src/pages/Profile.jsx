import React from 'react';
import UserProfile from '../components/UserProfile.jsx';
import '../styles/Profile.css';

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;