import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode]           = useState('login');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  function switchMode(next) {
    setMode(next);
    setError(null);
    setName('');
    setPassword('');

  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password) return setError('Email and password are required');
    if (mode === 'register' && !name) return setError('Please enter your full name');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        const res = await api.post('/auth/register', { name, email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      const status = err.response?.status;
      if (mode === 'login') {
        setError(status === 401 ? 'Invalid email or password' : 'Something went wrong. Please try again.');
      } else {
        setError(status === 400 ? 'This email is already registered' : 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/30 focus:border-primary focus:outline-none font-body text-on-surface placeholder:text-slate-400 transition-colors text-base';

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest rounded-3xl shadow-xl w-full max-w-md p-10">

        {/* Brand */}
        <p className="font-manrope text-xl font-bold tracking-tight text-cyan-950 text-center mb-8">
          The Scholarly Editorial
        </p>

        {/* Mode toggle */}
        <div className="bg-surface-container-high rounded-full p-1 flex mb-8">
          {[
            { label: 'Sign In',        value: 'login' },
            { label: 'Create Account', value: 'register' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => switchMode(tab.value)}
              className={`flex-1 py-2 rounded-full font-manrope text-sm font-bold transition-all ${
                mode === tab.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Elena Jovic"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          )}

          <input
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          <input
            type="password"
            placeholder="········"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />

          {/* Error */}
          {error && (
            <div className="bg-error-container text-on-error-container text-sm font-manrope px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-manrope font-bold rounded-full shadow-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please wait...
              </>
            ) : mode === 'login' ? (
              'Sign In to the Editorial'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Mode hint */}
        <p className="text-center font-body text-sm text-on-surface-variant mt-4">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => switchMode('register')}
                className="text-primary font-bold underline underline-offset-4"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-primary font-bold underline underline-offset-4"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Footer note */}
        <p className="text-center font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant/50 mt-8">
          Academic use only · All uploads are moderated
        </p>
      </div>
    </div>
  );
}
