import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Logo from '../../components/Logo';

type Step = 'email' | 'code' | 'reset' | 'success';

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  
  const { users, updateUserPassword } = useData();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(generatedCode);
      setInfo(`(Demo) The verification code sent to your email is: ${generatedCode} / (ডেমো) আপনার ইমেলে পাঠানো ভেরিফিকেশন কোডটি হলো: ${generatedCode}`);
      setStep('code');
    } else {
      setError('The email you provided was not found in our system. / আপনার দেওয়া ইমেলটি আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি।');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (code === verificationCode) {
      setStep('reset');
    } else {
      setError('Incorrect code. Please try again. / ভুল কোড। আবার চেষ্টা করুন।');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long. / পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. / পাসওয়ার্ড দুটি মেলেনি।');
      return;
    }

    const success = updateUserPassword(email, newPassword);
    if (success) {
      setStep('success');
    } else {
      setError('An unexpected error occurred. Please try again. / একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setStep('email'); // Reset the flow
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Recover Password / পাসওয়ার্ড পুনরুদ্ধার</h2>
            <p className="text-center text-gray-500 mb-6">Enter the email associated with your account. / আপনার অ্যাকাউন্টের সাথে যুক্ত ইমেলটি দিন।</p>
            {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your email / আপনার ইমেল দিন" required />
              </div>
              <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition">Send Code / কোড পাঠান</button>
            </form>
          </>
        );
      case 'code':
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Verify Code / কোড ভেরিফাই</h2>
            <p className="text-center text-gray-500 mb-6">Enter the 6-digit code sent to your email. / আপনার ইমেলে পাঠানো ৬-সংখ্যার কোডটি দিন।</p>
            {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
            {info && <div className="bg-blue-100 text-blue-800 text-sm p-3 rounded-md mb-4 text-center">{info}</div>}
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-center tracking-[1em]" placeholder="______" maxLength={6} required />
              </div>
              <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition">Verify / ভেরিফাই করুন</button>
            </form>
          </>
        );
      case 'reset':
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Set New Password / নতুন পাসওয়ার্ড</h2>
            <p className="text-center text-gray-500 mb-6">Enter a new password for your account. / আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড দিন।</p>
            {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="New password" required />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" placeholder="Confirm password" required />
              </div>
              <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition">Reset Password / পাসওয়ার্ড রিসেট</button>
            </form>
          </>
        );
      case 'success':
        return (
           <div className="text-center">
              <i className="fa-solid fa-circle-check text-5xl text-green-500 mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-800">Success! / সফল!</h2>
              <p className="text-gray-600 mt-2">Your password has been changed successfully. / আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।</p>
          </div>
        )
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Link to="/"><Logo className="h-12"/></Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="font-medium text-cyan-600 hover:underline">Back to Login / লগইন পেজে ফিরে যান</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
