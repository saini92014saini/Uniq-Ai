/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Phone,
  PhoneForwarded,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Info,
  PhoneIncoming,
  HelpCircle,
  Power,
  Layers,
  Save,
  Check,
} from 'lucide-react';
import type { AIAgentItem } from './AIAgentManagement.tsx';

export type TelephonyConnectionStatus =
  | 'Not Connected'
  | 'Setup Required'
  | 'Connected'
  | 'Connection Failed';

export interface PhoneNumberConfig {
  countryCode: string;
  businessPhoneNumber: string;
  humanTransferNumber: string;
  assignedAgentId: string;
  status: TelephonyConnectionStatus;
  providerForwardingNumber: string;
  lastTested?: string;
}

interface PhoneNumberSetupPageProps {
  initialAgent?: AIAgentItem | null;
  allAgents: AIAgentItem[];
  savedConfig?: PhoneNumberConfig | null;
  onSaveConfig: (config: PhoneNumberConfig) => void;
  onBack: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States & Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
] as const;

export const PhoneNumberSetupPage: React.FC<PhoneNumberSetupPageProps> = ({
  initialAgent,
  allAgents,
  savedConfig,
  onSaveConfig,
  onBack,
}) => {
  // Form State
  const [countryCode, setCountryCode] = useState(savedConfig?.countryCode || '+91');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState(
    savedConfig?.businessPhoneNumber || ''
  );
  const [humanTransferNumber, setHumanTransferNumber] = useState(
    savedConfig?.humanTransferNumber || initialAgent?.humanTransferNumber || ''
  );
  const [selectedAgentId, setSelectedAgentId] = useState(
    savedConfig?.assignedAgentId || initialAgent?.id || allAgents[0]?.id || ''
  );
  const [connectionStatus, setConnectionStatus] = useState<TelephonyConnectionStatus>(
    savedConfig?.status || (savedConfig?.businessPhoneNumber ? 'Setup Required' : 'Not Connected')
  );

  const providerForwardingNumber =
    savedConfig?.providerForwardingNumber || '+91 80 4719 2800 (Assigned Provider Line)';

  // Validation & notices
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Test incoming call modal
  const [showTestCallModal, setShowTestCallModal] = useState(false);
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);

  // Disconnect confirmation modal
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const selectedAgent = allAgents.find((a) => a.id === selectedAgentId) || initialAgent;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate phone number (digits check, 7-15 digits)
    const cleanNumber = businessPhoneNumber.replace(/[\s\-()]/g, '');
    if (!cleanNumber) {
      newErrors.businessPhoneNumber = 'Business phone number is required';
    } else if (!/^[0-9]{7,15}$/.test(cleanNumber)) {
      newErrors.businessPhoneNumber = 'Please enter a valid phone number (7 to 15 digits)';
    }

    if (humanTransferNumber.trim()) {
      const cleanTransfer = humanTransferNumber.replace(/[\s\-()+]/g, '');
      if (!/^[0-9]{7,15}$/.test(cleanTransfer)) {
        newErrors.humanTransferNumber = 'Please enter a valid human transfer number';
      }
    }

    if (!selectedAgentId) {
      newErrors.selectedAgentId = 'Please select an AI Agent to handle calls';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = (targetStatus?: TelephonyConnectionStatus) => {
    setTouched({
      businessPhoneNumber: true,
      humanTransferNumber: true,
      selectedAgentId: true,
    });

    const isValid = validate();
    if (!isValid) return;

    // Do not claim connected when only saved; default to 'Setup Required' unless explicitly tested
    const nextStatus = targetStatus || (connectionStatus === 'Connected' ? 'Connected' : 'Setup Required');
    setConnectionStatus(nextStatus);

    const config: PhoneNumberConfig = {
      countryCode,
      businessPhoneNumber: businessPhoneNumber.trim(),
      humanTransferNumber: humanTransferNumber.trim(),
      assignedAgentId: selectedAgentId,
      status: nextStatus,
      providerForwardingNumber,
      lastTested: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSaveConfig(config);
    setSaveSuccessNotice(
      `Phone settings saved for ${selectedAgent?.name || 'selected agent'}. Status: ${nextStatus}. (Note: Real telephony routing requires mobile carrier call forwarding configuration).`
    );
  };

  const handleSimulateTestCall = () => {
    setIsSimulatingCall(true);
    setShowTestCallModal(true);

    setTimeout(() => {
      setIsSimulatingCall(false);
    }, 2500);
  };

  const handleConfirmDisconnect = () => {
    setBusinessPhoneNumber('');
    setConnectionStatus('Not Connected');
    setShowDisconnectModal(false);

    const resetConfig: PhoneNumberConfig = {
      countryCode,
      businessPhoneNumber: '',
      humanTransferNumber: '',
      assignedAgentId: selectedAgentId,
      status: 'Not Connected',
      providerForwardingNumber,
    };
    onSaveConfig(resetConfig);
    setSaveSuccessNotice('Phone number has been disconnected from the AI agent.');
  };

  const getStatusBadge = (status: TelephonyConnectionStatus) => {
    switch (status) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        );
      case 'Setup Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Setup Required
          </span>
        );
      case 'Connection Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Connection Failed
          </span>
        );
      case 'Not Connected':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Not Connected
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer mb-2 focus:outline-none"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back to AI Agent Management</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Phone size={28} className="text-blue-400" />
              <span>Phone Number Setup</span>
            </h1>
            {getStatusBadge(connectionStatus)}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure business number forwarding and telephony routing for{' '}
            <span className="text-white font-medium">
              {selectedAgent?.name || 'your AI Agent'}
            </span>
            .
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSimulateTestCall}
            disabled={!businessPhoneNumber.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PhoneIncoming size={14} />
            <span>Test Incoming Call</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveSettings()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_16px_rgba(37,99,235,0.3)] transition-all cursor-pointer min-h-[38px]"
          >
            <Save size={14} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {saveSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <span>{saveSuccessNotice}</span>
        </motion.div>
      )}

      {/* Telephony Disclaimer */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Functional Telephony Template:</strong> Real telephony provider integration (Twilio / Telnyx / Exotel) will be connected in future backend steps. Saving a number records your configuration and generates forwarding instructions without initiating live telephone calls.
        </span>
      </div>

      {/* Grid: Form & Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 2. Business Phone Number Form */}
        <section
          aria-label="Business Phone Number Form"
          className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-5"
        >
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
            <Phone size={18} className="text-blue-400" />
            <h2 className="text-base font-bold text-white">2. Business Phone Number Configuration</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSettings();
            }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Country Code & Existing Business Phone Number */}
            <div>
              <label htmlFor="businessPhoneNumber" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Existing Business Phone Number <span className="text-blue-400">*</span>
              </label>
              <div className="flex gap-2.5">
                {/* Country Code Select */}
                <div className="w-36 sm:w-44 shrink-0">
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.code} ({c.country.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Input */}
                <div className="flex-1 relative">
                  <input
                    id="businessPhoneNumber"
                    type="tel"
                    value={businessPhoneNumber}
                    onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, businessPhoneNumber: true }))}
                    placeholder="e.g. 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border text-white text-sm outline-none focus:ring-2 ${
                      touched.businessPhoneNumber && errors.businessPhoneNumber
                        ? 'border-rose-500/80 focus:ring-rose-500/40'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
                    }`}
                  />
                </div>
              </div>
              {touched.businessPhoneNumber && errors.businessPhoneNumber && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{errors.businessPhoneNumber}</span>
                </p>
              )}
              <span className="text-[11px] text-slate-500 mt-1 block">
                The primary business number customers currently dial to reach you.
              </span>
            </div>

            {/* Select AI Agent */}
            <div>
              <label htmlFor="assignedAgent" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                Assign to AI Agent <span className="text-blue-400">*</span>
              </label>
              <select
                id="assignedAgent"
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                {allAgents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-slate-900 text-white">
                    {agent.name} ({agent.status}) — Voice: {agent.voice.split('·')[0]}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Inbound calls forwarded from this number will be answered by this selected AI persona.
              </span>
            </div>

            {/* Human Transfer Number (Optional / Inherited) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="humanTransferNumber" className="block text-xs sm:text-sm font-medium text-slate-300">
                  Human Transfer Number <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-slate-500">Live escalation backup</span>
              </div>
              <input
                id="humanTransferNumber"
                type="tel"
                value={humanTransferNumber}
                onChange={(e) => setHumanTransferNumber(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Inherited from AI agent settings if already configured. Caller will be routed here when transfer conditions are met.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Save Number</span>
              </button>

              {businessPhoneNumber && (
                <button
                  type="button"
                  onClick={() => setShowDisconnectModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Disconnect Number
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Right Column: 4. Connection Status & State Simulator */}
        <section
          aria-label="Connection Status"
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>4. Connection Status</span>
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Status:</span>
                <div>{getStatusBadge(connectionStatus)}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Configured Number:</span>
                  <span className="text-white font-mono font-medium">
                    {businessPhoneNumber ? `${countryCode} ${businessPhoneNumber}` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Handler:</span>
                  <span className="text-blue-400 font-medium truncate max-w-[130px]">
                    {selectedAgent?.name || 'Unassigned'}
                  </span>
                </div>
                {savedConfig?.lastTested && (
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Last Simulated Ring:</span>
                    <span className="font-mono">{savedConfig.lastTested}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Status State Switcher for Testing All 4 States */}
            <div className="space-y-1.5 mb-2">
              <span className="text-[11px] text-slate-400 block font-medium">
                Preview Telephony Statuses:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Not Connected', 'Setup Required', 'Connected', 'Connection Failed'] as TelephonyConnectionStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSaveSettings(st)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] border text-left transition-colors cursor-pointer ${
                        connectionStatus === st
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={handleSimulateTestCall}
              disabled={!businessPhoneNumber.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PhoneIncoming size={14} />
              <span>Test Incoming Call Simulation</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Test call triggers an in-app verification simulation without initiating real telephone carrier fees.
            </p>
          </div>
        </section>
      </div>

      {/* 3. SECTION: Call Forwarding Setup Guide */}
      <section
        aria-label="Call Forwarding Setup Guide"
        className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-5"
      >
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/80">
          <PhoneForwarded size={18} className="text-cyan-400" />
          <h2 className="text-base font-bold text-white">3. Call Forwarding Setup Guide</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          To have UNIQ AI answer calls made to your existing business number, you must configure call forwarding with your mobile service provider to route incoming calls to the dedicated telephony line assigned to your AI Agent.
        </p>

        {/* Dedicated Forwarding Line Placeholder */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-mono block">
              Provider Telephony Forwarding Number (Destination):
            </span>
            <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5 block">
              {providerForwardingNumber}
            </span>
          </div>
          <span className="text-xs text-slate-500 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            Dedicated SIP Routing Endpoint
          </span>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="font-semibold text-white">Verify Existing Line</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Confirm your existing business line has an active voice plan with call forwarding enabled by your carrier.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="font-semibold text-white">Open Carrier Dialer</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Open your smartphone dialer or contact your mobile network operator customer care to access forwarding settings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="font-semibold text-white">Enter Forwarding Target</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Configure unconditional or busy/unanswered forwarding to the assigned provider destination number above.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="font-semibold text-white">Test Routing</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Place a test call from an external phone to verify your AI Agent connects immediately with your first greeting.
            </p>
          </div>
        </div>

        {/* Important Carrier Note */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-3">
          <HelpCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300 block">
              Carrier Compatibility & Forwarding Codes Notice:
            </span>
            <p className="leading-relaxed">
              Forwarding shortcodes (such as MMI dialer codes) and feature availability vary strictly by mobile network operator (e.g. Jio, Airtel, Vi, AT&T, Verizon, Vodafone, etc.) and subscription tier. Always check your mobile carrier documentation or dialer settings for exact carrier-specific activation codes. Universal codes are not standardized across all global carriers.
            </p>
          </div>
        </div>
      </section>

      {/* MODAL 1: Test Incoming Call Simulation Modal */}
      {showTestCallModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
              <PhoneIncoming size={28} className={isSimulatingCall ? 'animate-bounce' : ''} />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {isSimulatingCall ? 'Simulating Inbound Call...' : 'Test Incoming Call Simulation'}
            </h3>

            <p className="text-xs text-slate-400 mb-4">
              Simulating call routing from customer to{' '}
              <span className="font-mono text-white">
                {countryCode} {businessPhoneNumber || 'Business Number'}
              </span>
            </p>

            {isSimulatingCall ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 space-y-2 text-xs">
                <div className="flex items-center justify-center gap-2 text-blue-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Ringing carrier forwarding bridge...</span>
                </div>
                <span className="text-[11px] text-slate-500">Connecting to AI Voice Handler: {selectedAgent?.name}</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 mb-6 text-left space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>[Demo Incoming Call Result: Success]</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Call successfully bridged to AI Agent <strong>&ldquo;{selectedAgent?.name}&rdquo;</strong>. In production, your mobile carrier forwards calls to this endpoint and the AI answers with:
                </p>
                <p className="italic text-slate-400 p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]">
                  &ldquo;{selectedAgent?.greetingMessage || 'Hello, thank you for calling.'}&rdquo;
                </p>
                <div className="pt-1 text-[11px] text-slate-500">
                  Note: Real telephone calls are not initiated in this functional applet template.
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowTestCallModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Close Simulation
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Disconnect Number Confirmation Modal */}
      {showDisconnectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <Power size={26} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Disconnect Business Phone Number?
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to disconnect <strong className="text-white">{countryCode} {businessPhoneNumber}</strong> from <strong className="text-white">{selectedAgent?.name}</strong>? Call forwarding will no longer route to this AI agent.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
