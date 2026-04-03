/**
 * Unified Player Store
 * Central repository for all player data across all games
 */

export const playerStore = {
    // Valorant Players
    'tenz': {
        id: 'tenz',
        name: 'TenZ',
        realName: 'Tyson Ngo',
        nationality: 'Canada',
        games: [{
            game: 'valorant',
            team: 'Sentinels',
            role: 'Duelist',
            img: 'https://img-cdn.hltv.org/playerid/13254.png?ixlib=java-2.1.0&w=400&s=1f1f1f',
            stats: {
                kd: '1.45',
                kills: '240',
                matches: '12',
                mvp: '4',
                acs: '285',
                adr: '168',
                hs: '24%',
                fk: '0.18',
                kast: '78%'
            },
            performance: [20, 25, 18, 22, 30]
        }]
    },
    'boaster': {
        id: 'boaster',
        name: 'Boaster',
        realName: 'Jake Howlett',
        nationality: 'UK',
        games: [{
            game: 'valorant',
            team: 'Fnatic',
            role: 'IGL',
            img: 'https://img-cdn.hltv.org/playerid/1234.png',
            stats: {
                kd: '1.10',
                kills: '150',
                matches: '15',
                mvp: '2',
                acs: '195',
                adr: '125',
                hs: '19%',
                fk: '0.09',
                kast: '72%'
            },
            performance: [15, 12, 18, 14, 20]
        }]
    },

    // BGMI Players
    'soul-hector': {
        id: 'soul-hector',
        name: 'Soul Hector',
        realName: 'Hector',
        nationality: 'India',
        games: [{
            game: 'bgmi',
            team: 'Team Soul',
            role: 'Support',
            img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hector',
            stats: {
                kd: 3.2,
                kills: 850,
                matches: 320,
                mvp: 28
            },
            performance: [12, 10, 15, 8, 20]
        }]
    },
    'godl-jonathan': {
        id: 'godl-jonathan',
        name: 'GodL Jonathan',
        realName: 'Jonathan',
        nationality: 'India',
        games: [{
            game: 'bgmi',
            team: 'GodLike Esports',
            role: 'Assaulter',
            img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan',
            stats: {
                kd: 4.8,
                kills: 2200,
                matches: 600,
                mvp: 85
            },
            performance: [25, 30, 18, 22, 28]
        }]
    },

    // CS2 Players
    'zywoo': {
        id: 'zywoo',
        name: 'ZywOo',
        realName: 'Mathieu Herbaut',
        nationality: 'France',
        games: [{
            game: 'cs2',
            team: 'Vitality',
            role: 'AWPer',
            img: 'https://img-cdn.hltv.org/playerid/11893.png',
            stats: {
                kd: '1.55',
                kills: '320',
                matches: '18',
                mvp: '7',
                rating: '1.48',
                kast: '82%',
                hs: '58%',
                adr: '95.4'
            },
            performance: [25, 30, 22, 28, 35]
        }]
    },
    'donk': {
        id: 'donk',
        name: 'donk',
        realName: 'Danil Kryshkovets',
        nationality: 'Russia',
        games: [{
            game: 'cs2',
            team: 'Spirit',
            role: 'Rifler',
            img: 'https://img-cdn.hltv.org/playerid/21167.png',
            stats: {
                kd: '1.48',
                kills: '290',
                matches: '14',
                mvp: '5',
                rating: '1.42',
                kast: '78%',
                hs: '62%',
                adr: '88.2'
            },
            performance: [28, 24, 32, 26, 30]
        }]
    },

    // Dota 2 Players
    'yatoro': {
        id: 'yatoro',
        name: 'Yatoro',
        realName: 'Illya Mulyarchuk',
        nationality: 'Ukraine',
        games: [{
            game: 'dota2',
            team: 'Team Spirit',
            role: 'Carry',
            img: 'https://liquipedia.net/commons/images/0/0/Yatoro_TI12.png',
            stats: {
                kd: '4.2',
                kills: '450',
                matches: '25',
                mvp: '10',
                gpm: '685',
                xpm: '745',
                lh10: '82',
                heroDmg: '28k',
                towerDmg: '4.2k'
            },
            performance: [40, 35, 45, 38, 50]
        }]
    },
    'quinn': {
        id: 'quinn',
        name: 'Quinn',
        realName: 'Quinn Callahan',
        nationality: 'USA',
        games: [{
            game: 'dota2',
            team: 'Gaimin Gladiators',
            role: 'Mid',
            img: 'https://liquipedia.net/commons/images/a/a/Quinn_Berlin_Major.png',
            stats: {
                kd: '3.8',
                kills: '400',
                matches: '24',
                mvp: '6',
                gpm: '620',
                xpm: '710',
                lh10: '78',
                heroDmg: '26k',
                towerDmg: '3.8k'
            },
            performance: [35, 38, 32, 40, 42]
        }]
    },

    // League of Legends Players
    'faker': {
        id: 'faker',
        name: 'Faker',
        realName: 'Lee Sang-hyeok',
        nationality: 'South Korea',
        games: [{
            game: 'lol',
            team: 'T1',
            role: 'Mid',
            img: 'https://liquipedia.net/commons/images/8/82/Faker_Worlds_2023.png',
            stats: {
                kd: '4.5',
                kills: '210',
                matches: '20',
                mvp: '8',
                kda: '5.2',
                csMin: '9.8',
                goldMin: '442',
                vision: '1.85',
                dmgPct: '28%'
            },
            performance: [25, 22, 28, 30, 35]
        }]
    },
    'chovy': {
        id: 'chovy',
        name: 'Chovy',
        realName: 'Jeong Ji-hoon',
        nationality: 'South Korea',
        games: [{
            game: 'lol',
            team: 'Gen.G',
            role: 'Mid',
            img: 'https://liquipedia.net/commons/images/a/a2/Chovy_LCK_Spring_2024.png',
            stats: {
                kd: '4.8',
                kills: '190',
                matches: '18',
                mvp: '6',
                kda: '6.1',
                csMin: '10.2',
                goldMin: '458',
                vision: '1.62',
                dmgPct: '31%'
            },
            performance: [28, 25, 32, 27, 30]
        }]
    },

    // Free Fire Players
    'vasiyocrj': {
        id: 'vasiyocrj',
        name: 'VasiyoCRJ',
        realName: 'Vasiyo',
        nationality: 'India',
        games: [{
            game: 'freefire',
            team: 'Team Elite',
            role: 'IGL',
            img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vasiyo',
            stats: {
                kd: 3.8,
                kills: 1250,
                matches: 450,
                mvp: 45
            },
            performance: [15, 18, 12, 20, 15]
        }]
    },
    'pahadi': {
        id: 'pahadi',
        name: 'Pahadi',
        realName: 'Pahadi',
        nationality: 'India',
        games: [{
            game: 'freefire',
            team: 'Team Elite',
            role: 'Sniper',
            img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pahadi',
            stats: {
                kd: 4.2,
                kills: 1400,
                matches: 400,
                mvp: 52
            },
            performance: [10, 25, 15, 12, 18]
        }]
    }
};

/**
 * Helper Functions
 */

// Get player by ID
export const getPlayerById = (playerId) => {
    return playerStore[playerId.toLowerCase()] || null;
};

// Get player by name (case-insensitive)
export const getPlayerByName = (playerName) => {
    const normalizedName = playerName.toLowerCase().replace(/\s+/g, '-');
    return playerStore[normalizedName] ||
        Object.values(playerStore).find(p => p.name.toLowerCase() === playerName.toLowerCase()) ||
        null;
};

// Get all players for a specific game
export const getPlayersByGame = (gameName) => {
    return Object.values(playerStore)
        .filter(player => player.games.some(g => g.game === gameName.toLowerCase()))
        .map(player => {
            const gameData = player.games.find(g => g.game === gameName.toLowerCase());
            return {
                id: player.id,
                name: player.name,
                realName: player.realName,
                nationality: player.nationality,
                ...gameData
            };
        });
};

// Get all players
export const getAllPlayers = () => {
    return Object.values(playerStore);
};

// Get player's game data for a specific game
export const getPlayerGameData = (playerId, gameName) => {
    const player = getPlayerById(playerId);
    if (!player) return null;

    return player.games.find(g => g.game === gameName.toLowerCase()) || null;
};
