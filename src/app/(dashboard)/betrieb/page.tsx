import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge, Button } from '@/components/ui';
import { Users, CheckCircle2, Clock, FileText, Calendar } from 'lucide-react';

export default function BetriebDashboard() {
  return (
    <div className="space-y-6">
      {/* Begrüßung */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Willkommen, Müller GmbH
        </h1>
        <p className="text-foreground-muted">
          Sie betreuen aktuell 2 Praktikanten. Hier sehen Sie alle wichtigen Informationen.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aktive Praktikanten"
          value="2"
          icon={Users}
          description="1 endet diese Woche"
        />
        <StatCard
          title="Offene Bestätigungen"
          value="3"
          icon={CheckCircle2}
          description="Tage zur Bestätigung"
        />
        <StatCard
          title="Anstehender Besuch"
          value="Mi, 20.03."
          icon={Calendar}
          description="Lehrkraft Mustermann"
        />
        <StatCard
          title="Bewertungen"
          value="0/2"
          icon={FileText}
          description="Ausstehend"
        />
      </div>

      {/* Offene Anwesenheitsbestätigungen */}
      <Card>
        <CardHeader>
          <CardTitle>Offene Anwesenheitsbestätigungen</CardTitle>
          <CardDescription>
            Bitte bestätigen Sie die Anwesenheit Ihrer Praktikanten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnwesenheitRow
              praktikant="Anna Schmidt"
              datum="Heute, 06.12.2024"
              status="pending"
            />
            <AnwesenheitRow
              praktikant="Anna Schmidt"
              datum="Gestern, 05.12.2024"
              status="pending"
            />
            <AnwesenheitRow
              praktikant="Felix Braun"
              datum="Heute, 06.12.2024"
              status="pending"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Alle bestätigen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Meine Praktikanten */}
      <Card>
        <CardHeader>
          <CardTitle>Meine Praktikanten</CardTitle>
          <CardDescription>
            Übersicht über alle aktuellen und vergangenen Praktikanten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PraktikantRow
              name="Anna Schmidt"
              schule="Wirtschaftsschule München"
              zeitraum="18.03. - 29.03.2024"
              status="active"
              fortschritt={33}
              tage="5/15"
            />
            <PraktikantRow
              name="Felix Braun"
              schule="Wirtschaftsschule München"
              zeitraum="01.04. - 12.04.2024"
              status="active"
              fortschritt={20}
              tage="3/15"
            />
            <PraktikantRow
              name="Lisa Maier"
              schule="Wirtschaftsschule München"
              zeitraum="01.02. - 15.02.2024"
              status="completed"
              fortschritt={100}
              tage="15/15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Anstehende Termine */}
      <Card>
        <CardHeader>
          <CardTitle>Anstehende Termine</CardTitle>
          <CardDescription>
            Geplante Besuche und wichtige Termine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TerminRow
              title="Lehrkraft-Besuch"
              description="Herr Mustermann besucht Anna Schmidt"
              date="Mittwoch, 20.03."
              time="10:00 Uhr"
            />
            <TerminRow
              title="Praktikumsende Anna Schmidt"
              description="Bitte Bewertungsbogen ausfüllen"
              date="Freitag, 29.03."
              time="Ganztägig"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schnellaktionen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Anwesenheit bestätigen"
          description="Bestätigen Sie die Anwesenheit Ihrer Praktikanten"
          icon={CheckCircle2}
          href="/betrieb/praktikanten"
        />
        <QuickActionCard
          title="Bewertung abgeben"
          description="Füllen Sie den Bewertungsbogen aus"
          icon={FileText}
          href="/betrieb/bewertung"
        />
        <QuickActionCard
          title="Kontakt zur Schule"
          description="Nachricht an die betreuende Lehrkraft"
          icon={Users}
          href="/betrieb/nachrichten"
        />
      </div>
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
        <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function AnwesenheitRow({
  praktikant,
  datum,
  status,
}: {
  praktikant: string;
  datum: string;
  status: 'pending' | 'confirmed';
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-muted text-sm font-medium text-foreground">
          {praktikant.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-foreground">{praktikant}</p>
          <p className="text-sm text-foreground-muted">{datum}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === 'pending' ? (
          <>
            <Button variant="outline" size="sm">
              Nicht anwesend
            </Button>
            <Button size="sm">
              Bestätigen
            </Button>
          </>
        ) : (
          <StatusBadge status="success">Bestätigt</StatusBadge>
        )}
      </div>
    </div>
  );
}

function PraktikantRow({
  name,
  schule,
  zeitraum,
  status,
  fortschritt,
  tage,
}: {
  name: string;
  schule: string;
  zeitraum: string;
  status: 'active' | 'completed' | 'upcoming';
  fortschritt: number;
  tage: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-muted text-sm font-medium text-foreground">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{name}</p>
              <StatusBadge
                status={status === 'active' ? 'info' : status === 'completed' ? 'success' : 'neutral'}
              >
                {status === 'active' ? 'Aktiv' : status === 'completed' ? 'Abgeschlossen' : 'Geplant'}
              </StatusBadge>
            </div>
            <p className="text-sm text-foreground-muted">{schule}</p>
            <p className="text-sm text-foreground-muted">{zeitraum}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </div>
      {status !== 'completed' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-foreground-muted">Fortschritt</span>
            <span className="font-medium text-foreground">{tage} Tage</span>
          </div>
          <div className="h-2 rounded-full bg-background-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${fortschritt}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 rounded-lg border border-border bg-background-subtle p-4 transition-all hover:border-primary hover:shadow-primary"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>
    </a>
  );
}

function TerminRow({
  title,
  description,
  date,
  time,
}: {
  title: string;
  description: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-muted">
          <Clock className="h-5 w-5 text-foreground-muted" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">{date}</p>
        <p className="text-xs text-foreground-muted">{time}</p>
      </div>
    </div>
  );
}
