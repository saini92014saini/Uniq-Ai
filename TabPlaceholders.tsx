/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  PhoneCall,
  MessageCircle,
  Building2,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  Globe,
  MapPin,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import type { DashboardTab, BusinessProfileData } from '../../types/navigation.ts';

interface TabPlaceholderProps {
  tab: DashboardTab;
  businessName: string;
  profileData?: BusinessProfileData | null;
  onNavigateToDashboard: () => void;
}

export const TabPlaceholderView: React.FC<TabPlaceholderProps> = ({
  tab,
  businessName,
  profileData,
  onNavigateToDashboard,
}) => {
  if (tab === 'ai_agent') {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 shadow-2xl flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
            <Bot size={28} />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            Tab 2 · AI Agent
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            AI Agent Configuration
          </h2>

          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Configure your autonomous conversational AI agent for <span className="text-white font-medium">{businessName}</span>. Customize voice tone, knowledge base, operating rules, and fallback transfer settings.
          </p>

          <div className="w-full p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-3 mb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Sparkles size={14} />
              <span>Upcoming Agent Modules:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
              <li>Voice Persona Selection (ElevenLabs / Deepgram neural synthesis)</li>
              <li>Business FAQ & Document Knowledge Ingestion (RAG)</li>
              <li>Booking & Scheduling Cal.com / Google Calendar Webhooks</li>
              <li>Live Voice Call Latency & Streaming Audio Controls</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (tab === 'calls') {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 shadow-2xl flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
            <PhoneCall size={28} />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            Tab 3 · Calls
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            AI Voice Calls Logs & Analytics
          </h2>

          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Real-time call transcripts, audio recordings, customer sentiment analysis, and telecommunication SIP trunk forwarding for {businessName}.
          </p>

          <div className="w-full p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-3 mb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Phone size={14} />
              <span>Voice Pipeline Integrations:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
              <li>Twilio / Telnyx / Vonage phone number provisioning</li>
              <li>Real-time human agent takeover during active calls</li>
              <li>Full audio playback and searchable speech-to-text transcripts</li>
              <li>Automated post-call CRM logging and webhook triggers</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (tab === 'whatsapp') {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 shadow-2xl flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
            <MessageCircle size={28} />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Tab 4 · WhatsApp
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            WhatsApp Business Automation
          </h2>

          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Automated WhatsApp post-call follow-ups, appointment confirmations, digital product catalogs, and AI chatbots directly on your verified WhatsApp Business number.
          </p>

          <div className="w-full p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-3 mb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <MessageSquare size={14} />
              <span>WhatsApp Capabilities:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
              <li>Meta WhatsApp Cloud API official onboarding</li>
              <li>Instant post-call summary cards dispatched to customer</li>
              <li>Interactive button menus and payment links via WhatsApp</li>
              <li>Broadcast updates and customer satisfaction surveys</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (tab === 'profile') {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-9 shadow-2xl text-slate-100"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{businessName}</h2>
                <span className="text-xs text-slate-400">UNIQ AI Business Account</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <Tag size={13} />
                  Category
                </span>
                <span className="text-white font-medium">{profileData?.category || 'Not specified'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <Globe size={13} />
                  Website
                </span>
                <span className="text-blue-400 font-medium">
                  {profileData?.website || 'Not configured'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <MapPin size={13} />
                  Business Address
                </span>
                <span className="text-slate-200">
                  {profileData?.address || 'Physical address configured in Profile Setup'}
                </span>
              </div>

              {profileData?.description && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-xs block mb-1">Business Description</span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {profileData.description}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-blue-200 text-xs">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
              <span>
                Business Profile placeholder view connected. Changes can be edited in upcoming account settings.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};
