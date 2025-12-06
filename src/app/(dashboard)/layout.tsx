'use client';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth/client';
import { DashboardShell } from '@/components/layout';

type DashboardRole = 'student' | 'teacher' | 'company' | 'admin';

function mapUserRoleToDashboardRole(role: string): DashboardRole {
  switch (role) {
    case 'super_admin':
    case 'school_admin':
      return 'admin';
    case 'teacher':
      return 'teacher';
    case 'company_user':
      return 'company';
    case 'student':
    default:
      return 'student';
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-foreground-muted">Laden...</p>
        </div>
      </div>
    );
  }

  // Fallback user data if session is not yet loaded
  const user = session?.user
    ? {
        firstName: (session.user as { firstName?: string }).firstName || 'Benutzer',
        lastName: (session.user as { lastName?: string }).lastName || '',
        role: (session.user as { role?: string }).role || 'student',
      }
    : {
        firstName: 'Benutzer',
        lastName: '',
        role: 'student',
      };

  const dashboardRole = mapUserRoleToDashboardRole(user.role);

  return (
    <DashboardShell
      role={dashboardRole}
      user={user}
      title="Dashboard"
      onLogout={handleLogout}
    >
      {children}
    </DashboardShell>
  );
}
