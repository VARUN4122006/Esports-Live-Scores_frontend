import { useState, useEffect, useRef } from 'react';
import { Menu, X, Zap, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { globalSearch } from '../data/searchData';

const Navbar = ({ onSignInClick, user, onLogout, showNavLinks = true }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ players: [], teams: [], tournaments: [] });

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcut Cmd/Ctrl + K for search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Real-time search
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const results = globalSearch(searchQuery);
            setSearchResults(results);
        } else {
            setSearchResults({ players: [], teams: [], tournaments: [] });
        }
    }, [searchQuery]);

    const navLinks = [
        { name: 'Why Us', href: '#why-us' },
        { name: 'Games', href: '#games' },
        { name: 'Features', href: '#features' },
    ];

    const handleSignInClick = () => {
        if (onSignInClick) onSignInClick();
    };

    const handleNavClick = (e, href) => {
        if (href.startsWith('#')) {
            // Internal section link
            return;
        }
        e.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleSearchSelect = (type, item) => {
        setIsSearchOpen(false);
        setSearchQuery('');

        if (type === 'player') {
            window.history.pushState({}, '', `/player/${item.name}`);
        } else if (type === 'team') {
            window.history.pushState({}, '', `/game/${item.gameSlug}#teams:${item.id}`);
        } else if (type === 'tournament') {
            window.history.pushState({}, '', `/game/${item.gameSlug}#tournaments`);
        }
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[150] transition-all duration-300 ${isScrolled || !showNavLinks ? 'bg-bg-dark/95 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div
                    onClick={(e) => handleNavClick(e, '/')}
                    className="flex items-center gap-2 text-2xl font-heading font-bold tracking-tighter text-white cursor-pointer group transition-transform hover:scale-105 active:scale-95 duration-200"
                >
                    <Zap className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform duration-300" />
                    <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent transition-all">
                        EsportsBuzz
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {showNavLinks && navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="text-gray-300 hover:text-gold transition-all duration-200 text-sm font-body font-semibold uppercase tracking-widest hover:tracking-[0.15em] relative py-1 group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}

                    {/* Search Bar */}
                    <div className="relative" ref={searchRef}>
                        <button
                            onClick={() => {
                                setIsSearchOpen(true);
                                setTimeout(() => searchInputRef.current?.focus(), 100);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-gold/30 transition-all group"
                        >
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
                            <span className="text-gray-400 text-xs hidden lg:block">Search...</span>
                            <kbd className="hidden xl:flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-500 font-mono">
                                <span>⌘</span>K
                            </kbd>
                        </button>

                        {/* Search Dropdown */}
                        {isSearchOpen && (
                            <div className="absolute right-0 top-full mt-2 w-[95vw] sm:w-[500px] max-h-[600px] bg-card border border-gold/20 rounded-2xl shadow-2xl overflow-hidden z-[210] animate-scale-in">
                                {/* Search Input */}
                                <div className="p-4 border-b border-white/10 bg-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search players, teams, tournaments..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/40 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="max-h-[500px] overflow-y-auto">
                                    {searchQuery.length < 2 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            Type at least 2 characters to search
                                        </div>
                                    ) : searchResults.players.length === 0 && searchResults.teams.length === 0 && searchResults.tournaments.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No results found for "{searchQuery}"
                                        </div>
                                    ) : (
                                        <>
                                            {/* Players */}
                                            {searchResults.players.length > 0 && (
                                                <div className="p-3">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-3 mb-2">Players</p>
                                                    {searchResults.players.map((player) => (
                                                        <button
                                                            key={player.id}
                                                            onClick={() => handleSearchSelect('player', player)}
                                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                                                        >
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                                                                <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className="font-bold text-sm group-hover:text-gold transition-colors">{player.name}</p>
                                                                <p className="text-xs text-gray-500">{player.team} · {player.game}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Teams */}
                                            {searchResults.teams.length > 0 && (
                                                <div className="p-3 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-3 mb-2">Teams</p>
                                                    {searchResults.teams.map((team) => (
                                                        <button
                                                            key={team.id}
                                                            onClick={() => handleSearchSelect('team', team)}
                                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: team.color + '15', color: team.color }}>
                                                                {team.logo}
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className="font-bold text-sm group-hover:text-gold transition-colors">{team.name}</p>
                                                                <p className="text-xs text-gray-500">{team.game}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tournaments */}
                                            {searchResults.tournaments.length > 0 && (
                                                <div className="p-3 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-3 mb-2">Tournaments</p>
                                                    {searchResults.tournaments.map((tournament) => (
                                                        <button
                                                            key={tournament.id}
                                                            onClick={() => handleSearchSelect('tournament', tournament)}
                                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                                                        >
                                                            <div className="flex-1 text-left">
                                                                <p className="font-bold text-sm group-hover:text-gold transition-colors">{tournament.name}</p>
                                                                <p className="text-xs text-gray-500">{tournament.game} · {tournament.status}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none group focus-visible:ring-2 focus-visible:ring-gold rounded-full p-0.5 transition-transform active:scale-95 duration-100"
                                    title={`Logged in as ${user.username || 'User'} — Access Dashboard & Session controls`}
                                >
                                    <div className="relative">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border-2 border-amber object-cover group-hover:border-gold transition-colors" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-gold flex items-center justify-center text-white font-bold border-2 border-white/20 text-sm shadow-lg group-hover:shadow-amber/50 transition-all">
                                                {user.username ? user.username.substring(0, 1).toUpperCase() : 'G'}
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-bg-dark shadow-[0_0_8px_#39FF14]"></div>
                                    </div>
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute right-0 top-full mt-3 w-48 bg-card border border-gold/20 rounded-xl shadow-2xl overflow-hidden z-[60] origin-top-right transition-all duration-200 ease-out ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                                >
                                    <div className="p-3 border-b border-white/5 bg-white/5">
                                        <p className="text-white font-bold truncate text-xs">{user.username || 'Gamer'}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <a
                                            href="/dashboard"
                                            onClick={(e) => {
                                                setIsDropdownOpen(false);
                                                handleNavClick(e, '/dashboard');
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-gold transition-colors group"
                                        >
                                            <LayoutDashboard className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                            Dashboard
                                        </a>
                                        <div className="h-px bg-white/5 mx-2 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left group"
                                        >
                                            <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleSignInClick}
                                className="relative z-[60] px-6 py-2 bg-gradient-to-r from-gold to-amber text-bg-dark border border-gold hover:brightness-110 transition-all duration-300 rounded-full font-button font-bold uppercase text-xs tracking-widest cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`absolute top-full left-0 w-full bg-card border-b border-gold/10 md:hidden flex flex-col items-center py-8 gap-6 shadow-2xl transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
            >
                {showNavLinks && navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            handleNavClick(e, link.href);
                        }}
                        className="text-xl text-white font-bold hover:text-gold transition-colors"
                    >
                        {link.name}
                    </a>
                ))}
                {user ? (
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            onLogout();
                        }}
                        className="px-8 py-3 bg-red-500 text-white rounded-full font-bold cursor-pointer hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleSignInClick();
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-gold to-amber text-bg-dark rounded-full font-bold cursor-pointer hover:brightness-110 transition-colors"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
