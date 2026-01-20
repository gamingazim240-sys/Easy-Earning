import { useData } from '../../context/DataContext';
import { Navigate, NavLink } from 'react-router-dom';

const PendingVerification = () => {
    const { currentUser, transactions } = useData();

    if (!currentUser) return <Navigate to="/login" replace />;

    // If user is now verified, redirect to dashboard
    if (currentUser.isVerified) {
        return <Navigate to="/user/dashboard" replace />;
    }

    const latestDeposit = transactions
        .filter(tx => tx.userId === currentUser.id && tx.type === 'deposit')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // If no deposit transaction found, maybe they landed here by mistake. Send to deposit page.
    if (!latestDeposit) {
        return <Navigate to="/user/deposit" replace />;
    }

    if (latestDeposit.status === 'rejected') {
        return (
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <i className="fa-solid fa-circle-xmark text-5xl text-red-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-800">Verification Rejected</h2>
                <p className="text-gray-600 mt-2 mb-6">Your verification request was rejected. Please check your transaction details and try again.</p>
                <NavLink to="/user/deposit" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700">
                    Try Again
                </NavLink>
            </div>
        );
    }
    
    // Default: Pending status
    return (
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Pending</h2>
            <p className="text-gray-600 mt-2">Your verification request has been submitted and is currently under review. Please be patient.</p>
            <div className="mt-4 text-sm text-gray-500">
                <p>Transaction ID: <span className="font-mono">{latestDeposit.transactionId}</span></p>
                <p>Amount: <span className="font-bold">৳{latestDeposit.amount.toFixed(2)}</span></p>
            </div>
        </div>
    );
};

export default PendingVerification;
