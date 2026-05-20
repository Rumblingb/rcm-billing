'use client';

import { Topbar } from '@/components/layout/topbar';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <main className="p-6 max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {[
            { section: 'Practice', fields: [
              { label: 'Practice Name', value: 'Okafor Medical Group' },
              { label: 'NPI Number', value: '1234567890' },
              { label: 'Tax ID (EIN)', value: '**-*******' },
              { label: 'Address', value: '123 Medical Plaza, Suite 400' },
            ]},
            { section: 'Billing Contact', fields: [
              { label: 'Contact Name', value: 'Dr. James Okafor' },
              { label: 'Email', value: 'jokafor@okaformedical.com' },
              { label: 'Phone', value: '+1 (555) 234-5678' },
            ]},
          ].map((group) => (
            <div key={group.section} className="p-5">
              <h3 className="font-semibold text-slate-700 text-sm mb-4 uppercase tracking-wide">{group.section}</h3>
              <div className="space-y-3">
                {group.fields.map((f) => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{f.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 text-sm mb-1 uppercase tracking-wide">Subscription</h3>
          <p className="text-xs text-slate-400 mb-4">Powered by AgentPay Labs · Stripe billing</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg text-slate-900">Professional Plan</div>
              <div className="text-sm text-slate-500">$499/month · up to 1,000 claims</div>
            </div>
            <button className="text-sm font-semibold text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Manage billing
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
