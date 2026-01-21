import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

const SellGmail = () => {
    const { currentUser, addGmailSubmission, gmailSubmissions } = useData();
    const [gmailAddress, setGmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryPhone, setRecoveryPhone] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    if (!currentUser) return null;
    
    const userSubmissions = useMemo(() => {
        return gmailSubmissions
            .filter(sub => sub.userId === currentUser.id)
            .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
    }, [gmailSubmissions, currentUser.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setStatusMessage({ type: '', text: '' });

        if (!gmailAddress || !password || !recoveryPhone) {
            setStatusMessage({ type: 'error', text: 'Please fill all fields.' });
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            addGmailSubmission({ gmailAddress, password, recoveryPhone });
            setIsLoading(false);
            setStatusMessage({ type: 'success', text: 'Your Gmail account has been submitted for review. An admin will check it and set a price.' });
            setGmailAddress('');
            setPassword('');
            setRecoveryPhone('');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sell Your Gmail Account</h2>
                <p className="text-sm text-gray-600 mb-4">Submit your Gmail account details below. Our admin team will review it, and if approved, they will set a price and the amount will be added to your Gmail wallet.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gmail Address</label>
                        <input type="email" value={gmailAddress} onChange={e => setGmailAddress(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recovery Phone Number</label>
                        <input type="tel" value={recoveryPhone} onChange={e => setRecoveryPhone(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>

                    {statusMessage.text && (
                        <p className={`text-sm p-3 rounded-md ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage.text}
                        </p>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 transition disabled:bg-cyan-400">
                        {isLoading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Gmail Sale Submissions</h3>
                {userSubmissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Gmail</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userSubmissions.map(sub => (
                                    <tr key={sub.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{sub.gmailAddress}</td>
                                        <td className="px-4 py-3">{new Date(sub.submittedDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                                sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{sub.price ? `৳${sub.price.toFixed(2)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You have not submitted any Gmail accounts for sale.</p>
                )}
            </div>
        </div>
    );
}

export default SellGmail;