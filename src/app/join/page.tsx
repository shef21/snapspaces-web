"use client";
import { useState } from "react";
import Link from "next/link";
import { signUp } from '../../utils/auth';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setShowVerify(true);
      setTimeout(() => {
        router.push('/profile/edit');
      }, 4000);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center justify-center">
      <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0">
        {/* Hero/Intro */}
        <section className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mb-2">Join Folioo</h1>
          <p className="text-lg text-[#171717]/80 mb-6 font-light">Create your account to get started.</p>
        </section>

        {/* Sign Up Form */}
        <form className="px-8 pb-8 flex flex-col gap-6" onSubmit={handleSubmit} aria-label="Sign up form">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#171717] font-medium">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-base shadow"
              placeholder="you@email.com"
              disabled={loading}
              aria-required="true"
              aria-label="Email address"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#171717] font-medium">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-base shadow"
              placeholder="Create a password"
              disabled={loading}
              aria-required="true"
              aria-label="Password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-[#171717] font-medium">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="px-5 py-3 rounded-full border border-[#E5E3E3] bg-[#F6F5F3] text-[#171717] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-base shadow"
              placeholder="Re-enter your password"
              disabled={loading}
              aria-required="true"
              aria-label="Confirm password"
            />
          </div>
          <div aria-live="polite" className="min-h-[1.5em]">
            {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#171717] font-semibold shadow border border-yellow-300 transition text-lg mt-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <span className="loader mr-2"></span> : null}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div aria-live="polite" className="min-h-[1.5em]">
          {success && (
            <div className="px-8 pb-8 text-center text-green-700 font-semibold">Account created! Redirecting...</div>
          )}
        </div>
        {/* Sign In Link */}
        <div className="px-8 pb-8 text-center text-sm text-[#171717]/80">
          Already have an account?{' '}
          <Link href="/signin" className="text-yellow-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">Sign in to Folioo</Link>
        </div>
        {showVerify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#171717] mb-2">Verify Your Email</h2>
              <p className="text-[#171717]/80 mb-4 text-center">Please check your email inbox for a verification link before continuing. If you don't see it, check your spam or promotions folder.</p>
              <button
                className="px-6 py-3 rounded-full bg-yellow-300 hover:bg-yellow-400 text-[#171717] font-semibold shadow border border-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={() => signUp(email, password)}
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        )}
      </main>
      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #facc15;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 