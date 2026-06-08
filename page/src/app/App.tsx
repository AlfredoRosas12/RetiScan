import React, { Suspense, useEffect, useState } from 'react';
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { AnimatedDivider } from '@/app/components/AnimatedDivider';
import { ScrollProgress } from '@/app/components/ScrollProgress';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useLenis } from '@/hooks/useLenis';
import { RegisterForm } from '@/app/components/RegisterForm';
import { VerifyEmail } from '@/app/components/VerifyEmail';

// Lazy loaded components (Below the fold)
const ProductShowcase = React.lazy(() => import('@/app/components/ProductShowcase').then(module => ({ default: module.ProductShowcase })));
const HowItWorks = React.lazy(() => import('@/app/components/HowItWorks').then(module => ({ default: module.HowItWorks })));
const PWABenefits = React.lazy(() => import('@/app/components/PWABenefits').then(module => ({ default: module.PWABenefits })));
const TrustSection = React.lazy(() => import('@/app/components/TrustSection').then(module => ({ default: module.TrustSection })));
const Pricing = React.lazy(() => import('@/app/components/Pricing').then(module => ({ default: module.Pricing })));
const SecuritySection = React.lazy(() => import('@/app/components/SecuritySection').then(module => ({ default: module.SecuritySection })));
const ContactForm = React.lazy(() => import('@/app/components/ContactForm').then(module => ({ default: module.ContactForm })));
const Footer = React.lazy(() => import('@/app/components/Footer').then(module => ({ default: module.Footer })));

// Fallback loader for chunks
const SectionLoader = () => (
  <div className="w-full flex items-center justify-center py-20 bg-slate-50/50">
    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
  </div>
);

export default function App() {
  useLenis();
  const [view, setView] = useState<'home' | 'register' | 'verify'>('home');
  const [selectedPlan, setSelectedPlan] = useState<string>('Especialista');
  const [verifyToken, setVerifyToken] = useState<string>('');

  // Detect ?verify=TOKEN in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify');
    if (token) {
      setVerifyToken(token);
      setView('verify');
      // Clean the URL without reloading the page
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Force scroll to top on page refresh
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = () => {
    if (view !== 'home') {
      setView('home');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <ScrollToTop />
      <LoadingScreen />

      {view === 'verify' ? (
        <VerifyEmail
          token={verifyToken}
          onBack={() => setView('home')}
        />
      ) : (
        <>
          <Header onNavigate={handleNavigate} />

          {view === 'home' ? (
            <>
              <Hero />
              <AnimatedDivider color="cyan" />

              <Suspense fallback={<SectionLoader />}>
                <ProductShowcase />
                <AnimatedDivider color="blue" />
                <HowItWorks />
                <PWABenefits />
                <AnimatedDivider color="white" />
                <TrustSection />
                <AnimatedDivider color="blue" />
                <Pricing onSelectPlan={handleSelectPlan} />
                <SecuritySection />
                <AnimatedDivider color="cyan" />
                <ContactForm />
                <Footer />
              </Suspense>
            </>
          ) : (
            <div className="relative min-h-screen pt-20 overflow-hidden">
              {/* Animated gradient background (same as Hero) */}
              <div
                className="absolute inset-0 animated-gradient"
                style={{
                  background: 'linear-gradient(135deg, #001a4d 0%, #003399 15%, #0066cc 30%, #00ccff 50%, #0066cc 70%, #003399 85%, #001a4d 100%)',
                  backgroundSize: '300% 300%',
                }}
              />
              {/* Subtle dot pattern */}
              <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '48px 48px'
                }}></div>
              </div>
              {/* Floating orbs */}
              <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300/10 rounded-full blur-3xl animate-float-delayed"></div>

              <div className="relative z-10">
                <RegisterForm
                  planName={selectedPlan}
                  onBack={() => setView('home')}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}