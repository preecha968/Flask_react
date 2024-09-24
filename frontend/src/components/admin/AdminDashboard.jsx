import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AdminRepairList from './AdminRepairList';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminProfile, setAdminProfile] = useState({});
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('home'); // เพิ่ม state เพื่อเก็บหน้า
  const navigate = useNavigate();
  // useEffect สำหรับดึงข้อมูลโปรไฟล์
  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}` // ส่ง token ใน header เพื่อยืนยันสิทธิ์
          }
        });
        setAdminProfile(response.data); // เก็บข้อมูลโปรไฟล์ใน state
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
      }
    };

    fetchAdminProfile();
  }, []);

  // ฟังก์ชันในการเปลี่ยนหน้า
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <div><h2>Home Content</h2><p>Welcome to the Admin Dashboard!</p></div>;
      case 'repair':
        return <div><AdminRepairList/></div>;
      case 'contact':
        return <div><h2>Contact</h2><p>This is the Contact page content.</p></div>;
      default:
        return <div><h2>Home Content</h2><p>Welcome to the Admin Dashboard!</p></div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="navbar">
            <div className="navbar-start">
              <a className="navbar-item text-3xl font-bold">Admin</a>
            </div>
            <div className="navbar-center">
              {/* เมื่อคลิกแต่ละเมนูจะเปลี่ยน currentPage */}
              <a className="navbar-item" onClick={() => setCurrentPage('home')}>Home</a>
              <a className="navbar-item" onClick={() => setCurrentPage('repair')}>Repair</a>
              <a className="navbar-item" onClick={() => setCurrentPage('contact')}>Contact</a>
            </div>
            <div className="navbar-end">
              <div className="dropdown">
                <label className="avatar avatar-ring-primary" tabIndex="0">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="avatar" />
                </label>
                <div className="dropdown-menu">
                  <a className="dropdown-item text-sm">Role: {adminProfile.role}</a>
                  <a className="dropdown-item text-sm">Name: {adminProfile.name}</a>
                  <a tabIndex="-1" className="dropdown-item text-sm">Email: {adminProfile.email}</a>
                  <a onClick={handleLogout} tabIndex="-1" className="dropdown-item text-sm">Logout</a>
                </div>
              </div>
            </div>
          </div>
          {/* แสดงเนื้อหาตามหน้าที่เลือก */}
          <div className="content">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
