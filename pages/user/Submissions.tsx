import { useData } from '../../context/DataContext';

const Submissions = () => {
    const { currentUser, jobSubmissions } = useData();

    if (!currentUser) return null;
    
    const userSubmissions = jobSubmissions.filter(sub => sub.userId === currentUser.id);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Submissions</h2>
            
            {userSubmissions.length > 0 ? (
                <div className="space-y-4">
                    {userSubmissions.map(sub => (
                        <div key={sub.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-start mb-3 pb-3 border-b">
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{sub.jobTitle}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(sub.submittedDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                                    sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {sub.status}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-2">My Proofs:</h4>
                                <div className="space-y-3">
                                    {sub.proofs.map((proof, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium text-gray-700 break-words mb-1">{proof.label}:</p>
                                            {proof.type === 'image' ? (
                                                <a href={proof.value} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                                                    <img src={proof.value} alt="Submitted proof" className="max-h-32 rounded border object-contain" />
                                                </a>
                                            ) : (
                                                <p className="text-gray-800 bg-slate-50 p-2 rounded-md break-all text-xs">{proof.value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md border">
                    <p>You have no submissions yet.</p>
                </div>
            )}
        </div>
    );
};

export default Submissions;
