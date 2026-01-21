import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Job, SubmittedProof } from '../../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const JobApplyModal = ({ job, onClose }: { job: Job, onClose: () => void }) => {
    const { addJobSubmission } = useData();
    const [proofValues, setProofValues] = useState<string[]>(() => Array(job.proofsConfig.length).fill(''));
    const [previews, setPreviews] = useState<(string | null)[]>(() => Array(job.proofsConfig.length).fill(null));
    const [message, setMessage] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setProofValues(p => {
                const newValues = [...p];
                newValues[index] = base64;
                return newValues;
            });
            setPreviews(p => {
                const newPreviews = [...p];
                newPreviews[index] = URL.createObjectURL(file);
                return newPreviews;
            });
        }
    };
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setProofValues(p => {
            const newValues = [...p];
            newValues[index] = value;
            return newValues;
        });
    };

    const handleCopy = () => {
        if (job.taskUrl && navigator.clipboard) {
            navigator.clipboard.writeText(job.taskUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleSubmit = () => {
        const isAllProofsSubmitted = proofValues.every(p => p && p.trim() !== '');
        if (!isAllProofsSubmitted) {
            setMessage('Please provide all required proofs. / অনুগ্রহ করে সমস্ত প্রয়োজনীয় প্রমাণ দিন।');
            return;
        }
        
        const proofsForSubmission: SubmittedProof[] = job.proofsConfig.map((config, index) => ({
            ...config,
            value: proofValues[index]
        }));

        addJobSubmission({
            jobId: job.id,
            jobTitle: job.title,
            proofs: proofsForSubmission,
            status: 'pending'
        });

        setMessage('Your proof has been submitted successfully! / আপনার প্রমাণ সফলভাবে জমা দেওয়া হয়েছে!');
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                    <h3 className="text-xl font-bold text-gray-800">Submit Proof</h3>
                     <div className="text-sm font-bold text-white bg-cyan-600 px-3 py-1 rounded-full">৳{job.reward}</div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                    <img src={job.thumbnail} alt={job.title} className="w-full h-auto max-h-48 object-cover rounded-lg" />
                    
                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{job.title}</h4>
                        <p className="text-gray-600 whitespace-pre-wrap text-sm">{job.description}</p>
                    </div>

                    {job.taskUrl && (
                        <div className="bg-slate-50 p-3 rounded-lg border">
                            <input 
                                type="text" 
                                readOnly 
                                value={job.taskUrl}
                                className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none mb-2"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleCopy} className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition text-sm flex items-center justify-center">
                                    <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'} mr-2`}></i> {isCopied ? 'Copied!' : 'Copy Link'}
                                </button>
                                <a href={job.taskUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-500 text-white text-center font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center">
                                    Go to Task Link
                                </a>
                            </div>
                        </div>
                    )}

                    {job.rules && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-lg text-gray-800 mb-2 text-center">Rule Box / নিয়ম বক্স</h4>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm">{job.rules}</div>
                        </div>
                    )}

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Submit Your Proofs / আপনার প্রমাণ জমা দিন</h4>
                      <div className="space-y-4">
                          {job.proofsConfig.map((config, index) => (
                              <div key={index}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
                                  {config.type === 'image' ? (
                                    <>
                                        <input type="file" name="proof" accept="image/*" onChange={(e) => handleFileChange(e, index)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" required/>
                                        {previews[index] && <img src={previews[index]!} alt={`Preview ${index+1}`} className="mt-2 h-24 w-auto rounded-md object-contain border" />}
                                    </>
                                  ) : (
                                    <input type="text" value={proofValues[index]} onChange={(e) => handleTextChange(e, index)} placeholder={config.label} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
                                  )}
                              </div>
                          ))}
                      </div>
                    </div>
                </div>
                 {message && <p className={`text-center text-sm px-6 py-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel / বাতিল</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 flex items-center justify-center space-x-2">
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>Submit Proof</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { currentUser, jobSubmissions } = useData();
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);

  const hasSubmitted = useMemo(() => {
    if (!currentUser) return false;
    return jobSubmissions.some(
      submission => submission.userId === currentUser.id && submission.jobId === job.id
    );
  }, [currentUser, jobSubmissions, job.id]);

  return (
    <>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
            <img src={job.thumbnail} alt={job.title} className="w-full h-32 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span><i className="fa-solid fa-thumbs-up mr-1 text-blue-500"></i> {job.likes}</span>
                    <span><i className="fa-solid fa-eye mr-1 text-gray-400"></i> {job.views}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{job.title}</h3>
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-cyan-600">৳{job.reward}</span>
                  {hasSubmitted ? (
                     <button disabled className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed text-sm flex items-center">
                        <i className="fa-solid fa-check mr-2"></i> Submitted
                    </button>
                  ) : (
                    <button onClick={() => setApplyModalOpen(true)} className="bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 transition text-sm">
                      Details
                    </button>
                  )}
                </div>
            </div>
        </div>
        {isApplyModalOpen && <JobApplyModal job={job} onClose={() => setApplyModalOpen(false)} />}
    </>
  );
};

const Jobs = () => {
  const { jobs } = useData();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Jobs</h2>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
            ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md border">
            <p>No jobs available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
