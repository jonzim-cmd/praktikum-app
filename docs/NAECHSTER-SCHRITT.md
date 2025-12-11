# Nächste Schritte

## Kontext

Die Grundkonzeption ist abgeschlossen:
- ✅ Schüler-Flow
- ✅ Lehrkraft-Flow
- ✅ Betrieb-Flow
- ✅ Alle Entscheidungen dokumentiert
- ✅ Skalierbarkeit als Pflicht definiert

---

## Aktueller Stand der Dokumente

| Dokument | Status |
|----------|--------|
| **KONZEPT** | |
| `KONZEPT-V2.md` | ✅ Fertig |
| `SKALIERBARKEIT.md` | ⚠️ Muss befüllt werden |
| `EDGE-CASES.md` | ✅ Fertig |
| `V2-FEATURES.md` | ✅ Fertig |
| **FLOWS** | |
| `FLOW-SCHUELER.md` | ✅ Fertig |
| `FLOW-LEHRKRAFT.md` | ✅ Fertig |
| `FLOW-BETRIEB.md` | ✅ Fertig |
| `FLOW-ADMIN.md` | ✅ Fertig (inkl. Superadmin-Flow) |
| **ENTSCHEIDUNGEN** | |
| `ENTSCHEIDUNGEN-SCHUELER.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-LEHRKRAFT.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-BETRIEB.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-ADMIN.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-DATENSCHUTZ.md` | ✅ Fertig (inkl. VIDIS/ByCS) |
| **ARCHITEKTUR** | |
| `architektur/OVERVIEW.md` | ✅ Fertig |
| `architektur/KERN-ENTITAETEN.md` | ✅ Fertig |
| `architektur/MODULE.md` | ✅ ~40 Module dokumentiert |
| `architektur/EVENTS.md` | ✅ Fertig |
| `architektur/PROFILE.md` | ✅ Fertig (WS Bayern + MS Bayern) |
| `architektur/VOLLSTAENDIGKEITSPRUEFUNG.md` | ✅ Fertig |
| **TECH & DESIGN** | |
| `TECH-STACK.md` | ✅ NEU – Fertig |
| `DESIGN.md` | ✅ NEU – Fertig |

---

## 🚨 AKTUELL: Bereit für Implementierung

> Konzeptphase abgeschlossen. Tech-Stack und Design dokumentiert.
> **Nächster Schritt:** Implementierung starten oder SKALIERBARKEIT.md befüllen.

---

## ✅ ERLEDIGT: Architektur-Module vervollständigen

### Was wurde gemacht

FLOW-SCHUELER.md wurde analysiert und in die Architektur-Dokumente überführt:
- Kern-Entitäten extrahiert (Student, Business, Period, Placement, Attendance)
- 15 Module identifiziert und dokumentiert
- Event-Katalog begonnen
- WS Bayern Profil als Entwurf erstellt

### Was noch fehlt

**Schritt 1: FLOW-LEHRKRAFT.md + ENTSCHEIDUNGEN-LEHRKRAFT.md analysieren** ✅ ERLEDIGT

```
Ergebnis (vollständig):

NEUE MODULE (10 Stück):
1. ✅ visit_scheduling (Praxisbesuche planen)
2. ✅ inbox (Aufgaben-Queue für Lehrkraft)
3. ✅ batch_operations (Mehrere Schüler gleichzeitig)
4. ✅ notification_settings (Benachrichtigungs-Einstellungen)
5. ✅ teacher_reminders (Erinnerungen AN Lehrkräfte)
6. ✅ business_blacklist (Betrieb-Sperrliste)
7. ✅ onboarding (Einführung beim ersten Login)
8. ✅ duplicate_detection (Betrieb-Duplikaterkennung mit Photon API)
9. ✅ teacher_assignment (Betreuungs-Zuweisung)
10. ✅ archival (Archivierung + DSGVO-Löschung)

ERWEITERTE MODULE (5 Stück):
- ✅ approval_window: Einspruch-Workflow, Ferien pausieren NICHT
- ✅ contract: Status "Bei Schulleitung", business_account_trigger konfigurierbar
- ✅ catch_up: Zuständigkeit konfigurierbar (teacher/admin)
- ✅ grading: Mehrere LK, Rollen-Zuweisung (3 Ebenen), Fallback ohne Betrieb
- ✅ business_feedback: Korrektur-Workflow (Freigabe durch LK)

EVENTS:
- ✅ ~30 neue Events dokumentiert
- ✅ Event-Flüsse (Betriebsbesuch, Korrekturanfrage)

Aktuelle Modul-Anzahl: 25 (vorher 15)
```

**Schritt 2: FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md analysieren** ✅ ERLEDIGT

```
Ergebnis (vollständig):

NEUE MODULE (4 Stück):
1. ✅ business_account (Account-Erstellung, Multi-Auth: Magic Link/Passwort/Passkey)
2. ✅ attendance_confirmation (Wöchentliche Bestätigung, KEINE stillschweigende Bestätigung!)
3. ✅ praktikumsdatenbank (Opt-in für Betriebe als Praktikumsanbieter)
4. ✅ email_templates (6 E-Mail-Typen für Betriebskommunikation)

ERWEITERTE MODULE (2 Stück):
- ✅ onboarding: Betrieb-spezifisches Onboarding (3 Screens)
- ✅ visit_scheduling: Betrieb-Verfügbarkeit (2h-Slots), Terminvorschlag-UI

EVENTS:
- ✅ ~17 neue Events dokumentiert
- ✅ Event-Flüsse (Betrieb-Onboarding, Wöchentliche Anwesenheitsbestätigung)

Aktuelle Modul-Anzahl: 29 (vorher 25)
```

**Schritt 3: Vollständigkeitsprüfung (Validierung)** ✅ ERLEDIGT

```
Ergebnis (vollständig):

NEU ERSTELLT:
- ✅ architektur/VOLLSTAENDIGKEITSPRUEFUNG.md

LÜCKEN IDENTIFIZIERT UND GESCHLOSSEN:

1. ✅ business_account erweitert:
   - "Problem melden" Flow (falsche E-Mail)
   - Kollegen einladen
   - Aktivitäts-Tracking
   - Link-Gültigkeits-Details
   - 4 neue Parameter

2. ✅ attendance_confirmation erweitert:
   - Sammel-Ansicht für mehrere Praktikanten
   - Hinweis: Eine E-Mail für alle

3. ✅ business_feedback erweitert:
   - Auto-Save dokumentiert
   - Sammel-Ansicht für mehrere Praktikanten
   - "Speichern & Nächster" Button
   - 2 neue Parameter

Noch offene Lücken (niedrige Priorität):
- Lehrkraft-E-Mail-Templates (nur Betrieb-Templates dokumentiert)
- Zentrales Erinnerungs-Schema (3→5→7 Tage)
- Teilzusage-Logik Details

Aktuelle Modul-Anzahl: 29 (unverändert, aber deutlich erweitert)
```

**Schritt 4: Events konsolidieren** ⏳ OFFEN

```
Aufgabe:
1. Prüfe architektur/EVENTS.md auf Vollständigkeit
2. Stelle sicher: Jedes Event hat Produzent + Konsumenten
3. Prüfe: Sind alle Modul-Outputs als Events dokumentiert?
4. Erstelle Event-Fluss-Diagramme für wichtige Prozesse

Status: Nicht begonnen
```

**Schritt 5: Profile finalisieren** ⏳ OFFEN

```
Aufgabe:
1. Prüfe architektur/PROFILE.md
2. WS Bayern Profil: Sind alle Module korrekt konfiguriert?
3. MS Bayern Entwurf: Ist er realistisch basierend auf ISB-Handreichung?
4. Dokumentiere: Welche Parameter können Schulen überschreiben?

Status: Nicht begonnen (nur Entwürfe vorhanden)
```

**Schritt 6: Final Review** 🔄 TEILWEISE

```
Aufgabe:
1. Lies alle FLOW-*.md und ENTSCHEIDUNGEN-*.md
2. Prüfe: Ist jede dokumentierte Entscheidung in einem Modul abgebildet?
3. Prüfe: Sind alle UI-Elemente durch Module abgedeckt?
4. Liste Lücken auf und ergänze

Status: TEILWEISE ERLEDIGT
- ✅ VOLLSTAENDIGKEITSPRUEFUNG.md erstellt (systematischer Abgleich)
- ✅ Identifizierte Lücken geschlossen
- ❌ Admin-Flow fehlt noch → Review erst nach Admin-Flow sinnvoll
```

---

## TODO 1: Flows auf Konsistenz prüfen

### Alle drei Flows vergleichen

| Prüfpunkt | Dateien | Status |
|-----------|---------|--------|
| Synchronisation stimmt überein? | Alle FLOW-*.md | ⏳ |
| Begriffe konsistent? | Alle Dokumente | ⏳ |
| Keine widersprüchlichen Entscheidungen? | Alle ENTSCHEIDUNGEN-*.md | ⏳ |
| Alle Trigger/Reaktionen passen zusammen? | Alle FLOW-*.md | ⏳ |

### Konkrete Prüfpunkte

**Schüler → Betrieb:**
- [ ] Krankmeldung: Schüler meldet → Betrieb erhält Info (stimmt?)
- [ ] Anwesenheit: Schüler meldet täglich → Betrieb bestätigt wöchentlich (stimmt?)
- [ ] Zusage: Schüler gibt E-Mail ein → Warnung bei Sammel-Adresse (in beiden Flows?)

**Schüler → Lehrkraft:**
- [ ] Vertrag: Schüler lädt hoch → Lehrkraft prüft (Status-Übergänge konsistent?)
- [ ] Bewerbung: Schüler dokumentiert → Lehrkraft sieht Details (Zugriff definiert?)
- [ ] Krankmeldung: Schüler meldet → Lehrkraft erhält Info + Attest-Tracking

**Lehrkraft → Betrieb:**
- [ ] Besuchstermin: Lehrkraft schlägt vor → Betrieb reagiert (Flows passen?)
- [ ] Beurteilung: Lehrkraft erinnert → Betrieb füllt aus (Trigger konsistent?)
- [ ] Vertrag bestätigt → Betrieb erhält Account (Trigger korrekt?)

**Stillschweigende Bestätigung:**
- [ ] Nach 7 Tagen automatisch bestätigt (in allen Flows gleich?)
- [ ] Lehrkraft sieht "Automatisch bestätigt" Hinweis (dokumentiert?)

**Authentifizierung Betrieb:**
- [ ] Wahlmöglichkeit bei erster Mail (Passwort / Magic Link)
- [ ] Link-Anmeldung deaktivierbar
- [ ] Warnung "noch nicht final" in allen relevanten Stellen

---

## TODO 2: Admin-Flow erstellen

### Schuladmin (pro Schule)

**Aufgaben:**
- Schüler importieren/anlegen
- Lehrkräfte anlegen und Betreuungen zuweisen
- Praktikumszeiträume festlegen
- Ferien eintragen -> Ferien über API abrufen, z.B. https://openholidaysapi.org
- Schulkonfiguration anpassen
- Betriebe sperren (Blacklist)
- Duplikate zusammenführen
- Reports/Exporte

**Offene Fragen:**
- [ ] Wie funktioniert der Schüler-Import? (CSV? Excel? Schnittstelle zu Schulverwaltung?)
- [ ] Wie werden Betreuungen zugewiesen? (Klasse → Lehrkraft)
- [ ] Was kann Admin an der Schulkonfiguration ändern?
- [ ] Welche Reports gibt es?

### Superadmin (System-weit)

**Aufgaben:**
- Schulen anlegen
- Bundesland-Presets verwalten
- Schulart-Presets verwalten
- Systemweite Einstellungen
- Technische Wartung

**Offene Fragen:**
- [ ] Wie werden neue Schulen ongeboardet?
- [ ] Wie werden Bundesland-Presets gepflegt?
- [ ] Welche systemweiten Einstellungen gibt es?

---

## TODO 3: Skalierbarkeit ausarbeiten

### Flows auf Skalierbarkeit prüfen

Jeden Flow durchgehen und hardcodierte Annahmen finden:

| Flow | Zu prüfen |
|------|-----------|
| `FLOW-SCHUELER.md` | Begriffe, Phasen, Bewertung, Zeiträume |
| `FLOW-LEHRKRAFT.md` | Dashboard-Struktur, Bewertungskomponenten |
| `FLOW-BETRIEB.md` | Beurteilungsbogen, Anwesenheitsbestätigung |

### Checkliste pro Flow

- [ ] Welche Begriffe sind hardcoded? → Ins Glossar
- [ ] Welche Zahlen sind hardcoded? → In Config
- [ ] Welche Phasen werden vorausgesetzt? → Aktivierbar/Deaktivierbar?
- [ ] Welche Features werden vorausgesetzt? → Feature-Flags?
- [ ] Welche rechtlichen Annahmen? → Bundesland-spezifisch?

### SKALIERBARKEIT.md erweitern

- [ ] Konkrete Beispiele aus den Flows einarbeiten
- [ ] Mapping: Flow-Element → Konfigurationsparameter
- [ ] Bundesland-Unterschiede recherchieren (mindestens BY, BW, NRW)
- [ ] Schulart-Unterschiede dokumentieren (RS, MS, Gym)

---

## TODO 4: Technische Vorbereitung

Nach Abschluss der Konzeptphase:

- [ ] Datenmodell finalisieren (unter Berücksichtigung Skalierbarkeit)
- [ ] Tech-Stack festlegen
- [ ] Architektur-Entscheidungen dokumentieren
- [ ] MVP-Scope definieren (was ist Minimum für Pilot?)
- [ ] **Auth-System modular implementieren** (für spätere VIDIS/OIDC-Erweiterung)

### VIDIS/ByCS-Login (V2-Vorbereitung)

> Dokumentiert in `ENTSCHEIDUNGEN-DATENSCHUTZ.md` Sektion 17

**V1:** Passwort-Login für Schüler/Lehrkräfte (Pilotphase)
**V2:** + VIDIS/ByCS-Login als Option (nach erfolgreichem Pilot)

**Technische Vorbereitung (bereits in V1):**
- Auth-Provider OIDC-fähig wählen (Better Auth, NextAuth, Lucia)
- Login-Screen: Platz für "Login mit ByCS"-Button vorsehen (deaktiviert)
- Datenverarbeitung EU-only (Hetzner) ✅
- Löschung nach 18 Monaten Inaktivität einplanen

**Links:**
- https://www.vidis.schule/bildungsanbieter/
- https://www.vidis.schule/wp-content/uploads/sites/10/2024/12/Pruefkriterien-VIDIS-V0.2.pdf

---

## Empfohlene Reihenfolge

```
KONZEPT-PHASE: ✅ ABGESCHLOSSEN

1. ✅ Flows erstellen (Schüler, Lehrkraft, Betrieb, Admin)
2. ✅ Entscheidungen dokumentieren (alle Rollen + Datenschutz)
3. ✅ Module aus Flows extrahieren (~40 Module)
4. ✅ Vollständigkeitsprüfung durchgeführt
5. ✅ Events konsolidiert
6. ✅ Profile finalisiert (WS Bayern + MS Bayern)

TECH & DESIGN: ✅ ABGESCHLOSSEN

7. ✅ Tech-Stack dokumentiert (TECH-STACK.md)
   └── Next.js 15, TypeScript, PostgreSQL, Drizzle
   └── Better Auth (OIDC-ready für VIDIS)
   └── Tailwind v4 + shadcn/ui
   └── Hetzner + Coolify

8. ✅ Design System dokumentiert (DESIGN.md)
   └── Dark Violet Theme (#694AFF)
   └── Instrument Sans + IBM Plex Sans
   └── Token-basiert, Single Source of Truth

NOCH OFFEN:

9. ⚠️ SKALIERBARKEIT.md befüllen (aktuell leer)
   └── Bundesland-Unterschiede dokumentieren
   └── Schulart-Unterschiede dokumentieren
   └── Konfigurations-Parameter auflisten

IMPLEMENTIERUNGS-PHASE: ← NÄCHSTER SCHRITT

10. MVP-Scope definieren
    └── Welche Module für Pilot?
    └── Welche Features später?

11. Implementierung starten
    └── Projekt-Setup
    └── DB-Schema
    └── Auth
    └── Erste Features
```

---

## Bewährter Prozess

So haben wir bei den bisherigen Flows gearbeitet:

1. **Groben Flow verstehen** – Dokumente lesen, Zusammenhänge erfassen
2. **Rückfragen stellen & Challengen** – Unklarheiten ansprechen, Alternativen vorschlagen
3. **Wenn alle Fragen geklärt** → Flow-Diagramm erstellen
4. **Nochmal prüfen** – Gemeinsam durchgehen, Lücken finden, korrigieren

**Wichtig:** Nicht direkt das Diagramm erstellen! Erst verstehen und diskutieren.

---

## Letzte Änderung

**Datum:** 2024-12-10
**Session:** Teilzusage-Dokumentation + Statusupdate

### Was in dieser Session passiert ist:

1. **Teilzusage-Logik vollständig dokumentiert:**
   - `ENTSCHEIDUNGEN-SCHUELER.md`: Ausführliche Sektion mit Dashboard-Mockups, Dringlichkeitsregeln
   - `FLOW-SCHUELER.md`: Verweis auf Details
   - `MODULE.md` (commitment): CommitmentCoverage-Entität, neue Events, Parameter
   - `FLOW-LEHRKRAFT.md`: Teilzusage-Hinweis in Zusage-Details, eigene Kategorie in Übersicht
   - `ENTSCHEIDUNGEN-LEHRKRAFT.md`: Sichtbarkeit für Lehrkraft dokumentiert
   - `VOLLSTAENDIGKEITSPRUEFUNG.md`: Teilzusage als ✅ markiert

2. **Status geklärt:**
   - Architektur-Validierung (Schritte 4, 5, 6) noch nicht vollständig
   - Empfohlene Reihenfolge: Admin-Flow → dann Validierung → dann Tech-Entscheidungen

3. **Nächster Schritt:** Admin-Flow erstellen

---

### Vorherige Session (2024-12-10): Vollständigkeitsprüfung

#### Was passiert ist:

1. **Vollständigkeitsprüfung durchgeführt:**
   - Alle FLOW-*.md und ENTSCHEIDUNGEN-*.md systematisch gegen MODULE.md geprüft
   - Checkliste erstellt: `architektur/VOLLSTAENDIGKEITSPRUEFUNG.md`
   - Lücken identifiziert und priorisiert

2. **Lücken geschlossen:**
   - `business_account` erweitert:
     - "Problem melden" Flow (falsche E-Mail)
     - Kollegen einladen
     - Aktivitäts-Tracking
     - Link-Gültigkeits-Details
     - 4 neue Parameter
   - `attendance_confirmation` erweitert:
     - Sammel-Ansicht für mehrere Praktikanten
   - `business_feedback` erweitert:
     - Auto-Save dokumentiert
     - Sammel-Ansicht für mehrere Praktikanten
     - 2 neue Parameter

3. **Verbleibende Lücken (niedrige Priorität):**
   - Lehrkraft-E-Mail-Templates
   - Zentrales Erinnerungs-Schema
   - Teilzusage-Logik Details

4. **Aktueller Modul-Stand:**
   - 29 Module (unverändert, aber deutlich erweitert)

5. **Nächster Schritt:**
   - Events konsolidieren (Schritt 4)
   - Profile finalisieren (Schritt 5)

### Vorherige Sessions:

**2024-12-10 (Betrieb-Flow):**
- 4 neue Module (business_account, attendance_confirmation, praktikumsdatenbank, email_templates)
- 2 Module erweitert (onboarding, visit_scheduling)
- ~17 neue Events

**2024-12-10 (Lehrkraft-Flow):**
- 10 neue Module aus FLOW-LEHRKRAFT.md
- 5 Module erweitert
- ~30 neue Events

**2024-12-10 (Schüler-Flow):**
- Architektur-Dokumentation begonnen
- 15 Module aus Schüler-Flow extrahiert
- Kern-Entitäten definiert
