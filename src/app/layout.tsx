import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RCM Billing — AgentPay Labs',
  description: 'Healthcare Revenue Cycle Management. Claims, denials, ERA processing, and revenue analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
