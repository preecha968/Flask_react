import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อจัดการการนำทาง

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ใช้ useNavigate แทนการเปลี่ยน state

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCustomers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch customers');
      }
    };

    fetchCustomers();
  }, []);

  // ฟังก์ชันสำหรับการนำทางไปยังหน้าประวัติการซ่อม
  const viewRepairHistory = (customerId) => {
    navigate(`/admin/customer-repairs/${customerId}`); // นำทางไปที่เส้นทางใหม่พร้อม customerId
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Customer List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button onClick={() => viewRepairHistory(customer.id)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
