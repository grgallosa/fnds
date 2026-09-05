
import React from 'react';
import { BRAND_CONFIG } from '../constants';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const heightMap = {
    sm: "h-6",
    md: "h-9",
    lg: "h-14"
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img 
        src={BRAND_CONFIG.logo} 
        alt={`${BRAND_CONFIG.name} ${BRAND_CONFIG.suffix}`}
        className={`${heightMap[size]} w-auto object-contain block`}
        loading="eager"
      />
    </div>
  );
};

export default Logo;
