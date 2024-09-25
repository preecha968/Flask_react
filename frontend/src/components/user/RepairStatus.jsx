import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import formatDate from '../protectedroute/FormatDate';

const RepairStatus = () => {
  const { repairId } = useParams();
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepairStatus = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/repair-status/${repairId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRepair(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch repair status');
      }
    };

    fetchRepairStatus();
  }, [repairId]);


  return (
    <div>
      <br />
      <br />
      <br />
      <div className="text-4xl font-bold divider divider-horizontal">Repair status🛠️</div>
      {repair ? (
        <form className="mx-auto mt-40 flex w-full max-w-lg flex-col rounded-xl border border-border bg-backgroundSecondary p-4 sm:p-20">
        <div className="container max-w-5xl px-3 py-12 mx-auto">
          <div className=" gap-10 mx-4 sm:grid-cols-12">
            <div className="col-span-12 sm:col-span-3">
              <div className="text-center sm:text-left mb-14 before:block before:w-24 before:h-3 before:mb-5 before:rounded-md uppercase before:mx-auto sm:before:mx-0 before:dark:bg-violet-600">{formatDate (repair.created_at)}
                <h3 className="text-3xl font-semibold">Brand: {repair.brand}</h3>
                <span className="text-sm font-bold tracking-wider uppercase dark:text-gray-600">Model: {repair.model}</span>
                <p className="text-sm font-bold tracking-wider uppercase dark:text-gray-600">Issue: {repair.issue_description}</p>
                <div className="divider"></div>
              </div>
            </div>
            <div className="relative col-span-12 px-4 space-y-6 sm:col-span-9">
              <div className="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-300">
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-600">
                  <h3 className="text-xl font-semibold tracking-wide">Status</h3>
                  <time className="text-xs tracking-wide uppercase dark:text-gray-600">{formatDate (repair.created_at)}</time>
                  <p className="mt-3">{repair.repair_status} </p>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-600">
                  <h3 className="text-xl font-semibold tracking-wide">Repair Description</h3>
                  <time className="text-xs tracking-wide uppercase dark:text-gray-600"></time>
                  <p className="mt-3">{repair.repair_description} </p>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-600">
                  <h3 className="text-xl font-semibold tracking-wide">Cost</h3>
                  <time className="text-xs tracking-wide uppercase dark:text-gray-600">ค่าบริการรวมอะไหล่</time>
                  <p className="mt-3">{repair.cost || 'Not available'} Baht</p>
                </div>
                <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-600">
                  <h3 className="text-xl font-semibold tracking-wide">Paid</h3>
                  <time className="text-xs tracking-wide uppercase dark:text-gray-600">มีบริการทุกช่องทาง</time>
                  <p className="mt-3">{repair.paid ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div></form>

      ) : (
        <p>{error}</p>
      )}

    </div>
  );
};

export default RepairStatus;

{/* <div>
      <br/>
      <br/>
      <br/>
      <div className="text-4xl font-bold divider divider-horizontal">Repair status🛠️</div>
      {repair ? (
        <div>
          <p>Brand: {repair.brand}</p>
          <p>Model: {repair.model}</p>
          <p>Issue: {repair.issue_description}</p>
          <p>Status: {repair.repair_status}</p>
          <p>Cost: {repair.cost || 'Not available'}</p>
          <p>Paid: {repair.paid ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>{error}</p>
      )}
    </div> */}



