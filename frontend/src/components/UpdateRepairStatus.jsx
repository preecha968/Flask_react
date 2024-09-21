import React, { useState } from 'react';
import axios from 'axios';

const UpdateRepairStatus = ({ repairId }) => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:5000/admin/update-repair-status/${repairId}`, 
      { repair_status: status },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div>
      <h3>Update Repair Status</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="New Status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          required 
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UpdateRepairStatus;
