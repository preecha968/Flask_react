import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const { access_token, role, user_id } = response.data;  // ตรวจสอบว่า user_id ถูกดึงมาจาก response
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);  // Store role in local storage
      if (role === 'admin') {
        navigate('/admin/admindashboard');
      } else {
        navigate(`/profile/${user_id}`);  // ใช้ user_id ในการนำทาง
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-60 flex w-full max-w-lg flex-col rounded-xl border border-border bg-backgroundSecondary p-4 sm:p-20">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Sign in</h1>
        </div>
        <div className="form-group">
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input placeholder="Type here" type="email" name="email" className="input max-w-full" onChange={handleChange} />
            <label className="form-label">
              <span className="form-label-alt">Please enter a valid email.</span>
            </label>
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="form-control">
              <input placeholder="Type here" type="password" name="password" className="input max-w-full" onChange={handleChange} />
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
              <button type="submit" className="btn btn-primary w-full" >Sign In</button>
            </div>
          </div>

          <div className="form-field">
            <div className="form-control justify-center">
              <a href='/register' className="link link-underline-hover link-primary text-sm">don't have an account yet? Sign up.</a>
            </div>
          </div>
          {error && <p>{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default Login;
// <div>
//   <h2>Login</h2>
//   <form onSubmit={handleSubmit}>
//     <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//     <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//     <button type="submit">Login</button>
//   </form>
//   {error && <p>{error}</p>}
// </div>