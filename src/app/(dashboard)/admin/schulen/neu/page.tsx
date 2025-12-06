'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

export default function NeueSchulePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string,
      internshipDays: parseInt(formData.get('internshipDays') as string) || 15,
    };

    try {
      const response = await fetch('/api/admin/schulen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Fehler beim Anlegen der Schule');
      }

      router.push('/admin/schulen');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/schulen">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Neue Schule</h1>
          <p className="text-foreground-muted">Legen Sie eine neue Schule an</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schulinformationen</CardTitle>
          <CardDescription>Grunddaten der Schule</CardDescription>
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
                <Label htmlFor="name" required>Schulname</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Staatliche Wirtschaftsschule München"
                  required
                  onChange={(e) => {
                    const slugInput = document.getElementById('slug') as HTMLInputElement;
                    if (slugInput && !slugInput.dataset.manual) {
                      slugInput.value = generateSlug(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" required>URL-Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="ws-muenchen"
                  required
                  onChange={(e) => {
                    (e.target as HTMLInputElement).dataset.manual = 'true';
                  }}
                />
                <p className="text-xs text-foreground-muted">
                  Wird für URLs verwendet (z.B. /ws-muenchen)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                placeholder="Luisenstraße 29, 80333 München"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="verwaltung@schule.de"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+49 89 123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://schule.de"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="internshipDays">Praktikumstage</Label>
              <Input
                id="internshipDays"
                name="internshipDays"
                type="number"
                min="1"
                max="100"
                defaultValue="15"
              />
              <p className="text-xs text-foreground-muted">
                15 Tage (zweistufig) oder 20 Tage (drei-/vierstufig)
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/schulen">
                <Button type="button" variant="outline">Abbrechen</Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>
                Schule anlegen
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
