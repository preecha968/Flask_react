import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // ใช้ useParams เพื่อดึง customerId จาก URL

const CustomerRepairHistory = () => {
  const { customerId } = useParams(); // ดึง customerId จาก URL
  const [repairs, setRepairs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepairHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/admin/customer-repairs/${customerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRepairs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch repair history');
      }
    };

    fetchRepairHistory();
  }, [customerId]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3>Repair History for Customer {customerId}</h3>
          {repairs.length ? (
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map(repair => (
                  <tr key={repair.repair_id}>
                    <td>{repair.brand}</td>
                    <td>{repair.model}</td>
                    <td>{repair.repair_status}</td>
                    <td>{repair.cost}</td>
                    <td>{repair.paid ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No repair history found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerRepairHistory;
