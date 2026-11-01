/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Send,
  CheckCheck,
  Check,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ArrowLeft,
  Settings,
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Info,
  ExternalLink,
  UserCheck,
  PhoneCall,
  Save,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export type WhatsAppSubTab = 'messages' | 'followup_rules' | 'templates' | 'compliance';
export type MessageDeliveryStatus = 'Sent' | 'Delivered' | 'Failed' | 'Pending';

export interface WhatsAppMessage {
  id: string;
  customerName: string;
  customerWhatsAppNumber: string;
  relatedCallId?: string;
  relatedCallSummary?: string;
  messageContent: string;
  dateTime: string;
  timestamp: number;
  status: MessageDeliveryStatus;
  optInStatus: boolean;
  errorDetails?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  content: string;
  metaApprovalStatus: 'Meta Approved' | 'Pending Meta Review' | 'Draft';
  language: string;
  lastUpdated: string;
}

export interface FollowUpSettings {
  enabled: boolean;
  afterSuccessfulCall: boolean;
  afterMissedCall: boolean;
  delayMinutes: string;
  defaultMessage: string;
}

const INITIAL_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'WA-MSG-101',
    customerName: 'Aarav Sharma',
    customerWhatsAppNumber: '+91 98765 43210',
    relatedCallId: 'CALL-9021',
    relatedCallSummary: 'Enterprise API consultation scheduled for Nov 3 at 2:00 PM IST.',
    messageContent: 'Hi Aarav, thank you for calling Acme Global! Your consultation has been scheduled for Tuesday, Nov 3 at 2:00 PM IST. Meeting link: https://meet.uniqai.demo/consult-9021. Reply HELP if you need to reschedule.',
    dateTime: 'Nov 1, 2026 · 11:43 AM',
    timestamp: 1793533380000,
    status: 'Delivered',
    optInStatus: true,
  },
  {
    id: 'WA-MSG-102',
    customerName: 'Priya Patel',
    customerWhatsAppNumber: '+91 98111 22334',
    relatedCallId: 'CALL-9022',
    relatedCallSummary: 'Transferred to Vikram Joshi regarding webhook HMAC signature documentation.',
    messageContent: 'Hello Priya, following up on your discussion with our engineer Vikram: here is the documentation for HMAC webhook signing: https://docs.uniqai.demo/webhooks/hmac. Let us know if you need additional sandbox credits.',
    dateTime: 'Nov 1, 2026 · 10:22 AM',
    timestamp: 1793528520000,
    status: 'Delivered',
    optInStatus: true,
  },
  {
    id: 'WA-MSG-103',
    customerName: 'Rohan Verma',
    customerWhatsAppNumber: '+91 97234 56789',
    relatedCallId: 'CALL-9023',
    relatedCallSummary: 'Provided office opening hours and location address.',
    messageContent: 'Hi Rohan, thank you for contacting Acme Global. We are located at 450 Innovation Parkway, open Mon-Fri 8 AM to 6 PM. Directions: https://maps.uniqai.demo/office.',
    dateTime: 'Nov 1, 2026 · 09:32 AM',
    timestamp: 1793525520000,
    status: 'Sent',
    optInStatus: true,
  },
  {
    id: 'WA-MSG-104',
    customerName: 'Unknown Caller',
    customerWhatsAppNumber: '+91 99000 88776',
    relatedCallId: 'CALL-9024',
    relatedCallSummary: 'Call disconnected before audio stream initialized.',
    messageContent: 'Hello, we noticed your call was unexpectedly disconnected. Would you like our AI agent to call you back, or can we assist you here on WhatsApp?',
    dateTime: 'Oct 31, 2026 · 06:16 PM',
    timestamp: 1793470560000,
    status: 'Failed',
    optInStatus: false,
    errorDetails: 'Meta API Error #131026: Undeliverable - Customer phone number is not registered on WhatsApp or out of network coverage.',
  },
  {
    id: 'WA-MSG-105',
    customerName: 'Inquiry Pending',
    customerWhatsAppNumber: '+91 98450 12345',
    relatedCallId: 'CALL-9025',
    relatedCallSummary: 'Missed call during ringing.',
    messageContent: 'Hi! We missed your call to Acme Global. How can our AI assistant help you today? Please reply with your inquiry.',
    dateTime: 'Oct 31, 2026 · 05:03 PM',
    timestamp: 1793466180000,
    status: 'Pending',
    optInStatus: true,
  },
];

const INITIAL_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'TPL-01',
    name: 'post_call_appointment_confirmation',
    category: 'UTILITY',
    content: 'Hi {{1}}, thank you for calling {{2}}! Your appointment has been scheduled for {{3}}. Meeting link: {{4}}. Reply to this message if you need to reschedule.',
    metaApprovalStatus: 'Meta Approved',
    language: 'English (en_US)',
    lastUpdated: 'Oct 28, 2026',
  },
  {
    id: 'TPL-02',
    name: 'missed_call_callback_request',
    category: 'UTILITY',
    content: 'Hello, we missed your call to {{1}} at {{2}}. We are ready to assist you. Would you like a callback or can we answer your questions right here on WhatsApp?',
    metaApprovalStatus: 'Meta Approved',
    language: 'English (en_US)',
    lastUpdated: 'Oct 29, 2026',
  },
  {
    id: 'TPL-03',
    name: 'post_call_support_summary',
    category: 'UTILITY',
    content: 'Hi {{1}}, here is a summary of your support session regarding ticket #{{2}}: {{3}}. Your dedicated reference link is: {{4}}.',
    metaApprovalStatus: 'Pending Meta Review',
    language: 'English (en_US)',
    lastUpdated: 'Oct 30, 2026',
  },
];

interface WhatsAppManagementPageProps {
  businessName: string;
}

export const WhatsAppManagementPage: React.FC<WhatsAppManagementPageProps> = ({
  businessName,
}) => {
  // Sub-Navigation
  const [activeSubTab, setActiveSubTab] = useState<WhatsAppSubTab>('messages');

  // Messages State
  const [messages, setMessages] = useState<WhatsAppMessage[]>(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | MessageDeliveryStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Follow-up Rules Settings State
  const [followUpSettings, setFollowUpSettings] = useState<FollowUpSettings>({
    enabled: true,
    afterSuccessfulCall: true,
    afterMissedCall: true,
    delayMinutes: '5',
    defaultMessage: `Hi {{customer_name}}, thank you for calling ${businessName}! Here is a summary of our conversation and your booking confirmation link: {{link}}. Reply here if you need any additional assistance.`,
  });
  const [saveSettingsNotice, setSaveSettingsNotice] = useState<string | null>(null);

  // Templates State
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(INITIAL_TEMPLATES);
  const [previewTemplate, setPreviewTemplate] = useState<WhatsAppTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'UTILITY' as WhatsAppTemplate['category'],
    content: '',
    language: 'English (en_US)',
  });

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (statusFilter !== 'All' && msg.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = msg.customerName.toLowerCase().includes(q);
        const matchesPhone = msg.customerWhatsAppNumber.toLowerCase().includes(q);
        const matchesCallId = msg.relatedCallId?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesCallId) {
          return false;
        }
      }
      return true;
    });
  }, [messages, statusFilter, searchQuery]);

  // Toggle Customer Opt-in Status
  const handleToggleOptIn = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const updated = !m.optInStatus;
          if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage({ ...selectedMessage, optInStatus: updated });
          }
          return { ...m, optInStatus: updated };
        }
        return m;
      })
    );
  };

  const handleSaveFollowUpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSettingsNotice('WhatsApp follow-up rules updated successfully in workspace state.');
    setTimeout(() => setSaveSettingsNotice(null), 4000);
  };

  const handleSaveNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim() || !templateForm.content.trim()) return;

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                name: templateForm.name.toLowerCase().replace(/\s+/g, '_'),
                category: templateForm.category,
                content: templateForm.content,
                language: templateForm.language,
                lastUpdated: 'Just now',
              }
            : t
        )
      );
      setEditingTemplate(null);
    } else {
      const newTpl: WhatsAppTemplate = {
        id: `TPL-${Date.now().toString().slice(-4)}`,
        name: templateForm.name.toLowerCase().replace(/\s+/g, '_'),
        category: templateForm.category,
        content: templateForm.content,
        metaApprovalStatus: 'Pending Meta Review',
        language: templateForm.language,
        lastUpdated: 'Just now',
      };
      setTemplates([newTpl, ...templates]);
      setIsCreatingTemplate(false);
    }

    setTemplateForm({ name: '', category: 'UTILITY', content: '', language: 'English (en_US)' });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const getStatusBadge = (status: MessageDeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <CheckCheck size={13} />
            Delivered
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
            <Check size={13} />
            Sent
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Clock size={13} />
            Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
            <AlertTriangle size={13} />
            Failed
          </span>
        );
    }
  };

  // If a message is selected, render the 3. Message Details View
  if (selectedMessage) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
        {/* Detail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <button
              type="button"
              onClick={() => setSelectedMessage(null)}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer mb-2 focus:outline-none"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Back to WhatsApp Message History</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <MessageCircle size={26} className="text-emerald-400" />
                <span>Message: {selectedMessage.id}</span>
              </h1>
              {getStatusBadge(selectedMessage.status)}
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">
              Sample Demo WhatsApp Message
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedMessage(null)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Close Details
          </button>
        </div>

        {/* Customer Information & Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Customer Name</span>
            <span className="text-white font-semibold text-sm block">
              {selectedMessage.customerName}
            </span>
            <span className="text-slate-400 text-xs mt-0.5 block font-mono">
              {selectedMessage.customerWhatsAppNumber}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Date & Time</span>
            <span className="text-slate-200 font-medium text-xs block">
              {selectedMessage.dateTime}
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">Automated Dispatch</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-1">Related Call Session</span>
            <span className="text-blue-400 font-mono font-medium text-xs block">
              {selectedMessage.relatedCallId || 'No linked call'}
            </span>
            <span className="text-slate-500 text-[11px] mt-0.5 block">Post-Call Trigger</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-slate-500 block text-[11px] mb-1">Opt-in Consent</span>
              <span
                className={`text-xs font-semibold ${
                  selectedMessage.optInStatus ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {selectedMessage.optInStatus ? 'Verified Opt-In' : 'Unconfirmed Opt-In'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleOptIn(selectedMessage.id)}
              className="text-[10px] text-blue-400 hover:text-blue-300 underline mt-2 text-left cursor-pointer"
            >
              Toggle Consent Status
            </button>
          </div>
        </div>

        {/* Failure Error Details (if applicable) */}
        {selectedMessage.errorDetails && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <AlertTriangle size={16} />
              <span>Delivery Failure Diagnostic</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {selectedMessage.errorDetails}
            </p>
          </div>
        )}

        {/* Full Message Content (WhatsApp Chat Bubble Preview) */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-7 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-400" />
              <span>Full WhatsApp Message Payload</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">256-bit End-to-End Format</span>
          </div>

          {/* WhatsApp Chat Bubble Display */}
          <div className="p-4 sm:p-6 rounded-xl bg-[#0b141a] border border-slate-800/80 max-w-xl mx-auto my-2">
            <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#005c4b] text-white text-xs sm:text-sm shadow-md space-y-2">
              <p className="leading-relaxed whitespace-pre-wrap">{selectedMessage.messageContent}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 font-mono">
                <span>{selectedMessage.dateTime.split('·')[1]?.trim() || '11:43 AM'}</span>
                {selectedMessage.status === 'Delivered' && <CheckCheck size={14} className="text-cyan-300" />}
                {selectedMessage.status === 'Sent' && <Check size={14} />}
                {selectedMessage.status === 'Pending' && <Clock size={12} />}
                {selectedMessage.status === 'Failed' && <AlertTriangle size={12} className="text-rose-300" />}
              </div>
            </div>
          </div>
        </div>

        {/* Related Call Summary */}
        {selectedMessage.relatedCallSummary && (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <PhoneCall size={16} className="text-blue-400" />
              <span>Associated Inbound Call Summary ({selectedMessage.relatedCallId})</span>
            </div>
            <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 leading-relaxed">
              {selectedMessage.relatedCallSummary}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-slate-100">
      {/* Page Heading & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <MessageCircle size={28} className="text-emerald-400" />
              <span>WhatsApp Management</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Business API Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automate post-call follow-ups, message templates, customer notifications, and Meta compliance for {businessName}.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 self-start sm:self-auto">
          Sample Demo Data Only
        </span>
      </div>

      {/* 1. SECTION: WhatsApp Dashboard Summary Cards */}
      <section aria-label="WhatsApp Summary">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Messages */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Messages</span>
              <MessageCircle size={16} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                1,024
              </span>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">Post-call automated</p>
            </div>
          </div>

          {/* Sent Messages */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Sent Messages</span>
              <Send size={16} className="text-blue-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                986
              </span>
              <p className="text-[11px] text-blue-400 mt-1 font-medium">Dispatched via Cloud API</p>
            </div>
          </div>

          {/* Delivered Messages */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Delivered</span>
              <CheckCheck size={16} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                962
              </span>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">97.6% read & delivered</p>
            </div>
          </div>

          {/* Failed Messages */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Failed</span>
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                24
              </span>
              <p className="text-[11px] text-rose-400 mt-1 font-medium">Invalid or unregistered</p>
            </div>
          </div>

          {/* Pending Messages */}
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Pending Queue</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                14
              </span>
              <p className="text-[11px] text-amber-400 mt-1 font-medium">In follow-up delay timer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-slate-800/80 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'messages', label: 'Message History', icon: MessageCircle, count: messages.length },
            { id: 'followup_rules', label: 'Follow-up Rules', icon: Settings },
            { id: 'templates', label: 'Message Templates', icon: FileText, count: templates.length },
            { id: 'compliance', label: 'Consent & Compliance', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as WhatsAppSubTab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: Message History */}
      {activeSubTab === 'messages' && (
        <div className="space-y-4">
          {/* Search & Status Filters */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="w-full md:w-80 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, number, or call ID..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="w-full md:w-auto flex flex-wrap items-center gap-1.5">
              {(['All', 'Delivered', 'Sent', 'Failed', 'Pending'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List / Table */}
          {filteredMessages.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-12 text-center flex flex-col items-center">
              <MessageCircle size={36} className="text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No WhatsApp Messages Found</h3>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">
                No dispatched messages match your active search and status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-xl">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">Customer & Number</th>
                      <th scope="col" className="px-5 py-3.5">Linked Call</th>
                      <th scope="col" className="px-5 py-3.5">Message Preview</th>
                      <th scope="col" className="px-5 py-3.5">Timestamp</th>
                      <th scope="col" className="px-5 py-3.5">Status</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-semibold text-white text-xs sm:text-sm block">
                            {msg.customerName}
                          </span>
                          <span className="font-mono text-slate-400 text-xs block">
                            {msg.customerWhatsAppNumber}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs text-blue-400 font-medium">
                            {msg.relatedCallId || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-300 line-clamp-1 max-w-xs">
                            {msg.messageContent}
                          </p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400">
                          {msg.dateTime}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {getStatusBadge(msg.status)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(msg);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-slate-800/60">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className="p-4 flex flex-col gap-2 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white text-sm block">
                          {msg.customerName}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {msg.customerWhatsAppNumber}
                        </span>
                      </div>
                      {getStatusBadge(msg.status)}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{msg.messageContent}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
                      <span>{msg.dateTime}</span>
                      <span className="text-blue-400 font-mono">{msg.relatedCallId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: Follow-up Rules */}
      {activeSubTab === 'followup_rules' && (
        <form
          onSubmit={handleSaveFollowUpSettings}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-emerald-400" />
                <span>Automated Post-Call WhatsApp Follow-up Rules</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure immediate automated messaging triggers whenever customer calls conclude.
              </p>
            </div>
          </div>

          {saveSettingsNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{saveSettingsNotice}</span>
            </motion.div>
          )}

          {/* Master Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white block">
                Enable WhatsApp Post-Call Follow-ups
              </span>
              <span className="text-xs text-slate-400">
                Master switch for automated message dispatch upon call termination.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={followUpSettings.enabled}
                onChange={(e) =>
                  setFollowUpSettings({ ...followUpSettings, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Trigger Conditions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Trigger Conditions
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={followUpSettings.afterSuccessfulCall}
                  onChange={(e) =>
                    setFollowUpSettings({
                      ...followUpSettings,
                      afterSuccessfulCall: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600"
                />
                <div className="text-left">
                  <span className="text-xs font-semibold text-white block">
                    After Successful Call
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sends booking details, links, or meeting notes right after AI call ends.
                  </span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={followUpSettings.afterMissedCall}
                  onChange={(e) =>
                    setFollowUpSettings({
                      ...followUpSettings,
                      afterMissedCall: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600"
                />
                <div className="text-left">
                  <span className="text-xs font-semibold text-white block">
                    After Missed Call
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Instantly notifies the caller on WhatsApp offering quick chat assistance.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Follow-up Delay Selection */}
          <div>
            <label htmlFor="delayMinutes" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
              Follow-up Dispatch Delay
            </label>
            <select
              id="delayMinutes"
              value={followUpSettings.delayMinutes}
              onChange={(e) =>
                setFollowUpSettings({ ...followUpSettings, delayMinutes: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="0">Immediately (0 seconds delay)</option>
              <option value="1">1 minute after call</option>
              <option value="5">5 minutes after call (Recommended)</option>
              <option value="15">15 minutes after call</option>
              <option value="30">30 minutes after call</option>
              <option value="60">1 hour after call</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Slight delays prevent overwhelming customers while their call context is fresh.
            </span>
          </div>

          {/* Default Follow-up Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="defaultMessage" className="block text-xs sm:text-sm font-medium text-slate-300">
                Default Follow-up Message Template
              </label>
              <span className="text-[11px] text-slate-500">Variables: {'{{customer_name}}'}, {'{{link}}'}</span>
            </div>
            <textarea
              id="defaultMessage"
              rows={4}
              value={followUpSettings.defaultMessage}
              onChange={(e) =>
                setFollowUpSettings({ ...followUpSettings, defaultMessage: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs sm:text-sm outline-none resize-y focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save size={15} />
              <span>Save Follow-up Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-VIEW 3: Message Templates */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-emerald-400" />
                <span>WhatsApp Message Templates</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage pre-approved WhatsApp Business message templates for outbound notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingTemplate(null);
                setTemplateForm({ name: '', category: 'UTILITY', content: '', language: 'English (en_US)' });
                setIsCreatingTemplate(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Create Template</span>
            </button>
          </div>

          {/* Meta Approval Advisory */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-2.5">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Meta WhatsApp Policy Notice:</strong> Business-initiated messages sent outside the customer service 24-hour window must use templates approved by Meta. Variables like <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">{'{{1}}'}</code> represent dynamic content.
            </span>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 flex flex-col justify-between shadow-xl space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {tpl.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        tpl.metaApprovalStatus === 'Meta Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : tpl.metaApprovalStatus === 'Pending Meta Review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tpl.metaApprovalStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-mono mb-2 truncate" title={tpl.name}>
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed line-clamp-3">
                    {tpl.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Preview Template"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setTemplateForm({
                          name: tpl.name,
                          category: tpl.category,
                          content: tpl.content,
                          language: tpl.language,
                        });
                        setIsCreatingTemplate(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Edit Template"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Template"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{tpl.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Customer Consent and Compliance */}
      {activeSubTab === 'compliance' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl">
          <div className="pb-3 border-b border-slate-800/80">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span>Customer Consent & WhatsApp Policy Compliance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guidelines and opt-in enforcement for business-initiated communication via Meta WhatsApp Cloud API.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            {/* Rule 1 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                1. Explicit Opt-in Requirement
              </span>
              <p className="text-slate-400 leading-relaxed text-xs">
                Businesses must receive explicit opt-in from customers before sending proactive WhatsApp messages. Opt-in can be obtained through website forms, IVR keypress during the call, or verbal consent recorded by the AI agent.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                2. 24-Hour Customer Service Window
              </span>
              <p className="text-slate-400 leading-relaxed text-xs">
                Free-form conversational messages may only be sent within 24 hours of the customer&apos;s last inbound message. Outside this window, only Meta-approved message templates (Utility, Authentication, or Marketing) may be sent.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                3. Mandatory Opt-Out Instructions
              </span>
              <p className="text-slate-400 leading-relaxed text-xs">
                Every follow-up message must respect user choice. Customers can reply with keywords such as <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">STOP</code> to opt out of future automatic WhatsApp updates.
              </p>
            </div>
          </div>

          {/* Customer Opt-in Directory Table */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Customer Opt-In Status Management ({messages.length} Recorded Contacts)
            </h3>
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-[11px] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Contact</th>
                    <th className="px-4 py-2.5">WhatsApp Number</th>
                    <th className="px-4 py-2.5">Consent Status</th>
                    <th className="px-4 py-2.5 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {messages.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2.5 font-medium text-white">{m.customerName}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">{m.customerWhatsAppNumber}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[11px] font-semibold ${
                            m.optInStatus ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {m.optInStatus ? 'Opted In' : 'Not Opted In'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleOptIn(m.id)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                        >
                          Switch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Create / Edit Template Modal */}
      {isCreatingTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingTemplate ? 'Edit WhatsApp Template' : 'Create New WhatsApp Template'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingTemplate(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Template Identifier Name (lowercase, no spaces)
                </label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g. post_call_feedback_request"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Template Category</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        category: e.target.value as WhatsAppTemplate['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="UTILITY">Utility</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Language</label>
                  <select
                    value={templateForm.language}
                    onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="English (en_US)">English (en_US)</option>
                    <option value="Spanish (es_ES)">Spanish (es_ES)</option>
                    <option value="Hindi (hi_IN)">Hindi (hi_IN)</option>
                    <option value="French (fr_FR)">French (fr_FR)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-300">Message Content</label>
                  <span className="text-[10px] text-slate-500">Variables: {'{{1}}'}, {'{{2}}'}</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                  placeholder="Hi {{1}}, thank you for speaking with {{2}}. Your reference link is {{3}}."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none resize-y focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreatingTemplate(false)}
                  className="px-4 py-2 rounded-xl font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  {editingTemplate ? 'Update Template' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Template Preview Modal */}
      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{previewTemplate.name}</h3>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {previewTemplate.category} · {previewTemplate.metaApprovalStatus}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="p-4 rounded-xl bg-[#0b141a] border border-slate-800 mb-4">
              <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#005c4b] text-white text-xs shadow-md space-y-1.5">
                <p className="leading-relaxed whitespace-pre-wrap">{previewTemplate.content}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 font-mono">
                  <span>12:00 PM</span>
                  <CheckCheck size={13} className="text-cyan-300" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mb-4">
              Variable tags such as {'{{1}}'} are populated with real customer details upon delivery.
            </p>

            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
