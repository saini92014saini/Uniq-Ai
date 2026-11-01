/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  Laptop,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  History,
  FileCheck,
  Check,
  X,
} from 'lucide-react';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityEvent {
  id: string;
  event: string;
  timestamp: string;
  device: string;
  ip: string;
  status: 'success' | 'warning';
}

interface PrivacySecuritySectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

export const PrivacySecuritySection: React.FC<PrivacySecuritySectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'password' | 'privacy' | 'sessions'>(
    'security'
  );

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Privacy toggles
  const [privacySettings, setPrivacySettings] = useState({
    callAudioRetentionDays: '90',
    maskCustomerPiiInTranscripts: true,
    aiModelTrainingOptOut: true,
    allowAnonymizedTelemetry: false,
    requireCallerAudioConsent: true,
    autoPurgeTranscriptsOnClosure: false,
  });

  // Active sessions demo state
  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-current',
      device: 'MacBook Pro 16" (macOS Sequoia)',
      browser: 'Google Chrome 130.0',
      location: 'Bangalore, India (Demo)',
      ip: '103.21.***.45',
      lastActive: 'Active Now',
      isCurrent: true,
    },
    {
      id: 'sess-mobile-1',
      device: 'iPhone 15 Pro (iOS 18.1)',
      browser: 'Mobile Safari',
      location: 'Bangalore, India (Demo)',
      ip: '103.21.***.88',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: 'sess-desktop-2',
      device: 'Dell XPS 15 (Windows 11)',
      browser: 'Microsoft Edge 129.0',
      location: 'Mumbai, India (Demo)',
      ip: '115.99.***.12',
      lastActive: 'Yesterday at 04:15 PM',
      isCurrent: false,
    },
  ]);

  // Security events audit trail
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec-ev-1',
      event: 'Successful Dashboard Login',
      timestamp: 'Today · 09:30 AM',
      device: 'Chrome on macOS',
      ip: '103.21.***.45',
      status: 'success',
    },
    {
      id: 'sec-ev-2',
      event: 'AI Agent SIP Credentials Accessed',
      timestamp: 'Yesterday · 03:12 PM',
      device: 'Chrome on macOS',
      ip: '103.21.***.45',
      status: 'success',
    },
    {
      id: 'sec-ev-3',
      event: 'New Device Session Authenticated',
      timestamp: 'Oct 30, 2026 · 11:20 AM',
      device: 'Mobile Safari on iOS',
      ip: '103.21.***.88',
      status: 'success',
    },
    {
      id: 'sec-ev-4',
      event: 'Password Verification Checked',
      timestamp: 'Oct 28, 2026 · 06:45 PM',
      device: 'Edge on Windows',
      ip: '115.99.***.12',
      status: 'success',
    },
  ]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your existing password.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSuccess('Password updated successfully! (Demo simulation)');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onShowToast('Account password updated successfully (Demo)!');
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    onShowToast('Session revoked. Connected device logged out.');
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    onShowToast('All other active device sessions have been terminated.');
  };

  const handleSavePrivacy = () => {
    onShowToast('Privacy & data retention configurations saved.');
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
            <Shield className="text-blue-400" size={22} />
            <span>Privacy & Security</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage account credentials, two-factor authentication, active login sessions, and data privacy policies.
          </p>
        </div>

        {/* Security Score Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
          <CheckCircle2 size={16} />
          <span>Security Score: 94% (Strong)</span>
        </div>
      </div>

      {/* Sub navigation pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'security', label: 'Security Information', icon: Shield },
          { id: 'password', label: 'Change Password', icon: KeyRound },
          { id: 'privacy', label: 'Privacy Settings', icon: Lock },
          { id: 'sessions', label: `Active Sessions (${sessions.length})`, icon: Laptop },
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

      {/* TAB 1: Security Information & 2FA */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 2FA Status Card */}
            <div className="md:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Protect your business telephony trunk and sensitive customer recordings by requiring a 6-digit TOTP verification code on login.
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 border ${
                    twoFactorEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {twoFactorEnabled ? '2FA Active' : 'Not Enabled'}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {twoFactorEnabled ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(false);
                      onShowToast('2FA has been disabled (demo).');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 cursor-pointer transition-colors"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIs2FAModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <Shield size={14} />
                    <span>Setup Authenticator App</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-500">
                  Supports Google Authenticator, Authy, and 1Password.
                </span>
              </div>
            </div>

            {/* Quick Security Checklist */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 backdrop-blur-md space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                Security Checklist
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Verified Business Email</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>SIP TLS Encryption Enforced</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Automated Anomaly Shield On</span>
                </li>
                <li className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Password Last Changed: 45 days ago</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Audit Trail */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History size={16} className="text-blue-400" />
                Recent Security & Access Events
              </h3>
              <span className="text-[11px] text-slate-500">Automated Audit Log</span>
            </div>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/40">
              {securityEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-white">{ev.event}</span>
                    <span className="text-[11px] text-slate-500">via {ev.device}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span>IP: {ev.ip}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Change Password */}
      {activeTab === 'password' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <KeyRound size={16} className="text-blue-400" />
              Change Account Password
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ensure your new password contains at least 8 characters, numbers, and symbols.
            </p>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Current Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                New Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Use a strong combination of uppercase letters, numbers, and symbols.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Confirm New Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Update Password (Demo)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Lock size={16} className="text-blue-400" />
              Data Privacy & Retention Policies
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control caller data privacy, automated transcript PII redaction, and enterprise compliance rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Call Audio Recording Retention Period
              </label>
              <select
                value={privacySettings.callAudioRetentionDays}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    callAudioRetentionDays: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="30">30 Days (Minimal Storage)</option>
                <option value="90">90 Days (Standard Recommended)</option>
                <option value="180">180 Days (Half Year)</option>
                <option value="365">1 Year (Compliance Standard)</option>
                <option value="indefinite">Indefinite (Until Manually Deleted)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: 'maskCustomerPiiInTranscripts',
                title: 'PII Redaction in Transcripts',
                desc: 'Automatically mask credit card numbers, tax IDs, and confidential figures with asterisks in all transcripts.',
              },
              {
                key: 'aiModelTrainingOptOut',
                title: 'AI Model Training Opt-Out',
                desc: 'Strictly prohibit your business customer voice audio and prompts from being used for public foundation model retraining.',
              },
              {
                key: 'requireCallerAudioConsent',
                title: 'Automated Consent Announcement',
                desc: 'Mandate the AI agent greeting explicitly notify callers that the conversation is recorded for quality.',
              },
              {
                key: 'autoPurgeTranscriptsOnClosure',
                title: 'Auto-Purge Call Transcripts upon Ticket Closure',
                desc: 'Erase raw conversational text once associated customer CRM ticket is marked as completed.',
              },
            ].map((item) => {
              const checked = privacySettings[item.key as keyof typeof privacySettings] as boolean;
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">{item.title}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPrivacySettings((prev) => ({
                        ...prev,
                        [item.key]: !checked,
                      }));
                      onShowToast(`Privacy setting toggled: ${item.title}`);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      checked ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSavePrivacy}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              Save Privacy Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Laptop size={16} className="text-blue-400" />
                Active Device Sessions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                These devices are currently authenticated and logged into your UNIQ AI business portal.
              </p>
            </div>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleRevokeAllOtherSessions}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 cursor-pointer transition-colors self-start sm:self-auto"
              >
                Log Out All Other Devices
              </button>
            )}
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  sess.isCurrent
                    ? 'bg-blue-950/20 border-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      sess.isCurrent
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {sess.device.includes('iPhone') || sess.device.includes('Mobile') ? (
                      <Smartphone size={18} />
                    ) : (
                      <Laptop size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sess.device}</span>
                      {sess.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-1">
                      <span>{sess.browser}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Globe size={11} /> {sess.location}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{sess.ip}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Status: {sess.lastActive}
                    </span>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(sess.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Trash2 size={13} />
                    <span>Revoke Session</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2FA Demo Setup Modal */}
      <AnimatePresence>
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Setup Two-Factor Authenticator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Scan the demo QR code with Google Authenticator or enter the secret key manually:
              </p>

              {/* Demo QR box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
                <div className="w-32 h-32 rounded-lg bg-white p-2 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-[10px] text-center text-slate-400 font-mono p-1">
                    [DEMO QR CODE: UNIQ-AI-SECURE-2FA]
                  </div>
                </div>
                <span className="text-[11px] font-mono text-blue-400">
                  Secret: UNIQ-9042-AUTH-DEMO
                </span>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1">
                  Enter 6-Digit Code to Confirm:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-center font-mono text-base tracking-widest outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(true);
                    setIs2FAModalOpen(false);
                    setTwoFactorCode('');
                    onShowToast('Two-Factor Authentication activated successfully (demo)!');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  Verify & Activate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
