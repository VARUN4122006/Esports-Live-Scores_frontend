import { useState, useRef } from 'react';
import {
    User, Users, Heart, Calendar, Camera, ChevronRight, Lock,
    Bell, BellOff, Trash2, TrendingUp, Eye, EyeOff, ArrowRight, X,
    Gamepad2, Shield
} from 'lucide-react';
import { dashboardData } from '../data/dashboardData';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useFollowedPlayers } from '../context/FollowedPlayersContext';
import apiClient from '../api/apiClient';

const gameLogos = {
    "Free Fire": "https://static-cdn.jtvnw.net/ttv-boxart/502732-600x800.jpg",
    "Battlegrounds Mobile India": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMqXdkuLMcpArjl9XsU0gvWSscdyHefkoh9Q&s",
    "Valorant": "https://static-cdn.jtvnw.net/ttv-boxart/516575-600x800.jpg",
    "League of Legends": "https://static-cdn.jtvnw.net/ttv-boxart/21779-600x800.jpg",
    "Dota 2": "https://static-cdn.jtvnw.net/ttv-boxart/29595-600x800.jpg",
    "Counter-Strike 2": "https://static-cdn.jtvnw.net/ttv-boxart/32399-600x800.jpg"
};

const GAME_SLUG_MAP = {
    'Valorant': 'valorant',
    'Battlegrounds Mobile India': 'battlegroundsmobileindia',
    'BGMI': 'battlegroundsmobileindia',
    'Free Fire': 'freefire',
    'League of Legends': 'leagueoflegends',
    'Dota 2': 'dota2',
    'Counter-Strike 2': 'cs2',
    'CS2': 'cs2',
    'CS 2': 'cs2'
};

const Dashboard = ({ onBack, onNavigate, refreshUser }) => {
    const { followedTeams, unfollowTeam } = useFollowedTeams();
    const { followedPlayers, unfollowPlayer } = useFollowedPlayers();

    const handleViewTeam = (team) => {
        const gameSlug = GAME_SLUG_MAP[team.game] || team.game.toLowerCase().replace(/\s+/g, '');
        onNavigate(`/game/${gameSlug}#teams:${team.id}`);
    };

    const handleViewPlayer = (player) => {
        onNavigate(`/player/${player.name}`);
    };

    const [user, setUser] = useState(() => {
        const sessionUser = sessionStorage.getItem('user');
        const persistentUser = localStorage.getItem('user');
        return (sessionUser ? JSON.parse(sessionUser) : (persistentUser ? JSON.parse(persistentUser) : dashboardData.user));
    });
    const [favGames, setFavGames] = useState(() => {
        const saved = localStorage.getItem('esportsFavGames');
        return saved ? JSON.parse(saved) : ["Valorant", "League of Legends"];
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'password' | 'delete' | null
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const fileInputRef = useRef(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const updatedUser = { ...user, avatar: reader.result };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Sync with backend if authenticated
                if (apiClient.auth.isAuthenticated()) {
                    try {
                        await apiClient.auth.updateProfile({ avatar: reader.result });
                        console.log('Avatar updated on server');
                    } catch (error) {
                        console.error('Failed to update avatar on server:', error);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match!");
            return;
        }
        console.log("Password changed successfully", passwordData);
        alert("Password updated successfully!");
        setPasswordData({ current: '', new: '', confirm: '' });
        setActiveModal(null);
    };

    const handleDeleteAccount = () => {
        const savedUsers = JSON.parse(localStorage.getItem('esports_users') || '[]');
        const updatedUsers = savedUsers.filter(u => u.email !== user.email);
        localStorage.setItem('esports_users', JSON.stringify(updatedUsers));

        localStorage.removeItem('user');
        localStorage.removeItem('esportsFavGames');
        sessionStorage.removeItem('user');

        alert("Account deleted. Redirecting to home...");
        window.location.href = '/';
    };

    const toggleGame = async (gameName) => {
        setFavGames(prev => {
            const updated = prev.includes(gameName) ? prev.filter(g => g !== gameName) : [...prev, gameName];
            localStorage.setItem('esportsFavGames', JSON.stringify(updated));

            // Sync with backend if authenticated
            if (apiClient.auth.isAuthenticated()) {
                apiClient.auth.updateProfile({ favoriteGames: updated })
                    .then(() => console.log('Favorite games updated on server'))
                    .catch(err => console.error('Failed to update favorite games:', err));
            }

            return updated;
        });
    };


    const formatPopularity = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white pt-24 pb-20 relative overflow-hidden font-sans">
            {/* Modal Overlay */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                    />

                    <div className="relative w-full max-w-md bg-card border border-white/10 rounded-2xl p-8 overflow-hidden animate-scale-in">
                        {/* Accent line for modal */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-crimson to-transparent" />

                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {activeModal === 'password' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <Lock className="w-6 h-6 text-crimson" />
                                        Update Password
                                    </h3>
                                    <p className="text-gray-500 text-sm">Enhance your account security with a new password.</p>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Current Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type={showPasswords.current ? "text" : "password"}
                                                required
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-crimson/40 transition-all font-mono"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showPasswords.current ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                required
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-crimson/40 transition-all font-mono"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showPasswords.new ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Confirm New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-crimson transition-colors" />
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                required
                                                value={passwordData.confirm}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-crimson/40 transition-all font-mono"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showPasswords.confirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-crimson text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all mt-4"
                                    >
                                        Update Security Key
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeModal === 'delete' && (
                            <div className="space-y-6 text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-red-400">Terminate Account?</h3>
                                    <p className="text-gray-500 text-sm">This action is permanent and will wipe all your tactical data, followed teams, and profile info.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full bg-red-500 text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all"
                                    >
                                        Yes, Delete Everything
                                    </button>
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="w-full bg-white/[0.05] border border-white/10 text-gray-400 font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Subtle ambient background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-crimson/[0.04] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-purple/[0.03] blur-[130px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 animate-fade-in-up">

                {/* ── Header / Breadcrumb ── */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-crimson/10 hover:border-crimson/30 transition-all duration-200 group"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180 text-gray-400 group-hover:text-crimson transition-colors" />
                    </button>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold flex items-center gap-2">
                        <span>Home</span>
                        <ChevronRight className="w-3 h-3 opacity-30" />
                        <span className="text-crimson">Dashboard</span>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    SECTION 1 – PROFILE OVERVIEW CARD
                ═══════════════════════════════════════════ */}
                <section
                    className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-10 overflow-hidden card-lift"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
                >
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 p-1 overflow-hidden bg-bg-dark group-hover:border-crimson/30 transition-all duration-300">
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-9 h-9 bg-crimson text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                        </div>

                        {/* User info */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="w-full max-w-md text-3xl sm:text-4xl font-bold bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-crimson/40 transition-all"
                                    autoFocus
                                />
                            ) : (
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{user.name}</h1>
                            )}
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-crimson/10 border border-crimson/20 text-crimson text-xs font-semibold uppercase tracking-wider">
                                    <Shield className="w-3.5 h-3.5" />
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Edit / Save */}
                        <button
                            onClick={async () => {
                                if (isEditing) {
                                    localStorage.setItem('user', JSON.stringify(user));

                                    // Sync with backend if authenticated
                                    if (apiClient.auth.isAuthenticated()) {
                                        try {
                                            await apiClient.auth.updateProfile({ name: user.name });
                                            console.log('Name updated on server');
                                        } catch (error) {
                                            console.error('Failed to update name on server:', error);
                                            alert('Failed to save changes to server. Changes saved locally only.');
                                        }
                                    }
                                }
                                setIsEditing(!isEditing);
                            }}
                            className={`shrink-0 px-7 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${isEditing
                                ? 'bg-crimson text-white shadow-lg'
                                : 'bg-white/[0.05] border border-white/[0.08] text-gray-300 hover:bg-crimson/10 hover:border-crimson/30 hover:text-white'
                                }`}
                        >
                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTION 2 – STATS OVERVIEW ROW
                ═══════════════════════════════════════════ */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Followed Games', value: favGames.length, icon: Gamepad2, color: '#E10600' },
                        { label: 'Joined Date', value: user.joinedDate || dashboardData.user.joinedDate, icon: Calendar, color: '#C5C5D6', isDate: true },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6 hover:-translate-y-2 hover:scale-[1.02] hover:border-white/[0.15] hover:shadow-[0_8px_30px_rgba(225,6,0,0.15)] transition-all duration-300 group cursor-default"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                                style={{ backgroundColor: stat.color + '15' }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <p className={`font-bold tracking-tight transition-colors duration-200 group-hover:text-crimson ${stat.isDate ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>{stat.value}</p>
                            <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════
                    SECTION 3 – FAVORITE PLAYERS
                ═══════════════════════════════════════════ */}
                <section>
                    <SectionHeader title="Favorite Players" accent="Players" count={followedPlayers.length} />
                    {followedPlayers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {followedPlayers.map((player, i) => (
                                <div
                                    key={player.id}
                                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:scale-[1.05] hover:-translate-y-1 hover:border-crimson/[0.3] hover:shadow-[0_8px_30px_rgba(225,6,0,0.2)] hover:bg-white/[0.06] transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                            <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm truncate">{player.name}</h4>
                                            <p className="text-gray-500 text-xs truncate">{player.team}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{player.game}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewPlayer(player)}
                                            className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:bg-crimson/10 hover:border-crimson/30 hover:text-crimson transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => unfollowPlayer(player.name)}
                                            className="px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all duration-200"
                                            title="Remove from favorites"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No favorite players yet" icon={Heart} />
                    )}
                </section>

                {/* ═══════════════════════════════════════════
                    SECTION 4 – FAVORITE TEAMS
                ═══════════════════════════════════════════ */}
                <section>
                    <SectionHeader title="Favorite Teams" accent="Teams" count={followedTeams.length} />
                    {followedTeams.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {followedTeams.map((team, i) => (
                                <div
                                    key={team.id}
                                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:scale-[1.05] hover:-translate-y-1 hover:border-purple/30 hover:shadow-[0_8px_30px_rgba(138,43,226,0.2)] hover:bg-white/[0.06] transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border border-white/10 shrink-0"
                                            style={{ backgroundColor: (team.color || '#8A2BE2') + '15', color: team.color || '#8A2BE2' }}
                                        >
                                            {team.logo}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm truncate">{team.name}</h4>
                                            <p className="text-gray-500 text-xs">{team.game}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewTeam(team)}
                                            className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:bg-purple/10 hover:border-purple/30 hover:text-purple transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => unfollowTeam(team.id)}
                                            className="px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all duration-200"
                                            title="Unfollow Team"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No favorite teams yet" icon={Users} />
                    )}
                </section>

                {/* ═══════════════════════════════════════════
                    SECTION 5 – FOLLOWED GAMES
                ═══════════════════════════════════════════ */}
                <section>
                    <SectionHeader title="Followed Games" accent="Games" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {dashboardData.gamePages.map((game, i) => {
                            const isFollowed = favGames.includes(game.name);
                            return (
                                <div
                                    key={game.id}
                                    className={`relative rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 ${isFollowed
                                        ? 'border-crimson/20 bg-white/[0.04] hover:border-crimson/40 hover:shadow-[0_10px_40px_rgba(225,6,0,0.25)]'
                                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)]'
                                        }`}
                                >
                                    {/* Game image */}
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img
                                            src={gameLogos[game.name]}
                                            alt={game.name}
                                            className={`w-full h-full object-cover transition-all duration-300 ${isFollowed ? 'opacity-90' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" />
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-bold text-sm">{game.name}</h4>
                                            <p className="text-gray-500 text-xs">{game.subtitle}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // Navigate to game page
                                                    window.history.pushState({}, '', `/game/${game.slug}`);
                                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                                }}
                                                className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-crimson/10 border border-crimson/20 text-crimson hover:bg-crimson hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                                            >
                                                Go to Page
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => toggleGame(game.name)}
                                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${isFollowed
                                                    ? 'bg-crimson/10 border-crimson/30 text-crimson'
                                                    : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white hover:border-white/20'
                                                    }`}
                                                title={isFollowed ? 'Unfollow' : 'Follow'}
                                            >
                                                {isFollowed ? '✓' : '+'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTION 6 – TRENDING
                ═══════════════════════════════════════════ */}
                <section>
                    <SectionHeader title="Trending Now" accent="Trending" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Trending Players */}
                        <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-crimson" />
                                Trending Players
                            </h4>
                            <div className="space-y-2">
                                {dashboardData.trendingPlayers.map((player, i) => (
                                    <div
                                        key={player.id}
                                        onClick={() => handleViewPlayer(player)}
                                        className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 hover:bg-crimson/10 hover:border-crimson/30 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(225,6,0,0.15)] transition-all duration-300 cursor-pointer group/card"
                                    >
                                        <span className="text-gray-600 font-bold text-sm w-6 text-center shrink-0">{i + 1}</span>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                                            <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-sm truncate group-hover/card:text-crimson transition-colors">{player.name}</h5>
                                            <p className="text-gray-500 text-xs truncate">{player.team} · {player.game}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-crimson shrink-0">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{formatPopularity(player.popularity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Teams */}
                        <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-purple" />
                                Trending Teams
                            </h4>
                            <div className="space-y-2">
                                {dashboardData.trendingTeams.map((team, i) => (
                                    <div
                                        key={team.id}
                                        onClick={() => handleViewTeam(team)}
                                        className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 hover:bg-purple/10 hover:border-purple/30 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(138,43,226,0.15)] transition-all duration-300 cursor-pointer group/card"
                                    >
                                        <span className="text-gray-600 font-bold text-sm w-6 text-center shrink-0">{i + 1}</span>
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border border-white/10 shrink-0"
                                            style={{ backgroundColor: (team.color || '#8A2BE2') + '15', color: team.color || '#8A2BE2' }}
                                        >
                                            {team.logo}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-sm truncate group-hover/card:text-purple transition-colors">{team.name}</h5>
                                            <p className="text-gray-500 text-xs">{team.game}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-purple shrink-0">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{formatPopularity(team.popularity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    SECTION 7 – SETTINGS PANEL
                ═══════════════════════════════════════════ */}
                <section>
                    <SectionHeader title="Account Settings" accent="Settings" />
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.05]">
                        {/* Change Password */}
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-all duration-200 group/setting">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-crimson/10 flex items-center justify-center shrink-0 transition-all duration-200 group-hover/setting:scale-110 group-hover/setting:bg-crimson/20">
                                    <Lock className="w-5 h-5 text-crimson" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Change Password</h4>
                                    <p className="text-gray-500 text-xs mt-0.5">Update your account password for security.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveModal('password')}
                                className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-crimson/10 hover:border-crimson/30 hover:text-crimson hover:scale-105 transition-all duration-200"
                            >
                                Change
                            </button>
                        </div>

                        {/* Notification Toggle */}
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-all duration-200 group/setting">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover/setting:scale-110 ${notificationsEnabled ? 'bg-crimson/10 group-hover/setting:bg-crimson/20' : 'bg-white/[0.05] group-hover/setting:bg-white/[0.08]'}`}>
                                    {notificationsEnabled
                                        ? <Bell className="w-5 h-5 text-crimson" />
                                        : <BellOff className="w-5 h-5 text-gray-500" />
                                    }
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Notifications</h4>
                                    <p className="text-gray-500 text-xs mt-0.5">Receive alerts for matches and updates.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`relative w-14 h-7 rounded-full transition-all duration-200 hover:scale-110 ${notificationsEnabled ? 'bg-crimson' : 'bg-white/10'}`}
                            >
                                <div
                                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${notificationsEnabled ? 'translate-x-[28px]' : 'translate-x-[4px]'}`}
                                />
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-all duration-200 group/setting">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 transition-all duration-200 group-hover/setting:scale-110 group-hover/setting:bg-red-500/20">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-red-400">Delete Account</h4>
                                    <p className="text-gray-500 text-xs mt-0.5">Permanently remove your account and data.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveModal('delete')}
                                className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent hover:scale-105 transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

/* ── Reusable Sub-components ── */

const SectionHeader = ({ title, accent, count }) => (
    <div className="mb-5 flex items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {title.replace(accent, '').trim()}{' '}
            <span className="text-crimson">{accent}</span>
        </h2>
        {count !== undefined && (
            <span className="px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-black uppercase tracking-widest text-gray-400">
                {count} {count === 1 ? 'Entry' : 'Entries'}
            </span>
        )}
    </div>
);

const EmptyState = ({ message, icon: Icon }) => (
    <div className="py-16 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/[0.06] rounded-xl border-dashed">
        <div className="w-14 h-14 bg-white/[0.04] rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-7 h-7 text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm font-medium">{message}</p>
        <p className="text-gray-600 text-xs mt-1">Start following from the game pages to see them here.</p>
    </div>
);

export default Dashboard;
