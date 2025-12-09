# Entscheidungen: Betrieb-Flow

> Dokumentation aller Entscheidungen, die während der Erarbeitung des Betrieb-Flows getroffen wurden.
> Stand: 2024-12-08

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

**Alternative für V2:** Passkeys/WebAuthn (State of the Art, aber komplexer)

### Datenschutz-Beratung

Empfohlene Ansprechpartner:
- **Bayerischer Landesbeauftragter für den Datenschutz** (zuständig für Schulen)
  - https://www.datenschutz-bayern.de
- Schulamt / Kultusministerium (haben oft Leitfäden)

### Datensichtbarkeit

| Daten | Sichtbarkeit für Betrieb |
|-------|--------------------------|
| Vorname + Initial | In Mails ("Max M.") |
| Voller Name | Nur im Dashboard nach Login |
| Schüler-Kontaktdaten | NIE sichtbar |
| Krankmeldung | Nur "Praktikant ist krank", kein Detail |
| Attest | NIE sichtbar (nur für Lehrkraft) |

### Bei Fehltag im Dashboard
- Hinweis: "Abwesend (entschuldigt)" oder "Abwesend (unentschuldigt)"
- NICHT: "Attest eingereicht" (zu viel Info)

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
2. **Krankmeldung** - "Max M. hat sich krank gemeldet" (nur Info, keine Aktion)
3. **Anwesenheit prüfen** - "Bitte bestätigen Sie die Anwesenheit"
4. **Besuchstermin** - "Terminvorschlag von Lehrkraft"
5. **Beurteilung** - "Bitte bewerten Sie Ihren Praktikanten"
6. **Neuer Praktikant** (bei bestehendem Account) - "Neuer Praktikant zugewiesen"

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
- **Letzter Praktikumstag der Woche, vormittags**
- Bei kürzerem Praktikum (Mo-Do): Letzter Praktikumstag

### Nicht-Reaktion

| Tag | Aktion |
|-----|--------|
| Letzter Praktikumstag der Woche | Erinnerung an Betrieb |
| 1. Praktikumstag neue Woche (Nachmittag) | Zweite Erinnerung |
| Nach 7 Tagen ohne Reaktion | Stillschweigend bestätigt |
| Praktikumsende | Gesammelte Erinnerung für alles Offene |

### Stillschweigende Bestätigung
- Nach 7 Tagen ohne Reaktion: Schüler-Meldung gilt als bestätigt
- **Klar markiert:** "Automatisch bestätigt (keine Reaktion vom Betrieb)"
- **Im Admin ausschaltbar**
- Betrieb kann danach immer noch widersprechen

### Widerspruch (Schüler vs. Betrieb)
- **Betrieb > Schüler** (Betrieb wird vertraut)
- Lehrkraft wird informiert und klärt
- Beide (Betrieb + Lehrkraft) können jederzeit korrigieren

### Bei Korrektur durch Betrieb
- Hinweis anzeigen: "Die Lehrkraft wird informiert."

---

## Besuchstermine

### Terminvorschlag durch Lehrkraft
- 1-3 Zeitfenster vorschlagen
- Betrieb wählt oder schlägt Alternative vor

### Betrieb-Optionen
- Termin auswählen
- "Keiner passt - Alternative vorschlagen" (Freitextfeld oder Kalender)
- Bestätigten Termin absagen (ohne Grund-Pflicht)

### Lehrkraft kann ohne Bestätigung eintragen
- Für telefonisch/per Mail vereinbarte Termine
- Termin erscheint dann ohne Betrieb-Bestätigung

### Nicht-Reaktion auf Terminanfrage

| Tag | Aktion |
|-----|--------|
| Nach 3 Tagen | Erinnerung an Betrieb |
| Nach 5 Tagen | Info an Lehrkraft |

### Kurzfristige Absage
- Betrieb kann jederzeit absagen
- Lehrkraft bekommt **sofort** Benachrichtigung (Push + Mail)

### Verschiedene Ansprechpartner im gleichen Betrieb
- System zeigt Lehrkraft Warnung: "Achtung: 2 verschiedene Ansprechpartner"
- Lehrkraft entscheidet: Ein Sammel-Besuch oder separate Termine
- Keine automatische Zusammenlegung

### Verschiedene Lehrkräfte beim gleichen Betrieb
- V1: Nicht behandeln (Lehrkräfte koordinieren sich intern)
- V2: Eventuell Hinweis ergänzen

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
- Nach 3 Tagen: Erinnerung
- Nach 7 Tagen: Erinnerung
- Danach: Keine weiteren automatischen Erinnerungen
- **Im Admin:** Mehr Erinnerungen einstellbar

### Absoluter Fallback
- Wenn Betrieb trotz allem nicht bewertet:
- Lehrkraft kann Gesamtnote vergeben mit Hinweis "ohne Betriebsfeedback"
- Betriebsteil fällt weg

### Beurteilung muss vom Betrieb kommen
- Lehrkraft kann NICHT selbst ausfüllen
- Ausnahme: Lehrkraft als "Überzeugungsarbeit" am Telefon → Betrieb klickt dann selbst

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

### Opt-out
- In Mail: "Austragen"-Link unten
- In Einstellungen: Option zum Austragen
- Sofortige Löschung aus Datenbank

### Rechtlich
- Einwilligung ist nötig (DSGVO)
- Opt-in, nicht Opt-out

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
  - Passkeys/WebAuthn für V2?
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
