import React, { useState } from 'react';
import axios from 'axios';

const UpdateRepairCost = ({ repairId }) => {
  const [cost, setCost] = useState('');
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:5000/admin/update-repair-cost/${repairId}`, 
      { cost: parseFloat(cost), paid },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cost/payment');
    }
  };

  return (
    <div>
      <h3>Update Repair Cost & Payment Status</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          placeholder="Repair Cost" 
          value={cost} 
          onChange={(e) => setCost(e.target.value)} 
          required 
        />
        <label>
          <input 
            type="checkbox" 
            checked={paid} 
            onChange={() => setPaid(!paid)} 
          />
          Mark as Paid
        </label>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UpdateRepairCost;
