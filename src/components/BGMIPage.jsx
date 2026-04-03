import { useState, useEffect } from 'react';
import { Trophy, Users, User, BarChart3, Radio, ChevronRight, MapPin, Swords, Target, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useFollowedPlayers } from '../context/FollowedPlayersContext';
import { bgmiData } from '../data/bgmiData';
import { getPlayersByGame } from '../data/playerStore';

const BGMIPage = ({ onBack }) => {
    const [activeSection, setActiveSection] = useState(() => {
        const hash = window.location.hash;
        if (hash === '#teams' || hash.startsWith('#teams:')) return 'teams';
        return 'live';
    });
    const [highlightedTeamId, setHighlightedTeamId] = useState(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#teams:')) return hash.split(':')[1];
        return null;
    });
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navItems = [
        { id: 'live', name: 'Live', icon: Radio },
        { id: 'tournaments', name: 'Tournaments', icon: Trophy },
        { id: 'teams', name: 'Teams', icon: Users },
        { id: 'players', name: 'Players', icon: User },
        { id: 'stats', name: 'Ranks', icon: BarChart3 },
    ];

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#teams' || hash.startsWith('#teams:')) {
                setActiveSection('teams');
                if (hash.startsWith('#teams:')) {
                    setHighlightedTeamId(hash.split(':')[1]);
                }
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const loadData = () => {
        // Data reload
    };

    if (error) {
        return (
            <div className="min-h-screen bg-bg-dark text-white flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-6 border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <AlertTriangle className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2 italic">Connection Failed</h2>
                <p className="text-gray-500 max-w-md mb-8 font-bold uppercase text-xs tracking-widest leading-loose">{error}</p>
                <div className="flex gap-4">
                    <button onClick={onBack} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-full transition-all border border-white/10">Back to Base</button>
                    <button onClick={loadData} className="px-8 py-3 bg-gold hover:bg-white hover:text-black text-bg-dark font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.3)]"><RefreshCw className="w-4 h-4" /> Re-link</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark text-white pt-32 pb-20 relative overflow-hidden font-sans animate-fade-in">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gold/[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-amber/[0.05] blur-[130px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all duration-300 group">
                        <ChevronRight className="w-6 h-6 rotate-180 text-gray-400 group-hover:text-gold transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
                            BATTLEGROUNDS MOBILE <span className="text-gold not-italic">INDIA</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2 mt-1">
                            Level 3 Tactical • Pro Series
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="sticky top-28 z-40 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 mb-10 flex flex-wrap gap-2 shadow-2xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => !isLoading && setActiveSection(item.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 ${activeSection === item.id
                                ? 'bg-gold text-bg-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <main className="min-h-[60vh] animate-fade-in-up">
                    {activeSection === 'live' && <LiveMatches onSelectMatch={setSelectedMatch} />}
                    {activeSection === 'tournaments' && <TournamentSection />}
                    {activeSection === 'teams' && <TeamSection highlightedId={highlightedTeamId} />}
                    {activeSection === 'players' && <PlayerSection />}
                    {activeSection === 'stats' && <StatsSection onPlayerClick={(name) => {
                        window.history.pushState({}, '', `/player/${name}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }} />}
                </main>
            </div>

            {/* Match Center Modal */}
            {selectedMatch && <MatchCenter match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
        </div>
    );
};

const LiveMatches = ({ onSelectMatch }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bgmiData.liveMatches.map((match) => (
            <div
                key={match.id}
                className="group relative bg-card border border-white/5 rounded-3xl p-8 hover:border-gold/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl hover:-translate-y-1"
                onClick={() => onSelectMatch(match)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 p-6">
                    <span className="flex items-center gap-2 px-3 py-1 bg-[#FF1E1E] text-white rounded-full text-[10px] font-bold uppercase animate-pulse shadow-[0_0_10px_rgba(255,30,30,0.4)]">
                        <Radio className="w-3 h-3" /> Live
                    </span>
                </div>
                <div className="mb-6">
                    <h3 className="text-white font-black uppercase text-sm tracking-widest mb-1 italic group-hover:text-gold transition-colors">{match.tournament}</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase">{match.round} • {match.map}</p>
                </div>
                <div className="space-y-4">
                    {match.teams.map((team, idx) => (
                        <div key={team.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className={`w-1 h-10 rounded-full ${idx === 0 ? 'bg-gold' : 'bg-gray-700'}`} />
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-black text-xs border border-white/10 shadow-inner">
                                    {team.logo}
                                </div>
                                <span className="font-bold text-lg tracking-tight uppercase">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Finishes</p>
                                    <p className="font-black text-2xl tracking-tighter italic">{team.kills}</p>
                                </div>
                                <div className="text-right min-w-[40px]">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Rank</p>
                                    <p className={`font-black text-2xl tracking-tighter ${idx === 0 ? 'text-gold italic' : ''}`}>#{team.rank}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-gold transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Spectate...</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        ))}
    </div>
);

const MatchCenter = ({ match, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-fade-in">
        <div onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
        <div className="relative w-full max-w-5xl bg-bg-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] flex flex-col md:flex-row h-full max-h-[85vh] animate-scale-in">
            <div className="p-10 bg-gradient-to-br from-gold to-amber text-bg-dark w-full md:w-80 shrink-0 flex flex-col justify-between shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
                <div>
                    <button onClick={onClose} className="mb-8 hover:bg-black/10 p-2 rounded-full transition-colors">
                        <ChevronRight className="w-8 h-8 rotate-180" />
                    </button>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4 italic">BATTLE<br />STATS</h2>
                    <div className="bg-bg-dark text-gold px-3 py-1 inline-block rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-gold/20">Real-time Optic</div>
                    <div className="space-y-4 text-bg-dark/80">
                        <div className="flex items-center gap-3 font-bold"><MapPin className="w-4 h-4" /><span className="text-sm font-black uppercase tracking-tight">{match.map}</span></div>
                        <div className="flex items-center gap-3 font-bold"><Radio className="w-4 h-4" /><span className="text-sm font-black uppercase tracking-tight">Phase 5 / 8</span></div>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-bg-dark/20">
                    <p className="text-[10px] uppercase font-bold opacity-70 mb-2">Kill Leader</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-dark rounded-xl flex items-center justify-center font-black text-gold">GL</div>
                        <div><p className="font-black uppercase text-sm">Jonathan</p><p className="text-[10px] uppercase font-bold opacity-70 italic font-black">GodLike</p></div>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto bg-bg-dark/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Leaderboard</h3>
                    <BarChart3 className="w-6 h-6 text-gold" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <span className={`text-xl font-black ${i === 1 ? 'text-gold italic scale-110' : 'text-gray-500'}`}>#{i}</span>
                                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-[10px] shadow-inner">T-{i}</div>
                                <div>
                                    <p className="font-bold uppercase tracking-wide group-hover:text-gold transition-colors text-lg">Squad Alpha {i}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Alive: 4
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">Finishes</p><p className="font-black text-xl italic">{20 - i * 2}</p></div>
                                <div className="text-right min-w-[70px] bg-gold/10 border border-gold/20 px-4 py-2 rounded-xl">
                                    <p className="text-[10px] text-gold uppercase font-bold">Rank Pts</p>
                                    <p className="font-black text-xl text-gold italic">{25 - i * 3}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const TournamentSection = () => (
    <div id="tournaments" className="space-y-12 scroll-mt-48 grid grid-cols-1 md:grid-cols-2 gap-6">
        {bgmiData.tournaments.map((tourney) => (
            <div key={tourney.id} className="group bg-card border border-white/5 rounded-3xl p-8 hover:bg-gold/5 hover:border-gold/20 transition-all duration-300 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-2xl">
                        <Trophy className="w-8 h-8 text-gold" />
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tourney.status === 'Ongoing' ? 'bg-gold text-bg-dark border-gold transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-white border-white/10'}`}>
                        {tourney.status}
                    </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-gold transition-colors italic">{tourney.name}</h3>
                <p className="text-gray-500 text-sm font-bold uppercase mb-6 tracking-widest leading-none">Global Event • {tourney.format}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-inner">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Total Prize</p>
                        <p className="text-lg font-black text-gold tracking-tighter italic">{tourney.prizePool}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-inner">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Squads</p>
                        <p className="text-lg font-black tracking-tighter italic">{tourney.teams}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const TeamSection = ({ highlightedId }) => {
    const { toggleFollow, isFollowing } = useFollowedTeams();

    const handlePlayerClick = (playerName) => {
        window.history.pushState({}, '', `/player/${playerName}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bgmiData.teams.map((team) => {
                const followed = isFollowing(team.id);
                const isHighlighted = highlightedId === team.id;
                return (
                    <div
                        key={team.id}
                        id={`team-${team.id}`}
                        className={`bg-card border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 border relative overflow-hidden group scroll-mt-48 ${isHighlighted
                            ? 'border-gold shadow-[0_0_50px_rgba(212,175,55,0.2)] scale-[1.02] z-10'
                            : 'hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-3xl font-black italic shadow-[0_0_30px_rgba(212,175,55,0.1)]" style={{ color: team.color }}>{team.logo}</div>
                            <div className="flex-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{team.name}</h3>
                                <div className="flex gap-2 mt-2">
                                    {team.achievements.slice(0, 1).map((ach) => (
                                        <span key={ach} className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold italic shadow-sm">🏆 {ach}</span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFollow({ ...team, game: 'Battlegrounds Mobile India' })}
                                className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${followed
                                    ? 'bg-gold text-bg-dark shadow-[0_0_30px_rgba(212,175,55,0.8)] border-gold'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {followed ? 'Following' : 'Follow'}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">Win %</p><p className="text-xl font-black italic">{team.stats.winRate}</p></div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">Avg Fin</p><p className="text-xl font-black italic">{team.stats.avgKills}</p></div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">Avg Pts</p><p className="text-xl font-black italic">{team.stats.avgPoints}</p></div>
                        </div>
                        <div className="space-y-4 shadow-inner p-2 rounded-2xl bg-black/20 border border-white/5">
                            <p className="text-[9px] text-gray-500 uppercase font-black ml-2 tracking-[0.2em] mb-2 leading-none">Tactical Roster</p>
                            <div className="flex flex-wrap gap-2">
                                {team.roster.map((p) => (
                                    <span
                                        key={p}
                                        onClick={() => handlePlayerClick(p)}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black hover:bg-gold/10 hover:border-gold/30 transition-all uppercase cursor-pointer italic tracking-wider hover:text-gold"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const PlayerSection = ({ onPlayerClick }) => {
    const { isFollowingPlayer, toggleFollowPlayer } = useFollowedPlayers();
    const players = getPlayersByGame('bgmi');

    const handlePlayerClick = (e, playerName) => {
        e.preventDefault();
        window.history.pushState({}, '', `/ player / ${playerName} `);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {players.map((player) => (
                <div key={player.id} className="bg-card border border-white/5 rounded-3xl p-8 transition-all flex flex-col xl:flex-row gap-8 shadow-xl border-l-[3px] border-l-gold hover:-translate-y-1 group">
                    <div className="shrink-0 text-center xl:text-left">
                        <div
                            onClick={(e) => handlePlayerClick(e, player.name)}
                            className="w-24 h-24 bg-gradient-to-br from-gold/10 to-transparent rounded-[2.5rem] mx-auto xl:mx-0 mb-4 border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-gold/30 transition-colors cursor-pointer"
                        >
                            <img src={player.img} alt={player.name} className="w-full h-full rounded-2xl object-cover" />
                        </div>
                        <span className="px-4 py-1.5 bg-gold text-bg-dark text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]">{player.role}</span>
                    </div>
                    <div className="flex-1">
                        <div className="mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                            <div>
                                <h3
                                    onClick={(e) => handlePlayerClick(e, player.name)}
                                    className="text-3xl font-black uppercase tracking-tighter mb-1 italic cursor-pointer hover:text-gold transition-colors relative inline-block"
                                >
                                    {player.name}
                                </h3>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{player.team}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleFollowPlayer({ ...player, game: 'Battlegrounds Mobile India' })}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isFollowingPlayer(player.name)
                                        ? 'bg-gold text-bg-dark border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {isFollowingPlayer(player.name) ? 'Following' : 'Follow'}
                                </button>
                                <div className="flex gap-1 h-8">
                                    {player.performance.map((val, idx) => (
                                        <div key={idx} className="w-2.5 bg-gold/20 rounded-t-sm self-end hover:bg-gold transition-colors" style={{ height: `${(val / 30) * 100}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Target className="w-3 h-3" /> F/D</p><p className="text-md font-black italic">{player.stats.kd}</p></div>
                            <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Swords className="w-3 h-3" /> Fin</p><p className="text-md font-black italic">{player.stats.kills}</p></div>
                            <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Zap className="w-3 h-3" /> Optic</p><p className="text-md font-black italic">{player.stats.matches}</p></div>
                            <div className="text-center xl:text-left"><p className="text-[9px] text-gold uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Trophy className="w-3 h-3" /> MVP</p><p className="text-md font-black italic text-gold">{player.stats.mvp}</p></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const StatsSection = ({ onPlayerClick }) => (
    <div id="stats" className="grid grid-cols-1 xl:grid-cols-3 gap-8 scroll-mt-48">
        <div className="xl:col-span-2 space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic"><Swords className="text-gold" /> Season MVPs</h3>
            <div className="bg-card border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        onClick={() => onPlayerClick(`Combatant ${i}`)}
                        className={`flex items-center justify-between py-6 ${i !== 3 ? 'border-b border-white/5' : ''} group cursor-pointer hover:bg-white/5 transition-colors px-4 rounded-2xl`}
                    >
                        <div className="flex items-center gap-6">
                            <span className={`text-2xl font-black ${i === 1 ? 'text-gold italic scale-125' : 'text-gray-500'}`}>0{i}</span>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black border border-white/5">GL</div>
                            <div>
                                <p className="font-black uppercase tracking-tight text-xl leading-none italic group-hover:text-gold transition-colors">Combatant {i}</p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 italic">GodLike Esports</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">Avg Finishes</p>
                            <p className="font-black text-2xl text-gold tracking-tighter italic">{5.0 - i * 0.5}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight italic">Tier Standings</h3>
            <div className="bg-card border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center"><span className="font-black text-[10px] uppercase tracking-widest italic">{i === 1 ? 'Conqueror Tier' : i === 2 ? 'Ace Master' : 'Ace Tier'}</span><span className="font-black text-xs text-gold italic">{98 - i * i}%</span></div>
                        <div className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-gold via-amber to-transparent shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: `${98 - i * i}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default BGMIPage;
