/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'business-setup'
  | 'dashboard';

export type DashboardTab =
  | 'dashboard'
  | 'ai_agent'
  | 'calls'
  | 'whatsapp'
  | 'profile';

export interface BusinessProfileData {
  category: string;
  description: string;
  address: string;
  website: string;
  logoUrl: string | null;
}

export interface NavigationProps {
  currentView: AppView;
  navigateTo: (view: AppView) => void;
}
