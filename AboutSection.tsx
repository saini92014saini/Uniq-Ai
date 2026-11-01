/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Info,
  Shield,
  FileText,
  Lock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
  PhoneCall,
  X,
} from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';

interface AboutSectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'version' | 'terms' | 'privacy'>('about');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setUpdateStatus(null);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('UNIQ AI Business is running the latest stable release (v2.4.0-stable).');
      onShowToast('Application is up to date.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header and Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <button
            type="button"
            onClick={onBackToOverview}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Back to Profile Overview
          </button>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2.5">
            <Info className="text-blue-400" size={22} />
            <span>About UNIQ AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Platform architecture, release version, software licenses, terms of service, and compliance policies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono self-start sm:self-auto">
          <span>v2.4.0-stable</span>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'about', label: 'About the Platform', icon: Sparkles },
          { id: 'version', label: 'App Version & Core', icon: Server },
          { id: 'terms', label: 'Terms & Conditions', icon: FileText },
          { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. About the Platform Tab */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/50 to-[#050B1A] border border-blue-500/30 p-6 sm:p-8 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center p-2">
                <UniqLogo />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">UNIQ AI</h3>
                <p className="text-xs text-blue-400">Autonomous Business Voice & Telephony Platform</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              UNIQ AI empowers businesses of all sizes to handle customer telephone inquiries 24/7 with zero hold times. Powered by cutting-edge sub-second conversational speech intelligence, our voice agents comprehend complex multi-lingual inquiries, resolve business questions, capture orders, schedule appointments, and smoothly escalate to human staff when necessary.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Zap size={16} />
                  <span className="text-xs font-bold">Sub-450ms Latency</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ultra-fast voice turnarounds mimic natural human conversational rhythm.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <PhoneCall size={16} />
                  <span className="text-xs font-bold">Universal Forwarding</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Integrates with your existing telecom carrier without changing your public number.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <Shield size={16} />
                  <span className="text-xs font-bold">Enterprise Compliance</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  End-to-end encrypted SIP trunks, PII masking, and Meta Cloud WhatsApp compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. App Version Tab */}
      {activeTab === 'version' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Server size={16} className="text-blue-400" />
                Build Details & System Dependencies
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Technical stack specification and installed engine versions.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={isCheckingUpdate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 cursor-pointer transition-colors shadow self-start sm:self-auto"
            >
              <RefreshCw size={13} className={isCheckingUpdate ? 'animate-spin' : ''} />
              <span>{isCheckingUpdate ? 'Checking for updates...' : 'Check for Updates'}</span>
            </button>
          </div>

          {updateStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{updateStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
                Web Application Frontend
              </span>
              <span className="text-white font-bold">UNIQ AI Web v2.4.0 (Build 2026.11)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                React 19 · Vite 6 · Tailwind CSS 4
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
                Conversational Voice Model
              </span>
              <span className="text-cyan-400 font-bold">Gemini 2.5 Flash Speech Engine</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                Integrated with ElevenLabs & Deepgram Nova-3
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
                SIP Telephony Bridge
              </span>
              <span className="text-white font-bold">Kamailio / FreeSWITCH SIP Core v3.8.1</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                TLS 1.3 / SRTP Voice Encryption Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
                WhatsApp Messaging Core
              </span>
              <span className="text-emerald-400 font-bold">Meta Graph API v21.0</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                Official Business Solution Partner Connector
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Terms & Conditions Tab */}
      {activeTab === 'terms' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              Terms and Conditions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Last updated: October 2026 · Standard Commercial Agreement
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-4 max-h-[500px] overflow-y-auto leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-1">1. Acceptance of Terms</h4>
              <p>
                By creating a UNIQ AI account or connecting your carrier call forwarding to our virtual telephony lines, you agree to comply with these terms, all applicable telecommunications regulations, and consumer privacy laws.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">2. Permitted Business Use</h4>
              <p>
                UNIQ AI voice telephony is provided exclusively for legitimate inbound and requested outbound business customer support and inquiry handling. Unsolicited cold-calling, robocalling, harassment, or violation of National Do Not Call (DND) registries is strictly prohibited and results in immediate service termination.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">3. Call Recording & Consent Disclosures</h4>
              <p>
                Depending on your operating jurisdiction (such as two-party consent states or countries governed by DPDP / GDPR), you are responsible for ensuring that callers are properly notified that conversations are recorded and transcribed by automated artificial intelligence.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">4. Credit Usages & Billing</h4>
              <p>
                Conversation credits are consumed incrementally based on connected voice call duration and sent WhatsApp messages. Unused monthly plan credits do not expire as long as your subscription remains active in good standing.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">5. Limitation of Liability</h4>
              <p>
                While UNIQ AI maintains 99.9% uptime architecture, we are not liable for telecom carrier outages, cellular signal drops on the caller side, or incorrect answers generated by inaccurate business knowledge provided in your FAQs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Privacy Policy Tab */}
      {activeTab === 'privacy' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Shield size={16} className="text-blue-400" />
              Privacy Policy & Data Security
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compliant with GDPR, CCPA, and India Digital Personal Data Protection (DPDP) Act.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-4 max-h-[500px] overflow-y-auto leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-1">1. Information We Collect</h4>
              <p>
                We collect your business registration details, configured agent prompts, customer call audio recordings, automated text transcripts, and caller phone numbers necessary to deliver telephony AI assistance and WhatsApp follow-ups.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">2. How Audio and Transcripts Are Processed</h4>
              <p>
                Voice audio is streamed directly to secure neural synthesis pipelines for real-time speech-to-text and text-to-speech rendering. We enforce strict enterprise isolation: your proprietary business data and customer calls are never used to train public foundation models without explicit affirmative consent.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">3. Data Retention and Deletion</h4>
              <p>
                You have full control over data retention in your Privacy Settings. You may configure automatic purging of audio files and transcripts after 30, 90, or 365 days, or export records at any time.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">4. Encryption Standards</h4>
              <p>
                All data in transit is encrypted using TLS 1.3 / SRTP. All stored call records, databases, and transcripts are encrypted at rest using AES-256 standard encryption keys.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
