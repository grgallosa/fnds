
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { CONTENT } from '../constants';
import Logo from './Logo';
import { supabase } from '../lib/supabaseClient';
import { fetchPlans } from '../lib/plans';
import { Plan } from '../types';

interface ApplicationFormPageProps {
  onBack: () => void;
}

const BARANGAYS = [
  "Agcabugao", "Agdahon", "Agnaga", "Angub", "Balingasag", 
  "Bito-on Ilawod", "Bito-on Ilaya", "Bun-od", "Carataya", 
  "Lunayan", "Mahabang Sapa", "Mahunodhunod", "Maindang", 
  "Mainit", "Malagab-i", "Nagba", "Poblacion Ilawod", 
  "Poblacion Ilaya", "Poblacion Takas", "Puti-an", 
  "San Antonio", "Sinabsaban"
];

export default function ApplicationFormPage({ onBack }: ApplicationFormPageProps) {
  const c = CONTENT.contact;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>(CONTENT.plans.items);

  useEffect(() => {
    let cancelled = false;
    fetchPlans().then((p) => {
      if (!cancelled) setPlans(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  
  const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  barangay: '',
  plan: '',
  details: '',
  website: '', // honeypot — real visitors never see this field; bots that fill every input do
});

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const brgyLabel = BARANGAYS.find((b) => b.toLowerCase() === formData.barangay) || formData.barangay;
  const planLabel = plans.find((p) => p.id === formData.plan)?.name || formData.plan;

  try {
    // Submissions go through the submit-lead Edge Function (not a direct
    // table insert) so the honeypot check and rate limiting run server-side
    // and can't be bypassed by calling the database API directly.
    const { data, error } = await supabase.functions.invoke('submit-lead', {
      body: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        address: brgyLabel ? `${brgyLabel}, Cuartero, Capiz` : null,
        interested_plan: planLabel || null,
        notes: formData.details || null,
        website: formData.website, // honeypot value
      },
    });

    if (error) throw error;
    if (!data?.ok) {
      alert(data?.message || 'Submission failed. Please try again.');
      return;
    }

    setSubmitted(true);
  } catch (err) {
    alert('Submission failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto border border-brand-blue/30">
            <CheckCircle2 className="w-8 h-8 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Request Received</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              Salamat! Our team will contact you within 48 hours to schedule a site survey.
            </p>
          </div>
          <button 
            onClick={onBack}
            className="w-full py-3.5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark pb-12">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-light/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-6 h-14 flex items-center">
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-widest">Back</span>
          </button>
          
          <Logo size="sm" />
          
          <div className="w-12 hidden md:block"></div>
        </div>
      </nav>

      <div className="pt-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">
              Apply for Service
            </h1>
            <p className="text-slate-600 dark:text-slate-500 text-xs font-medium leading-relaxed">
              Tell us where you are and we'll reach out within 48 hours to schedule a site check.
            </p>
          </div>

          <div className="bg-white dark:bg-white/[0.015] p-5 md:p-7 border border-slate-300 dark:border-white/5 rounded-sm relative shadow-lg dark:shadow-2xl">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5" onSubmit={handleSubmit}>
              {/* Honeypot field — visually hidden the same way screen-reader-only
                  content is (clipped to 1px, not display:none/visibility:hidden,
                  which some bots specifically check for and skip) and removed
                  from the tab order and accessibility tree. Real visitors never
                  see or reach it; bots that blindly fill every input do. Any
                  value here means the submission is spam. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{c.form.name}</label>
                <input 
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm placeholder:text-slate-400 dark:placeholder:text-slate-800"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{c.form.phone}</label>
                <input 
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm placeholder:text-slate-400 dark:placeholder:text-slate-800"
                  placeholder="09xx xxx xxxx"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{c.form.email}</label>
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm placeholder:text-slate-400 dark:placeholder:text-slate-800"
                  placeholder="juan@email.com"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">Barangay</label>
                <select 
                  required
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm appearance-none cursor-pointer"
                >
                  <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white" value="">Select Location</option>
                  {BARANGAYS.map((brgy) => (
                    <option key={brgy} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white" value={brgy.toLowerCase()}>
                      {brgy}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">Interested Plan</label>
                <select
                  required
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm appearance-none cursor-pointer"
                >
                  <option className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white" value="">Select Plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white" value={plan.id}>
                      {plan.name} — {plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">{c.form.details}</label>
                <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                  rows={2}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/40 transition-all rounded-sm placeholder:text-slate-400 dark:placeholder:text-slate-800 resize-none"
                  placeholder="Specific location details or questions?"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 text-white text-[9px] font-black tracking-widest uppercase
                    flex items-center justify-center gap-2 rounded-sm shadow-lg transition-all group
                    ${loading ? 'bg-brand-blue/60 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.99]'}`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      {c.form.submit}
                    </>
                  )}
                </button>
                
                <p className="mt-3 text-center text-[7px] font-bold text-slate-500 dark:text-slate-700 uppercase tracking-[0.2em]">
                  Installation is subject to site availability and technical survey.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
