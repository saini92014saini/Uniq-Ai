/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050B1A] px-4 py-8 select-none"
      role="main"
      aria-label="UNIQ AI Welcome Page"
    >
      {/* Background: Dark navy blue with subtle, elegant atmospheric blue gradients */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        {/* Deep navy radial foundation */}
        <div className="absolute inset-0 bg-[#050B1A]" />

        {/* Ambient top blue shimmer */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full bg-radial from-blue-700/15 via-blue-900/10 to-transparent blur-3xl" />

        {/* Central subtle cobalt halo concentrated behind the brand core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-radial from-blue-600/12 via-indigo-900/8 to-transparent blur-2xl" />

        {/* Subtle bottom vignette gradient */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      {/* Central Brand Container with smooth, subtle entrance animations */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4">
        {/* 1. Original AI-Inspired Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <UniqLogo size={80} className="sm:scale-110 transition-transform" />
        </motion.div>

        {/* 2. Brand Name: UNIQ AI */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
        >
          <span>UNIQ </span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            AI
          </span>
        </motion.h1>

        {/* 3. Tagline: Directly below the brand name */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl font-normal text-slate-300/90 tracking-normal max-w-lg"
          style={{ textWrap: 'balance' }}
        >
          Your Business. Smarter with AI.
        </motion.p>

        {/* 4. One Prominent Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10"
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_28px_rgba(37,99,235,0.35)] hover:shadow-[0_0_36px_rgba(59,130,246,0.55)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1A] min-h-[48px] touch-manipulation"
            aria-label="Get Started with UNIQ AI"
          >
            <span>Get Started</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>
    </main>
  );
};
