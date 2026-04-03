import { useState, useEffect } from 'react';
import { Trophy, Users, User, BarChart3, Radio, ChevronRight, MapPin, Swords, Target, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { useFollowedTeams } from '../context/FollowedTeamsContext';
import { useFollowedPlayers } from '../context/FollowedPlayersContext';
import { valorantData } from '../data/valorantData';
import { getPlayersByGame } from '../data/playerStore';
import * as valorantApi from '../services/valorantApi';

const ValorantPage = ({ onBack }) => {
    const [activeSection, setActiveSection] = useState(() => {
        const hash = window.location.hash;
        if (hash === '#teams' || hash.startsWith('#teams:')) return 'teams';
        return 'matches';
    });
    const [highlightedTeamId, setHighlightedTeamId] = useState(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#teams:')) return hash.split(':')[1];
        return null;
    });
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // API Data States
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [events, setEvents] = useState([]);

    const navItems = [
        { id: 'matches', name: 'Live Matches', icon: Radio },
        { id: 'results', name: 'Results', icon: BarChart3 },
        { id: 'events', name: 'Events', icon: Trophy },
        { id: 'teams', name: 'Teams', icon: Users },
        { id: 'players', name: 'Players', icon: User },
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

    // Fetch data on component mount and when section changes
    useEffect(() => {
        loadData();
    }, [activeSection]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (activeSection === 'matches') {
                const matchesData = await valorantApi.getMatches();
                const extractedMatches = matchesData?.data || matchesData?.matches || (Array.isArray(matchesData) ? matchesData : []);
                setMatches(extractedMatches);
            } else if (activeSection === 'results') {
                const resultsData = await valorantApi.getResults(1);
                const extractedResults = resultsData?.data || resultsData?.results || (Array.isArray(resultsData) ? resultsData : []);
                setResults(extractedResults);
            } else if (activeSection === 'teams') {
                const teamsData = await valorantApi.getTeams();
                const extractedTeams = teamsData?.data || teamsData?.teams || (Array.isArray(teamsData) ? teamsData : []);
                setTeams(extractedTeams);
            } else if (activeSection === 'players') {
                const playersData = await valorantApi.getPlayers();
                const extractedPlayers = playersData?.data || playersData?.players || (Array.isArray(playersData) ? playersData : []);
                setPlayers(extractedPlayers);
            } else if (activeSection === 'events') {
                const eventsData = await valorantApi.getEvents('all', 'all', 1);
                const extractedEvents = eventsData?.data || eventsData?.events || (Array.isArray(eventsData) ? eventsData : []);
                setEvents(extractedEvents);
            }
        } catch (err) {
            // Only show error screen for truly unexpected failures
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-bg-dark text-white flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-6 border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <AlertTriangle className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2 italic">Operation Failed</h2>
                <p className="text-gray-500 max-w-md mb-8 font-bold uppercase text-xs tracking-widest leading-loose">{error}</p>
                <div className="flex gap-4">
                    <button onClick={onBack} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-full transition-all border border-white/10">Abort</button>
                    <button onClick={loadData} className="px-8 py-3 bg-gold hover:bg-white hover:text-black text-bg-dark font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.3)]"><RefreshCw className="w-4 h-4" /> Re-sync</button>
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
                            VALORANT
                        </h1>
                        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            Tactical Protocol • VCT 2026
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
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading Data...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeSection === 'matches' && <LiveMatches matches={matches} onSelectMatch={setSelectedMatch} />}
                            {activeSection === 'results' && <ResultsSection results={results} />}
                            {activeSection === 'events' && <EventsSection events={events} />}
                            {activeSection === 'teams' && <TeamSection teams={teams} highlightedId={highlightedTeamId} />}
                            {activeSection === 'players' && <PlayerSection players={players} />}
                        </>
                    )}
                </main>
            </div>

            {/* Match Center Modal */}
            {selectedMatch && <MatchCenter match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
        </div>
    );
};

const LiveMatches = ({ matches = [], onSelectMatch }) => {
    // Filter for only live/ongoing matches
    const liveMatches = matches.filter(match => {
        const status = (match.status || match.state || '').toLowerCase();
        return status === 'live' || status === 'ongoing' || status === 'in progress' || status === 'inprogress';
    });

    if (!liveMatches || liveMatches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <div className="w-20 h-20 bg-[#FF1E1E]/10 rounded-3xl flex items-center justify-center mb-6 border border-[#FF1E1E]/20">
                    <Radio className="w-10 h-10 text-[#FF1E1E] opacity-60" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-2">No Live Matches</h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-md leading-relaxed">Check back soon for upcoming games.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveMatches.map((match, index) => (
                <div
                    key={match.id || index}
                    className="group relative bg-card border border-white/5 rounded-3xl p-8 hover:border-gold/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl hover:-translate-y-1"
                    onClick={() => onSelectMatch(match)}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 p-6">
                        <span className="flex items-center gap-2 px-3 py-1 bg-[#FF1E1E] text-white rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(255,30,30,0.4)]">
                            <Radio className="w-3 h-3" /> Live
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                                    {match.team1?.logo || match.teams?.[0]?.logo ? (
                                        <img src={match.team1?.logo || match.teams?.[0]?.logo} alt={match.team1?.name || match.teams?.[0]?.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <span className="font-black text-xs text-gold">{(match.team1?.name || match.teams?.[0]?.name || 'T1').substring(0, 3).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-black uppercase text-xl tracking-tight italic leading-none mb-1">{match.team1?.name || match.teams?.[0]?.name || 'Team 1'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic">{match.team1?.region || 'Region'}</p>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gold/10 border border-gold/20 rounded-2xl">
                                <p className="text-3xl font-black text-gold tracking-tighter italic">{match.score1 || match.team1?.score || 0} - {match.score2 || match.team2?.score || 0}</p>
                            </div>
                            <div className="flex items-center gap-4 flex-1 justify-end">
                                <div className="flex-1 text-right">
                                    <p className="font-black uppercase text-xl tracking-tight italic leading-none mb-1">{match.team2?.name || match.teams?.[1]?.name || 'Team 2'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic">{match.team2?.region || 'Region'}</p>
                                </div>
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                                    {match.team2?.logo || match.teams?.[1]?.logo ? (
                                        <img src={match.team2?.logo || match.teams?.[1]?.logo} alt={match.team2?.name || match.teams?.[1]?.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <span className="font-black text-xs text-gold">{(match.team2?.name || match.teams?.[1]?.name || 'T2').substring(0, 3).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-white font-black uppercase text-sm tracking-widest mb-1 italic group-hover:text-gold transition-colors">{match.tournament}</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase">{match.round} • {match.map}</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-gold transition-colors">
                        <span className="text-[10px] font-bold uppercase tracking-widest">View Tactical Center</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))
            }
        </div >
    );
};

const MatchCenter = ({ match, onClose }) => (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 lg:p-10 animate-fade-in">
        <div onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
        <div className="relative w-full max-w-5xl bg-bg-dark border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)] flex flex-col md:flex-row h-full max-h-[85vh] animate-scale-in">
            <div className="p-10 bg-gradient-to-br from-gold to-amber text-bg-dark w-full md:w-80 shrink-0 flex flex-col justify-between shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
                <div>
                    <button onClick={onClose} className="mb-8 hover:bg-black/10 p-2 rounded-full transition-colors">
                        <ChevronRight className="w-8 h-8 rotate-180" />
                    </button>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4 italic">SPIKE<br />STATS</h2>
                    <div className="bg-bg-dark text-gold px-3 py-1 inline-block rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-gold/20">Encrypted Stream</div>
                    <div className="space-y-4 text-bg-dark/80">
                        <div className="flex items-center gap-3 font-bold"><MapPin className="w-4 h-4" /><span className="text-sm font-black uppercase tracking-tight">{match.map}</span></div>
                        <div className="flex items-center gap-3 font-bold"><Radio className="w-4 h-4" /><span className="text-sm font-black uppercase tracking-tight">Round 12 / 24</span></div>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-bg-dark/20">
                    <p className="text-[10px] uppercase font-bold opacity-70 mb-2">Impact Leader</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-dark rounded-xl flex items-center justify-center font-black text-gold shadow-lg">VH</div>
                        <div><p className="font-black uppercase text-sm">Viper</p><p className="text-[10px] uppercase font-bold opacity-70 italic text-bg-dark/60">Sentinels</p></div>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto bg-bg-dark/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Scoreboard</h3>
                    <BarChart3 className="w-6 h-6 text-gold" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <span className={`text-xl font-black ${i === 1 ? 'text-gold italic scale-110' : 'text-gray-500'}`}>#{i}</span>
                                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-[10px] shadow-inner">P-{i}</div>
                                <div>
                                    <p className="font-bold uppercase tracking-wide group-hover:text-gold transition-colors text-lg">Agent Alpha {i}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold" /> ACS: {250 + i * 10}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">K/D/A</p><p className="font-black text-xl italic">{20 - i}/{10 + i}/{5}</p></div>
                                <div className="text-right min-w-[70px]">
                                    <p className="text-[10px] text-gold uppercase font-bold">Combat</p>
                                    <p className="font-black text-xl text-gold italic">{450 - i * 30}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ResultsSection = ({ results = [] }) => (
    <div id="results" className="grid grid-cols-1 gap-6 scroll-mt-48">
        {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <BarChart3 className="w-16 h-16 text-gold/40 mb-4" />
                <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-2">No Results Found</h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-md leading-relaxed">Match results will appear here.</p>
            </div>
        ) : results.map((result, index) => {
            const team1 = result.teams?.[0] || {};
            const team2 = result.teams?.[1] || {};

            return (
                <div key={result.id || index} className="bg-card border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-1">{result.tournament || result.event || 'Tournament'}</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{result.event || result.ago || 'Recent'}</p>
                        </div>
                        <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {result.status || 'Completed'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-8">
                        {/* Team 1 */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2">
                                {result.img ? (
                                    <img src={result.img} alt={team1.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="font-black text-xs text-gold">{(team1.name || 'T1').substring(0, 3).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`font-black uppercase text-lg tracking-tight italic ${team1.won ? 'text-gold' : 'text-white'}`}>
                                    {team1.name || 'Team 1'}
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1">
                                    {team1.country && <span className="text-xs">🌍</span>}
                                    {team1.country?.toUpperCase() || 'Region'}
                                </p>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-4xl font-black tracking-tighter italic">
                                <span className={team1.won ? 'text-gold' : 'text-white'}>{team1.score || 0}</span>
                                <span className="text-gray-600 mx-2">-</span>
                                <span className={team2.won ? 'text-gold' : 'text-white'}>{team2.score || 0}</span>
                            </p>
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <div className="flex-1 text-right">
                                <p className={`font-black uppercase text-lg tracking-tight italic ${team2.won ? 'text-gold' : 'text-white'}`}>
                                    {team2.name || 'Team 2'}
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1 justify-end">
                                    {team2.country?.toUpperCase() || 'Region'}
                                    {team2.country && <span className="text-xs">🌍</span>}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2">
                                {result.img ? (
                                    <img src={result.img} alt={team2.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="font-black text-xs text-gold">{(team2.name || 'T2').substring(0, 3).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

const EventsSection = ({ events = [] }) => (
    <div id="events" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-48">
        {events.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <Trophy className="w-16 h-16 text-gold/40 mb-4" />
                <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-2">No Events Found</h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-md leading-relaxed">Check back later for upcoming tournaments.</p>
            </div>
        ) : events.map((tourney, index) => (
            <div key={tourney.id || index} className="group bg-card border border-white/5 rounded-3xl overflow-hidden hover:bg-gold/5 hover:border-gold/20 transition-all duration-300 shadow-xl">
                {/* Tournament Image */}
                {tourney.image || tourney.logo || tourney.img ? (
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={tourney.image || tourney.logo || tourney.img}
                            alt={tourney.name || tourney.title || 'Tournament'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent items-center justify-center">
                            <Trophy className="w-16 h-16 text-gold/60" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
                    </div>
                ) : (
                    <div className="relative h-48 bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center">
                        <Trophy className="w-16 h-16 text-gold/40" />
                    </div>
                )}

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${(tourney.status || '').toLowerCase() === 'ongoing' || (tourney.status || '').toLowerCase() === 'live'
                            ? 'bg-gold text-bg-dark border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                            : 'bg-white/5 text-white border-white/10'
                            }`}>
                            {tourney.status || 'Upcoming'}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-gold transition-colors italic line-clamp-2">
                        {tourney.name || tourney.title || 'Tournament'}
                    </h3>
                    <p className="text-gray-500 text-sm font-bold uppercase mb-6 tracking-widest leading-none">
                        {tourney.region || 'Global'} • {tourney.format || tourney.type || 'Tournament'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-inner">
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Prize Pool</p>
                            <p className="text-lg font-black text-gold tracking-tighter italic">
                                {tourney.prizePool || tourney.prize || 'TBA'}
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-inner">
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Teams</p>
                            <p className="text-lg font-black tracking-tighter italic">
                                {tourney.teams || tourney.teamCount || tourney.participants || 'TBA'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const TeamSection = ({ teams = [], highlightedId }) => {
    const { toggleFollow, isFollowing } = useFollowedTeams();

    const handlePlayerClick = (playerName) => {
        window.history.pushState({}, '', `/player/${playerName}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                    <Users className="w-16 h-16 text-gold/40 mb-4" />
                    <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-2">No Teams Found</h3>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-md leading-relaxed">Teams data will appear here.</p>
                </div>
            ) : teams.map((team) => {
                const followed = isFollowing(team.id || team.name);
                const isHighlighted = highlightedId === (team.id || team.name);
                return (
                    <div
                        key={team.id || team.name || Math.random()}
                        id={`team-${team.id || team.name}`}
                        className={`bg-card border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 border relative overflow-hidden group scroll-mt-48 ${isHighlighted
                            ? 'border-gold shadow-[0_0_50px_rgba(212,175,55,0.2)] scale-[1.02] z-10'
                            : 'hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                                {team.logo || team.img || team.image ? (
                                    <img src={team.logo || team.img || team.image} alt={team.name} className="w-full h-full object-contain p-2" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="text-2xl font-black italic text-gold">{(team.name || 'T').substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{team.name || 'Team'}</h3>
                                <div className="flex gap-2 mt-2">
                                    {team.region && (
                                        <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold italic shadow-sm">
                                            � {team.region}
                                        </span>
                                    )}
                                    {team.country && (
                                        <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                                            {team.country.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFollow({ ...team, game: 'Valorant', id: team.id || team.name })}
                                className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${followed
                                    ? 'bg-gold text-bg-dark shadow-[0_0_30px_rgba(212,175,55,0.8)] border-gold'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {followed ? 'Following' : 'Follow'}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner">
                                <p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">Rank</p>
                                <p className="text-xl font-black italic">{team.rank || team.ranking || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">ACS Avg</p><p className="text-xl font-black italic">{team.stats.avgKills}</p></div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-inner"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest leading-none">Rating</p><p className="text-xl font-black italic">{team.stats.avgPoints}</p></div>
                        </div>
                        <div className="space-y-4 shadow-inner p-2 rounded-2xl bg-black/20 border border-white/5">
                            <p className="text-[9px] text-gray-500 uppercase font-black ml-2 tracking-[0.2em] mb-2 leading-none">Active Roster</p>
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

const PlayerSection = ({ players = [] }) => {
    const { isFollowingPlayer, toggleFollowPlayer } = useFollowedPlayers();
    const [selectedTeam, setSelectedTeam] = useState('all');

    const handlePlayerClick = (e, playerName) => {
        e.preventDefault();
        window.history.pushState({}, '', `/player/${playerName}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    // Extract unique teams from players
    const teams = ['all', ...new Set(players.map(p => p.team || p.teamName || p.teamTag).filter(Boolean))];

    // Filter players by selected team
    const filteredPlayers = selectedTeam === 'all'
        ? players
        : players.filter(p => (p.team || p.teamName || p.teamTag) === selectedTeam);

    return (
        <div className="space-y-6">
            {/* Team Filter */}
            {teams.length > 1 && (
                <div className="flex items-center gap-4 p-4 bg-card border border-white/5 rounded-2xl">
                    <Users className="w-5 h-5 text-gold" />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Filter by Team:</span>
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="flex-1 max-w-xs px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold uppercase text-xs tracking-widest focus:border-gold/50 focus:outline-none transition-colors cursor-pointer"
                    >
                        <option value="all">All Teams</option>
                        {teams.filter(t => t !== 'all').map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    <span className="text-xs text-gray-500 font-bold">
                        {filteredPlayers.length} {filteredPlayers.length === 1 ? 'Player' : 'Players'}
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {players.length === 0 ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <User className="w-16 h-16 text-gold/40 mb-4" />
                        <h3 className="text-2xl font-bold uppercase tracking-tighter italic mb-2">No Players Found</h3>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-md leading-relaxed">Player data will appear here.</p>
                    </div>
                ) : filteredPlayers.map((player) => (
                    <div key={player.id || player.name} className="bg-card border border-white/5 rounded-3xl p-8 transition-all flex flex-col xl:flex-row gap-8 shadow-xl border-l-[3px] border-l-gold hover:-translate-y-1 group">
                        <div className="shrink-0 text-center xl:text-left">
                            <div
                                onClick={(e) => handlePlayerClick(e, player.name || player.ign || 'Unknown')}
                                className="w-24 h-24 bg-gradient-to-br from-gold/10 to-transparent rounded-[2.5rem] mx-auto xl:mx-0 mb-4 border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-gold/30 transition-colors cursor-pointer"
                            >
                                {player.img || player.image || player.photo ? (
                                    <img src={player.img || player.image || player.photo} alt={player.name || player.ign} className="w-full h-full rounded-2xl object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                    <User className="w-12 h-12 text-gold/40" />
                                )}
                            </div>
                            <span className="px-4 py-1.5 bg-gold/10 text-gold border border-gold/20 text-[9px] font-black uppercase tracking-widest rounded-full">{player.role || player.position || 'Player'}</span>
                        </div>
                        <div className="flex-1">
                            <div className="mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                                <div>
                                    <h3
                                        onClick={(e) => handlePlayerClick(e, player.name || player.ign || 'Unknown')}
                                        className="text-3xl font-black uppercase tracking-tighter mb-1 italic cursor-pointer hover:text-gold transition-colors relative inline-block"
                                    >
                                        {player.name || player.ign || 'Unknown Player'}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-none">{player.team || player.teamName || player.teamTag || 'Free Agent'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFollowPlayer(player.name || player.ign || player.id);
                                        }}
                                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isFollowingPlayer(player.name || player.ign || player.id)
                                            ? 'bg-gold text-bg-dark border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                            }`}
                                    >
                                        {isFollowingPlayer(player.name || player.ign || player.id) ? 'Following' : 'Follow'}
                                    </button>
                                    <div className="flex gap-1 h-8">
                                        {(player.performance || [1, 1, 1, 1, 1, 1, 1]).map((val, idx) => (
                                            <div key={idx} className="w-2.5 bg-gold/20 rounded-t-sm self-end hover:bg-gold transition-colors" style={{ height: `${(val / 30) * 100}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Target className="w-3 h-3" /> K/D</p><p className="text-md font-black italic">{player.stats?.kd || 'N/A'}</p></div>
                                <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Swords className="w-3 h-3" /> ACS</p><p className="text-md font-black italic">{player.stats?.acs || player.stats?.kills || 'N/A'}</p></div>
                                <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Zap className="w-3 h-3" /> ADR</p><p className="text-md font-black italic">{player.stats?.adr || player.stats?.matches || 'N/A'}</p></div>
                                <div className="text-center xl:text-left"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-center xl:justify-start mb-1 leading-none"><Trophy className="w-3 h-3" /> KAST%</p><p className="text-md font-black italic text-gold">{player.stats?.kast || player.stats?.mvp || 'N/A'}</p></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ValorantPage;
