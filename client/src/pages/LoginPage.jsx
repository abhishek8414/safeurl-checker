import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      login(response.data.token, response.data.user);
      toast.success('Login successful.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container auth-shell">
        <div className="auth-card">
          <h1>Login</h1>
          <p>Access your SafeURL dashboard and scan history.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-note">
            Need an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
