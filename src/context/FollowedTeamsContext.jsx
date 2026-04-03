import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const FollowedTeamsContext = createContext();

export const useFollowedTeams = () => useContext(FollowedTeamsContext);

export const FollowedTeamsProvider = ({ children }) => {
    const [followedTeams, setFollowedTeams] = useState(() => {
        try {
            const saved = localStorage.getItem('esportsFollowedTeams');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('esportsFollowedTeams', JSON.stringify(followedTeams));

        // Sync with backend if authenticated
        if (apiClient.auth.isAuthenticated()) {
            const teamIds = followedTeams.map(t => t.id);
            apiClient.auth.updateProfile({ followedTeams: teamIds })
                .catch(err => console.error('Failed to sync followed teams:', err));
        }
    }, [followedTeams]);

    const isFollowing = (teamId) => followedTeams.some(t => t.id === teamId);

    const toggleFollow = (team) => {
        setFollowedTeams(prev =>
            prev.some(t => t.id === team.id)
                ? prev.filter(t => t.id !== team.id)
                : [...prev, { id: team.id, name: team.name, logo: team.logo, color: team.color, game: team.game }]
        );
    };

    const unfollowTeam = (teamId) => {
        setFollowedTeams(prev => prev.filter(t => t.id !== teamId));
    };

    return (
        <FollowedTeamsContext.Provider value={{ followedTeams, toggleFollow, isFollowing, unfollowTeam }}>
            {children}
        </FollowedTeamsContext.Provider>
    );
};
