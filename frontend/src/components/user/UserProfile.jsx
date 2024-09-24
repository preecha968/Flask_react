import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Logout from '../auth/Logout';
import SubmitRepair from './SubmitRepair';
import RepairList from './RepairList';

const UserProfile = () => {
  const { userId } = useParams();  // ดึง userId จาก URL parameters
  const [userProfile, setUserProfile] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');  // ดึง token จาก localStorage

      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`  // ส่ง token ใน header
          }
        });
        setUserProfile(response.data);  // เก็บข้อมูลโปรไฟล์ใน state
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
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
                        <label className="btn btn-solid-success my-2 text-xl font-bold" tabIndex="0">Welcome: mister {userProfile.name}</label>
                        <div className="dropdown-menu">
                            <a className="dropdown-item text-sm">Email: {userProfile.email}</a>
                            <a tabIndex="-1" className="dropdown-item text-sm">Phone: {userProfile.phone}</a>
                            <a tabIndex="-1" className="dropdown-item text-sm">Role: {userProfile.role}</a>
                            <a tabIndex="-1" className="dropdown-item text-sm"><Logout/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div >
                <br />
                <br />
                <h2 className="text-4xl font-bold divider divider-horizontal">💻️My Repair List💻️</h2>
                <RepairList/>
            </div>
            </div>
        // <div>
        //   <h2>Profile</h2>
        //   <p>ID: {userProfile.id}</p>
        //   <p>Name: {userProfile.name}</p>
        //   <p>Email: {userProfile.email}</p>
        //   <p>Phone: {userProfile.phone}</p>
        //   <p>Role: {userProfile.role}</p>
        // </div>
      )}
    </div>
  );
};

export default UserProfile;
