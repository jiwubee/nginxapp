import React, { useState, useEffect } from 'react';
import { fetchStats } from '../api';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instanceId, setInstanceId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchStats();
      setStats(data.stats);
      setInstanceId(data.instanceId);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshCount(c => c + 1);
    await loadStats();
  };

  return (
    <div className="page-container">
      <h1>Statistics</h1>

      {instanceId && (
        <div className="info-box">
          <small>Backend Instance: <code>{instanceId}</code></small>
          <small>Refreshes: <code>{refreshCount}</code></small>
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}

      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h3>Total Value</h3>
            <div className="stat-value">${stats.totalValue}</div>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <div className="stat-value">{stats.categories}</div>
          </div>
          <div className="stat-card">
            <h3>Average Price</h3>
            <div className="stat-value">${stats.averagePrice}</div>
          </div>
        </div>
      ) : null}

      <button onClick={handleRefresh} className="refresh-btn">
        🔄 Refresh Stats
      </button>
    </div>
  );
}

export default Stats;