import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { StatusBadge } from '@/components/ui';
import { Users, Building2, Calendar, AlertTriangle } from 'lucide-react';

export default function LehrerDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Betreute Schüler"
          value="24"
          icon={Users}
          description="3 brauchen Aufmerksamkeit"
        />
        <StatCard
          title="Betriebe"
          value="18"
          icon={Building2}
          description="2 neue diese Woche"
        />
        <StatCard
          title="Offene Besuche"
          value="5"
          icon={Calendar}
          description="Nächster: Morgen"
        />
        <StatCard
          title="Offene Aufgaben"
          value="8"
          icon={AlertTriangle}
          description="2 überfällig"
        />
      </div>

      {/* Schüler-Übersicht */}
      <Card>
        <CardHeader>
          <CardTitle>Schüler mit Handlungsbedarf</CardTitle>
          <CardDescription>
            Diese Schüler benötigen Ihre Aufmerksamkeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StudentRow
              name="Anna Schmidt"
              class="10a"
              status="error"
              statusText="Vertrag fehlt"
              daysLeft={3}
            />
            <StudentRow
              name="Ben Müller"
              class="10b"
              status="warning"
              statusText="Bericht überfällig"
              daysLeft={-2}
            />
            <StudentRow
              name="Clara Weber"
              class="10a"
              status="warning"
              statusText="Krankmeldung offen"
              daysLeft={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anstehende Besuche */}
      <Card>
        <CardHeader>
          <CardTitle>Anstehende Betriebsbesuche</CardTitle>
          <CardDescription>
            Ihre geplanten Besuche in den nächsten Tagen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <VisitRow
              company="Müller GmbH"
              student="Felix Braun"
              date="Morgen, 10:00 Uhr"
              address="Hauptstraße 15, München"
            />
            <VisitRow
              company="Schmidt & Partner"
              student="Lisa Maier"
              date="Donnerstag, 14:00 Uhr"
              address="Bahnhofstraße 8, München"
            />
            <VisitRow
              company="Tech Solutions AG"
              student="Tim Hoffmann"
              date="Freitag, 09:00 Uhr"
              address="Industriepark 22, München"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground-muted">{title}</p>
          <Icon className="h-4 w-4 text-foreground-muted" />
        </div>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function StudentRow({
  name,
  class: className,
  status,
  statusText,
  daysLeft,
}: {
  name: string;
  class: string;
  status: 'success' | 'warning' | 'error';
  statusText: string;
  daysLeft: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-muted text-sm font-medium text-foreground">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-foreground-muted">Klasse {className}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <StatusBadge status={status}>{statusText}</StatusBadge>
        <span className="text-sm text-foreground-muted">
          {daysLeft > 0 ? `${daysLeft} Tage` : `${Math.abs(daysLeft)} Tage überfällig`}
        </span>
      </div>
    </div>
  );
}

function VisitRow({
  company,
  student,
  date,
  address,
}: {
  company: string;
  student: string;
  date: string;
  address: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <p className="font-medium text-foreground">{company}</p>
        <p className="text-sm text-foreground-muted">{student} • {address}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">{date}</p>
      </div>
    </div>
  );
}
