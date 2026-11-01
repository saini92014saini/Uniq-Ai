/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  MessageCircle,
  Building2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { UniqLogo } from './UniqLogo.tsx';
import type { DashboardTab, BusinessProfileData } from '../types/navigation.ts';

interface DashboardShellProps {
  businessName?: string;
  profileData?: BusinessProfileData | null;
  onLogout: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  businessName = 'Acme Business',
  profileData,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  const navTabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai_agent', label: 'AI Agent', icon: Bot },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: Building2 },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050B1A] text-slate-100 select-none pb-20 md:pb-6">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#050B1A]" />
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-radial from-blue-700/10 via-blue-900/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#02050E] to-transparent" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#050B1A]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UniqLogo size={34} />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white">UNIQ AI</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <span className="font-semibold text-slate-200">{businessName}</span>
            {profileData?.category && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-blue-400">{profileData.category}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Reserved Shell for Tab Workflows) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-12 shadow-2xl flex flex-col items-center max-w-lg"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <ShieldCheck size={24} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            {navTabs.find((t) => t.id === activeTab)?.label}
          </h2>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {activeTab === 'dashboard' &&
              `Welcome, ${businessName}! Business Profile Setup completed successfully. Navigation shell is connected.`}
            {activeTab === 'ai_agent' &&
              'AI Agent orchestration shell is ready for future autonomous intelligence configuration.'}
            {activeTab === 'calls' &&
              'AI Voice Calls workflow container is ready for telecommunication integrations.'}
            {activeTab === 'whatsapp' &&
              'WhatsApp Business API integration tab prepared for messaging pipeline setup.'}
            {activeTab === 'profile' &&
              `Configured Profile: ${profileData?.category || 'General'} · ${profileData?.address ? profileData.address.slice(0, 30) + '...' : 'Address configured'}`}
          </p>

          <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
            Active Tab: {activeTab.toUpperCase()}
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation Structure (5 Tabs: Dashboard, AI Agent, Calls, WhatsApp, Profile) */}
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
                onClick={() => setActiveTab(tab.id)}
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
                    layoutId="activeTabIndicator"
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
