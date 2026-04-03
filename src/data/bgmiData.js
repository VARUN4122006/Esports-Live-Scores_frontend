export const bgmiData = {
    liveMatches: [
        {
            id: 'bgmi-match-1',
            tournament: 'BGMI Pro Series (BMPS) 2024',
            round: 'Week 1 | Day 3',
            map: 'Erangel',
            status: 'Live',
            teams: [
                { name: 'Team Soul', kills: 18, rank: 1, logo: 'SQ' },
                { name: 'GodLike Esports', kills: 12, rank: 3, logo: 'GL' }
            ]
        },
        {
            id: 'bgmi-match-2',
            tournament: 'Skyesports Championship 5.0',
            round: 'Grand Finals',
            map: 'Miramar',
            status: 'Live',
            teams: [
                { name: 'Entity Gaming', kills: 14, rank: 1, logo: 'EG' },
                { name: 'Team XSpark', kills: 9, rank: 4, logo: 'TX' }
            ]
        }
    ],
    tournaments: [
        { id: 'bgmi-tourney-1', name: 'BGIS 2024', prizePool: '₹2,00,00,000', teams: 1024, status: 'Ongoing', region: 'India', format: 'Battle Royale' },
        { id: 'bgmi-tourney-2', name: 'BMPS 2024', prizePool: '₹1,00,00,000', teams: 128, status: 'Upcoming', region: 'India', format: 'League' }
    ],
    playerIds: ['soul-hector', 'godl-jonathan'],
    teams: [
        {
            id: 'bgmi-team-1',
            name: 'Team Soul',
            logo: 'SOUL',
            color: '#00FF00',
            achievements: ['BMPS 2022 Champions', 'BGIS 2023 Runners-up'],
            stats: { winRate: '72%', avgPoints: 14.2, avgKills: 9.5 },
            roster: ['Manya', 'Nakul', 'Rony', 'Hector']
        },
        {
            id: 'bgmi-team-2',
            name: 'GodLike Esports',
            logo: 'GODL',
            color: '#FF0000',
            achievements: ['PMGC Finalists', 'Skyesports Champions'],
            stats: { winRate: '65%', avgPoints: 11.8, avgKills: 10.2 },
            roster: ['Jonathan', 'Zgod', 'ClutchGod', 'Neyo']
        }
    ]
};
