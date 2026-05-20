import { addDays, subDays, format } from 'date-fns';

export type ClaimStatus = 'draft' | 'submitted' | 'acknowledged' | 'pending' | 'paid' | 'denied' | 'appealed';

export type Claim = {
  id: string;
  patientName: string;
  patientId: string;
  dob: string;
  insurerId: string;
  insurerName: string;
  memberId: string;
  cptCode: string;
  cptDescription: string;
  icd10: string;
  dos: string;         // date of service
  submittedAt: string | null;
  status: ClaimStatus;
  billedAmount: number;
  allowedAmount: number | null;
  paidAmount: number | null;
  adjustmentAmount: number | null;
  denialCode: string | null;
  denialReason: string | null;
  priorAuthRequired: boolean;
  priorAuthNumber: string | null;
  npi: string;
  providerName: string;
};

export type DenialReason = {
  code: string;
  label: string;
  category: 'eligibility' | 'coding' | 'auth' | 'duplicate' | 'other';
  actionable: boolean;
};

export type EraRemittance = {
  id: string;
  eraId: string;
  payerId: string;
  payerName: string;
  checkDate: string;
  checkNumber: string;
  totalPaid: number;
  claimsCount: number;
  status: 'unmatched' | 'matched' | 'posted';
  uploadedAt: string;
};

export type LeaderKpi = {
  totalBilled: number;
  totalCollected: number;
  collectionRate: number;
  totalDenied: number;
  denialRate: number;
  avgDaysToPayment: number;
  pendingClaims: number;
  cleanClaimRate: number;
};

export const DENIAL_REASONS: DenialReason[] = [
  { code: 'CO-4', label: 'Inconsistent with modifier', category: 'coding', actionable: true },
  { code: 'CO-11', label: 'Diagnosis inconsistent with procedure', category: 'coding', actionable: true },
  { code: 'CO-15', label: 'Missing authorization number', category: 'auth', actionable: true },
  { code: 'CO-27', label: 'Expenses incurred after coverage terminated', category: 'eligibility', actionable: false },
  { code: 'CO-29', label: 'Timely filing limit exceeded', category: 'other', actionable: false },
  { code: 'CO-97', label: 'Payment adjusted when services rendered', category: 'duplicate', actionable: false },
  { code: 'PR-1', label: 'Deductible amount not met', category: 'eligibility', actionable: false },
  { code: 'PR-2', label: 'Coinsurance amount', category: 'eligibility', actionable: false },
  { code: 'OA-23', label: 'Impact of prior payer(s) adjudication', category: 'other', actionable: false },
];

const now = new Date();

export const CLAIMS: Claim[] = [
  {
    id: 'CLM-00123', patientName: 'Sarah Mitchell', patientId: 'PT-1001', dob: '1982-04-15',
    insurerId: 'UHC', insurerName: 'UnitedHealthcare', memberId: 'UHC934710221',
    cptCode: '99213', cptDescription: 'Office visit, established patient, low complexity',
    icd10: 'J06.9', dos: format(subDays(now, 12), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 11), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'paid', billedAmount: 185, allowedAmount: 142, paidAmount: 113.6, adjustmentAmount: 28.4,
    denialCode: null, denialReason: null, priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
  {
    id: 'CLM-00124', patientName: 'Robert Chen', patientId: 'PT-1002', dob: '1955-09-22',
    insurerId: 'AETNA', insurerName: 'Aetna', memberId: 'AET209340128',
    cptCode: '93000', cptDescription: 'Electrocardiogram, routine ECG with at least 12 leads',
    icd10: 'I10', dos: format(subDays(now, 8), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'denied', billedAmount: 240, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: 'CO-11', denialReason: 'Diagnosis inconsistent with procedure',
    priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
  {
    id: 'CLM-00125', patientName: 'Maria Gonzalez', patientId: 'PT-1003', dob: '1991-11-08',
    insurerId: 'BCBS', insurerName: 'Blue Cross Blue Shield', memberId: 'BCB412908155',
    cptCode: '71046', cptDescription: 'Radiologic exam, chest, 2 views',
    icd10: 'J18.9', dos: format(subDays(now, 5), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'pending', billedAmount: 320, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: null, denialReason: null, priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
  {
    id: 'CLM-00126', patientName: 'David Thompson', patientId: 'PT-1004', dob: '1968-03-30',
    insurerId: 'CIGNA', insurerName: 'Cigna', memberId: 'CIG720193084',
    cptCode: '27447', cptDescription: 'Total knee arthroplasty',
    icd10: 'M17.11', dos: format(subDays(now, 20), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 18), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'denied', billedAmount: 18500, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: 'CO-15', denialReason: 'Missing authorization number',
    priorAuthRequired: true, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. Priya Nair',
  },
  {
    id: 'CLM-00127', patientName: 'Jennifer Adams', patientId: 'PT-1005', dob: '1975-07-14',
    insurerId: 'MEDICARE', insurerName: 'Medicare Part B', memberId: 'MED1A5728390',
    cptCode: '99214', cptDescription: 'Office visit, established patient, moderate complexity',
    icd10: 'E11.9', dos: format(subDays(now, 3), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'acknowledged', billedAmount: 265, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: null, denialReason: null, priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
  {
    id: 'CLM-00128', patientName: 'Michael Brown', patientId: 'PT-1006', dob: '1948-12-05',
    insurerId: 'MEDICARE', insurerName: 'Medicare Part B', memberId: 'MED2B4819203',
    cptCode: '90837', cptDescription: 'Psychotherapy, 60 minutes',
    icd10: 'F32.1', dos: format(subDays(now, 6), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'paid', billedAmount: 180, allowedAmount: 130, paidAmount: 104, adjustmentAmount: 26,
    denialCode: null, denialReason: null, priorAuthRequired: false, priorAuthNumber: null,
    npi: '0987654321', providerName: 'Dr. Lisa Wang',
  },
  {
    id: 'CLM-00129', patientName: 'Emily Carter', patientId: 'PT-1007', dob: '2001-06-18',
    insurerId: 'MEDICAID', insurerName: 'Medicaid', memberId: 'MCD391029184',
    cptCode: '99203', cptDescription: 'Office visit, new patient, low complexity',
    icd10: 'L20.9', dos: format(subDays(now, 1), 'yyyy-MM-dd'),
    submittedAt: null,
    status: 'draft', billedAmount: 145, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: null, denialReason: null, priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
  {
    id: 'CLM-00130', patientName: 'Robert Chen', patientId: 'PT-1002', dob: '1955-09-22',
    insurerId: 'AETNA', insurerName: 'Aetna', memberId: 'AET209340128',
    cptCode: '93000', cptDescription: 'ECG with at least 12 leads (resubmit)',
    icd10: 'R94.31', dos: format(subDays(now, 8), 'yyyy-MM-dd'),
    submittedAt: format(subDays(now, 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    status: 'appealed', billedAmount: 240, allowedAmount: null, paidAmount: null, adjustmentAmount: null,
    denialCode: 'CO-11', denialReason: 'Diagnosis inconsistent with procedure — appealed with corrected ICD-10',
    priorAuthRequired: false, priorAuthNumber: null,
    npi: '1234567890', providerName: 'Dr. James Okafor',
  },
];

export const ERA_REMITTANCES: EraRemittance[] = [
  {
    id: 'ERA-001', eraId: '835-2026-001', payerId: 'UHC', payerName: 'UnitedHealthcare',
    checkDate: format(subDays(now, 2), 'yyyy-MM-dd'), checkNumber: 'EFT84921047',
    totalPaid: 1823.40, claimsCount: 8, status: 'matched',
    uploadedAt: format(subDays(now, 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'ERA-002', eraId: '835-2026-002', payerId: 'MEDICARE', payerName: 'Medicare Part B',
    checkDate: format(subDays(now, 5), 'yyyy-MM-dd'), checkNumber: 'EFT93840192',
    totalPaid: 4102.00, claimsCount: 22, status: 'posted',
    uploadedAt: format(subDays(now, 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: 'ERA-003', eraId: '835-2026-003', payerId: 'BCBS', payerName: 'Blue Cross Blue Shield',
    checkDate: format(now, 'yyyy-MM-dd'), checkNumber: 'EFT10293847',
    totalPaid: 2750.50, claimsCount: 11, status: 'unmatched',
    uploadedAt: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
];

export const KPI: LeaderKpi = {
  totalBilled: 97420,
  totalCollected: 74182,
  collectionRate: 76.1,
  totalDenied: 23890,
  denialRate: 14.3,
  avgDaysToPayment: 18.4,
  pendingClaims: 34,
  cleanClaimRate: 88.2,
};

export const AR_AGING = [
  { bucket: '0–30 days', amount: 18420, count: 12 },
  { bucket: '31–60 days', amount: 9810, count: 7 },
  { bucket: '61–90 days', amount: 5320, count: 4 },
  { bucket: '91–120 days', amount: 2180, count: 3 },
  { bucket: '120+ days', amount: 890, count: 2 },
];

export const MONTHLY_REVENUE = [
  { month: 'Nov', billed: 82000, collected: 61400 },
  { month: 'Dec', billed: 78500, collected: 58200 },
  { month: 'Jan', billed: 91200, collected: 67800 },
  { month: 'Feb', billed: 88400, collected: 65100 },
  { month: 'Mar', billed: 94300, collected: 71200 },
  { month: 'Apr', billed: 97420, collected: 74182 },
];

export const CPT_CODES = [
  { code: '99213', description: 'Office visit, established patient, low complexity' },
  { code: '99214', description: 'Office visit, established patient, moderate complexity' },
  { code: '99203', description: 'Office visit, new patient, low complexity' },
  { code: '93000', description: 'Electrocardiogram, routine ECG with at least 12 leads' },
  { code: '71046', description: 'Radiologic exam, chest, 2 views' },
  { code: '27447', description: 'Total knee arthroplasty' },
  { code: '90837', description: 'Psychotherapy, 60 minutes' },
  { code: '99232', description: 'Subsequent hospital care, moderate complexity' },
  { code: '97110', description: 'Therapeutic exercises' },
  { code: '43239', description: 'Upper GI endoscopy with biopsy' },
];

export const PAYERS = [
  { id: 'UHC', name: 'UnitedHealthcare' },
  { id: 'AETNA', name: 'Aetna' },
  { id: 'BCBS', name: 'Blue Cross Blue Shield' },
  { id: 'CIGNA', name: 'Cigna' },
  { id: 'MEDICARE', name: 'Medicare Part B' },
  { id: 'MEDICAID', name: 'Medicaid' },
  { id: 'HUMANA', name: 'Humana' },
];

export function statusColor(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    draft: 'text-gray-500 bg-gray-100',
    submitted: 'text-blue-700 bg-blue-50',
    acknowledged: 'text-indigo-700 bg-indigo-50',
    pending: 'text-amber-700 bg-amber-50',
    paid: 'text-green-700 bg-green-100',
    denied: 'text-red-700 bg-red-100',
    appealed: 'text-purple-700 bg-purple-100',
  };
  return map[status];
}

export function statusLabel(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    pending: 'Pending',
    paid: 'Paid',
    denied: 'Denied',
    appealed: 'Appealed',
  };
  return map[status];
}

export function formatCurrency(n: number | null): string {
  if (n === null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
