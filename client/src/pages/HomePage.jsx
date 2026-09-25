import { Link } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';
import UrlScanForm from '../components/UrlScanForm';
import RiskBadge from '../components/RiskBadge';

const securityFeatures = [
  'Domain and protocol checks',
  'Suspicious keyword detection',
  'Phishing pattern review',
  'Threat scoring and risk levels',
];

const checks = [
  'HTTPS availability',
  'Suspicious URL length',
  'Excessive subdomains',
  'URL encoding and obfuscation',
  'Known phishing patterns',
];

const HomePage = () => {
  const [result, setResult] = useState(null);

  return (
    <Layout showHero>
      <section className="container page-section home-scan">
        <div className="scan-panel">
          <div className="panel-heading">
            <h2>Scan a URL</h2>
            <p>Check whether a link appears safe, suspicious, or high risk before you click.</p>
          </div>

          <UrlScanForm onScanComplete={(payload) => setResult(payload.analysis || payload.scan)} />

          {result && (
            <div className="result-card">
              <div className="result-header">
                <div>
                  <p className="label">URL analyzed</p>
                  <p className="url-text">{result.normalizedUrl || 'No URL available'}</p>
                </div>
                <RiskBadge riskLevel={result.riskLevel} />
              </div>

              <div className="stats-grid compact">
                <div className="stat-card">
                  <span>Security Score</span>
                  <strong>{result.score}/100</strong>
                </div>
                <div className="stat-card">
                  <span>Protocol</span>
                  <strong>{result.protocol || 'Unknown'}</strong>
                </div>
                <div className="stat-card">
                  <span>Domain</span>
                  <strong>{result.domain || 'Unknown domain'}</strong>
                </div>
              </div>

              <div className="result-section">
                <h3>Checks</h3>
                <ul>
                  {result.checks?.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>

              <div className="result-section warn-list">
                <h3>Warnings</h3>
                <ul>
                  {result.warnings?.map((item) => <li key={item}>⚠ {item}</li>)}
                </ul>
              </div>

              <div className="result-section positive-list">
                <h3>Positive indicators</h3>
                <ul>
                  {result.positiveIndicators?.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container page-section" id="features">
        <div className="section-head">
          <span className="eyebrow">Features</span>
          <h2>Built for practical threat awareness</h2>
        </div>
        <div className="feature-grid">
          {securityFeatures.map((feature, index) => (
            <div key={feature} className="feature-card">
              <div className="feature-icon">0{index + 1}</div>
              <h3>{feature}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="container page-section alt-panel">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Quick, transparent analysis</h2>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span>1</span>
            <h3>Enter a URL</h3>
            <p>Paste the suspicious or untrusted link into the scanner.</p>
          </div>
          <div className="step-card">
            <span>2</span>
            <h3>Review signals</h3>
            <p>Check protocol, suspicious patterns, and domain composition.</p>
          </div>
          <div className="step-card">
            <span>3</span>
            <h3>Make an informed decision</h3>
            <p>Use the score and warnings as risk context before clicking.</p>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-head">
          <span className="eyebrow">Common checks</span>
          <h2>Heuristic indicators we look for</h2>
        </div>
        <div className="check-grid">
          {checks.map((check) => (
            <div className="check-item" key={check}>{check}</div>
          ))}
        </div>
      </section>

      <section className="container page-section cta-strip">
        <div>
          <h2>Need a safer browsing workflow?</h2>
          <p>Register to keep a scan history and review your recent website checks.</p>
        </div>
        <Link className="primary-btn" to="/register">Create an account</Link>
      </section>
    </Layout>
  );
};

export default HomePage;
