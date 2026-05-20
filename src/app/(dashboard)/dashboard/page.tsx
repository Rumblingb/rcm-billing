'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  DollarSign, FileCheck, AlertTriangle, Clock,
  TrendingUp, TrendingDown, ArrowUpRight,
} from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import {
  KPI, MONTHLY_REVENUE, AR_AGING, CLAIMS,
  formatCurrency, statusColor, statusLabel,
} from '@/lib/mock-data';

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            vs last month
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const denied = CLAIMS.filter((c) => c.status === 'denied');
  const pending = CLAIMS.filter((c) => ['submitted', 'acknowledged', 'pending'].includes(c.status));
  const recent = CLAIMS.slice(0, 5);

  return (
    <>
      <Topbar title="Dashboard" />
      <main className="p-6 space-y-6">

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Collected (MTD)"
            value={formatCurrency(KPI.totalCollected)}
            sub={`${KPI.collectionRate}% collection rate`}
            icon={DollarSign}
            accent="bg-blue-600"
            trend="up"
          />
          <KpiCard
            label="Claims Submitted"
            value={CLAIMS.filter((c) => c.status !== 'draft').length.toString()}
            sub={`${KPI.cleanClaimRate}% clean claim rate`}
            icon={FileCheck}
            accent="bg-green-600"
            trend="up"
          />
          <KpiCard
            label="Denied Claims"
            value={denied.length.toString()}
            sub={`${KPI.denialRate}% denial rate`}
            icon={AlertTriangle}
            accent="bg-red-500"
            trend="down"
          />
          <KpiCard
            label="Avg Days to Payment"
            value={`${KPI.avgDaysToPayment}d`}
            sub={`${pending.length} claims pending`}
            icon={Clock}
            accent="bg-amber-500"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Revenue trend */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-slate-900">Revenue Trend</h2>
                <p className="text-sm text-slate-500">Billed vs Collected — last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Billed</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Collected</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="billed" stroke="#2563eb" strokeWidth={2} dot={false} name="Billed" />
                <Line type="monotone" dataKey="collected" stroke="#16a34a" strokeWidth={2} dot={false} name="Collected" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AR Aging */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-1">AR Aging</h2>
            <p className="text-sm text-slate-500 mb-5">Outstanding receivables by age</p>
            <div className="space-y-3">
              {AR_AGING.map((row, i) => {
                const maxAmt = Math.max(...AR_AGING.map((r) => r.amount));
                const pct = (row.amount / maxAmt) * 100;
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-amber-400', 'bg-orange-500', 'bg-red-500'];
                return (
                  <div key={row.bucket}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{row.bucket}</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(row.amount)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[i]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Total outstanding</span>
              <span className="font-bold text-slate-900">{formatCurrency(AR_AGING.reduce((s, r) => s + r.amount, 0))}</span>
            </div>
          </div>
        </div>

        {/* Recent claims */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Claims</h2>
            <a href="/claims" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Claim ID', 'Patient', 'Payer', 'CPT', 'Billed', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((claim) => (
                  <tr key={claim.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-blue-600">{claim.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{claim.patientName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{claim.insurerName}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">{claim.cptCode}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{formatCurrency(claim.billedAmount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(claim.status)}`}>
                        {statusLabel(claim.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </>
  );
}
