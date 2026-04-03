import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const FollowedPlayersContext = createContext();

export const useFollowedPlayers = () => useContext(FollowedPlayersContext);

export const FollowedPlayersProvider = ({ children }) => {
    const [followedPlayers, setFollowedPlayers] = useState(() => {
        try {
            const saved = localStorage.getItem('esportsFollowedPlayers');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('esportsFollowedPlayers', JSON.stringify(followedPlayers));

        // Sync with backend if authenticated
        if (apiClient.auth.isAuthenticated()) {
            const playerNames = followedPlayers.map(p => p.name);
            apiClient.auth.updateProfile({ followedPlayers: playerNames })
                .catch(err => console.error('Failed to sync followed players:', err));
        }
    }, [followedPlayers]);

    const isFollowingPlayer = (playerName) => followedPlayers.some(p => p.name === playerName);

    const toggleFollowPlayer = (player) => {
        setFollowedPlayers(prev =>
            prev.some(p => p.name === player.name)
                ? prev.filter(p => p.name !== player.name)
                : [...prev, { id: player.id || player.name, name: player.name, team: player.team, game: player.game || 'Valorant', img: player.img }]
        );
    };

    const unfollowPlayer = (playerName) => {
        setFollowedPlayers(prev => prev.filter(p => p.name !== playerName));
    };

    return (
        <FollowedPlayersContext.Provider value={{ followedPlayers, toggleFollowPlayer, isFollowingPlayer, unfollowPlayer }}>
            {children}
        </FollowedPlayersContext.Provider>
    );
};
