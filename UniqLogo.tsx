/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface UniqLogoProps {
  className?: string;
  size?: number;
}

export const UniqLogo: React.FC<UniqLogoProps> = ({ className = '', size = 72 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="UNIQ AI Logo"
    >
      {/* Ambient Glow */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/30 via-indigo-500/25 to-cyan-400/20 blur-xl -z-10 transform scale-110"
        aria-hidden="true"
      />

      {/* Vector Logo Icon: Original AI-inspired intelligence glyph combining geometric node synergy and stylized 'Q' prism */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_24px_rgba(37,99,235,0.4)]"
      >
        <defs>
          {/* Main outer hex-ring gradient */}
          <linearGradient id="uniqGradientPrimary" x1="12" y1="14" x2="68" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Core intelligence prism gradient */}
          <linearGradient id="uniqGradientCore" x1="28" y1="26" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Accent light ray */}
          <linearGradient id="uniqGradientAccent" x1="46" y1="46" x2="68" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Outer faceted shield / intelligence frame */}
        <path
          d="M40 8L68 24V56L40 72L12 56V24L40 8Z"
          stroke="url(#uniqGradientPrimary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-95"
        />

        {/* Inner neural connection geometry */}
        <path
          d="M40 18L60 30V50L40 62L20 50V30L40 18Z"
          stroke="#60A5FA"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="2 3"
        />

        {/* Central intelligence core (The 'Q' & Quantum node) */}
        <polygon
          points="40,24 54,34 54,46 40,56 26,46 26,34"
          fill="url(#uniqGradientCore)"
          fillOpacity="0.85"
        />

        {/* Inner highlighted facet lines */}
        <line x1="40" y1="24" x2="40" y2="56" stroke="#BFDBFE" strokeWidth="1.25" strokeOpacity="0.75" />
        <line x1="26" y1="34" x2="54" y2="46" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="26" y1="46" x2="54" y2="34" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.5" />

        {/* The signature UNIQ 'Q' diagonal spark / quantum emitter */}
        <path
          d="M46 50L64 68"
          stroke="url(#uniqGradientAccent)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Bright core focal node */}
        <circle cx="40" cy="40" r="3.5" fill="#FFFFFF" className="drop-shadow-[0_0_8px_#38BDF8]" />
      </svg>
    </div>
  );
};
