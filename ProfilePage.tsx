/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Building2,
  Mail,
  Phone,
  Shield,
  CreditCard,
  Coins,
  Sparkles,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  FileText,
  Lock,
  Bell,
  LogOut,
  Edit3,
  Camera,
  Globe,
  MapPin,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  RefreshCw,
  Receipt,
  Zap,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  LifeBuoy,
  MessageSquare,
  KeyRound,
  ExternalLink,
  Sliders,
  Check,
  MessageSquareHeart,
  Info,
} from 'lucide-react';
import type { BusinessProfileData } from '../../types/navigation.ts';
import { SettingsSection } from './SettingsSection.tsx';
import { PrivacySecuritySection } from './PrivacySecuritySection.tsx';
import { HelpSupportSection } from './HelpSupportSection.tsx';
import { NotificationsSection } from './NotificationsSection.tsx';
import { FeedbackSection } from './FeedbackSection.tsx';
import { AboutSection } from './AboutSection.tsx';

export type ProfileSectionTab =
  | 'overview'
  | 'business'
  | 'wallet'
  | 'plans'
  | 'transactions'
  | 'support'
  | 'settings'
  | 'privacy'
  | 'help'
  | 'notifications'
  | 'feedback'
  | 'about';

export interface UserAccountData {
  fullName: string;
  email: string;
  mobile: string;
  photoUrl: string | null;
  role: string;
  joinedDate: string;
}

export interface CreditTransaction {
  id: string;
  date: string;
  type: 'Credit Purchase' | 'Call Usage' | 'WhatsApp Broadcast' | 'Plan Renewal';
  category: 'purchase' | 'usage' | 'payment';
  amount: string;
  credits: string;
  isCreditAddition: boolean;
  status: 'Completed' | 'Pending' | 'Failed';
  reference: string;
}

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  includedCredits: string;
  agentsLimit: string;
  features: string[];
  isCurrent: boolean;
  isPopular?: boolean;
}

export interface SupportFAQ {
  question: string;
  answer: string;
  category: string;
}

interface ProfilePageProps {
  businessName: string;
  initialProfileData?: BusinessProfileData | null;
  initialSubTab?: ProfileSectionTab;
  onLogout: () => void;
  onNavigateToDashboard?: () => void;
}

const BUSINESS_CATEGORIES = [
  'Retail',
  'Restaurant & Food',
  'Healthcare',
  'Education',
  'Real Estate',
  'Travel & Tourism',
  'Professional Services',
  'E-commerce',
  'Other',
];

const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'TXN-9042',
    date: 'Nov 1, 2026 · 10:15 AM',
    type: 'Credit Purchase',
    category: 'purchase',
    amount: '$49.00 (Demo)',
    credits: '+3,000 Credits',
    isCreditAddition: true,
    status: 'Completed',
    reference: 'Pro Growth Pack',
  },
  {
    id: 'TXN-9038',
    date: 'Oct 31, 2026 · 04:42 PM',
    type: 'Call Usage',
    category: 'usage',
    amount: '$0.00',
    credits: '-148 Credits',
    isCreditAddition: false,
    status: 'Completed',
    reference: '12 Inbound AI Calls',
  },
  {
    id: 'TXN-9025',
    date: 'Oct 29, 2026 · 02:20 PM',
    type: 'WhatsApp Broadcast',
    category: 'usage',
    amount: '$0.00',
    credits: '-52 Credits',
    isCreditAddition: false,
    status: 'Completed',
    reference: '52 Post-Call Summaries',
  },
  {
    id: 'TXN-9011',
    date: 'Oct 20, 2026 · 09:00 AM',
    type: 'Plan Renewal',
    category: 'payment',
    amount: '$199.00 (Demo)',
    credits: '+15,000 Credits',
    isCreditAddition: true,
    status: 'Completed',
    reference: 'Business Plan - Monthly Cycle',
  },
  {
    id: 'TXN-8980',
    date: 'Oct 15, 2026 · 11:10 AM',
    type: 'Call Usage',
    category: 'usage',
    amount: '$0.00',
    credits: '-95 Credits',
    isCreditAddition: false,
    status: 'Completed',
    reference: '8 Inbound AI Calls',
  },
  {
    id: 'TXN-8940',
    date: 'Oct 01, 2026 · 08:30 AM',
    type: 'Credit Purchase',
    category: 'purchase',
    amount: '$19.00 (Demo)',
    credits: '+1,000 Credits',
    isCreditAddition: true,
    status: 'Completed',
    reference: 'Starter Top-up Pack',
  },
];

const SUBSCRIPTION_PLANS: SubscriptionPlanItem[] = [
  {
    id: 'plan_free',
    name: 'Free Trial',
    priceMonthly: '$0',
    priceAnnual: '$0',
    includedCredits: '100 Credits',
    agentsLimit: '1 AI Voice Agent',
    features: [
      '100 initial welcome credits',
      '1 AI Voice Agent with standard voice',
      'Basic call logs & duration',
      'Email support assistance',
      'Demo numbers & testing suite',
    ],
    isCurrent: false,
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    priceMonthly: '$29',
    priceAnnual: '$24',
    includedCredits: '1,500 Credits/mo',
    agentsLimit: '2 AI Voice Agents',
    features: [
      '1,500 monthly conversation credits',
      'Up to 2 concurrent AI Agents',
      'Neural multilingual voice synthesis',
      'Twilio / SIP trunk forward support',
      'WhatsApp post-call follow-ups',
      'Standard business hours support',
    ],
    isCurrent: false,
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    priceMonthly: '$79',
    priceAnnual: '$64',
    includedCredits: '5,000 Credits/mo',
    agentsLimit: '5 AI Voice Agents',
    features: [
      '5,000 monthly conversation credits',
      '5 AI Voice Agents with custom knowledge RAG',
      'Ultra-HD neural human voices',
      'Automated WhatsApp templates & follow-ups',
      'Human transfer escalation logic',
      'Priority email & chat support',
    ],
    isCurrent: false,
    isPopular: true,
  },
  {
    id: 'plan_business',
    name: 'Business Pro',
    priceMonthly: '$199',
    priceAnnual: '$159',
    includedCredits: '15,000 Credits/mo',
    agentsLimit: 'Unlimited AI Agents',
    features: [
      '15,000 monthly conversation credits',
      'Unlimited AI Voice Agents',
      'Sub-second ultra low latency stream',
      'Custom voice clone training (ElevenLabs / Deepgram)',
      'Direct CRM integration & webhooks',
      'Dedicated account manager & SLA support',
    ],
    isCurrent: true,
  },
];

const FAQS_LIST: SupportFAQ[] = [
  {
    category: 'AI Voice Calling',
    question: 'How does UNIQ AI answer business calls?',
    answer:
      'UNIQ AI operates via carrier call-forwarding. You set up unconditional or conditional call forwarding from your existing business phone number to your assigned UNIQ AI virtual SIP number. When a customer dials your business, the call connects to your AI agent instantly with conversational natural speech.',
  },
  {
    category: 'Billing & Credits',
    question: 'How are credits deducted during voice calls and WhatsApp?',
    answer:
      'Voice calls consume credits at approximately 20 credits per conversational minute. WhatsApp post-call follow-up messages consume 1 credit per delivered message. Credit balances roll over based on your active subscription tier.',
  },
  {
    category: 'Human Escalation',
    question: 'What happens if a customer asks something the AI does not know?',
    answer:
      'When an unknown query or custom escalation condition triggers, the AI smoothly informs the caller and transfers the call to your configured human fallback transfer number, passing the real-time context to your human team.',
  },
  {
    category: 'WhatsApp Compliance',
    question: 'Are WhatsApp automated follow-ups compliant with Meta policies?',
    answer:
      'Yes. All messages sent outside of customer-initiated windows must use Meta-approved WhatsApp Message Templates. Customers must have provided consent, and opt-out commands like STOP are strictly honored automatically.',
  },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  businessName: initialBusinessName,
  initialProfileData,
  initialSubTab,
  onLogout,
  onNavigateToDashboard,
}) => {
  // Navigation sub-tab
  const [activeSubTab, setActiveSubTab] = useState<ProfileSectionTab>(initialSubTab || 'overview');

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // User Account State
  const [userData, setUserData] = useState<UserAccountData>({
    fullName: 'Rahul Saini',
    email: 'rahul.saini@acmeglobal.com',
    mobile: '+91 98765 43210',
    photoUrl: null,
    role: 'Owner & Admin',
    joinedDate: 'October 2026',
  });

  // Business Profile State
  const [businessData, setBusinessData] = useState({
    businessName: initialBusinessName || 'Acme Global Inc.',
    category: initialProfileData?.category || 'Professional Services',
    description:
      initialProfileData?.description ||
      'Leading provider of enterprise customer engagement solutions and autonomous conversational AI voice telephony.',
    address:
      initialProfileData?.address ||
      '450 Innovation Parkway, Suite 300, Bangalore, Karnataka 560103, India',
    website: initialProfileData?.website || 'https://acmeglobal.example.com',
    logoUrl: initialProfileData?.logoUrl || null,
  });

  // Wallet State
  const [availableCredits, setAvailableCredits] = useState<number>(2850);
  const [usedCredits] = useState<number>(2150);
  const totalLimit = 5000;

  // Modals
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditBusinessModalOpen, setIsEditBusinessModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isContactSupportModalOpen, setIsContactSupportModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedPlanModal, setSelectedPlanModal] = useState<SubscriptionPlanItem | null>(null);

  // Filter & Search states
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'purchase' | 'usage' | 'payment'>('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  // Notification Preferences State
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailAlerts: true,
    smsCallTransfer: true,
    whatsappAlerts: true,
    lowCreditsWarning: true,
    weeklyDigest: false,
    productUpdates: true,
  });

  // Temporary edit form states
  const [userEditForm, setUserEditForm] = useState({ ...userData });
  const [userEditErrors, setUserEditErrors] = useState<{ [key: string]: string }>({});

  const [businessEditForm, setBusinessEditForm] = useState({ ...businessData });
  const [businessEditErrors, setBusinessEditErrors] = useState<{ [key: string]: string }>({});

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Support ticket form state
  const [supportTicketForm, setSupportTicketForm] = useState({
    subject: '',
    category: 'Technical Telephony',
    priority: 'Normal',
    message: '',
  });
  const [supportTicketSuccess, setSupportTicketSuccess] = useState<string | null>(null);

  // Success banners
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // User details save handler
  const handleSaveUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!userEditForm.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!userEditForm.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEditForm.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!userEditForm.mobile.trim()) errors.mobile = 'Mobile number is required.';

    if (Object.keys(errors).length > 0) {
      setUserEditErrors(errors);
      return;
    }

    setUserData({ ...userEditForm });
    setIsEditUserModalOpen(false);
    showToast('Personal account details saved successfully!');
  };

  // Business profile save handler
  const handleSaveBusinessProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!businessEditForm.businessName.trim()) errors.businessName = 'Business name is required.';
    if (!businessEditForm.description.trim()) errors.description = 'Business description is required.';
    if (!businessEditForm.address.trim()) errors.address = 'Business address is required.';

    if (Object.keys(errors).length > 0) {
      setBusinessEditErrors(errors);
      return;
    }

    setBusinessData({ ...businessEditForm });
    setIsEditBusinessModalOpen(false);
    showToast('Business profile updated successfully!');
  };

  // Demo credits purchase
  const handleBuyDemoCredits = (amount: number, packageName: string) => {
    setAvailableCredits((prev) => prev + amount);
    setIsBuyCreditsModalOpen(false);
    showToast(`Demo: ${amount.toLocaleString()} credits added via ${packageName}!`);
  };

  // Demo password change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordFeedback(null);

    if (!passwordForm.currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordFeedback('Demo: Password updated successfully (frontend simulated).');
    setTimeout(() => {
      setIsChangePasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordFeedback(null);
      showToast('Account password changed successfully (demo placeholder)!');
    }, 1500);
  };

  // Support ticket submit
  const handleSupportTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportTicketForm.subject.trim() || !supportTicketForm.message.trim()) {
      return;
    }
    const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    setSupportTicketSuccess(`Support request #${ticketId} submitted! Our team will respond shortly.`);
    setTimeout(() => {
      setIsContactSupportModalOpen(false);
      setSupportTicketSuccess(null);
      setSupportTicketForm({
        subject: '',
        category: 'Technical Telephony',
        priority: 'Normal',
        message: '',
      });
      showToast(`Support ticket created with ID ${ticketId} (Demo)`);
    }, 2000);
  };

  // Filtered transactions
  const filteredTransactions = INITIAL_TRANSACTIONS.filter((t) => {
    const matchesCategory = transactionFilter === 'all' || t.category === transactionFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.type.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.reference.toLowerCase().includes(transactionSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Profile Home Menu Items (10 compact, clearly separated sections)
  const profileMenuItems: {
    id: ProfileSectionTab | 'logout';
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconBg: string;
    iconColor: string;
    badge?: string;
    badgeColor?: string;
    onClick: () => void;
  }[] = [
    {
      id: 'business',
      title: 'Business Profile',
      description: `${businessData.businessName} · ${businessData.category}`,
      icon: Building2,
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      onClick: () => setActiveSubTab('business'),
    },
    {
      id: 'wallet',
      title: 'Wallet & Credits',
      description: 'Available balance, top-up packages & credit usage',
      icon: Coins,
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400',
      badge: `${availableCredits.toLocaleString()} Credits`,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      onClick: () => setActiveSubTab('wallet'),
    },
    {
      id: 'plans',
      title: 'Plans & Pricing',
      description: 'Subscription tiers, billing cycles & AI agent limits',
      icon: CreditCard,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-400',
      badge: 'Business Pro',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      onClick: () => setActiveSubTab('plans'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Call alerts, AI escalation notices & system updates',
      icon: Bell,
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      badge: '3 New',
      badgeColor: 'bg-blue-600 text-white font-bold',
      onClick: () => setActiveSubTab('notifications'),
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Account settings, notification preferences & language',
      icon: Sliders,
      iconBg: 'bg-sky-500/10 border-sky-500/20',
      iconColor: 'text-sky-400',
      onClick: () => setActiveSubTab('settings'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Change password, active sessions & account security',
      icon: Shield,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      badge: 'Protected',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      onClick: () => setActiveSubTab('privacy'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Telephony FAQs, contact support & ticketing system',
      icon: HelpCircle,
      iconBg: 'bg-teal-500/10 border-teal-500/20',
      iconColor: 'text-teal-400',
      onClick: () => setActiveSubTab('help'),
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Submit feedback, report a problem & feedback history',
      icon: MessageSquareHeart,
      iconBg: 'bg-pink-500/10 border-pink-500/20',
      iconColor: 'text-pink-400',
      onClick: () => setActiveSubTab('feedback'),
    },
    {
      id: 'about',
      title: 'About UNIQ AI',
      description: 'Platform version, terms & conditions & privacy policy',
      icon: Info,
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400',
      badge: 'v2.4.0',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      onClick: () => setActiveSubTab('about'),
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your business account safely',
      icon: LogOut,
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      iconColor: 'text-rose-400',
      onClick: () => setIsLogoutDialogOpen(true),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/90 text-white backdrop-blur-md shadow-2xl text-xs font-semibold border border-emerald-400/40"
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Functional Banner */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-200">
        <div className="flex items-center gap-2.5">
          <AlertCircle size={16} className="text-blue-400 shrink-0" />
          <span>
            <strong>Profile & Account Functional Template:</strong> Edit personal info, manage business profiles, view demo wallet credits, compare plans, and test settings. No real payment gateway is integrated.
          </span>
        </div>
        {onNavigateToDashboard && (
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="self-start sm:self-auto text-blue-400 hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Back to Dashboard</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* 1. PROFILE HOME VIEW (Active when sub-tab is 'overview') */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* User Information & Business Summary Card */}
          <section
            aria-label="User Profile and Business Summary"
            className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* User Avatar + Core Details */}
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl flex items-center justify-center">
                    <div className="w-full h-full rounded-[14px] bg-[#050B1A] flex items-center justify-center overflow-hidden">
                      {userData.photoUrl ? (
                        <img
                          src={userData.photoUrl}
                          alt={userData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl font-extrabold text-blue-400">
                          {userData.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserEditForm({ ...userData });
                      setUserEditErrors({});
                      setIsEditUserModalOpen(true);
                    }}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md border border-blue-400/30 transition-transform active:scale-95 cursor-pointer"
                    title="Change Profile Photo"
                    aria-label="Edit Profile Photo"
                  >
                    <Camera size={12} />
                  </button>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                      {userData.fullName}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                      {userData.role}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      Verified Business
                    </span>
                  </div>

                  {/* Business Name Display */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                    <Building2 size={14} className="text-amber-400 shrink-0" />
                    <span className="font-semibold text-white truncate">{businessData.businessName}</span>
                    <span className="text-slate-500 text-[11px] hidden sm:inline">
                      ({businessData.category})
                    </span>
                  </div>

                  {/* Contact Info: Email & Mobile */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-blue-400 shrink-0" />
                      <span className="truncate">{userData.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-cyan-400 shrink-0" />
                      <span>{userData.mobile}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Header Actions: Edit Profile + Notification Bell */}
              <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0 pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setUserEditForm({ ...userData });
                    setUserEditErrors({});
                    setIsEditUserModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('notifications')}
                  className="relative p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Open Notifications"
                  aria-label="Open Notifications"
                >
                  <Bell size={16} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900 shadow">
                    3
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Meta & Quick Indicator Strip */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[11px]">
                <span>Member since {userData.joinedDate}</span>
                <span className="text-slate-700 hidden sm:inline">·</span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('wallet')}
                  className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Coins size={12} />
                  <span>{availableCredits.toLocaleString()} Available Credits</span>
                </button>
                <span className="text-slate-700 hidden sm:inline">·</span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('plans')}
                  className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard size={12} />
                  <span>Business Pro Plan</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                Ready for Supabase DB & Auth
              </div>
            </div>
          </section>

          {/* 10 Compact, Clearly Separated Menu Rows */}
          <section aria-label="Profile Menu Sections" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Account & Platform Settings
              </span>
              <span className="text-[11px] text-slate-500">10 Menu Sections</span>
            </div>

            <div className="space-y-2">
              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                const isLogout = item.id === 'logout';
                return (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className={`group p-3.5 sm:p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm select-none active:scale-[0.995] ${
                      isLogout
                        ? 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-sm font-semibold truncate block transition-colors ${
                            isLogout
                              ? 'text-rose-400 group-hover:text-rose-300'
                              : 'text-white group-hover:text-blue-300'
                          }`}
                        >
                          {item.title}
                        </span>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        size={16}
                        className={`transition-all group-hover:translate-x-0.5 ${
                          isLogout
                            ? 'text-rose-400/60 group-hover:text-rose-300'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 3. SECTION: Business Profile */}
      {activeSubTab === 'business' && (
        <section
          aria-label="Business Profile"
          className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl space-y-6"
        >
          {/* Back button navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Back to Profile</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">Profile · Business Profile</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <Building2 size={20} className="text-blue-400" />
                <h2 className="text-lg font-bold text-white">Business Profile</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure your business identity, sector category, and contact information used by your AI agents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setBusinessEditForm({ ...businessData });
                setBusinessEditErrors({});
                setIsEditBusinessModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Edit3 size={13} />
              <span>Edit Business Information</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Preview */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium text-slate-400 mb-3">Business Logo</span>
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden mb-3">
                {businessData.logoUrl ? (
                  <img
                    src={businessData.logoUrl}
                    alt={businessData.businessName}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Building2 size={32} />
                    <span className="text-[10px] mt-1 text-slate-600">No logo uploaded</span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500">
                Displayed in post-call messages and customer portal.
              </span>
            </div>

            {/* Profile Fields */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                    <Building2 size={13} /> Business Name
                  </span>
                  <span className="text-sm font-semibold text-white">{businessData.businessName}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                    <Tag size={13} /> Category
                  </span>
                  <span className="text-sm font-semibold text-blue-400">{businessData.category}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <Globe size={13} /> Official Website
                </span>
                {businessData.website ? (
                  <a
                    href={businessData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{businessData.website}</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">No website configured</span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <MapPin size={13} /> Business Address
                </span>
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed block">
                  {businessData.address}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                  <FileText size={13} /> Business Description & AI Context
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {businessData.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION: Wallet & Credits */}
      {activeSubTab === 'wallet' && (
        <section aria-label="Wallet & Credits" className="space-y-6">
          {/* Navigation header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Back to Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transactions')}
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            >
              <Receipt size={13} />
              <span>View Transactions</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Available Credits */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-2 mb-2">
                  <Coins size={16} className="text-amber-400" />
                  Available Credits
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {availableCredits.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">+Ready</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
                Approx. ~142 call minutes or ~2,850 WhatsApp follow-ups
              </p>
            </div>

            {/* Card 2: Used Credits */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-400" />
                  Used Credits (This Month)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {usedCredits.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 5,000</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
                43% total monthly allowance consumed
              </p>
            </div>

            {/* Card 3: Quick Top-Up CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 via-slate-900/50 to-indigo-950/30 border border-blue-500/30 backdrop-blur-md p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Instant Top-up
                  </span>
                  <Sparkles size={16} className="text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Need More Call Minutes?</h3>
                <p className="text-xs text-slate-300">
                  Add instant credits without altering your monthly subscription tier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyCreditsModalOpen(true)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
              >
                <Coins size={14} />
                <span>Buy Credits (Demo)</span>
              </button>
            </div>
          </div>

          {/* Sample Credit Packages for Demonstration */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Demonstration Credit Packages</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sample packages for demonstration. Clearly labelled as demo data until real payment gateways are connected.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Demo Gateway
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'pack-starter',
                  name: 'Starter Booster',
                  credits: 1000,
                  price: '$19',
                  description: 'Ideal for small businesses handling ~50 customer calls.',
                  tag: 'Standard',
                },
                {
                  id: 'pack-pro',
                  name: 'Growth Booster',
                  credits: 3000,
                  price: '$49',
                  description: 'Best value for active businesses handling ~150 calls + WhatsApp.',
                  tag: 'Most Popular',
                  highlight: true,
                },
                {
                  id: 'pack-scale',
                  name: 'Power Enterprise',
                  credits: 10000,
                  price: '$139',
                  description: 'Heavy call volumes with priority neural voice synthesis.',
                  tag: 'Scale',
                },
              ].map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                    pkg.highlight
                      ? 'bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{pkg.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          pkg.highlight
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pkg.tag}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-extrabold text-white font-mono">
                        +{pkg.credits.toLocaleString()}
                      </span>
                      <span className="text-xs text-blue-400 font-semibold">Credits</span>
                    </div>

                    <div className="text-lg font-bold text-slate-200 mb-2">
                      {pkg.price}{' '}
                      <span className="text-[11px] font-normal text-slate-500">(Demo)</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{pkg.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBuyDemoCredits(pkg.credits, pkg.name)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      pkg.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    Select Package (Demo)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. SECTION: Plans & Pricing */}
      {activeSubTab === 'plans' && (
        <section aria-label="Plans & Pricing" className="space-y-6">
          {/* Navigation header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Back to Profile</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">Profile · Plans & Pricing</span>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Subscription Plans</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Transparent tiers for conversational AI telephony. All billing is demonstration mode.
                </p>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAnnualBilling(false)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    !isAnnualBilling ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnualBilling(true)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                    isAnnualBilling ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                    -20% Demo
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const price = isAnnualBilling ? plan.priceAnnual : plan.priceMonthly;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between relative transition-all ${
                      plan.isCurrent
                        ? 'bg-blue-950/30 border-blue-500/50 ring-1 ring-blue-500/40'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white tracking-wide uppercase shadow">
                        Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        {plan.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                            {price}
                          </span>
                          <span className="text-xs text-slate-400">
                            /month <span className="text-[10px] text-slate-500">(Demo)</span>
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-blue-400 block mt-1">
                          {plan.includedCredits}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{plan.agentsLimit}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 text-xs text-slate-300">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-tight text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {plan.isCurrent ? (
                        <div className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-center bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          Active Current Plan
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedPlanModal(plan)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                        >
                          Select Plan (Demo)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. SECTION: Transaction History */}
      {activeSubTab === 'transactions' && (
        <section aria-label="Transaction History" className="space-y-4">
          {/* Navigation header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('wallet')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Back to Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubTab('overview')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <span>Back to Profile</span>
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">Profile · Wallet · Transactions</span>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-blue-400" />
                  <h2 className="text-base font-bold text-white">Transaction History</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comprehensive audit trail of credit top-ups, recurring plans, and AI voice usage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Sample Data
                </span>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              {/* Category tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Transactions' },
                  { id: 'purchase', label: 'Credit Purchases' },
                  { id: 'usage', label: 'Usage' },
                  { id: 'payment', label: 'Payments' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTransactionFilter(f.id as typeof transactionFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      transactionFilter === f.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  placeholder="Search TXN ID or type..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Type / Description</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-white">{tx.id}</td>
                          <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-200 block">{tx.type}</span>
                            <span className="text-[11px] text-slate-500">{tx.reference}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-200">
                            {tx.amount}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold">
                            <span
                              className={
                                tx.isCreditAddition ? 'text-emerald-400' : 'text-slate-400'
                              }
                            >
                              {tx.credits}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 size={11} />
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. SECTION: Help & Support */}
      {(activeSubTab === 'help' || activeSubTab === 'support') && (
        <HelpSupportSection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* 8. SECTION: Settings */}
      {activeSubTab === 'settings' && (
        <SettingsSection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* 9. SECTION: Privacy & Security */}
      {activeSubTab === 'privacy' && (
        <PrivacySecuritySection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* 10. SECTION: Notifications */}
      {activeSubTab === 'notifications' && (
        <NotificationsSection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* 11. SECTION: Feedback */}
      {activeSubTab === 'feedback' && (
        <FeedbackSection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* 12. SECTION: About UNIQ AI */}
      {activeSubTab === 'about' && (
        <AboutSection
          onShowToast={showToast}
          onBackToOverview={() => setActiveSubTab('overview')}
        />
      )}

      {/* MODAL 1: Edit Personal Details */}
      <AnimatePresence>
        {isEditUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Edit Personal Account Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveUserAccount} className="space-y-4 text-xs">
                {/* Photo Simulation */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 font-bold text-lg overflow-hidden">
                      {userEditForm.photoUrl ? (
                        <img
                          src={userEditForm.photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {userEditForm.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2) || 'UI'}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer">
                        <Camera size={13} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setUserEditForm({
                                  ...userEditForm,
                                  photoUrl: event.target?.result as string,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {userEditForm.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setUserEditForm({ ...userEditForm, photoUrl: null })}
                          className="block text-[11px] text-rose-400 hover:underline cursor-pointer"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={userEditForm.fullName}
                    onChange={(e) => setUserEditForm({ ...userEditForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="e.g. Rahul Saini"
                  />
                  {userEditErrors.fullName && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {userEditErrors.fullName}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={userEditForm.email}
                    onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="e.g. name@company.com"
                  />
                  {userEditErrors.email && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {userEditErrors.email}
                    </span>
                  )}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userEditForm.mobile}
                    onChange={(e) => setUserEditForm({ ...userEditForm, mobile: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="e.g. +91 98765 43210"
                  />
                  {userEditErrors.mobile && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {userEditErrors.mobile}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Edit Business Profile */}
      <AnimatePresence>
        {isEditBusinessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Edit Business Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditBusinessModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBusinessProfile} className="space-y-4 text-xs">
                {/* Business Name */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Business Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessEditForm.businessName}
                    onChange={(e) =>
                      setBusinessEditForm({ ...businessEditForm, businessName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                  {businessEditErrors.businessName && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {businessEditErrors.businessName}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Business Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={businessEditForm.category}
                    onChange={(e) =>
                      setBusinessEditForm({ ...businessEditForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Website (Optional)</label>
                  <input
                    type="url"
                    value={businessEditForm.website}
                    onChange={(e) =>
                      setBusinessEditForm({ ...businessEditForm, website: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Business Address */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Business Address <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={businessEditForm.address}
                    onChange={(e) =>
                      setBusinessEditForm({ ...businessEditForm, address: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                  />
                  {businessEditErrors.address && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {businessEditErrors.address}
                    </span>
                  )}
                </div>

                {/* Business Description */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Business Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={businessEditForm.description}
                    onChange={(e) =>
                      setBusinessEditForm({ ...businessEditForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                  />
                  {businessEditErrors.description && (
                    <span className="text-[11px] text-rose-400 block mt-1">
                      {businessEditErrors.description}
                    </span>
                  )}
                </div>

                {/* Logo Upload Simulation */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Business Logo (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer">
                      <Camera size={13} />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setBusinessEditForm({
                                ...businessEditForm,
                                logoUrl: event.target?.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {businessEditForm.logoUrl && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Check size={11} /> Logo loaded
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditBusinessModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
                  >
                    Save Business Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Buy Credits Modal */}
      <AnimatePresence>
        {isBuyCreditsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Coins size={18} className="text-amber-400" />
                  <h3 className="text-base font-bold text-white">Purchase Calling Credits (Demo)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuyCreditsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-4">
                <strong>Demonstration Mode:</strong> No real payment gateway is connected. Selecting a package simulates immediate credit top-up in your frontend session.
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { name: 'Starter Pack', credits: 1000, price: '$19 (Demo)' },
                  { name: 'Growth Booster', credits: 3000, price: '$49 (Demo)' },
                  { name: 'Enterprise Power', credits: 10000, price: '$139 (Demo)' },
                ].map((pkg) => (
                  <div
                    key={pkg.name}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{pkg.name}</span>
                      <span className="text-sm font-extrabold text-blue-400 font-mono">
                        +{pkg.credits.toLocaleString()} Credits
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-300">{pkg.price}</span>
                      <button
                        type="button"
                        onClick={() => handleBuyDemoCredits(pkg.credits, pkg.name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        Add Credits
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsBuyCreditsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Plan Selection Details / Upgrade Modal */}
      <AnimatePresence>
        {selectedPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">{selectedPlanModal.name} Plan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-slate-400">Monthly Investment</span>
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {isAnnualBilling ? selectedPlanModal.priceAnnual : selectedPlanModal.priceMonthly}{' '}
                    <span className="text-xs text-slate-400 font-normal">/mo (Demo)</span>
                  </span>
                </div>
                <span className="text-xs text-blue-400 font-semibold block">
                  Includes {selectedPlanModal.includedCredits}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Supports {selectedPlanModal.agentsLimit}
                </span>
              </div>

              <div className="space-y-2 mb-5">
                <span className="text-xs font-semibold text-slate-300 block">Features Included:</span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {selectedPlanModal.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 mb-5">
                Demo notice: Clicking &quot;Simulate Upgrade&quot; updates your simulated tier without processing actual payments.
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanModal(null);
                    showToast(`Simulated plan switch to ${selectedPlanModal.name}!`);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
                >
                  Simulate Upgrade (Demo)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Change Password Modal */}
      <AnimatePresence>
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Change Account Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {passwordFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{passwordFeedback}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 mb-4 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 text-[11px] text-slate-500">
                  Password will be securely encrypted with bcrypt upon backend authentication setup.
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow cursor-pointer"
                  >
                    Update Password (Demo)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: Contact Support Ticket */}
      <AnimatePresence>
        {isContactSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Contact UNIQ AI Support</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactSupportModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {supportTicketSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center text-xs text-emerald-300 space-y-2">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-400" />
                  <p className="font-semibold">{supportTicketSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSupportTicketSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Issue Category</label>
                    <select
                      value={supportTicketForm.category}
                      onChange={(e) =>
                        setSupportTicketForm({ ...supportTicketForm, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none cursor-pointer"
                    >
                      <option value="Technical Telephony">Technical Telephony & SIP</option>
                      <option value="AI Voice Latency">AI Voice & Speech Recognition</option>
                      <option value="WhatsApp Integration">WhatsApp Cloud API & Delivery</option>
                      <option value="Billing & Credits">Billing & Credits</option>
                      <option value="General Question">General Account Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={supportTicketForm.subject}
                      onChange={(e) =>
                        setSupportTicketForm({ ...supportTicketForm, subject: e.target.value })
                      }
                      placeholder="Brief overview of the issue"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={supportTicketForm.message}
                      onChange={(e) =>
                        setSupportTicketForm({ ...supportTicketForm, message: e.target.value })
                      }
                      placeholder="Describe what occurred, any phone numbers involved, or error details..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsContactSupportModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow cursor-pointer"
                    >
                      Submit Ticket (Demo)
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 7: Privacy Policy */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Privacy Policy</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Data Processing:</strong> UNIQ AI processes voice audio streams, speech-to-text transcripts, and caller metadata exclusively for providing autonomous phone receptionist and automated WhatsApp follow-ups on behalf of your business.
                </p>
                <p>
                  <strong>2. Telecommunication Regulations:</strong> Inbound calls handled by UNIQ AI comply with telecommunication consent laws. Optional call recording notifications are announced at call commencement.
                </p>
                <p>
                  <strong>3. Data Retention:</strong> Transcripts and recordings are stored securely in encrypted customer tenant storage. You may delete records at any time.
                </p>
                <p>
                  <strong>4. Third-Party Neural Providers:</strong> Voice synthesis providers (such as ElevenLabs / Deepgram) process ephemeral audio without retaining your proprietary conversation content for general model training.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-right">
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 8: Terms & Conditions */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-blue-400" />
                  <h3 className="text-base font-bold text-white">Terms & Conditions</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Permitted Telephony Use:</strong> UNIQ AI is designed for legitimate business communications, customer appointment scheduling, and order inquiries. Unsolicited outbound robocalling or SPAM broadcasts are strictly prohibited.
                </p>
                <p>
                  <strong>2. Fair Usage Policy:</strong> Monthly credits are subject to fair use limits based on concurrent channel concurrency.
                </p>
                <p>
                  <strong>3. WhatsApp Business Terms:</strong> Businesses must obtain explicit opt-in consent from customers before sending automated notifications through WhatsApp.
                </p>
                <p>
                  <strong>4. Service Level & Latency:</strong> While UNIQ AI targets sub-second conversational latency, real-world telecommunication latency depends on carrier network coverage.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-right">
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Acknowledge Terms
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 9: Logout Confirmation Dialog */}
      <AnimatePresence>
        {isLogoutDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
                <LogOut size={22} />
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">Sign Out of UNIQ AI?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Are you sure you want to end your current business session? You will be redirected to the account login page.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogoutDialogOpen(false);
                    onLogout();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
