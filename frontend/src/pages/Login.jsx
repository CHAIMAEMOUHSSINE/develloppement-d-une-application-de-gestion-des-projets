import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Debug: Afficher les données reçues
        console.log('User data:', response.data.user);
        
        // Redirection basée sur le rôle
        switch(response.data.user.role) {
          case 'admin':
            navigate('/Admindash');
            break;
          case 'employee':
            navigate('/TasksEmployeePage');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-6">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-medium text-gray-800 text-center mb-2">Bienvenue</h2>
          <p className="text-gray-600 text-center mb-6">Connectez-vous pour accéder à votre compte</p>
          
          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 flex-grow mr-3"></div>
            <span className="text-xs text-gray-500">Connectez-vous avec email</span>
            <div className="border-t border-gray-300 flex-grow ml-3"></div>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-pink-600 hover:text-pink-500">Mot de passe oublié?</a>
              </div>
            </div>
            
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
            
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>
            <a href="#" className="font-medium hover:text-gray-500">Privacy Policy</a> © 2025 ComptaryNtarh. All rights reserved.{' '}
            <a href="#" className="font-medium hover:text-gray-500">Contact Us</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;