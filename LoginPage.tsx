/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface LoginPageProps {
  onBackToWelcome: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateSignUp: () => void;
  onLoginSuccess?: (credentials: { email: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToWelcome,
  onNavigateForgotPassword,
  onNavigateSignUp,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  const validate = (currentEmail = email, currentPassword = password) => {
    const newErrors: { email?: string; password?: string } = {};

    if (!currentEmail.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!currentPassword) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const isValid = validate(email, password);
    if (!isValid) {
      setSubmitNotice(null);
      return;
    }

    // Ready for future authentication integration (no fake mock token or mock dashboard)
    setSubmitNotice('Credentials validated. Ready for authentication provider integration.');
    if (onLoginSuccess) {
      onLoginSuccess({ email });
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050B1A] px-4 py-10 select-none text-slate-100"
      role="main"
      aria-label="UNIQ AI Login"
    >
      {/* Background: Dark navy blue with subtle blue gradients matching Welcome Page */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        {/* Subtle top ambient shimmer */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full bg-radial from-blue-700/15 via-blue-900/10 to-transparent blur-3xl" />
        {/* Subtle central cobalt glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-radial from-blue-600/10 via-indigo-900/8 to-transparent blur-2xl" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto"
      >
        {/* Top Navigation & Return to Welcome Page */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToWelcome}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-lg"
            aria-label="Return to Welcome Page"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to Welcome</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          {/* UNIQ AI Logo & Brand Name at Top */}
          <div className="flex flex-col items-center text-center mb-6">
            <UniqLogo size={52} className="mb-3" />
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              <span>UNIQ </span>
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                AI
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Login to Your Account
            </h1>
          </div>

          {/* Validation Notice for Future Integration */}
          {submitNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <span>{submitNotice}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* 1. Email Address Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) validate(e.target.value, password);
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.email && errors.email
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.email && !!errors.email}
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                />
              </div>
              {touched.email && errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* 2. Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-slate-300 text-left"
                >
                  Password
                </label>
                {/* Forgot Password? Link */}
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) validate(email, e.target.value);
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-3.5 pr-11 py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.password && errors.password
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.password && !!errors.password}
                  aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1.5 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-h-[48px] touch-manipulation"
              >
                Login
              </button>
            </div>
          </form>

          {/* Bottom text: Don't have an account? Sign Up */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
