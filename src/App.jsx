import { useState, useEffect } from 'react';
import PlayerProfile from './components/PlayerProfile';
import { FollowedTeamsProvider } from './context/FollowedTeamsContext';
import { FollowedPlayersProvider } from './context/FollowedPlayersContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Games from './components/Games';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import News from './components/News';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import Dashboard from './components/Dashboard';
import FreeFirePage from './components/FreeFirePage';
import BGMIPage from './components/BGMIPage';
import ValorantPage from './components/ValorantPage';
import CS2Page from './components/CS2Page';
import Dota2Page from './components/Dota2Page';
import LoLPage from './components/LoLPage';
import apiClient from './api/apiClient';


const LandingPage = ({ onGameSelect }) => (
  <div className="animate-fade-in">
    <Hero />
    <News />
    <WhyUs />
    <Games onGameSelect={onGameSelect} />
    <Features />
    <CTA />
  </div>
);

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);


  // Initialize user from storage and validate with backend
  useEffect(() => {
    const initializeUser = async () => {
      setIsAuthLoading(true);
      // Check if we have a valid JWT token
      if (apiClient.auth.isAuthenticated()) {
        try {
          // Fetch fresh user data from backend
          const response = await apiClient.auth.getProfile();
          if (response.success && response.user) {
            setUser(response.user);
            // Update both storages
            sessionStorage.setItem('user', JSON.stringify(response.user));

            // Check if user was previously "remembered"
            const persistentUser = localStorage.getItem('user');
            if (persistentUser) {
              localStorage.setItem('user', JSON.stringify(response.user));
            }
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Token might be invalid/expired, clear everything
          apiClient.auth.logout();
          setUser(null);
          sessionStorage.removeItem('user');
          localStorage.removeItem('user');
        }
      } else {
        // No token, check localStorage for cached user (offline mode)
        const sessionUser = sessionStorage.getItem('user');
        const persistentUser = localStorage.getItem('user');

        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
        } else if (persistentUser) {
          setUser(JSON.parse(persistentUser));
          sessionStorage.setItem('user', persistentUser);
        }
      }

      setIsAuthLoading(false);
    };

    initializeUser();
  }, []);

  const handleLoginSuccess = (userData, rememberMe = false) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    // Clear JWT token and user data using API client
    apiClient.auth.logout();

    setUser(null);
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    setPath('/');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Custom Router Sync
  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath) => {
    const [purePath] = newPath.split('#');
    window.history.pushState({}, '', newPath);
    setPath(purePath);
  };

  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
      setHash(window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle anchor scrolling after routing/mounting
  useEffect(() => {
    // ALWAYS reset to top on path change, even if there's a hash
    // But if ONLY the hash changed on the same path, we don't necessarily want to scroll to top?
    // Actually, for consistency with our 500ms delay, resetting to top is safer.
    // However, if we're on the same page, jumping to top is jarring.

    // Check if path changed from previous (handled by React state update)
    // If path is same, maybe skip scrollTo(0,0)

    const currentHash = window.location.hash;

    if (currentHash) {
      const targetId = currentHash.includes(':') ? `team-${currentHash.split(':')[1]}` : currentHash.slice(1);

      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 160;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // If no hash, just ensure we are at top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [path, hash]); // Trigger on path OR hash change

  return (
    <FollowedTeamsProvider>
      <FollowedPlayersProvider>
        <div className="min-h-screen bg-bg-dark text-white selection:bg-gold selection:text-bg-dark font-sans">


          <Navbar
            onSignInClick={() => setIsAuthModalOpen(true)}
            user={user}
            onLogout={handleLogout}
            showNavLinks={path === '/'}
          />

          <main className="relative">
            {path === '/' && (
              <LandingPage
                onGameSelect={(game) => {
                  const slug = game.toLowerCase().replace(/\s+/g, '');
                  navigate(`/game/${slug}`);
                }}
              />
            )}

            {path.startsWith('/player/') && (
              <div className="animate-fade-in">
                <PlayerProfile />
              </div>
            )}

            {path === '/game/freefire' && (
              <div className="animate-fade-in">
                <FreeFirePage onBack={() => navigate('/#games')} />
              </div>
            )}

            {path === '/game/battlegroundsmobileindia' && (
              <div className="animate-fade-in">
                <BGMIPage onBack={() => navigate('/#games')} />
              </div>
            )}

            {path === '/game/valorant' && (
              <div className="animate-fade-in">
                <ValorantPage onBack={() => navigate('/#games')} />
              </div>
            )}

            {path === '/game/cs2' && (
              <div className="animate-fade-in">
                <CS2Page onBack={() => navigate('/#games')} />
              </div>
            )}

            {path === '/game/dota2' && (
              <div className="animate-fade-in">
                <Dota2Page onBack={() => navigate('/#games')} />
              </div>
            )}

            {path === '/dashboard' && (
              <div className="animate-fade-in">
                {isAuthLoading ? (
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-crimson border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                  </div>
                ) : user ? (
                  <Dashboard
                    onBack={() => navigate('/#games')}
                    onNavigate={navigate}
                    refreshUser={async () => {
                      // Fetch fresh user data from backend
                      try {
                        const response = await apiClient.auth.getProfile();
                        if (response.success && response.user) {
                          setUser(response.user);
                          sessionStorage.setItem('user', JSON.stringify(response.user));
                          const persistentUser = localStorage.getItem('user');
                          if (persistentUser) {
                            localStorage.setItem('user', JSON.stringify(response.user));
                          }
                        }
                      } catch (error) {
                        console.error('Failed to refresh user:', error);
                      }
                    }}
                  />
                ) : (
                  <>
                    {(() => {
                      // Redirect to home and open auth modal if not logged in
                      setTimeout(() => {
                        navigate('/');
                        setIsAuthModalOpen(true);
                      }, 0);
                      return null;
                    })()}
                  </>
                )}
              </div>
            )}

            {path === '/game/leagueoflegends' && (
              <div className="animate-fade-in">
                <LoLPage onBack={() => navigate('/#games')} />
              </div>
            )}

            {path.startsWith('/game/') &&
              !['/game/freefire', '/game/battlegroundsmobileindia', '/game/valorant', '/game/cs2', '/game/dota2', '/game/leagueoflegends'].includes(path) && (
                <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center px-6 animate-fade-in">
                  <div className="w-24 h-24 bg-gold/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <span className="text-4xl">🛠️</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-gold italic">Under Construction</h2>
                  <p className="text-gray-400 mb-8 uppercase font-bold tracking-widest text-xs max-w-md">
                    The dedicated page for <span className="text-white">{path.split('/').pop().toUpperCase()}</span> is currently being forged.
                  </p>
                  <button
                    onClick={() => navigate('/#games')}
                    className="px-10 py-4 bg-white text-bg-dark font-black uppercase tracking-widest rounded-full hover:bg-gold hover:text-bg-dark transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    Return to Base
                  </button>
                </div>
              )}
          </main>

          <Footer onLegalClick={(type) => setLegalModal(type)} />

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            onLegalClick={(type) => setLegalModal(type)}
          />

          <LegalModal
            isOpen={!!legalModal}
            onClose={() => setLegalModal(null)}
            type={legalModal}
          />
        </div>
      </FollowedPlayersProvider>
    </FollowedTeamsProvider>
  );
}

export default App;
