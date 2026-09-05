
import React from 'react';
import { Facebook, Globe } from 'lucide-react';
import { CONTENT, BRAND_CONFIG } from '../constants';
import Logo from './Logo';

const Footer: React.FC = () => {
  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Packages', href: '#plans' },
    { label: 'Location', href: '#contact' },
  ];

  return (
    <footer className="bg-brand-light dark:bg-brand-dark border-t border-slate-200 dark:border-white/5 pt-12 pb-10">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-500 leading-relaxed max-w-md mx-auto">
            Reliable fiber-fast connectivity for homes and businesses in Cuartero, Capiz.
          </p>
        </div>

        {/* Unified Links Row */}
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-8 sm:gap-16 md:gap-24 w-full border-y border-slate-200 dark:border-white/5 py-8 mb-8">
          <div className="text-center sm:text-left">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-brand-blue transition-colors block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Get Help</h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:fnds.isp@gmail.com" className="text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                fnds.isp@gmail.com
              </a>
              <a href={CONTENT.contact.facebook} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-brand-blue transition-colors">
                FNDS Facebook Page
              </a>
              <a href={`tel:${CONTENT.contact.whatsapp.replace(/\s/g, '')}`} className="text-xs font-bold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                {CONTENT.contact.whatsapp}
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <a href={CONTENT.contact.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-brand-blue transition-colors bg-slate-100 dark:bg-white/5 p-2.5 rounded-full border border-slate-200 dark:border-white/5 group" title="Visit FNDS on Facebook">
            <Facebook className="w-4 h-4 group-hover:fill-brand-blue/20" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} {BRAND_CONFIG.name} Internet Systems. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-700">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Philippines</span>
            </div>
            <div className="w-px h-3 bg-slate-200 dark:bg-white/5"></div>
            <a href="#" className="text-[9px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
