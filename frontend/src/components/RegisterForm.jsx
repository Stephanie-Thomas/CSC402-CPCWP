// src/components/RegisterForm.jsx
import React, { useState } from 'react';


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://csc402-cpcwp.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Successfully registered!');
        setFormData({ name: '', email: '', leetcodeUsername: '', codeforcesUsername: '' });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="WCU Email" value={formData.email} onChange={handleChange} required />
        <input name="leetcodeUsername" placeholder="LeetCode Username" value={formData.leetcodeUsername} onChange={handleChange} required />
        <input name="codeforcesUsername" placeholder="Codeforces Username" value={formData.codeforcesUsername} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
