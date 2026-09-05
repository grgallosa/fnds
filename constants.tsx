
import { Plan } from './types';

/**
 * The logo.png file should be placed in the project root directory.
 * We use a string path here because native browser ESM does not support 
 * importing non-JS assets as modules without a build-time transformation.
 */
const logo = '/logo.png';

export const BRAND_CONFIG = {
  logo: logo, 
  name: 'FNDS',
  suffix: 'ISP'
};

export const CONTENT = {
  nav: {
    cta: 'Apply Now'
  },
  hero: {
    title: "Quality Internet for Homes & Businesses in Cuartero",
    subtitle: 'Affordable, fiber internet for homes and small businesses in Cuartero.',
    offers: 'Our Offers',
    contact: 'Apply Now'
  },
  contact: {
    address: 'Mainit, Cuartero, Capiz, Philippines',
    whatsapp: '+63 962 753 0624',
    facebook: 'https://facebook.com/FNDSISP',
    facebookHandle: 'fb.com/FNDSISP',
    form: {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      details: 'Additional Details (Optional)',
      submit: 'Submit'
    }
  },
  plans: {
    headerLabel: 'LIMITED TIME PROMO',
    title: 'Choose Your Internet Plan',
    description: 'Affordable, high-speed internet serving homes and small businesses around Cuartero,',
    deadline: 'February 28, 2026',
    disclaimer: 'Speed may vary based on location and network conditions. Availability is limited to selected barangays in Cuartero.',
    items: [
      {
        id: '10',
        name: 'Basic Plan',
        speed: '10',
        price: '₱799/mo',
        features: [
          'Unlimited Internet',
          'Stable fiber connection',
          'Ideal for browsing & social media'
        ],
        cta: 'Apply Now'
      },
      {
        id: '15',
        name: 'Home Plan',
        speed: '15',
        price: '₱999/mo',
        originalPrice: '₱1,299',
        features: [
          'Unlimited Internet',
          'Ultra-Stable connection',
          'Ideal for online classes & streaming'
        ],
        cta: 'Apply Now'
      },
      {
        id: '20',
        name: 'Business Plan',
        speed: '20',
        price: '₱1,199/mo',
        originalPrice: '₱1,399',
        features: [
          'Unlimited Internet',
          'Premium prioritization',
          'Ideal for small shops & offices'
        ],
        cta: 'Apply Now'
      }
    ]
  }
};
