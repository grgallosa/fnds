
import React, { useState, useEffect } from 'react';
import { CONTENT } from '../constants';
import { Check, Timer, AlertCircle } from 'lucide-react';
import { Plan } from '../types';
import { fetchPlans } from '../lib/plans';

interface PlansProps {
  onApplyClick?: () => void;
}

const Plans: React.FC<PlansProps> = ({ onApplyClick }) => {
  const p = CONTENT.plans;
  // Seed with the static list so the section renders instantly, then swap
  // in the live rows from Supabase's `plans` table (same table the admin
  // app edits) once they arrive.
  const [items, setItems] = useState<Plan[]>(CONTENT.plans.items);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPlans().then((plans) => {
      if (!cancelled) setItems(plans);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-02-28T00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="plans" className="scroll-mt-20 py-12 md:py-20 relative bg-brand-light dark:bg-brand-dark overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-sm text-[8px] font-black text-brand-blue uppercase tracking-widest mb-3">
            {p.headerLabel || 'OUR INTERNET PLANS'}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{p.title}</h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm max-w-lg mx-auto font-medium leading-relaxed mb-10">
            {p.description}
          </p>

          {timeLeft && (
            <div className="max-w-md mx-auto p-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-2 text-red-500 font-black text-[11px] md:text-xs uppercase tracking-[0.15em]">
                  <AlertCircle className="w-3.5 h-3.5 fill-red-500/10" />
                  Hurry! Home Plan Promo ends in:
                </div>
                
                <div className="flex gap-3 md:gap-5 items-center">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hrs' },
                    { value: timeLeft.minutes, label: 'Mins' },
                    { value: timeLeft.seconds, label: 'Secs' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 w-full aspect-square flex items-center justify-center rounded-sm shadow-inner group-hover:border-brand-blue/30 transition-colors duration-500">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest mt-2">{item.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">
                  Offer valid until {p.deadline}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch mt-12">
          {items.map((plan: Plan, idx: number) => (
            <div 
              key={plan.id} 
              className={`relative p-6 md:p-8 flex flex-col rounded-sm border transition-all duration-500 group ${
                idx === 1 
                  ? 'bg-white dark:bg-slate-850/40 border-brand-blue/40 shadow-xl dark:shadow-2xl md:scale-105 z-20' 
                  : 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 z-10 hover:border-brand-blue/30 dark:hover:border-white/20 shadow-sm dark:shadow-none'
              }`}
            >
              {idx === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[8px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-lg shadow-brand-blue/20">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="text-brand-blue font-black text-[9px] uppercase tracking-widest mb-1.5">{plan.name}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{plan.speed}</span>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest leading-none">UP TO</span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest leading-none">MBPS</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6 pb-6 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-slate-600 dark:text-slate-500 text-[10px] font-bold">₱</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {plan.price.includes('₱') ? plan.price.split('₱')[1].split('/')[0] : plan.price}
                  </span>
                  <span className="text-slate-600 dark:text-slate-500 text-[9px] font-bold uppercase ml-1">/ mo</span>
                </div>
                {plan.originalPrice && (
                  <div className="flex items-center gap-1.5">
                     <span className="text-[11px] text-slate-600 dark:text-slate-500 line-through font-bold">
                       {plan.originalPrice}
                     </span>
                     <span className="bg-red-500 text-white text-[7px] px-1.5 py-0.5 font-black rounded-sm uppercase animate-pulse">SALE</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <div className={`mt-0.5 w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center ${idx === 1 ? 'bg-brand-blue/20 text-brand-blue' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-600'}`}>
                      <Check className="w-2.5 h-2.5 stroke-[4px]" />
                    </div>
                    <span className="leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={onApplyClick}
                className={`w-full py-4 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                idx === 1 
                  ? 'bg-brand-blue text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-brand-blue shadow-xl shadow-brand-blue/20' 
                  : 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-brand-blue hover:text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 text-center">
          <p className="text-[8px] text-slate-500 dark:text-slate-700 font-bold uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
            {p.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Plans;
