import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Logo from '../../components/Logo';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useData();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    const result = signup({ name, email, phone, password, referralCode });
    if (result.success) {
        navigate('/login', { state: { message: result.message } });
    } else {
        setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Link to="/"><Logo className="h-12"/></Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Start your journey with us / আমাদের সাথে আপনার যাত্রা শুরু করুন</p>
          
          {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4">{error}</p>}
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Choose a username" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your phone number" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Create a password" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Confirm your password" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
              <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter referral code" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition">
              Sign Up
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="font-medium text-cyan-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
