/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CreditCard, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({
  isOpen,
  onClose,
  currentCredits,
}) => {
  const [selectedPack, setSelectedPack] = useState<'starter' | 'growth' | 'scale'>('growth');
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const packs = [
    {
      id: 'starter' as const,
      name: 'Starter Pack',
      credits: '1,000 Credits',
      price: '$29',
      rate: '$0.029 / min',
      description: 'Ideal for small retail and quick inquiry handling.',
    },
    {
      id: 'growth' as const,
      name: 'Growth Pack',
      credits: '5,000 Credits',
      price: '$99',
      rate: '$0.019 / min',
      popular: true,
      description: 'Best for active businesses with regular customer calls.',
    },
    {
      id: 'scale' as const,
      name: 'Enterprise Scale',
      credits: '20,000 Credits',
      price: '$299',
      rate: '$0.014 / min',
      description: 'High-volume voice pipelines & multichannel WhatsApp.',
    },
  ];

  const handleSimulatePurchase = () => {
    setPurchaseNotice('Credit purchase flow ready for Stripe / LemonSqueezy integration.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buy AI Voice & Message Credits</h3>
              <p className="text-xs text-slate-400">Current Balance: {currentCredits.toLocaleString()} Credits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {purchaseNotice && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
            <span>{purchaseNotice}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {packs.map((pack) => {
            const isSelected = selectedPack === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.25)]'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{pack.name}</span>
                    {pack.popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500 text-white">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{pack.description}</p>
                  <span className="text-[11px] text-blue-400 font-mono mt-1 block">
                    {pack.credits} · {pack.rate}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-bold text-white block">{pack.price}</span>
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center mt-1 ml-auto">
                    {isSelected && <Check size={13} className="text-blue-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulatePurchase}
            className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={15} />
            <span>Top Up Credits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
