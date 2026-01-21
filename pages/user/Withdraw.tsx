import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';

type PaymentMethodType = 'bkash' | 'nagad' | 'rocket';

const withdrawalPackages = [
    { amount: 320, charge: 20, receive: 300 },
    { amount: 550, charge: 50, receive: 500 },
    { amount: 1000, charge: 30, receive: 970 },
    { amount: 2000, charge: 50, receive: 1950 },
    { amount: 3000, charge: 75, receive: 2925 },
    { amount: 5000, charge: 100, receive: 4900 },
];

const Withdraw = () => {
    const { currentUser, addTransaction, appSettings } = useData();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('nagad');
    const [withdrawalNumber, setWithdrawalNumber] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<(typeof withdrawalPackages[0]) | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!currentUser) return null;

    if (currentUser.isWithdrawalBlocked) {
        return (
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md border border-red-200">
                <i className="fa-solid fa-lock text-5xl text-red-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-800">Withdrawals Frozen</h2>
                <p className="text-gray-600 mt-2">Your ability to withdraw is temporarily suspended.</p>
                {currentUser.withdrawalBlockReason && <p className="text-sm bg-red-50 text-red-700 p-3 rounded-md mt-4">Reason: {currentUser.withdrawalBlockReason}</p>}
            </div>
        );
    }

    const currentBalance = currentUser.wallets.jobBalance;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setStatusMessage('');
        setIsLoading(true);

        if (!currentUser.isVerified) {
            setStatusMessage('Please verify your account to make a withdrawal.');
            setIsLoading(false);
            return;
        }

        if (!selectedPackage) {
            setStatusMessage('Please select a withdrawal amount.');
            setIsLoading(false);
            return;
        }
        if (!withdrawalNumber.trim() || !/^\d{11}$/.test(withdrawalNumber)) {
            setStatusMessage('Please enter a valid 11-digit number.');
            setIsLoading(false);
            return;
        }
        if (currentBalance < selectedPackage.amount) {
            setStatusMessage('Insufficient balance.');
            setIsLoading(false);
            return;
        }
        
        // Simulate API call and redirect
        setTimeout(() => {
            addTransaction({
                type: 'withdrawal',
                amount: selectedPackage.amount,
                status: 'pending',
                withdrawalNumber: withdrawalNumber,
                paymentMethod: paymentMethod,
            });
            navigate('/user/transactions', { state: { message: 'Withdrawal request submitted successfully!' } });
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Withdraw / টাকা উত্তোলন</h2>
                 <Link to="/user/withdrawal-rules" className="text-sm font-semibold text-cyan-600 hover:underline flex items-center space-x-1">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>View Rules</span>
                </Link>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Withdrawal Method / উত্তোলন পদ্ধতি</label>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                        <select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="bkash">bKash (Personal)</option>
                            <option value="nagad">Nagad (Personal)</option>
                            <option value="rocket">Rocket (Personal)</option>
                        </select>
                        <input
                            type="tel"
                            value={withdrawalNumber}
                            onChange={(e) => setWithdrawalNumber(e.target.value)}
                            placeholder="e.g., 01xxxxxxxxx"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Withdrawal Wallet / উত্তোলন ওয়ালেট</label>
                     <div className="p-4 rounded-lg text-center bg-blue-600 text-white shadow-lg">
                        <p className="font-semibold text-sm">Job Balance</p>
                        <p className="text-2xl font-bold">৳{currentBalance.toFixed(2)}</p>
                     </div>
                </div>
                
                <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Select Amount / পরিমাণ সিলেক্ট করুন</label>
                    <div className="grid grid-cols-2 gap-3">
                        {withdrawalPackages.map(pkg => (
                            <button
                                key={pkg.amount}
                                type="button"
                                onClick={() => setSelectedPackage(pkg)}
                                className={`p-3 border-2 rounded-lg text-left transition-all duration-200 text-sm transform active:scale-95 ${selectedPackage?.amount === pkg.amount ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white hover:border-blue-400'}`}
                            >
                                <p className="font-bold text-xl">৳ {pkg.amount}</p>
                                <p className={selectedPackage?.amount === pkg.amount ? 'text-blue-100' : 'text-gray-500'}>Charge: ৳ {pkg.charge}</p>
                                <p className={selectedPackage?.amount === pkg.amount ? 'text-blue-200' : 'text-gray-600'}>Receive: ৳ {pkg.receive}</p>
                            </button>
                        ))}
                    </div>
                </div>
                
                {statusMessage && (
                    <p className={`text-sm text-center font-semibold py-2 rounded-lg ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{statusMessage}</p>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-paper-plane"></i>
                            <span>Confirm Withdrawal / উত্তোলন নিশ্চিত করুন</span>
                        </>
                    )}
                </button>
            </form>
            
            <a 
                href={appSettings.telegramLinks.group}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-5 w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg z-20 hover:scale-110 transition-transform"
                aria-label="Contact Helpline on Telegram"
            >
                <i className="fa-brands fa-telegram fa-xl"></i>
            </a>
        </div>
    );
};

export default Withdraw;