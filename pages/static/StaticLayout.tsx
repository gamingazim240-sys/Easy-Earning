import { Outlet, Link } from 'react-router-dom';
import Logo from '../../components/Logo';

const StaticLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/">
            <Logo className="h-10" />
          </Link>
          <Link to="/login" className="px-4 py-2 bg-cyan-600 text-white text-sm font-bold rounded-lg hover:bg-cyan-700 transition">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
            <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Easy Earning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StaticLayout;
