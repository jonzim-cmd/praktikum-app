'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, getSession } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function getDefaultRedirectForRole(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'school_admin':
      return '/admin';
    case 'teacher':
      return '/lehrer';
    case 'company_user':
      return '/betrieb';
    case 'student':
    default:
      return '/schueler';
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get('redirect');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn.username({
        username,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Anmeldung fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      // Determine redirect based on user role
      let redirectTo = explicitRedirect;
      if (!redirectTo) {
        const session = await getSession();
        const userRole = (session?.data?.user as { role?: string })?.role || 'student';
        redirectTo = getDefaultRedirectForRole(userRole);
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-error-bg p-3 text-sm text-error-text">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" required>
          Benutzername
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="max.mustermann"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" required>
          Passwort
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Anmelden
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Passwort vergessen?{' '}
        <Link
          href="/passwort-vergessen"
          className="text-primary hover:underline"
        >
          Zurücksetzen
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold">
            P
          </div>
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Praktikumsverwaltung für Schulen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 animate-pulse" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
