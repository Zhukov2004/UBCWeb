import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface UbcLogoProps {
  className?: string;
  size?: number;
  customUrl?: string | null;
}

export const UbcLogo: React.FC<UbcLogoProps> = ({ className = '', size = 46, customUrl }) => {
  const { headerLogoUrl } = useApp();
  const [imgError, setImgError] = useState(false);

  // Default logo source: custom logo if set by admin, or /logoclb.jpg
  const effectiveUrl = customUrl !== undefined ? customUrl : (headerLogoUrl || '/logoclb.jpg');

  // If image loads successfully, display the exact user image
  if (effectiveUrl && !imgError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-white shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={effectiveUrl}
          alt="UNETI Book Club Logo"
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Exact 100% faithful SVG reproduction of logoclb.jpg (Blue & White, untouched, no alterations)
  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 bg-white shadow-xs select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pure White circular background as in logoclb.jpg */}
        <circle cx="100" cy="100" r="99" fill="#ffffff" />

        {/* Curved Path for Text: "Uneti's Book Club" */}
        <defs>
          <path
            id="textPathTopExact"
            d="M 22,102 A 78,78 0 1,1 178,102"
            fill="none"
          />
        </defs>

        <text
          fill="#2f71d3"
          fontSize="23"
          fontWeight="700"
          fontFamily="'Playfair Display', serif, system-ui"
          letterSpacing="0.5"
        >
          <textPath href="#textPathTopExact" startOffset="50%" textAnchor="middle">
            Uneti's Book Club
          </textPath>
        </text>

        {/* Open Hands at Bottom holding the book - Light blue #629ef5 */}
        <g fill="#629ef5" stroke="#4a8ceb" strokeWidth="1.2">
          {/* Left Hand */}
          <path d="M 38,114 C 36,132 42,150 62,170 C 70,178 76,190 80,198 L 58,198 C 52,188 45,172 35,152 C 29,140 28,124 34,114 Z" />
          <path d="M 40,118 C 42,136 50,154 66,168" fill="none" stroke="#4a8ceb" strokeWidth="1.8" strokeLinecap="round" />

          {/* Right Hand */}
          <path d="M 162,114 C 164,132 158,150 138,170 C 130,178 124,190 120,198 L 142,198 C 148,188 155,172 165,152 C 171,140 172,124 166,114 Z" />
          <path d="M 160,118 C 158,136 150,154 134,168" fill="none" stroke="#4a8ceb" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Isometric 3D Open Book in Center - Blue #2f71d3 */}
        <g stroke="#2f71d3" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Spine & Center line */}
          <path d="M 100,68 L 100,126" strokeWidth="5" />

          {/* Top cover outline */}
          <path d="M 100,68 L 146,88 L 100,108 L 54,88 Z" fill="#ffffff" />
          
          {/* Book thickness & Pages */}
          <path d="M 54,88 L 54,106 L 100,126 L 146,106 L 146,88" />
          
          {/* Page lines */}
          <path d="M 64,93 L 96,107 L 136,93" strokeWidth="2.5" opacity="0.4" />
        </g>

        {/* Text "UBC" below the book */}
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fill="#1d4ed8"
          fontSize="22"
          fontWeight="800"
          fontFamily="'Playfair Display', serif, system-ui"
          letterSpacing="1.5"
        >
          UBC
        </text>
      </svg>
    </div>
  );
};
