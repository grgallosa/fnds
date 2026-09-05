
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Plans from './components/Plans';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ApplicationFormPage from './components/ApplicationFormPage';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'apply'>('landing');
  const [cheapestPrice, setCheapestPrice] = useState<number | null>(null);

  // Ensure scroll to top when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Fetch the cheapest plan's price for the CTA section
  useEffect(() => {
    const fetchCheapestPlan = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('price')
        .order('price', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to fetch cheapest plan:', error);
        return;
      }

      setCheapestPrice(Number(data.price));
    };

    fetchCheapestPlan();
  }, []);

  const handleApplyClick = () => {
    setView('apply');
  };

  if (view === 'apply') {
    return <ApplicationFormPage onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark selection:bg-brand-blue selection:text-white overflow-x-hidden transition-colors duration-300">
      <Header onApplyClick={handleApplyClick} />
      <main className="overflow-x-hidden">
        <Hero onApplyClick={handleApplyClick} />
        
        <Plans onApplyClick={handleApplyClick} />
        
        <Contact />

        {/* High-Contrast CTA Section */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <div className="bg-gradient-to-br from-brand-yellow to-yellow-400 rounded-sm px-6 md:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left flex-1">
               <div className="relative hidden lg:block">
                  <div className="w-56 h-56 bg-slate-900 rounded-sm overflow-hidden border-[8px] border-white/20 rotate-3 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                      alt="Join FNDS"
                      className="w-full h-full object-cover grayscale opacity-80"
                    />
                  </div>
               </div>
               
               <div className="flex-1">
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-none mb-4">
                    Get Fast Internet <br className="hidden md:block" /> in Cuartero
                 </h2>
                 <p className="text-slate-900/60 text-base md:text-lg font-bold uppercase tracking-wide">
                    Plans starting at {cheapestPrice !== null ? `₱${cheapestPrice.toLocaleString()}` : '...'} / mo
                 </p>
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 relative z-10 w-full lg:w-auto">
              <button 
                onClick={handleApplyClick}
                className="bg-slate-950 text-white px-12 py-5 rounded-sm text-sm font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
              >
                 Apply Now
              </button>
              <p className="text-[8px] font-black text-slate-950/40 uppercase tracking-[0.3em] text-center">
                Cuartero, Capiz coverage area
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
