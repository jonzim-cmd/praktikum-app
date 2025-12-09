# practical – Konzept v2

> Dieses Dokument ist das **aktive Arbeitsdokument** für die Konzeptentwicklung.
> Status: In Bearbeitung

---

## Inhaltsverzeichnis

1. [Grundlagen](#1-grundlagen)
2. [Rollen](#2-rollen)
3. [Phasen-Übersicht](#3-phasen-übersicht)
4. [Phase 1: Bewerbung](#4-phase-1-bewerbung)
5. [Phase 2: Vertrag](#5-phase-2-vertrag)
6. [Phase 3: Praktikum](#6-phase-3-praktikum)
7. [Phase 4: Nachbereitung](#7-phase-4-nachbereitung)
8. [Phase 5: Nachholen](#8-phase-5-nachholen)
9. [Lernaufgaben](#9-lernaufgaben)
10. [Bewertungssystem](#10-bewertungssystem)
11. [Offene Fragen](#11-offene-fragen)

---

## 1. Grundlagen

### 1.1 Gesetzliche Basis (§15 WSO Bayern)

| Schulform | Jahrgangsstufen | Gesamttage |
|-----------|-----------------|------------|
| Zweistufig | 10 + 11 | 15 Tage |
| Drei-/Vierstufig | 8-10 | 20 Tage |

**Kernregeln:**
- Mindestens 2 unterschiedliche Betriebe
- Versäumte Tage außerhalb der Unterrichtszeit nachholen
- Verteilung auf Jahrgangsstufen legt Schulleitung fest
- In der Regel Blockform, ganztägig
- Note fließt in Übungsunternehmen ein (einfach gewichtet)
- Praktikum ist **Voraussetzung für Zulassung zur Abschlussprüfung**

### 1.2 App-Name & Branding

**Name:** practical

**Farbzuordnung nach Rolle:**
| Rolle | Farbe | Hex |
|-------|-------|-----|
| Schüler | Lila/Blau | #6366F1 |
| Lehrer | Grün | #34D399 |
| Betrieb | Orange | #FF6B35 |

### 1.3 Kernprinzipien

1. **Lehrkräfte müssen es lieben** → Weniger Stress, klarer Überblick, weniger Hinterherrennen
2. **Betriebe dürfen es nicht hassen** → Minimaler Aufwand, kein Zwang
3. **Schüler werden zur Eigenverantwortung geführt** → Klare Aufgaben, Nachweispflicht, Konsequenzen sichtbar

---

## 2. Rollen

### 2.1 Schüler
- **Gerät:** Primär Smartphone (Mobile-First)
- **Hauptaktionen:** Bewerbungen tracken, Verträge organisieren, Anwesenheit dokumentieren, Aufgaben bearbeiten

### 2.2 Lehrkraft (Betreuung)
- **Gerät:** Desktop + Mobile
- **Hauptaktionen:** Schüler-Übersicht, Betriebsbesuche planen, Aufgaben bewerten, Bewerbungsprozess beurteilen

### 2.3 Betrieb (Ansprechpartner)
- **Gerät:** Browser oder App
- **Hauptaktionen:** Anwesenheit bestätigen, Beurteilung abgeben, Besuchstermine koordinieren
- **Account-Erstellung:** Erst nach Vertragsabschluss und Prüfung durch Lehrkraft
- **Authentifizierung:** Magic Link + E-Mail-Verifizierung (2FA-light, siehe 5.4)

### 2.4 Schuladmin
- **Hauptaktionen:** Schüler/Lehrer importieren, Zuordnungen vornehmen, Praktikumszeiträume konfigurieren
- **Betrieb-Verwaltung:** Betriebe sperren (Blacklist), Duplikate zusammenführen, interne Feedbacks einsehen

### 2.5 Superadmin
- **Hauptaktionen:** Schulen anlegen, technische Verwaltung

---

## 3. Phasen-Übersicht

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Bewerbung  │ → │   Vertrag   │ → │  Praktikum  │ → │Nachbereitung│ → │  Nachholen  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

**Wichtig:** Schüler können sich in mehreren Phasen gleichzeitig befinden:
- Beispiel: Vertrag für Betrieb A läuft, gleichzeitig Bewerbung für Betrieb B
- Dashboard zeigt Fokus auf dringendste Phase, aber alle Phasen sind erreichbar

---

## 4. Phase 1: Bewerbung

### 4.1 Ziel
Schüler findet Praktikumsplatz und dokumentiert seine Bewerbungsversuche mit Nachweisen.

### 4.2 Kernproblem & Lösung

**Problem:** Viele Schüler kümmern sich nicht rechtzeitig. 80% haben kurz vor Praktikumsbeginn noch keine Stelle.

**Lösung:**
- Pflicht zur Dokumentation aller Anfragen mit Nachweisen
- Zeitdruck durch Ampelsystem sichtbar machen
- Lehrkraft sieht auf einen Blick: Wer kümmert sich? Wer nicht?
- Bewerbungsprozess fließt in Bewertung ein

### 4.3 Schüler-Flow

#### Onboarding (Erstanmeldung)
Mehrstufiges Onboarding mit:
- Was ist das Praktikum? (Pflicht für Abschlussprüfung!)
- Wie viele Tage? (individuell pro Schule konfiguriert)
- Wann ist der Praktikumszeitraum? (konkretes Datum)
- Was sind die nächsten Schritte?
- → Ende: Klarheit über aktuelle Phase und erste Aufgabe

#### Bewerbungs-Ampel (Zeitdruck-Anzeige)

Zeigt dem Schüler, wie viel Zeit noch bleibt:

| Phase | Zeitraum (konfigurierbar) | Bedeutung |
|-------|---------------------------|-----------|
| 🟢 Grün | 3+ Monate vor Praktikum | Beste Zeit für Wunschbetriebe |
| 🟡 Gelb | 1-3 Monate vor Praktikum | Wird knapper, auch andere Branchen in Betracht ziehen |
| 🔴 Rot | <1 Monat vor Praktikum | Kritisch – Hauptsache Praktikum! |

#### Anfrage/Bewerbung dokumentieren

**Kontaktart:**
- E-Mail
- Anruf
- Persönlich vorbeigeschaut
- Schriftliche Bewerbung (Post)

**Pflichtfelder:**
- Betriebsname
- Adresse (für eindeutige Identifikation)
- Kontaktart
- Nachweis (siehe unten)

**Optionale Felder (können später ergänzt werden):**
- Ansprechpartner
- E-Mail des Betriebs
- Telefon des Betriebs

**Nachweise je nach Kontaktart:**

| Kontaktart | Nachweis | Verifizierbarkeit |
|------------|----------|-------------------|
| E-Mail | Screenshot mit sichtbarer E-Mail-Adresse | ✅ Hoch (prüfbar) |
| Schriftliche Bewerbung | Foto/Scan der Bewerbung | ✅ Hoch |
| Anruf | Telefonnummer + Datum + Uhrzeit + ggf. Name Ansprechpartner | ⚠️ Niedrig |
| Persönlich | Adresse + Datum + Uhrzeit | ⚠️ Niedrig |

> **Bei Anruf/Persönlich:** System zeigt Warnung: "Dieser Nachweis ist schwer überprüfbar. Lehrkraft kann nachfragen."

**Status einer Bewerbung:**
| Status | Beschreibung |
|--------|--------------|
| Offen | Anfrage gesendet, wartet auf Antwort |
| Gespräch | Einladung zum Vorstellungsgespräch erhalten |
| Zusage | Praktikumsplatz erhalten! |
| Abgelehnt | Absage erhalten |
| Keine Antwort | Nach 2 Wochen ohne Rückmeldung (manuell setzbar) |

> Nach 2 Wochen "Offen" erhält Schüler Erinnerung: "Hast du Antwort erhalten?"

### 4.4 Zusage erhalten

Wenn Status auf "Zusage" geändert wird:
1. Schüler gibt Zeitraum ein (Von, Bis, Anzahl Tage)
2. Lehrkraft hat 36h Zeit für Einspruch (Wochenende pausiert)
3. Kein Einspruch → Vertragsprozess startet automatisch
4. Einspruch → Schüler wird informiert mit Grund

**Bei Teilzusage** (z.B. nur 5 von 10 Tagen):
- Schüler bleibt parallel in Bewerbungsphase für restliche Tage
- Dashboard zeigt beides: Vertragsprozess für Betrieb A + "Du brauchst noch X Tage"

### 4.5 Lehrkraft-Sicht

**Dashboard zeigt pro Schüler:**
- Status: Zusage / Offen / Kritisch
- Anzahl dokumentierter Anfragen
- Davon: E-Mail/Schriftlich (verifizierbar) vs. Anruf/Persönlich (nicht verifizierbar)
- Letzte Aktivität

**Beispiel-Ansicht:**

| Schüler | Status | Anfragen | Davon verifizierbar | Einschätzung |
|---------|--------|----------|---------------------|--------------|
| Anna | ✅ Zusage | 3 | 2 | OK |
| Ben | ⚠️ Offen | 8 | 5 | Bemüht sich |
| Clara | 🔴 Offen | 2 | 0 | Fragwürdig |
| David | 🔴 Offen | 0 | 0 | Keine Aktivität |

> **Nutzen:** Lehrkraft sieht sofort, wer Unterstützung braucht vs. wer sich nicht kümmert. Kein Hinterherrennen nötig – die Daten sprechen für sich.

### 4.6 Einspruch durch Lehrkraft (Ausnahmefall)

Lehrkraft kann Praktikumsplatz ablehnen, wenn:
- Betrieb ungeeignet (bildet nicht aus, zu weit weg, im Ausland)
- Zeitraum passt nicht zu Schulzeiten

Bei Ablehnung: Schüler wird informiert und muss Betrieb absagen.

---

## 5. Phase 2: Vertrag

### 5.1 Ziel
Rechtsgültiger Vertrag zwischen Schule, Betrieb und Erziehungsberechtigten.

### 5.2 Ablauf

```
Zusage → Daten prüfen → PDF erstellen → Unterschriften (Eltern+Betrieb) → Abgabe an Lehrkraft → Schule unterschreibt → Lehrkraft lädt hoch → Betrieb erhält Account
```

#### Schritt 1: Daten prüfen
Vor PDF-Erstellung prüft/ergänzt Schüler:
- Betriebsdaten vollständig? (Ansprechpartner, E-Mail jetzt Pflicht)
- Zeitraum korrekt?
- Eigene Daten korrekt?

#### Schritt 2: PDF generieren
System erstellt Vertrag aus Template mit allen Daten.

**Kein Drucker?** Schüler kann "Druck beantragen":
1. Schüler klickt [Druck beantragen]
2. Lehrkraft erhält Benachrichtigung
3. Lehrkraft druckt und markiert als "gedruckt"
4. Schüler erhält: "Kann im Sekretariat abgeholt werden"

#### Schritt 3: Unterschriften sammeln
Schüler ist verantwortlich für:
- Unterschrift Erziehungsberechtigte
- Unterschrift Betrieb
- Reihenfolge egal

**Varianten für Betrieb:**
- Papier-Vertrag unterschreiben lassen
- Oder: PDF per E-Mail senden (manche Betriebe bevorzugen das)

#### Schritt 4: Abgabe an Lehrkraft
Schüler gibt unterschriebenen Vertrag an Lehrkraft:
- **Physisch:** Vertrag in Papierform abgeben
- **Digital:** Scan/Foto in App hochladen

#### Schritt 5: Schule unterschreibt
- Lehrkraft/Schule prüft Vollständigkeit
- Schule unterschreibt und stempelt
- Lehrkraft lädt den **fertigen** Vertrag (mit allen Unterschriften inkl. Schule) hoch
- Oder: Lehrkraft lehnt ab (z.B. "Unterschrift fehlt", "Betrieb ungeeignet")

### 5.3 Vertragsstatus (vereinfacht)

| Status | Bedeutung | Wer ist dran? |
|--------|-----------|---------------|
| 📝 Unterschriften sammeln | Schüler holt Unterschriften (Eltern, Betrieb) | Schüler |
| 📥 Bei Lehrkraft | Schüler hat abgegeben, Schule muss unterschreiben | Lehrkraft |
| ✅ Bestätigt | Vertrag vollständig, Betrieb-Account wird erstellt | - |
| ❌ Abgelehnt | Lehrkraft hat abgelehnt (mit Grund) | Schüler |

### 5.4 Betrieb-Account

**Account wird erst erstellt, wenn:**
- Vertrag unterschrieben und hochgeladen
- Lehrkraft hat geprüft und bestätigt

**Dann:** Automatische E-Mail an Betrieb mit Magic Link.

**Authentifizierung (Magic Link + E-Mail-Verifizierung):**
- Betrieb klickt Magic Link → E-Mail-Verifizierungs-Code wird gesendet
- Code eingeben → Browser wird 90 Tage "vertraut" (Cookie-basiert)
- Nach 90 Tagen Inaktivität oder neuem Browser: Code erneut nötig
- Optional: Betrieb kann jederzeit Passwort-Login einrichten

**Warum 2FA-light?**
- Magic Links allein = Sicherheitsrisiko bei Zugriff auf Schülerdaten
- E-Mail-Verifizierung verhindert unbefugten Zugriff bei weitergeleiteten Links
- Details: `docs/ENTSCHEIDUNGEN-BETRIEB.md`

---

## 6. Phase 3: Praktikum

### 6.1 Ziel
Dokumentation der Anwesenheit und ggf. Bearbeitung von Lernaufgaben.

### 6.2 Anwesenheitsbestätigung

**Keine Uhrzeiten**, nur Tagesbestätigung.

#### Schüler dokumentiert täglich
- "Ich war heute im Praktikum" (ein Tap)
- Bei Krankheit: Krankmeldung mit Attest-Upload

#### Betrieb bestätigt wöchentlich (gesammelt)
Am Ende jeder Woche erhält Betrieb Zusammenfassung:
> "Max war laut eigener Angabe an folgenden Tagen da: Mo, Di, Mi, Do, Fr. Stimmt das?"

**Optionen für Betrieb:**
| Option | Auswirkung |
|--------|------------|
| ✅ Alle bestätigen | Alle Tage werden gezählt |
| ✅ Mit Änderungen | Betrieb kann einzelne Tage korrigieren |
| ❌ Ablehnen | Lehrkraft wird informiert |

**Keine stillschweigende Bestätigung:**
- Wenn Betrieb nicht reagiert: Nach 7 Tagen wird Lehrkraft informiert
- Lehrkraft muss dann selbst handeln (anrufen, E-Mail schreiben)
- Mehr Kontrolle, weniger automatische Annahmen

**Später optional:** QR-Code als schnellere Alternative für Betriebe, die das wollen.

### 6.3 Krankmeldung

1. Schüler wählt Krankheitstage aus (ein Tag oder Zeitraum)
2. Betrieb + Lehrkraft werden automatisch informiert (eine Mail pro Meldung)
3. Schüler muss Attest hochladen (Frist konfigurierbar, z.B. 3 Tage)
4. Kranktage werden als "nachzuholen" markiert
5. Keine Gesund-Meldung nötig – Schüler erscheint einfach wieder

### 6.4 Fortschrittsanzeige

Schüler sieht:
- X von Y Tagen absolviert
- Visueller Fortschrittsbalken
- Verbleibende Tage im aktuellen Block
- Gesamtfortschritt über alle Praktika
- Nachzuholende Tage (falls vorhanden)

### 6.5 Lehrkraft während Praktikum

- Anwesenheitsübersicht aller Schüler
- Atteste einsehen/einfordern
- Betriebsbesuche planen (Kartenansicht)
- Besuchstermine mit Betrieb koordinieren

### 6.6 Betrieb während Praktikum

- Anwesenheit bestätigen (wöchentlich gesammelt)
- Besuchstermine bestätigen/ablehnen/Alternative vorschlagen

---

## 7. Phase 4: Nachbereitung

### 7.1 Ziel
Reflexion des Praktikums, Beurteilung durch Betrieb, Abschluss.

### 7.2 Schüler-Aufgaben

- Reflexionsbogen ausfüllen (wenn von Schule aktiviert)
- Ggf. weitere Lernaufgaben (z.B. Bewerbungsmappe hochladen)
- Kann Praktikum/Betrieb bewerten (interne Weiterempfehlung für zukünftige Schüler)
- **Zertifikat herunterladen**
  - **Vollständiges Zertifikat:** Nach Abschluss aller Phasen (inkl. Nachholen)
  - **Vorläufiger Nachweis:** Direkt nach Phase 4, mit Vermerk "X Tage noch zu absolvieren"
  - PDF mit Schülername, Schule, Zeitraum, Betrieb(e), Tage
  - Für zukünftige Bewerbungen verwendbar

### 7.3 Betrieb-Aufgaben

- **Beurteilungsbogen ausfüllen** (Pflicht)
  - Kann bereits in letzter Praktikumswoche freigeschaltet werden
  - Likert-Skala + optionaler Freitext
  - Maximal 5 Minuten Aufwand
  - Enthält Frage zu Pünktlichkeit/Zuverlässigkeit (statt täglicher Granularität)
- Erhält Nachricht bei Weiterempfehlung durch Schüler
- Kann Feedback zur App geben
- **Praktikumsdatenbank (V1-Feature):**
  - Nach Beurteilung: Opt-in-Frage "Möchten Sie in der Praktikumsdatenbank erscheinen?"
  - Für zukünftige Schüler als möglicher Praktikumsplatz sichtbar
  - Betrieb kann jederzeit austragen (in Einstellungen oder per Link)
  - DSGVO-konform: Opt-in statt Opt-out
  - Details: `docs/ENTSCHEIDUNGEN-BETRIEB.md`

### 7.4 Lehrkraft-Aufgaben

- Abgegebene Aufgaben einsehen
- Aufgaben bewerten (falls benotet)
- Aufgaben zur Überarbeitung zurückgeben
- Beurteilung des Betriebs einsehen
- **Bewerbungsprozess beurteilen** (siehe Bewertungssystem)
- Gesamtnote vergeben (falls Benotung aktiviert)

---

## 8. Phase 5: Nachholen versäumter Tage

### 8.1 Wann relevant?
Wenn Schüler Tage verpasst hat (Krankheit, etc.) und diese außerhalb der Unterrichtszeit nachholen muss.

### 8.2 Prinzip
- **Schüler ist komplett selbst verantwortlich**
- Schule/Lehrkraft betreut nicht aktiv
- Kann in beliebigem Betrieb nachgeholt werden (auch neu)
- Kein Vertragsprozess, kein Betrieb-Account nötig

### 8.3 Ablauf

1. System zeigt: "Du musst noch X Tage nachholen"
2. Schüler lädt **Nachweisbogen** herunter (PDF von System generiert)
3. Schüler macht Praktikumstag(e) in einem Betrieb
4. Betrieb unterschreibt Nachweisbogen
5. Schüler lädt unterschriebenen Nachweis hoch
6. Tage werden gutgeschrieben

### 8.4 Keine Bewertung
Nachgeholte Tage werden nur "abgehakt", fließen nicht in Note ein.

---

## 9. Lernaufgaben

### 9.1 Definition
Lernaufgaben sind **schulindividuell konfigurierbare Aufgaben**, die Schüler bearbeiten müssen.

### 9.2 Unterscheidung

| Typ | Beispiele | Bewertbar | Pflicht |
|-----|-----------|-----------|---------|
| **Lernaufgaben** | Erwartungen formulieren, Beobachtungsauftrag, Reflexionsbogen, Bewerbungsmappe | Ja (optional) | Konfigurierbar |
| **Prozess-Aufgaben** | Anwesenheit bestätigen, Vertrag hochladen, Attest einreichen | Nein | Systemgesteuert |

### 9.3 Eigenschaften von Lernaufgaben

- Titel + Beschreibung
- Zugeordnete Phase (Vor Praktikum, Während, Nach)
- Deadline (optional)
- Abgabeformat (Text, Datei-Upload, Formular)
- Bewertbar (Ja/Nein)
- Sichtbar für Betrieb (Ja/Nein)

### 9.4 Standard-Lernaufgaben (Vorschläge)

| Aufgabe | Phase | Beschreibung |
|---------|-------|--------------|
| Erwartungen formulieren | Vor | "Was erhoffst du dir vom Praktikum?" |
| Beobachtungsauftrag | Während | "Beobachte und dokumentiere: ..." |
| Tagesbericht | Während | "Beschreibe deinen heutigen Tag" |
| Reflexionsbogen | Nach | "Was hast du gelernt? Was würdest du anders machen?" |
| Bewerbungsmappe | Nach | Vollständige Unterlagen hochladen |

> Schulen können diese aktivieren/deaktivieren und eigene hinzufügen.

---

## 10. Bewertungssystem

### 10.1 Komponenten der Gesamtnote

Die Praktikumsnote setzt sich aus mehreren Komponenten zusammen (Gewichtung konfigurierbar):

| Komponente | Bewertet von | Zeitpunkt |
|------------|--------------|-----------|
| Beurteilungsbogen | Betrieb | Nach Praktikum |
| Bewerbungsprozess | Lehrkraft | Nach Bewerbungsphase |
| Lernaufgaben | Lehrkraft | Je nach Aufgabe |
| Gesamteindruck | Lehrkraft | Am Ende |

### 10.2 Beurteilungsbogen Betrieb

**Likert-Skala (1-5) für:**
- Pünktlichkeit und Zuverlässigkeit
- Sorgfalt bei der Arbeit
- Selbstständigkeit
- Teamfähigkeit
- Interesse und Engagement
- Freundlichkeit im Umgang

**Freitext (optional):**
- Besondere Stärken
- Verbesserungsvorschläge

**Abschlussfrage:**
- Würden Sie den Schüler weiterempfehlen? (Ja / Eher ja / Eher nein / Nein)

### 10.3 Bewertung des Bewerbungsprozesses (NEU)

Lehrkraft bewertet nach der Bewerbungsphase:

**Likert-Skala (1-5) für:**
- **Eigeninitiative:** Hat sich selbstständig um Praktikumsplätze bemüht
- **Zuverlässigkeit:** Hat Deadlines eingehalten, Dokumente rechtzeitig abgegeben
- **Kommunikation:** Hat bei Problemen rechtzeitig informiert
- **Qualität:** Bewerbungen/Anfragen waren angemessen

**Wann ausfüllen?** Am Ende der Bewerbungsphase (wenn Schüler alle benötigten Zusagen hat).

> **Nutzen als Druckmittel:** Schüler wissen von Anfang an, dass ihr Verhalten in der Bewerbungsphase bewertet wird.

---

## 11. Offene Fragen

### Noch zu klären

1. **Gamification:** Tageschallenges während Praktikum – sinnvoll? Wie umsetzen?

2. **Erinnerungen:** Welche Erinnerungen in welchen Abständen? Konfigurierbar pro Schule?

3. **Lehrkraft-Besuch:** Pflicht? Wie wird dokumentiert? Notizen?

4. **Datenbank/Pool:** Wie genau funktioniert die Opt-in-Logik für Betriebe?

### Geklärte Fragen

**Onboarding:**
- ✅ Nur beim ersten Login
- Danach: Info-Banner bei neuer Phase + Info-Button für allgemeine Infos jederzeit

**Bewerbung ohne Antwort:**
- ✅ Nach 2 Wochen: Erinnerung "Hast du Antwort erhalten?"
- Neuer Status "Keine Antwort" nach 2 Wochen setzbar

**Zeitraum bei Zusage:**
- ✅ Optional: "Zeitraum noch nicht bekannt" mit Erinnerung später nachzutragen

**Vertrag ablehnen:**
- ✅ Möglich aus verschiedenen Gründen (Unterschrift fehlt, Betrieb ungeeignet, zu weit weg)
- Bei Ablehnung: Zurück zur Bewerbungsphase

**Wochenend-Praktikum:**
- ✅ NEIN während regulärem Praktikum (muss während Schulzeit sein lt. Gesetz)
- JA beim Nachholen versäumter Tage (außerhalb Schulzeit)

**Mehrere Blöcke parallel:**
- ✅ NEIN – immer nur ein Praktikums-Block auf einmal
- Erst wenn Block 1 fertig → Block 2 beginnt

**Nachbereitung-Deadline:**
- ✅ Deadlines werden zentral im Admin-Bereich festgelegt
- Erinnerungen vor Deadline
- Bei Versäumnis: 0 Punkte
- Option "Keine Abgabe" bei Aufgaben nötig

### Geklärte Diskussionen

**Bewerbungs-Tracking: Anzahl-Pflicht oder nicht?**

✅ **Entscheidung:** Keine Pflicht-Anzahl, aber:
- Dokumentationspflicht für alle Anfragen (mit Nachweisen)
- Lehrkraft sieht Aktivitätslevel (Anzahl + Verifizierbarkeit)
- Bewerbungsprozess wird bewertet und fließt in Note ein

**Begründung:** Pflicht-Anzahl würde zu Fake-Bewerbungen einladen. Stattdessen wirkt die Bewertung als Druckmittel.

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-07 | Initiale Version aus Konzept-Session |
| 2024-12-07 | Anwesenheit: Betrieb bestätigt wöchentlich statt täglich |
| 2024-12-07 | Vertragsstatus vereinfacht (3 Status statt Checkliste) |
| 2024-12-07 | Genehmigung entfernt: Vertragsprozess startet sofort nach Zusage |
| 2024-12-07 | Nachweis-System differenziert nach Kontaktart |
| 2024-12-07 | Verspätung: Nicht täglich, sondern in Betrieb-Beurteilung |
| 2024-12-07 | NEU: Bewertung des Bewerbungsprozesses durch Lehrkraft |
| 2024-12-07 | Vertragsprozess korrigiert: Schule unterschreibt zuletzt, Lehrkraft lädt fertigen Vertrag hoch |
| 2024-12-07 | NEU: "Druck beantragen" Funktion für Schüler ohne Drucker |
| 2024-12-07 | Neuer Status "Keine Antwort" bei Bewerbungen (nach 2 Wochen) |
| 2024-12-07 | Zeitraum bei Zusage: Optional "noch nicht bekannt" |
| 2024-12-07 | Wochenend-Praktikum: Nein während Praktikum, Ja beim Nachholen |
| 2024-12-07 | Klarstellung: Immer nur ein Block gleichzeitig |
| 2024-12-07 | Deadlines + "Keine Abgabe" Option für Lernaufgaben |
| 2024-12-08 | NEU: Zertifikat für Schüler nach Praktikumsabschluss |
| 2024-12-08 | Betrieb: Magic Link + E-Mail-Verifizierung dokumentiert |
| 2024-12-08 | Betrieb: Stillschweigende Anwesenheitsbestätigung (7 Tage) |
| 2024-12-08 | Admin: Betrieb-Blacklist + Duplikate-Merge |
| 2024-12-08 | Praktikumsdatenbank als V1-Feature (mit Opt-in) |
