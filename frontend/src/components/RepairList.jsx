import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const CardAbout = ({repair}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="rounded-t-lg" src="#" alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Brand:{repair.brand}</h5>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Model:{repair.model}</h5>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Issue:</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{repair.issue_description}</p>
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Date:{repair.created_at}</h5>
        <Link to={`/repairstatus/${repair.repair_id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Current status
        </Link>
      </div>
    </div>
  )
}

const RepairList = () => {
  const [repairs, setRepairs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepairs = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/my-repairs', {
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

  return (
    <div className=' ml-12 mt-32 flex flex-wrap gap-10'>
      {repairs.length ? (
        repairs.map((repair) => (
          <CardAbout key={repair.repair_id} repair={repair} />
        ))
      ) : (
        <p>{error || 'No repairs found'}</p>
      )}
    </div>
  );
};

export default RepairList;


{/* <div>
      <h2>My Repairs</h2>
      <CardAbout/>
      {repairs.length ? (
        <ul>
          {repairs.map((repair) => (
            <li key={repair.repair_id}>
              {repair.brand}: {repair.model}-{repair.issue_description}-{repair.created_at} status:{repair.repair_status}
            </li>
          ))}
        </ul>
      ) : (
        <p>{error || 'No repairs found'}</p>
      )}
      <br />
      <hr />

    </div> */}
