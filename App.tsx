/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WelcomePage } from './WelcomePage.tsx';
import { LoginPage } from './LoginPage.tsx';
import { SignUpPage } from './SignUpPage.tsx';
import { BusinessProfileSetupPage } from './BusinessProfileSetupPage.tsx';
import { MainDashboard } from './MainDashboard.tsx';
import { ForgotPasswordPlaceholder } from './ForgotPasswordPlaceholder.tsx';
import type { AppView, BusinessProfileData } from './navigation.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [registeredBusinessName, setRegisteredBusinessName] = useState<string>('Acme Global Inc.');
  const [profileData, setProfileData] = useState<BusinessProfileData | null>(null);

  const handleSignUpSubmit = (data: { businessName: string }) => {
    setRegisteredBusinessName(data.businessName);
    setCurrentView('business-setup');
  };

  const handleProfileComplete = (data: BusinessProfileData) => {
    setProfileData(data);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {currentView === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <WelcomePage onGetStarted={() => setCurrentView('login')} />
          </motion.div>
        )}

        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <LoginPage
              onBackToWelcome={() => setCurrentView('welcome')}
              onNavigateForgotPassword={() => setCurrentView('forgot-password')}
              onNavigateSignUp={() => setCurrentView('signup')}
              onLoginSuccess={() => setCurrentView('dashboard')}
            />
          </motion.div>
        )}

        {currentView === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <SignUpPage
              onBackToLogin={() => setCurrentView('login')}
              onBackToWelcome={() => setCurrentView('welcome')}
              onSignUpSubmit={handleSignUpSubmit}
            />
          </motion.div>
        )}

        {currentView === 'business-setup' && (
          <motion.div
            key="business-setup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <BusinessProfileSetupPage
              initialBusinessName={registeredBusinessName}
              onSaveAndContinue={handleProfileComplete}
              onSkipOptional={handleProfileComplete}
              onBackToSignUp={() => setCurrentView('signup')}
            />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <MainDashboard
              businessName={registeredBusinessName}
              profileData={profileData}
              onLogout={() => setCurrentView('login')}
            />
          </motion.div>
        )}

        {currentView === 'forgot-password' && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <ForgotPasswordPlaceholder
              onBackToLogin={() => setCurrentView('login')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
