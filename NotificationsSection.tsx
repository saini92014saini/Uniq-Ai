/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  PhoneIncoming,
  Bot,
  Coins,
  ShieldAlert,
  CheckCheck,
  Check,
  Trash2,
  Filter,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export type NotificationCategory = 'all' | 'calls' | 'agent' | 'credits' | 'system';

export interface NotificationItem {
  id: string;
  category: 'calls' | 'agent' | 'credits' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'high' | 'normal';
  actionLabel?: string;
}

interface NotificationsSectionProps {
  onShowToast: (msg: string) => void;
  onBackToOverview: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'calls',
    title: 'Human Escalation Triggered on Call #9084',
    message:
      'Customer requested complex contract pricing. AI smoothly transferred call to +91 98765 43210 with call context.',
    timestamp: '15 mins ago',
    read: false,
    priority: 'high',
    actionLabel: 'View Call Record',
  },
  {
    id: 'notif-2',
    category: 'agent',
    title: 'AI Agent "Sales Concierge v2" Activated',
    message:
      'Agent voice model updated to ElevenLabs British Female (Rachel) with custom greeting.',
    timestamp: '1 hour ago',
    read: false,
    priority: 'normal',
  },
  {
    id: 'notif-3',
    category: 'credits',
    title: 'Credit Usage Alert: Balance at 2,850 Credits',
    message:
      'You have consumed 2,150 credits this billing cycle. Available balance will support approx 142 conversational minutes.',
    timestamp: '3 hours ago',
    read: false,
    priority: 'normal',
    actionLabel: 'Top Up Credits',
  },
  {
    id: 'notif-4',
    category: 'calls',
    title: 'Customer Call Successfully Handled',
    message:
      'Inbound call from +91 98112 34567 answered by Support Bot. Inquiry resolved in 2m 14s.',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 'notif-5',
    category: 'system',
    title: 'Scheduled Telephony Core Maintenance',
    message:
      'SIP server low-latency cluster upgrade scheduled for Sunday, Nov 8 at 02:00 AM IST. Zero call drop expected.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-6',
    category: 'agent',
    title: 'New FAQ Added to Knowledge Base',
    message:
      'FAQ "What are your weekend service emergency contact options?" was indexed and ready for live calls.',
    timestamp: '2 days ago',
    read: true,
  },
];

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  onShowToast,
  onBackToOverview,
}) => {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationCategory>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const unreadCount = items.filter((i) => !i.read).length;

  const handleMarkAsRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    onShowToast('Notification marked as read.');
  };

  const handleMarkAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    onShowToast('All notifications marked as read.');
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onShowToast('Notification removed.');
  };

  const handleClearRead = () => {
    setItems((prev) => prev.filter((item) => !item.read));
    onShowToast('Cleared all read notifications.');
  };

  // Filter items
  const filteredNotifications = items.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesUnread = !unreadOnly || !item.read;
    return matchesCategory && matchesUnread;
  });

  const getCategoryIcon = (cat: NotificationItem['category']) => {
    switch (cat) {
      case 'calls':
        return <PhoneIncoming size={16} className="text-blue-400" />;
      case 'agent':
        return <Bot size={16} className="text-cyan-400" />;
      case 'credits':
        return <Coins size={16} className="text-amber-400" />;
      case 'system':
        return <ShieldAlert size={16} className="text-purple-400" />;
    }
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
          <div className="flex items-center gap-2.5 mt-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Bell className="text-blue-400" size={22} />
              <span>Notifications & Activity Alerts</span>
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of live call escalations, AI voice events, billing thresholds, and system announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-600/80 border border-blue-500/20 cursor-pointer transition-colors"
            >
              <CheckCheck size={14} />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>Clear Read</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'calls', label: 'Calls Alerts' },
            { id: 'agent', label: 'AI Agent Alerts' },
            { id: 'credits', label: 'Credit Alerts' },
            { id: 'system', label: 'System Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as NotificationCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
          />
          <span>Unread only</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-12 text-center text-slate-500 text-xs">
            <Bell size={28} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">No notifications found</p>
            <p className="mt-1">You are all caught up with your business alerts!</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                !item.read
                  ? 'bg-slate-900/80 border-blue-500/30 shadow-lg shadow-blue-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                      {item.priority === 'high' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Priority Alert
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {item.timestamp}
                      </span>
                      <span className="capitalize text-slate-400">Category: {item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
