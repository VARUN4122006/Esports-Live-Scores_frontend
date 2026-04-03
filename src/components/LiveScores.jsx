import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function LiveScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLiveScores();
  }, []);

  const fetchLiveScores = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/api/live-scores');
      setScores(data.scores);
      setError(null);
    } catch (err) {
      setError('Failed to fetch live scores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading scores...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Scores</h2>
      <div className="space-y-2">
        {scores.map((score, idx) => (
          <div key={idx} className="bg-gray-900 p-4 rounded">
            <div className="text-white">{score.game}</div>
            <div className="text-green-400">{score.status}: {score.score}</div>
          </div>
        ))}
      </div>
      <button 
        onClick={fetchLiveScores}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}
