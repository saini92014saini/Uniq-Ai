/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Upload,
  X,
  AlertCircle,
  Globe,
  MapPin,
  FileText,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';
import type { BusinessProfileData } from '../types/navigation.ts';

const BUSINESS_CATEGORIES = [
  'Retail',
  'Restaurant & Food',
  'Healthcare',
  'Education',
  'Real Estate',
  'Travel & Tourism',
  'Professional Services',
  'E-commerce',
  'Other',
] as const;

interface BusinessProfileSetupPageProps {
  initialBusinessName?: string;
  onSaveAndContinue: (data: BusinessProfileData) => void;
  onSkipOptional?: (data: BusinessProfileData) => void;
  onBackToSignUp?: () => void;
}

export const BusinessProfileSetupPage: React.FC<BusinessProfileSetupPageProps> = ({
  initialBusinessName = '',
  onSaveAndContinue,
  onSkipOptional,
  onBackToSignUp,
}) => {
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (
    currentCategory = category,
    currentDesc = description,
    currentAddress = address,
    currentWebsite = website
  ) => {
    const newErrors: Record<string, string> = {};

    // 1. Business Category (Required)
    if (!currentCategory) {
      newErrors.category = 'Please select a business category';
    }

    // 2. Business Description (Required)
    if (!currentDesc.trim()) {
      newErrors.description = 'Business description is required';
    } else if (currentDesc.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters describing your business';
    }

    // 3. Business Address (Required)
    if (!currentAddress.trim()) {
      newErrors.address = 'Business address is required';
    } else if (currentAddress.trim().length < 5) {
      newErrors.address = 'Please provide a complete business address';
    }

    // 4. Website (Optional - validate format only if provided)
    if (currentWebsite.trim()) {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      if (!urlPattern.test(currentWebsite.trim())) {
        newErrors.website = 'Please enter a valid website URL (e.g. https://company.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, logo: 'Please select an image file (PNG, JPG, SVG, or WEBP)' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: 'Logo file size must be under 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.logo;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      category: true,
      description: true,
      address: true,
      website: true,
    });

    const isValid = validate(category, description, address, website);
    if (!isValid) {
      setStatusNotice(null);
      return;
    }

    const profileData: BusinessProfileData = {
      category,
      description: description.trim(),
      address: address.trim(),
      website: website.trim(),
      logoUrl: logoPreview,
    };

    setStatusNotice('Profile configured. Ready for Supabase storage & table insert.');
    onSaveAndContinue(profileData);
  };

  const handleSkipOptional = () => {
    // Skip for Now only applies to optional fields (Website, Business Logo).
    // Validate required fields:
    setTouched({
      category: true,
      description: true,
      address: true,
    });

    const isValid = validate(category, description, address, '');
    if (!isValid) {
      setStatusNotice('Please complete the required fields (Category, Description, Address) before continuing.');
      return;
    }

    const profileData: BusinessProfileData = {
      category,
      description: description.trim(),
      address: address.trim(),
      website: '',
      logoUrl: null,
    };

    if (onSkipOptional) {
      onSkipOptional(profileData);
    } else {
      onSaveAndContinue(profileData);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#050B1A] px-4 py-8 sm:py-12 select-none text-slate-100"
      role="main"
      aria-label="UNIQ AI Set Up Your Business Profile"
    >
      {/* Background gradients matching UNIQ AI aesthetic */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] rounded-full bg-radial from-blue-700/15 via-blue-900/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-radial from-blue-600/10 via-indigo-900/8 to-transparent blur-2xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto"
      >
        {/* Top Navigation */}
        {onBackToSignUp && (
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToSignUp}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-lg"
              aria-label="Back to Registration"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Back to Sign Up</span>
            </button>
          </div>
        )}

        {/* Setup Card */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-9 shadow-2xl">
          {/* Brand & Heading */}
          <div className="flex flex-col items-center text-center mb-7">
            <UniqLogo size={52} className="mb-3" />
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              <span>UNIQ </span>
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                AI
              </span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Set Up Your Business Profile
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md">
              {initialBusinessName
                ? `Configure the intelligence layer for ${initialBusinessName}.`
                : 'Configure essential business details for your AI agent deployment.'}
            </p>
          </div>

          {/* Status Message */}
          {statusNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                errors.category || errors.description || errors.address
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-200'
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-200'
              }`}
            >
              {errors.category || errors.description || errors.address ? (
                <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
              )}
              <span>{statusNotice}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* 1. Business Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
              >
                Business Category <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (touched.category) validate(e.target.value, description, address, website);
                  }}
                  onBlur={() => handleBlur('category')}
                  className={`w-full appearance-none pl-3.5 pr-10 py-3 rounded-xl bg-slate-950/60 border text-white text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 cursor-pointer ${
                    touched.category && errors.category
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.category && !!errors.category}
                  aria-describedby={touched.category && errors.category ? 'category-error' : undefined}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">
                    Select your business category
                  </option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              {touched.category && errors.category && (
                <p id="category-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            {/* 2. Business Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="description"
                  className="block text-xs sm:text-sm font-medium text-slate-300 text-left"
                >
                  Business Description <span className="text-blue-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {description.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (touched.description) validate(category, e.target.value, address, website);
                  }}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe what your business does."
                  className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[90px] resize-y outline-none focus:ring-2 ${
                    touched.description && errors.description
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.description && !!errors.description}
                  aria-describedby={touched.description && errors.description ? 'description-error' : undefined}
                />
              </div>
              {touched.description && errors.description && (
                <p id="description-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* 3. Business Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
              >
                Business Address <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (touched.address) validate(category, description, e.target.value, website);
                  }}
                  onBlur={() => handleBlur('address')}
                  placeholder="Street address, suite/floor, city, state/province, postal code"
                  className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[74px] resize-y outline-none focus:ring-2 ${
                    touched.address && errors.address
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.address && !!errors.address}
                  aria-describedby={touched.address && errors.address ? 'address-error' : undefined}
                />
              </div>
              {touched.address && errors.address && (
                <p id="address-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* 4. Website (Optional) */}
            <div>
              <label
                htmlFor="website"
                className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left"
              >
                Website <span className="text-slate-500 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Globe size={16} />
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  autoComplete="url"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (touched.website) validate(category, description, address, e.target.value);
                  }}
                  onBlur={() => handleBlur('website')}
                  placeholder="https://yourbusiness.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-950/60 border text-white placeholder-slate-500 text-sm sm:text-base transition-colors min-h-[46px] outline-none focus:ring-2 ${
                    touched.website && errors.website
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                  aria-invalid={touched.website && !!errors.website}
                  aria-describedby={touched.website && errors.website ? 'website-error' : undefined}
                />
              </div>
              {touched.website && errors.website && (
                <p id="website-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.website}</span>
                </p>
              )}
            </div>

            {/* 5. Business Logo (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 text-left">
                Business Logo <span className="text-slate-500 text-xs font-normal">(Optional)</span>
              </label>

              {logoPreview ? (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1">
                      <img
                        src={logoPreview}
                        alt="Business Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-200">Logo Uploaded</p>
                      <p className="text-[11px] text-slate-400">Ready for storage</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    aria-label="Remove logo"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative cursor-pointer border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-xl p-5 text-center bg-slate-950/40 hover:bg-slate-950/60 transition-all duration-200"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      Click to upload business logo
                    </p>
                    <p className="text-[11px] text-slate-500">
                      PNG, JPG, SVG or WEBP up to 5MB
                    </p>
                  </div>
                </div>
              )}

              {errors.logo && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 text-left">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.logo}</span>
                </p>
              )}
            </div>

            {/* Buttons: Save & Continue + Skip for Now */}
            <div className="pt-3 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-h-[48px] touch-manipulation"
              >
                Save & Continue
              </button>

              <button
                type="button"
                onClick={handleSkipOptional}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                Skip for Now (only for optional information)
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
};
