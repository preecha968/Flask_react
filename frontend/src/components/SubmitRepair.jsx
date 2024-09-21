import React, { useState } from 'react';
import axios from 'axios';

const SubmitRepair = () => {
  const [formData, setFormData] = useState({
    brand: '', model: '', issue_description: '', image: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger page reload after form submission
    window.location.reload();

    const token = localStorage.getItem('token');

    const formDataObj = new FormData();
    formDataObj.append('brand', formData.brand);
    formDataObj.append('model', formData.model);
    formDataObj.append('issue_description', formData.issue_description);
    if (formData.image) formDataObj.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:5000/submit-repair', formDataObj, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit repair');
    }
  };

  return (
    <div>
      <label className="btn btn-primary" htmlFor="modal-1">Send Repair</label>
      <input className="modal-state" id="modal-1" type="checkbox" />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-1"></label>
        <div className="modal-content flex flex-col gap-5">
          <label htmlFor="modal-1" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
          <h2 className="text-4xl font-semibold">Repair...</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className="w-full">
              <label className="sr-only" htmlFor="name">Image</label>
              <input className="input-file input-file-success max-w-full" type="file" name="image" onChange={handleFileChange} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="email">Bland</label>
                <input className="input input-solid" type="text" name="brand" placeholder="Laptop Brand" onChange={handleChange} required />
              </div>

              <div>
                <label className="sr-only" htmlFor="phone">Model</label>
                <input className="input input-solid" type="text" name="model" placeholder="Laptop Model" onChange={handleChange} required />
              </div>
            </div>
            <div className="w-full">
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea className="textarea textarea-solid max-w-full" name="issue_description" placeholder="Issue Description" rows="8" onChange={handleChange} required />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg btn btn-primary btn-block">Send Repair</button>
            </div>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>

    </div>
  );
};

export default SubmitRepair;

{/* <form onSubmit={handleSubmit} className=" space-y-4 mx-auto mt-40 flex w-full max-w-lg flex-col rounded-xl border border-border bg-backgroundSecondary p-3 sm:p-10">
      <h1 className="text-3xl font-semibold">Repair....</h1>
      <div className="w-full">
        <label className="sr-only" htmlFor="name">Image</label>
        <input  className="input-file input-file-success max-w-full" type="file" name="image" onChange={handleFileChange}/>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="email">Bland</label>
          <input className="input input-solid" type="text" name="brand" placeholder="Laptop Brand" onChange={handleChange} required />
        </div>

        <div>
          <label className="sr-only" htmlFor="phone">Model</label>
          <input className="input input-solid" type="text" name="model" placeholder="Laptop Model" onChange={handleChange} required />
        </div>
      </div>

      <div className="w-full">
        <label className="sr-only" htmlFor="message">Message</label>
        <textarea className="textarea textarea-solid max-w-full" name="issue_description" placeholder="Issue Description" rows="8" onChange={handleChange} required />
      </div>

      <div className="mt-4">
        <button type="submit" className="rounded-lg btn btn-primary btn-block">Send Repair</button>
      </div>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </form> */}


// <h2>Submit a Repair</h2>
// <form onSubmit={handleSubmit}>
//   <input type="text" name="brand" placeholder="Laptop Brand" onChange={handleChange} required />
//   <input type="text" name="model" placeholder="Laptop Model" onChange={handleChange} required />
//   <textarea name="issue_description" placeholder="Issue Description" onChange={handleChange} required />
//   <input type="file" name="image" onChange={handleFileChange} />
//   <button type="submit">Submit Repair</button>
// </form>
