# Entwicklungsfortschritt

## Aktueller Stand

**Datum:** 2025-12-06
**Phase:** MVP-Entwicklung
**Ziel:** Funktionsfähiger MVP mit durchgängigem Praktikums-Workflow

---

## 🎯 MVP-Ziel

Ein durchgängiger Workflow von "Schüler loggt sich ein" bis "Zertifikat wird generiert":
- Schüler sieht echten Fortschritt, bestätigt Tage, schreibt Berichte
- Betrieb bestätigt Anwesenheit, gibt Bewertung ab
- Lehrkraft sieht Ampel-Status aller Schüler, plant Besuche
- Admin verwaltet Schule, Benutzer, Konfiguration

---

## 📋 MVP-Phasen & Status

### Phase 1: Kern-Workflow ⬅️ AKTUELL
> Tägliche Nutzung durch Schüler, Betriebe, Lehrkräfte

- [ ] **11. Dashboards mit echten Daten**
  - [ ] Schüler-Dashboard: Daten aus DB laden
  - [ ] Betrieb-Dashboard: Praktikanten aus DB laden
  - [ ] Lehrer-Dashboard: Betreute Schüler aus DB laden
  - [ ] Server Components für Datenabfrage

- [ ] **12. Tage-Tracking**
  - [ ] Schüler: Tag als absolviert markieren
  - [ ] Betrieb: Anwesenheit bestätigen (einzeln + gesammelt)
  - [ ] Fortschrittsbalken mit echten Daten
  - [ ] Übersicht offene Bestätigungen

- [ ] **13. Berichtsheft**
  - [ ] Bericht erstellen (täglich/wöchentlich)
  - [ ] Bericht bearbeiten
  - [ ] Betrieb zeichnet ab
  - [ ] Lehrkraft kommentiert

- [ ] **14. Krankmeldung**
  - [ ] Krankmeldung erstellen
  - [ ] Automatische Benachrichtigung (Betrieb + Lehrkraft)
  - [ ] Nachholpflicht berechnen

### Phase 2: Verwaltung
> Einrichtung und Konfiguration

- [ ] **15. Betriebe verwalten**
  - [ ] Betrieb anlegen (Formular)
  - [ ] Betrieb bearbeiten
  - [ ] Kartenansicht (Leaflet + OpenStreetMap)
  - [ ] Weiterleitung zu Maps-App

- [ ] **16. Schüler & Praktika zuweisen**
  - [ ] Schüler anlegen/importieren
  - [ ] Praktikum erstellen und Schüler zuweisen
  - [ ] Lehrkraft zuweisen (primär + Vertretung)
  - [ ] Betrieb/Block zuweisen

- [ ] **17. Meilensteine konfigurieren**
  - [ ] Standard-Meilensteine anzeigen
  - [ ] Deadlines anpassen
  - [ ] Meilenstein als erledigt markieren

### Phase 3: Dokumente
> PDF-Generierung und Datei-Upload

- [ ] **18. Datei-Upload**
  - [ ] Upload-Komponente
  - [ ] Vertrag hochladen (unterschrieben)
  - [ ] Attest hochladen
  - [ ] Dateien anzeigen/herunterladen

- [ ] **19. PDF: Vertrag generieren**
  - [ ] Vertragsvorlage mit @react-pdf/renderer
  - [ ] Automatisch befüllen (Schüler, Betrieb, Zeitraum)
  - [ ] Download als PDF

- [ ] **20. PDF: Zertifikat generieren**
  - [ ] Zertifikatsvorlage
  - [ ] Schullogo einbinden
  - [ ] Automatisch aus Praktikumsdaten generieren

### Phase 4: Kommunikation & Abschluss
> Bewertung und Benachrichtigungen

- [ ] **21. Bewertungsbogen**
  - [ ] Betrieb füllt Bewertung aus (Likert-Skala)
  - [ ] Freitext-Felder
  - [ ] Bewertung für Lehrkraft sichtbar

- [ ] **22. Push-Benachrichtigungen**
  - [ ] Web Push API Setup
  - [ ] Deadline-Erinnerungen
  - [ ] Krankmeldung-Benachrichtigung

### Phase 5: Test & Polish
> Qualitätssicherung

- [ ] **23. End-to-End Tests**
  - [ ] Kompletter Workflow durchspielen
  - [ ] Alle Rollen testen

- [ ] **24. Feedback & Verbesserungen**
  - [ ] Testnutzer-Feedback einarbeiten
  - [ ] UI/UX-Verbesserungen
  - [ ] Performance-Optimierung

---

## ✅ Abgeschlossene Schritte

### 1. Projekt initialisiert
- [x] Next.js 16 mit App Router
- [x] TypeScript konfiguriert
- [x] Dependencies installiert

### 2. Design System (Tailwind v4)
- [x] Custom Theme mit @theme in globals.css
- [x] Dunkle Farbpalette mit Violett als Akzent
- [x] Design Tokens in TypeScript-Dateien
- [x] Custom Fonts (Plus Jakarta Sans, Source Sans 3, JetBrains Mono)

### 3. Datenbank-Schema (Drizzle ORM)
- [x] Alle Tabellen implementiert (schools, users, students, companies, internships, etc.)
- [x] Drizzle Config erstellt
- [x] Seed-Script mit umfangreichen Testdaten

### 4. Better Auth Setup
- [x] Auth-Konfiguration mit Username-Plugin
- [x] Login ohne E-Mail-Pflicht
- [x] Session-Management
- [x] Rollenbasierte Weiterleitung

### 5. Basis-UI-Komponenten
- [x] Button, Card, Input, Label, StatusBadge
- [x] Dashboard-Shell mit Sidebar
- [x] Mobile Navigation

### 6. Dashboards (mit Mock-Daten)
- [x] Schüler-Dashboard (`/schueler`)
- [x] Betrieb-Dashboard (`/betrieb`)
- [x] Lehrer-Dashboard (`/lehrer`)
- [x] Admin-Dashboard (`/admin`) mit Schulen/Benutzer-Verwaltung

### 7. Authentifizierung
- [x] Login-Seite
- [x] Protected Routes
- [x] Rollenbasierte Weiterleitung nach Login

---

## 🚀 Nächster Schritt

**Phase 1, Schritt 11: Dashboards mit echten Daten**

Aufgaben:
1. Server Components für Datenbankabfragen erstellen
2. Schüler-Dashboard: Eigenes Praktikum + Fortschritt laden
3. Betrieb-Dashboard: Zugewiesene Praktikanten laden
4. Lehrer-Dashboard: Betreute Schüler mit Status laden

Dateien die geändert/erstellt werden:
- `src/app/(dashboard)/schueler/page.tsx` → Server Component
- `src/app/(dashboard)/betrieb/page.tsx` → Server Component
- `src/app/(dashboard)/lehrer/page.tsx` → Server Component
- `src/lib/db/queries/` → Datenbank-Queries

---

## 🧪 Test-Accounts

**Passwort für alle: `test1234`**

| Username | Rolle | Beschreibung |
|----------|-------|--------------|
| admin | Super Admin | Plattform-Verwaltung |
| schulze | School Admin | Schul-Verwaltung |
| mustermann | Teacher | Klasse 10a |
| weber | Teacher | Klasse 10b |
| schmidt.anna | Student | Praktikum läuft (5/15 Tage) |
| mueller.ben | Student | Praktikum läuft (8/15 Tage) |
| braun.felix | Student | Praktikum läuft (12/15 Tage) |
| hoffmann.greta | Student | Praktikum abgeschlossen |
| bauer.emma | Student | Sucht Praktikum |
| mllergmbh | Betrieb | Müller GmbH |
| schmidtpartner | Betrieb | Schmidt & Partner |

---

## 💻 Lokale Entwicklung

```bash
# PostgreSQL starten
docker-compose up -d

# Schema in Datenbank pushen
npm run db:push

# Test-Daten seeden
npm run db:seed

# Dev-Server starten
npm run dev
```

---

## 📁 Projektstruktur

```
src/
├── app/
│   ├── (auth)/login/          # Login-Seite
│   ├── (dashboard)/
│   │   ├── admin/             # Admin-Bereich
│   │   ├── lehrer/            # Lehrkraft-Dashboard
│   │   ├── schueler/          # Schüler-Dashboard
│   │   └── betrieb/           # Betrieb-Dashboard
│   └── api/                   # API-Routen
├── components/
│   ├── ui/                    # Basis-Komponenten
│   └── layout/                # Layout-Komponenten
├── lib/
│   ├── auth/                  # Better Auth
│   ├── db/                    # Drizzle ORM
│   │   ├── schema/            # Tabellen-Definitionen
│   │   └── seed.ts            # Test-Daten
│   └── utils/
└── styles/
    └── globals.css            # Tailwind v4 Theme
```

---

## ⚠️ Bekannte Issues

- Passkey-Plugin (Face ID) noch nicht aktiviert
- Next.js 16 Warnung: "middleware" → "proxy"
- Docker PostgreSQL auf Port 5433 (5432 oft belegt)
