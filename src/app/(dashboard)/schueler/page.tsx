import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge, Button } from '@/components/ui';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function SchuelerDashboard() {
  return (
    <div className="space-y-6">
      {/* Begrüßung & Fortschritt */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Hallo Anna!
        </h1>
        <p className="text-foreground-muted">
          Dein Praktikum startet in 14 Tagen. Hier siehst du alle wichtigen Aufgaben.
        </p>
      </div>

      {/* Fortschrittsanzeige */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Praktikumsfortschritt</span>
            <span className="text-sm text-foreground-muted">5 von 15 Tagen</span>
          </div>
          <div className="h-3 rounded-full bg-background-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: '33%' }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-xs text-foreground-muted">Absolviert</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">10</p>
              <p className="text-xs text-foreground-muted">Verbleibend</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">1</p>
              <p className="text-xs text-foreground-muted">Nachzuholen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Mein Betrieb"
          value="Müller GmbH"
          icon={Building2}
          description="Hauptstraße 15, München"
        />
        <StatCard
          title="Praktikumszeitraum"
          value="18.03. - 05.04."
          icon={Calendar}
          description="3 Wochen"
        />
        <StatCard
          title="Offene Aufgaben"
          value="3"
          icon={AlertCircle}
          description="1 überfällig"
        />
        <StatCard
          title="Berichte"
          value="4/5"
          icon={FileText}
          description="Woche 5 fehlt"
        />
      </div>

      {/* Offene Aufgaben */}
      <Card>
        <CardHeader>
          <CardTitle>Deine nächsten Aufgaben</CardTitle>
          <CardDescription>
            Erledige diese Aufgaben vor den angegebenen Deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TaskRow
              title="Wochenbericht Woche 2"
              description="Beschreibe deine Tätigkeiten dieser Woche"
              dueDate="Heute"
              status="error"
              icon={FileText}
            />
            <TaskRow
              title="Tagesbestätigung einholen"
              description="Lass dir den heutigen Tag vom Betrieb bestätigen"
              dueDate="Heute, 18:00 Uhr"
              status="warning"
              icon={CheckCircle2}
            />
            <TaskRow
              title="Erwartungen formulieren"
              description="Was möchtest du im Praktikum lernen?"
              dueDate="In 3 Tagen"
              status="info"
              icon={FileText}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schnellaktionen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Tag bestätigen"
          description="Markiere den heutigen Tag als absolviert"
          icon={CheckCircle2}
          href="/schueler/praktikum"
        />
        <QuickActionCard
          title="Bericht schreiben"
          description="Neuen Tages- oder Wochenbericht erstellen"
          icon={FileText}
          href="/schueler/berichte/neu"
        />
        <QuickActionCard
          title="Krankmeldung"
          description="Melde dich krank und informiere alle Beteiligten"
          icon={AlertCircle}
          href="/schueler/krankmeldung"
        />
      </div>

      {/* Nächste Termine */}
      <Card>
        <CardHeader>
          <CardTitle>Nächste Termine</CardTitle>
          <CardDescription>
            Wichtige Termine in den nächsten Tagen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TerminRow
              title="Lehrkraft-Besuch"
              description="Herr Mustermann besucht dich im Betrieb"
              date="Mittwoch, 20.03."
              time="10:00 Uhr"
            />
            <TerminRow
              title="Praktikumsblock 1 Ende"
              description="Letzter Tag bei Müller GmbH"
              date="Freitag, 29.03."
              time="Ganztägig"
            />
            <TerminRow
              title="Praktikumsblock 2 Start"
              description="Erster Tag bei Schmidt & Partner"
              date="Montag, 01.04."
              time="08:00 Uhr"
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
        <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

function TaskRow({
  title,
  description,
  dueDate,
  status,
  icon: Icon,
}: {
  title: string;
  description: string;
  dueDate: string;
  status: 'success' | 'warning' | 'error' | 'info';
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background-muted">
        <Icon className="h-5 w-5 text-foreground-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{title}</p>
          <StatusBadge status={status}>{dueDate}</StatusBadge>
        </div>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>
      <Button variant="outline" size="sm">
        Erledigen
      </Button>
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
