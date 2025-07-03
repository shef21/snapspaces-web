'use client';
import React, { useState } from 'react';

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    website: '',
    description: '',
    budget: '',
    file: null as File | null,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, file: e.target.files ? e.target.files[0] : null }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#2F2F32' }}>
      <main className="w-full max-w-lg rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center" style={{ background: '#fff' }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center" style={{ color: '#00b3a4', fontFamily: 'MonopolyBank, cursive' }}>Advertise on Folioo</h1>
        <p className="mb-8 text-center text-[#232326]">Submit your details and our team will get in touch to help you promote your business to thousands of creatives and clients.</p>
        {submitted ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2 text-[#00b3a4]">Thank you!</h2>
            <p className="text-[#232326]">Your request has been received. We'll contact you soon.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-[#232326] font-semibold mb-1">Name</label>
              <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-[#232326] font-semibold mb-1">Email</label>
              <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="you@email.com" />
            </div>
            <div>
              <label htmlFor="business" className="block text-[#232326] font-semibold mb-1">Business / Brand</label>
              <input type="text" id="business" name="business" required value={form.business} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="Your business or brand" />
            </div>
            <div>
              <label htmlFor="website" className="block text-[#232326] font-semibold mb-1">Website (optional)</label>
              <input type="url" id="website" name="website" value={form.website} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="https://" />
            </div>
            <div>
              <label htmlFor="description" className="block text-[#232326] font-semibold mb-1">Ad Description</label>
              <textarea id="description" name="description" required rows={4} value={form.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="Describe your ad and goals" />
            </div>
            <div>
              <label htmlFor="budget" className="block text-[#232326] font-semibold mb-1">Budget (ZAR)</label>
              <input type="number" id="budget" name="budget" required value={form.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" placeholder="e.g. 1000" />
            </div>
            <div>
              <label htmlFor="file" className="block text-[#232326] font-semibold mb-1">Ad Creative (image, PDF, etc.)</label>
              <input type="file" id="file" name="file" accept="image/*,application/pdf" onChange={handleFileChange} className="w-full px-4 py-2 rounded-xl border border-[#80F8EE] bg-[#F9F9F9] text-[#232326] focus:outline-none focus:ring-2 focus:ring-[#80F8EE] text-base shadow" />
            </div>
            <button type="submit" className="mt-4 w-full px-8 py-4 rounded-full font-bold shadow-lg border border-[#80F8EE] transition text-lg flex items-center justify-center bg-[#80F8EE] text-[#171717] hover:bg-[#4fd8d3]">Submit Request</button>
          </form>
        )}
      </main>
    </div>
  );
} 