import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Logo from '../../components/Logo';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, users } = useData();
  const infoMessage = location.state?.message;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(identifier, password);
    if (user) {
      if (user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
       const potentialUser = users.find(u => (u.email.toLowerCase() === identifier.toLowerCase() || u.name.toLowerCase() === identifier.toLowerCase()));
       if (potentialUser && potentialUser.isBlocked) {
         setError('Your account has been blocked by an administrator. / আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে।');
       } else {
         setError('Invalid credentials. Please try again. / ভুল তথ্য। আবার চেষ্টা করুন।');
       }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Link to="/"><Logo className="h-12"/></Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-6">Sign in to continue / চালিয়ে যেতে সাইন ইন করুন</p>
          
          {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
          {infoMessage && <p className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4 text-center">{infoMessage}</p>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username or Email</label>
              <input 
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter username or email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="text-right text-sm">
              <Link to="/forgot-password" className="font-medium text-cyan-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition !mt-6">
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? / কোনো অ্যাকাউন্ট নেই?</p>
            <Link to="/signup" className="mt-2 inline-block w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition text-lg shadow-md hover:shadow-lg transform hover:scale-105">
              Create New Account / নতুন অ্যাকাউন্ট খুলুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
