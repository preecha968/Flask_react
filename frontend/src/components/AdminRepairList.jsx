import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRepairList = () => {
  const [repairs, setRepairs] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRepairs = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/admin/all-repairs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRepairs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch repairs');
      }
    };

    fetchRepairs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e, repairId) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [repairId]: { ...prevState[repairId], [name]: value }
    }));
  };

  // Handle form submit for updating repair
  const handleUpdate = async (repairId) => {
    const token = localStorage.getItem('token');
    const repairData = formData[repairId] || {};

    try {
      await axios.put(`http://localhost:5000/admin/update-repair-cost/${repairId}`, {
        cost: repairData.cost,
        paid: repairData.paid === "true" // Ensure this is treated as a boolean
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await axios.put(`http://localhost:5000/admin/update-repair-status/${repairId}`, {
        repair_status: repairData.repair_status
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Repair updated successfully!');
    } catch (err) {
      alert('Failed to update repair');
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <h2 className="text-4xl font-bold divider divider-horizontal">💻️ All Repair List 💻️</h2>
      <br />
      <br />
      <br />
      {repairs.length ? (
        <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col className="w-24" />
              </colgroup>
              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-3">ID #</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair) => (
                  <tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50" key={repair.repair_id}>
                    <td className="p-3">
                      <p>{repair.repair_id}</p>
                    </td>
                    <td className="p-3">
                      <p>{repair.brand}</p>
                    </td>
                    <td className="p-3">
                      <p>{repair.model}</p>
                    </td>
                    <td className="p-3 ">
                      <input
                        type="text"
                        name="repair_status"
                        value={formData[repair.repair_id]?.repair_status || repair.repair_status}
                        onChange={(e) => handleInputChange(e, repair.repair_id)}
                        className="input input-bordered"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        name="cost"
                        value={formData[repair.repair_id]?.cost || repair.cost || ''}
                        onChange={(e) => handleInputChange(e, repair.repair_id)}
                        className="input input-bordered"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        name="paid"
                        value={formData[repair.repair_id]?.paid || (repair.paid ? "true" : "false")}
                        onChange={(e) => handleInputChange(e, repair.repair_id)}
                        className="select select-bordered"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50"
                        onClick={() => handleUpdate(repair.repair_id)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>{error || 'No repairs found'}</p>
      )}
    </div>
  );
};

export default AdminRepairList;



{/* <div>
<h2>All Repair Requests</h2>
{repairs.length ? (
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Brand</th>
        <th>Model</th>
        <th>Status</th>
        <th>Cost</th>
        <th>Paid</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {repairs.map((repair) => (
        <tr key={repair.repair_id}>
          <td>{repair.repair_id}</td>
          <td>{repair.brand}</td>
          <td>{repair.model}</td>
          <td>{repair.repair_status}</td>
          <td>{repair.cost || 'N/A'}</td>
          <td>{repair.paid ? 'Yes' : 'No'}</td>
          <td>
            <button onClick={() => updateStatus(repair.repair_id)}>Update Status</button>
            <button onClick={() => updateCost(repair.repair_id)}>Update Cost/Payment</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>{error || 'No repairs found'}</p>
)}
</div> */}
