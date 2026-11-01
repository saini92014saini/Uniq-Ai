/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  PhoneIncoming,
  CheckCircle2,
  PhoneForwarded,
  XCircle,
  PhoneMissed,
  Search,
  Filter,
  Calendar,
  ArrowUpDown,
  Clock,
  User,
  Bot,
  Play,
  Pause,
  ArrowLeft,
  Volume2,
  FileText,
  ShieldAlert,
  Info,
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';

export type CallCategory =
  | 'all'
  | 'answered'
  | 'handled'
  | 'transferred'
  | 'failed'
  | 'missed';

export interface CallRecord {
  id: string;
  customerPhoneNumber: string;
  customerName?: string;
  dateTime: string;
  timestamp: number; // for sorting
  duration: string;
  durationSeconds: number;
  status: 'Answered' | 'Successfully Handled' | 'Transferred' | 'Failed' | 'Missed';
  agentName: string;
  summary: string;
  transcript: { speaker: 'Caller' | 'AI Agent' | 'Human Specialist'; text: string; time: string }[];
  humanTransferDetails?: {
    transferredTo: string;
    transferredAt: string;
    reason: string;
    specialistName?: string;
  };
}

const SAMPLE_CALL_RECORDS: CallRecord[] = [
  {
    id: 'CALL-9021',
    customerPhoneNumber: '+91 98765 43210',
    customerName: 'Aarav Sharma',
    dateTime: 'Nov 1, 2026 · 11:42 AM',
    timestamp: 1793533320000,
    duration: '2m 34s',
    durationSeconds: 154,
    status: 'Successfully Handled',
    agentName: 'Front Desk Concierge AI',
    summary: 'Caller inquired about enterprise API consultation availability. Meeting scheduled for Nov 3 at 2:00 PM IST with calendar confirmation sent via WhatsApp.',
    transcript: [
      { speaker: 'AI Agent', text: 'Hello, thank you for calling Acme Global. How may I direct your call today?', time: '0:02' },
      { speaker: 'Caller', text: 'Hi, I wanted to check if you offer consultation on AI voice agent integrations for our logistics dispatch team.', time: '0:14' },
      { speaker: 'AI Agent', text: 'Yes, we provide specialized enterprise voice workflows for logistics. Would you like me to book a 30-minute consultation with our lead technical architect?', time: '0:28' },
      { speaker: 'Caller', text: 'Yes please, do you have an opening on Tuesday at 2 PM?', time: '0:42' },
      { speaker: 'AI Agent', text: 'Tuesday at 2:00 PM IST is available. I have scheduled that for you. A meeting invite and calendar link have been dispatched to your mobile number.', time: '1:10' },
      { speaker: 'Caller', text: 'Thank you, that was very fast.', time: '1:30' },
      { speaker: 'AI Agent', text: 'You are welcome! Have a wonderful day.', time: '1:38' },
    ],
  },
  {
    id: 'CALL-9022',
    customerPhoneNumber: '+91 98111 22334',
    customerName: 'Priya Patel',
    dateTime: 'Nov 1, 2026 · 10:15 AM',
    timestamp: 1793528100000,
    duration: '4m 18s',
    durationSeconds: 258,
    status: 'Transferred',
    agentName: 'Support & Inbound Dispatcher',
    summary: 'Technical inquiry regarding custom webhook authentication and payload signing. Transferred to Tier 2 specialist per escalation rules.',
    transcript: [
      { speaker: 'AI Agent', text: 'Hi there! Welcome to support. Please describe the issue you are experiencing.', time: '0:02' },
      { speaker: 'Caller', text: 'I am getting an HMAC signature mismatch on the webhook callback when receiving call status events.', time: '0:20' },
      { speaker: 'AI Agent', text: 'Let me look that up. For custom webhook authentication, payloads must be signed using SHA-256 with your private project key.', time: '0:38' },
      { speaker: 'Caller', text: 'We verified the key, but the raw body encoding seems different in production. Can I speak to an integration engineer?', time: '1:02' },
      { speaker: 'AI Agent', text: 'Certainly! I will connect you directly to our lead integration engineer right now. Please hold for just a moment.', time: '1:20' },
      { speaker: 'Human Specialist', text: 'Hello Priya, this is Vikram from integrations. I can see your webhook logs on my screen. Let us walk through the raw buffer encoding.', time: '1:35' },
    ],
    humanTransferDetails: {
      transferredTo: '+91 80 4719 2800 (Ext 402)',
      transferredAt: '10:16 AM',
      reason: 'Caller requested human engineer for raw buffer HMAC verification.',
      specialistName: 'Vikram Joshi (Tier 2 Integration)',
    },
  },
  {
    id: 'CALL-9023',
    customerPhoneNumber: '+91 97234 56789',
    customerName: 'Rohan Verma',
    dateTime: 'Nov 1, 2026 · 09:30 AM',
    timestamp: 1793525400000,
    duration: '1m 15s',
    durationSeconds: 75,
    status: 'Answered',
    agentName: 'Front Desk Concierge AI',
    summary: 'Provided business operating hours, office address in Innovation Parkway, and store visitor guidelines.',
    transcript: [
      { speaker: 'AI Agent', text: 'Hello, thank you for calling Acme Global. How may I direct your call today?', time: '0:02' },
      { speaker: 'Caller', text: 'Are you guys open today for in-person product pickups?', time: '0:12' },
      { speaker: 'AI Agent', text: 'Yes, our office is open Monday through Friday from 8:00 AM to 6:00 PM at 450 Innovation Parkway.', time: '0:24' },
      { speaker: 'Caller', text: 'Great, thanks for the info.', time: '0:38' },
    ],
  },
  {
    id: 'CALL-9024',
    customerPhoneNumber: '+91 99000 88776',
    dateTime: 'Oct 31, 2026 · 06:14 PM',
    timestamp: 1793470440000,
    duration: '0m 14s',
    durationSeconds: 14,
    status: 'Failed',
    agentName: 'Front Desk Concierge AI',
    summary: 'Call disconnected before audio RTP stream initialized. Network carrier dropped packet stream.',
    transcript: [
      { speaker: 'AI Agent', text: 'Hello, thank you for calling...', time: '0:02' },
      { speaker: 'Caller', text: '[Audio lost / Carrier disconnect]', time: '0:08' },
    ],
  },
  {
    id: 'CALL-9025',
    customerPhoneNumber: '+91 98450 12345',
    dateTime: 'Oct 31, 2026 · 05:02 PM',
    timestamp: 1793466120000,
    duration: '0m 00s',
    durationSeconds: 0,
    status: 'Missed',
    agentName: 'Support & Inbound Dispatcher',
    summary: 'Caller hung up while ringing before AI agent pickup threshold.',
    transcript: [],
  },
  {
    id: 'CALL-9026',
    customerPhoneNumber: '+91 94480 99887',
    customerName: 'Ananya Deshmukh',
    dateTime: 'Oct 31, 2026 · 03:22 PM',
    timestamp: 1793460120000,
    duration: '3m 05s',
    durationSeconds: 185,
    status: 'Successfully Handled',
    agentName: 'VIP Client Outreach & Follow-up',
    summary: 'Customer completed satisfaction rating feedback following enterprise onboarding demo.',
    transcript: [
      { speaker: 'AI Agent', text: 'Good day! I am checking in regarding your recent demo consultation with our team.', time: '0:02' },
      { speaker: 'Caller', text: 'Yes, we reviewed the pricing tier and had a quick question regarding team seats.', time: '0:18' },
      { speaker: 'AI Agent', text: 'Our Enterprise Growth plan includes unlimited seats with role-based permissions.', time: '0:34' },
      { speaker: 'Caller', text: 'Perfect. We will proceed with onboarding tomorrow morning.', time: '0:50' },
    ],
  },
];

interface CallsManagementPageProps {
  businessName: string;
}

export const CallsManagementPage: React.FC<CallsManagementPageProps> = ({
  businessName,
}) => {
  // Navigation & Detail View State
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<CallCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Simulated Audio Recording Player State
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);

  // Filtered & Sorted Calls
  const filteredCalls = useMemo(() => {
    return SAMPLE_CALL_RECORDS.filter((call) => {
      // 1. Category Tab Filter
      if (activeCategory === 'answered' && !['Answered', 'Successfully Handled', 'Transferred'].includes(call.status)) {
        return false;
      }
      if (activeCategory === 'handled' && call.status !== 'Successfully Handled') {
        return false;
      }
      if (activeCategory === 'transferred' && call.status !== 'Transferred') {
        return false;
      }
      if (activeCategory === 'failed' && call.status !== 'Failed') {
        return false;
      }
      if (activeCategory === 'missed' && call.status !== 'Missed') {
        return false;
      }

      // 2. Dropdown Status Filter
      if (statusFilter !== 'all' && call.status !== statusFilter) {
        return false;
      }

      // 3. Search Filter (Phone Number or Customer Name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesPhone = call.customerPhoneNumber.toLowerCase().includes(query);
        const matchesName = call.customerName?.toLowerCase().includes(query);
        const matchesAgent = call.agentName.toLowerCase().includes(query);
        if (!matchesPhone && !matchesName && !matchesAgent) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      }
      return a.timestamp - b.timestamp;
    });
  }, [activeCategory, statusFilter, searchQuery, sortOrder]);

  const getStatusBadge = (status: CallRecord['status']) => {
    switch (status) {
      case 'Successfully Handled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 size={12} />
            Successfully Handled
          </span>
        );
      case 'Answered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
            <PhoneIncoming size={12} />
            Answered
          </span>
        );
      case 'Transferred':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <PhoneForwarded size={12} />
            Transferred
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
            <XCircle size={12} />
            Failed
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <PhoneMissed size={12} />
            Missed
          </span>
        );
    }
  };

  // If a call is selected, render the 4. Call Details Panel
  if (selectedCall) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
        {/* Top Detail Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <button
              type="button"
              onClick={() => {
                setSelectedCall(null);
                setIsPlayingRecording(false);
              }}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer mb-2 focus:outline-none"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Back to Calls List</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <PhoneCall size={26} className="text-blue-400" />
                <span>Call Record: {selectedCall.id}</span>
              </h1>
              {getStatusBadge(selectedCall.status)}
            </div>
            <span className="text-[11px] text-blue-400 font-mono mt-1 block">
              Sample Demo Call Record
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCall(null);
              setIsPlayingRecording(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Close Details
          </button>
        </div>

        {/* Call Meta & Customer Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Customer Phone</span>
            <span className="text-white font-mono font-bold text-sm block">
              {selectedCall.customerPhoneNumber}
            </span>
            {selectedCall.customerName && (
              <span className="text-slate-400 text-xs mt-0.5 block">
                {selectedCall.customerName}
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Date & Time</span>
            <span className="text-slate-200 font-medium text-xs block">
              {selectedCall.dateTime}
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">Inbound Voice Session</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Duration</span>
            <span className="text-white font-mono font-bold text-sm block">
              {selectedCall.duration}
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5 block font-mono">
              {selectedCall.durationSeconds} seconds
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">AI Agent Assigned</span>
            <span className="text-blue-400 font-semibold text-xs block truncate">
              {selectedCall.agentName}
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">Automated Handler</span>
          </div>
        </div>

        {/* Human Transfer Details (if applicable) */}
        {selectedCall.humanTransferDetails && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <PhoneForwarded size={16} />
              <span>Human Specialist Escalation Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 pt-1">
              <div>
                <span className="text-amber-400/80 text-[11px] block">Transferred Line</span>
                <span className="font-mono font-medium text-white">
                  {selectedCall.humanTransferDetails.transferredTo}
                </span>
              </div>
              <div>
                <span className="text-amber-400/80 text-[11px] block">Specialist</span>
                <span className="font-medium text-white">
                  {selectedCall.humanTransferDetails.specialistName || 'Support Desk'}
                </span>
              </div>
              <div>
                <span className="text-amber-400/80 text-[11px] block">Escalation Reason</span>
                <span>{selectedCall.humanTransferDetails.reason}</span>
              </div>
            </div>
          </div>
        )}

        {/* Call Summary */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <FileText size={16} className="text-blue-400" />
            <span>AI Executive Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            {selectedCall.summary}
          </p>
        </div>

        {/* Conversation Transcript */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot size={16} className="text-cyan-400" />
              <span>Conversation Transcript ({selectedCall.transcript.length} Turns)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Real-time Speech-to-Text</span>
          </div>

          {selectedCall.transcript.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No audio stream captured (Call disconnected or missed before greeting).
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {selectedCall.transcript.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm flex flex-col gap-1 ${
                    item.speaker === 'Caller'
                      ? 'bg-blue-600/10 border-blue-500/25 ml-4 sm:ml-8'
                      : item.speaker === 'Human Specialist'
                      ? 'bg-amber-500/10 border-amber-500/25 mr-4 sm:mr-8'
                      : 'bg-slate-950/70 border-slate-800 mr-4 sm:mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span
                      className={
                        item.speaker === 'Caller'
                          ? 'text-blue-300'
                          : item.speaker === 'Human Specialist'
                          ? 'text-amber-300'
                          : 'text-cyan-300'
                      }
                    >
                      {item.speaker}
                    </span>
                    <span className="text-slate-500 font-mono">{item.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Call Recording Section (Placeholder Audio Player & Regulatory Notice) */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Volume2 size={16} className="text-emerald-400" />
              <span>Call Audio Recording (Demo Placeholder)</span>
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Demo Simulation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingRecording(!isPlayingRecording)}
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                aria-label={isPlayingRecording ? 'Pause audio' : 'Play audio'}
              >
                {isPlayingRecording ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              <div>
                <span className="text-xs font-semibold text-white block">
                  {isPlayingRecording ? 'Playing Simulated Audio Stream...' : 'Inbound Voice Session Audio'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Sample Bitrate: 64 kbps · Duration: {selectedCall.duration}
                </span>
              </div>
            </div>

            {/* Simulated Waveform Bar */}
            <div className="flex items-center gap-1 h-6">
              {[12, 18, 24, 14, 8, 22, 28, 16, 12, 26, 20, 15, 25, 18, 10, 22, 16, 20, 14, 8].map(
                (h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isPlayingRecording ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: `${h}px` }}
                  />
                )
              )}
            </div>
          </div>

          {/* Compliance & Consent Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-slate-300">Privacy & Regulatory Compliance Notice:</strong>
              <p className="leading-relaxed">
                Call recording and voice transcription features require explicit caller consent, statutory two-party notice disclosure, and compliance with data retention, GDPR, and regional telecommunications standards. Real audio files are not generated or stored in this functional template.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Calls Dashboard & List View
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
      {/* Page Heading & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <PhoneCall size={28} className="text-blue-400" />
              <span>Calls Management</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Live Logs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track, filter, and inspect incoming customer voice sessions handled by UNIQ AI for {businessName}.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-auto">
          Sample Demo Data Only
        </span>
      </div>

      {/* 1. SECTION: Calls Dashboard Summary Cards */}
      <section aria-label="Calls Summary">
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
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">+14.2% this month</p>
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
              <PhoneForwarded size={16} className="text-amber-400" />
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
              <XCircle size={16} className="text-rose-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                23
              </span>
              <p className="text-[11px] text-rose-400 mt-1 font-medium">1.6% dropped</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: Call Category Tabs */}
      <section aria-label="Call Categories" className="border-b border-slate-800/80 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Calls', count: SAMPLE_CALL_RECORDS.length },
            { id: 'answered', label: 'Answered', count: 4 },
            { id: 'handled', label: 'Successfully Handled', count: 2 },
            { id: 'transferred', label: 'Transferred', count: 1 },
            { id: 'failed', label: 'Failed', count: 1 },
            { id: 'missed', label: 'Missed', count: 1 },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as CallCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.3)]'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. SECTION: Search and Filters Bar */}
      <section
        aria-label="Search and Filters"
        className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
      >
        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer phone or name..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filter Dropdowns & Sorting */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer hover:border-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Successfully Handled">Successfully Handled</option>
              <option value="Answered">Answered</option>
              <option value="Transferred">Transferred</option>
              <option value="Failed">Failed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer hover:border-slate-700"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
            title="Toggle sort direction"
          >
            <ArrowUpDown size={13} className="text-blue-400" />
            <span>Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>

          {(searchQuery || statusFilter !== 'all' || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setActiveCategory('all');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* 3. SECTION: Call History List / Table */}
      <section aria-label="Call History List" className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredCalls.length} call records</span>
          <span className="font-mono text-[11px]">Click any record to inspect transcript</span>
        </div>

        {filteredCalls.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-12 text-center flex flex-col items-center">
            <PhoneMissed size={36} className="text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Call Records Found</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm">
              No calls match your active search and category filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Desktop Table View */
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Customer</th>
                    <th scope="col" className="px-5 py-3.5">Date & Time</th>
                    <th scope="col" className="px-5 py-3.5">Duration</th>
                    <th scope="col" className="px-5 py-3.5">Status</th>
                    <th scope="col" className="px-5 py-3.5">AI Agent</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {filteredCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono text-white text-xs sm:text-sm font-medium">
                          {call.customerPhoneNumber}
                        </div>
                        {call.customerName && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {call.customerName}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-300">
                        {call.dateTime}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-300">
                        {call.duration}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(call.status)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-blue-400 font-medium">
                          {call.agentName}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCall(call);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-800/60">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className="p-4 flex flex-col gap-2.5 hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm text-white font-medium block">
                        {call.customerPhoneNumber}
                      </span>
                      {call.customerName && (
                        <span className="text-xs text-slate-400">{call.customerName}</span>
                      )}
                    </div>
                    {getStatusBadge(call.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{call.dateTime}</span>
                    <span className="font-mono text-slate-300">{call.duration}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-xs">
                    <span className="text-blue-400 truncate max-w-[180px]">
                      {call.agentName}
                    </span>
                    <span className="text-slate-400 inline-flex items-center gap-1 text-[11px]">
                      <span>Inspect Details</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
