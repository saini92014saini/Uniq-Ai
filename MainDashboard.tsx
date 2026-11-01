/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  MessageCircle,
  Building2,
  Bell,
  User,
  PlusCircle,
  ArrowRight,
  PhoneIncoming,
  PhoneForwarded,
  CheckCircle2,
  XCircle,
  PhoneOff,
  Send,
  CheckCheck,
  AlertTriangle,
  Coins,
  Sparkles,
  LogOut,
  ChevronRight,
  Info,
  Phone,
} from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';
import { RecentCallsTable } from './dashboard/RecentCallsTable.tsx';
import { CreditsModal } from './dashboard/CreditsModal.tsx';
import { TabPlaceholderView } from './dashboard/TabPlaceholders.tsx';
import { AIAgentManagement } from './agents/AIAgentManagement.tsx';
import { CallsManagementPage } from './calls/CallsManagementPage.tsx';
import { WhatsAppManagementPage } from './whatsapp/WhatsAppManagementPage.tsx';
import { ProfilePage, type ProfileSectionTab } from './profile/ProfilePage.tsx';
import type { DashboardTab, BusinessProfileData } from '../types/navigation.ts';

interface MainDashboardProps {
  businessName?: string;
  profileData?: BusinessProfileData | null;
  onLogout: () => void;
}

export type AIAgentStatus = 'Active' | 'Inactive' | 'Not Created';

export const MainDashboard: React.FC<MainDashboardProps> = ({
  businessName = 'Acme Business',
  profileData,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [profileSubTab, setProfileSubTab] = useState<ProfileSectionTab>('overview');
  const [aiAgentStatus, setAiAgentStatus] = useState<AIAgentStatus>('Active');
  const [availableCredits, setAvailableCredits] = useState<number>(2850);
  const totalCreditLimit = 5000;
  const currentPlan = 'Business Pro';

  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navTabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai_agent', label: 'AI Agent', icon: Bot },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: Building2 },
  ];

  const sampleNotifications = [
    { id: 'notif-1', title: 'AI Agent updated', time: '12m ago', desc: 'Operating hours schedule synced.' },
    { id: 'notif-2', title: '5 Calls Handled', time: '1h ago', desc: '100% resolution on customer queries.' },
    { id: 'notif-3', title: 'Credits notification', time: '3h ago', desc: 'Balance renewed for current billing cycle.' },
  ];

  const getAgentStatusBadge = (status: AIAgentStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Inactive
          </span>
        );
      case 'Not Created':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Not Created
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050B1A] text-slate-100 select-none pb-24 md:pb-12">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full bg-radial from-blue-700/12 via-blue-900/6 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-indigo-900/8 via-blue-900/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      {/* 1. SECTION: Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#050B1A]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* UNIQ AI Logo & Brand Name */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <UniqLogo size={34} />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white">UNIQ AI</span>
            <span className="text-[11px] text-blue-400 font-medium px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 hidden sm:inline">
              SaaS Platform
            </span>
          </div>
        </div>

        {/* Business Name, Notification Icon & Profile Shortcut */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Business Name Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <span className="font-semibold text-white max-w-[120px] sm:max-w-[200px] truncate">
              {businessName}
            </span>
            {profileData?.category && (
              <>
                <span className="text-slate-600 hidden sm:inline">·</span>
                <span className="text-blue-400 text-[11px] hidden sm:inline">
                  {profileData.category}
                </span>
              </>
            )}
          </div>

          {/* Notification Icon */}
          {/* Notification Icon (Opens Notifications section) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setProfileSubTab('notifications');
              setShowNotifications(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="View notifications"
            title="Open Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#050B1A]" />
          </button>

          {/* Profile Shortcut (Opens Profile Home) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setProfileSubTab('overview');
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Profile shortcut"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User size={14} />
            </div>
            <span className="hidden md:inline">Profile</span>
          </button>

          {/* Logout Option */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Logout"
            title="Return to Welcome"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container View Switcher */}
      {activeTab === 'ai_agent' ? (
        <AIAgentManagement
          businessName={businessName}
          onNavigateToDashboard={() => setActiveTab('dashboard')}
        />
      ) : activeTab === 'calls' ? (
        <CallsManagementPage
          businessName={businessName}
        />
      ) : activeTab === 'whatsapp' ? (
        <WhatsAppManagementPage
          businessName={businessName}
        />
      ) : activeTab === 'profile' ? (
        <ProfilePage
          businessName={businessName}
          initialProfileData={profileData}
          initialSubTab={profileSubTab}
          onLogout={onLogout}
          onNavigateToDashboard={() => setActiveTab('dashboard')}
        />
      ) : activeTab !== 'dashboard' ? (
        <TabPlaceholderView
          tab={activeTab}
          businessName={businessName}
          profileData={profileData}
          onNavigateToDashboard={() => setActiveTab('dashboard')}
        />
      ) : (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Functional Template Banner */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200">
            <div className="flex items-center gap-2.5">
              <Info size={16} className="text-blue-400 shrink-0" />
              <span>
                <strong>Functional Template Active:</strong> Core dashboard structure, calling statistics, WhatsApp metrics, and navigation connections are initialized.
              </span>
            </div>
          </div>

          {/* 2. SECTION: AI Agent Overview */}
          <section
            aria-label="AI Agent Overview"
            className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Bot size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-white">AI Voice & Inbound Agent</h2>
                    {getAgentStatusBadge(aiAgentStatus)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Autonomous business phone assistant responding to customer inquiries and booking meetings.
                  </p>
                </div>
              </div>

              {/* Action Buttons & Status Toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Status Toggle (To test Active / Inactive / Not Created) */}
                <select
                  value={aiAgentStatus}
                  onChange={(e) => setAiAgentStatus(e.target.value as AIAgentStatus)}
                  className="px-2.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer hover:border-slate-700"
                  aria-label="Change AI Agent Status"
                >
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                  <option value="Not Created">Status: Not Created</option>
                </select>

                {/* Create AI Agent shortcut */}
                <button
                  type="button"
                  onClick={() => setActiveTab('ai_agent')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer min-h-[38px]"
                >
                  <PlusCircle size={14} />
                  <span>Create AI Agent</span>
                </button>

                {/* View Agent button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('ai_agent')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer min-h-[38px]"
                >
                  <span>View Agent</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* 3. SECTION: Calling Statistics */}
          <section aria-label="Calling Statistics">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PhoneCall size={16} className="text-blue-400" />
                <span>Calling Statistics</span>
              </h3>
              <span className="text-[11px] text-slate-400">Past 30 Days</span>
            </div>

            {/* 5 Separate Statistic Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* Card 1: Total Incoming Calls */}
              <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Total Incoming</span>
                  <PhoneIncoming size={16} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    1,482
                  </span>
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium">+14.2% from last month</p>
                </div>
              </div>

              {/* Card 2: AI Answered Calls */}
              <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">AI Answered</span>
                  <Bot size={16} className="text-cyan-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    1,365
                  </span>
                  <p className="text-[11px] text-cyan-400 mt-1 font-medium">92.1% pick-up rate</p>
                </div>
              </div>

              {/* Card 3: Successfully Handled Calls */}
              <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Successfully Handled</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    1,248
                  </span>
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium">91.4% resolution</p>
                </div>
              </div>

              {/* Card 4: Human Transfer Calls */}
              <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Human Transfers</span>
                  <PhoneForwarded size={16} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    94
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">6.9% routed to staff</p>
                </div>
              </div>

              {/* Card 5: Failed Calls */}
              <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Failed Calls</span>
                  <PhoneOff size={16} className="text-rose-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    23
                  </span>
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">1.6% dropped/silent</p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid: 4. WhatsApp Overview & 5. Credits Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4. SECTION: WhatsApp Overview */}
            <section
              aria-label="WhatsApp Overview"
              className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle size={16} className="text-emerald-400" />
                    <span>WhatsApp Overview</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('whatsapp')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>Open Hub</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Total Follow-up Messages */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Total Follow-ups
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                      924
                    </span>
                  </div>

                  {/* Delivered Messages */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-[11px] text-emerald-400 block mb-1 flex items-center justify-center gap-1">
                      <CheckCheck size={12} />
                      Delivered
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                      898
                    </span>
                  </div>

                  {/* Failed Messages */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-[11px] text-rose-400 block mb-1 flex items-center justify-center gap-1">
                      <AlertTriangle size={12} />
                      Failed
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                      26
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Delivery Success Rate:</span>
                <span className="font-semibold text-emerald-400 font-mono">97.2%</span>
              </div>
            </section>

            {/* 5. SECTION: Credits Overview */}
            <section
              aria-label="Credits Overview"
              className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Coins size={16} className="text-amber-400" />
                    <span>Credits Overview</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Plan: {currentPlan}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-xs text-slate-400 block">Available Credits</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                        {availableCredits.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      of {totalCreditLimit.toLocaleString()} monthly
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${(availableCredits / totalCreditLimit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Buy Credits Shortcut */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-400">
                  Approx. ~142 call minutes remaining
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreditsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_16px_rgba(37,99,235,0.3)] transition-all cursor-pointer min-h-[38px]"
                >
                  <Sparkles size={13} />
                  <span>Buy Credits</span>
                </button>
              </div>
            </section>
          </div>

          {/* 6. SECTION: Recent Calls */}
          <section
            aria-label="Recent Calls"
            className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Phone size={16} className="text-blue-400" />
                  <span>Recent Calls</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest customer voice sessions processed by your AI agent.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Sample Placeholder Data
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('calls')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>All Calls</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* List / Table */}
            <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/40">
              <RecentCallsTable />
            </div>
          </section>
        </main>
      )}

      {/* Credits Purchase Modal */}
      <CreditsModal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        currentCredits={availableCredits}
      />

      {/* Bottom Navigation Bar (5 tabs: Dashboard, AI Agent, Calls, WhatsApp, Profile) */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-[#060D20]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 sm:px-6 py-2"
        role="navigation"
        aria-label="Main application bottom navigation"
      >
        <div className="max-w-xl mx-auto flex items-center justify-around">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'profile') {
                    setProfileSubTab('overview');
                  }
                  setShowNotifications(false);
                }}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-xl transition-all cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mainDashboardActiveTab"
                    className="absolute inset-0 bg-blue-500/10 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                <span className="text-[11px] sm:text-xs mt-1 tracking-tight truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
