import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/auth/register', form);
      login(response.data.token, response.data.user);
      toast.success('Your account has been created.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container auth-shell">
        <div className="auth-card">
          <h1>Create an account</h1>
          <p>Secure your URL scan history and personal dashboard.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
            </label>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="auth-note">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
