import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

interface LeaderboardUser extends User {
    score: number | string;
}

const Leaderboard = () => {
    const { users } = useData();

    const topEarners = useMemo(() => {
        return [...users]
            .filter(u => !u.isAdmin)
            .map(user => ({
                ...user,
                totalEarnings: Object.values(user.wallets).reduce((sum: number, val: number) => sum + val, 0)
            }))
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .slice(0, 10);
    }, [users]);

    const topReferrers = useMemo(() => {
        const referralCounts: { [key: number]: number } = {};
        users.forEach(user => {
            if (user.referredBy !== null) {
                referralCounts[user.referredBy] = (referralCounts[user.referredBy] || 0) + 1;
            }
        });

        return [...users]
            .filter(u => !u.isAdmin)
            .map(user => ({
                ...user,
                referralCount: referralCounts[user.id] || 0
            }))
            .sort((a, b) => b.referralCount - a.referralCount)
            .slice(0, 10);
    }, [users]);
    
    const rankColors = [
        'text-yellow-400', // 1st
        'text-gray-400',  // 2nd
        'text-yellow-600' // 3rd
    ];

    const renderLeaderboard = (data: LeaderboardUser[], title: string, scoreLabel: string) => (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
            <ul className="space-y-3">
                {data.map((user, index) => (
                    <li key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center">
                            <span className={`w-8 font-bold text-lg text-center ${rankColors[index] || 'text-gray-500'}`}>
                                {index < 3 ? <i className="fas fa-medal"></i> : index + 1}
                            </span>
                            <span className="font-semibold text-gray-700 ml-3">{user.name}</span>
                        </div>
                        <span className="font-bold text-cyan-600">{user.score} {scoreLabel}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="space-y-8">
             <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Leaderboard 🏆</h2>
            {renderLeaderboard(
                topEarners.map(u => ({ ...u, score: `৳${u.totalEarnings.toFixed(2)}` })),
                'Top Earners',
                ''
            )}
            {renderLeaderboard(
                topReferrers.map(u => ({ ...u, score: u.referralCount })),
                'Top Referrers',
                'Referrals'
            )}
        </div>
    );
};

export default Leaderboard;
