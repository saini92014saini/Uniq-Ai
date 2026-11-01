/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LifeBuoy,
  HelpCircle,
  MessageSquare,
  PlusCircle,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  PhoneCall,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export interface SupportTicketItem {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Under Review' | 'Resolved';
  createdDate: string;
  lastUpdated: string;
  message: string;
  latestResponse?: string;
}

interface HelpSupportSectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

const FAQS_DATA = [
  {
    category: 'Call Forwarding & SIP',
    question: 'How does call forwarding connect to my AI voice agent?',
    answer:
      'UNIQ AI assigns a virtual SIP trunking endpoint to your business. You simply enable conditional or unconditional call-forwarding (e.g. *21* or **21*) on your mobile or landline carrier (Airtel, Jio, Vodafone, AT&T, Verizon) to the UNIQ AI routing number. When callers dial your business, the AI answers seamlessly.',
  },
  {
    category: 'Call Forwarding & SIP',
    question: 'Can I test call forwarding before taking live customer calls?',
    answer:
      'Yes. Use the "AI Agent Testing" page to simulate conversations directly in your browser. You can also dial your assigned test forwarding number from your own phone to experience the greeting and latency firsthand.',
  },
  {
    category: 'AI Voice & Latency',
    question: 'What is the voice response latency?',
    answer:
      'UNIQ AI utilizes sub-second streaming voice synthesis (typically under 450ms turnaround), powered by Gemini 2.5 Flash and Deepgram/ElevenLabs audio pipelines, ensuring natural back-and-forth speech without awkward pauses.',
  },
  {
    category: 'Human Escalation',
    question: 'How does human transfer work during complex customer questions?',
    answer:
      'If a customer asks a question outside your configured Business FAQs or requests a human representative, the AI politely notifies the caller ("Allow me to connect you to our specialist") and initiates a SIP bridge transfer to your Human Transfer Number.',
  },
  {
    category: 'WhatsApp Follow-ups',
    question: 'When are automated WhatsApp messages sent to callers?',
    answer:
      'Whenever a call ends, if WhatsApp Automation is enabled, the AI generates a post-call summary, appointment confirmation, or brochure link and dispatches it to the caller’s WhatsApp number via Meta Cloud API.',
  },
  {
    category: 'Credits & Billing',
    question: 'How are credits calculated for voice calls and WhatsApp?',
    answer:
      'Voice calls consume credits at approximately 20 credits per conversational minute (calculated in 15-second increments). WhatsApp follow-up messages consume 1 credit per successfully delivered message.',
  },
];

export const HelpSupportSection: React.FC<HelpSupportSectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'help' | 'faqs' | 'tickets' | 'create_ticket'>('help');

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Tickets state
  const [tickets, setTickets] = useState<SupportTicketItem[]>([
    {
      id: 'TICK-9042',
      subject: 'Inquiry regarding custom ElevenLabs voice clone import',
      category: 'Voice Customization',
      priority: 'Normal',
      status: 'In Progress',
      createdDate: 'Nov 1, 2026 · 08:30 AM',
      lastUpdated: 'Nov 1, 2026 · 09:15 AM',
      message: 'Can we upload custom brand voice WAV samples for our hospitality concierge agent?',
      latestResponse:
        'Support Engineer: Custom voice clone training is available on the Enterprise tier. We have activated beta voice sandbox access for your account to test preliminary samples.',
    },
    {
      id: 'TICK-8821',
      subject: 'WhatsApp template approved for order confirmations',
      category: 'WhatsApp Automation',
      priority: 'High',
      status: 'Resolved',
      createdDate: 'Oct 28, 2026 · 02:10 PM',
      lastUpdated: 'Oct 28, 2026 · 04:45 PM',
      message: 'Need help linking our Meta Business Manager ID to enable order confirmation templates.',
      latestResponse:
        'Support Engineer: Your Meta WABA has been successfully verified and template #WA-9921 is now live in production.',
    },
  ]);

  // Create Ticket Form
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Technical Telephony',
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Urgent',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [selectedTicketModal, setSelectedTicketModal] = useState<SupportTicketItem | null>(null);

  // Filtered FAQs
  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory =
      selectedFaqCategory === 'All' || faq.category === selectedFaqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!ticketForm.subject.trim()) {
      errors.subject = 'Please enter a ticket subject.';
    }
    if (!ticketForm.message.trim()) {
      errors.message = 'Please provide details describing your issue or request.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newTicketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicketItem = {
      id: newTicketId,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'Open',
      createdDate: 'Just now',
      lastUpdated: 'Just now',
      message: ticketForm.message,
      latestResponse:
        'Automated Dispatch: Your ticket has been logged and assigned to UNIQ AI Tier-1 Telephony Support. Expected response time: < 2 hours.',
    };

    setTickets([newTicket, ...tickets]);
    setTicketForm({
      subject: '',
      category: 'Technical Telephony',
      priority: 'Normal',
      message: '',
    });
    setFormErrors({});
    setActiveTab('tickets');
    onShowToast(`Support ticket #${newTicketId} created successfully!`);
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
            <LifeBuoy className="text-blue-400" size={22} />
            <span>Help & Support Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Knowledge base guides, frequently asked questions, customer support dispatch, and in-app ticketing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('create_ticket')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <PlusCircle size={14} />
          <span>Create Support Ticket</span>
        </button>
      </div>

      {/* Sub navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'help', label: 'Help Center', icon: BookOpen },
          { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
          { id: 'tickets', label: `My Support Requests (${tickets.length})`, icon: FileText },
          { id: 'create_ticket', label: 'New Ticket', icon: PlusCircle },
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

      {/* 1. Help Center Knowledge Base Cards */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Carrier Call Forwarding Guide',
                desc: 'Step-by-step MMI dialing codes (*21*, *61*) for Airtel, Jio, Vi, and US telecom carriers to forward calls to your AI virtual line.',
                tag: 'Telephony Setup',
                icon: PhoneCall,
              },
              {
                title: 'AI Prompt Engineering & FAQs',
                desc: 'Best practices for structuring business FAQs, product descriptions, and human fallback thresholds to maximize first-call resolution.',
                tag: 'Agent Tuning',
                icon: Sparkles,
              },
              {
                title: 'WhatsApp Meta WABA Integration',
                desc: 'How to register approved message templates and handle automatic post-call follow-ups with customer consent compliance.',
                tag: 'WhatsApp API',
                icon: MessageSquare,
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{card.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('faqs');
                        onShowToast(`Viewing documentation for: ${card.title}`);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Guide & FAQs</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Contact Support Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900/40 border border-blue-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LifeBuoy size={18} className="text-blue-400" />
                Need Personalized Technical Assistance?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Our in-app engineering team handles carrier interconnects, custom voice training, and webhook integrations with dedicated SLA responses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('create_ticket')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg cursor-pointer transition-colors shrink-0"
            >
              Open Support Request
            </button>
          </div>
        </div>
      )}

      {/* 2. FAQs Section */}
      {activeTab === 'faqs' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-400" />
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Answers to common queries regarding call forwarding, AI conversational flow, and billing.
              </p>
            </div>

            {/* Search FAQ */}
            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800/60">
            {['All', 'Call Forwarding & SIP', 'AI Voice & Latency', 'Human Escalation', 'WhatsApp Follow-ups', 'Credits & Billing'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFaqCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    selectedFaqCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No FAQs found matching &quot;{faqSearch}&quot;.
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">{faq.question}</span>
                      <div className="p-1 rounded-lg text-slate-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. View Support Requests */}
      {activeTab === 'tickets' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                Support Ticket Requests
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track status updates and technician correspondence on your submitted issues.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('create_ticket')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600/80 border border-blue-500/20 cursor-pointer self-start sm:self-auto transition-colors"
            >
              <PlusCircle size={13} />
              <span>Submit New Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketModal(t)}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-white">{t.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-blue-400 font-medium">{t.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : t.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-500/10 text-rose-400'
                          : t.priority === 'High'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t.priority} Priority
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white">{t.subject}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{t.message}</p>

                {t.latestResponse && (
                  <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-200">
                    <span className="font-semibold block text-blue-300 mb-0.5">Latest Update:</span>
                    {t.latestResponse}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Created: {t.createdDate}</span>
                  <span>Last Updated: {t.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Create Support Ticket Tab */}
      {activeTab === 'create_ticket' && (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <PlusCircle size={16} className="text-blue-400" />
              Submit a Support Ticket
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Describe your technical inquiry or bug. A platform specialist will investigate and respond.
            </p>
          </div>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Technical Telephony">Technical Telephony & SIP</option>
                  <option value="AI Voice Customization">AI Voice & Prompt Tuning</option>
                  <option value="WhatsApp Automation">WhatsApp Automation</option>
                  <option value="Billing & Credits">Billing & Credits</option>
                  <option value="Account & Security">Account & Security</option>
                  <option value="Feature Request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Priority <span className="text-rose-400">*</span>
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      priority: e.target.value as 'Low' | 'Normal' | 'High' | 'Urgent',
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Normal">Normal - Standard Issue</option>
                  <option value="High">High - Production Impact</option>
                  <option value="Urgent">Urgent - Telephony Outage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Subject <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => {
                  setTicketForm({ ...ticketForm, subject: e.target.value });
                  if (formErrors.subject) setFormErrors({ ...formErrors, subject: '' });
                }}
                placeholder="Brief summary of your inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              {formErrors.subject && (
                <span className="text-[11px] text-rose-400 block mt-1">{formErrors.subject}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Detailed Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={ticketForm.message}
                onChange={(e) => {
                  setTicketForm({ ...ticketForm, message: e.target.value });
                  if (formErrors.message) setFormErrors({ ...formErrors, message: '' });
                }}
                placeholder="Include relevant details such as call IDs, agent names, or carrier forwarding symptoms..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              {formErrors.message && (
                <span className="text-[11px] text-rose-400 block mt-1">{formErrors.message}</span>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                <Send size={13} />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Details Modal */}
      <AnimatePresence>
        {selectedTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {selectedTicketModal.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedTicketModal.subject}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTicketModal(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {selectedTicketModal.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {selectedTicketModal.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {selectedTicketModal.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Your Message:</span>
                  <p className="text-slate-200 leading-relaxed">{selectedTicketModal.message}</p>
                </div>

                {selectedTicketModal.latestResponse && (
                  <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/25">
                    <span className="text-[11px] text-blue-400 font-semibold block mb-1">
                      Support Staff Response:
                    </span>
                    <p className="text-blue-100 leading-relaxed">
                      {selectedTicketModal.latestResponse}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTicketModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
