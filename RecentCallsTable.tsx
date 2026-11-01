/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Clock, Calendar, CheckCircle2, PhoneForwarded, XCircle, Eye, X } from 'lucide-react';

export interface RecentCallRecord {
  id: string;
  phoneNumber: string;
  customerName?: string;
  dateTime: string;
  duration: string;
  status: 'Handled by AI' | 'Human Transferred' | 'Failed';
  summary: string;
  transcriptSnippet: string;
}

const SAMPLE_RECENT_CALLS: RecentCallRecord[] = [
  {
    id: 'call-01',
    phoneNumber: '+1 (555) 234-8901',
    customerName: 'Sarah Jenkins',
    dateTime: 'Nov 1, 2026 · 10:42 AM',
    duration: '2m 45s',
    status: 'Handled by AI',
    summary: 'Customer scheduled a demo consultation for enterprise fleet management.',
    transcriptSnippet: 'AI: "Thank you for calling UNIQ AI. How can I assist you?" Customer: "I would like to book a meeting for tomorrow at 2 PM."',
  },
  {
    id: 'call-02',
    phoneNumber: '+1 (555) 789-4321',
    customerName: 'David Chen',
    dateTime: 'Nov 1, 2026 · 09:15 AM',
    duration: '4m 12s',
    status: 'Human Transferred',
    summary: 'Technical inquiry regarding custom API webhooks transferred to Tier 2 support.',
    transcriptSnippet: 'AI: "Let me connect you directly to our lead integration engineer. Transferring now."',
  },
  {
    id: 'call-03',
    phoneNumber: '+1 (555) 456-1122',
    customerName: 'Elena Rostova',
    dateTime: 'Nov 1, 2026 · 08:30 AM',
    duration: '1m 20s',
    status: 'Handled by AI',
    summary: 'Provided business operating hours and store location details.',
    transcriptSnippet: 'AI: "We are located at 450 Innovation Parkway, open Monday through Friday from 8 AM to 7 PM."',
  },
  {
    id: 'call-04',
    phoneNumber: '+1 (555) 987-6543',
    customerName: 'Unknown Caller',
    dateTime: 'Oct 31, 2026 · 06:14 PM',
    duration: '0m 18s',
    status: 'Failed',
    summary: 'Call disconnected before audio stream initialized. Network packet drop.',
    transcriptSnippet: 'Call dropped due to customer carrier disconnection.',
  },
  {
    id: 'call-05',
    phoneNumber: '+1 (555) 345-6789',
    customerName: 'Marcus Miller',
    dateTime: 'Oct 31, 2026 · 04:55 PM',
    duration: '3m 05s',
    status: 'Handled by AI',
    summary: 'FAQ inquiry regarding subscription renewal options resolved automatically.',
    transcriptSnippet: 'AI: "Your plan renewal is set for the 15th of each month with automatic invoice generation."',
  },
];

export const RecentCallsTable: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<RecentCallRecord | null>(null);

  const getStatusBadge = (status: RecentCallRecord['status']) => {
    switch (status) {
      case 'Handled by AI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            {status}
          </span>
        );
      case 'Human Transferred':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PhoneForwarded size={12} />
            {status}
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3">Customer Phone</th>
              <th scope="col" className="px-4 py-3">Date & Time</th>
              <th scope="col" className="px-4 py-3">Duration</th>
              <th scope="col" className="px-4 py-3">Call Status</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-normal">
            {SAMPLE_RECENT_CALLS.map((call) => (
              <tr key={call.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2 font-mono text-white text-xs sm:text-sm">
                    <Phone size={14} className="text-slate-500" />
                    <span>{call.phoneNumber}</span>
                  </div>
                  {call.customerName && (
                    <span className="text-[11px] text-slate-400 block pl-5">
                      {call.customerName}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-300 text-xs">
                  {call.dateTime}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-slate-300">
                  {call.duration}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getStatusBadge(call.status)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedCall(call)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 transition-colors cursor-pointer"
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
        {SAMPLE_RECENT_CALLS.map((call) => (
          <div key={call.id} className="p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm text-white font-medium">
                {call.phoneNumber}
              </span>
              {getStatusBadge(call.status)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {call.dateTime}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock size={12} />
                {call.duration}
              </span>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setSelectedCall(call)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 active:bg-blue-500/20 transition-colors"
              >
                <Eye size={13} />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call Details Modal */}
      {selectedCall && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Phone size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Call Details</h3>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {selectedCall.id} (Sample)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">Caller</span>
                  <span className="font-mono text-white text-xs font-medium">{selectedCall.phoneNumber}</span>
                  {selectedCall.customerName && (
                    <span className="text-slate-400 block text-[11px]">{selectedCall.customerName}</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Duration</span>
                  <span className="font-mono text-white text-xs font-medium">{selectedCall.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedCall.status)}</div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Timestamp</span>
                  <span className="text-slate-300 text-xs">{selectedCall.dateTime}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">AI Executive Summary</span>
                <p className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-300 leading-relaxed text-xs">
                  {selectedCall.summary}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Transcript Snippet</span>
                <p className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400 italic text-xs leading-relaxed">
                  {selectedCall.transcriptSnippet}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCall(null)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
