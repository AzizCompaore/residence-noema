import React, { FormEvent, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Video, X } from 'lucide-react';

interface VisioAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const appointmentTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const appointmentDates = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + index);
  const value = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const label = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  return { value, label: label.charAt(0).toUpperCase() + label.slice(1) };
});

export const VisioAppointmentModal: React.FC<VisioAppointmentModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_whatsapp: '',
    appointment_date: '',
    appointment_time: '',
    timezone: 'Africa/Abidjan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [customDate, setCustomDate] = useState(false);
  const [customTime, setCustomTime] = useState(false);

  if (!isOpen) return null;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitAppointment = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible d’enregistrer le rendez-vous.');
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <Video className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Rendez-vous visio</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Échangez avec notre équipe</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">Choisissez le créneau qui vous convient pour découvrir NOEMA à distance.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-neutral-900">Votre demande est enregistrée</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">Notre équipe vous contactera pour confirmer le lien et le rendez-vous visio.</p>
            <button type="button" onClick={onClose} className="mt-7 rounded-lg bg-neutral-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-800">Fermer</button>
          </div>
        ) : (
          <form onSubmit={submitAppointment} className="space-y-5 px-6 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-neutral-700">Prénom<input required value={form.first_name} onChange={(event) => updateField('first_name', event.target.value)} className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="text-xs font-semibold text-neutral-700">Nom<input required value={form.last_name} onChange={(event) => updateField('last_name', event.target.value)} className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-neutral-700">Email<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="text-xs font-semibold text-neutral-700">WhatsApp<input required type="tel" value={form.phone_whatsapp} onChange={(event) => updateField('phone_whatsapp', event.target.value)} className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-neutral-700"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-emerald-700" />Date souhaitée</span><select required={!customDate} value={customDate ? 'other' : form.appointment_date} onChange={(event) => { const value = event.target.value; setCustomDate(value === 'other'); if (value !== 'other') updateField('appointment_date', value); else updateField('appointment_date', ''); }} className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option value="">Choisir un jour</option>{appointmentDates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}<option value="other">Autre date</option></select>{customDate && <input required type="date" min={appointmentDates[0].value} max={appointmentDates[appointmentDates.length - 1].value} value={form.appointment_date} onChange={(event) => updateField('appointment_date', event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />}</label>
              <label className="text-xs font-semibold text-neutral-700"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-emerald-700" />Heure souhaitée</span><select required={!customTime} value={customTime ? 'other' : form.appointment_time} onChange={(event) => { const value = event.target.value; setCustomTime(value === 'other'); if (value !== 'other') updateField('appointment_time', value); else updateField('appointment_time', ''); }} className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option value="">Choisir une heure</option>{appointmentTimes.map((time) => <option key={time} value={time}>{time.replace(':', 'h')} (Abidjan)</option>)}<option value="other">Autre heure ouvrée</option></select>{customTime && <input required type="time" min="09:00" max="17:59" value={form.appointment_time} onChange={(event) => updateField('appointment_time', event.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />}</label>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900"><Clock3 className="h-4 w-4 shrink-0 text-emerald-700" /><span>Créneaux proposés en heure locale d'Abidjan (GMT).</span></div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
            <button disabled={isSubmitting} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"><Video className="h-4 w-4" />{isSubmitting ? 'Enregistrement...' : 'Réserver mon rendez-vous visio'}</button>
            <p className="text-center text-[11px] text-neutral-400">Le créneau sera confirmé par notre équipe commerciale.</p>
          </form>
        )}
      </div>
    </div>
  );
};
