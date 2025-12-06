'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface School {
  id: string;
  name: string;
  slug: string;
}

const roles = [
  { value: 'super_admin', label: 'Super Admin', needsSchool: false },
  { value: 'school_admin', label: 'Schul-Admin', needsSchool: true },
  { value: 'teacher', label: 'Lehrkraft', needsSchool: true },
  { value: 'student', label: 'Schüler', needsSchool: true },
  { value: 'company_user', label: 'Betrieb', needsSchool: true },
];

export default function NeuerBenutzerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedRole, setSelectedRole] = useState('student');

  useEffect(() => {
    fetch('/api/admin/schulen')
      .then((res) => res.json())
      .then((data) => setSchools(data))
      .catch(() => setSchools([]));
  }, []);

  const needsSchool = roles.find((r) => r.value === selectedRole)?.needsSchool ?? true;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
      schoolId: formData.get('schoolId') as string || null,
    };

    try {
      const response = await fetch('/api/admin/benutzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Fehler beim Anlegen des Benutzers');
      }

      router.push('/admin/benutzer');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  }

  function generateUsername(firstName: string, lastName: string): string {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9.]+/g, '');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/benutzer">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Neuer Benutzer</h1>
          <p className="text-foreground-muted">Legen Sie einen neuen Benutzer an</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benutzerinformationen</CardTitle>
          <CardDescription>Grunddaten des Benutzers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-error-bg p-3 text-sm text-error-text">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" required>Vorname</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Max"
                  required
                  onChange={(e) => {
                    const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
                    const usernameInput = document.getElementById('username') as HTMLInputElement;
                    if (usernameInput && lastNameInput && !usernameInput.dataset.manual) {
                      usernameInput.value = generateUsername(e.target.value, lastNameInput.value);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" required>Nachname</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Mustermann"
                  required
                  onChange={(e) => {
                    const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
                    const usernameInput = document.getElementById('username') as HTMLInputElement;
                    if (usernameInput && firstNameInput && !usernameInput.dataset.manual) {
                      usernameInput.value = generateUsername(firstNameInput.value, e.target.value);
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username" required>Benutzername</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="max.mustermann"
                  required
                  onChange={(e) => {
                    (e.target as HTMLInputElement).dataset.manual = 'true';
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" required>Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-foreground-muted">Mindestens 8 Zeichen</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" required>Rolle</Label>
                <select
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {needsSchool && (
                <div className="space-y-2">
                  <Label htmlFor="schoolId" required>Schule</Label>
                  <select
                    id="schoolId"
                    name="schoolId"
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                    required={needsSchool}
                  >
                    <option value="">Schule auswählen...</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  {schools.length === 0 && (
                    <p className="text-xs text-warning-text">
                      Keine Schulen vorhanden. Bitte zuerst eine Schule anlegen.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/benutzer">
                <Button type="button" variant="outline">Abbrechen</Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>
                Benutzer anlegen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
