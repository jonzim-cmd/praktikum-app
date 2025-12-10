# Entscheidungen: Lehrkraft-Flow

> Dokumentation aller Entscheidungen, die während der Erarbeitung des Lehrkraft-Flows getroffen wurden.
> Stand: 2024-12-09

---

## Dashboard & Navigation

### Sortierung/Priorisierung
- **Default:** Nach Dringlichkeit (was muss HEUTE passieren?)
- **Konfigurierbar:** Lehrkraft kann Darstellung selbst wählen (nach Phase, nach Schüler, etc.)

### Aufgaben-Queues im Dashboard
Separate Bereiche für:
- Dringende Aufgaben (Verträge prüfen, Einsprüche, etc.)
- Druckanfragen (eigene kleine Queue)
- Besuche planen
- Bewertungen ausstehend

### Schüler-Ampel
- Die Ampel (grün/gelb/rot) aus dem Schüler-Flow ist auch für Lehrkraft sichtbar
- Prominente Warnung bei kritischen Fällen ("3 Schüler ohne Zusage, Praktikum in 4 Wochen!")

---

## Onboarding

### Lehrkraft-Onboarding
- Ja, beim allerersten Login
- Kurze Einführung: Schülerübersicht, Praktikumszeitraum, was als nächstes passiert
- Gilt nur für erstes Öffnen, nicht bei Betreuungswechsel o.ä.

---

## Benachrichtigungen

### Arten
- **Push:** Default für wichtige Ereignisse (Zusage, Vertrag eingereicht, etc.)
- **E-Mail:** Optional einstellbar
- **Wöchentliche Zusammenfassung:** Optional ("Status Ihrer Klasse")

### Individualisierbar
- Lehrkraft kann einstellen: Push, E-Mail, beides, nichts
- Default: Push, nicht überladen
- Zusammenfassungen optional aktivierbar

### Inhalt
- Benachrichtigungen enthalten kurze Infos wenn möglich (Schülername, Betrieb, Zeitraum)
- Nicht nur "Anna hat Zusage" sondern "Anna hat Zusage bei Müller GmbH (03.-07.02.)"

---

## Genehmigung / Einspruch (36h-Regel)

### Ablauf
1. Schüler meldet Zusage
2. Lehrkraft erhält Benachrichtigung
3. 36h Zeit für Einspruch
4. Kein Einspruch → automatisch freigegeben
5. Einspruch → Schüler wird informiert, Vertragsprozess gesperrt

### Wochenenden
- **Option 1:** Wochenenden pausieren den Timer (Default)
- **Konfigurierbar:** Lehrkraft kann Wochenend-Pause deaktivieren
- **Ferien:** Pausieren NICHT (Schüler können in Ferien Zusagen bekommen)

### Einspruch
- Button "Einspruch erheben"
- Pflicht: Grund angeben (Dropdown + Freitext)
- Schüler erhält sofort Nachricht mit Grund

---

## Vertragsprozess

### Status-Optionen
1. 📝 Unterschriften sammeln (Schüler ist dran)
2. 📥 Bei Lehrkraft (physisch abgegeben oder digital hochgeladen)
3. 🏫 Bei Schulleitung/Sekretariat (optional, freiwillig nutzbar)
4. ✅ Bestätigt (Lehrkraft hat fertigen Vertrag hochgeladen)
5. ❌ Abgelehnt (mit Grund)

### Status "Bei Schulleitung" – Details

- **Nur ein Vermerk:** Kein echter Workflow-Schritt
- **Erinnerung nach X Tagen:** "Vertrag seit X Tagen bei Schulleitung – bitte Status aktualisieren"
- **Grund:** Schulleitung ist außerhalb des Systems, daher keine automatische Eskalation
- Lehrkraft muss manuell bei Schulleitung nachfragen wenn es dauert

### Betrieb-Account: Wann erstellen? (konfigurierbar)

| Option | Beschreibung | Wann sinnvoll |
|--------|--------------|---------------|
| **Bei "Bei Schulleitung"** (Default) | Account wird erstellt sobald LK den Vertrag weiterreicht | Schulleitung-Unterschrift ist nur Formalie |
| **Erst bei "Fertig"** | Account wird erst erstellt wenn Vertrag komplett | Schulleitung muss rechtlich erst genehmigen |

- **Im Admin konfigurierbar** pro Schule
- Default: Bei "Bei Schulleitung" (beschleunigt den Prozess)

### Erinnerungen an Lehrkraft
- Ja! Nicht nur Schüler bekommen Erinnerungen
- "Sie haben 3 Verträge, die seit 10 Tagen nicht bearbeitet wurden"

### Upload-Optionen
- In-App Scan (Kamera mit Kantenerkennung)
- Desktop-Upload (PDF direkt hochladen)

---

## Druckanfragen

### Eigene Queue
- Separate Anzeige im Dashboard: "Druckanfragen (2)"
- Mit Alter der Anfrage ("vor 2 Tagen")

### Workflow
1. Lehrkraft klickt auf Anfrage
2. PDF öffnet sich / wird heruntergeladen
3. Lehrkraft druckt physisch
4. Button "Als gedruckt markieren"
5. Schüler erhält automatisch Nachricht "Kann im Sekretariat abgeholt werden"

---

## Anwesenheit während Praktikum

### Zwei-Stufen-System
- **Selbstmeldung (⏳):** Schüler meldet sich täglich
- **Bestätigung (✅):** Betrieb bestätigt wöchentlich

### Anzeige für Lehrkraft
- Klar kennzeichnen was Selbstmeldung vs. Bestätigung ist
- Keine Fake-Sicherheit vorgaukeln
- Bei Widerspruch (Schüler sagt "da", Betrieb sagt "nicht da") → Roter Alert

### Beispiel-Anzeige
```
HEUTE: 23/25 selbstgemeldet ⏳
LETZTE WOCHE: ✅ bestätigt
```

---

## Betriebsbesuche

### Pflicht
- 1 Besuch pro Praktikumszeitraum verpflichtend
- Bei 2 Praktika im gleichen Zeitraum: Nur 1 Besuch nötig (schulindividuell konfigurierbar)
- Ausnahmen: Telefonat/Videocall möglich

### Dokumentation
- Haken "Besuch durchgeführt"
- Datum (Pflicht)
- Notizen (optional)
- Betrieb muss NICHT bestätigen

### Terminplanung: Kalender-basiert mit Optimierung

**Neuer Ansatz:** Betriebe geben Verfügbarkeit in 2h-Slots an, Lehrkraft sieht kombinierte Übersicht.

**Ablauf:**
1. Betrieb gibt Verfügbarkeit an (2h-Slots im Kalender)
2. Lehrkraft sieht kombinierte Übersicht aller Betriebe
3. System schlägt optimale Verteilung vor (Greedy-Algorithmus)
4. Lehrkraft wählt Slot und sendet Vorschlag
5. Betrieb bestätigt oder lehnt ab

**Lehrkraft-Ansicht: Kombinierte Übersicht**

```
BETRIEBSBESUCHE PLANEN
8 Besuche offen │ Praktikumszeitraum: 03.-14.02.2025

KALENDERANSICHT (alle Betriebe überlagert):

         │  Mo 03.        Di 04.        Mi 05.   ...
─────────┼────────────────────────────────────────────
08-10    │  ░░ (2)        ██ (5)        ██ (4)
10-12    │  ██ (6)        ██ (7)        ██ (6)
12-14    │  ░░ (1)        ░░ (2)        ░░ (1)
14-16    │  ██ (5)        ██ (6)        ██ (5)
16-18    │  ░░ (3)        ░░ (4)        ░░ (2)

Legende: ██ = viele verfügbar (4+)  ░░ = wenige (1-3)  □ = keiner
```

**Klick auf Slot zeigt Details:**
- Welche Betriebe sind in diesem Slot verfügbar?
- Lehrkraft kann direkt Termin vorschlagen

**System-Vorschläge (Greedy-Algorithmus V1):**

```
VORGESCHLAGENE BESUCHSPLANUNG
─────────────────────────────────────────

Automatisch optimiert (8/8 Besuche möglich):

Mo 03., 10-12: Müller GmbH ✓
Mo 03., 14-16: Schmidt AG ✓
Di 04., 08-10: Weber & Co ✓
...

[Alle vorschlagen]  [Einzeln anpassen]

⚠️ KONFLIKT: Für "Café Zentral" gibt es
   keine verfügbaren Slots.
   [Manuell lösen] [Telefonisch klären]
```

**Algorithmus (V1 - Greedy):**
1. Sortiere Betriebe nach Anzahl verfügbarer Slots (aufsteigend)
2. "Schwierige" Betriebe (wenige Slots) werden zuerst geplant
3. Für jeden Betrieb: Ersten freien Slot zuweisen
4. Konflikte anzeigen, wenn kein Slot mehr frei

**Roadmap:**
- V1: Greedy-Algorithmus + manuelle Konfliktlösung
- V1.5: Wenn Feedback zeigt "reicht nicht" → OR-Tools nachrüsten
- V2: OR-Tools mit Fahrzeit-Optimierung (Maps API)

### Fallback bei Nicht-Einigung

Wenn Terminierung über App scheitert:
- Lehrkraft klärt telefonisch
- Trägt Ergebnis manuell ein
- Das ist okay, nicht alles muss digital sein

### Übersicht
- Liste: Welche Betriebe besucht / nicht besucht
- Bestätigte Termine mit Datum/Uhrzeit
- Verfügbarkeit der Betriebe (sofern angegeben)
- Konflikte hervorgehoben

### Terminvereinbarung VOR Praktikumsbeginn

- **Sobald Vertrag bestätigt:** Terminvereinbarung kann starten
- Beispiel: Zusage November, Praktikum Februar → Termin kann im Dezember vereinbart werden
- **Kalender zeigt alle Praktikumszeiträume:** Nicht nur den aktuellen
- Bei früher Vereinbarung: Bereits belegte Slots werden bei späteren Terminvereinbarungen berücksichtigt

### Lehrkraft muss Termin absagen

Wenn Lehrkraft einen bestätigten Termin absagen muss (Krankheit, Notfall):

1. Lehrkraft klickt "Termin absagen" im Kalender
2. Optional: Grund angeben
3. Betrieb erhält sofort E-Mail + Push: "Lehrkraft muss den Termin am [Datum] leider absagen"
4. Lehrkraft sieht Aufgabe: "Neuen Termin mit [Betrieb] vereinbaren"

---

## Bewertung

### Zentrale "Bewertungs-Akte" pro Schüler
- Alles an einem Ort
- Schrittweise ausfüllbar (Lehrkraft entscheidet wann)
- Fortschrittsanzeige
- Finale Freigabe erst wenn alles komplett

### Abschnitte
1. Bewerbungsprozess (Lehrkraft)
2. Lernaufgaben (Lehrkraft)
3. Betriebsbeurteilung (Betrieb, nur lesen)
4. Gesamteindruck (Lehrkraft)
5. Note

### Mehrere beurteilende Lehrkräfte

**Konfigurierbar:** Verschiedene Lehrkräfte können verschiedene Teile beurteilen.

| Rolle | Bewertet typischerweise |
|-------|------------------------|
| Betreuende Lehrkraft | Bewerbungsprozess, Praktikum (Besuch, Anwesenheit) |
| Beurteilende Lehrkraft | Nachbereitungsaufgaben, Gesamteindruck, Gesamtnote |
| Weitere Lehrkräfte | Je nach Schulkonfiguration |

### Rollen-Zuweisung: Wer legt fest?

**Ebenen:**

| Ebene | Wer | Was |
|-------|-----|-----|
| **Schul-Default** | Admin | Legt Standard-Zuordnung für alle Lehrkräfte fest |
| **Pro Lehrkraft** | Admin | Kann individuelle Abweichungen festlegen |
| **Selbständerung** | Lehrkraft | Kann eigene Zuordnung anpassen |

**Beispiel:**
1. Admin legt fest: "Klassenlehrer = betreuend, Fachlehrer = beurteilend" (Default)
2. Für Frau Müller legt Admin ab: "Macht beides" (individuelle Abweichung)
3. Herr Schmidt ändert selbst: "Ich mache nur beurteilend" (Selbständerung)

**Priorität:** Selbständerung > Pro Lehrkraft > Schul-Default

**Sichtbarkeit:**
- Jede Lehrkraft sieht alle Abschnitte (auch fremde, nur lesend)
- Eigene Abschnitte sind bearbeitbar
- Gesamtnote erst möglich wenn alle Abschnitte ausgefüllt

### Bewertungs-Deadline

- **Im Admin konfigurierbar:** Frist für Noteneingabe
- Erinnerung X Tage vor Deadline: "Die Noteneingabe-Frist endet in X Tagen"
- Nach Deadline: Keine automatische Sperre (Kulanzzeit möglich)
- Admin kann Deadline verlängern

### Batch-Modus
- "Bewertungs-Modus" für effizientes Arbeiten
- Liste aller Schüler mit Status
- "Speichern & Nächster" Button
- Keine 5 Klicks pro Schüler

### Mehrere Blöcke
- Default: Pro Schuljahr eine Gesamtnote
- Betriebsbewertungen werden zusammengeführt (gewichtet nach Tagen)
- Konfigurierbar pro Schule

---

## Betreuungswechsel

### Innerhalb Schuljahr
- Admin kann Betreuung neu zuweisen
- Alle laufenden Vorgänge gehen an neue Lehrkraft
- Neue Lehrkraft sieht vollständige Historie

### Neues Schuljahr
- Admin weist neue Betreuungen zu
- Accounts der Schüler bleiben
- Neue Lehrkraft macht da weiter, wo es steht

### Archivierung
- **Abschluss bestanden:** Account archivieren
- **Nicht bestanden + Wiederholung:** Account bleibt aktiv
- **Schulabgang:** Account archivieren

---

## Phase 5: Nachholen

### Prüfung durch Lehrkraft
- Schüler lädt Nachweisbogen hoch → Landet in Lehrkraft-Inbox
- Lehrkraft prüft: Unterschrift vorhanden? Betrieb plausibel? Datum gültig?
- **Bestätigen** oder **Ablehnen** (mit Grund)
- Hinweis: Bei Zweifeln kann beim Betrieb nachgefragt werden

### Zuständigkeit
- Sowohl **Lehrkraft** als auch **Admin** haben Berechtigung zur Genehmigung
- Schule entscheidet selbst, wer Nachholungen in der Praxis prüft
- Wer zuerst handelt, bearbeitet
- Kein konfigurierter Default – flexible Handhabung pro Schule

---

## Bewerbungs-Details

### Lehrkraft kann Nachweise einsehen
- Ja, vollständiger Zugriff auf alle Bewerbungs-Details
- Screenshots, Kontaktdaten, Datum, Status
- Wichtig für: Verifizierung + Bewertung des Bewerbungsprozesses

---

## Erinnerungen

### Alle Erinnerungen abschaltbar
- Jeder Erinnerungs-Typ kann einzeln deaktiviert werden
- Einstellung in Benachrichtigungs-Profil

### Aktive Trigger
1. Aufgabe liegt >7 Tage
2. Praktikum in <2 Wochen + Schüler ohne Vertrag
3. Schüler inaktiv >2 Wochen (Bewerbungsphase)
4. Schüler hat heute keinen Check-in gemacht
5. Betrieb hat nicht bewertet (>1 Woche nach Ende)
6. Eigene Bewertungen offen (Deadline naht)

---

## Reports & Exporte

### V1
- Exporte nur über Admin-Bereich
- Lehrkraft hat keinen eigenen Export

### V2 (geplant)
- Lehrkraft-Exporte: Klassenübersicht, Einzelberichte
- Siehe: `docs/V2-FEATURES.md`

---

## Teilzusagen & Bewertung mit mehreren Betrieben

> **Details:** Vollständige Teilzusage-Logik siehe `ENTSCHEIDUNGEN-SCHUELER.md`

### Sichtbarkeit für Lehrkraft

**Bei Einspruch-Prüfung (Zusage-Details):**
- System zeigt, ob Teilzusage: "5 von 10 Tagen abgedeckt"
- Zeigt fehlende Tage/Zeiträume
- Lehrkraft kann informiert entscheiden (Einspruch wegen unvollständiger Abdeckung ist KEIN vorgesehener Grund)

**In Schüler-Übersicht:**
- Eigene Kategorie "⚠️ TEILZUSAGE" für Schüler mit unvollständiger Abdeckung
- Zeigt: "5/10 Tage" + Betriebsname + welche Woche

**Während Praktikum:**
- Dashboard fokussiert auf aktuelles Praktikum
- Bei zusammenhängenden Blöcken: Warnung wenn Folge-Block nicht gesichert
- Bei getrennten Blöcken (z.B. Feb + Juli): Normale Priorität, Info statt Warnung

### Gewichteter Durchschnitt bei Bewertung
- Schüler mit 2+ Praktikumsblöcken bei verschiedenen Betrieben
- System zeigt alle Betriebsbewertungen einzeln
- Automatischer gewichteter Durchschnitt nach Tagen
- Lehrkraft sieht Einzelwerte + Gesamtdurchschnitt

**Beispiel:**
```
Betrieb A (5 Tage): ★★★★☆ (4.0)
Betrieb B (5 Tage): ★★★☆☆ (3.0)
────────────────────────────────
Gewichtet:          ★★★★☆ (3.5)
```

---

## Internes Betrieb-Feedback

### Lehrkraft kann Betriebe intern bewerten
- **Wann:** Optional, nach Praktikumsende (oder nach Betriebsbesuch)
- **Nicht als Pflicht-Aufgabe** – wird nicht erzwungen

### Bewertungselemente
- Sterne-Bewertung (1-5): Gesamteindruck vom Betrieb
- Interne Notizen (Freitext): Nur für andere Lehrkräfte sichtbar
- Checkbox "Als auffällig markieren": Warnung bei zukünftigen Bewerbungen

### Sichtbarkeit

| Wer | Sieht was |
|-----|-----------|
| Andere Lehrkräfte der Schule | Sterne + Notizen + "auffällig"-Markierung |
| Admin | Alles + kann Betrieb sperren |
| Schüler | Gelber Hinweis bei Eingabe, wenn Betrieb als auffällig markiert |
| Betrieb | Nichts (komplett intern) |

### Betrieb-Blacklist (Admin-Funktion)

- **Nur Admin kann sperren** – nicht Lehrkraft
- Gesperrter Betrieb: Schüler sieht "Dieser Betrieb ist nicht verfügbar"
- Lehrkraft kann im Einzelfall freigeben (mit Begründungspflicht)
- Freigabe wird dokumentiert + Admin wird informiert

### Betrieb-Übersicht für Lehrkraft

- Alle internen Bewertungen anderer Lehrkräfte einsehbar
- Durchschnittsbewertung + Einzelbewertungen
- Historie: Wie viele Praktikanten in welchem Jahr
- Button "Problem an Admin melden" (für Sperrung)

---

## Beurteilung-Korrektur durch Betrieb freigeben

### Kontext
Betrieb hat Beurteilung abgesendet, möchte aber nachträglich korrigieren.

### Ablauf

1. **Betrieb fragt Korrektur an** (im Dashboard)
2. **Lehrkraft erhält Benachrichtigung:**
   - Push + E-Mail: "Müller GmbH bittet um Korrektur der Beurteilung für Max M."
   - Direktlink zur Freigabe

3. **Lehrkraft entscheidet:**
   - **[Freigeben]** → Betrieb erhält Mail mit Link zur Bearbeitung
   - **[Ablehnen]** → Betrieb erhält Info "Korrektur nicht möglich"

### Anzeige in Bewertungs-Akte

```
┌─────────────────────────────────────────┐
│ Betriebsbeurteilung: Müller GmbH        │
│ Status: Abgesendet am 12.02.2025        │
│                                         │
│ ⚠️ Korrekturanfrage vom Betrieb          │
│                                         │
│ [Ablehnen]           [Zur Korrektur     │
│                       freigeben]        │
└─────────────────────────────────────────┘
```

### Nach Freigabe
- Beurteilung wechselt in Status "Zur Korrektur"
- Betrieb kann erneut bearbeiten und absenden
- Lehrkraft sieht aktualisierten Status

### Keine automatische Freigabe
- Lehrkraft muss aktiv entscheiden
- Verhindert Missbrauch (z.B. Betrieb will schlechte Bewertung "verschwinden lassen")

---

## Bewertung ohne Betriebsfeedback (Fallback)

### Wann relevant?
- Betrieb reagiert trotz mehrfacher Erinnerung nicht auf Beurteilungsanfrage

### Ablauf
1. Lehrkraft sieht in Bewertungs-Akte: "Betrieb hat nicht bewertet"
2. Option "Ohne Betriebsfeedback benoten" verfügbar
3. Lehrkraft muss Begründung dokumentieren
4. Betriebsteil entfällt aus der Gesamtnote (gewichteter Durchschnitt angepasst)

### Konsequenz
- Note basiert nur auf: Bewerbungsprozess + Lernaufgaben + Gesamteindruck
- Klar dokumentiert: "Berechnung ohne Betriebsteil"

---

## Betrieb-Duplikaterkennung

### Goldstandard-Ansatz
1. **Photon API** (OSM-basiert, DSGVO-konform) für Adress-Normalisierung (Autocomplete)
2. **Fuzzy-Match** auf normalisiertem Firmennamen + exakte PLZ
3. **Admin-Merge-Funktion** falls Duplikate durchrutschen

### Bei Eingabe
- System zeigt: "Meintest du einen dieser Betriebe?"
- Schüler kann auswählen oder "Nein, neuer Betrieb" bestätigen

### Bestehender Account
- Wenn Betrieb existiert: Schüler wird zugewiesen (kein neuer Account)
- Betrieb erhält Nachricht: "Neuer Praktikant: Max Müller"

---

## Praktikumszeiträume & Ferien

### Zeiträume durch Schule festgelegt
- Admin legt Praktikumszeiträume im Admin-Bereich fest
- Schüler kann nur innerhalb dieser Zeiträume planen
- **Ferien-Überschneidung nicht möglich** (rechtlich nicht erlaubt)

### Ausnahme: Nachholen
- Nachholphase (Phase 5) findet außerhalb der Schulzeit statt
- Hier sind auch Wochenenden/Ferien erlaubt

---

## Sitzenbleiben

### Admin-Entscheidung
- Ob vorherige Praktikumstage angerechnet werden = schulindividuell
- **Default:** Nicht anrechnen (konservativer Ansatz)
- Admin kann Einstellung ändern

---

## Noch offen

- [x] ~~Krankmeldung: Wer informiert Eltern?~~ → V2-Feature (optional, pro Schule konfigurierbar)
- [ ] Genaue Aufbewahrungsfristen für archivierte Daten
- [ ] Jahreswechsel-Workflow (wer macht was wann?)

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version aus Diskussion |
| 2024-12-08 | Phase 5 Nachholen: Prüfung + Zuständigkeit |
| 2024-12-08 | Bewerbungs-Details: Lehrkraft kann einsehen |
| 2024-12-08 | Erinnerungen: 6 Trigger, alle abschaltbar |
| 2024-12-08 | Reports: V1 nur Admin, V2 Lehrkraft |
| 2024-12-08 | Mehrere Betriebe: Gewichteter Durchschnitt |
| 2024-12-08 | Duplikaterkennung: Google Places + Fuzzy Match |
| 2024-12-08 | Praktikumszeiträume: Durch Schule festgelegt |
| 2024-12-08 | Sitzenbleiben: Admin-Entscheidung |
| 2024-12-08 | NEU: Internes Betrieb-Feedback (Sterne, Notizen, "auffällig") |
| 2024-12-08 | NEU: Betrieb-Blacklist (Admin-Funktion) |
| 2024-12-08 | NEU: Bewertung ohne Betriebsfeedback (Fallback) |
| 2024-12-09 | ÜBERARBEITET: Terminplanung kalender-basiert mit Greedy-Optimierung |
| 2024-12-09 | NEU: Lehrkraft-Ansicht mit kombinierter Übersicht aller Betriebe |
| 2024-12-09 | NEU: System-Vorschläge für Terminverteilung |
| 2024-12-09 | NEU: Beurteilung-Korrektur durch Betrieb freigeben |
| 2024-12-09 | NEU: Terminvereinbarung VOR Praktikumsbeginn möglich |
| 2024-12-09 | NEU: Lehrkraft kann Termin absagen (spiegelbildlich zu Betrieb) |
| 2024-12-09 | NEU: Mehrere beurteilende Lehrkräfte (betreuend/beurteilend) |
| 2024-12-09 | NEU: Bewertungs-Deadline im Admin konfigurierbar |
| 2024-12-09 | GEÄNDERT: Status "Bei Schulleitung" blockiert Prozess nicht |
| 2024-12-09 | NEU: Betrieb-Account bei "Bei Schulleitung" erstellen (konfigurierbar) |
| 2024-12-09 | NEU: Rollen-Zuweisung mit 3 Ebenen (Schul-Default, Pro LK, Selbständerung) |
| 2024-12-10 | ERWEITERT: Teilzusagen-Sichtbarkeit für Lehrkraft (Einspruch, Übersicht, Dashboard) |
