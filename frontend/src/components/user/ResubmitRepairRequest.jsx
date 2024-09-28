import React, { useState } from 'react';
import axios from 'axios';

const ResubmitRepairRequest = ({ repairId }) => {
  

  const resubmitRepair = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5000/resubmit-repair/${repairId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (err) {
      alert('Failed to resubmit repair request.');
      console.error(err);
    }
  };

  return (
    <div>
      <button 
        onClick={resubmitRepair} 
        className="px-3 py-1 font-semibold rounded-lg dark:bg-violet-600 dark:text-gray-50"
      >
        SEND
      </button>
    </div>
  );
};

export default ResubmitRepairRequest;
