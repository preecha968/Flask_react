import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Logout from '../auth/Logout';
import SubmitRepair from './SubmitRepair';
import RepairList from './RepairList';
import RepairHistory from './RepairHistory';

const UserProfile = () => {
  const { userId } = useParams();  // ดึง userId จาก URL parameters
  const [userProfile, setUserProfile] = useState({});
  const [error, setError] = useState('');
  
  // สถานะสำหรับการสลับระหว่าง Home และ History
  const [currentView, setCurrentView] = useState('home');  // เริ่มต้นที่หน้า Home

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

  // ฟังก์ชันสำหรับเปลี่ยนเนื้อหาที่จะแสดงในหน้า (สลับเฉพาะ Home และ History)
  const renderContent = () => {
    if (currentView === 'home') {
      return (
        <div>
          <br/>
          <br/>
          <h2 className="text-4xl font-bold divider divider-horizontal">💻️My Repair List💻️</h2>
          <RepairList />
        </div>
      );
    } else if (currentView === 'history') {
      return (
        <div>
          <br/>
          <br/>
          <h2 className="text-4xl font-bold divider divider-horizontal">💻️My Repair History💻️</h2>
          <RepairHistory/>
        </div>
      );
    }
  };

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
              {/* กดปุ่มแล้วเปลี่ยนสถานะ currentView เพื่อแสดงผลหน้า */}
              <a 
                className="navbar-item font-bold cursor-pointer"
                onClick={() => setCurrentView('home')}
              >
                รายการ
              </a>
              <SubmitRepair />
              <a 
                className="navbar-item font-bold cursor-pointer"
                onClick={() => setCurrentView('history')}
              >
                ประวัติ
              </a>
            </div>
            <div className="navbar-end">
              <div className="dropdown">
                <label className="btn btn-solid-success my-2 text-xl font-bold" tabIndex="0">
                  สวัสดี: คุณ {userProfile.name}
                </label>
                <div className="dropdown-menu">
                  <a className="dropdown-item text-sm">Email: {userProfile.email}</a>
                  <a tabIndex="-1" className="dropdown-item text-sm">Phone: {userProfile.phone}</a>
                  <a tabIndex="-1" className="dropdown-item text-sm">Role: {userProfile.role}</a>
                  <a tabIndex="-1" className="dropdown-item text-sm"><Logout /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="content">
            {/* ส่วนของ Home หรือ History */}
            {renderContent()}  
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
