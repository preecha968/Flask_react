import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmitRepair from './SubmitRepair';
import RepairStatus from './RepairStatus';
import RepairList from './RepairList';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (err) {
        setError(err.response.data.error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <div className="navbar">
        <div className="navbar-start">
          <a className="navbar-item text-3xl font-bold">Profile</a>
        </div>
        <div className="navbar-center">
          <a className="navbar-item font-bold">Home</a>
          <a className="navbar-item font-bold"><SubmitRepair/></a>
          <a className="navbar-item font-bold">Contact Us</a>
        </div>
        <div className="navbar-end">
          <div className="dropdown">
            <label className="btn btn-solid-success my-2 text-xl font-bold" tabIndex="0">Welcome: mister {profile.name}</label>
            <div className="dropdown-menu">
              <a className="dropdown-item text-sm">Email: {profile.email}</a>
              <a tabIndex="-1" className="dropdown-item text-sm">Phone: {profile.phone}</a>
              <a  href='/login' tabIndex="-1" className="dropdown-item text-sm">Logout</a>
            </div>
          </div>
        </div>
      </div>
      {error ? <p>{error}</p> : (
        <div >
         <br/>
         <br/>
         <h2 className="text-4xl font-bold divider divider-horizontal">💻️My Repair List💻️</h2>
          <RepairList />

        </div>
      )}
      
    </div>
  );
};

export default Profile;
