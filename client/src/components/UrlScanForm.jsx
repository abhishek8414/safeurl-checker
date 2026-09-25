import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const UrlScanForm = ({ onScanComplete, initialValue = '' }) => {
  const [url, setUrl] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error('Please enter a URL to scan.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/scan', { url: trimmedUrl });
      onScanComplete?.(response.data);
      toast.success('Scan complete.');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to scan URL.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="scan-form" onSubmit={handleSubmit}>
      <div className="input-row">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          aria-label="URL to scan"
        />
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Scanning...' : 'Scan URL'}
        </button>
      </div>
    </form>
  );
};

export default UrlScanForm;
