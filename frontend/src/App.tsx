import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DiscoverSection } from './components/DiscoverSection';
import { ApartmentsSection } from './components/ApartmentsSection';
import { ApartmentDetailModal } from './components/ApartmentDetailModal';
import { SimulatorModal } from './components/SimulatorModal';
import { ConstructionSection } from './components/ConstructionSection';
import { WhyInvestSection } from './components/WhyInvestSection';
import { ImmoDiaspoSection } from './components/ImmoDiaspoSection';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { VisioAppointmentModal } from './components/VisioAppointmentModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { MobileStickyBar } from './components/MobileStickyBar';
import { UrielGroupTransitionPage } from './components/UrielGroupTransitionPage';
import { LoginPage } from './components/LoginPage';
import { LoadingScreen } from './components/LoadingScreen';
import { RevealSection, ScrollProgress } from './components/ScrollExperience';

import { Apartment, ResidenceInfo, ConstructionMilestone, FAQItem } from './types';
import { fetchResidence, fetchApartments, fetchConstructionMilestones, fetchFAQs, getCurrentUser, logoutUser, AuthUser } from './services/api';
import { captureUTMParams } from './utils/utm';

export function App() {
  // State from backend
  const [residence, setResidence] = useState<ResidenceInfo | undefined>(undefined);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [milestones, setMilestones] = useState<ConstructionMilestone[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals and UI State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedApartmentForSimulation, setSelectedApartmentForSimulation] = useState<Apartment | null>(null);
  const [detailApartment, setDetailApartment] = useState<Apartment | null>(null);
  const [showUrielGroup, setShowUrielGroup] = useState(false);
  const [isVisioAppointmentOpen, setIsVisioAppointmentOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  useEffect(() => {
    // Capture and save any UTM campaign parameters
    captureUTMParams();

    const authParams = new URLSearchParams(window.location.search);
    if (authParams.get('auth') === 'success') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (authParams.get('auth_error') === 'google' || authParams.get('auth_error') === 'google_credentials') {
      setLoginError(authParams.get('auth_error') === 'google_credentials'
        ? 'La configuration Google est invalide ou révoquée. Le propriétaire du site doit régénérer le Client secret OAuth.'
        : 'La connexion Google a échoué. Vérifiez votre compte et réessayez.');
      setShowLogin(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function loadData() {
      try {
        const [currentUser, residenceData, apartmentsData, milestonesData, faqsData] = await Promise.all([
          getCurrentUser(),
          fetchResidence(),
          fetchApartments(),
          fetchConstructionMilestones(),
          fetchFAQs()
        ]);
        setUser(currentUser);
        setResidence(residenceData);
        setApartments(apartmentsData);
        setMilestones(milestonesData);
        setFaqs(faqsData);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleOpenSimulator = (apt?: Apartment) => {
    if (apt) {
      setSelectedApartmentForSimulation(apt);
    } else {
      setSelectedApartmentForSimulation(null);
    }
    setIsSimulatorOpen(true);
  };

  const handleSelectForSimulationFromCard = (apt: Apartment) => {
    setSelectedApartmentForSimulation(apt);
    setIsSimulatorOpen(true);
  };

  const handleSelectForDetail = (apt: Apartment) => {
    setDetailApartment(apt);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col">
      <ScrollProgress />

      {loading && <LoadingScreen />}
      
      {!loading && showLogin ? (
        <LoginPage onBackToSite={() => { setLoginError(''); setShowLogin(false); }} onAuthenticated={async () => { await refreshUser(); setLoginError(''); setShowLogin(false); }} initialError={loginError} />
      ) : !loading && showUrielGroup ? (
        <UrielGroupTransitionPage onBackToNoema={() => setShowUrielGroup(false)} onOpenVisioAppointment={() => setIsVisioAppointmentOpen(true)} />
      ) : !loading ? (
        <>
          {/* Main Top Header */}
          <Header
            residence={residence}
            onOpenSimulator={() => handleOpenSimulator()}
            onToggleUrielGroup={() => setShowUrielGroup(true)}
            onOpenLogin={() => setShowLogin(true)}
            onOpenVisioAppointment={() => setIsVisioAppointmentOpen(true)}
            onLogout={async () => { await logoutUser(); setUser(null); }}
            user={user}
            showUrielGroup={showUrielGroup}
          />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* Section 1: Hero Section */}
            <HeroSection
              residence={residence}
              onOpenSimulator={() => handleOpenSimulator()}
            />

            {/* Section 2: Découvrir NOEMA */}
            <RevealSection><DiscoverSection residence={residence} /></RevealSection>

            {/* Section 3: Les Appartements Disponibles */}
            <RevealSection delay={80}><ApartmentsSection
              apartments={apartments}
              onSelectApartment={handleSelectForDetail}
              onSelectForSimulation={handleSelectForSimulationFromCard}
            /></RevealSection>

            {/* Section 4: NOEMA, Un Projet Réel (Avancement Chantier) */}
            <RevealSection delay={120}><ConstructionSection milestones={milestones} /></RevealSection>

            {/* Section 5: Pourquoi Investir dans NOEMA ? */}
            <RevealSection><WhyInvestSection /></RevealSection>

            {/* Section 6: Financement & Accompagnement Diaspora ImmoDiaspo */}
            <RevealSection delay={80}><ImmoDiaspoSection onOpenSimulator={() => handleOpenSimulator()} /></RevealSection>

            {/* Section 7: Localisation (Angré, Abidjan) */}
            <RevealSection><LocationSection /></RevealSection>

            {/* Section 8: FAQ Interactive */}
            <RevealSection delay={80}><FAQSection faqs={faqs} whatsappNumber={residence?.whatsapp_number} /></RevealSection>

          </main>

          {/* Main Footer */}
          <Footer
            residence={residence}
            onToggleUrielGroup={() => setShowUrielGroup(true)}
            onOpenSimulator={() => handleOpenSimulator()}
            onOpenVisioAppointment={() => setIsVisioAppointmentOpen(true)}
          />

          {/* Floating Actions Dock */}
          <WhatsAppFloatingButton
            whatsappNumber={residence?.whatsapp_number}
          />

          {/* Mobile Persistent Bottom Bar */}
          <MobileStickyBar
            onOpenSimulator={() => handleOpenSimulator()}
            whatsappNumber={residence?.whatsapp_number}
          />

          {/* Modal 1: Apartment Detail & Blueprint Modal */}
          <ApartmentDetailModal
            apartment={detailApartment}
            onClose={() => setDetailApartment(null)}
            onSelectForSimulation={handleSelectForSimulationFromCard}
            whatsappNumber={residence?.whatsapp_number}
          />

          {/* Modal 2: Financing Simulator & Lead Collector */}
          <SimulatorModal
            isOpen={isSimulatorOpen}
            onClose={() => setIsSimulatorOpen(false)}
            selectedApartment={selectedApartmentForSimulation}
            allApartments={apartments}
            onSelectApartment={(apt) => setSelectedApartmentForSimulation(apt)}
            whatsappNumber={residence?.whatsapp_number}
          />

          {/* Drawer: Commercial AI Assistant */}
        </>
      ) : null}

      <VisioAppointmentModal
        isOpen={isVisioAppointmentOpen}
        onClose={() => setIsVisioAppointmentOpen(false)}
      />

    </div>
  );
}
export default App;
