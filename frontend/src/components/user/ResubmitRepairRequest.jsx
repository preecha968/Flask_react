import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResubmitRepairRequest = () => {
  const { repairId } = useParams();
  const [message, setMessage] = useState('');

  const resubmitRepair = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5000/resubmit-repair/${repairId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Failed to resubmit repair request.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Resubmit Repair Request</h2>
      <button onClick={resubmitRepair}>Resubmit Repair</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResubmitRepairRequest;
