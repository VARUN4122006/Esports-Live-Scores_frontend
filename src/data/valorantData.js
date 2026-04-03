export const valorantData = {
    liveMatches: [
        {
            id: 'v-live-1',
            tournament: 'VCT Masters Madrid',
            round: 'Grand Finals',
            map: 'Lotus',
            status: 'Live',
            teams: [
                { name: 'Sentinels', logo: 'SEN', kills: 12, rank: 1 },
                { name: 'Gen.G', logo: 'GEN', kills: 10, rank: 2 }
            ]
        },
        {
            id: 'v-live-2',
            tournament: 'Challengers NA',
            round: 'Semi-Finals',
            map: 'Ascent',
            status: 'Live',
            teams: [
                { name: 'M80', logo: 'M80', kills: 8, rank: 1 },
                { name: 'G2 Esports', logo: 'G2', kills: 7, rank: 2 }
            ]
        }
    ],
    tournaments: [
        { id: 'v-t1', name: 'Valorant Champions 2026', status: 'Ongoing', prizePool: '$2,250,000', teams: 16, format: 'Double Elimination' },
        { id: 'v-t2', name: 'VCT Pacific Kickoff', status: 'Upcoming', prizePool: '$250,000', teams: 11, format: 'Group Stage' }
    ],
    teams: [
        { id: 'sen', name: 'Sentinels', logo: 'SEN', color: '#ff4655', stats: { winRate: '78%', avgKills: '14.2', avgPoints: '210' }, achievements: ['Masters Madrid Winner', 'Champions 2021'], roster: ['TenZ', 'Zekken', 'Sacy', 'pANcada', 'Marved'] },
        { id: 'fnc', name: 'Fnatic', logo: 'FNC', color: '#ffb700', stats: { winRate: '82%', avgKills: '15.5', avgPoints: '225' }, achievements: ['LOCK//IN Winner', 'Masters Tokyo Winner'], roster: ['Boaster', 'Derke', 'Alfajer', 'Leo', 'Chronicle'] }
    ],
    playerIds: ['tenz', 'boaster']
};
