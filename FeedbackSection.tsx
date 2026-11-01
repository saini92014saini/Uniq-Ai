/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareHeart,
  AlertTriangle,
  History,
  Star,
  Send,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Bug,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'Feedback' | 'Problem Report';
  category: string;
  title: string;
  description: string;
  rating?: number;
  severity?: 'Minor' | 'Moderate' | 'Critical';
  status: 'Under Review' | 'Planned' | 'In Progress' | 'Resolved';
  submittedDate: string;
  responseNote?: string;
}

interface FeedbackSectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

const INITIAL_FEEDBACK_HISTORY: FeedbackItem[] = [
  {
    id: 'FB-4091',
    type: 'Feedback',
    category: 'AI Voice Naturalness',
    title: 'Request for Hindi and Hinglish conversational voice nuances',
    description:
      'We love the low latency, but would love more colloquial conversational fillers (haan ji, bilkul) for Indian business callers.',
    rating: 5,
    status: 'Planned',
    submittedDate: 'Oct 25, 2026',
    responseNote:
      'Product Team: Hinglish natural filler injection is scheduled in the upcoming Gemini voice synthesis update.',
  },
  {
    id: 'FB-3810',
    type: 'Problem Report',
    category: 'Telephony Forwarding',
    title: 'Occasional delay in caller audio during peak noon hours',
    description:
      'Noticed 800ms packet latency during 12 PM - 1 PM on Airtel cellular network.',
    severity: 'Moderate',
    status: 'Resolved',
    submittedDate: 'Oct 18, 2026',
    responseNote:
      'Engineering: Additional regional SIP edge relays provisioned in Mumbai & Bangalore. Round-trip jitter stabilized to 45ms.',
  },
];

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'report' | 'history'>('submit');

  // Submit Feedback Form State
  const [rating, setRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Feature Request');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Report Problem Form State
  const [problemModule, setProblemModule] = useState('Voice Telephony & SIP');
  const [problemSeverity, setProblemSeverity] = useState<'Minor' | 'Moderate' | 'Critical'>('Minor');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemSteps, setProblemSteps] = useState('');

  // Feedback History
  const [history, setHistory] = useState<FeedbackItem[]>(INITIAL_FEEDBACK_HISTORY);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackMessage.trim()) {
      onShowToast('Please fill out all required feedback fields.');
      return;
    }

    const newId = `FB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: FeedbackItem = {
      id: newId,
      type: 'Feedback',
      category: feedbackCategory,
      title: feedbackTitle,
      description: feedbackMessage,
      rating,
      status: 'Under Review',
      submittedDate: 'Just now',
      responseNote:
        'Thank you! Your feedback has been queued for our product design team.',
    };

    setHistory([newItem, ...history]);
    setFeedbackTitle('');
    setFeedbackMessage('');
    setRating(5);
    setActiveTab('history');
    onShowToast(`Feedback #${newId} submitted. Thank you for helping improve UNIQ AI!`);
  };

  const handleReportProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !problemSteps.trim()) {
      onShowToast('Please provide a title and steps to reproduce the issue.');
      return;
    }

    const newId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: FeedbackItem = {
      id: newId,
      type: 'Problem Report',
      category: problemModule,
      title: problemTitle,
      description: problemSteps,
      severity: problemSeverity,
      status: 'Under Review',
      submittedDate: 'Just now',
      responseNote:
        'Automated Diagnostic: Diagnostics telemetry captured. Assigned to telephony reliability on-call.',
    };

    setHistory([newItem, ...history]);
    setProblemTitle('');
    setProblemSteps('');
    setActiveTab('history');
    onShowToast(`Bug report #${newId} logged with engineering team.`);
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
            <MessageSquareHeart className="text-blue-400" size={22} />
            <span>Product Feedback & Bug Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Share ideas, request AI voice enhancements, report telephony issues, and monitor resolutions.
          </p>
        </div>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'submit', label: 'Submit Feedback', icon: MessageSquareHeart },
          { id: 'report', label: 'Report a Problem', icon: Bug },
          { id: 'history', label: `Feedback History (${history.length})`, icon: History },
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

      {/* 1. Submit Feedback Tab */}
      {activeTab === 'submit' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              How has your experience been with UNIQ AI?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rate our platform and tell us what features or voice capabilities you would like next.
            </p>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
            {/* Star Rating */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Your Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  {rating === 5
                    ? '5/5 - Outstanding'
                    : rating === 4
                    ? '4/5 - Very Good'
                    : rating === 3
                    ? '3/5 - Average'
                    : '2/5 - Needs Improvement'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Feedback Category</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Feature Request">Feature Request</option>
                  <option value="AI Voice Naturalness">AI Voice Naturalness</option>
                  <option value="Dashboard User Experience">Dashboard User Experience</option>
                  <option value="Call Quality & Latency">Call Quality & Latency</option>
                  <option value="Pricing & Plans">Pricing & Plans</option>
                  <option value="General Praise">General Praise</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Short Title</label>
                <input
                  type="text"
                  value={feedbackTitle}
                  onChange={(e) => setFeedbackTitle(e.target.value)}
                  placeholder="e.g. Add custom caller wait-music"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Detailed Suggestions</label>
              <textarea
                rows={4}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Share your thoughts or describe your workflow idea..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                <Send size={13} />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Report a Problem Tab */}
      {activeTab === 'report' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bug size={16} className="text-rose-400" />
              Report a Problem or Technical Glitch
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Encountered unexpected behavior with call handling or WhatsApp message delivery? Tell us what happened.
            </p>
          </div>

          <form onSubmit={handleReportProblem} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Affected Component</label>
                <select
                  value={problemModule}
                  onChange={(e) => setProblemModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Voice Telephony & SIP">Voice Telephony & SIP Interconnect</option>
                  <option value="AI Voice Synthesis">AI Voice Synthesis / Latency</option>
                  <option value="WhatsApp Follow-up Delivery">WhatsApp Follow-up Delivery</option>
                  <option value="Dashboard & Analytics UI">Dashboard & Analytics UI</option>
                  <option value="Credits Deduction">Credits & Wallet Calculation</option>
                  <option value="Phone Number Setup">Phone Number Forwarding Setup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Severity Level</label>
                <select
                  value={problemSeverity}
                  onChange={(e) =>
                    setProblemSeverity(e.target.value as 'Minor' | 'Moderate' | 'Critical')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Minor">Minor - Cosmetic or minor inconvenience</option>
                  <option value="Moderate">Moderate - Feature partially unavailable</option>
                  <option value="Critical">Critical - Incoming calls failing to connect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Issue Summary</label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. Call dropped after 15 seconds on agent greeting"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Steps to Reproduce</label>
              <textarea
                rows={4}
                value={problemSteps}
                onChange={(e) => setProblemSteps(e.target.value)}
                placeholder="1. Called business number from Jio SIM&#10;2. AI greeted customer&#10;3. Caller asked about pricing and audio went silent..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 cursor-pointer transition-all"
              >
                <AlertTriangle size={13} />
                <span>Submit Problem Report</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Feedback History Tab */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <History size={16} className="text-blue-400" />
              Your Feedback & Bug Submissions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review historical notes, feature requests, and engineering team updates.
            </p>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{item.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-blue-400 font-medium">{item.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status === 'Planned'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.submittedDate}</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {item.responseNote && (
                  <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-200">
                    {item.responseNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
