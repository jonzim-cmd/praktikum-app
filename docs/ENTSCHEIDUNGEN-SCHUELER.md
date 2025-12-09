# Entscheidungen: Schüler-Flow

> Dokumentation aller Entscheidungen, die während der Erarbeitung des Schüler-Flows getroffen wurden.
> Stand: 2024-12-08

---

## Onboarding

### Wann zeigen?
- **Nur beim allerersten Login**
- Danach: Info-Banner bei neuer Phase
- Info-Button für allgemeine Infos jederzeit verfügbar

### Inhalt
- Was ist das Praktikum? (Pflicht für Abschlussprüfung!)
- Wie viele Tage? (individuell pro Schüler/Schule)
- Wann ist der Praktikumszeitraum? (konkretes Datum)
- Erste Aufgabe: Bewerbungen starten

---

## Dashboard

### Hauptelemente
- Aktuelle Phase prominent anzeigen
- Offene Aufgaben
- Fortschrittsanzeige (X/Y Tage)
- Zeitdruck-Ampel

### Zeitdruck-Ampel (Bewerbungsphase)

| Phase | Zeitraum | Bedeutung | Aktion |
|-------|----------|-----------|--------|
| Grün | 3+ Monate vor Praktikum | Beste Zeit für Wunschbetriebe | - |
| Gelb | 1-3 Monate vor Praktikum | Wird knapper | Push + In-App-Banner mit Tipp |
| Rot | <1 Monat vor Praktikum | Kritisch | Push + In-App: "Hauptsache Praktikum!" |

### Erinnerungen bei Inaktivität
- **2+ Wochen keine Dokumentation:** Push-Benachrichtigung
- **Ampelwechsel:** Automatische Warnung
- **Bewerbung 2 Wochen "Offen":** "Hast du Antwort erhalten?"

---

## Bewerbung dokumentieren

### Kontaktarten
1. E-Mail (Screenshot als Nachweis)
2. Schriftliche Bewerbung/Post (Foto/Scan als Nachweis)
3. Anruf (Telefonnummer + Datum + Uhrzeit)
4. Persönlich vorbeigegangen (Adresse + Datum + Uhrzeit)

### Nachweise & Verifizierbarkeit

| Kontaktart | Nachweis | Verifizierbarkeit |
|------------|----------|-------------------|
| E-Mail | Screenshot mit sichtbarer E-Mail-Adresse | Hoch |
| Schriftlich | Foto/Scan der Bewerbung | Hoch |
| Anruf | Telefon + Datum + Uhrzeit + ggf. Name | Niedrig |
| Persönlich | Adresse + Datum + Uhrzeit | Niedrig |

- Bei Anruf/Persönlich: **Warnung anzeigen** ("Schwer überprüfbar, Lehrkraft kann nachfragen")
- Lehrkraft sieht Verhältnis verifizierbar/nicht-verifizierbar

### Status einer Bewerbung

| Status | Beschreibung |
|--------|--------------|
| Offen | Anfrage gesendet, wartet auf Antwort |
| Gespräch | Einladung zum Vorstellungsgespräch |
| Zusage | Praktikumsplatz erhalten |
| Abgelehnt | Absage erhalten |
| Keine Antwort | Nach 2 Wochen ohne Rückmeldung (manuell setzbar) |

### "Keine Antwort" Status
- Nach 2 Wochen "Offen": Erinnerung "Hast du Antwort erhalten?"
- Schüler kann Status manuell auf "Keine Antwort" setzen
- System zeigt: "Versuche es woanders!"

### Betrieb-Eingabe mit Duplikaterkennung
- **Adress-Autocomplete:** Photon API (OSM-basiert, DSGVO-konform) für normalisierte Adressen
- **Fuzzy-Matching:** System zeigt ähnliche Betriebe ("Meintest du...?")
- Schüler kann bestehenden Betrieb auswählen oder "Nein, neuer Betrieb" bestätigen
- Verhindert Duplikate (z.B. "Müller GmbH" vs. "Mueller GMBH")

---

## Zusage erhalten

### Pflichtfelder bei Zusage
- Von-Datum
- Bis-Datum
- Anzahl Tage
- Ansprechpartner (wird für Vertrag gebraucht)
- E-Mail des Betriebs (wird für Vertrag gebraucht)

### E-Mail-Warnung bei Sammel-Adressen
- System erkennt allgemeine E-Mail-Adressen: `info@`, `kontakt@`, `office@`, `mail@`, `post@`
- **Warnung anzeigen:** "Allgemeine E-Mail-Adresse erkannt. Bitte E-Mail-Adresse des Ansprechpartners in Erfahrung bringen."
- Schüler kann trotzdem fortfahren (kein harter Blocker)
- Lehrkraft sieht bei Vertragsprüfung, ob Sammel-Adresse verwendet wurde (gelbe Markierung)

### Zeitraum noch nicht bekannt
- Checkbox: "Zeitraum noch nicht bekannt"
- Erinnerung folgt später zum Nachtragen
- Vertrag kann nicht erstellt werden ohne Zeitraum

### 36h Wartezeit nach Zusage
- Schüler meldet Zusage → Lehrkraft hat 36h Zeit für Einspruch
- Kein Einspruch → automatisch freigegeben
- Einspruch → Schüler erhält Nachricht mit Grund
- **Wochenenden pausieren den Timer** (Default)
- Ferien pausieren NICHT (Schüler können in Ferien Zusagen bekommen)

### Teilzusage
- Wenn nur Teil der benötigten Tage abgedeckt
- Dashboard zeigt: Vertragsprozess für Betrieb A + "Du brauchst noch X Tage"
- Parallele Phasen möglich: Vertrag + weitere Bewerbungen

### Zusage zurückziehen

**Möglich:** Schüler kann Zusage jederzeit VOR Vertragsstart zurückziehen.

**Flow:**
1. Button "Zusage zurückziehen" in der Zusage-Detail-Ansicht
2. Pflichtfeld: Grund auswählen
   - "Andere Zusage erhalten"
   - "Betrieb hat abgesagt"
   - "Habe mich umentschieden"
   - "Sonstiges"
3. System setzt Status auf "Zurückgezogen"
4. **Betrieb erhält KEINE Nachricht** (weiß noch nichts vom System)
5. Lehrkraft sieht im Log: "Zusage zurückgezogen: [Grund]"

### Zwei Zusagen für gleichen Zeitraum

**Nicht möglich:** System verhindert parallelen Vertragsprozess für überlappende Zeiträume.

**Bei Eingabe:**
- Warnung: "Du hast bereits eine Zusage für 03.-07.02. (Müller GmbH)."
- "Du kannst nur für einen Betrieb pro Zeitraum den Vertrag starten."
- "Bitte ziehe eine Zusage zurück, um fortzufahren."

**Lehrkraft sieht:**
- Warnung wenn Schüler mehrere Zusagen für gleichen Zeitraum hat
- "⚠️ Zwei Zusagen für gleichen Zeitraum – Schüler muss sich entscheiden"

---

## Vertragsprozess

### Daten prüfen vor PDF
- Schülerdaten (Name, Klasse, Adresse)
- Betriebsdaten (Name, Adresse, Ansprechpartner, E-Mail)
- Zeitraum
- Alles mit Haken bestätigen

### PDF erstellen & Druck
- [PDF herunterladen] für Selbstdruck
- [Per E-Mail an Betrieb senden] optional
- **[Druck beantragen]** für Schüler ohne Drucker
  - Lehrkraft erhält Benachrichtigung
  - Lehrkraft druckt und markiert als "gedruckt"
  - Schüler erhält: "Kann im Sekretariat abgeholt werden"

### Unterschriften sammeln
- Schüler ist verantwortlich
- Eltern + Betrieb (Reihenfolge egal)
- Schule unterschreibt ZULETZT

### Abgabe
- **Physisch:** Persönlich bei Lehrkraft abgeben
- **Digital:** Scan/Foto in App hochladen

### Vertragsstatus für Schüler

| Status | Bedeutung |
|--------|-----------|
| Unterschriften sammeln | Schüler holt Unterschriften |
| Bei Lehrkraft | Abgegeben, Schule muss unterschreiben |
| Bei Schulleitung/Sekretariat | Optional sichtbar, falls Lehrkraft nutzt |
| Bestätigt | Fertig! Betrieb erhält Account |
| Abgelehnt | Mit Grund (z.B. "Unterschrift fehlt") |

### Ablehnung
- Mögliche Gründe: Unterschrift fehlt, Betrieb ungeeignet, Zu weit weg
- Bei Ablehnung: Zurück zur Bewerbungsphase
- Schüler muss ggf. Betrieb absagen

---

## Praktikum

### Anwesenheit täglich
- **Ein Tap:** "Ich war heute da"
- Status: Selbstgemeldet (nicht bestätigt)
- Betrieb bestätigt wöchentlich (nicht täglich!)

### Erinnerung bei fehlendem Check-in
- Wenn Schüler sich bis abends nicht gemeldet hat → Push-Benachrichtigung
- "Du hast heute keinen Check-in gemacht!"
- Kann nachträglich nachgeholt werden

### Krankmeldung

**Ablauf:**
1. Schüler wählt Krankheitstage aus (ein Tag oder Zeitraum)
2. "Ich bin heute krank" ODER "Ich bin vom X. bis Y. krank"
3. Betrieb + Lehrkraft werden automatisch informiert (eine Mail pro Meldung)
4. Attest hochladen (Frist: konfigurierbar, z.B. 3 Tage)
5. **Fristanzeige:** "Frist: 08.02.2025 (noch 2 Tage)"
6. Frist verpasst → Tag gilt als UNENTSCHULDIGT

**E-Mail an Betrieb:**
- Eine E-Mail pro Krankmeldung (nicht pro Tag)
- Beispiel: "Max M. ist vom 05.02. bis 07.02. krank."
- Keine Gesund-Meldung – Schüler erscheint einfach wieder

**Hinweis:**
- System erwähnt: "Der Betrieb hat möglicherweise eigene Regelungen (z.B. telefonische Krankmeldung)"

### Kranktage
- Mit Attest: Werden als "nachzuholen" markiert
- Ohne Attest (Frist verpasst): Gilt als unentschuldigt, Konsequenzen
- **🔒 Datenschutz:** Attest-Foto wird nach Lehrkraft-Bestätigung automatisch gelöscht (nur Vermerk "Attest: ✅" bleibt)

### Fortschrittsanzeige
- X von Y Tagen absolviert
- Visueller Fortschrittsbalken
- Verbleibende Tage im aktuellen Block
- Nachzuholende Tage (falls vorhanden)

### Praktikum am Wochenende
- **NEIN** während regulärem Praktikum (muss während Schulzeit sein lt. Gesetz)
- **JA** beim Nachholen versäumter Tage (außerhalb Schulzeit erlaubt)

### Mehrere Blöcke
- Immer nur **ein Block gleichzeitig**
- System verhindert parallele Blöcke
- Erst wenn Block 1 fertig → Block 2 kann beginnen

---

## Nachbereitung

### Lernaufgaben
- Reflexionsbogen (wenn aktiviert)
- Ggf. weitere Aufgaben (Bewerbungsmappe etc.)
- Deadlines zentral im Admin-Bereich festgelegt

### Deadline-Verhalten
- Erinnerungen vor Deadline
- Bei Versäumnis: 0 Punkte
- Option "Keine Abgabe" bei Aufgaben

### Betrieb bewerten (optional)
- Anonym
- Weiterempfehlung? (Ja / Eher ja / Eher nein / Nein)
- Sterne-Bewertung für Betreuung
- Kommentar (optional)

### Zertifikat herunterladen

**Zwei Varianten:**

| Situation | Zertifikat-Typ | Inhalt |
|-----------|---------------|--------|
| Alle Tage absolviert | **Vollständiges Zertifikat** | Alle Details, keine Einschränkung |
| Tage noch nachzuholen | **Vorläufiger Nachweis** | Mit Vermerk "X Tage noch zu absolvieren" |

**Wichtig bei vorläufigem Nachweis:**
- Formulierung: "X Tage sind noch zu absolvieren" (allgemein)
- NICHT: "X Tage bei diesem Betrieb nachzuholen" (da Nachholen auch woanders sein kann)
- Schüler kann vorläufigen Nachweis nutzen, muss aber nachweisen dass Tage nachgeholt werden

**Anzeige im Dashboard (Phase 4):**
- Falls alle Tage da: "[PDF herunterladen] – Vollständiges Zertifikat"
- Falls Tage fehlen: "[PDF herunterladen] – Vorläufiger Nachweis (X Tage ausstehend)"

**Inhalt beider Varianten:**
- Name des Schülers
- Schule + Schullogo
- Praktikumszeitraum(e)
- Betrieb(e)
- Anzahl absolvierter Tage
- Optional: Kurze Zusammenfassung / Bestätigung
- **Format:** PDF, professionell gestaltet
- **Nutzen:** Für zukünftige Bewerbungen verwendbar

---

## Nachholen (Phase 5)

### Prinzip
- Schüler ist **komplett selbst verantwortlich**
- Keine aktive Betreuung durch Schule/Lehrkraft
- Kein Vertragsprozess, kein Betrieb-Account nötig

### Ablauf
1. System zeigt: "Du musst noch X Tage nachholen"
2. [Nachweisbogen herunterladen] (PDF mit Schülerdaten)
3. Schüler macht Praktikumstag(e) selbstständig
4. Betrieb unterschreibt Nachweisbogen
5. Schüler lädt Nachweis hoch (Foto/Scan)
6. Lehrkraft prüft
7. Bestätigt → Tage werden gutgeschrieben
8. Abgelehnt → Erneut hochladen

### Keine Bewertung
- Nachgeholte Tage werden nur "abgehakt"
- Fließen nicht in Note ein

---

## Gerät & UI

### Mobile-First
- Primäres Gerät: Smartphone
- Desktop-Version muss funktionieren, aber Smartphone ist Hauptfokus

### Hinweis zu Diagrammen
- Flow-Diagramme dienen der **Visualisierung des Konzepts**
- Exakte Texte, UI-Details und Micro-Interactions werden bei der Implementierung erarbeitet

---

## Noch offen

- [x] ~~Gamification~~ → V2-Feature (siehe V2-FEATURES.md)
- [x] ~~Eltern-Benachrichtigung bei Krankmeldung~~ → V2-Feature (optional, pro Schule)
- [ ] Genauer Ablauf bei mehreren Betrieben für Teilzusagen

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version aus Schüler-Flow-Diskussion |
| 2024-12-08 | NEU: Betrieb-Eingabe mit Duplikaterkennung |
| 2024-12-08 | NEU: Erinnerung bei fehlendem Check-in |
| 2024-12-08 | NEU: Zertifikat herunterladen nach Abschluss |
| 2024-12-08 | NEU: E-Mail-Warnung bei Sammel-Adressen (info@, kontakt@, etc.) |
| 2024-12-09 | GEÄNDERT: Krankmeldung – Schüler wählt Zeitraum, eine Mail an Betrieb |
| 2024-12-09 | NEU: Zusage zurückziehen (vor Vertragsstart) |
| 2024-12-09 | NEU: System verhindert zwei Zusagen für gleichen Zeitraum |
| 2024-12-09 | GEÄNDERT: Zertifikat – Zwei Varianten (vollständig / vorläufig) |
