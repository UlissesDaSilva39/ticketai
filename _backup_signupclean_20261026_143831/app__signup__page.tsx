'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type SignupRole = 'fan' | 'artist' | 'promoter' | 'venue';

const ROLE_OPTIONS: { value: SignupRole; label: string; description: string; icon: string }[] = [
  { value: 'fan',      label: 'Fan',      description: 'Follow artists, buy tickets, discover new music', icon: '🎧' },
  { value: 'artist',   label: 'Artist',   description: 'DJ, producer, vocalist, band, A&R, record company', icon: '🎤' },
  { value: 'promoter', label: 'Promoter', description: 'Run events, book artists, sell tickets', icon: '📅' },
  { value: 'venue',    label: 'Venue',    description: 'List your space and get discovered', icon: '🏛️' },
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<SignupRole>('fan');
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, username, role, city },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          username,
          role,
          city,
          club_tier: 'free',
        });
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold tracking-tight block mb-6">GRID</Link>
        <h1 className="text-3xl font-bold mb-2">Create account</h1>
        <p className="text-gray-600 mb-6">Join the network for live music.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="yourname"
            />
            <p className="text-xs text-gray-500 mt-1">Letters, numbers, dot, dash, underscore</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((r) => {
                const selected = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={
                      'text-left rounded-xl border-2 p-4 transition ' +
                      (selected
                        ? 'border-violet-600 bg-violet-50 ring-2 ring-violet-100'
                        : 'border-gray-200 bg-white hover:border-gray-300')
                    }
                  >
                    <div className="text-2xl mb-2">{r.icon}</div>
                    <div className={
                      'font-semibold text-sm mb-1 ' +
                      (selected ? 'text-violet-700' : 'text-gray-900')
                    }>
                      {r.label}
                    </div>
                    <div className={
                      'text-xs leading-tight ' +
                      (selected ? 'text-violet-600' : 'text-gray-500')
                    }>
                      {r.description}
                    </div>
                    {selected && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-violet-600">
                        <span>✓</span> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="London"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold py-3 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-violet-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
