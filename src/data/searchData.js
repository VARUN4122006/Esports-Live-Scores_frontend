import { valorantData } from './valorantData';
import { lolData } from './lolData';
import { dota2Data } from './dota2Data';
import { cs2Data } from './cs2Data';
import { bgmiData } from './bgmiData';
import { ffData } from './ffData';
import { getAllPlayers } from './playerStore';

// Unified search index for instant discovery
export const searchData = {
    players: [],
    teams: [],
    tournaments: []
};

// Aggregate all players from unified player store
const allPlayers = getAllPlayers().flatMap(player =>
    player.games.map(gameData => ({
        id: player.id,
        name: player.name,
        realName: player.realName,
        nationality: player.nationality,
        team: gameData.team,
        role: gameData.role,
        game: gameData.game === 'valorant' ? 'Valorant' :
            gameData.game === 'bgmi' ? 'Battlegrounds Mobile India' :
                gameData.game === 'cs2' ? 'Counter-Strike 2' :
                    gameData.game === 'dota2' ? 'Dota 2' :
                        gameData.game === 'lol' ? 'League of Legends' :
                            gameData.game === 'freefire' ? 'Free Fire' : gameData.game,
        gameSlug: gameData.game === 'bgmi' ? 'battlegroundsmobileindia' :
            gameData.game === 'lol' ? 'leagueoflegends' :
                gameData.game,
        img: gameData.img,
        stats: gameData.stats
    }))
);

// Aggregate all teams from all games
const allTeams = [
    ...valorantData.teams.map(t => ({ ...t, game: 'Valorant', gameSlug: 'valorant' })),
    ...lolData.teams.map(t => ({ ...t, game: 'League of Legends', gameSlug: 'leagueoflegends' })),
    ...dota2Data.teams.map(t => ({ ...t, game: 'Dota 2', gameSlug: 'dota2' })),
    ...cs2Data.teams.map(t => ({ ...t, game: 'Counter-Strike 2', gameSlug: 'cs2' })),
    ...bgmiData.teams.map(t => ({ ...t, game: 'Battlegrounds Mobile India', gameSlug: 'battlegroundsmobileindia' })),
    ...ffData.teams.map(t => ({ ...t, game: 'Free Fire', gameSlug: 'freefire' })),
];

// Aggregate all tournaments from all games
const allTournaments = [
    ...valorantData.tournaments.map(t => ({ ...t, game: 'Valorant', gameSlug: 'valorant' })),
    ...lolData.tournaments.map(t => ({ ...t, game: 'League of Legends', gameSlug: 'leagueoflegends' })),
    ...dota2Data.tournaments.map(t => ({ ...t, game: 'Dota 2', gameSlug: 'dota2' })),
    ...cs2Data.tournaments.map(t => ({ ...t, game: 'Counter-Strike 2', gameSlug: 'cs2' })),
];

searchData.players = allPlayers;
searchData.teams = allTeams;
searchData.tournaments = allTournaments;

// Fuzzy search function
export const fuzzySearch = (query, items, keys) => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();

    return items
        .map(item => {
            let score = 0;
            let matchedKey = '';

            keys.forEach(key => {
                const value = item[key]?.toLowerCase() || '';
                if (value.includes(lowerQuery)) {
                    // Exact match gets higher score
                    if (value === lowerQuery) {
                        score += 100;
                    } else if (value.startsWith(lowerQuery)) {
                        score += 50;
                    } else {
                        score += 25;
                    }
                    matchedKey = key;
                }
            });

            return { ...item, score, matchedKey };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
};

// Main search function
export const globalSearch = (query) => {
    if (!query || query.length < 2) return { players: [], teams: [], tournaments: [] };

    const players = fuzzySearch(query, searchData.players, ['name', 'team', 'role']);
    const teams = fuzzySearch(query, searchData.teams, ['name', 'logo']);
    const tournaments = fuzzySearch(query, searchData.tournaments, ['name', 'status']);

    return {
        players: players.slice(0, 5),
        teams: teams.slice(0, 5),
        tournaments: tournaments.slice(0, 3)
    };
};
