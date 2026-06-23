import React, { Suspense, useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Header } from '@/app/components/Header';
import { Hero } from '@/app/components/Hero';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { AnimatedDivider } from '@/app/components/AnimatedDivider';
import { ScrollProgress } from '@/app/components/ScrollProgress';
import { ScrollToTop } from '@/app/components/ScrollToTop';
import { useLenis } from '@/hooks/useLenis';
import { RegisterForm } from '@/app/components/RegisterForm';
import { VerifyEmail } from '@/app/components/VerifyEmail';
import { DiscoverSection } from '@/app/components/DiscoverSection';

// Lazy loaded components (Below the fold)
const PWABenefits = React.lazy(() => import('@/app/components/PWABenefits').then(module => ({ default: module.PWABenefits })));
const TrustSection = React.lazy(() => import('@/app/components/TrustSection').then(module => ({ default: module.TrustSection })));
const Pricing = React.lazy(() => import('@/app/components/Pricing').then(module => ({ default: module.Pricing })));
const ContactForm = React.lazy(() => import('@/app/components/ContactForm').then(module => ({ default: module.ContactForm })));
const FAQ = React.lazy(() => import('@/app/components/FAQ').then(module => ({ default: module.FAQ })));
const Footer = React.lazy(() => import('@/app/components/Footer').then(module => ({ default: module.Footer })));
const PrivacyPolicy = React.lazy(() => import('@/app/components/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfUse = React.lazy(() => import('@/app/components/TermsOfUse').then(module => ({ default: module.TermsOfUse })));
const HIPAACompliance = React.lazy(() => import('@/app/components/HIPAACompliance').then(module => ({ default: module.HIPAACompliance })));

// Fallback loader for chunks
const SectionLoader = () => (
  <div className="w-full flex items-center justify-center py-20 bg-slate-50/50">
    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
  </div>
);

function LazySection({ children }: { children: React.ReactNode }) {
  const reveal = useScrollReveal('fade', { threshold: 0.05, rootMargin: '200px 0px' });
  return (
    <div ref={reveal.ref} style={reveal.style}>
      <Suspense fallback={<SectionLoader />}>
        {children}
      </Suspense>
    </div>
  );
}

export default function App() {
  useLenis();
  const [view, setView] = useState<'home' | 'register' | 'verify' | 'privacy' | 'terms' | 'hipaa'>('home');
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

  const handleNavigateToPrivacy = () => setView('privacy');
  const handleNavigateToTerms = () => setView('terms');
  const handleNavigateToHIPAA = () => setView('hipaa');

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ScrollProgress />
      <ScrollToTop />
      <LoadingScreen />

      {view === 'verify' ? (
        <VerifyEmail
          token={verifyToken}
          onBack={() => setView('home')}
        />
      ) : view === 'privacy' ? (
        <Suspense fallback={<SectionLoader />}>
          <PrivacyPolicy onBack={() => setView('home')} />
        </Suspense>
      ) : view === 'terms' ? (
        <Suspense fallback={<SectionLoader />}>
          <TermsOfUse onBack={() => setView('home')} />
        </Suspense>
      ) : view === 'hipaa' ? (
        <Suspense fallback={<SectionLoader />}>
          <HIPAACompliance onBack={() => setView('home')} />
        </Suspense>
      ) : (
        <>
          <Header onNavigate={handleNavigate} />

          {view === 'home' ? (
            <>
              <Hero />
              <AnimatedDivider color="cyan" />
              <DiscoverSection />

              <LazySection><PWABenefits /></LazySection>
              <AnimatedDivider color="white" />
              <LazySection><TrustSection /></LazySection>
              <AnimatedDivider color="blue" />
              <LazySection><Pricing onSelectPlan={handleSelectPlan} /></LazySection>
              <AnimatedDivider color="cyan" />
              <LazySection><ContactForm /></LazySection>
              <AnimatedDivider color="blue" />
              <LazySection><FAQ /></LazySection>
              <LazySection><Footer
                onNavigateToPrivacy={handleNavigateToPrivacy}
                onNavigateToTerms={handleNavigateToTerms}
                onNavigateToHIPAA={handleNavigateToHIPAA}
              /></LazySection>
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