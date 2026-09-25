import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import RiskBadge from '../components/RiskBadge';
import UrlScanForm from '../components/UrlScanForm';
import api from '../services/api';

const DashboardPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      const response = await api.get('/scans');
      setScans(response.data.scans || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const stats = useMemo(() => {
    const total = scans.length;
    const safe = scans.filter((scan) => scan.riskLevel === 'Likely Safe').length;
    const suspicious = scans.filter((scan) => scan.riskLevel === 'Suspicious').length;
    const highRisk = scans.filter((scan) => scan.riskLevel === 'High Risk').length;

    return {
      total,
      safe,
      suspicious,
      highRisk,
    };
  }, [scans]);

  const chartData = [
    { name: 'Likely Safe', value: stats.safe },
    { name: 'Suspicious', value: stats.suspicious },
    { name: 'High Risk', value: stats.highRisk },
  ];

  const handleDelete = async (id) => {
    try {
      await api.delete(`/scans/${id}`);
      toast.success('Scan removed.');
      fetchScans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete scan.');
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/scans');
      toast.success('History cleared.');
      fetchScans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to clear history.');
    }
  };

  const handleScanComplete = async (payload) => {
    await fetchScans();
    if (payload?.scan) {
      setScans((prev) => [payload.scan, ...prev]);
    }
  };

  return (
    <Layout>
      <section className="container dashboard-page">
        <div className="dashboard-top">
          <div>
            <span className="eyebrow">Security dashboard</span>
            <h1>URL analysis overview</h1>
          </div>
          <button className="secondary-btn" onClick={handleClearAll}>Clear history</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card emphasis">
            <span>Total URLs scanned</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card success">
            <span>Likely Safe</span>
            <strong>{stats.safe}</strong>
          </div>
          <div className="stat-card warning">
            <span>Suspicious</span>
            <strong>{stats.suspicious}</strong>
          </div>
          <div className="stat-card danger">
            <span>High Risk</span>
            <strong>{stats.highRisk}</strong>
          </div>
        </div>

        <div className="chart-card">
          <h3>Scan statistics</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4ade80" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="scan-panel dashboard-scan-panel">
          <div className="panel-heading">
            <h2>Run a new scan</h2>
          </div>
          <UrlScanForm onScanComplete={handleScanComplete} />
        </div>

        <div className="history-card">
          <div className="history-header">
            <h3>Recent scans</h3>
          </div>

          {loading ? (
            <div className="page-loader small">Loading scans...</div>
          ) : scans.length === 0 ? (
            <p className="empty-state">No scans yet. Use the scanner above to start testing URLs.</p>
          ) : (
            <div className="history-list">
              {scans.map((scan) => (
                <div key={scan._id} className="history-item">
                  <div className="history-meta">
                    <strong>{scan.domain}</strong>
                    <small>{new Date(scan.scannedAt).toLocaleString()}</small>
                  </div>
                  <div className="history-score">
                    <span>{scan.score}/100</span>
                    <RiskBadge riskLevel={scan.riskLevel} />
                  </div>
                  <div className="history-url">{scan.originalUrl}</div>
                  <div className="history-actions">
                    <button className="secondary-btn small" onClick={() => alert(`Protocol: ${scan.protocol}\nRisk: ${scan.riskLevel}\nChecks: ${scan.checks.join(', ')}`)}>View details</button>
                    <button className="danger-btn small" onClick={() => handleDelete(scan._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
