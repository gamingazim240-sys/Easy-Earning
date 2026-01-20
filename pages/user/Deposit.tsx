import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BkashIcon, NagadIcon, RocketIcon } from '../../components/PaymentIcons';
import { useNavigate, Navigate } from 'react-router-dom';

type PaymentMethod = 'bkash' | 'nagad' | 'rocket';

const paymentMethods = {
    bkash: {
        name: 'bKash',
        icon: <BkashIcon />,
        color: 'pink'
    },
    nagad: {
        name: 'Nagad',
        icon: <NagadIcon />,
        color: 'orange'
    },
    rocket: {
        name: 'Rocket',
        icon: <RocketIcon />,
        color: 'purple'
    },
};

const colorClasses = {
    pink: {
        border: 'border-pink-500',
        bg: 'bg-pink-50',
        text: 'text-pink-800',
        bgDark: 'bg-pink-500',
        textLight: 'text-pink-600',
        hoverText: 'hover:text-pink-800'
    },
    orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        bgDark: 'bg-orange-500',
        textLight: 'text-orange-600',
        hoverText: 'hover:text-orange-800'
    },
    purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        bgDark: 'bg-purple-500',
        textLight: 'text-purple-600',
        hoverText: 'hover:text-purple-800'
    }
};

const Deposit = () => {
    const { addTransaction, currentUser, transactions, appSettings } = useData();
    const navigate = useNavigate();
    const [transactionId, setTransactionId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [activeMethod, setActiveMethod] = useState<PaymentMethod>('bkash');
    const [copied, setCopied] = useState(false);

    if (!currentUser) return null;

    if (currentUser.isVerified) {
        return (
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <i className="fa-solid fa-circle-check text-5xl text-green-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-800">Account Verified</h2>
                <p className="text-gray-600 mt-2">Your account is already verified. You can now access all features.</p>
            </div>
        );
    }

    const hasPendingDeposit = transactions.some(
        tx => tx.userId === currentUser.id && tx.type === 'deposit' && tx.status === 'pending'
    );

    if (hasPendingDeposit) {
        return <Navigate to="/user/pending-verification" replace />;
    }
    
    const activePaymentMethodDetails = appSettings.paymentNumbers[activeMethod];

    const handleCopyToClipboard = () => {
        if (!activePaymentMethodDetails || !navigator.clipboard) return;
        navigator.clipboard.writeText(activePaymentMethodDetails);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (transactionId.trim() === '') {
            setStatusMessage('Please enter the transaction ID.');
            return;
        }
        addTransaction({
            type: 'deposit',
            amount: appSettings.verificationFee,
            status: 'pending',
            transactionId: transactionId,
        });
        navigate('/user/pending-verification');
    };
    
    const activeColorName = paymentMethods[activeMethod].color as keyof typeof colorClasses;
    const selectedColors = colorClasses[activeColorName];

    return (
        <div className="max-w-xl mx-auto bg-gray-100 p-2 sm:p-4 rounded-lg">
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-gray-800 text-center mb-4">Select Payment Method / পেমেন্ট মেথড নির্বাচন করুন</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {(Object.keys(paymentMethods) as PaymentMethod[]).map((method) => (
                        <button
                            key={method}
                            onClick={() => setActiveMethod(method)}
                            className={`p-3 rounded-lg border-2 flex items-center justify-center transition ${activeMethod === method ? `${colorClasses[paymentMethods[method].color as keyof typeof colorClasses].border} ${colorClasses[paymentMethods[method].color as keyof typeof colorClasses].bg}` : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            {paymentMethods[method].icon}
                        </button>
                    ))}
                </div>

                <div className={`p-4 rounded-lg ${selectedColors.bg} border ${selectedColors.border}`}>
                    <h4 className={`font-bold text-lg mb-4 text-center ${selectedColors.text}`}>{paymentMethods[activeMethod].name} Payment Guide</h4>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Send Money Number</p>
                            <div className="flex items-center gap-2 mt-1">
                                <strong className="text-lg text-gray-800">{activePaymentMethodDetails}</strong>
                                <button onClick={handleCopyToClipboard} className={`${selectedColors.textLight} ${selectedColors.hoverText}`}>
                                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Payment Amount</p>
                            <strong className="text-lg text-gray-800">৳ {appSettings.verificationFee}</strong>
                        </div>
                    </div>
                    
                    <ol className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-3"><div className={`w-5 h-5 ${selectedColors.bgDark} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>1</div><span>App/Menu থেকে <strong>Send Money</strong> সিলেক্ট করুন</span></li>
                        <li className="flex items-start gap-3"><div className={`w-5 h-5 ${selectedColors.bgDark} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>2</div><span>উপরে দেওয়া নম্বরে <strong>{appSettings.verificationFee} BDT</strong> টাকা পাঠান</span></li>
                        <li className="flex items-start gap-3"><div className={`w-5 h-5 ${selectedColors.bgDark} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>3</div><span>আপনার PIN দিন এবং Payment Complete করুন</span></li>
                        <li className="flex items-start gap-3"><div className={`w-5 h-5 ${selectedColors.bgDark} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>4</div><span>Confirmation SMS থেকে <strong>Transaction ID</strong> কপি করুন</span></li>
                        <li className="flex items-start gap-3"><div className={`w-5 h-5 ${selectedColors.bgDark} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>5</div><span>Transaction ID টি নিচের VERIFY বক্সে বসান</span></li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                 <form onSubmit={handleSubmit}>
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-green-500">
                         <i className="fa-solid fa-receipt text-gray-400 px-2"></i>
                         <input
                            type="text"
                            id="transactionId"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g., 8KJD9D8R4"
                            className="w-full bg-transparent focus:outline-none"
                            required
                        />
                    </div>
                    
                    {statusMessage && (
                        <p className="text-sm text-center my-4 text-red-600">{statusMessage}</p>
                    )}

                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition mt-4">
                        Verify Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Deposit;
