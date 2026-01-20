import { createContext, useState, useContext, useCallback, useMemo, PropsWithChildren, useEffect } from 'react';
import { User, Job, Transaction, AppSettings, JobSubmission, Notice, Notification } from '../types';

// MOCK DATA
const initialUsers: User[] = [
  { id: 1, name: 'Azim', email: 'azim@demo.com', phone: '01700000001', password: 'password123', refId: '316944117843', leader: 'Sakib', joined: new Date('2024-01-05').toISOString(), isVerified: true, proJobActive: false, referredBy: null, verificationDate: new Date().toISOString(), isAdmin: true, isBlocked: false, isWithdrawalBlocked: false, wallets: { proJob: 0.00, referral: 0.00, gmail: 0.00, server: 0.00, salary: 0.00, jobBalance: 40.00 } },
  { id: 2, name: 'Rina', email: 'rina@demo.com', phone: '01700000002', password: 'password123', refId: '987654321012', leader: 'Azim', joined: new Date('2024-02-12').toISOString(), isVerified: false, proJobActive: false, referredBy: 1, verificationDate: null, isBlocked: false, isWithdrawalBlocked: false, wallets: { proJob: 10, referral: 5, gmail: 0, server: 0, salary: 0, jobBalance: 15 } },
  { id: 3, name: 'Kamal', email: 'kamal@demo.com', phone: '01700000003', password: 'password123', refId: '543210987654', leader: 'Sakib', joined: new Date('2024-03-20').toISOString(), isVerified: true, proJobActive: true, referredBy: null, verificationDate: new Date().toISOString(), isBlocked: true, isWithdrawalBlocked: true, withdrawalBlockReason: 'Suspicious activity detected.', wallets: { proJob: 150, referral: 25, gmail: 50, server: 0, salary: 0, jobBalance: 200 } },
  { id: 99, name: 'admin', email: 'admin@demo.com', phone: '01000000000', password: 'admin', refId: 'ADMIN', leader: 'System', joined: new Date('2024-01-01').toISOString(), isVerified: true, proJobActive: true, referredBy: null, verificationDate: new Date().toISOString(), isAdmin: true, isBlocked: false, isWithdrawalBlocked: false, wallets: { proJob: 0, referral: 0, gmail: 0, server: 0, salary: 0, jobBalance: 9999 } },
  { id: 100, name: 'user', email: 'user@demo.com', phone: '01123456789', password: 'user', refId: 'USER123', leader: 'System', joined: new Date('2024-08-01').toISOString(), isVerified: false, proJobActive: false, referredBy: null, verificationDate: null, isBlocked: false, isWithdrawalBlocked: false, isAdmin: false, wallets: { proJob: 0, referral: 0, gmail: 0, server: 0, salary: 0, jobBalance: 0 } },
  { id: 101, name: 'Admin Azim', email: 'gamingazim240@gmail.com', phone: '01234567890', password: 'Azim2016848133', refId: 'ADMINAZIM', leader: 'System', joined: new Date('2024-01-01').toISOString(), isVerified: true, proJobActive: true, referredBy: null, verificationDate: new Date().toISOString(), isAdmin: true, isBlocked: false, isWithdrawalBlocked: false, wallets: { proJob: 0, referral: 0, gmail: 0, server: 0, salary: 0, jobBalance: 10000 } }
];

const initialJobs: Job[] = [
  { 
    id: 1, 
    title: 'Registration Job (1) / রেজিস্ট্রেশন জব (1)', 
    description: '👇 Click on "Go To Task" below. You will be asked 2/3 questions. After answering correctly, you will be asked to spin. Once the spin is complete, you will be taken to a new website. Complete the registration on that website.\n\n👇 নিচের Go To Task এর উপর ক্লিক করার পর আপনাকে ২/৩ টা প্রশ্ন করবে প্রশ্নের সঠিক উত্তর দেওয়ার পর স্পিন করতে বলবে স্পิน সম্পূর্ণ হলে আপনাকে নতুন একটি ওয়েব সাইটে নিয়ে যাবে সেই ওয়েবসাইটের রেজিস্ট্রেশন সম্পন্ন করুন।', 
    thumbnail: 'https://i.ibb.co/Fz9WpW9/job-thumbnail-1.png', 
    likes: '11k', 
    views: '12k', 
    reward: 15, 
    proofsConfig: [ 
        { type: 'image', label: 'Take a screenshot before registration after clicking Go To Task / GO To Task এ ক্লিক পর রেজিস্ট্রেশন এর আগে একটি স্ক্রিনশট নেন' }, 
        { type: 'image', label: 'Provide the second screenshot after completing the registration. / রেজিস্ট্রেশন করার পর দ্বিতীয় স্ক্রিনশট দিন।' },
        { type: 'text', label: 'Enter the number or Gmail you used for registration / রেজিস্ট্রেশন করছেন যেই নাম্বার বা জিমেইল দিয়ে ওটা দেন' } 
    ],
    taskUrl: 'https://example-task-url.com/',
    rules: `If you cannot work by clicking the Go Task Link, click copy and paste it into any browser to complete it.
যদি Go Task Link এ ক্লিক করে কাজ না করতে পারেন তাহলে কপিতে ক্লিক করে যেকোন ব্রাউজারে পেস্ট করে সম্পূর্ণ করেন।`
  },
  { id: 2, title: 'Like Facebook Page / ফেসবুক পেজ লাইক দিন', description: 'Click on Go To Task and follow the page first. / Go To Task এর উপর ক্লিক করার পর প্রথম এ পেজটি ফলো করুন।', thumbnail: 'https://picsum.photos/seed/job2/400/200', likes: '8k', views: '10k', reward: 3, proofsConfig: [ { type: 'image', label: 'Provide a screenshot of the followed page. / ফলো করা পেজের স্ক্রিনশট দিন।' } ] },
];

const initialTransactions: Transaction[] = [
    { id: 1, userId: 2, userName: 'Rina', type: 'deposit', amount: 40, status: 'pending', date: new Date('2024-07-28').toISOString(), transactionId: 'TXN12345RINA', details: 'Account Verification' },
    { id: 2, userId: 3, userName: 'Kamal', type: 'withdrawal', amount: 50, status: 'pending', date: new Date('2024-07-27').toISOString(), withdrawalNumber: '01812345678', paymentMethod: 'nagad', details: 'Withdrawal Request' },
];

const initialSettings: AppSettings = {
    paymentNumbers: {
        bkash: '01600000001',
        nagad: '01600000002',
        rocket: '01600000003',
    },
    telegramLinks: {
        group: 'https://t.me/examplegroup',
        channel: 'https://t.me/examplechannel',
    },
    verificationFee: 40,
    referralBonus: 20,
}

const initialJobSubmissions: JobSubmission[] = [
    { id: 1, userId: 1, userName: 'Azim', jobId: 1, jobTitle: 'Registration Job (1)', proofs: [{ type: 'image', label: 'Screenshot 1', value: 'https://i.ibb.co/pnv6b6x/proof-1.png' }, { type: 'image', label: 'Screenshot 2', value: 'https://i.ibb.co/SRs0pLS/proof-2.png' }, { type: 'text', label: 'Email used', value: 'azim@demo.com' }], status: 'pending', submittedDate: new Date('2024-08-01').toISOString()}
];

const initialNotices: Notice[] = [
    { id: 1, title: "Welcome to Easy Earning!", content: "Welcome to our platform! Complete tasks and earn money easily. Join our Telegram channel for updates.", date: new Date("2024-08-01").toISOString(), isActive: true },
    { id: 2, title: "Scheduled Maintenance", content: "The platform will be down for scheduled maintenance on August 5th from 2 AM to 4 AM.", date: new Date("2024-08-02").toISOString(), isActive: false },
];

const getFromStorage = <T,>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error reading ${key} from storage`, e);
        return fallback;
    }
};

const saveToStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error saving ${key} to storage`, e);
    }
};

interface DataContextType {
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  transactions: Transaction[];
  appSettings: AppSettings;
  jobSubmissions: JobSubmission[];
  notices: Notice[];
  notifications: Notification[];
  login: (identifier: string, pass: string) => User | null;
  signup: (details: Omit<User, 'id' | 'refId' | 'leader' | 'joined' | 'isVerified' | 'proJobActive' | 'wallets' | 'referredBy' | 'verificationDate' | 'isAdmin' | 'isBlocked'> & { referralCode?: string }) => { success: boolean, message: string };
  logout: () => void;
  updateUserPassword: (email: string, newPass: string) => boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'userName' | 'userId'>) => void;
  updateTransactionStatus: (id: number, status: 'approved' | 'rejected', reason?: string) => void;
  updateUserBalance: (userId: number, wallet: keyof User['wallets'], newBalance: number) => void;
  updateUserProJobStatus: (userId: number, isActive: boolean) => void;
  addJob: (job: Omit<Job, 'id'>) => void;
  deleteJob: (id: number) => void;
  updateAppSettings: (newSettings: AppSettings) => void;
  addJobSubmission: (submission: Omit<JobSubmission, 'id' | 'submittedDate' | 'userName' | 'userId'>) => void;
  updateJobSubmissionStatus: (id: number, status: 'approved' | 'rejected') => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: number) => void;
  toggleUserBlockStatus: (userId: number) => void;
  toggleUserWithdrawalFreeze: (userId: number, reason?: string) => void;
  markNotificationsAsRead: () => void;
  sendBonusToUser: (userId: number, wallet: keyof User['wallets'], amount: number) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getFromStorage('currentUser', null));
  const [users, setUsers] = useState<User[]>(() => getFromStorage('users', initialUsers));
  const [jobs, setJobs] = useState<Job[]>(() => getFromStorage('jobs', initialJobs));
  const [transactions, setTransactions] = useState<Transaction[]>(() => getFromStorage('transactions', initialTransactions));
  const [appSettings, setAppSettings] = useState<AppSettings>(() => getFromStorage('appSettings', initialSettings));
  const [jobSubmissions, setJobSubmissions] = useState<JobSubmission[]>(() => getFromStorage('jobSubmissions', initialJobSubmissions));
  const [notices, setNotices] = useState<Notice[]>(() => getFromStorage('notices', initialNotices));
  const [notifications, setNotifications] = useState<Notification[]>(() => getFromStorage('notifications', []));

  useEffect(() => { saveToStorage('currentUser', currentUser) }, [currentUser]);
  useEffect(() => { saveToStorage('users', users) }, [users]);
  useEffect(() => { saveToStorage('jobs', jobs) }, [jobs]);
  useEffect(() => { saveToStorage('transactions', transactions) }, [transactions]);
  useEffect(() => { saveToStorage('appSettings', appSettings) }, [appSettings]);
  useEffect(() => { saveToStorage('jobSubmissions', jobSubmissions) }, [jobSubmissions]);
  useEffect(() => { saveToStorage('notices', notices) }, [notices]);
  useEffect(() => { saveToStorage('notifications', notifications) }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotification: Notification = {
        id: Date.now(),
        date: new Date().toISOString(),
        isRead: false,
        ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const login = useCallback((identifier: string, pass: string) => {
    const user = users.find(u => (u.email.toLowerCase() === identifier.toLowerCase() || u.name.toLowerCase() === identifier.toLowerCase()) && u.password === pass);
    if (user && !user.isBlocked) {
        setCurrentUser(user);
        return user;
    }
    return null;
  }, [users]);
  
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signup = useCallback((details: Omit<User, 'id' | 'refId' | 'leader' | 'joined' | 'isVerified' | 'proJobActive' | 'wallets' | 'referredBy' | 'verificationDate' | 'isAdmin' | 'isBlocked'> & { referralCode?: string }) => {
    if (users.some(u => u.email.toLowerCase() === details.email.toLowerCase())) {
        return { success: false, message: 'Email is already in use.' };
    }
    if (users.some(u => u.name.toLowerCase() === details.name.toLowerCase())) {
        return { success: false, message: 'Username is already taken.' };
    }
    if (users.some(u => u.phone === details.phone)) {
        return { success: false, message: 'Phone number is already in use.' };
    }

    const wasUserLoggedIn = !!currentUser;
    const referringUser = details.referralCode ? users.find(u => u.refId === details.referralCode) : null;

    const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        name: details.name,
        email: details.email,
        phone: details.phone,
        password: details.password,
        refId: Math.random().toString(36).substring(2, 15),
        leader: referringUser ? referringUser.name : 'System',
        joined: new Date().toISOString(),
        isVerified: false,
        proJobActive: false,
        isBlocked: false,
        isWithdrawalBlocked: false,
        wallets: { proJob: 0, referral: 0, gmail: 0, server: 0, salary: 0, jobBalance: 0 },
        referredBy: referringUser ? referringUser.id : null,
        verificationDate: null,
        isAdmin: false,
    };
    
    setUsers(prev => [...prev, newUser]);

    addNotification({
        type: 'signup',
        message: `${newUser.name} has just signed up.`,
        link: '/admin/users'
    });

    if (wasUserLoggedIn) {
      logout();
    }

    return { success: true, message: 'Account created successfully! Please log in.' };
  }, [users, addNotification, currentUser, logout]);

  const updateUserPassword = useCallback((email: string, newPass: string) => {
    let success = false;
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
            success = true;
            return { ...u, password: newPass };
        }
        return u;
    }));
    return success;
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'date' | 'userName' | 'userId'>) => {
    if (!currentUser) return;
    const newTx: Transaction = {
        id: Math.max(0, ...transactions.map(t => t.id), 0) + 1,
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toISOString(),
        ...tx
    };
    setTransactions(prev => [newTx, ...prev]);
    if (newTx.type === 'deposit') {
        addNotification({
            type: 'deposit',
            message: `New deposit of ৳${newTx.amount} from ${currentUser.name}.`,
            link: '/admin/deposits'
        });
    }
  }, [currentUser, transactions, addNotification]);

  const updateTransactionStatus = useCallback((id: number, status: 'approved' | 'rejected', reason?: string) => {
    let transactionToProcess: Transaction | undefined;
    
    const updatedTransactions = transactions.map(tx => {
        if (tx.id === id) {
            transactionToProcess = tx;
            return { ...tx, status, rejectionReason: status === 'rejected' ? reason : undefined };
        }
        return tx;
    });
    setTransactions(updatedTransactions);

    if (!transactionToProcess) return;

    if (transactionToProcess.type === 'deposit' && status === 'approved') {
        setUsers(prevUsers => {
            let referringUserName: string | undefined;
            const updatedUsersList = prevUsers.map(u => {
                if (u.id === transactionToProcess!.userId) {
                    referringUserName = u.name;
                    return { ...u, isVerified: true, verificationDate: new Date().toISOString() };
                }
                return u;
            });

            const userBeingVerified = updatedUsersList.find(u => u.id === transactionToProcess!.userId);
            if (userBeingVerified && userBeingVerified.referredBy) {
                const referrerIndex = updatedUsersList.findIndex(u => u.id === userBeingVerified!.referredBy);
                if (referrerIndex !== -1) {
                    const referrer = { ...updatedUsersList[referrerIndex] };
                    referrer.wallets = { ...referrer.wallets, referral: referrer.wallets.referral + appSettings.referralBonus };
                    updatedUsersList[referrerIndex] = referrer;
                    
                    const newTx: Transaction = {
                        id: Math.max(0, ...transactions.map(t => t.id), 0) + 1,
                        userId: referrer.id,
                        userName: referrer.name,
                        type: 'referral-bonus',
                        amount: appSettings.referralBonus,
                        status: 'approved',
                        date: new Date().toISOString(),
                        details: `Bonus for referring ${referringUserName || 'user'}`
                    };
                    setTransactions(prev => [newTx, ...prev]);
                }
            }
            
            const currentUserId = currentUser?.id;
            if (currentUserId && currentUserId === transactionToProcess.userId) {
                const updatedCurrentUser = updatedUsersList.find(u => u.id === currentUserId);
                if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
            } else if (currentUserId && userBeingVerified?.referredBy === currentUserId) {
                const updatedCurrentUser = updatedUsersList.find(u => u.id === currentUserId);
                 if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
            }
            
            return updatedUsersList;
        });
    } else if (transactionToProcess.type === 'withdrawal' && status === 'approved') {
         setUsers(prevUsers => {
            const updatedUsersList = prevUsers.map(u => {
                if (u.id === transactionToProcess!.userId) {
                     return { ...u, wallets: { ...u.wallets, jobBalance: u.wallets.jobBalance - transactionToProcess!.amount } };
                }
                return u;
            });
            if (currentUser && currentUser.id === transactionToProcess.userId) {
                const updatedCurrentUser = updatedUsersList.find(u => u.id === currentUser.id);
                if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
            }
            return updatedUsersList;
        });
    }
  }, [transactions, appSettings.referralBonus, currentUser]);

  const updateUserBalance = useCallback((userId: number, wallet: keyof User['wallets'], newBalance: number) => {
    setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            const newWallets = { ...u.wallets, [wallet]: newBalance };
            if (currentUser && currentUser.id === u.id) {
                setCurrentUser({ ...currentUser, wallets: newWallets });
            }
            return { ...u, wallets: newWallets };
        }
        return u;
    }));
  }, [currentUser]);

   const updateUserProJobStatus = useCallback((userId: number, isActive: boolean) => {
     setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            const updatedUser = { ...u, proJobActive: isActive };
            if (currentUser && currentUser.id === u.id) {
                setCurrentUser(updatedUser);
            }
            return updatedUser;
        }
        return u;
    }));
  }, [currentUser]);

  const addJob = useCallback((job: Omit<Job, 'id'>) => {
    const newJob: Job = {
        id: Math.max(0, ...jobs.map(j => j.id), 0) + 1,
        ...job
    };
    setJobs(prev => [newJob, ...prev]);
  }, [jobs]);
  
  const deleteJob = useCallback((id: number) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  const updateAppSettings = useCallback((newSettings: AppSettings) => {
    setAppSettings(newSettings);
  }, []);

  const addJobSubmission = useCallback((submission: Omit<JobSubmission, 'id' | 'submittedDate' | 'userName' | 'userId'>) => {
    if (!currentUser) return;
    const newSubmission: JobSubmission = {
        id: Math.max(0, ...jobSubmissions.map(s => s.id), 0) + 1,
        userId: currentUser.id,
        userName: currentUser.name,
        submittedDate: new Date().toISOString(),
        ...submission
    };
    setJobSubmissions(prev => [newSubmission, ...prev]);
    addNotification({
        type: 'submission',
        message: `New submission for "${newSubmission.jobTitle}" from ${currentUser.name}.`,
        link: '/admin/submissions'
    });
  }, [currentUser, jobSubmissions, addNotification]);
  
  const updateJobSubmissionStatus = useCallback((id: number, status: 'approved' | 'rejected') => {
    setJobSubmissions(prevSubs => {
        const updatedSubs = [...prevSubs];
        const subIndex = updatedSubs.findIndex(s => s.id === id);
        if (subIndex === -1) return prevSubs;

        const sub = updatedSubs[subIndex];
        if(sub.status !== 'pending') return prevSubs; // Avoid double processing

        updatedSubs[subIndex] = { ...sub, status };

        if (status === 'approved') {
            const job = jobs.find(j => j.id === sub.jobId);
            if (job) {
                setUsers(prevUsers => {
                    const newUsers = [...prevUsers];
                    const userIndex = newUsers.findIndex(u => u.id === sub.userId);
                    if (userIndex !== -1) {
                        const user = { ...newUsers[userIndex] };
                        user.wallets = { ...user.wallets, jobBalance: user.wallets.jobBalance + job.reward };
                        newUsers[userIndex] = user;

                        if (currentUser && currentUser.id === user.id) {
                            setCurrentUser(user);
                        }

                        const newTx: Transaction = {
                            id: Math.max(0, ...transactions.map(t => t.id), 0) + 1,
                            userId: sub.userId,
                            userName: sub.userName,
                            type: 'job-reward',
                            amount: job.reward,
                            status: 'approved',
                            date: new Date().toISOString(),
                            details: `Reward for: ${job.title}`
                        };
                        setTransactions(prevTx => [newTx, ...prevTx]);
                    }
                    return newUsers;
                });
            }
        }
        return updatedSubs;
    });
  }, [jobs, currentUser, transactions]);

  const addNotice = useCallback((notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
        id: Math.max(0, ...notices.map(n => n.id), 0) + 1,
        date: new Date().toISOString(),
        ...notice
    };
    setNotices(prev => [newNotice, ...prev]);
  }, [notices]);

  const updateNotice = useCallback((notice: Notice) => {
    setNotices(prev => prev.map(n => n.id === notice.id ? notice : n));
  }, []);
  
  const deleteNotice = useCallback((id: number) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleUserBlockStatus = useCallback((userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
  }, []);

  const toggleUserWithdrawalFreeze = useCallback((userId: number, reason?: string) => {
    setUsers(prev => prev.map(u => {
        if (u.id === userId) {
            const isNowBlocked = !u.isWithdrawalBlocked;
            const updatedUser = { 
                ...u, 
                isWithdrawalBlocked: isNowBlocked,
                withdrawalBlockReason: isNowBlocked ? reason : undefined
            };
            if (currentUser && currentUser.id === userId) {
                setCurrentUser(updatedUser);
            }
            return updatedUser;
        }
        return u;
    }));
  }, [currentUser]);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true })));
  }, []);

  const sendBonusToUser = useCallback((userId: number, wallet: keyof User['wallets'], amount: number) => {
    let success = false;
    setUsers(prevUsers => {
        const updatedUsers = [...prevUsers];
        const userIndex = updatedUsers.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            const userToUpdate = { ...updatedUsers[userIndex] };
            userToUpdate.wallets = { ...userToUpdate.wallets, [wallet]: userToUpdate.wallets[wallet] + amount };
            updatedUsers[userIndex] = userToUpdate;

            if (currentUser && currentUser.id === userId) {
                setCurrentUser(userToUpdate);
            }
            
            const newTx: Transaction = {
                id: Math.max(0, ...transactions.map(t => t.id), 0) + 1,
                userId: userId,
                userName: userToUpdate.name,
                type: 'job-reward',
                amount: amount,
                status: 'approved',
                date: new Date().toISOString(),
                details: `Admin bonus/salary to ${wallet} wallet`
            };
            setTransactions(prev => [newTx, ...prev]);

            success = true;
            return updatedUsers;
        }
        return prevUsers;
    });
    return success;
}, [users, currentUser, transactions]);


  const value = useMemo(() => ({
    currentUser, users, jobs, transactions, appSettings, jobSubmissions, notices, notifications,
    login, signup, logout, updateUserPassword, addTransaction, updateTransactionStatus,
    updateUserBalance, updateUserProJobStatus, addJob, deleteJob, updateAppSettings, addJobSubmission,
    updateJobSubmissionStatus, addNotice, updateNotice, deleteNotice, toggleUserBlockStatus, markNotificationsAsRead,
    sendBonusToUser, toggleUserWithdrawalFreeze,
  }), [
    currentUser, users, jobs, transactions, appSettings, jobSubmissions, notices, notifications,
    login, signup, logout, updateUserPassword, addTransaction, updateTransactionStatus,
    updateUserBalance, updateUserProJobStatus, addJob, deleteJob, updateAppSettings, addJobSubmission,
    updateJobSubmissionStatus, addNotice, updateNotice, deleteNotice, toggleUserBlockStatus, markNotificationsAsRead,
    sendBonusToUser, toggleUserWithdrawalFreeze,
  ]);
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
