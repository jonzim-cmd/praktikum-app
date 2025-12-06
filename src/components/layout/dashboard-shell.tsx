'use client';

import { Sidebar } from './sidebar';
import { MobileNav, MobileHeader } from './mobile-nav';
import { UserMenu } from './user-menu';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'student' | 'teacher' | 'company' | 'admin';
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  title?: string;
  onLogout: () => void;
}

export function DashboardShell({
  children,
  role,
  user,
  title,
  onLogout,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <MobileHeader title={title} />

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-border bg-background-subtle px-6">
          <h1 className="font-display text-lg font-semibold text-foreground">
            {title || 'Dashboard'}
          </h1>
          <UserMenu user={user} onLogout={onLogout} />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav role={role} />
      </div>
    </div>
  );
}
