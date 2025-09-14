import React from 'react';

interface AILogoProps {
  size?: number;
  className?: string;
}

const AILogo: React.FC<AILogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main brain/core circle */}
      <circle cx="50" cy="50" r="35" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
      
      {/* Neural connections */}
      <path 
        d="M30 30 Q50 20 70 30 Q80 50 70 70 Q50 80 30 70 Q20 50 30 30" 
        stroke="#3b82f6" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Central processing unit */}
      <circle cx="50" cy="50" r="15" fill="#3b82f6" opacity="0.8"/>
      
      {/* Processing elements */}
      <circle cx="45" cy="45" r="2" fill="#ffffff"/>
      <circle cx="55" cy="45" r="2" fill="#ffffff"/>
      <circle cx="45" cy="55" r="2" fill="#ffffff"/>
      <circle cx="55" cy="55" r="2" fill="#ffffff"/>
      
      {/* Data flow lines */}
      <line x1="30" y1="30" x2="40" y2="40" stroke="#22c55e" strokeWidth="1.5"/>
      <line x1="70" y1="30" x2="60" y2="40" stroke="#f59e0b" strokeWidth="1.5"/>
      <line x1="30" y1="70" x2="40" y2="60" stroke="#8b5cf6" strokeWidth="1.5"/>
      <line x1="70" y1="70" x2="60" y2="60" stroke="#ef4444" strokeWidth="1.5"/>
      
      {/* Animated pulse effect */}
      <circle cx="50" cy="50" r="25" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
        <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

export default AILogo;