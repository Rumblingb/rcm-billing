import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
