import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { confirmPasswordReset, loginUser, registerUser, requestPasswordReset, startGoogleLogin } from '../services/api';

interface LoginPageProps {
  onBackToSite: () => void;
  onAuthenticated: () => void;
  initialError?: string;
}

const GoogleMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.91-4.2 2.91-7.21Z" />
    <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.6Z" />
    <path fill="#FBBC05" d="M6.54 13.69a5.86 5.86 0 0 1 0-3.38V7.79H3.3a9.74 9.74 0 0 0 0 8.42l3.24-2.52Z" />
    <path fill="#EA4335" d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.36 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.52C7.31 8 9.46 6.28 12 6.28Z" />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToSite, onAuthenticated, initialError = '' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(() => new URLSearchParams(window.location.search).has('reset_uid') ? 'reset' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetUid] = useState(() => new URLSearchParams(window.location.search).get('reset_uid') || '');
  const [resetToken] = useState(() => new URLSearchParams(window.location.search).get('reset_token') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await loginUser(email, password, rememberMe);
        onAuthenticated();
      } else if (mode === 'register') {
        await registerUser({ first_name: firstName, last_name: lastName, email, password });
        onAuthenticated();
      } else if (resetUid && resetToken) {
        if (password !== confirmPassword) throw new Error('Les mots de passe ne correspondent pas.');
        await confirmPasswordReset(resetUid, resetToken, password);
        setMessage('Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.');
        setMode('login');
      } else {
        setMessage(await requestPasswordReset(email));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await startGoogleLogin();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'La connexion Google est indisponible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isResetConfirmation = mode === 'reset' && Boolean(resetUid && resetToken);
  const title = mode === 'login' ? 'Se connecter' : mode === 'register' ? 'Créer un compte' : isResetConfirmation ? 'Nouveau mot de passe' : 'Réinitialiser le mot de passe';
  const subtitle = mode === 'login' ? 'Accédez à votre espace acquéreur NOEMA.' : mode === 'register' ? 'Créez votre espace pour suivre votre projet.' : isResetConfirmation ? 'Choisissez un mot de passe solide pour sécuriser votre espace.' : 'Recevez un lien sécurisé sur votre adresse e-mail.';

  return (
    <main className="min-h-screen bg-[#f5f4ef] text-neutral-950 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#183c34] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full border border-emerald-200/20" />
        <div className="absolute -right-8 top-40 h-64 w-64 rounded-full border border-emerald-200/15" />

        <div className="relative z-10">
          <button type="button" onClick={onBackToSite} className="group flex items-center gap-3 text-left" aria-label="Retourner au site NOEMA">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-serif text-xl font-bold text-[#183c34]">N</span>
            <span>
              <span className="block font-serif text-lg font-bold tracking-[0.24em]">NOEMA</span>
              <span className="block text-xs text-emerald-100/70">Résidence d’Exception • Abidjan</span>
            </span>
          </button>
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Votre espace privé</p>
          <h1 className="max-w-lg font-serif text-5xl font-semibold leading-[1.05] xl:text-6xl">Retrouvez votre projet immobilier, au même endroit.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-emerald-50/75">Suivez vos échanges, vos simulations et les prochaines étapes de votre acquisition avec NOEMA.</p>
          <div className="mt-10 flex items-center gap-3 text-sm text-emerald-50/80">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <span>Un espace pensé pour vos démarches en toute sérénité.</span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-emerald-100/50">© 2026 Résidence NOEMA · Angré Djorogobité</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-24">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <button type="button" onClick={onBackToSite} className="flex items-center gap-2 font-serif text-lg font-bold tracking-[0.2em]" aria-label="Retourner au site NOEMA">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-base text-white">N</span>
              NOEMA
            </button>
            <button type="button" onClick={onBackToSite} className="text-sm font-medium text-neutral-500 hover:text-neutral-950">Retour au site</button>
          </div>

          <button type="button" onClick={onBackToSite} className="mb-12 hidden items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950 lg:flex">
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </button>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Bienvenue</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-neutral-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">{subtitle}</p>
          </div>

          {mode !== 'reset' && <>
            <button type="button" onClick={handleGoogleLogin} disabled={isSubmitting} className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:border-neutral-500 hover:shadow-md active:scale-[.99] disabled:cursor-wait disabled:opacity-60">
              <GoogleMark />
              {isSubmitting ? 'Redirection en cours...' : 'Continuer avec Google'}
            </button>

            <div className="my-7 flex items-center gap-4 text-xs text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />
              <span>ou avec votre adresse e-mail</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-neutral-800">Prénom</span><input value={firstName} onChange={(event) => setFirstName(event.target.value)} required placeholder="Awa" className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-neutral-800">Nom</span><input value={lastName} onChange={(event) => setLastName(event.target.value)} required placeholder="Kouassi" className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" /></label>
            </div>}
            {!isResetConfirmation && <label className="block">
              <span className="mb-2 block text-sm font-semibold text-neutral-800">Adresse e-mail</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="vous@exemple.com" className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </span>
            </label>}

            {(mode !== 'reset' || isResetConfirmation) && <label className="block">
              <span className="mb-2 block text-sm font-semibold text-neutral-800">Mot de passe</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Votre mot de passe" className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-12 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-400 hover:text-neutral-800" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </span>
            </label>}

            {isResetConfirmation && <label className="block"><span className="mb-2 block text-sm font-semibold text-neutral-800">Confirmer le mot de passe</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required placeholder="Répétez le mot de passe" className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" /></label>}

            {mode === 'login' && <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 accent-emerald-700" />
                Se souvenir de moi
              </label>
              <button type="button" onClick={() => { setMode('reset'); setMessage(''); setError(''); }} className="font-semibold text-emerald-800 hover:text-emerald-950">Mot de passe oublié ?</button>
            </div>}

            <button type="submit" disabled={isSubmitting} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#183c34] px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all hover:bg-[#102e28] active:scale-[.99] disabled:cursor-wait disabled:opacity-60">
              {isSubmitting ? 'Traitement en cours...' : title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</p>}
          {message && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-900">{message}</p>}

          <p className="mt-9 text-center text-sm text-neutral-500">{mode === 'login' ? <>Vous n’avez pas encore de compte ? <button type="button" onClick={() => { setMode('register'); setMessage(''); setError(''); }} className="font-semibold text-emerald-800 hover:text-emerald-950">Créer un compte</button></> : <button type="button" onClick={() => { setMode('login'); setMessage(''); setError(''); }} className="font-semibold text-emerald-800 hover:text-emerald-950">Retour à la connexion</button>}</p>
          <p className="mt-8 text-center text-xs leading-5 text-neutral-400">En vous connectant, vous acceptez nos conditions d’utilisation et notre politique de confidentialité.</p>
        </div>
      </section>
    </main>
  );
};