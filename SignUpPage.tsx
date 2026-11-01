/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface SignUpPageProps {
  onBackToLogin: () => void;
  onBackToWelcome?: () => void;
  onSignUpSubmit?: (data: {
    businessName: string;
    fullName: string;
    email: string;
    mobileNumber: string;
  }) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onBackToLogin,
  onBackToWelcome,
  onSignUpSubmit,
}) => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  const validate = (data = formData) => {
    const newErrors: Record<string, string> = {};

    // 1. Business Name
    if (!data.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (data.businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    // 2. Full Name
    if (!data.fullName.trim()) {
      newErrors.fullName = 'Your full name is required';
    } else if (data.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    // 3. Email Address
    if (!data.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid business email address';
    }

    // 4. Mobile Number
    if (!data.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(data.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid phone number (min 7 digits)';
    }

    // 5. Password
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // 6. Confirm Password
    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // 7. Terms & Conditions
    if (!data.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms & Conditions to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(updated);

    if (touched[name]) {
      validate(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      businessName: true,
      fullName: true,
      email: true,
      mobileNumber: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    const isValid = validate(formData);
    if (!isValid) {
      setSubmitNotice(null);
      return;
    }

    // Passwords are NOT stored in localStorage.
    // Ready for future Supabase Authentication integration: supabase.auth.signUp()
    setSubmitNotice(
      'Business registration details validated. Ready for Supabase Auth integration.'
    );

    if (onSignUpSubmit) {
      onSignUpSubmit({
        businessName: formData.businessName.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
      });
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050B1A] px-4 py-8 sm:py-12 select-none text-slate-100"
      role="main"
      aria-label="UNIQ AI Create Business Account"
    >
      {/* Background gradients matching Welcome and Login pages */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        {/* Subtle top ambient shimmer */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] rounded-full bg-radial from-blue-700/15 via-blue-900/10 to-transparent blur-3xl" />
        {/* Central subtle cobalt halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-radial from-blue-600/10 via-indigo-900/8 to-transparent blur-2xl" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto"
      >
        {/* Top Navigation Row */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLogin}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-lg"
            aria-label="Return to Login"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to Login</span>
          </button>

          {onBackToWelcome && (
            <button
              type="button"
              onClick={onBackToWelcome}
              className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Welcome Page
            </button>
          )}
        </div>

        {/* Registration Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-9 shadow-2xl">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center mb-7">
            <UniqLogo size={52} className="mb-3" />
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              <span>UNIQ </span>
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                AI
              </span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create Your Business Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm">
              Empower your enterprise workflow with intelligent automation.
            </p>
          </div>

          {/* Validation Notice for Future Supabase Auth integration */}
          {submitNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <span>{submitNotice}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Row 1: Business Name & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  autoComplete="organization"
                  value={formData.businessName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('businessName')}
                  placeholder="Acme Global Inc."
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.businessName && errors.businessName
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.businessName && !!errors.businessName}
                  aria-describedby={
                    touched.businessName && errors.businessName
                      ? 'businessName-error'
                      : undefined
                  }
                />
                {touched.businessName && errors.businessName && (
                  <p
                    id="businessName-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.businessName}</span>
                  </p>
                )}
              </div>

              {/* 2. Your Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Your Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Alex Morgan"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.fullName && errors.fullName
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.fullName && !!errors.fullName}
                  aria-describedby={
                    touched.fullName && errors.fullName ? 'fullName-error' : undefined
                  }
                />
                {touched.fullName && errors.fullName && (
                  <p
                    id="fullName-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Email Address & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 3. Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="alex@acme.com"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.email && errors.email
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.email && !!errors.email}
                  aria-describedby={
                    touched.email && errors.email ? 'email-error' : undefined
                  }
                />
                {touched.email && errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* 4. Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  autoComplete="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur('mobileNumber')}
                  placeholder="+1 (555) 019-2834"
                  className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.mobileNumber && errors.mobileNumber
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.mobileNumber && !!errors.mobileNumber}
                  aria-describedby={
                    touched.mobileNumber && errors.mobileNumber
                      ? 'mobileNumber-error'
                      : undefined
                  }
                />
                {touched.mobileNumber && errors.mobileNumber && (
                  <p
                    id="mobileNumber-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 5. Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="Min 8 characters"
                    className={`w-full pl-3.5 pr-11 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                      touched.password && errors.password
                        ? 'border-rose-500/80 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                    }`}
                    aria-invalid={touched.password && !!errors.password}
                    aria-describedby={
                      touched.password && errors.password ? 'password-error' : undefined
                    }
                  />
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
                  <p
                    id="password-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* 6. Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Repeat password"
                    className={`w-full pl-3.5 pr-11 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-rose-500/80 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                    }`}
                    aria-invalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                    aria-describedby={
                      touched.confirmPassword && errors.confirmPassword
                        ? 'confirmPassword-error'
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1.5 cursor-pointer focus:outline-none"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={() => handleBlur('agreeTerms')}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950/60 text-blue-600 focus:ring-2 focus:ring-blue-500/30 cursor-pointer accent-blue-600 shrink-0"
                />
                <span className="text-xs sm:text-sm text-slate-300 text-left leading-snug">
                  I agree to the{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
              {touched.agreeTerms && errors.agreeTerms && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.agreeTerms}</span>
                </p>
              )}
            </div>

            {/* Create Account Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-h-[48px] touch-manipulation"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Bottom Section: Already have an account? Login */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
