
import React from 'react';
import { MapPin, Phone, Facebook, Clock } from 'lucide-react';
import { CONTENT } from '../constants';

const Contact: React.FC = () => {
  const c = CONTENT.contact;

  const contactItems = [
    {
      icon: <MapPin className="w-4 h-4" />,
      label: 'Visit Us',
      value: c.address,
      link: null
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: 'Hotline',
      value: c.whatsapp,
      link: `tel:${c.whatsapp.replace(/\s/g, '')}`
    },
    {
      icon: <Facebook className="w-4 h-4" />,
      label: 'Facebook',
      value: c.facebookHandle,
      link: c.facebook
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Service Hours',
      value: 'Mon-Sat, 8AM-5PM',
      link: null
    }
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-12 md:py-16 bg-brand-light dark:bg-brand-dark border-t border-slate-200 dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          <div className="lg:w-1/3 pt-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-sm text-[8px] font-black uppercase tracking-widest mb-3">
              Connect
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
              Get Online Today.
            </h2>
            <p className="text-slate-600 dark:text-slate-500 font-medium text-xs leading-relaxed max-w-sm">
              Reach out to our team in Cuartero for fast service or technical support.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-white/5 rounded-sm overflow-hidden border border-slate-200 dark:border-white/5">
            {contactItems.map((item, idx) => {
              const cardContent = (
                <div className="bg-white dark:bg-slate-900/40 p-5 md:p-6 flex flex-col h-full hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors group">
                  <div className="text-brand-blue mb-2.5 group-hover:scale-110 transition-transform origin-left">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[8px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                      {item.label}
                    </h4>
                    <p className="text-slate-900 dark:text-white font-bold text-sm leading-snug">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              return item.link ? (
                <a key={idx} href={item.link} target={item.link.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="block h-full">
                  {cardContent}
                </a>
              ) : (
                <div key={idx} className="h-full">{cardContent}</div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
