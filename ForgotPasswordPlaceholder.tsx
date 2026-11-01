/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface ForgotPasswordPlaceholderProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPlaceholder: React.FC<ForgotPasswordPlaceholderProps> = ({
  onBackToLogin,
}) => {
  const [resetEmail, setResetEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050B1A] px-4 py-10 select-none text-slate-100"
      role="main"
      aria-label="UNIQ AI Forgot Password"
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
        <div className="mb-6">
          <button
            type="button"
            onClick={onBackToLogin}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 focus:outline-none"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Login</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-center">
          <div className="flex flex-col items-center mb-6">
            <UniqLogo size={48} className="mb-3" />
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <KeyRound size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Reset Your Password
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xs">
              Password reset page placeholder. Enter your email to simulate password recovery flow.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-sm space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-blue-300 font-medium">
                <CheckCircle2 size={18} />
                <span>Reset Link Dispatched (Mock)</span>
              </div>
              <p className="text-xs text-slate-400">
                Instructions have been sent to <span className="text-white font-medium">{resetEmail}</span>. Ready for mail service integration.
              </p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="mt-2 w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Return to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="reset-email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-500 text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer min-h-[44px]"
              >
                Send Password Reset Link
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
};
