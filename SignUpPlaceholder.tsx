/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface SignUpPlaceholderProps {
  onBackToLogin: () => void;
  onBackToWelcome: () => void;
}

export const SignUpPlaceholder: React.FC<SignUpPlaceholderProps> = ({
  onBackToLogin,
  onBackToWelcome,
}) => {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050B1A] px-4 py-10 select-none text-slate-100"
      role="main"
      aria-label="UNIQ AI Sign Up Placeholder"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-radial from-blue-700/15 via-blue-900/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto"
      >
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLogin}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 focus:outline-none"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Login</span>
          </button>

          <button
            type="button"
            onClick={onBackToWelcome}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Welcome Page
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-center">
          <div className="flex flex-col items-center mb-6">
            <UniqLogo size={48} className="mb-3" />
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <UserPlus size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create Your Account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Sign Up module placeholder. Navigation connections are fully wired and prepared for Page 3 (Sign Up).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer min-h-[44px]"
            >
              Return to Login
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
