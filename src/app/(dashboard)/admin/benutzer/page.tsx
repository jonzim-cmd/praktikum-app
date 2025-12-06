import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui';
import { StatusBadge } from '@/components/ui';
import { Plus, MoreHorizontal, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { users, schools } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  school_admin: 'Schul-Admin',
  teacher: 'Lehrkraft',
  student: 'Schüler',
  company_user: 'Betrieb',
};

const roleBadgeStatus: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  super_admin: 'warning',
  school_admin: 'info',
  teacher: 'success',
  student: 'neutral',
  company_user: 'neutral',
};

export default async function BenutzerPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      schoolId: users.schoolId,
      schoolName: schools.name,
    })
    .from(users)
    .leftJoin(schools, eq(users.schoolId, schools.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Benutzer</h1>
          <p className="text-foreground-muted">Verwalte alle Benutzer der Plattform</p>
        </div>
        <Link href="/admin/benutzer/neu">
          <Button>
            <Plus className="h-4 w-4" />
            Benutzer anlegen
          </Button>
        </Link>
      </div>

      {allUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-foreground-muted mb-4" />
            <h3 className="text-lg font-medium text-foreground">Keine Benutzer vorhanden</h3>
            <p className="text-sm text-foreground-muted mt-1">
              Legen Sie den ersten Benutzer an.
            </p>
            <Link href="/admin/benutzer/neu" className="mt-4">
              <Button>
                <Plus className="h-4 w-4" />
                Benutzer anlegen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{user.name}</h3>
                    <p className="text-sm text-foreground-muted">
                      @{user.username}
                      {user.schoolName && ` • ${user.schoolName}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={roleBadgeStatus[user.role] || 'neutral'}>
                    {roleLabels[user.role] || user.role}
                  </StatusBadge>
                  <StatusBadge status={user.isActive ? 'success' : 'neutral'}>
                    {user.isActive ? 'Aktiv' : 'Inaktiv'}
                  </StatusBadge>
                  <Link href={`/admin/benutzer/${user.id}`}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
