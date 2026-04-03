import React, { useEffect, useState } from 'react';
import { ChevronRight, Trophy, Target, Zap, Swords, User } from 'lucide-react';
import { useFollowedPlayers } from '../context/FollowedPlayersContext';
import { getPlayerByName } from '../data/playerStore';

const PlayerProfile = () => {
    const [playername, setPlayername] = useState('');
    const [playerData, setPlayerData] = useState(null);
    const { isFollowingPlayer, toggleFollowPlayer } = useFollowedPlayers();
    const followed = playerData ? isFollowingPlayer(playerData.name) : false;

    useEffect(() => {
        // Extract player name from URL manually since we are using custom routing
        const path = window.location.pathname;
        const name = path.split('/player/')[1]; // Assumes /player/:playername format
        if (name) {
            setPlayername(decodeURIComponent(name));
        }
    }, []);

    useEffect(() => {
        if (!playername) return;

        // Simulating data fetch based on player name
        // In a real app, this would be an API call
        // For now, we'll try to find in existing data or generate mock

        // Check unified player store
        let found = getPlayerByName(playername);

        if (found) {
            // Get the first game entry for this player
            const gameData = found.games[0];
            setPlayerData({
                id: found.id,
                name: found.name,
                realName: found.realName,
                nationality: found.nationality,
                ...gameData
            });
        } else {
            // Fallback mock data
            setPlayerData({
                name: playername,
                realName: 'Pro Gamer',
                role: 'Legend',
                team: 'TBD',
                img: 'https://images.unsplash.com/photo-1566414419990-9b859ce6ef1d?auto=format&fit=crop&q=80',
                stats: { kd: '1.24', kills: '2450', matches: '89', mvp: '12' },
                recentMatches: [
                    { result: 'WIN', score: '13-11', map: 'Ancient', kda: '24/15/8' },
                    { result: 'LOSS', score: '9-13', map: 'Inferno', kda: '18/19/4' },
                    { result: 'WIN', score: '13-5', map: 'Mirage', kda: '31/10/2' }
                ]
            });
        }
    }, [playername]);

    if (!playerData) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-gold font-bold uppercase tracking-widest animate-pulse">Loading Profile...</div>;

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white pt-32 pb-20 font-sans animate-fade-in">
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <button onClick={handleBack} className="flex items-center gap-2 mb-8 text-gray-400 hover:text-gold transition-colors group">
                    <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Hub</span>
                </button>

                {/* Profile Header */}
                <div className="bg-bg-card border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-neon-red/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 border-2 border-dashed border-white/10 relative">
                            <div className="absolute inset-0 rounded-full animate-spin-slow border-t-2 border-gold/30" />
                            <img src={playerData.img} alt={playerData.name} className="w-full h-full rounded-full object-cover shadow-2xl" />
                            <div className="absolute bottom-2 right-4 w-6 h-6 bg-neon-green rounded-full border-4 border-bg-card" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    {playerData.name}
                                </h1>
                                <span className="px-4 py-1 bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs font-black uppercase tracking-widest rounded-full mb-4 md:mb-2">
                                    {playerData.role}
                                </span>
                            </div>
                            <h2 className="text-xl text-gray-400 font-bold uppercase tracking-[0.2em] mb-8 flex items-center justify-center md:justify-start gap-2">
                                <User className="w-4 h-4" /> {playerData.realName || 'Unknown'} • {playerData.team}
                            </h2>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <button
                                    onClick={() => toggleFollowPlayer(playerData)}
                                    className={`px-8 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-sm btn-glow border ${followed
                                        ? 'bg-gold text-bg-dark border-gold shadow-[0_0_30px_rgba(212,175,55,0.8)]'
                                        : 'bg-white/5 border-white/10 hover:bg-gold hover:text-bg-dark hover:border-gold'
                                        }`}
                                >
                                    {followed ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Target} label="K/D Ratio" value={playerData.stats.kd || '1.0'} color="text-gold" />
                    <StatCard icon={Swords} label="Total Kills" value={playerData.stats.kills || '0'} color="text-neon-red" />
                    <StatCard icon={Trophy} label="Win Rate" value="58%" color="text-warning-yellow" />
                    <StatCard icon={Zap} label="Headshot %" value="42%" color="text-white" />
                </div>

                {/* Recent Matches */}
                <h3 className="text-2xl font-black uppercase tracking-tight italic mb-6 flex items-center gap-3">
                    Recent Performance
                </h3>
                <div className="space-y-4">
                    {(playerData.recentMatches || []).map((match, idx) => (
                        <div key={idx} className="bg-bg-card border border-white/5 rounded-2xl p-6 flex flex-wrap items-center justify-between hover:border-gold/30 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className={`w-2 h-12 rounded-full ${match.result === 'WIN' ? 'bg-neon-green' : 'bg-red-500'}`} />
                                <div>
                                    <p className="text-xl font-black uppercase tracking-tight italic">{match.map}</p>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${match.result === 'WIN' ? 'text-neon-green' : 'text-red-500'}`}>{match.result}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Score</p>
                                <p className="text-xl font-black italic">{match.score}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">KDA</p>
                                <p className="text-xl font-black text-gold italic">{match.kda}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-bg-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
            <Icon className={`w-6 h-6 ${color}`} />
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
);

export default PlayerProfile;
