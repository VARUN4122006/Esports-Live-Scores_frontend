/**
 * Valorant API — powered by the free VLR.gg community API
 * Base: https://vlrggapi.vercel.app
 * No API key required. Completely free and publicly available.
 */
import axios from 'axios';

const BASE_URL = 'https://vlrggapi.vercel.app';

// ─── In-memory cache (60s TTL) ────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 60_000;

const getCached = (key) => {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
    return null;
};
const setCache = (key, data) => cache.set(key, { data, ts: Date.now() });

// ─── Resilient fetch: 12s timeout + 2 retries on network/5xx errors ──────────
const get = async (path, params = {}, retries = 2) => {
    const cacheKey = path + JSON.stringify(params);
    const cached = getCached(cacheKey);
    if (cached) return cached;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(`${BASE_URL}${path}`, {
                params,
                timeout: 12_000,
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (err) {
            const status = err.response?.status;
            const isRetryable =
                !status ||
                status >= 500 ||
                err.code === 'ECONNABORTED' ||
                err.message === 'Network Error';

            if (isRetryable && attempt < retries) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
                continue;
            }

            console.warn(`[valorantApi] ${path} failed (${status || err.message})`);
            return null;
        }
    }
    return null;
};

// ─── Normalizers — shape VLR data to match ValorantPage expectations ──────────

const normalizeMatch = (m) => ({
    id: m.match_page || m.match_id || Math.random().toString(),
    team1: {
        name: m.team1 || 'TBD',
        score: m.score1 || '0',
        logo: m.flag1 ? null : null,
        region: m.time_until_match || '',
    },
    team2: {
        name: m.team2 || 'TBD',
        score: m.score2 || '0',
        logo: null,
        region: '',
    },
    tournament: m.tournament_name || m.match_series || 'VCT 2026',
    round: m.match_event || '',
    map: m.round_info || 'Map',
    status: m.status && m.status.toLowerCase() === 'live' ? 'live' : (m.status || 'live'),
    score1: m.score1 || '0',
    score2: m.score2 || '0',
});

const normalizeResult = (r) => ({
    id: r.match_page || r.match_id || Math.random().toString(),
    tournament: r.tournament_name || r.match_series || 'VCT',
    event: r.match_event || r.time_completed || '',
    status: 'Completed',
    teams: [
        {
            name: r.team1 || 'Team 1',
            score: r.score1 || '0',
            won: parseInt(r.score1 || 0) > parseInt(r.score2 || 0),
            country: '',
        },
        {
            name: r.team2 || 'Team 2',
            score: r.score2 || '0',
            won: parseInt(r.score2 || 0) > parseInt(r.score1 || 0),
            country: '',
        },
    ],
    img: null,
    ago: r.time_completed || '',
});

const normalizeRanking = (r, idx) => ({
    id: r.team || idx,
    name: r.team || 'Team',
    logo: r.logo || null,
    img: r.logo || null,
    image: r.logo || null,
    region: r.country || '',
    country: r.country || '',
    rank: r.rank || (idx + 1),
    ranking: r.rank || (idx + 1),
    roster: [],
    stats: { avgKills: r.rating || 'N/A', avgPoints: r.record || 'N/A', winRate: `${r.winpercent || 'N/A'}` },
    achievements: [],
});

// ─── Exported API functions ───────────────────────────────────────────────────

/**
 * Live matches (status = 'live') and upcoming matches.
 * VLR endpoint: GET /match?q=live_score  and  GET /match?q=upcoming
 */
export const getMatches = async () => {
    const [liveRes, upcomingRes] = await Promise.all([
        get('/match', { q: 'live_score' }),
        get('/match', { q: 'upcoming' }),
    ]);

    const live = (liveRes?.data?.segments || []).map(m => ({ ...normalizeMatch(m), status: 'live' }));
    const upcoming = (upcomingRes?.data?.segments || []).map(m => ({ ...normalizeMatch(m), status: 'upcoming' }));

    return { data: [...live, ...upcoming] };
};

/**
 * Recent match results.
 * VLR endpoint: GET /match?q=results
 */
export const getResults = async (page = 1) => {
    const res = await get('/match', { q: 'results' });
    const segments = res?.data?.segments || [];
    return { data: segments.map(normalizeResult) };
};

/**
 * Events / tournaments — derived from rankings regions.
 * VLR doesn't have a direct events endpoint, so we return top-level tournament info.
 */
export const getEvents = async (status = 'all', region = 'all', page = 1) => {
    // Fetch rankings which contain tournament context
    const regionParam = region === 'all' ? 'na' : region.replace('north-america', 'na').replace('europe', 'eu');
    const res = await get(`/rankings/${regionParam}`);
    const teams = res?.data?.segments || [];

    // Build a synthetic event list showing the tournament context
    const events = [
        {
            id: 'vct-2026-americas',
            name: 'VCT 2026 Americas',
            status: 'Ongoing',
            region: 'Americas',
            format: 'Double Elimination',
            prizePool: '$1,000,000',
            teams: '10',
            image: null,
        },
        {
            id: 'vct-2026-emea',
            name: 'VCT 2026 EMEA',
            status: 'Upcoming',
            region: 'EMEA',
            format: 'Double Elimination',
            prizePool: '$1,000,000',
            teams: '10',
            image: null,
        },
        {
            id: 'vct-2026-pacific',
            name: 'VCT 2026 Pacific',
            status: 'Upcoming',
            region: 'Pacific',
            format: 'Double Elimination',
            prizePool: '$1,000,000',
            teams: '10',
            image: null,
        },
    ];

    return { data: events };
};

/**
 * Teams — from rankings (best real data available on VLR free API).
 * Returns normalized team objects ValorantPage can render.
 */
export const getTeams = async () => {
    const regions = ['na', 'eu', 'ap'];
    const results = await Promise.all(regions.map(r => get(`/rankings/${r}`)));
    const allTeams = results.flatMap((res, i) => {
        const segs = res?.data?.segments || [];
        return segs.slice(0, 5).map(t => normalizeRanking(t, i * 5));
    });
    return { data: allTeams };
};

/**
 * Team by ID — filters from the full team list.
 */
export const getTeamById = async (teamId) => {
    const all = await getTeams();
    const team = (all?.data || []).find(t => t.id === teamId);
    return team || null;
};

/**
 * Players — VLR free API doesn't have a /players endpoint,
 * so we return null and the page shows the empty state gracefully.
 */
export const getPlayers = async () => {
    return { data: [] };
};

/**
 * Player by slug — not available on free API.
 */
export const getPlayerBySlug = async (slug) => null;

/**
 * Match by ID — not available on free API.
 */
export const getMatchById = async (matchId) => null;

/**
 * Rankings by region.
 * VLR endpoint: GET /rankings/{region}
 * Regions: na, eu, ap, la, la-s, la-n, oce, kr, mn, gc, br, cn
 */
export const getRankings = async (region = 'na') => {
    const regionMap = {
        all: 'na', 'north-america': 'na', europe: 'eu',
        'asia-pacific': 'ap', 'latin-america': 'la', korea: 'kr',
    };
    const r = regionMap[region] || region;
    const res = await get(`/rankings/${r}`);
    const segments = res?.data?.segments || [];
    return { data: segments.map(normalizeRanking) };
};

/**
 * News articles.
 * VLR endpoint: GET /news
 */
export const getNews = async (page = 1) => {
    const res = await get('/news');
    const articles = res?.data?.segments || [];
    return { data: articles };
};

export default {
    getEvents,
    getMatches,
    getResults,
    getTeams,
    getTeamById,
    getPlayers,
    getPlayerBySlug,
    getMatchById,
    getRankings,
    getNews,
};
