import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { GraduationCap, Users, Building2, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin-Dashboard</h1>
        <p className="text-foreground-muted">Verwaltung der Plattform</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          href="/admin/schulen"
          icon={GraduationCap}
          title="Schulen"
          description="Schulen verwalten"
          count={1}
        />
        <QuickActionCard
          href="/admin/benutzer"
          icon={Users}
          title="Benutzer"
          description="Benutzer verwalten"
          count={4}
        />
        <QuickActionCard
          href="/admin/betriebe"
          icon={Building2}
          title="Betriebe"
          description="Alle Betriebe"
          count={0}
        />
        <QuickActionCard
          href="/admin/einstellungen"
          icon={Settings}
          title="Einstellungen"
          description="System-Konfiguration"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Aktivitäten</CardTitle>
          <CardDescription>Übersicht der letzten Aktionen auf der Plattform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground-muted text-sm">
            Keine Aktivitäten vorhanden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  count,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-background-muted cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Icon className="h-8 w-8 text-primary" />
            {count !== undefined && (
              <span className="text-2xl font-bold text-foreground">{count}</span>
            )}
          </div>
          <h3 className="mt-4 font-medium text-foreground">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
