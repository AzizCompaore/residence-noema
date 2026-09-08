import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calculator, 
  MessageCircle, 
  Menu, 
  X, 
  Phone, 
  Sparkles,
  ArrowRight,
  CalendarDays,
  LogOut
} from 'lucide-react';
import { ResidenceInfo } from '../types';
import { buildWhatsAppURL } from '../utils/utm';
import { AuthUser } from '../services/api';

interface HeaderProps {
  residence?: ResidenceInfo;
  onOpenSimulator: () => void;
  onToggleUrielGroup: () => void;
  onOpenLogin: () => void;
  onOpenVisioAppointment: () => void;
  onLogout: () => Promise<void>;
  user: AuthUser | null;
  showUrielGroup: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  residence,
  onOpenSimulator,
  onToggleUrielGroup,
  onOpenLogin,
  onOpenVisioAppointment,
  onLogout,
  user,
  showUrielGroup
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = residence?.whatsapp_number || '+2250789001122';
  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je visite le site de la Résidence NOEMA à Angré Djorogobité (Abidjan) et je souhaite obtenir des informations sur les disponibilités.'
  );
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Mon compte';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/55 backdrop-blur-md shadow-xs border-b border-white/60 py-3' 
          : 'bg-white/35 backdrop-blur-md border-b border-white/50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a 
            href="#hero" 
            id="header-brand-logo"
            className="flex items-center gap-3 group"
            onClick={(e) => {
              if (showUrielGroup) {
                e.preventDefault();
                onToggleUrielGroup();
              }
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-xl shadow-xs group-hover:bg-neutral-800 transition-colors">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-widest text-lg font-bold text-neutral-900 uppercase">
                  NOEMA
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Angré
                </span>
              </div>
              <span className="text-xs text-neutral-500 block font-normal -mt-0.5">
                Résidence d'Exception • Abidjan
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          {!showUrielGroup && (
            <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-9 text-[13px] font-medium text-neutral-600">
              <a href="#decouvrir" className="hover:text-neutral-950 transition-colors">
                Découvrir
              </a>
              <a href="#appartements" className="hover:text-neutral-950 transition-colors">
                Appartements
              </a>
              <a href="#simulateur" className="hover:text-neutral-950 transition-colors text-emerald-900 font-semibold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                Simulateur
              </a>
              <a href="#chantier" className="hover:text-neutral-950 transition-colors">
                Chantier
              </a>
              <a href="#pourquoi-investir" className="hover:text-neutral-950 transition-colors">
                Investissement
              </a>
              <a href="#localisation" className="hover:text-neutral-950 transition-colors">
                Localisation
              </a>
              <a href="#faq" className="hover:text-neutral-950 transition-colors">
                FAQ
              </a>
            </nav>
          )}

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Uriel Group Transition Link */}
            <button
              id="header-uriel-group-btn"
              onClick={onToggleUrielGroup}
              className="text-xs text-neutral-500 hover:text-neutral-900 px-3 py-2 rounded-md hover:bg-neutral-100/80 transition-all font-medium border border-transparent hover:border-neutral-200"
              title="Aperçu page de transition Uriel Group"
            >
              {showUrielGroup ? '← Retour à NOEMA' : 'Uriel Group'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  id="header-account-btn"
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white/80 transition-all hover:border-emerald-400 hover:bg-white"
                  title={`Ouvrir l'espace de ${displayName}`}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#183c34] text-[10px] font-bold text-white">{initials}</span>
                </button>
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl" role="menu">
                    <div className="border-b border-neutral-100 px-3 py-2.5">
                      <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onOpenSimulator(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                      <Calculator className="h-4 w-4 text-emerald-700" /> Faire une nouvelle simulation
                    </button>
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onOpenVisioAppointment(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50" role="menuitem">
                      <CalendarDays className="h-4 w-4 text-emerald-700" /> Prendre rendez-vous
                    </button>
                    <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-neutral-100 px-3 py-2.5 text-left text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50" role="menuitem">
                      <LogOut className="h-4 w-4" /> {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                    </button>
                  </div>
                )}
              </div>
            ) : <button
              id="header-login-btn"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white/70 px-3.5 py-2.5 text-xs font-semibold text-neutral-800 transition-all hover:border-neutral-500 hover:bg-white"
            >
              Se connecter
            </button>}

            {/* Quick Simulateur Button */}
            <button
              id="header-cta-simulator"
              onClick={onOpenSimulator}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-95"
              title="Ouvrir le simulateur de financement"
              aria-label="Ouvrir le simulateur de financement"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* WhatsApp Direct */}
            <a
              id="header-cta-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs active:scale-95"
              title="Contacter NOEMA sur WhatsApp"
              aria-label="Contacter NOEMA sur WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="header-mobile-sim-btn"
              onClick={onOpenSimulator}
              className="sm:hidden h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center"
              title="Ouvrir le simulateur de financement"
              aria-label="Ouvrir le simulateur de financement"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-drawer-menu"
          className="lg:hidden bg-white border-b border-neutral-200 px-5 pt-3 pb-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col space-y-3 pt-2 text-sm font-medium text-neutral-700">
            <a 
              href="#decouvrir" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Découvrir NOEMA</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
            <a 
              href="#appartements" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Appartements disponibles</span>
              <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600 font-semibold">T2 & T3</span>
            </a>
            <a 
              href="#simulateur" 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="py-2 border-b border-neutral-100 flex items-center justify-between text-emerald-700 font-semibold"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Simulateur de financement
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </a>
            <a 
              href="#chantier" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Chantier</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
            <a 
              href="#pourquoi-investir" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Pourquoi investir ?</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
            <a 
              href="#localisation" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Localisation à Angré Djorogobité (Abidjan)</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-100 flex items-center justify-between"
            >
              <span>Questions fréquentes (FAQ)</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </a>
          </nav>

          <div className="pt-3 flex flex-col gap-2.5">
            {user ? <>
              <div className="rounded-lg bg-neutral-50 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                <p className="truncate text-xs text-neutral-500">{user.email}</p>
              </div>
              <button type="button" onClick={() => { setMobileMenuOpen(false); onOpenVisioAppointment(); }} className="flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white py-3 px-4 text-left text-sm font-semibold text-neutral-800">
                <CalendarDays className="h-4 w-4 text-emerald-700" /> Prendre rendez-vous
              </button>
              <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="flex w-full items-center gap-2 rounded-lg border border-red-200 bg-white py-3 px-4 text-left text-sm font-semibold text-red-700">
                <LogOut className="h-4 w-4" /> {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
              </button>
            </> : <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full rounded-lg border border-neutral-300 bg-white py-3 text-center text-sm font-semibold text-neutral-800"
            >
              Se connecter
            </button>}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contacter sur WhatsApp</span>
            </a>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleUrielGroup();
              }}
              className="w-full py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-medium text-center text-xs"
            >
              {showUrielGroup ? 'Voir la Résidence NOEMA' : 'Page de transition Uriel Group'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
