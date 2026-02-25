'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token and login state
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md border border-[#dee2e6]">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            ADMIN<span className="text-[#007bff]">LTE</span>
          </h1>
          <p className="text-sm text-[#6c757d] mt-2">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#6c757d] mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-[#6c757d]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-10 w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#6c757d] mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-[#6c757d]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="pl-10 w-full px-3 py-2 border border-[#dee2e6] rounded focus:outline-none focus:border-[#007bff]"
              />
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-[#dee2e6] text-[#007bff] focus:ring-[#007bff]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[#6c757d]">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#007bff] text-white rounded font-medium hover:bg-[#0056b3] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-gray-50 rounded text-sm text-[#6c757d]">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
