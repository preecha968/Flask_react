import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepairHistory = () => {
    const [repairs, setRepairs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRepairHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/my-repair-history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRepairs(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch repair history');
            }
        };

        fetchRepairHistory();
    }, []);

    const downloadInvoice = async (repairId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/download-invoice/${repairId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'  // Ensure file download
            });

            // Download PDF file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${repairId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Error downloading invoice:", err);
        }
    };

    return (
        <div>
            {repairs.length ? (
                <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
                    <h2 className="mb-4 text-2xl font-semibold leading-tight">Invoices</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col className="w-24" />
                            </colgroup>
                            <thead className="dark:bg-gray-300">
                                <tr className="text-left">
                                    <th className="p-3">Brand</th>
                                    <th className="p-3">Model</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Cost</th>
                                    <th className="p-3">paid</th>
                                    <th className="p-3">Download</th>
                                    <th className="p-3">Resubmit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repairs.map(repair => (
                                    <tr key={repair.repair_id} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                                        <td className="p-3">
                                            <p>{repair.brand}</p>
                                        </td>
                                        <td className="p-3">
                                            <p>{repair.model}</p>
                                        </td>
                                        <td className="p-3">
                                            <p>{repair.repair_status}</p>
                                            <p className="dark:text-gray-600">{repair.updated_at}</p>
                                        </td>
                                        <td className="p-3">
                                            <p>{repair.cost || "N/A"}</p>
                                        </td>
                                        <td className="p-3">
                                            <p>{repair.paid ? "yes" : "no"}</p>
                                        </td>
                                        <td className="p-3">
                                            <button className="px-3 py-1 font-semibold rounded-lg dark:bg-violet-600 dark:text-gray-50"
                                                    onClick={() => downloadInvoice(repair.repair_id)}>
                                                Invoice
                                            </button>
                                        </td>
                                        <td className="p-3 ">
                                            <span className="px-3 py-1 font-semibold rounded-lg dark:bg-violet-600 dark:text-gray-50">
                                                <span>Send</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>{error || 'No repair history found.'}</p>
            )}
        </div>
    );
};

export default RepairHistory;




 // <table>
                //   <thead>
                //     <tr>
                //       <th>Brand</th>
                //       <th>Model</th>
                //       <th>Status</th>
                //       <th>Cost</th>
                //       <th>Paid</th>
                //       <th>Actions</th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {repairs.map(repair => (
                //       <tr key={repair.repair_id}>
                //         <td>{repair.brand}</td>
                //         <td>{repair.model}</td>
                //         <td>{repair.repair_status}</td>
                //         <td>{repair.cost || 'N/A'}</td>
                //         <td>{repair.paid ? 'Yes' : 'No'}</td>
                //         <td>
                //           <button onClick={() => downloadInvoice(repair.repair_id)}>Download Invoice</button>
                //         </td>
                //       </tr>
                //     ))}
                //   </tbody>
                // </table>




