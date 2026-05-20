'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { ERA_REMITTANCES, formatCurrency } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  unmatched: 'text-amber-700 bg-amber-50',
  matched: 'text-blue-700 bg-blue-50',
  posted: 'text-green-700 bg-green-100',
};
const STATUS_LABELS = {
  unmatched: 'Unmatched',
  matched: 'Matched',
  posted: 'Posted',
};

export default function EraPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      setUploading(true);
      setTimeout(() => { setUploading(false); setUploadSuccess(true); }, 1800);
    }
  };

  const totalPaid = ERA_REMITTANCES.reduce((s, e) => s + e.totalPaid, 0);
  const posted = ERA_REMITTANCES.filter((e) => e.status === 'posted').length;
  const unmatched = ERA_REMITTANCES.filter((e) => e.status === 'unmatched').length;

  return (
    <>
      <Topbar title="ERA 835 Processing" />
      <main className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-slate-900">{ERA_REMITTANCES.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">ERA files this period</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total remittance value</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{posted}</div>
            <div className="text-xs text-slate-500 mt-0.5">Posted to ledger</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-600">{unmatched}</div>
            <div className="text-xs text-slate-500 mt-0.5">Needs manual match</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upload zone */}
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
                dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50',
                uploading && 'animate-pulse'
              )}>
              <div className="flex flex-col items-center gap-3">
                {uploadSuccess ? (
                  <>
                    <CheckCircle2 size={36} className="text-green-500" />
                    <p className="font-semibold text-green-700">ERA file uploaded</p>
                    <p className="text-sm text-slate-500">Processing auto-match…</p>
                  </>
                ) : uploading ? (
                  <>
                    <Clock size={36} className="text-blue-500" />
                    <p className="font-semibold text-blue-700">Uploading…</p>
                  </>
                ) : (
                  <>
                    <Upload size={36} className="text-slate-400" />
                    <div>
                      <p className="font-semibold text-slate-700">Drop ERA 835 file here</p>
                      <p className="text-sm text-slate-500 mt-0.5">or click to browse</p>
                    </div>
                    <p className="text-xs text-slate-400">.edi, .txt, .835 files accepted</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5">
                <AlertCircle size={14} /> Auto-match rules
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} />Match by claim number (ICN/DCN)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} />Match by patient ID + DOS + amount</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} />Flag underpayments (&gt;5% variance)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} />Post adjustments (CO/PR reason codes)</li>
              </ul>
            </div>
          </div>

          {/* ERA table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Remittance Files</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recent ERA 835 files received from payers</p>
            </div>
            <div className="divide-y divide-slate-50">
              {ERA_REMITTANCES.map((era) => (
                <div key={era.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-slate-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{era.payerName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          ERA {era.eraId} · Check #{era.checkNumber}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Check date: {era.checkDate} · Uploaded: {era.uploadedAt.split('T')[0]}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-slate-900 text-base">{formatCurrency(era.totalPaid)}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{era.claimsCount} claims</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[era.status]}`}>
                      {STATUS_LABELS[era.status]}
                    </span>
                    <div className="flex gap-2">
                      {era.status === 'unmatched' && (
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          Manual match <ArrowRight size={11} />
                        </button>
                      )}
                      {era.status === 'matched' && (
                        <button className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
                          Post to ledger <ArrowRight size={11} />
                        </button>
                      )}
                      <button className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                        View detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X12 835 info box */}
        <div className="bg-slate-900 text-slate-300 rounded-xl p-5 text-sm">
          <h3 className="text-white font-semibold mb-2">X12 835 ERA Processing — How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { step: '1', title: 'Receive ERA', desc: 'Payer sends 835 EDI file via SFTP or payer portal. Upload manually or configure auto-retrieval.' },
              { step: '2', title: 'Auto-match', desc: 'System matches each CLM segment to submitted claims by ICN/DCN, then by patient/DOS/amount.' },
              { step: '3', title: 'Post & reconcile', desc: 'Approved matches are posted to the ledger. Underpayments and adjustments are flagged for review.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
