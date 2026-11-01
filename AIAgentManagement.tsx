/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Plus,
  Play,
  Edit3,
  Eye,
  Power,
  Languages,
  Mic,
  Clock,
  Sparkles,
  Info,
  X,
  Volume2,
  Send,
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  Phone,
} from 'lucide-react';

import { CreateAIAgentForm, type BusinessFAQ } from './CreateAIAgentForm.tsx';
import { AIAgentTestingPage } from './AIAgentTestingPage.tsx';
import { PhoneNumberSetupPage, type PhoneNumberConfig } from './PhoneNumberSetupPage.tsx';

export interface AIAgentItem {
  id: string;
  name: string;
  companyName: string;
  status: 'Active' | 'Inactive' | 'Draft';
  language: string;
  voice: string;
  speakingStyle?: string;
  voiceSpeed?: number;
  lastUpdated: string;
  description: string;
  greetingMessage: string;
  productsAndServices?: string;
  faqs?: BusinessFAQ[];
  humanTransferNumber?: string;
  transferConditions?: string;
}

interface AIAgentManagementProps {
  businessName: string;
  onNavigateToDashboard?: () => void;
}

const INITIAL_SAMPLE_AGENTS: AIAgentItem[] = [
  {
    id: 'agent-01',
    name: 'Front Desk Concierge AI',
    companyName: 'Acme Global Inc.',
    status: 'Active',
    language: 'English (US)',
    voice: 'Aura · Warm Professional',
    lastUpdated: 'Nov 1, 2026 · 11:20 AM',
    description: 'Handles incoming caller inquiries, business hours, and schedules appointments automatically.',
    greetingMessage: 'Hello, thank you for calling Acme Global. How may I direct your call today?',
  },
  {
    id: 'agent-02',
    name: 'Support & Inbound Dispatcher',
    companyName: 'Acme Global Inc.',
    status: 'Inactive',
    language: 'Bilingual (English / Spanish)',
    voice: 'Nova · Friendly & Direct',
    lastUpdated: 'Oct 30, 2026 · 04:15 PM',
    description: 'Triage customer technical issues and routes high-priority tickets to on-duty specialists.',
    greetingMessage: 'Hi there! Welcome to support. Please describe the issue you are experiencing.',
  },
  {
    id: 'agent-03',
    name: 'VIP Client Outreach & Follow-up',
    companyName: 'Acme Global Inc.',
    status: 'Draft',
    language: 'English (UK)',
    voice: 'Echo · Calm & Conversational',
    lastUpdated: 'Oct 28, 2026 · 02:40 PM',
    description: 'Automated post-meeting check-in and satisfaction feedback questionnaire.',
    greetingMessage: 'Good day! I am checking in regarding your recent demo consultation with our team.',
  },
];

export const AIAgentManagement: React.FC<AIAgentManagementProps> = ({
  businessName,
  onNavigateToDashboard,
}) => {
  const [agents, setAgents] = useState<AIAgentItem[]>(
    INITIAL_SAMPLE_AGENTS.map((a) => ({ ...a, companyName: businessName || a.companyName }))
  );

  // Modals and action views
  const [viewingAgent, setViewingAgent] = useState<AIAgentItem | null>(null);
  const [testingAgent, setTestingAgent] = useState<AIAgentItem | null>(null);
  const [editingAgent, setEditingAgent] = useState<AIAgentItem | null>(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [phoneSetupAgent, setPhoneSetupAgent] = useState<AIAgentItem | null>(null);
  const [savedPhoneConfig, setSavedPhoneConfig] = useState<PhoneNumberConfig | null>(null);

  // Toggle Activate / Deactivate
  const handleToggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const nextStatus: AIAgentItem['status'] =
            agent.status === 'Active' ? 'Inactive' : 'Active';
          return {
            ...agent,
            status: nextStatus,
            lastUpdated: 'Just now (Updated)',
          };
        }
        return agent;
      })
    );
  };

  const handleOpenTest = (agent: AIAgentItem) => {
    setTestingAgent(agent);
  };

  const handleUpdateAgentStatus = (agentId: string, newStatus: AIAgentItem['status']) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: newStatus, lastUpdated: 'Just now (Updated)' }
          : a
      )
    );
    if (testingAgent && testingAgent.id === agentId) {
      setTestingAgent((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Helper to test empty state
  const handleToggleEmptyState = () => {
    if (agents.length > 0) {
      setAgents([]);
    } else {
      setAgents(INITIAL_SAMPLE_AGENTS.map((a) => ({ ...a, companyName: businessName || a.companyName })));
    }
  };

  const getStatusBadge = (status: AIAgentItem['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Inactive
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Draft
          </span>
        );
    }
  };
  const handleSaveNewAgent = (newAgent: AIAgentItem) => {
    setAgents((prev) => [newAgent, ...prev]);
    setIsCreatingAgent(false);
  };

  const handleSaveEditedAgent = (updatedAgent: AIAgentItem) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
    );
    setEditingAgent(null);
  };

  if (isCreatingAgent) {
    return (
      <CreateAIAgentForm
        defaultCompanyName={businessName}
        onSave={handleSaveNewAgent}
        onCancel={() => setIsCreatingAgent(false)}
      />
    );
  }

  if (editingAgent) {
    return (
      <CreateAIAgentForm
        initialAgent={editingAgent}
        defaultCompanyName={businessName}
        onSave={handleSaveEditedAgent}
        onCancel={() => setEditingAgent(null)}
      />
    );
  }

  if (testingAgent) {
    return (
      <AIAgentTestingPage
        agent={testingAgent}
        onBack={() => setTestingAgent(null)}
        onEdit={(target) => {
          setTestingAgent(null);
          setEditingAgent(target);
        }}
        onUpdateStatus={handleUpdateAgentStatus}
        onNavigatePhoneSetup={(target) => {
          setTestingAgent(null);
          setPhoneSetupAgent(target);
        }}
      />
    );
  }

  if (phoneSetupAgent) {
    return (
      <PhoneNumberSetupPage
        initialAgent={phoneSetupAgent}
        allAgents={agents}
        savedConfig={savedPhoneConfig}
        onSaveConfig={(cfg) => setSavedPhoneConfig(cfg)}
        onBack={() => setPhoneSetupAgent(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Heading & Main Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Agents
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              {agents.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage, configure, and monitor your enterprise voice intelligence agents for {businessName}.
          </p>
        </div>

        {/* Action Controls: + Create AI Agent button & Empty State Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick toggle to demonstrate empty state compliance */}
          <button
            type="button"
            onClick={handleToggleEmptyState}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Toggle between sample list and empty state"
          >
            {agents.length === 0 ? 'Restore Sample Agents' : 'Preview Empty State'}
          </button>

          {/* Prominent + Create AI Agent Button */}
          <button
            type="button"
            onClick={() => setIsCreatingAgent(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all cursor-pointer min-h-[42px] touch-manipulation"
          >
            <Plus size={18} />
            <span>Create AI Agent</span>
          </button>
        </div>
      </div>

      {/* Info notice about sample data & real calling readiness */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Functional Template:</strong> Using sample preview data. All Agent actions (View, Edit, Test, Activate/Deactivate) are wired and stateful. Real AI voice calling integration is in development.
        </span>
      </div>

      {/* Main Agent List OR Empty State */}
      {agents.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-10 sm:p-16 text-center shadow-xl flex flex-col items-center max-w-lg mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Bot size={32} />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            No AI Agent Created Yet
          </h3>

          <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
            Create your first intelligent voice agent to start answering business calls, scheduling meetings, and answering FAQs automatically.
          </p>

          <button
            type="button"
            onClick={() => setIsCreatingAgent(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_24px_rgba(37,99,235,0.35)] transition-all cursor-pointer min-h-[46px]"
          >
            <Plus size={16} />
            <span>Create Your First AI Agent</span>
          </button>
        </motion.div>
      ) : (
        /* Agent List Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-slate-700/80 transition-all duration-200"
            >
              <div>
                {/* Card Top: Status & Name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {agent.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {agent.companyName}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {agent.description}
                </p>

                {/* Agent Metadata Fields */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <Languages size={13} className="text-blue-400" />
                      Language
                    </span>
                    <span className="text-slate-200 font-medium">{agent.language}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <Mic size={13} className="text-cyan-400" />
                      Voice
                    </span>
                    <span className="text-slate-200 font-medium truncate max-w-[160px]">
                      {agent.voice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock size={12} />
                      Last Updated
                    </span>
                    <span className="text-slate-400 font-mono">{agent.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Agent Actions: View, Edit, Test, Activate/Deactivate */}
              <div className="pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2">
                {/* 1. View Agent */}
                <button
                  type="button"
                  onClick={() => setViewingAgent(agent)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <Eye size={13} className="text-blue-400" />
                  <span>View Agent</span>
                </button>

                {/* 2. Edit Agent */}
                <button
                  type="button"
                  onClick={() => setEditingAgent(agent)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <Edit3 size={13} className="text-amber-400" />
                  <span>Edit Agent</span>
                </button>

                {/* 3. Test Agent */}
                <button
                  type="button"
                  onClick={() => handleOpenTest(agent)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                >
                  <Play size={13} className="text-emerald-400" />
                  <span>Test Agent</span>
                </button>

                {/* 4. Activate / Deactivate */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(agent.id)}
                  className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    agent.status === 'Active'
                      ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
                      : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                  aria-label={`${agent.status === 'Active' ? 'Deactivate' : 'Activate'} ${agent.name}`}
                >
                  <Power size={13} />
                  <span>{agent.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                </button>

                {/* 5. Phone Number Setup */}
                <button
                  type="button"
                  onClick={() => setPhoneSetupAgent(agent)}
                  className="col-span-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-600/30 border border-cyan-500/20 transition-colors cursor-pointer"
                >
                  <Phone size={13} />
                  <span>Configure Phone Number</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL 1: View Agent Details Modal */}
      {viewingAgent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{viewingAgent.name}</h3>
                  <span className="text-xs text-slate-400">{viewingAgent.companyName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingAgent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Current Status</span>
                  <div className="mt-1">{getStatusBadge(viewingAgent.status)}</div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Agent ID</span>
                  <span className="font-mono text-slate-300">{viewingAgent.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Primary Language</span>
                  <span className="text-white font-medium">{viewingAgent.language}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Synthesized Voice</span>
                  <span className="text-white font-medium">{viewingAgent.voice}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Operational Description</span>
                <p className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-300 leading-relaxed">
                  {viewingAgent.description}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Inbound Opening Greeting</span>
                <p className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-300 italic leading-relaxed">
                  &ldquo;{viewingAgent.greetingMessage}&rdquo;
                </p>
              </div>

              {viewingAgent.humanTransferNumber && (
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Human Escalation Line:</span>
                  <span className="font-mono text-amber-400 font-medium">{viewingAgent.humanTransferNumber}</span>
                </div>
              )}

              {viewingAgent.faqs && viewingAgent.faqs.length > 0 && (
                <div>
                  <span className="text-slate-400 font-medium block mb-1">Configured FAQs ({viewingAgent.faqs.length})</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {viewingAgent.faqs.map((faq) => (
                      <div key={faq.id} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px]">
                        <p className="font-semibold text-slate-200">Q: {faq.question}</p>
                        <p className="text-slate-400 mt-0.5">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span>Agent configuration parameters loaded from template data.</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = viewingAgent;
                  setViewingAgent(null);
                  handleOpenTest(target);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-1.5"
              >
                <Play size={14} />
                <span>Test This Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingAgent(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
