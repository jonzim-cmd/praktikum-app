# Entscheidungen: Betrieb-Flow

> Dokumentation aller Entscheidungen, die während der Erarbeitung des Betrieb-Flows getroffen wurden.
> Stand: 2024-12-09

---

## Grundprinzipien

### Kernprinzip: Minimaler Aufwand
- Betrieb darf nicht genervt werden
- Alles muss so einfach wie möglich sein
- Wenn Betrieb nicht reagiert, darf der Prozess nicht blockieren

### Fallback: Lehrkraft kann alles nachtragen
Für jeden Betrieb-Schritt gibt es einen Lehrkraft-Fallback:

| Betrieb-Aktion | Lehrkraft-Fallback |
|----------------|-------------------|
| Anwesenheit bestätigen | Lehrkraft bestätigt / trägt ein |
| Termin bestätigen | Lehrkraft trägt selbst ein |
| Beurteilung ausfüllen | Ohne Betriebsfeedback benoten (absoluter Fallback) |
| Datenbank Opt-in | Nicht möglich ohne Zustimmung (Default: Nein) |

---

## Account & Authentifizierung

> ⚠️ **WICHTIG FÜR IMPLEMENTIERUNG:**
> Die Authentifizierungs-Entscheidung ist noch **nicht final abgesegnet**.
> Der Datenschutzbeauftragte muss das Konzept noch prüfen.
>
> **Mögliche Änderungen:**
> - Falls Magic Link + E-Mail-Verifizierung nicht reicht → Umstellung auf **nur Passwort-Login**
> - Falls Datenschutz strengere Anforderungen hat → Alternative Lösungen nötig
>
> **Bei Implementierung beachten:**
> - Authentifizierungs-Logik **modular und austauschbar** halten
> - Keine harte Abhängigkeit von Magic Links im gesamten Code
> - Login-Komponente so bauen, dass sie leicht umgestellt werden kann
> - Datenbank-Schema sollte beide Varianten unterstützen (Magic Link + Passwort)

### Wahlmöglichkeit von Anfang an

Bei der **ersten E-Mail** (nach Vertragsbestätigung) kann der Betrieb wählen:

| Option | Button | Was passiert |
|--------|--------|--------------|
| **Passwort-Login** | [Dauerhaften Login einrichten] | Direkt Passwort setzen → klassischer Login |
| **Magic Link** | [Über Link anmelden] | E-Mail-Verifizierung → Browser 90 Tage vertraut |

**Empfehlung in der Mail:** Passwort-Login wird als "empfohlen" markiert (sicherer).

### Nachträglicher Wechsel

| Situation | Option |
|-----------|--------|
| Magic Link → Passwort | In Einstellungen: "Auf Passwort-Login umstellen" |
| Passwort + Magic Link deaktivieren | Checkbox: "Link-Anmeldung deaktivieren" (nur noch Passwort) |

### Magic Link Details (wenn gewählt)
- Klick auf Link → E-Mail-Verifizierungs-Code wird gesendet
- Code eingeben → Browser wird 90 Tage "vertraut" (Cookie-basiert)
- Nach 90 Tagen Inaktivität oder neuem Browser: Code erneut nötig

### Link-Gültigkeit

| Link-Typ | Gültigkeit |
|----------|------------|
| Original (bei Praktikum-Zuweisung) | Bis neuer Praktikant zugewiesen wird |
| Von Betrieb selbst erstellt (für Kollegen) | 30 Tage |
| Nach "Neuen Link anfordern" | Alter wird ungültig |

### Account-Aktivitäts-Tracking

- **Kein Account nötig:** Betrieb kann alles über Magic Links erledigen
- **Aber:** System trackt, ob Link geklickt wurde
- **Nach X Tagen ohne jegliche Aktivität:** Lehrkraft wird informiert
  - "Betrieb XY hat noch nicht auf den Zugangslink reagiert"
  - Lehrkraft kann dann telefonisch nachfragen
- **Praktikumsstart ohne Aktivität:** Warnung an Lehrkraft
  - "⚠️ Betrieb hat keinen aktiven Zugang – ggf. telefonisch klären"

### Admin-Funktionen für Links
- Alle aktiven Links eines Betriebs sehen
- Einzelne Links deaktivieren
- Alle Links eines Betriebs invalidieren (Notfall)
- Gültigkeitsdauer konfigurierbar

---

## Datenschutz & Sicherheit

### Status: NOCH ZU KLÄREN MIT DATENSCHUTZBEAUFTRAGTEM

Magic Links ohne zusätzliche Absicherung sind bei Zugriff auf Daten Dritter (Schüler) rechtlich heikel.

### Geplante Absicherung (V1): E-Mail-Verifizierung

**Ablauf beim ersten Zugriff:**
1. Betrieb klickt Magic Link
2. Screen: "Bitte bestätigen Sie Ihren Zugang"
3. Code wird an **hinterlegte E-Mail** geschickt (nicht frei wählbar!)
4. Anzeige: "Code wurde an w***r@firma.de gesendet"
5. Code eingeben → Zugang freigeschaltet
6. Browser wird für 90 Tage "gemerkt" (Cookie-basiert)

**Technische Details:**

| Aspekt | Entscheidung |
|--------|--------------|
| Code-Ziel | Hinterlegte E-Mail (nicht frei wählbar) |
| Bindung | Same-Browser (Cookie), nicht Same-Device |
| Gültigkeit | 90 Tage, Timer resettet bei jedem Login |
| Nach 90 Tagen Inaktivität | Code erneut nötig |
| Neuer Browser/Gerät | Code erneut nötig |
| Cookie gelöscht | Code erneut nötig |

**Bedeutet praktisch:**
- Chrome auf Laptop = vertrauenswürdig
- Safari auf gleichem Laptop = neuer Code nötig
- Chrome auf Handy = neuer Code nötig
- Bei aktivem Praktikum (2 Wochen): Timer resettet ständig, läuft selten ab

**Passkeys/WebAuthn:** Ab V1 verfügbar (nach erstem Login wird Einrichtung angeboten). Siehe `ENTSCHEIDUNGEN-DATENSCHUTZ.md`.

### Edge Case: Falsche E-Mail-Adresse hinterlegt

**Problem:** Schüler gibt falsche/veraltete E-Mail ein → Betrieb bekommt keinen Code → kann nichts machen

**Lösung: "Problem melden" Flow**

```
Magic Link geklickt → Code-Eingabe-Screen

"Code wurde an w***r@firma.de gesendet"

[Code eingeben: ______]

┌─────────────────────────────────────────┐
│ Kein Zugriff auf diese E-Mail-Adresse? │
│ [Problem melden]                        │
└─────────────────────────────────────────┘
```

**Bei Klick auf "Problem melden":**
1. Formular: "Bitte geben Sie Ihre korrekte E-Mail ein"
2. Lehrkraft bekommt Benachrichtigung: "Betrieb XY meldet falsche E-Mail"
3. Lehrkraft prüft und korrigiert (oder lehnt ab)
4. Neuer Code geht an korrigierte Adresse

**Warum Lehrkraft als Gatekeeper:** Verhindert, dass jemand unbefugt eine andere E-Mail hinterlegt.

### Datenschutz-Beratung

Empfohlene Ansprechpartner:
- **Bayerischer Landesbeauftragter für den Datenschutz** (zuständig für Schulen)
  - https://www.datenschutz-bayern.de
- Schulamt / Kultusministerium (haben oft Leitfäden)

### Datensichtbarkeit im Dashboard

**Minimale Datenexposition:** Betrieb sieht nur das absolut Notwendige.

**Betrieb SIEHT:**

| Daten | Beispiel | Begründung |
|-------|----------|------------|
| Vorname + Initial | "Max M." | Identifikation, Datensparsamkeit |
| Praktikumszeitraum | 03.-14.02.2025 | Nötig für Planung |
| Anwesenheitsstatus | ✓ ✓ 🤒 ✓ ✓ | Kernaufgabe |
| Lehrkraft-Kontakt | Name + E-Mail | Bei Fragen |
| Offene Aufgaben | "Beurteilung ausstehend" | Handlungsaufforderung |
| Eigene Beurteilung | Nur auf Anfrage, nach Freigabe | Korrekturmöglichkeit |

**Betrieb sieht NICHT:**

| Daten | Warum nicht |
|-------|-------------|
| Nachname | Nicht nötig für Aufgaben |
| Adresse/Telefon des Schülers | Kein Bedarf, Datenschutz |
| Atteste | Gesundheitsdaten, nur für Schule |
| Klassenbezeichnung | Nicht relevant |
| Bewertungen der Lehrkraft | Interna |
| Andere Schüler (außer eigene) | Selbstverständlich |

### Bei Fehltag im Dashboard
- Hinweis: "Abwesend (entschuldigt)" oder "Abwesend (unentschuldigt)"
- NICHT: "Attest eingereicht" (zu viel Info)
- NICHT: Details zur Krankmeldung

---

## Ansprechpartner & Accounts

### Ein Betrieb = Mehrere Ansprechpartner möglich

**Prinzip:**
- Betrieb = Entity mit Name, Adresse
- Jeder Ansprechpartner = Eigener Zugang (Magic Link)
- Ansprechpartner sieht nur "seine" Praktikanten

**Beispiel:**
```
IT Solutions GmbH
├── Frau Weber (weber@...) → sieht nur Max
└── Herr Klein (klein@...) → sieht nur Anna
```

### Ansprechpartner wechselt

**Option A (Default):** Link weiterleiten
- Pragmatisch, funktioniert sofort
- Neuer Ansprechpartner ist als alter eingeloggt

**Option B (für engagierte Betriebe):** Selbst einladen
- Im Dashboard: "Weiteren Zugang erstellen"
- E-Mail eingeben → System schickt Magic Link (30 Tage gültig)

**Beide Accounts bleiben aktiv** (unkomplizierter)

---

## E-Mail-Kommunikation

### E-Mail als Hauptkanal
- Betriebe werden keine App installieren für 1 Praktikant/Jahr
- Push nur wenn Betrieb sich freiwillig App installiert

### E-Mail-Absicherung (keine Sammel-Adressen)

Bei Schüler-Eingabe:
- Warnung bei: `info@`, `kontakt@`, `office@`, `mail@`, `post@`
- Text: "Allgemeine E-Mail-Adresse erkannt. Bitte E-Mail-Adresse des Ansprechpartners in Erfahrung bringen."
- Schüler muss Ansprechpartner-Mail besorgen

Bei Lehrkraft-Prüfung (Vertrag):
- E-Mail-Adresse wird angezeigt
- Gelbe Markierung wenn Sammel-Adresse erkannt
- Lehrkraft kann korrigieren

### E-Mail-Typen (6 Stück)

1. **Account erstellt** - "Neuer Praktikant: Max M. (03.-14.02.)"
2. **Krankmeldung** - "Max M. ist heute/am X.-Y. krank" (nur Info, keine Aktion)
3. **Anwesenheit prüfen** - "Bitte bestätigen Sie die Anwesenheit" (11-12 Uhr am letzten Praktikumstag der Woche)
4. **Besuchstermin** - "Terminvorschlag von Lehrkraft"
5. **Beurteilung** - "Bitte bewerten Sie Ihren Praktikanten"
6. **Neuer Praktikant** (bei bestehendem Account) - "Neuer Praktikant zugewiesen"

---

## Krankmeldung

### E-Mail an Betrieb

- **Eine E-Mail pro Krankmeldung** (nicht pro Tag)
- Schüler meldet sich für die Tage krank, die er krank ist (1 Tag oder mehrere)
- Beispiele:
  - "Max M. ist heute (05.02.) krank."
  - "Max M. ist vom 05.02. bis 07.02. krank."
- **Keine Gesund-Meldung** an Betrieb – Schüler erscheint einfach wieder

### Hinweis für Betrieb

- "Dies ist eine automatische Benachrichtigung. Keine Aktion erforderlich."
- "Hinweis: Der Betrieb hat möglicherweise eigene Regelungen zur Krankmeldung (z.B. telefonische Benachrichtigung)."

### Sammel-Mails

**Anwesenheit:** Eine Mail für alle Praktikanten des Ansprechpartners
**Beurteilung:** Eine Mail für alle Praktikanten des Ansprechpartners
**Krankmeldung:** Separate Mails (wichtig, muss sofort kommen)
**Account-Erstellung:** Eine Mail wenn mehrere am gleichen Tag zugewiesen (nice-to-have)

### In jeder Mail

- "Dauer: ca. X Minuten" (reduziert Hemmschwelle)
- Klare Handlungsaufforderung oder "Nur zur Info, keine Aktion nötig"
- Footer: "Feedback zur App? [Hier klicken]"

---

## Onboarding

### Beim ersten Login (2-3 Screens)

**Screen 1:** "Willkommen bei practical!"

**Screen 2:** "Was kommt auf Sie zu?"
- Wöchentlich: Anwesenheit bestätigen (ca. 1 Min)
- Evtl.: Besuchstermin mit Lehrkraft
- Am Ende: Kurze Beurteilung (ca. 5 Min)

**Screen 3:** "Das war's! Bei Fragen: [Kontakt Lehrkraft]"
- [Zum Dashboard]

### Bei wiederholtem Besuch
- Kein Onboarding, direkt Dashboard

---

## Anwesenheitsbestätigung

### UI: Option C
- Standard: "Alle Tage bestätigen" (ein Klick)
- Bei Abweichung: "Mit Änderungen" → Einzelne Tage korrigieren

### Erinnerungs-Timing

| Zeitpunkt | Aktion |
|-----------|--------|
| Letzter Praktikumstag der Woche, **11-12 Uhr** | E-Mail an Betrieb (Schüler hat sich bereits gemeldet) |
| Tag 3 ohne Reaktion | Erste Erinnerung |
| Tag 5 ohne Reaktion | Zweite Erinnerung |
| Tag 7 ohne Reaktion | **Lehrkraft wird informiert** |
| Praktikumsende | Gesammelte Info an Lehrkraft für alle offenen Bestätigungen |

### KEINE stillschweigende Bestätigung

- **Entscheidung:** Stillschweigende Bestätigung wurde gestrichen
- **Stattdessen:** Nach 7 Tagen ohne Reaktion wird die **Lehrkraft informiert**
- Lehrkraft muss dann selbst handeln (anrufen, E-Mail schreiben)
- **Begründung:** Mehr Kontrolle, weniger automatische Annahmen

### Widerspruch (Schüler vs. Betrieb)
- **Betrieb > Schüler** (Betrieb wird vertraut)
- Lehrkraft wird informiert und klärt
- Beide (Betrieb + Lehrkraft) können jederzeit korrigieren

### Bei Korrektur durch Betrieb
- Hinweis anzeigen: "Die Lehrkraft wird informiert."

---

## Besuchstermine

### Neuer Ansatz: Kalender-basierte Verfügbarkeit

**Prinzip:** Betrieb gibt Verfügbarkeit in 2h-Slots an, Lehrkraft sieht kombinierte Übersicht aller Betriebe.

### Betrieb gibt Verfügbarkeit an

**Kalender-Ansicht mit 2h-Slots:**

```
VERFÜGBARKEIT FÜR BETRIEBSBESUCH
Praktikumszeitraum: 03.-14.02.2025

Bitte markieren Sie, wann ein Besuch möglich wäre:

         │  Mo    Di    Mi    Do    Fr
         │  03.   04.   05.   06.   07.
─────────┼─────────────────────────────────
08-10    │  [ ]   [✓]   [✓]   [ ]   [ ]
10-12    │  [ ]   [✓]   [✓]   [✓]   [ ]
12-14    │  [ ]   [ ]   [ ]   [ ]   [ ]
14-16    │  [✓]   [✓]   [✓]   [✓]   [ ]
16-18    │  [✓]   [✓]   [ ]   [✓]   [ ]

Schnellauswahl:
[Alle Vormittage]  [Alle Nachmittage]  [Ganzer Tag Mo-Do]

Zusätzliche Hinweise (optional):
┌─────────────────────────────────────────┐
│ z.B. "Freitags nie, da Außendienst"    │
└─────────────────────────────────────────┘

[Verfügbarkeit speichern]
```

**Granularität:** 2h-Slots als Kompromiss zwischen Flexibilität und Einfachheit

**Schnellauswahl:** Für Betriebe, die nicht jeden Slot einzeln anklicken wollen

**Freitext:** Für Sonderfälle (z.B. "Mittwoch 14-15 Teambesprechung")

### Verfügbarkeit wird gespeichert

- Bei wiederkehrenden Praktikanten: Verfügbarkeit kann wiederverwendet werden
- Betrieb kann jederzeit aktualisieren
- Lehrkraft sieht immer aktuelle Verfügbarkeit

### Ablauf nach Verfügbarkeitsangabe

1. Betrieb gibt Verfügbarkeit an
2. Lehrkraft sieht kombinierte Übersicht aller Betriebe (siehe ENTSCHEIDUNGEN-LEHRKRAFT.md)
3. System schlägt optimale Verteilung vor (Greedy-Algorithmus)
4. Lehrkraft wählt Slot und sendet Vorschlag
5. Betrieb bestätigt oder lehnt ab

### Terminvereinbarung VOR Praktikumsbeginn

- **Wichtig:** Sobald Vertrag bestätigt ist, kann Terminvereinbarung starten
- Beispiel: Zusage im November, Praktikum im Februar → Termin kann schon im Dezember vereinbart werden
- Lehrkraft-Kalender muss **über alle Praktikumszeiträume hinweg** funktionieren
- Bei früher Vereinbarung: Bereits belegte Slots werden bei späteren Terminvereinbarungen berücksichtigt

### Automatische Verfügbarkeits-Anfrage

- **Trigger:** Automatisch **4 Wochen vor Praktikumsbeginn** (konfigurierbar)
- **ODER:** Lehrkraft kann manuell früher triggern
- **Nicht sofort nach Vertragsbestätigung:** Würde Betrieb mit Account-Mail + Verfügbarkeitsanfrage gleichzeitig überfordern

### Betrieb-Optionen bei Terminvorschlag

- **[Akzeptieren]** → Termin steht
- **[Ablehnen]** → Lehrkraft wird informiert, neuer Vorschlag nötig
- **Keine Reaktion** → Erinnerungen (siehe unten)

### Terminvorschlag: Fallback für Nicht-Kalender-Nutzer

Wenn Betrieb keine Verfügbarkeit angibt:
- Lehrkraft kann trotzdem 1-3 konkrete Slots vorschlagen
- Betrieb wählt oder lehnt ab
- "Keiner passt" → Freitext oder Telefonat

### Lehrkraft kann ohne Bestätigung eintragen
- Für telefonisch/per Mail vereinbarte Termine
- Termin erscheint dann als "Manuell eingetragen"

### Nicht-Reaktion auf Terminanfrage

| Tag | Aktion |
|-----|--------|
| Nach 3 Tagen | Erste Erinnerung an Betrieb |
| Nach 5 Tagen | Zweite Erinnerung an Betrieb |
| Nach 7 Tagen | Info an Lehrkraft ("Betrieb reagiert nicht") |

**Einheitliches Schema:** Alle Betrieb-Aktionen folgen dem gleichen Muster (3→5→7 Tage).
Lehrkraft klärt dann telefonisch.

### Kurzfristige Absage
- Betrieb kann bestätigten Termin jederzeit absagen
- Lehrkraft bekommt **sofort** Benachrichtigung (Push + Mail)
- Grund optional (kein Pflichtfeld)

### Verschiedene Ansprechpartner im gleichen Betrieb
- System zeigt Lehrkraft Warnung: "Achtung: 2 verschiedene Ansprechpartner"
- Lehrkraft entscheidet: Ein Sammel-Besuch oder separate Termine
- Keine automatische Zusammenlegung

### Verschiedene Lehrkräfte beim gleichen Betrieb
- V1: Nicht behandeln (Lehrkräfte koordinieren sich intern)
- V2: Eventuell Hinweis ergänzen

### Bei Scheitern der App-Terminierung
- Wenn keine Einigung über App möglich → Telefonat
- Lehrkraft trägt Ergebnis manuell ein
- Das ist okay, nicht alles muss digital sein

---

## Beurteilung

### Freischaltung
- **Standard:** 3 Tage vor Praktikumsende
- **Im Admin konfigurierbar**
- Lehrkraft kann manuell früher freischalten

### Bei mehreren Praktikanten (ein Ansprechpartner)
- Eine Mail: "Bitte bewerten Sie Ihre X Praktikanten"
- Im Dashboard: Sammel-Ansicht, nacheinander bewerten
- "Speichern & Nächster" Button

### Bei mehreren Praktikanten (verschiedene Ansprechpartner)
- Jeder Ansprechpartner bekommt eigene Mail
- Jeder sieht nur "seine" Praktikanten

### Auto-Save
- Bewertung wird automatisch zwischengespeichert
- Bei Unterbrechung: Weiter wo man war

### Nicht ausgefüllt (Erinnerungen)

| Tag | Aktion |
|-----|--------|
| Nach 3 Tagen | Erste Erinnerung |
| Nach 7 Tagen | Zweite Erinnerung |
| Nach 10 Tagen | **Lehrkraft wird informiert** |

- **Im Admin:** Intervalle konfigurierbar
- Beurteilung hat längere Fristen als andere Aktionen (ist wichtiger, braucht mehr Zeit)

### Absoluter Fallback
- Wenn Betrieb trotz allem nicht bewertet:
- Lehrkraft kann Gesamtnote vergeben mit Hinweis "ohne Betriebsfeedback"
- Betriebsteil fällt weg

### Beurteilung muss vom Betrieb kommen
- Lehrkraft kann NICHT selbst ausfüllen
- Ausnahme: Lehrkraft als "Überzeugungsarbeit" am Telefon → Betrieb klickt dann selbst

### Beurteilung nach Absenden: Korrekturanfrage

**Prinzip:** Nach Absenden ist Beurteilung final. Betrieb kann aber Korrektur anfragen.

**Flow:**

```
Betrieb sendet Beurteilung ab
        │
        ▼
┌─────────────────────────────────────────┐
│ ⚠️ Beurteilung wirklich absenden?       │
│                                         │
│ Nach dem Absenden können Sie die        │
│ Beurteilung nicht mehr selbstständig    │
│ ändern. Bei Fehlern können Sie eine     │
│ Korrektur bei der Lehrkraft anfragen.   │
│                                         │
│ [Abbrechen]     [Endgültig absenden]    │
└─────────────────────────────────────────┘
        │
        ▼
"Beurteilung abgesendet."
```

**Im Dashboard (nach Absenden):**

```
┌─────────────────────────────────────────┐
│ Max M. – Beurteilung abgesendet ✓       │
│ am 12.02.2025                           │
│                                         │
│ [Korrektur anfragen]                    │
└─────────────────────────────────────────┘
```

**Bei Klick auf "Korrektur anfragen":**

```
"Korrekturanfrage senden?
 Die Lehrkraft wird benachrichtigt und
 kann die Beurteilung zur Bearbeitung
 freigeben."

[Abbrechen]  [Anfrage senden]
```

**Lehrkraft erhält Push/Mail:**
- "Müller GmbH bittet um Korrektur der Beurteilung für Max M."
- [Ablehnen] [Freigeben]

**Nach Freigabe:**
- Betrieb erhält Mail: "Ihre Korrekturanfrage wurde genehmigt. [Beurteilung bearbeiten]"
- Magic Link (oder Dashboard-Link bei Account)
- Betrieb kann bearbeiten und erneut absenden

**Status-Übergänge:**
```
Offen → Abgesendet → [Korrektur angefragt] → [Lehrkraft gibt frei] → Zur Korrektur → Erneut abgesendet
```

---

## Praktikumsdatenbank

### Wann fragen?
- Nach Beurteilung
- Direkt im Anschluss-Screen

### Formulierung
```
"Danke für Ihre Beurteilung!

Möchten Sie, dass wir Ihren Betrieb als möglichen
Praktikumsplatz für zukünftige Schüler auflisten?

○ Ja, gerne!
○ Nein, danke

(Sie können diese Entscheidung jederzeit ändern)"
```

### Erklärung anzeigen
- Was passiert wenn Ja?
- Kann ich das rückgängig machen?
- Wie oft werde ich kontaktiert?

### Nicht beantwortet
- Bei nächstem Praktikant wieder fragen

### Opt-out / Austragen aus Datenbank

**Wo verfügbar:**
- In jeder E-Mail: Footer-Link "Aus Praktikumsdatenbank austragen"
- Bei Account: In Einstellungen unter "Praktikumsdatenbank"

**Flow:**

```
[Link/Button klicken]
        │
        ▼
┌─────────────────────────────────────────┐
│ Aus Praktikumsdatenbank austragen?      │
│                                         │
│ Ihr Betrieb wird nicht mehr als         │
│ möglicher Praktikumsplatz angezeigt.    │
│                                         │
│ Sie können sich jederzeit wieder        │
│ eintragen.                              │
│                                         │
│ [Abbrechen]     [Austragen]             │
└─────────────────────────────────────────┘
        │
        ▼
"Sie wurden ausgetragen."
```

**Technisch:**
- Sofortige Löschung aus der Praktikumsdatenbank
- Betriebsstammdaten bleiben (für laufende/vergangene Praktika)
- DSGVO-konform: Widerruf der Einwilligung

### Rechtlich
- Einwilligung ist nötig (DSGVO)
- Opt-in, nicht Opt-out
- Widerruf muss jederzeit möglich sein (ist er: siehe oben)

---

## Internes Betrieb-Feedback (durch Lehrkraft)

### Lehrkraft kann intern bewerten
- Sterne-Bewertung (1-5)
- Interne Notizen
- "Als auffällig markieren"

### Sichtbarkeit

| Wer | Sieht was |
|-----|-----------|
| Andere Lehrkräfte der Schule | Sterne + Notizen + "auffällig"-Markierung |
| Admin | Alles + kann sperren |
| Schüler | Gelber Hinweis bei Eingabe wenn auffällig |
| Betrieb | Nichts |

### Sperrung (Blacklist)
- Nur durch Admin möglich
- Bei Eingabe durch Schüler: Rote Warnung
- Lehrkraft muss explizit freigeben + Grund angeben

### Wann ausfüllen?
- Optional, nach Praktikumsende
- Nicht als Aufgabe erzwingen

---

## Wiederkehrende Betriebe

### Neuer Praktikant bei bestehendem Betrieb
- Neuer Magic Link wird generiert (alter ungültig)
- Mail an (neuen) Ansprechpartner

### Historie anzeigen
```
Ihre Historie:
- 2024: 1 Praktikant
- 2023: 2 Praktikanten
```
(Keine Namen aus Datenschutzgründen)

---

## Infobereich für Betrieb

### Inhalt
- Was ist practical? (Kurz)
- Was wird von mir erwartet? (Onboarding-Infos)
- Kontaktdaten der Lehrkraft(en)
- Bevorzugte Kontaktaufnahme (E-Mail / Telefon / App)
- Einstellungen (aus Datenbank austragen, Benachrichtigungen)
- Feedback zur App

---

## Feedback zur App

### In E-Mails
- Dezent im Footer: "Feedback zur App? [Hier klicken]"

### Im Infobereich
- Permanente Option

### Formular
- Sterne (1-5)
- Optional: "Was können wir besser machen?" [Freitext]
- [Absenden]

### Periodische Push-Nachricht
- 1 Woche nach Praktikumsende
- Maximal 1x pro Schuljahr
- "Wie war Ihre Erfahrung mit practical?"

---

## Bestätigungen

### Nach jeder Aktion
- Klare Bestätigung anzeigen: "Gespeichert!"
- Gibt Sicherheit

---

## Änderungen in anderen Dokumenten ✅ ERLEDIGT

| Dokument | Änderung | Status |
|----------|----------|--------|
| `FLOW-SCHUELER.md` | E-Mail-Warnung bei Sammel-Adressen | ✅ |
| `FLOW-LEHRKRAFT.md` | "Vor Fahrt nochmal checken" Hinweis | ✅ |
| `FLOW-LEHRKRAFT.md` | Internes Betrieb-Feedback + Blacklist-Option | ✅ |
| `FLOW-LEHRKRAFT.md` | Beurteilung "ohne Betriebsfeedback" als Fallback | ✅ |
| `KONZEPT-V2.md` | Stillschweigende Anwesenheitsbestätigung | ✅ |
| `KONZEPT-V2.md` | Magic Link + E-Mail-Verifizierung | ✅ |
| `KONZEPT-V2.md` | Betrieb-Blacklist durch Admin | ✅ |
| `KONZEPT-V2.md` | Praktikumsdatenbank V1 (nicht V2) | ✅ |
| `ENTSCHEIDUNGEN-SCHUELER.md` | E-Mail-Warnung bei Vertragserstellung | ✅ |
| `ENTSCHEIDUNGEN-LEHRKRAFT.md` | Betrieb-Feedback + Blacklist | ✅ |

---

## Noch offen

- [ ] **🚨 KRITISCH:** Datenschutz-Konzept mit Datenschutzbeauftragtem klären
  - Magic Link + E-Mail-Verifizierung ausreichend?
  - Alternative: PIN in erster Mail?
  - ✅ Passkeys/WebAuthn bereits in V1 eingeplant (siehe `ENTSCHEIDUNGEN-DATENSCHUTZ.md`)
  - **Falls nicht ausreichend:** Komplett auf Passwort-Login umstellen
  - **Implementierung:** Authentifizierung modular halten für schnelle Anpassung!
- [ ] Genaue Aufbewahrungsfristen für Betrieb-Daten
- [ ] AGB/Nutzungsbedingungen formulieren

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version aus ausführlicher Diskussion |
| 2024-12-08 | E-Mail-Verifizierung Details ergänzt (90 Tage, Same-Browser, Code-Ziel) |
| 2024-12-08 | ⚠️ Warnung: Authentifizierung modular implementieren (noch nicht final) |
| 2024-12-08 | Alle Änderungen in anderen Dokumenten als ✅ ERLEDIGT markiert |
| 2024-12-08 | NEU: Wahlmöglichkeit von Anfang an (Passwort ODER Magic Link bei erster Mail) |
| 2024-12-08 | NEU: Nachträglicher Wechsel + Link-Anmeldung deaktivieren |
| 2024-12-09 | NEU: Edge Case "Falsche E-Mail-Adresse" mit "Problem melden" Flow |
| 2024-12-09 | ERWEITERT: Datensichtbarkeit im Dashboard (was Betrieb sieht/nicht sieht) |
| 2024-12-09 | NEU: Beurteilung-Korrekturanfrage Flow (Betrieb fragt an, Lehrkraft gibt frei) |
| 2024-12-09 | ÜBERARBEITET: Besuchstermine mit Kalender-basierter Verfügbarkeit (2h-Slots) |
| 2024-12-09 | NEU: Austragen aus Praktikumsdatenbank Flow |
| 2024-12-09 | GEÄNDERT: Stillschweigende Bestätigung gestrichen → Lehrkraft wird informiert |
| 2024-12-09 | GEÄNDERT: Anwesenheits-E-Mail um 11-12 Uhr (nicht vormittags allgemein) |
| 2024-12-09 | NEU: Einheitliche Erinnerungsfristen (3→5→7 Tage), Ausnahme Beurteilung (3→7→10) |
| 2024-12-09 | NEU: Krankmeldung – Schüler meldet sich für X Tage, eine Mail |
| 2024-12-09 | NEU: Account-Aktivitäts-Tracking (Lehrkraft wird informiert bei Inaktivität) |
| 2024-12-09 | NEU: Terminvereinbarung VOR Praktikumsbeginn möglich |
| 2024-12-09 | GEÄNDERT: Beurteilungs-Warnung erwähnt Korrekturmöglichkeit |
| 2024-12-09 | NEU: Automatische Verfügbarkeits-Anfrage 4 Wochen vor Praktikum (konfigurierbar) |
