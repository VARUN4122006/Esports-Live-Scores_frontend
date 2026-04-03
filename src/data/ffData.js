export const ffData = {
    liveMatches: [
        {
            id: 'ff-match-1',
            tournament: 'Free Fire World Series (FFWS)',
            round: 'Grand Finals',
            map: 'Bermuda',
            status: 'Live',
            teams: [
                { name: 'Team Elite', kills: 12, rank: 1, logo: 'TE' },
                { name: 'Total Gaming', kills: 8, rank: 2, logo: 'TG' }
            ]
        },
        {
            id: 'ff-match-2',
            tournament: 'Free Fire Pro League',
            round: 'League Stage',
            map: 'Purgatory',
            status: 'Live',
            teams: [
                { name: 'Nigma Galaxy', kills: 15, rank: 1, logo: 'NG' },
                { name: 'Evos Divine', kills: 10, rank: 3, logo: 'ED' }
            ]
        }
    ],
    tournaments: [
        { id: 'ff-tourney-1', name: 'FFWS 2024', prizePool: '$2,000,000', teams: 18, status: 'Ongoing', region: 'Global', format: 'Battle Royale' },
        { id: 'ff-tourney-2', name: 'Free Fire World Cup', prizePool: '$1,500,000', teams: 24, status: 'Upcoming', region: 'Global', format: 'Battle Royale' }
    ],
    playerIds: ['vasiyocrj', 'pahadi'],
    teams: [
        {
            id: 'ff-team-1',
            name: 'Team Elite',
            logo: 'TE',
            color: '#FFD700',
            achievements: ['FFWS 2021 Winners', 'Pro League Champions'],
            stats: { winRate: '68%', avgPoints: 12.5, avgKills: 8.2 },
            roster: ['VasiyoCRJ', 'Pahadi', 'Killer', 'Jonty']
        },
        {
            id: 'ff-team-2',
            name: 'Total Gaming',
            logo: 'TG',
            color: '#FF8C00',
            achievements: ['FFIC Champions', 'Pro League Runner-up'],
            stats: { winRate: '62%', avgPoints: 10.8, avgKills: 7.5 },
            roster: ['FozyAjay', 'Mafia', 'Delete', 'Java']
        }
    ]
};
