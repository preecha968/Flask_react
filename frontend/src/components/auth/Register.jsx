import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-60 flex w-full max-w-lg flex-col rounded-xl border border-border bg-backgroundSecondary p-4 sm:p-20">
      <div className="mx-auto  flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Sign Up</h1>
          <p className="text-sm">Sign UP to access your account</p>
        </div>
        <div className="form-group">
          <div className="form-field">
            <label className="form-label">Name</label>
            <input className="input max-w-full" type="text" name="name" placeholder="Name" onChange={handleChange} />
            <label className="form-label">
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input className="input max-w-full" type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <label className="form-label">
              <span className="form-label-alt">Please enter a valid email.</span>
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Phone No.</label>
            <input className="input max-w-full" type="text" name="phone" placeholder="Phone" onChange={handleChange} />
            <label className="form-label">
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="form-control">
              <input className="input max-w-full" type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
          </div>
          <div className="form-field">
            <div className="form-control justify-between">
              <div className="flex gap-2">
                <input type="checkbox" className="checkbox" />
                <a href="#">Remember me</a>
              </div>
              <label className="form-label">
                <a className="link link-underline-hover link-primary text-sm">Forgot your password?</a>
              </label>
            </div>
          </div>
          <div className="form-field pt-5">
            <div className="form-control justify-between">
              <button type="submit" className="btn btn-primary w-full">Sign Up</button>
            </div>
          </div>
          <div className="form-field">
            <div className="form-control justify-center">
              <a href='/login' className="link link-underline-hover link-primary text-sm">Already have an account? Sign in.</a>
            </div>
          </div>
          {error && <p>{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default Register;
// <div>
//   <h2>Register</h2>
//   <form onSubmit={handleSubmit}>
//     <input type="text" name="name" placeholder="Name" onChange={handleChange}  />
//     <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//     <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
//     <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//     <button type="submit">Register</button>
//   </form>
//   {error && <p>{error}</p>}
// </div>