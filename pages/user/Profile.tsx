import { useData } from '../../context/DataContext';
import { NavLink } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useData();

  if (!currentUser) return null;

  const profileItems = [
    { label: 'Name', value: currentUser.name },
    { label: 'Reference ID', value: currentUser.refId },
    { label: 'Joined Date', value: new Date(currentUser.joined).toLocaleDateString() },
    { label: 'Verification Status', value: currentUser.isVerified ? 'Verified' : 'Not Verified' },
    { label: 'Pro Job Status', value: currentUser.proJobActive ? 'Active' : 'Inactive' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
            {currentUser.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
          <p className="text-gray-500">{currentUser.refId}</p>
        </div>

        <div className="space-y-4">
          {profileItems.map(item => (
            <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
              <span className={`text-sm font-semibold ${
                item.label === 'Verification Status' ? (currentUser.isVerified ? 'text-green-600' : 'text-red-600') : 
                item.label === 'Pro Job Status' ? (currentUser.proJobActive ? 'text-green-600' : 'text-red-600') : 
                'text-gray-800'
              }`}>{item.value}</span>
            </div>
          ))}
        </div>
        
        {!currentUser.isVerified && (
            <div className="mt-6 text-center bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Your Account is Not Verified / আপনার অ্যাকাউন্ট ভেরিফাইড নয়</h2>
                <p className="text-gray-600 mb-4">Please verify to access all features. / অনুগ্রহ করে ভেরিফাই করুন।</p>
                <NavLink to="/user/deposit" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105">
                    <i className="fa-solid fa-lock mr-2"></i> Verify Now / এখনই ভেরিফাই করুন
                </NavLink>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
