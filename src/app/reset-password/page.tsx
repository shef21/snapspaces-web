"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] font-league-spartan flex flex-col items-center justify-center">
      <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden px-0">
        <section className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] mb-2">Reset Password</h1>
          <p className="text-lg text-[#171717]/80 mb-6 font-light">Enter your email to receive a password reset link.</p>
        </section>
        <form className="px-8 pb-8 flex flex-col gap-6" onSubmit={handleSubmit} aria-label="Reset password form">
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div aria-live="polite" className="min-h-[1.5em]">
          {success && (
            <div className="px-8 pb-8 text-center text-green-700 font-semibold">Reset link sent! Check your inbox.</div>
          )}
        </div>
        <div className="px-8 pb-8 text-center text-sm text-[#171717]/80">
          Remembered your password?{' '}
          <Link href="/signin" className="text-yellow-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">Sign in to SnapSpaces</Link>
        </div>
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