# practical – Konzept-Übersicht

> **Executive Summary und Dokumentenverzeichnis für practical.**
> Dieses Dokument gibt einen schnellen Überblick über das Gesamtkonzept und verweist auf alle Detail-Dokumente.

---

## Was ist practical?

**practical** ist eine App zur Verwaltung von Schülerpraktika an deutschen Schulen.

**Ziel:** Lehrkräfte entlasten, Schüler zur Eigenverantwortung führen, Betrieben minimalen Aufwand bereiten.

**Pilot:** Wirtschaftsschulen in Bayern (~70 Schulen)
**Langfristig:** Alle Schularten in ganz Deutschland (~30.000 Schulen)

---

## Kernprinzipien

1. **Lehrkräfte müssen es lieben** – Weniger Stress, klarer Überblick, kein Hinterherrennen
2. **Betriebe dürfen es nicht hassen** – Minimaler Aufwand, 5-Minuten-Beurteilung
3. **Schüler werden zur Eigenverantwortung geführt** – Klare Aufgaben, Nachweispflicht, Konsequenzen sichtbar
4. **Skalierbarkeit von Tag 1** – Keine hardcodierten Werte, alles konfigurierbar
5. **Datenschutz ohne UX-Verlust** – DSGVO-konform, aber kreativ und schlau gelöst

---

## Die 5 Phasen

```
Phase 1        Phase 2       Phase 3        Phase 4          Phase 5
BEWERBUNG  →   VERTRAG   →   PRAKTIKUM  →   NACHBEREITUNG →  NACHHOLEN
                                                             (optional)
```

| Phase | Schüler tut | Lehrkraft tut | Betrieb tut |
|-------|-------------|---------------|-------------|
| **1. Bewerbung** | Bewerbungen dokumentieren, Zusagen melden | Übersicht, Einspruch bei Bedarf | – |
| **2. Vertrag** | Unterschriften sammeln, abgeben | Prüfen, hochladen | Unterschreiben |
| **3. Praktikum** | Täglich Check-in, Krankmeldung | Besuche planen, Übersicht | Wöchentlich bestätigen |
| **4. Nachbereitung** | Reflexion, Betrieb bewerten | Bewerten, Note vergeben | Beurteilungsbogen |
| **5. Nachholen** | Selbstständig nachholen | Prüfen | – |

---

## Die 4 Rollen

| Rolle | Farbe | Hauptgerät | Wichtigste Aktionen |
|-------|-------|------------|---------------------|
| **Schüler** | Indigo #6366F1 | Smartphone | Bewerbungen tracken, Anwesenheit, Aufgaben |
| **Lehrkraft** | Emerald #10B981 | Desktop + Smartphone | Übersicht, Besuche, Bewertungen |
| **Betrieb** | Amber #F59E0B | Browser | Anwesenheit bestätigen, Beurteilung |
| **Admin** | Neutral | Desktop | Konfiguration, Import, Verwaltung |

---

## Gesetzliche Grundlage (Bayern WS)

| Schulform | Praktikumstage | Mindest-Betriebe |
|-----------|----------------|------------------|
| Zweistufig (Jgst. 10+11) | 15 Tage | 2 |
| Drei-/Vierstufig (Jgst. 8-10) | 20 Tage | 2 |

- Note fließt in Übungsunternehmen ein (einfach gewichtet)
- Praktikum = Voraussetzung für Zulassung zur Abschlussprüfung

---

## Architektur-Überblick

```
┌─────────────────────────────────────────┐
│  PROFILE (z.B. "WS Bayern")             │  → Vordefinierte Modul-Kombinationen
├─────────────────────────────────────────┤
│  MODULE (aktivierbar/deaktivierbar)     │  → ~40 optionale Features
├─────────────────────────────────────────┤
│  EVENTS (Kommunikation)                 │  → Module reagieren auf Events
├─────────────────────────────────────────┤
│  KERN-ENTITÄTEN (immer vorhanden)       │  → Student, Business, Placement, etc.
└─────────────────────────────────────────┘
```

---

## Dokumentenverzeichnis

### Konzept & Flows

| Dokument | Beschreibung |
|----------|--------------|
| **`FLOW-SCHUELER.md`** | Kompletter Schüler-Flow als ASCII-Diagramm. Alle Screens, Entscheidungspunkte, Erinnerungen. |
| **`FLOW-LEHRKRAFT.md`** | Lehrkraft-Flow: Dashboard, Verträge prüfen, Besuche planen, Bewerten. |
| **`FLOW-BETRIEB.md`** | Betrieb-Flow: Account-Aktivierung, Anwesenheit, Beurteilung, Besuche. |
| **`FLOW-ADMIN.md`** | Admin-Flow: Schul-Setup, Import, Konfiguration, Verwaltung. |

### Entscheidungen (pro Rolle)

| Dokument | Beschreibung |
|----------|--------------|
| **`ENTSCHEIDUNGEN-SCHUELER.md`** | Alle Entscheidungen zum Schüler-Flow: Bewerbungs-Tracking, Zusagen, Krankmeldung, Teilzusagen, Zertifikate. |
| **`ENTSCHEIDUNGEN-LEHRKRAFT.md`** | Entscheidungen für Lehrkraft: Einspruchsfenster, Vertragsprozess, Betriebsbesuche, Bewertung, internes Feedback. |
| **`ENTSCHEIDUNGEN-BETRIEB.md`** | Entscheidungen für Betriebe: Authentifizierung (Magic Link + Passkey), Anwesenheitsbestätigung, Beurteilungsbogen. |
| **`ENTSCHEIDUNGEN-ADMIN.md`** | Admin-Entscheidungen: Import, Betreuungs-Zuweisung, Wiederholer, Deadlines. |
| **`ENTSCHEIDUNGEN-DATENSCHUTZ.md`** | Datenschutz: DSGVO, Rechtsgrundlagen, Authentifizierung, Attest-Handling, VIDIS/ByCS-Vorbereitung. |

### Architektur

| Dokument | Beschreibung |
|----------|--------------|
| **`architektur/OVERVIEW.md`** | Architektur-Übersicht: Die 4 Ebenen (Kern, Module, Events, Profile). |
| **`architektur/KERN-ENTITAETEN.md`** | Basis-Datenmodell: Student, Business, Period, Placement, Attendance, etc. |
| **`architektur/MODULE.md`** | Alle ~40 Module im Detail: Verantwortung, Entitäten, Events, Parameter. **Hauptreferenz für Implementierung.** |
| **`architektur/EVENTS.md`** | Event-Katalog: Alle Events, Payloads, Subscriber. |
| **`architektur/PROFILE.md`** | Schulart-Profile: WS Bayern, MS Bayern. Parameter, Module, Admin-Config. |
| **`architektur/VOLLSTAENDIGKEITSPRUEFUNG.md`** | Validierung der Architektur gegen Flows und Entscheidungen. |

### Technologie & Design

| Dokument | Beschreibung |
|----------|--------------|
| **`TECH-STACK.md`** | Technologie-Entscheidungen: Next.js 15, PostgreSQL, Drizzle, Better Auth, Tailwind. |
| **`DESIGN.md`** | Design-System: "Quiet Confidence" Aesthetic, Farben, Typografie, Komponenten. |
| **`SKALIERBARKEIT.md`** | Skalierbarkeits-Konzept: Bundesland-Unterschiede, Profile, konfigurierbare Parameter. |

### Sonstiges

| Dokument | Beschreibung |
|----------|--------------|
| **`EDGE-CASES.md`** | Sonderfälle: Sitzenbleiben, Schulwechsel, Abbruch, Offline-Betriebe, Datensammeln. |
| **`V2-FEATURES.md`** | Geplante Features für nach dem Pilot: Eltern-Benachrichtigung, Gamification, QR-Code, Exporte. |
| **`NAECHSTER-SCHRITT.md`** | Aktueller Projektstand und nächste Schritte. |

### Veraltete Dokumente

| Ordner | Beschreibung |
|--------|--------------|
| **`alt/`** | Alte Konzepte aus früherem Implementierungsversuch. **Nicht mehr relevant.** |
| **`research/`** | Recherche-Ergebnisse zu Datenschutz, Marktanalyse, etc. Nur als Hintergrund. |

---

## Wichtige Konzepte auf einen Blick

### Einspruchsfenster (36h)
Nach jeder Schüler-Zusage hat die Lehrkraft 36h Zeit für Einspruch. Wochenenden pausieren. Kein Einspruch = automatische Freigabe.

### Teilzusagen
Schüler kann Zusagen für Teilzeiträume bekommen (z.B. 5 von 10 Tagen). System trackt Abdeckung, zeigt fehlende Tage, erlaubt parallele Bewerbung.

### Anwesenheit: Zwei-Stufen-System
1. **Schüler:** Täglich "Ich war da" (Selbstmeldung)
2. **Betrieb:** Wöchentlich bestätigen (Validierung)

### Attest-Handling (DSGVO)
Attest-Foto wird nach Lehrkraft-Bestätigung automatisch gelöscht. Nur Vermerk "Attest: ✅" bleibt.

### Betrieb-Authentifizierung
Magic Link + E-Mail-Code → Optional Passkey-Einrichtung (1-Klick-Login). 90 Tage Session.

### Benotung
Komponenten: Bewerbungsprozess (20%) + Lernaufgaben (30%) + Betriebs-Feedback (30%) + Gesamteindruck (20%). Alles konfigurierbar.

---

## Lesereihenfolge für neue Entwickler

1. **Dieses Dokument** – Gesamtüberblick
2. **`architektur/OVERVIEW.md`** – Architektur-Prinzipien
3. **`architektur/MODULE.md`** – Hauptreferenz für Features
4. **`TECH-STACK.md`** – Technologie-Entscheidungen
5. **`FLOW-SCHUELER.md`** – Beispiel für einen kompletten Flow
6. **Bei Fragen:** Entsprechende `ENTSCHEIDUNGEN-*.md` nachschlagen

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-11 | Komplette Neustrukturierung als Executive Summary mit Dokumentenverzeichnis |
