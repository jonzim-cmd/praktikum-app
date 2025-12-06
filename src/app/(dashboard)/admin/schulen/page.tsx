import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { StatusBadge } from '@/components/ui';
import { Plus, MoreHorizontal, GraduationCap } from 'lucide-react';
import { db } from '@/lib/db';
import { schools } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function SchulenPage() {
  const allSchools = await db.select().from(schools);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Schulen</h1>
          <p className="text-foreground-muted">Verwalte die registrierten Schulen</p>
        </div>
        <Link href="/admin/schulen/neu">
          <Button>
            <Plus className="h-4 w-4" />
            Schule anlegen
          </Button>
        </Link>
      </div>

      {allSchools.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-foreground-muted mb-4" />
            <h3 className="text-lg font-medium text-foreground">Keine Schulen vorhanden</h3>
            <p className="text-sm text-foreground-muted mt-1">
              Legen Sie die erste Schule an, um zu beginnen.
            </p>
            <Link href="/admin/schulen/neu" className="mt-4">
              <Button>
                <Plus className="h-4 w-4" />
                Schule anlegen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allSchools.map((school) => (
            <Card key={school.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                    {school.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{school.name}</h3>
                    <p className="text-sm text-foreground-muted">{school.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={school.isActive ? 'success' : 'neutral'}>
                    {school.isActive ? 'Aktiv' : 'Inaktiv'}
                  </StatusBadge>
                  <Link href={`/admin/schulen/${school.id}`}>
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
