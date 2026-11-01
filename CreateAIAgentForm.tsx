/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  Building2,
  FileText,
  Package,
  HelpCircle,
  Plus,
  Trash2,
  Languages,
  Mic,
  Sliders,
  PhoneForwarded,
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { AIAgentItem } from './AIAgentManagement.tsx';

export interface BusinessFAQ {
  id: string;
  question: string;
  answer: string;
}

interface CreateAIAgentFormProps {
  initialAgent?: AIAgentItem | null;
  defaultCompanyName: string;
  onSave: (agent: AIAgentItem) => void;
  onCancel: () => void;
}

const AVAILABLE_LANGUAGES = [
  'English (US)',
  'English (UK)',
  'English (Australia)',
  'Spanish (Spain & LATAM)',
  'French (France)',
  'German (Germany)',
  'Hindi (India)',
  'Arabic (Standard)',
  'Japanese (Japan)',
  'Bilingual (English / Spanish)',
  'Bilingual (English / French)',
] as const;

const AVAILABLE_VOICES = [
  { id: 'Aura', name: 'Aura · Warm Professional', gender: 'Female', tone: 'Calm, authoritative, executive' },
  { id: 'Nova', name: 'Nova · Friendly & Direct', gender: 'Female', tone: 'Helpful, clear, modern' },
  { id: 'Echo', name: 'Echo · Calm & Conversational', gender: 'Male', tone: 'Natural, grounded, empathetic' },
  { id: 'Onyx', name: 'Onyx · Deep & Authoritative', gender: 'Male', tone: 'Formal, trustworthy, firm' },
  { id: 'Shimmer', name: 'Shimmer · Energetic & Cheerful', gender: 'Female', tone: 'Upbeat, welcoming, engaging' },
] as const;

const SPEAKING_STYLES = [
  'Professional & Corporate',
  'Casual & Friendly',
  'Direct & Concise',
  'Empathetic & Supportive',
  'Sales & Persuasive',
] as const;

export const CreateAIAgentForm: React.FC<CreateAIAgentFormProps> = ({
  initialAgent,
  defaultCompanyName,
  onSave,
  onCancel,
}) => {
  const isEditing = !!initialAgent;

  // Form State
  const [companyName, setCompanyName] = useState(
    initialAgent?.companyName || defaultCompanyName || 'Acme Global Inc.'
  );
  const [agentName, setAgentName] = useState(initialAgent?.name || '');
  const [greetingMessage, setGreetingMessage] = useState(
    initialAgent?.greetingMessage ||
      `Hello, thank you for calling ${companyName || 'our office'}. How can I assist you today?`
  );
  const [businessDescription, setBusinessDescription] = useState(
    initialAgent?.description || ''
  );
  const [productsAndServices, setProductsAndServices] = useState(
    initialAgent?.productsAndServices || ''
  );

  // FAQs State
  const [faqs, setFaqs] = useState<BusinessFAQ[]>(
    initialAgent?.faqs && initialAgent.faqs.length > 0
      ? initialAgent.faqs
      : [
          {
            id: 'faq-1',
            question: 'What are your standard business operating hours?',
            answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM EST.',
          },
        ]
  );

  // Voice & Persona State
  const [language, setLanguage] = useState<string>(
    initialAgent?.language || 'English (US)'
  );
  const [voice, setVoice] = useState<string>(
    initialAgent?.voice || 'Aura · Warm Professional'
  );
  const [speakingStyle, setSpeakingStyle] = useState<string>(
    initialAgent?.speakingStyle || 'Professional & Corporate'
  );
  const [voiceSpeed, setVoiceSpeed] = useState<number>(
    initialAgent?.voiceSpeed || 1.0
  );

  // Transfer & Escalation State
  const [humanTransferNumber, setHumanTransferNumber] = useState(
    initialAgent?.humanTransferNumber || '+1 (555) 019-2834'
  );
  const [transferConditions, setTransferConditions] = useState(
    initialAgent?.transferConditions ||
      'Transfer when caller explicitly asks for a human manager, when an urgent emergency is stated, or if an issue cannot be resolved after 2 attempts.'
  );

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!agentName.trim()) {
      newErrors.agentName = 'AI Agent name is required';
    } else if (agentName.trim().length < 2) {
      newErrors.agentName = 'Agent name must be at least 2 characters';
    }

    if (!greetingMessage.trim()) {
      newErrors.greetingMessage = 'First greeting message is required';
    }

    if (!businessDescription.trim()) {
      newErrors.businessDescription = 'Business details/description is required';
    }

    if (!humanTransferNumber.trim()) {
      newErrors.humanTransferNumber = 'Human transfer number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // FAQ management
  const handleAddFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        id: `faq-${Date.now()}`,
        question: '',
        answer: '',
      },
    ]);
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSave = (status: 'Active' | 'Draft') => {
    setTouched({
      companyName: true,
      agentName: true,
      greetingMessage: true,
      businessDescription: true,
      humanTransferNumber: true,
    });

    if (status === 'Active') {
      const isValid = validate();
      if (!isValid) return;
    } else {
      // Draft requires at least agentName
      if (!agentName.trim()) {
        setErrors((prev) => ({ ...prev, agentName: 'Name is required to save draft' }));
        return;
      }
    }

    // Filter empty FAQs
    const cleanedFaqs = faqs.filter(
      (f) => f.question.trim().length > 0 || f.answer.trim().length > 0
    );

    const savedAgent: AIAgentItem = {
      id: initialAgent?.id || `agent-${Date.now().toString().slice(-4)}`,
      name: agentName.trim(),
      companyName: companyName.trim(),
      status,
      language,
      voice,
      speakingStyle,
      voiceSpeed,
      lastUpdated: 'Just now',
      description: businessDescription.trim(),
      greetingMessage: greetingMessage.trim(),
      productsAndServices: productsAndServices.trim(),
      faqs: cleanedFaqs,
      humanTransferNumber: humanTransferNumber.trim(),
      transferConditions: transferConditions.trim(),
    };

    onSave(savedAgent);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 text-slate-100">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer mb-2 focus:outline-none"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to AI Agent Management</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Bot size={28} className="text-blue-400" />
            <span>{isEditing ? 'Edit AI Agent' : 'Create AI Agent'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure identity, knowledge base, voice persona, and human escalation rules.
          </p>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave('Draft')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('Active')}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            <span>Save & Create Agent</span>
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave('Active'); }} className="space-y-6">
        {/* 1. SECTION: General Identity & Overview */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <Building2 size={18} className="text-blue-400" />
            <h2 className="text-base font-bold text-white">1. Agent Identity & Business Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Company Name <span className="text-blue-400">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => handleBlur('companyName')}
                placeholder="Acme Global Inc."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none focus:ring-2 ${
                  touched.companyName && errors.companyName
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              {touched.companyName && errors.companyName && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{errors.companyName}</span>
                </p>
              )}
            </div>

            {/* AI Agent Name */}
            <div>
              <label htmlFor="agentName" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                AI Agent Name <span className="text-blue-400">*</span>
              </label>
              <input
                id="agentName"
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                onBlur={() => handleBlur('agentName')}
                placeholder="e.g. Front Desk Concierge AI"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none focus:ring-2 ${
                  touched.agentName && errors.agentName
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              {touched.agentName && errors.agentName && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{errors.agentName}</span>
                </p>
              )}
            </div>
          </div>

          {/* First Greeting Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="greetingMessage" className="block text-xs sm:text-sm font-medium text-slate-300">
                First Greeting Message <span className="text-blue-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">What the AI says upon answering</span>
            </div>
            <textarea
              id="greetingMessage"
              rows={2}
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              onBlur={() => handleBlur('greetingMessage')}
              placeholder="e.g. Hello, thank you for calling Acme Global. How may I direct your call today?"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none resize-y focus:ring-2 ${
                touched.greetingMessage && errors.greetingMessage
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
              }`}
            />
            {touched.greetingMessage && errors.greetingMessage && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.greetingMessage}</span>
              </p>
            )}
          </div>

          {/* Business Details / Description */}
          <div>
            <label htmlFor="businessDescription" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
              Business Details / Description <span className="text-blue-400">*</span>
            </label>
            <textarea
              id="businessDescription"
              rows={3}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              onBlur={() => handleBlur('businessDescription')}
              placeholder="Describe your business operations, location, opening hours, mission, and standard procedures."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none resize-y focus:ring-2 ${
                touched.businessDescription && errors.businessDescription
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
              }`}
            />
            {touched.businessDescription && errors.businessDescription && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.businessDescription}</span>
              </p>
            )}
          </div>

          {/* Products & Services */}
          <div>
            <label htmlFor="productsAndServices" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
              Products & Services <span className="text-slate-500 text-xs font-normal">(Optional Knowledge Base)</span>
            </label>
            <textarea
              id="productsAndServices"
              rows={3}
              value={productsAndServices}
              onChange={(e) => setProductsAndServices(e.target.value)}
              placeholder="List primary products, service packages, pricing plans, or consultation offerings for caller reference."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* 2. SECTION: Business FAQs */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={18} className="text-cyan-400" />
              <h2 className="text-base font-bold text-white">2. Business FAQs</h2>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add FAQ</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Equip your agent with verified answers to common customer questions.
          </p>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    FAQ #{index + 1}
                  </span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
                      title="Remove FAQ"
                      aria-label="Remove FAQ"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                    placeholder="Question (e.g., Do you offer refunds or cancellations?)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                    placeholder="Answer (e.g., Yes, cancellations can be processed within 24 hours of booking...)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none resize-y focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SECTION: Voice & Language Settings */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <Mic size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white">3. Voice & Language Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Primary Language <span className="text-blue-400">*</span>
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaking Style */}
            <div>
              <label htmlFor="speakingStyle" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Speaking Style <span className="text-blue-400">*</span>
              </label>
              <select
                id="speakingStyle"
                value={speakingStyle}
                onChange={(e) => setSpeakingStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
              >
                {SPEAKING_STYLES.map((style) => (
                  <option key={style} value={style} className="bg-slate-900 text-white">
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Voice Selection <span className="text-blue-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_VOICES.map((v) => {
                const isSelected = voice === v.name;
                return (
                  <div
                    key={v.id}
                    onClick={() => setVoice(v.name)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{v.id}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{v.gender}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">{v.name.split('·')[1] || v.name}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block italic">{v.tone}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="voiceSpeed" className="block text-xs sm:text-sm font-medium text-slate-300">
                Voice Cadence / Speed: <span className="text-blue-400 font-mono">{voiceSpeed.toFixed(2)}x</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {voiceSpeed < 1.0 ? 'Deliberate & Slow' : voiceSpeed === 1.0 ? 'Natural Conversational' : 'Fast & Energetic'}
              </span>
            </div>
            <input
              id="voiceSpeed"
              type="range"
              min="0.75"
              max="1.50"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.75x</span>
              <span>1.0x (Normal)</span>
              <span>1.25x</span>
              <span>1.50x</span>
            </div>
          </div>
        </div>

        {/* 4. SECTION: Human Transfer & Escalation */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <PhoneForwarded size={18} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">4. Call Escalation & Transfer</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Human Transfer Number */}
            <div>
              <label htmlFor="humanTransferNumber" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Human Transfer Phone Number <span className="text-blue-400">*</span>
              </label>
              <input
                id="humanTransferNumber"
                type="tel"
                value={humanTransferNumber}
                onChange={(e) => setHumanTransferNumber(e.target.value)}
                onBlur={() => handleBlur('humanTransferNumber')}
                placeholder="+1 (555) 019-2834"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none focus:ring-2 ${
                  touched.humanTransferNumber && errors.humanTransferNumber
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              {touched.humanTransferNumber && errors.humanTransferNumber && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{errors.humanTransferNumber}</span>
                </p>
              )}
            </div>

            {/* Conditions Info */}
            <div className="text-xs text-slate-400 flex flex-col justify-center">
              <span className="font-semibold text-slate-300 mb-1">Seamless Hand-off</span>
              <p>When triggered, the AI places the caller on brief hold and rings this number directly with a live call summary.</p>
            </div>
          </div>

          {/* Call Transfer Conditions */}
          <div>
            <label htmlFor="transferConditions" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
              Call Transfer Conditions <span className="text-slate-500 text-xs font-normal">(When to transfer to a human?)</span>
            </label>
            <textarea
              id="transferConditions"
              rows={2}
              value={transferConditions}
              onChange={(e) => setTransferConditions(e.target.value)}
              placeholder="e.g. When caller requests a live representative, when discussing complex pricing over $10,000, or when sentiment is frustrated."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* 5. Bottom Action Buttons Bar */}
        <div className="pt-2 pb-8 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSave('Draft')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('Active')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all cursor-pointer min-h-[46px] flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Save & Create Agent</span>
          </button>
        </div>
      </form>
    </div>
  );
};
