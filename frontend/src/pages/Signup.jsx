import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      if (res.data.success) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setError('');
        setTimeout(() => navigate('/login'), 2000); // redirige après 2 secondes
      } else {
        setError(res.data.message);
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
      setSuccess('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Créer compte</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button type="submit" className="w-full py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;