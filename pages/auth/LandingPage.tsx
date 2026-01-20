import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <Logo className="h-16"/>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Easy Earning</h1>
          <p className="text-gray-600 mt-2 mb-8">আপনার উপার্জনের সহজ পথ</p>

          <div className="space-y-4">
            <Link 
              to="/login" 
              className="block w-full bg-cyan-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 shadow-md text-lg"
            >
              Login / লগইন করুন
            </Link>
            <Link 
              to="/signup" 
              className="block w-full bg-green-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 shadow-md text-lg"
            >
              Sign Up / অ্যাকাউন্ট খুলুন
            </Link>
          </div>
        </div>
      </div>
       <footer className="absolute bottom-4 text-center text-xs text-gray-500">
        <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
        </div>
        <p className="mt-2">&copy; {new Date().getFullYear()} Easy Earning. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
