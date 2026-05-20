'use client';

import { useState } from 'react';
import { Plus, Filter, Download, Search, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Topbar } from '@/components/layout/topbar';
import { CLAIMS, formatCurrency, statusColor, statusLabel, type ClaimStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: { label: string; value: ClaimStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Denied', value: 'denied' },
  { label: 'Appealed', value: 'appealed' },
];

export default function ClaimsPage() {
  const [status, setStatus] = useState<ClaimStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = CLAIMS.filter((c) => {
    if (status !== 'all' && c.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.patientName.toLowerCase().includes(q) ||
        c.cptCode.includes(q) ||
        c.insurerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalBilled = filtered.reduce((s, c) => s + c.billedAmount, 0);
  const totalPaid = filtered.reduce((s, c) => s + (c.paidAmount ?? 0), 0);

  return (
    <>
      <Topbar title="Claims" />
      <main className="p-6 space-y-5">

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total claims', value: CLAIMS.length.toString() },
            { label: 'Total billed', value: formatCurrency(totalBilled) },
            { label: 'Total collected', value: formatCurrency(totalPaid) },
            { label: 'Denied', value: CLAIMS.filter((c) => c.status === 'denied').length.toString() },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <div className="text-xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatus(f.value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold transition-colors',
                    status === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                />
              </div>
              <Link
                href="/claims/new"
                className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={14} />
                New Claim
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {[
                    'Claim ID', 'Patient', 'DOS', 'Payer', 'CPT Code',
                    'Billed', 'Paid', 'Status', 'Action',
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                      No claims found
                    </td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-600 whitespace-nowrap">{c.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{c.patientName}</div>
                      <div className="text-xs text-slate-400">{c.patientId}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{c.dos}</td>
                    <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">{c.insurerName}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs font-semibold text-slate-800">{c.cptCode}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[140px]">{c.cptDescription}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{formatCurrency(c.billedAmount)}</td>
                    <td className="px-4 py-3.5 font-semibold whitespace-nowrap">
                      {c.paidAmount !== null ? (
                        <span className="text-green-700">{formatCurrency(c.paidAmount)}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {c.status === 'denied' && (
                        <button className="text-xs text-amber-600 font-semibold hover:text-amber-700">
                          Appeal →
                        </button>
                      )}
                      {c.status === 'draft' && (
                        <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">
                          Submit →
                        </button>
                      )}
                      {c.status === 'paid' && (
                        <button className="text-xs text-slate-500 font-semibold hover:text-slate-700">
                          View EOB
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {CLAIMS.length} claims</span>
            <button className="flex items-center gap-1.5 font-medium hover:text-slate-700">
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
