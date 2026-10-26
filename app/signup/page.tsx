'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { INDUSTRY_ROLES, INDUSTRY_CATEGORIES, type IndustryRole } from '@/lib/industryRoles';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<IndustryRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRoleSelect(role: IndustryRole) {
    setSelectedRole(role);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            role: selectedRole.accessTier,
            industry_role: selectedRole.id,
            city,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          username,
          role: selectedRole.accessTier,
          industry_role: selectedRole.id,
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

  // ============================================================
  // STEP 1 — ROLE SELECTION
  // ============================================================
  if (step === 1) {
    const groupedRoles = INDUSTRY_ROLES.reduce((acc, role) => {
      if (!acc[role.category]) acc[role.category] = [];
      acc[role.category].push(role);
      return acc;
    }, {} as Record<string, IndustryRole[]>);

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="text-2xl font-bold tracking-tight">GRID</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-black">
              Already have an account? <span className="font-semibold">Sign in →</span>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Join 45,000+ music pros</h1>
            <p className="text-gray-600 text-lg">One account. Every role. Free forever.</p>
          </div>

          <div className="space-y-8">
            {(Object.entries(INDUSTRY_CATEGORIES) as [string, { label: string; description: string }][]).map(([key, cat]) => {
              const roles = groupedRoles[key] || [];
              if (roles.length === 0) return null;
              return (
                <div key={key}>
                  <div className="mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-400">{cat.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className="text-left rounded-xl border-2 border-gray-200 bg-white p-3 hover:border-violet-600 hover:bg-violet-50 transition"
                      >
                        <div className="font-semibold text-sm text-gray-900">{role.label}</div>
                        <div className="text-xs text-gray-500 mt-1 leading-tight">{role.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Trusted by DJ Poxy · Basement 44 · Voice Records · Pompeii Odyssey
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // STEP 2 — DETAILS FORM
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setStep(1)} className="text-sm text-gray-600 hover:text-black">
            ← Change role
          </button>
          <Link href="/login" className="text-sm text-gray-600 hover:text-black">
            Sign in
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-block rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs font-semibold mb-3">
            {selectedRole?.label}
          </div>
          <h1 className="text-3xl font-bold mb-2">Create your {selectedRole?.label} account</h1>
          <p className="text-gray-600">Free forever · No card · Cancel anytime</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="yourname"
            />
            <p className="text-xs text-gray-500 mt-1">Your public URL: grid.music/{username || 'yourname'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
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
            className="w-full rounded-full bg-black text-white font-semibold py-3 hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>

          <p className="text-center text-xs text-gray-500">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
