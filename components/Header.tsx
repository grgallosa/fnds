
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { CONTENT } from '../constants';
import Logo from './Logo';

interface HeaderProps {
  onApplyClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onApplyClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = CONTENT.nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Packages', href: '#plans' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleApply = () => {
    setIsOpen(false);
    if (onApplyClick) onApplyClick();
  };

  const desktopLinkClass = `group relative text-[10px] font-bold transition-colors uppercase tracking-widest hover:text-brand-blue ${
    scrolled ? 'text-slate-600 dark:text-white/50' : 'text-white/70'
  }`;
  const mobileLinkClass = "py-3 px-4 rounded-sm border-l-2 border-transparent hover:border-brand-blue hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-bold text-slate-900 dark:text-white transition-colors";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 w-full ${
      scrolled 
        ? 'bg-brand-light/95 dark:bg-brand-dark/95 border-b border-slate-200 dark:border-white/5 py-2 shadow-xl dark:shadow-black/20 backdrop-blur-md' 
        : 'bg-transparent border-b border-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-12">
        <div 
          className="cursor-pointer" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <Logo size="md" />
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className={desktopLinkClass}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button
            onClick={handleApply}
            className={desktopLinkClass}
          >
            {t.cta}
            <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-sm ${
              scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-x-0 top-[64px] bg-brand-light dark:bg-brand-dark border-b border-slate-300 dark:border-white/10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-1">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className={mobileLinkClass}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleApply}
            className={`text-left ${mobileLinkClass}`}
          >
            {t.cta}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
