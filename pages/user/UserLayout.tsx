import { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useData } from '../../context/DataContext';

const UserLayout = () => {
  const { currentUser, logout, appSettings, transactions } = useData();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);
  const navigate = useNavigate();

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    const notifications = [];
    const hasPendingWithdrawal = transactions.some(
      tx => tx.userId === currentUser.id && tx.type === 'withdrawal' && tx.status === 'pending'
    );
    if (hasPendingWithdrawal) {
      notifications.push('আপনার একটি Withdraw Request বর্তমানে Pending আছে।');
    }
    const today = new Date().getDate();
    if (today === 9) {
      notifications.push('আপনার Withdraw Date আগামীকাল (১০ তারিখ)।');
    }
    return notifications;
  }, [currentUser, transactions]);

  useEffect(() => {
    setVisibleNotifications(userNotifications);
  }, [userNotifications]);

  if (!currentUser) {
    // This should ideally not be reached due to ProtectedRoute, but as a fallback
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleDismissNotification = (index: number) => {
    setVisibleNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const navLinks = [
    { name: 'Dashboard', path: '/user/dashboard', icon: 'fa-solid fa-table-columns' },
    { name: 'My Jobs', path: '/user/jobs', icon: 'fa-solid fa-briefcase' },
    { name: 'My Submissions', path: '/user/submissions', icon: 'fa-solid fa-list-check' },
    { name: 'Transactions', path: '/user/transactions', icon: 'fa-solid fa-receipt' },
    { name: 'Leaderboard', path: '/user/leaderboard', icon: 'fa-solid fa-trophy' },
    { name: 'Profile', path: '/user/profile', icon: 'fa-solid fa-user' },
    { name: 'Withdraw', path: '/user/withdraw', icon: 'fa-solid fa-wallet' },
    { name: 'Withdrawal Rules', path: '/user/withdrawal-rules', icon: 'fa-solid fa-gavel' },
    { name: 'Withdrawal FAQ', path: '/user/withdrawal-faq', icon: 'fa-solid fa-circle-question' },
    { name: 'Helpline', path: appSettings.telegramLinks.group, icon: 'fa-solid fa-headset' },
  ];

  const location = useLocation();
  const getPageTitle = () => {
    const currentPath = location.pathname;
    const link = navLinks.find(l => l.path === currentPath);
    if(currentPath === '/user/deposit') return 'Deposit';
    if(currentPath === '/user/pending-verification') return 'Verification';
    return link ? link.name : 'Easy Earning';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-800">
      <div className="p-4 bg-cyan-600 text-white">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-white lg:hidden">
              <i className="fa-solid fa-xmark fa-xl"></i>
            </button>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${currentUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {currentUser.isVerified ? 'Verified' : 'Not Verified'}
        </span>
      </div>
      <div className="p-4 text-sm space-y-2 border-b">
        <p>Ref ID: {currentUser.refId}</p>
        <p>Joined: {new Date(currentUser.joined).toLocaleDateString()}</p>
        {!currentUser.proJobActive && (
          <div className="p-2 text-center bg-red-100 text-red-700 rounded-md text-xs mt-2">
            Pro Job Not Active
          </div>
        )}
      </div>
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          link.path.startsWith('http') ? (
                 <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSidebarOpen(false)}
                    className={'flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100'}
                  >
                    <i className={`${link.icon} w-5 text-center`}></i>
                    <span>{link.name}</span>
                  </a>
            ) : (
                 <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'hover:bg-gray-100'}`}
                  >
                    <i className={`${link.icon} w-5 text-center`}></i>
                    <span>{link.name}</span>
                  </NavLink>
            )
        ))}
         <button
            onClick={handleLogout}
            className={'w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100'}
          >
            <i className={'fa-solid fa-right-from-bracket w-5 text-center'}></i>
            <span>Logout</span>
          </button>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="hidden lg:block w-72 h-full shadow-lg">
        <SidebarContent />
      </aside>

      <div 
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-40 transform transition-transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 lg:hidden">
              <i className="fa-solid fa-bars fa-lg"></i>
            </button>
             <div className="hidden sm:block"><Logo className="h-8"/></div>
             <h1 className="sm:hidden text-lg font-bold text-gray-800">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser.isAdmin && (
              <NavLink 
                to="/admin/dashboard" 
                className="flex items-center space-x-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                aria-label="Go to Admin Panel"
              >
                <i className="fa-solid fa-user-shield"></i>
                <span className="hidden sm:inline">Admin</span>
              </NavLink>
            )}
            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-4 space-y-2">
            {visibleNotifications.map((msg, i) => (
                <div key={i} className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md flex justify-between items-center" role="alert">
                    <p className="font-semibold text-sm">{msg}</p>
                    <button onClick={() => handleDismissNotification(i)} className="text-blue-500 hover:text-blue-700">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            ))}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
