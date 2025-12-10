# Architektur: Übersicht

> Dieses Dokument beschreibt die Architektur-Prinzipien für eine skalierbare, erweiterbare Praktikumsverwaltung.

---

## Ziel

Eine App für Wirtschaftsschulen Bayern (Pilot), die später auf andere Schularten (Mittelschule, Realschule, etc.) und Bundesländer erweiterbar ist – **ohne kompletten Umbau**.

---

## Die 4 Ebenen

```
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 1: KERN-ENTITÄTEN                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Daten die IMMER existieren, unabhängig von Schulart:          │
│  Student, Business, Period, Placement, Attendance               │
│                                                                 │
│  → Siehe: KERN-ENTITAETEN.md                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 2: MODULE                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Optionale Fähigkeiten (an/aus), z.B.:                         │
│  • contract – Formeller Vertrag mit Unterschriften             │
│  • approval_window – 36h Einspruchsfenster                     │
│  • grading – Benotung des Praktikums                           │
│                                                                 │
│  Jedes Modul bringt mit:                                       │
│  • Eigene Entitäten (Datenmodell-Erweiterung)                  │
│  • Input: Was braucht es von anderen?                          │
│  • Output: Welche Events produziert es?                        │
│  • Parameter: Was ist konfigurierbar?                          │
│                                                                 │
│  → Siehe: MODULE.md                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 3: EVENTS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Kommunikation zwischen Modulen:                               │
│  • contract.approved → triggert Placement + Business-Account   │
│  • sick.certificate_confirmed → triggert catch_up              │
│                                                                 │
│  Events entkoppeln Module voneinander.                         │
│  Neue Module können auf bestehende Events reagieren.           │
│                                                                 │
│  → Siehe: EVENTS.md                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 4: PROFILE                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Vordefinierte Kombinationen aus Modulen + Parametern:         │
│                                                                 │
│  "Wirtschaftsschule Bayern"                                     │
│    Module: [application_tracking, contract, grading, ...]      │
│    Parameter: {required_days: 20, min_businesses: 2, ...}      │
│                                                                 │
│  "Mittelschule Bayern" (später)                                 │
│    Module: [application_tracking, catch_up]                    │
│    Parameter: {required_days: 10, min_businesses: 1, ...}      │
│                                                                 │
│  → Siehe: PROFILE.md                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Vom Konzept zur Implementierung

| Konzept-Ebene | Wird später zu... |
|---------------|-------------------|
| Kern-Entitäten | Datenbank-Tabellen (immer vorhanden) |
| Module | Code-Packages / Feature-Flags |
| Events | Event-Bus / Message Queue |
| Profile | Konfigurations-Presets |

---

## Architektur-Stile (für Implementierung)

### Hexagonale Architektur (Ports & Adapters)

Module sind unabhängige Einheiten mit klaren Schnittstellen:
- **Input-Ports:** Was das Modul braucht (Events, Daten)
- **Output-Ports:** Was das Modul produziert (Events)
- **Adapter:** Konkrete Implementierung (DB, UI, etc.)

### Event-Driven Architecture

Module kommunizieren über Events, nicht direkte Aufrufe:
- Lose Kopplung
- Neue Module können auf bestehende Events reagieren
- Einfacher zu testen und erweitern

### Multi-Tenancy

Jede Schule ist ein Tenant mit eigener Konfiguration:
- Eigenes Profil (oder Custom)
- Eigene Parameter-Überschreibungen
- Daten-Isolation

---

## Dateien in diesem Ordner

| Datei | Inhalt |
|-------|--------|
| `OVERVIEW.md` | Diese Übersicht |
| `KERN-ENTITAETEN.md` | Basis-Datenmodell (Student, Business, etc.) |
| `MODULE.md` | Alle optionalen Module mit Details |
| `EVENTS.md` | Event-Katalog |
| `PROFILE.md` | Vordefinierte Schulart-Profile |

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version |
