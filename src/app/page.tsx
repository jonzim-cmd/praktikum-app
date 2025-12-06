import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Praktikumsverwaltung</h1>
          <p className="text-foreground-muted text-lg">
            Design System Demo
          </p>
          <Link href="/lehrer">
            <Button size="lg">Dashboard Demo ansehen</Button>
          </Link>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Button-Varianten mit verschiedenen Zuständen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Klein</Button>
              <Button size="md">Mittel</Button>
              <Button size="lg">Groß</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button isLoading>Loading</Button>
              <Button disabled>Deaktiviert</Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Status-Badges (Ampel-System)</CardTitle>
            <CardDescription>Für Praktikums-Status und Meilensteine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="success">Im Plan</StatusBadge>
              <StatusBadge status="warning">Aufmerksamkeit</StatusBadge>
              <StatusBadge status="error">Kritisch</StatusBadge>
              <StatusBadge status="info">Information</StatusBadge>
              <StatusBadge status="neutral">Neutral</StatusBadge>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Formular-Elemente</CardTitle>
            <CardDescription>Inputs mit Labels und Validierung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" required>E-Mail</Label>
              <Input id="email" type="email" placeholder="max.mustermann@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" required>Passwort</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="error-input">Mit Fehlermeldung</Label>
              <Input
                id="error-input"
                error="Dieses Feld ist erforderlich"
                placeholder="Fehlerhafte Eingabe"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Farbpalette</CardTitle>
            <CardDescription>Dunkles Theme mit Violett als Primärfarbe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  Primary
                </div>
                <p className="text-xs text-center text-foreground-muted">#694AFF</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-success flex items-center justify-center text-background text-sm font-medium">
                  Success
                </div>
                <p className="text-xs text-center text-foreground-muted">#41DF82</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-warning flex items-center justify-center text-background text-sm font-medium">
                  Warning
                </div>
                <p className="text-xs text-center text-foreground-muted">#FF5900</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-error flex items-center justify-center text-white text-sm font-medium">
                  Error
                </div>
                <p className="text-xs text-center text-foreground-muted">#D7003D</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-background border border-border flex items-center justify-center text-foreground text-sm font-medium">
                  Background
                </div>
                <p className="text-xs text-center text-foreground-muted">#1E1E1E</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-background-subtle border border-border flex items-center justify-center text-foreground text-sm font-medium">
                  Subtle (Cards)
                </div>
                <p className="text-xs text-center text-foreground-muted">#111111</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-background-muted border border-border flex items-center justify-center text-foreground text-sm font-medium">
                  Muted
                </div>
                <p className="text-xs text-center text-foreground-muted">#2A2A2A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
