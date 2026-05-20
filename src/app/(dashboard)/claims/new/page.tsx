'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { CPT_CODES, PAYERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type Step = 'patient' | 'procedure' | 'payer' | 'review';
const STEPS: { id: Step; label: string }[] = [
  { id: 'patient', label: 'Patient' },
  { id: 'procedure', label: 'Procedure' },
  { id: 'payer', label: 'Payer' },
  { id: 'review', label: 'Review & Submit' },
];

type FormData = {
  patientName: string;
  patientId: string;
  dob: string;
  dos: string;
  cptCode: string;
  icd10: string;
  billedAmount: string;
  priorAuthNumber: string;
  insurerId: string;
  memberId: string;
  npi: string;
};

export default function NewClaimPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('patient');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    patientName: '', patientId: '', dob: '', dos: '',
    cptCode: '', icd10: '', billedAmount: '', priorAuthNumber: '',
    insurerId: '', memberId: '', npi: '1234567890',
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const next = () => {
    const order: Step[] = ['patient', 'procedure', 'payer', 'review'];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };
  const prev = () => {
    const order: Step[] = ['patient', 'procedure', 'payer', 'review'];
    const i = order.indexOf(step);
    if (i > 0) setStep(order[i - 1]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push('/claims'), 2500);
  };

  const selectedCpt = CPT_CODES.find((c) => c.code === form.cptCode);
  const selectedPayer = PAYERS.find((p) => p.id === form.insurerId);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Claim Submitted</h2>
          <p className="text-slate-500 mt-1 text-sm">Redirecting to claims list…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Topbar title="New Claim" />
      <main className="p-6">
        <div className="max-w-2xl mx-auto">

          {/* Step indicator */}
          <nav className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-0 flex-1">
                <button
                  onClick={() => i < stepIdx && setStep(s.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold transition-colors',
                    s.id === step ? 'text-blue-600' : i < stepIdx ? 'text-green-600 cursor-pointer' : 'text-slate-400'
                  )}>
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                    s.id === step ? 'border-blue-600 bg-blue-600 text-white' :
                    i < stepIdx ? 'border-green-600 bg-green-600 text-white' :
                    'border-slate-300 text-slate-400'
                  )}>
                    {i < stepIdx ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={16} className="text-slate-300 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </nav>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">

            {step === 'patient' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Patient Information</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Enter the patient's demographic details.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Patient Name *" className="col-span-2">
                    <input className={fieldCls} value={form.patientName} onChange={set('patientName')} placeholder="First Last" />
                  </FormField>
                  <FormField label="Patient ID">
                    <input className={fieldCls} value={form.patientId} onChange={set('patientId')} placeholder="PT-XXXX" />
                  </FormField>
                  <FormField label="Date of Birth *">
                    <input className={fieldCls} type="date" value={form.dob} onChange={set('dob')} />
                  </FormField>
                  <FormField label="Date of Service *" className="col-span-2">
                    <input className={fieldCls} type="date" value={form.dos} onChange={set('dos')} />
                  </FormField>
                </div>
              </>
            )}

            {step === 'procedure' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Procedure Details</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Enter CPT and diagnosis codes.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="CPT Code *" className="col-span-2">
                    <select className={fieldCls} value={form.cptCode} onChange={set('cptCode')}>
                      <option value="">Select procedure…</option>
                      {CPT_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} — {c.description}</option>
                      ))}
                    </select>
                  </FormField>
                  {selectedCpt && (
                    <div className="col-span-2 flex items-start gap-2 bg-blue-50 text-blue-700 text-xs rounded-lg p-3">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{selectedCpt.description}</span>
                    </div>
                  )}
                  <FormField label="ICD-10 Diagnosis Code *">
                    <input className={fieldCls} value={form.icd10} onChange={set('icd10')} placeholder="e.g. J06.9" />
                  </FormField>
                  <FormField label="Billed Amount ($) *">
                    <input className={fieldCls} type="number" value={form.billedAmount} onChange={set('billedAmount')} placeholder="0.00" />
                  </FormField>
                  <FormField label="Prior Auth Number" className="col-span-2">
                    <input className={fieldCls} value={form.priorAuthNumber} onChange={set('priorAuthNumber')} placeholder="Leave blank if not required" />
                  </FormField>
                </div>
              </>
            )}

            {step === 'payer' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Payer & Insurance</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Enter the patient's insurance details.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Payer / Insurer *" className="col-span-2">
                    <select className={fieldCls} value={form.insurerId} onChange={set('insurerId')}>
                      <option value="">Select payer…</option>
                      {PAYERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Member ID *" className="col-span-2">
                    <input className={fieldCls} value={form.memberId} onChange={set('memberId')} placeholder="Insurance member ID" />
                  </FormField>
                  <FormField label="Rendering NPI">
                    <input className={fieldCls} value={form.npi} onChange={set('npi')} />
                  </FormField>
                </div>
              </>
            )}

            {step === 'review' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Review & Submit</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Confirm all details before submitting.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Patient', value: `${form.patientName} · DOB ${form.dob}` },
                    { label: 'Date of Service', value: form.dos },
                    { label: 'CPT Code', value: `${form.cptCode} — ${selectedCpt?.description ?? ''}` },
                    { label: 'Diagnosis (ICD-10)', value: form.icd10 },
                    { label: 'Billed Amount', value: `$${form.billedAmount}` },
                    { label: 'Payer', value: selectedPayer?.name ?? form.insurerId },
                    { label: 'Member ID', value: form.memberId },
                    { label: 'Prior Auth #', value: form.priorAuthNumber || 'Not required' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-4 py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-500 font-medium w-36 flex-shrink-0">{row.label}</span>
                      <span className="text-sm text-slate-800 font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={prev}
              disabled={stepIdx === 0}
              className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              ← Back
            </button>
            {step !== 'review' ? (
              <button
                onClick={next}
                className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Submit Claim
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

const fieldCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
