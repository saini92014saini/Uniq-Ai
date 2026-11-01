/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface NextPagePlaceholderProps {
  onBack: () => void;
  onNavigateLogin?: () => void;
  onNavigateSignUp?: () => void;
}

export const NextPagePlaceholder: React.FC<NextPagePlaceholderProps> = ({
  onBack,
  onNavigateLogin,
  onNavigateSignUp,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050B1A] px-4 py-8 text-slate-100">
      {/* Background with dark navy and subtle gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-radial from-blue-700/10 via-blue-900/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto flex flex-col items-center text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-sm"
      >
        {/* Top mini branding */}
        <div className="flex items-center gap-3 mb-6">
          <UniqLogo size={36} />
          <span className="text-xl font-bold tracking-tight text-white">UNIQ AI</span>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
          <ShieldCheck size={20} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Get Started
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Authentication module placeholder. Navigation structure is prepared for future Login and Sign Up pages.
        </p>

        {/* Future navigation hooks */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors cursor-pointer min-h-[44px]"
          >
            <LogIn size={16} />
            <span>Continue to Sign In</span>
          </button>

          <button
            type="button"
            onClick={onNavigateSignUp}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 transition-colors cursor-pointer min-h-[44px]"
          >
            <UserPlus size={16} />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Back to Welcome Page */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer pt-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Welcome Page</span>
        </button>
      </motion.div>
    </div>
  );
};
