'use client';

import { useState } from 'react';
import { AlertTriangle, RotateCcw, Eye, CheckCircle2, Filter } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { CLAIMS, DENIAL_REASONS, formatCurrency } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS = {
  eligibility: { label: 'Eligibility', cls: 'bg-purple-100 text-purple-700' },
  coding: { label: 'Coding', cls: 'bg-amber-100 text-amber-700' },
  auth: { label: 'Auth', cls: 'bg-red-100 text-red-700' },
  duplicate: { label: 'Duplicate', cls: 'bg-gray-100 text-gray-700' },
  other: { label: 'Other', cls: 'bg-slate-100 text-slate-600' },
};

export default function DenialsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const denied = CLAIMS.filter((c) => c.status === 'denied' || c.status === 'appealed');
  const totalDenied = denied.reduce((s, c) => s + c.billedAmount, 0);

  const reasonBreakdown = DENIAL_REASONS.map((r) => ({
    ...r,
    count: denied.filter((c) => c.denialCode === r.code).length,
  })).filter((r) => r.count > 0 || DENIAL_REASONS.slice(0, 4).includes(r));

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSelected = selected.length === denied.length;

  return (
    <>
      <Topbar title="Denial Management" />
      <main className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-600">{denied.filter((c) => c.status === 'denied').length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Open denials</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-600">{denied.filter((c) => c.status === 'appealed').length}</div>
            <div className="text-xs text-slate-500 mt-0.5">In appeal</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalDenied)}</div>
            <div className="text-xs text-slate-500 mt-0.5">At-risk revenue</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600">
              {denied.filter((c) => DENIAL_REASONS.find((r) => r.code === c.denialCode)?.actionable).length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Actionable (correctable)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Denial queue */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Denial Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review, correct, and resubmit</p>
              </div>
              {selected.length > 0 && (
                <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <RotateCcw size={14} />
                  Bulk resubmit ({selected.length})
                </button>
              )}
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : denied.map((c) => c.id))}
                      className="rounded border-slate-300" />
                  </th>
                  {['Claim', 'Patient', 'Denial Code', 'Billed', 'Actionable', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {denied.map((c) => {
                  const reason = DENIAL_REASONS.find((r) => r.code === c.denialCode);
                  const cat = reason?.category ?? 'other';
                  const catStyle = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS];
                  return (
                    <tr key={c.id} className={cn('hover:bg-slate-50 transition-colors', selected.includes(c.id) && 'bg-blue-50')}>
                      <td className="px-4 py-3.5">
                        <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)}
                          className="rounded border-slate-300" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-xs font-semibold text-blue-600">{c.id}</div>
                        <div className="text-xs text-slate-400">{c.dos}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{c.patientName}</td>
                      <td className="px-4 py-3.5">
                        {c.denialCode ? (
                          <>
                            <div className="font-mono text-xs font-bold text-slate-800">{c.denialCode}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[140px]">{c.denialReason}</div>
                            <span className={`mt-1 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${catStyle.cls}`}>
                              {catStyle.label}
                            </span>
                          </>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{formatCurrency(c.billedAmount)}</td>
                      <td className="px-4 py-3.5">
                        {reason?.actionable ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                            <CheckCircle2 size={12} /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {c.status === 'denied' && reason?.actionable && (
                          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <RotateCcw size={12} /> Resubmit
                          </button>
                        )}
                        {c.status === 'appealed' && (
                          <span className="text-xs font-semibold text-purple-600">In appeal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reason breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900">Denial Reason Codes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top denial patterns this period</p>
            </div>
            <div className="space-y-3">
              {DENIAL_REASONS.slice(0, 6).map((r) => {
                const count = denied.filter((c) => c.denialCode === r.code).length;
                const cat = CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS];
                return (
                  <div key={r.code} className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{r.code}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cat.cls}`}>{cat.label}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-snug">{r.label}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-slate-800">{count}</div>
                      <div className="text-[10px] text-slate-400">claims</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actionable % */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Actionable denials</span>
                <span className="font-bold text-green-700">
                  {Math.round((denied.filter((c) => DENIAL_REASONS.find((r) => r.code === c.denialCode)?.actionable).length / Math.max(denied.length, 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{
                  width: `${Math.round((denied.filter((c) => DENIAL_REASONS.find((r) => r.code === c.denialCode)?.actionable).length / Math.max(denied.length, 1)) * 100)}%`
                }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Actionable = fixable coding errors, missing auth numbers, etc.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
