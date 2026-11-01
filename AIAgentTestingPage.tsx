/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Edit3,
  Power,
  Languages,
  Mic,
  Send,
  HelpCircle,
  MessageSquare,
  Volume2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Info,
  Phone,
} from 'lucide-react';
import type { AIAgentItem } from './AIAgentManagement.tsx';

interface AIAgentTestingPageProps {
  agent: AIAgentItem;
  onBack: () => void;
  onEdit: (agent: AIAgentItem) => void;
  onUpdateStatus: (agentId: string, newStatus: AIAgentItem['status']) => void;
  onNavigatePhoneSetup?: (agent: AIAgentItem) => void;
}

export const AIAgentTestingPage: React.FC<AIAgentTestingPageProps> = ({
  agent,
  onBack,
  onEdit,
  onUpdateStatus,
  onNavigatePhoneSetup,
}) => {
  // Local status tracking
  const [currentStatus, setCurrentStatus] = useState<AIAgentItem['status']>(agent.status);

  // Greeting Audio Simulation
  const [isPlayingGreeting, setIsPlayingGreeting] = useState(false);

  // Business Knowledge Test State
  const [sampleQuestion, setSampleQuestion] = useState('');
  const [knowledgeResult, setKnowledgeResult] = useState<string | null>(null);

  // Conversation Test State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: agent.greetingMessage,
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Activation Confirmation Modal
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationSuccessNotice, setActivationSuccessNotice] = useState<string | null>(null);

  // Audio simulation timer
  const handleTogglePlayGreeting = () => {
    if (isPlayingGreeting) {
      setIsPlayingGreeting(false);
    } else {
      setIsPlayingGreeting(true);
      setTimeout(() => {
        setIsPlayingGreeting(false);
      }, 4500);
    }
  };

  // Business Knowledge Query Simulation
  const handleTestKnowledgeAnswer = (queryText = sampleQuestion) => {
    if (!queryText.trim()) return;

    const lowerQuery = queryText.toLowerCase();

    // Check if matched in FAQs
    const matchedFaq = agent.faqs?.find(
      (f) =>
        lowerQuery.includes(f.question.toLowerCase().slice(0, 10)) ||
        f.question.toLowerCase().includes(lowerQuery)
    );

    if (matchedFaq) {
      setKnowledgeResult(
        `[Demo Knowledge Match from FAQ]: "${matchedFaq.answer}"`
      );
      return;
    }

    if (lowerQuery.includes('hour') || lowerQuery.includes('time') || lowerQuery.includes('open')) {
      setKnowledgeResult(
        `[Demo Knowledge Response]: Standard operating hours are Monday through Friday from 8:00 AM to 6:00 PM EST based on business description.`
      );
      return;
    }

    if (lowerQuery.includes('transfer') || lowerQuery.includes('human') || lowerQuery.includes('support')) {
      setKnowledgeResult(
        `[Demo Knowledge Response]: Caller escalation rule: calls are transferred to ${agent.humanTransferNumber || 'your team'} when ${agent.transferConditions || 'requested by caller'}.`
      );
      return;
    }

    // Default knowledge summary
    setKnowledgeResult(
      `[Demo Knowledge Response]: Answer derived from business profile for "${agent.companyName}". Description: "${agent.description.slice(0, 120)}...".`
    );
  };

  // Conversation Chat handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: 'Now' },
    ];
    setChatMessages(newMessages);
    setChatInput('');

    // Simulated response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent' as const,
          text: `[Demo Agent Response]: Thank you for asking. Based on ${agent.companyName}'s guidelines, I am equipped to handle this request and route you to our team if needed.`,
          time: 'Now',
        },
      ]);
    }, 600);
  };

  const handleTestAgain = () => {
    setIsPlayingGreeting(false);
    setSampleQuestion('');
    setKnowledgeResult(null);
    setChatMessages([
      {
        sender: 'agent',
        text: agent.greetingMessage,
        time: 'Just now',
      },
    ]);
  };

  const handleConfirmActivation = () => {
    const nextStatus: AIAgentItem['status'] = 'Active';
    setCurrentStatus(nextStatus);
    onUpdateStatus(agent.id, nextStatus);
    setShowActivationModal(false);
    setActivationSuccessNotice(
      `Agent "${agent.name}" is now Active in your workspace. (Note: Live phone calling will be connected in future telephony integration).`
    );
  };

  const getStatusBadge = (status: AIAgentItem['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Ready
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
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
            <span>Back to AI Agents</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Testing: {agent.name}</span>
            </h1>
            {getStatusBadge(currentStatus)}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sandbox testing environment for <span className="text-white font-medium">{agent.companyName}</span>. Test greetings, knowledge retrieval, and dialogue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onEdit(agent)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit3 size={13} className="text-amber-400" />
            <span>Edit Agent</span>
          </button>

          <button
            type="button"
            onClick={handleTestAgain}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} className="text-blue-400" />
            <span>Test Again</span>
          </button>

          {onNavigatePhoneSetup && (
            <button
              type="button"
              onClick={() => onNavigatePhoneSetup(agent)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Phone size={13} className="text-cyan-400" />
              <span>Phone Setup</span>
            </button>
          )}

          {currentStatus !== 'Active' ? (
            <button
              type="button"
              onClick={() => setShowActivationModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer min-h-[38px]"
            >
              <Power size={13} />
              <span>Activate Agent</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={13} />
              <span>Agent is Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Success / Info Banners */}
      {activationSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>{activationSuccessNotice}</span>
        </motion.div>
      )}

      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Functional Testing Sandbox:</strong> Demonstrates greeting speech synthesis simulation, business knowledge retrieval, and interactive chat. Actual live telephone calling and voice providers will be integrated in future steps.
        </span>
      </div>

      {/* 1. SECTION: Agent Information Strip */}
      <section
        aria-label="Agent Information"
        className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl"
      >
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Bot size={15} className="text-blue-400" />
          <span>Agent Information Profile</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">AI Agent Name</span>
            <span className="text-white font-semibold text-sm">{agent.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Company Name</span>
            <span className="text-white font-semibold text-sm">{agent.companyName}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Language</span>
            <span className="text-blue-400 font-medium">{agent.language}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Voice & Tone</span>
            <span className="text-cyan-400 font-medium truncate block">{agent.voice}</span>
          </div>
        </div>
      </section>

      {/* Grid: 2. Greeting Message Test & 3. Business Knowledge Test */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. SECTION: Greeting Message Test */}
        <section
          aria-label="Greeting Message Test"
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Volume2 size={16} className="text-blue-400" />
                <span>Greeting Message Test</span>
              </h2>
              <span className="text-[11px] text-slate-500">First Inbound Phrase</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              What your AI speaks immediately upon connecting with a customer:
            </p>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm italic relative leading-relaxed mb-4">
              &ldquo;{agent.greetingMessage}&rdquo;
            </div>

            {/* Audio Simulation Wave */}
            {isPlayingGreeting && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-blue-400 animate-pulse h-2" />
                    <span className="w-1 bg-blue-400 animate-pulse h-4" />
                    <span className="w-1 bg-blue-400 animate-pulse h-3" />
                    <span className="w-1 bg-blue-400 animate-pulse h-4" />
                  </div>
                  <span>Simulating Voice Audio Output ({agent.voice})...</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">Playing</span>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleTogglePlayGreeting}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isPlayingGreeting
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
              }`}
            >
              {isPlayingGreeting ? (
                <>
                  <Pause size={16} />
                  <span>Pause Greeting (Placeholder)</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Play Greeting (Audio Simulation)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Note: Demo audio synthesis placeholder. Real neural telephony will be connected in voice provider integration.
            </p>
          </div>
        </section>

        {/* 3. SECTION: Business Knowledge Test */}
        <section
          aria-label="Business Knowledge Test"
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle size={16} className="text-cyan-400" />
                <span>Business Knowledge Test</span>
              </h2>
              <span className="text-[11px] text-slate-500">FAQ & Policies</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Ask a sample customer question to verify what the agent knows:
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={sampleQuestion}
                onChange={(e) => setSampleQuestion(e.target.value)}
                placeholder="e.g. What are your opening hours?"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleTestKnowledgeAnswer()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
              >
                Test Answer
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[10px] text-slate-500">Quick tests:</span>
              {[
                'What are your hours?',
                'Where are you located?',
                'Can I speak with a human?',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSampleQuestion(chip);
                    handleTestKnowledgeAnswer(chip);
                  }}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Knowledge Result */}
            {knowledgeResult && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30 text-xs space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                  Demo Knowledge Response (Non-LLM Simulation)
                </span>
                <p className="text-slate-200 leading-relaxed">{knowledgeResult}</p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-3">
            Simulated evaluation based on saved FAQs and business description.
          </p>
        </section>
      </div>

      {/* 4. SECTION: Conversation Test */}
      <section
        aria-label="Conversation Test"
        className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Conversation Test (Demo Chat Interface)
            </h2>
          </div>
          <button
            type="button"
            onClick={handleTestAgain}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear Conversation
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Simulate a real-time back-and-forth customer dialogue with clearly labelled demo responses.
        </p>

        {/* Chat Box */}
        <div className="h-64 sm:h-72 overflow-y-auto space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-500 mb-1 px-1">
                {msg.sender === 'user' ? 'Customer' : `${agent.name} (Demo)`}
              </span>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-2.5 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a sample customer message (e.g. Can I schedule a meeting for Friday?)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>
      </section>

      {/* Bottom Sticky Return Bar */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-400">
        <span>AI Agent Testing Environment · UNIQ AI</span>
        <button
          type="button"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Return to AI Agent Management</span>
        </button>
      </div>

      {/* Confirmation Modal for Activate Agent */}
      {showActivationModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <Power size={26} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Activate AI Agent?
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">
              Are you sure you want to activate <strong className="text-white">{agent.name}</strong>? This sets the agent status to <span className="text-emerald-400 font-semibold">Active</span> across your workspace.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-left mb-6">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <Info size={14} className="text-blue-400" />
                <span>Notice on Calling:</span>
              </div>
              <p>Actual telephone calling and inbound SIP phone numbers are not connected yet. This update records the active state in your application.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowActivationModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActivation}
                className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                <span>Confirm Activation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
