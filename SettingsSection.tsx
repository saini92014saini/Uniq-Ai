/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Bell,
  Globe,
  Monitor,
  CheckCircle2,
  Save,
  Clock,
  Volume2,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface SettingsSectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<
    'account' | 'notifications' | 'language' | 'app'
  >('account');

  // 1. Account Settings
  const [accountSettings, setAccountSettings] = useState({
    timeZone: 'Asia/Kolkata (IST, GMT+5:30)',
    dateFormat: 'DD/MM/YYYY',
    currencyDisplay: 'USD ($)',
    businessHoursStart: '09:00',
    businessHoursEnd: '19:00',
    autoSaveDrafts: true,
    compactTableMode: false,
  });

  // 2. Notification Preferences
  const [notifications, setNotifications] = useState({
    inboundCallAlerts: true,
    humanEscalationSms: true,
    whatsappDeliveryReports: true,
    lowCreditWarning: true,
    weeklyPerformanceDigest: false,
    securityLoginAlerts: true,
    soundOnIncomingCall: true,
    marketingUpdates: false,
  });

  // 3. Language Preferences
  const [languageSettings, setLanguageSettings] = useState({
    dashboardLanguage: 'English (US)',
    agentDefaultLanguage: 'English (Indian Accent)',
    transcriptLanguage: 'Auto-detect (English + Regional)',
    transcriptionConfidenceThreshold: 'High (0.85)',
  });

  // 4. App Preferences
  const [appPreferences, setAppPreferences] = useState({
    audioChimeVolume: 'Medium',
    sessionTimeout: '30 minutes of inactivity',
    realtimeRefreshRate: '30 seconds',
    telephonyHapticFeedback: true,
    enableKeyboardShortcuts: true,
    showCallQualityIndicators: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = () => {
    setHasUnsavedChanges(false);
    onShowToast('Settings and preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header and Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToOverview}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              ← Back to Profile Overview
            </button>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2.5">
            <Sliders className="text-blue-400" size={22} />
            <span>Settings & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your account configurations, notification dispatches, language fallbacks, and UI behavior.
          </p>
        </div>

        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'account', label: 'Account Settings', icon: Sliders },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
          { id: 'language', label: 'Language Preferences', icon: Globe },
          { id: 'app', label: 'App Preferences', icon: Monitor },
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

      {/* 1. Account Settings Tab */}
      {activeTab === 'account' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              Regional & Operating Hours
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure how timestamps, currency, and business operation schedules are formatted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Default Time Zone
              </label>
              <select
                value={accountSettings.timeZone}
                onChange={(e) => {
                  setAccountSettings({ ...accountSettings, timeZone: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="Asia/Kolkata (IST, GMT+5:30)">Asia/Kolkata (IST, GMT+5:30)</option>
                <option value="America/New_York (EST, GMT-5:00)">America/New_York (EST, GMT-5:00)</option>
                <option value="Europe/London (GMT+0:00)">Europe/London (GMT+0:00)</option>
                <option value="Asia/Dubai (GST, GMT+4:00)">Asia/Dubai (GST, GMT+4:00)</option>
                <option value="Asia/Singapore (SGT, GMT+8:00)">Asia/Singapore (SGT, GMT+8:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Date Display Format
              </label>
              <select
                value={accountSettings.dateFormat}
                onChange={(e) => {
                  setAccountSettings({ ...accountSettings, dateFormat: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 01/11/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/01/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="D MMM YYYY">D MMM YYYY (e.g. 1 Nov 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Primary Currency Display
              </label>
              <select
                value={accountSettings.currencyDisplay}
                onChange={(e) => {
                  setAccountSettings({ ...accountSettings, currencyDisplay: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="AED (AED)">AED (د.إ) - UAE Dirham</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Business Hours (Start)
                </label>
                <input
                  type="time"
                  value={accountSettings.businessHoursStart}
                  onChange={(e) => {
                    setAccountSettings({ ...accountSettings, businessHoursStart: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Business Hours (End)
                </label>
                <input
                  type="time"
                  value={accountSettings.businessHoursEnd}
                  onChange={(e) => {
                    setAccountSettings({ ...accountSettings, businessHoursEnd: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Automatic Draft Backup</span>
              <span className="text-[11px] text-slate-400">
                Periodically preserve in-progress AI agent prompts, FAQs, and business profile forms locally.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAccountSettings({
                  ...accountSettings,
                  autoSaveDrafts: !accountSettings.autoSaveDrafts,
                });
                setHasUnsavedChanges(true);
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                accountSettings.autoSaveDrafts ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              Save Account Settings
            </button>
          </div>
        </div>
      )}

      {/* 2. Notification Preferences Tab */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bell size={16} className="text-blue-400" />
              Notification Channels & Triggers
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control where and when you receive real-time alerts for customer calls, credit limits, and agent activity.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'inboundCallAlerts',
                title: 'Inbound Call Alerts',
                desc: 'Receive immediate notifications when new customer calls connect to your AI agent.',
                icon: Smartphone,
              },
              {
                key: 'humanEscalationSms',
                title: 'Human Transfer Escalation SMS',
                desc: 'Dispatch emergency SMS whenever caller requests a human or AI triggers escalation.',
                icon: MessageSquare,
              },
              {
                key: 'whatsappDeliveryReports',
                title: 'WhatsApp Delivery Reports',
                desc: 'Alert if an automated WhatsApp post-call summary fails delivery (e.g. invalid phone number).',
                icon: Mail,
              },
              {
                key: 'lowCreditWarning',
                title: 'Low Balance Warning (<500 Credits)',
                desc: 'Send proactive warning when available conversation credits drop below 500 units.',
                icon: Sparkles,
              },
              {
                key: 'securityLoginAlerts',
                title: 'Security & New Session Alerts',
                desc: 'Email alert whenever your account is accessed from a new browser or geographic location.',
                icon: Shield,
              },
              {
                key: 'soundOnIncomingCall',
                title: 'Sound Notification for Active Calls',
                desc: 'Play a subtle audio chime inside the web dashboard during active caller connections.',
                icon: Volume2,
              },
              {
                key: 'weeklyPerformanceDigest',
                title: 'Weekly Performance Digest',
                desc: 'Receive an automated Monday morning report detailing calls volume, resolution rate, and talk time.',
                icon: Clock,
              },
            ].map((item) => {
              const checked = notifications[item.key as keyof typeof notifications];
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">{item.title}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !checked,
                      }));
                      onShowToast(`Updated: ${item.title}`);
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
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}

      {/* 3. Language Preferences Tab */}
      {activeTab === 'language' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe size={16} className="text-blue-400" />
              Language & Regional Localization
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize dashboard language, AI speech recognition defaults, and transcript translation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Dashboard Portal Language
              </label>
              <select
                value={languageSettings.dashboardLanguage}
                onChange={(e) => {
                  setLanguageSettings({ ...languageSettings, dashboardLanguage: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Default AI Agent Voice Locale
              </label>
              <select
                value={languageSettings.agentDefaultLanguage}
                onChange={(e) => {
                  setLanguageSettings({ ...languageSettings, agentDefaultLanguage: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="English (Indian Accent)">English (Indian Accent - en-IN)</option>
                <option value="English (US Accent)">English (US Accent - en-US)</option>
                <option value="English (UK Accent)">English (UK Accent - en-GB)</option>
                <option value="Hinglish (Hindi + English)">Hinglish (Conversational Mix)</option>
                <option value="Hindi (Pure - hi-IN)">Hindi (Pure - hi-IN)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Call Transcript Language Processing
              </label>
              <select
                value={languageSettings.transcriptLanguage}
                onChange={(e) => {
                  setLanguageSettings({ ...languageSettings, transcriptLanguage: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="Auto-detect (English + Regional)">Auto-detect (English + Regional)</option>
                <option value="Force English Translation">Force English Translation</option>
                <option value="Original Spoken Verbatim">Original Spoken Verbatim</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Speech-to-Text Accuracy Filter
              </label>
              <select
                value={languageSettings.transcriptionConfidenceThreshold}
                onChange={(e) => {
                  setLanguageSettings({
                    ...languageSettings,
                    transcriptionConfidenceThreshold: e.target.value,
                  });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="High (0.85)">High Confidence (0.85 - Noise Filtered)</option>
                <option value="Balanced (0.75)">Balanced (0.75 - Recommended)</option>
                <option value="Aggressive (0.60)">Aggressive Capture (0.60 - Captures Whisper)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              Save Language Preferences
            </button>
          </div>
        </div>
      )}

      {/* 4. App Preferences Tab */}
      {activeTab === 'app' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Monitor size={16} className="text-blue-400" />
              App Interface & Session Experience
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize dashboard display density, session timeout guards, and audio chime behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Inactivity Session Timeout
              </label>
              <select
                value={appPreferences.sessionTimeout}
                onChange={(e) => {
                  setAppPreferences({ ...appPreferences, sessionTimeout: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="15 minutes of inactivity">15 minutes (High Security)</option>
                <option value="30 minutes of inactivity">30 minutes (Recommended)</option>
                <option value="1 hour of inactivity">1 hour</option>
                <option value="Never (Stay Logged In)">Never (Stay Logged In)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Dashboard Auto-Refresh Polling
              </label>
              <select
                value={appPreferences.realtimeRefreshRate}
                onChange={(e) => {
                  setAppPreferences({ ...appPreferences, realtimeRefreshRate: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="15 seconds">Fast (15 seconds)</option>
                <option value="30 seconds">Standard (30 seconds)</option>
                <option value="60 seconds">Economy (60 seconds)</option>
                <option value="Manual Only">Manual Refresh Only</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Incoming Call Audio Chime Volume
              </label>
              <select
                value={appPreferences.audioChimeVolume}
                onChange={(e) => {
                  setAppPreferences({ ...appPreferences, audioChimeVolume: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="High">High (80%)</option>
                <option value="Medium">Medium (50%)</option>
                <option value="Low">Low (20%)</option>
                <option value="Muted">Muted</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Call Quality Indicators</span>
                  <span className="text-[11px] text-slate-400">Display latency and jitter badges on live calls</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAppPreferences({
                      ...appPreferences,
                      showCallQualityIndicators: !appPreferences.showCallQualityIndicators,
                    });
                    setHasUnsavedChanges(true);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    appPreferences.showCallQualityIndicators ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              Save App Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
