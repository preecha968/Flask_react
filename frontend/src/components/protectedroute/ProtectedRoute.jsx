import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');  // ดึงค่า role จาก localStorage

  // ตรวจสอบว่ามี token และ role ต้องเป็น 'user' ด้วย
  if (!token || role !== 'user') {
    // Redirect ไปที่หน้า login ถ้าไม่มี token หรือ role ไม่ใช่ 'user'
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
