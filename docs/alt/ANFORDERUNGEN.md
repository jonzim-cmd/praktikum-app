# Praktikumsmanagement-App für Schulen

## Projektübersicht

Eine Webanwendung zur Verwaltung, Betreuung und Dokumentation von Schülerpraktika an bayerischen Wirtschaftsschulen (perspektivisch erweiterbar auf FOS und andere Bundesländer).

### Zielsetzung

- Reduktion des administrativen Aufwands für Lehrkräfte
- Transparenz über Praktikumsstatus aller Schüler
- Eigenverantwortung der Schüler fördern durch klare Aufgaben und Deadlines
- **Minimaler Aufwand für Betriebe** (kritischer Erfolgsfaktor!)
- DSGVO-konforme, in Deutschland gehostete Lösung
- Mandantenfähig für mehrere Schulen
- Aufbau einer wertvollen Betriebsdatenbank über Zeit

### Kernprinzip: Betriebe dürfen die App nicht hassen

> **Wenn Betriebe genervt sind, beschweren sie sich bei der Schule. Dann kippt das Projekt.**

Die App steht und fällt mit zwei Dingen:
1. **Lehrkräfte müssen es lieben** → Weniger Stress, mehr Überblick
2. **Betriebe dürfen es nicht hassen** → Minimaler Aufwand, kein Zwang, echter Mehrwert

**Mehrwert für Betriebe:**

| Problem des Betriebs | Lösung durch die App |
|---------------------|---------------------|
| Papierkram mit Schule | Alles digital, kein Faxen/Scannen |
| "Wann kommt die Lehrkraft?" | Terminvorschläge direkt in App |
| Praktikumszeugnis schreiben | Vorlage/Generator für Betriebe |
| Krankmeldung kommt nicht an | Sofortige Benachrichtigung |
| Kommunikation mit Schule | Direkter Chat statt Telefon-Ping-Pong |

**Der Flow für Betriebe muss minimal sein:**
1. Link von Schule bekommen
2. Einloggen (E-Mail + selbst gewähltes Passwort, KEIN langes Registrierungsformular)
3. Praktikant zugewiesen sehen
4. Anwesenheit: 1 Klick pro Tag (oder gesammelt pro Woche)
5. Bewertung am Ende: 5 Minuten

### Zielgruppen

| Rolle | Beschreibung |
|-------|--------------|
| **Schüler** | Führt Praktikum durch, dokumentiert, lädt Nachweise hoch |
| **Lehrkraft (Betreuung)** | Betreut zugewiesene Schüler, besucht Betriebe, überwacht Fortschritt |
| **Lehrkraft (Fachbewertung)** | Bewertet Portfolio/Dokumentation (kann dieselbe Person sein) |
| **Betrieb (Ansprechpartner)** | Bestätigt Anwesenheit, gibt Beurteilung ab |
| **Admin** | Konfiguriert Schule, legt Nutzer an, verwaltet Einstellungen |

---

## Gesetzliche Grundlagen

### Wirtschaftsschule Bayern (§ 15 WSO)

```
Zweistufig (Klasse 10+11): 15 Tage
Drei-/Vierstufig (Klasse 8-10): 20 Tage

Kernpunkte:
- Mindestens 2 unterschiedliche Einrichtungen
- Versäumte Tage außerhalb der Unterrichtszeit nachholen
- Vorläufige Zulassung zur Prüfung bei unvollständigem Praktikum möglich
- Note durch Schule mit Beitrag der Einrichtung (Bewertungsbogen)
- Note fließt in Übungsunternehmen ein (einfache Gewichtung)
- Härtefallregelung durch Schulleitung auf Vorschlag Klassenkonferenz
```

### FOS Bayern (§ 13 FOBOSO) – für spätere Erweiterung

```
Drei Bereiche:
1. Fachpraktische Anleitung + Dokumentation + Reflexion
2. Fachpraktische Vertiefung
3. Fachpraktische Tätigkeiten (außerschulisch)

Kernpunkte:
- Blockform bis zu 5 Wochen
- Punktesystem (0-15 Punkte)
- Mehr als 5 unentschuldigte Tage = nicht bestanden
- Nachholen auch in Sommerferien möglich
```

---

## Datenmodell (konzeptionell)

### Kernentitäten

```
School (Mandant)
├── Configuration (Praktikumstage, Deadlines, Module)
├── Users
│   ├── Admin
│   ├── Teacher
│   └── Student
├── Companies (Betriebe)
│   └── Contacts (Ansprechpartner)
└── InternshipProgram (Praktikumsprogramm einer Klasse/Kohorte)

Student
└── InternshipProject (1 pro Schüler, z.B. "15 Tage gesamt")
    ├── InternshipBlocks (mehrere Blöcke in verschiedenen Betrieben)
    │   ├── TimeEntries (Tageseinträge)
    │   ├── Reports (Tätigkeitsnachweise/Berichtshefte)
    │   └── SickLeaves (Krankmeldungen)
    ├── Milestones (Erwartungen, Bewerbung, etc.)
    ├── Documents (Vertrag, Portfolio, Attest-Uploads)
    └── Assessments (Bewertungen durch Betrieb und Lehrkraft)
```

### Wichtige Designentscheidungen

1. **Ein InternshipProject pro Schüler** (nicht pro Schuljahr), da die 15/20 Tage als Gesamteinheit zählen
2. **Mehrere InternshipBlocks** pro Project möglich (verschiedene Betriebe, verschiedene Zeiträume)
3. **Nachholpflicht** wird automatisch berechnet (Soll-Tage minus geleistete Tage)
4. **Schuljahr-übergreifend**: Daten bleiben erhalten, wenn Schüler in Klasse 11 wechselt

---

## Feature-Katalog

### Legende

- 🟢 **Kern**: Muss im MVP enthalten sein
- 🟡 **Standard**: Sollte zeitnah nach MVP folgen
- 🟠 **Optional**: Nice-to-have, kann aktiviert/deaktiviert werden
- 🔵 **Später**: Für zukünftige Versionen / andere Schularten

---

### 1. Nutzerverwaltung & Authentifizierung

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Benutzername + Passwort Login | 🟢 Kern | Keine E-Mail-Pflicht, Accounts werden durch Admin angelegt |
| Rollen-System | 🟢 Kern | Schüler, Lehrkraft, Betrieb, Admin mit unterschiedlichen Berechtigungen |
| Biometrischer Login | 🟡 Standard | Face ID / Fingerprint auf Mobilgeräten |
| Passwort zurücksetzen | 🟢 Kern | Über Admin oder (falls E-Mail hinterlegt) Self-Service |
| Schüler-Import CSV | 🟡 Standard | Bulk-Import von Schülerdaten |
| WebUntis-Integration | 🔵 Später | Automatischer Schüler-Sync |
| Multi-Tenancy | 🟢 Kern | Mehrere Schulen isoliert in einer Instanz |

---

### 2. Schul-Konfiguration (Admin-Bereich)

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Praktikumstage festlegen | 🟢 Kern | 15 Tage (zweistufig) oder 20 Tage (drei-/vierstufig) |
| Praktikumszeiträume definieren | 🟢 Kern | Blockzeiträume mit Start- und Enddatum |
| Pflichtmodule aktivieren | 🟢 Kern | Welche Dokumentationsanforderungen gelten (Berichtsheft, Erwartungen, etc.) |
| Deadlines konfigurieren | 🟢 Kern | Globale und Meilenstein-spezifische Deadlines |
| Bewertungsraster | 🟡 Standard | Konfigurierbare Bewertungskriterien |
| Schuljahr-Verwaltung | 🟡 Standard | Archivierung alter Daten, neues Schuljahr anlegen |
| Min. 2 Betriebe als Regel | 🟠 Optional | Warnung wenn Schüler alles in einem Betrieb macht (mit Override-Option) |

---

### 3. Praktikumssuche & Bewerbungsphase

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Meilenstein "Bewerbungen senden" | 🟢 Kern | Mit Deadline, Schüler dokumentiert Versuche |
| Bewerbungsnachweis hochladen | 🟢 Kern | Screenshot/PDF der Bewerbung |
| Praktikumszusage eintragen | 🟢 Kern | Löst automatisch nächste Meilensteine aus |
| Praktikumsplatz-Börse | 🔵 Später | Datenbank mit Betrieben, die Praktikanten suchen |
| Betriebsdatenbank | 🟠 Optional | Wiederverwendbare Betriebsdaten aus vergangenen Jahren |

---

### 4. Betriebsverwaltung & Vertrag

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Betrieb anlegen | 🟢 Kern | Name, Adresse, Branche, Ansprechpartner, Kontaktdaten |
| Ansprechpartner mit Login | 🟢 Kern | Betrieb erhält Zugang zur App (angelegt durch Lehrkraft/Admin) |
| Vertrag aus Vorlage generieren | 🟢 Kern | Automatisch befüllt mit Schüler- und Betriebsdaten → PDF |
| Vertragsstatus tracken | 🟢 Kern | Erstellt → Bei Schüler → Finalisiert |
| Vertrag-Upload | 🟢 Kern | Unterschriebenen Vertrag hochladen (Scan/Foto) |
| Scan-Funktion in App | 🟡 Standard | Dokument mit Kamera scannen |
| Erinnerungen Vertragsstatus | 🟡 Standard | Push/E-Mail wenn Vertrag lange "Bei Schüler" |
| Digitale Signatur | 🔵 Später | Für volljährige Schüler, rechtlich zu prüfen |
| Kartenansicht Betriebe | 🟢 Kern | Alle Betriebe auf Karte, Klick → Weiterleitung zu Apple/Google Maps |

---

### 4b. Betriebe-CRM & Praktikumsplatz-Pool

**Kernidee:** Über die Jahre entsteht automatisch eine wertvolle Datenbank aller Betriebe, in denen Schüler Praktikum gemacht haben – mit Ansprechpartnern, Kontaktdaten und internen Bewertungen.

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Automatische Betriebskartei | 🟢 Kern | Jeder Betrieb wird gespeichert (Name, Adresse, Branche, Ansprechpartner) |
| Betriebshistorie | 🟢 Kern | "Welche Schüler waren hier?" – Übersicht vergangener Praktika |
| Opt-in für Pool | 🟡 Standard | Betrieb wird gefragt: "Möchten Sie wieder Praktikanten aufnehmen?" |
| Praktikumsplatz-Börse | 🟡 Standard | Schüler sehen verfügbare Betriebe aus dem Pool |
| Interne Schüler-Bewertung | 🟡 Standard | Schüler bewerten Betrieb anonym (nur für Schule sichtbar, nicht für Betrieb) |
| Löschung auf Anfrage | 🟢 Kern | Betrieb kann Löschung aus Pool beantragen (DSGVO) |
| Betriebssuche/Filter | 🟡 Standard | Nach Branche, Ort, Bewertung filtern |

**Wichtige Regeln:**
- Schüler-Bewertungen erst ab 2-3 Bewertungen sichtbar (Anonymität schützen)
- Betrieb sieht seine Bewertungen **nicht** (verhindert Konflikte)
- Transparente Kommunikation: Betrieb weiß, dass er im Pool ist
- Bewertungsfragen für Schüler: "Würdest du diesen Betrieb weiterempfehlen?", "Wie war die Betreuung?", "Was hast du gelernt?"

**Langfristiger Wert:** Nach 3-5 Jahren hat die Schule eine gepflegte Kartei mit 50-100+ lokalen Betrieben – ein echtes Asset.

---

### 5. Vorbereitungsaufgaben (Meilensteine vor Praktikum)

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Erwartungen formulieren | 🟢 Kern | Textfeld oder Datei-Upload mit Deadline |
| Beobachtungsaufträge formulieren | 🟠 Optional | Je nach Schul-Konfiguration |
| Bewerbungsmappe hochladen | 🟠 Optional | Vollständige Bewerbungsunterlagen |
| Deadline-Erinnerungen | 🟢 Kern | Push-Benachrichtigung vor Ablauf |
| Status-Übersicht für Lehrkraft | 🟢 Kern | Wer hat was abgegeben? (Ampel-System) |

---

### 6. Während des Praktikums: Anwesenheit

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Tagesbestätigung | 🟢 Kern | Schüler markiert Tag als absolviert |
| Bestätigung durch Betrieb | 🟢 Kern | Betrieb zeichnet Anwesenheit ab (täglich oder gesammelt) |
| Fortschrittsanzeige | 🟢 Kern | "X von 15 Tagen absolviert" mit visuellem Balken |
| Check-in/Check-out mit Uhrzeit | 🟠 Optional | Für Schulen, die Stundennachweis brauchen |
| QR-Code Bestätigung | 🟡 Standard | Schüler zeigt QR-Code, Betrieb scannt → Bestätigung ohne Login |
| Offline-Fähigkeit | 🟡 Standard | Einträge zwischenspeichern, später synchronisieren |

**QR-Code Bestätigung (Details):**

Reduziert den Aufwand für Betriebe auf ein Minimum:
1. Schüler öffnet App → zeigt persönlichen QR-Code
2. Betrieb scannt mit Smartphone-Kamera (keine App nötig)
3. Öffnet Link → "Anwesenheit bestätigen" Button
4. Fertig – kein Login erforderlich für diese Aktion

Sicherheit:
- QR-Code ist zeitlich begrenzt gültig (z.B. 24h)
- Enthält verschlüsselten Token (Schüler-ID + Datum)
- Betrieb muss nicht eingeloggt sein, aber Bestätigung wird dem Betrieb zugeordnet

---

### 7. Während des Praktikums: Dokumentation

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Tätigkeitsnachweis / Berichtsheft | 🟢 Kern | Tägliche oder wöchentliche Einträge |
| Texteingabe | 🟢 Kern | Freitext für Tätigkeitsbeschreibung |
| Spracheingabe → Text | 🟠 Optional | Voice-to-Text für schnellere Eingabe |
| Betrieb zeichnet ab | 🟡 Standard | Digitale Bestätigung des Berichts |
| Lehrkraft kommentiert | 🟡 Standard | Feedback/Korrekturen zum Bericht |
| Beobachtungsaufträge durchführen | 🟠 Optional | Einträge während des Praktikums |
| Foto-Upload | 🟡 Standard | Bilder vom Arbeitsplatz/Tätigkeiten |

---

### 8. Krankmeldung & Nachholpflicht

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Krankmeldung in App | 🟢 Kern | Schüler meldet sich krank |
| Automatische Benachrichtigung | 🟢 Kern | Betrieb + Lehrkraft werden informiert |
| Attest hochladen | 🟢 Kern | Foto/Scan des Attests |
| Nachholpflicht berechnen | 🟢 Kern | Automatisch: Fehlende Tage = nachzuholen |
| Nachholzeitraum erfassen | 🟡 Standard | Separate Zeiträume für Nachholtage |
| Status "Vorläufig zugelassen" | 🟡 Standard | Für Abschlussprüfung bei unvollständigem Praktikum |

---

### 9. Lehrkraft-Besuch im Betrieb

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Besuchstermin vorschlagen | 🟢 Kern | Lehrkraft schlägt Termin vor |
| Betrieb bestätigt/lehnt ab | 🟢 Kern | Mit Möglichkeit, Alternative vorzuschlagen |
| Termin in Kalender | 🟡 Standard | iCal-Export / Kalender-Integration |
| Kartenansicht für Routenplanung | 🟢 Kern | Alle zu besuchenden Betriebe auf Karte |
| Weiterleitung zu Maps | 🟢 Kern | Klick → Apple Maps / Google Maps mit Route |
| Besuch als durchgeführt markieren | 🟢 Kern | Mit optionalen Notizen |
| Route-Optimierung | 🔵 Später | Vorschlag für effiziente Besuchsreihenfolge |

---

### 10. Nach dem Praktikum: Abschluss & Bewertung

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Reflexion schreiben | 🟡 Standard | Abschließende Reflexion durch Schüler |
| Portfolio zusammenstellen | 🟡 Standard | Alle Dokumente gesammelt |
| Finale Abgabe mit Deadline | 🟢 Kern | Portfolio/Dokumentation einreichen |
| Bewertungsbogen Betrieb | 🟢 Kern | Likert-Skala Fragen + optionaler Freitext (max. 3-5 Min) |
| Bewertung durch Lehrkraft | 🟡 Standard | Finale Note nach Schulkonfiguration |
| **Praktikumszertifikat generieren** | 🟢 Kern | PDF mit Schullogo, Zeitraum, Betrieb, Tätigkeiten, Bewertung |
| Praktikum abschließen | 🟢 Kern | Status "Abgeschlossen" setzen |
| Export für Zeugnis | 🟡 Standard | Note exportieren für Zeugniserstellung |
| KI-Reflexionschat | 🔵 Später | Geführte Reflexion mit KI-Unterstützung |

**Praktikumszertifikat (Details):**

Das Zertifikat wird automatisch aus den vorhandenen Daten generiert und enthält:
- Schullogo (konfigurierbar pro Schule)
- Name des Schülers
- Praktikumszeitraum (Datum von–bis)
- Betrieb(e) mit Adresse
- Tätigkeitsbereiche (aggregiert aus Berichtsheft)
- Gesamtstunden / Tage
- Bewertung des Betriebs (falls freigegeben)
- Note (falls Benotung aktiviert)
- Unterschrift Schulleitung (digital oder Platzhalter für manuelle Unterschrift)

**Nutzen:**
- Schüler haben ein vorzeigbares Dokument für Bewerbungen
- Schule spart manuelles Erstellen
- Einheitliches, professionelles Format

---

### 11. Kommunikation & Benachrichtigungen

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Push-Benachrichtigungen | 🟢 Kern | Mobile Push für wichtige Events |
| E-Mail-Benachrichtigungen | 🟡 Standard | Optional zusätzlich zu Push |
| Erinnerungen vor Deadlines | 🟢 Kern | Konfigurierbar (z.B. 3 Tage, 1 Tag vorher) |
| Eskalation an Lehrkraft | 🟡 Standard | Wenn Schüler nicht reagiert |
| Betrieb ↔ Lehrkraft Nachrichten | 🟡 Standard | Einfache In-App-Kommunikation |
| Kein Schüler ↔ Lehrkraft Chat | – | Schulmessenger wird genutzt |

---

### 12. Dashboards & Übersichten

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| **Schüler-Dashboard** | 🟢 Kern | Meine Aufgaben, Fortschritt, Deadlines |
| **Lehrkraft-Dashboard** | 🟢 Kern | Alle betreuten Schüler, Ampel-Status, wer braucht Aufmerksamkeit |
| **Admin-Dashboard** | 🟢 Kern | Gesamtübersicht Schule, Statistiken |
| **Betrieb-Dashboard** | 🟢 Kern | Meine Praktikanten, offene Bestätigungen |
| Ampel-System | 🟢 Kern | Grün/Gelb/Rot basierend auf Status und Deadlines |
| Filter und Suche | 🟡 Standard | Nach Klasse, Status, Betrieb filtern |
| Export (CSV/PDF) | 🟡 Standard | Listen und Übersichten exportieren |

---

### 13. Gamification

| Feature | Priorität | Beschreibung |
|---------|-----------|--------------|
| Meilenstein-Badges | 🟠 Optional | "Praktikum gefunden", "Erste Woche geschafft" etc. |
| Fortschritts-Visualisierung | 🟢 Kern | Visueller Fortschrittsbalken (ist auch ohne Gamification sinnvoll) |
| Tagesaufgaben / Challenges | 🔵 Später | Kleine Aufgaben während des Praktikums |
| Keine Leaderboards | – | Bewusst ausgeschlossen (pädagogisch problematisch) |

---

### 14. Technische / Nicht-funktionale Anforderungen

| Anforderung | Priorität | Beschreibung |
|-------------|-----------|--------------|
| Progressive Web App (PWA) | 🟢 Kern | Funktioniert auf Desktop und Mobile, installierbar |
| Responsive Design | 🟢 Kern | Mobile-first, funktioniert auf allen Bildschirmgrößen |
| Offline-Fähigkeit | 🟡 Standard | Kernfunktionen offline nutzbar, Sync bei Verbindung |
| DSGVO-konform | 🟢 Kern | Datenschutzerklärung, Einwilligungen, Löschkonzept |
| Hosting in Deutschland | 🟢 Kern | VPS mit Root-Zugriff, deutscher Anbieter |
| Multi-Tenancy | 🟢 Kern | Mehrere Schulen isoliert |
| Konfigurierbar pro Schule | 🟢 Kern | Module an/aus, Deadlines, Bewertung |
| API für Integrationen | 🟡 Standard | REST API für spätere Anbindungen |
| Backup & Recovery | 🟢 Kern | Regelmäßige Backups, Wiederherstellungskonzept |
| Audit-Log | 🟡 Standard | Wer hat wann was geändert |

---

## Workflow-Übersicht

### Phase 1: Vorbereitung (Monate vor Praktikum)

```
1. Admin konfiguriert Praktikumsprogramm (Zeiträume, Pflichtmodule)
2. Lehrkraft erhält Schüler-Zuweisung
3. Schüler wird informiert → sieht Dashboard mit Aufgaben
4. Meilenstein: Bewerbungen verschicken (mit Deadline)
5. Schüler dokumentiert Bewerbungsversuche
6. Schüler findet Praktikum → trägt Betriebsdaten ein
7. Lehrkraft/Schüler legt Betrieb an (falls neu)
8. Vertrag wird generiert → Schüler erhält PDF
9. Vertrag wird unterschrieben → Upload in App
10. Meilenstein: Erwartungen formulieren (mit Deadline)
11. Optional: Beobachtungsaufträge formulieren
```

### Phase 2: Durchführung (Praktikumszeitraum)

```
1. Praktikum beginnt
2. Täglich: Schüler bestätigt Anwesenheit
3. Täglich/Wöchentlich: Schüler schreibt Tätigkeitsnachweis
4. Betrieb bestätigt Anwesenheit (gesammelt oder täglich)
5. Bei Krankheit: Krankmeldung → automatische Benachrichtigung
6. Lehrkraft vereinbart Besuchstermin mit Betrieb
7. Lehrkraft besucht Schüler → markiert als durchgeführt
8. Beobachtungsaufträge werden durchgeführt
```

### Phase 3: Nachbereitung (nach Praktikum)

```
1. Schüler vervollständigt Dokumentation
2. Schüler schreibt Reflexion
3. Meilenstein: Portfolio-Abgabe (mit Deadline)
4. Betrieb füllt Bewertungsbogen aus
5. Lehrkraft bewertet (falls Benotung aktiviert)
6. Praktikum wird als abgeschlossen markiert
7. Falls Tage fehlen: Nachholpflicht wird angezeigt
```

---

## Geklärte Design-Entscheidungen

### 1. Bewertungsbogen für Betriebe

Der Bewertungsbogen soll in **maximal 3-5 Minuten** ausfüllbar sein. Er besteht aus Likert-Skala-Fragen (5-stufig: 1 = trifft nicht zu, 5 = trifft voll zu) und optionalem Freitext.

**Vorgeschlagene Fragen (Default, anpassbar durch Schule):**

#### Arbeitsverhalten
- Der/Die Praktikant/in war pünktlich und zuverlässig.
- Der/Die Praktikant/in hat Aufgaben sorgfältig und gewissenhaft erledigt.
- Der/Die Praktikant/in konnte Anweisungen selbstständig umsetzen.
- Der/Die Praktikant/in hat sich aktiv um neue Aufgaben bemüht.

#### Sozialverhalten
- Der/Die Praktikant/in war freundlich und respektvoll im Umgang.
- Der/Die Praktikant/in hat sich gut ins Team eingefügt.
- Der/Die Praktikant/in war offen für Feedback und Kritik.

#### Fachliche Eignung
- Der/Die Praktikant/in zeigte Interesse an den Tätigkeiten.
- Der/Die Praktikant/in hat sich schnell in neue Aufgaben eingearbeitet.
- Der/Die Praktikant/in hat einen positiven Gesamteindruck hinterlassen.

#### Freitext (optional)
- Besondere Stärken des/der Praktikant/in:
- Verbesserungsvorschläge / Entwicklungspotenzial:
- Sonstige Anmerkungen:

#### Abschlussfrage
- Würden Sie den/die Praktikant/in weiterempfehlen? (Ja / Eher ja / Eher nein / Nein)

---

### 2. Meilenstein-System

**Prinzip:** Es gibt Default-Meilensteine, die als Vorlage dienen. Jede Schule kann:
- Default-Meilensteine aktivieren/deaktivieren
- Deadlines anpassen
- Eigene Meilensteine hinzufügen
- Reihenfolge ändern

**Default-Meilensteine (Vorschlag):**

| Phase | Meilenstein | Default-Deadline | Pflicht |
|-------|-------------|------------------|---------|
| Vorbereitung | Bewerbungen verschickt (mit Nachweis) | 8 Wochen vor Praktikum | Ja |
| Vorbereitung | Praktikumsplatz gefunden | 4 Wochen vor Praktikum | Ja |
| Vorbereitung | Vertrag finalisiert | 2 Wochen vor Praktikum | Ja |
| Vorbereitung | Erwartungen formuliert | 1 Woche vor Praktikum | Optional |
| Vorbereitung | Beobachtungsaufträge formuliert | 1 Woche vor Praktikum | Optional |
| Durchführung | Erste Woche dokumentiert | Ende Woche 1 | Ja |
| Durchführung | Lehrkraft-Besuch erfolgt | Während Praktikum | Ja |
| Nachbereitung | Berichtsheft vollständig | 1 Woche nach Praktikum | Ja |
| Nachbereitung | Reflexion geschrieben | 2 Wochen nach Praktikum | Optional |
| Nachbereitung | Portfolio abgegeben | 2 Wochen nach Praktikum | Ja |

---

### 3. Benachrichtigungs-Timing

**Prinzip:** Default-Einstellungen, die pro Schule anpassbar und komplett abschaltbar sind.

**Default-Erinnerungen:**

| Ereignis | Erinnerung 1 | Erinnerung 2 | Eskalation |
|----------|--------------|--------------|------------|
| Deadline für Meilenstein | 7 Tage vorher | 2 Tage vorher | 1 Tag nach Ablauf (an Lehrkraft) |
| Vertrag noch offen | 14 Tage nach Erstellung | 7 Tage vor Praktikum | 3 Tage vor Praktikum (an Lehrkraft) |
| Tägliche Anwesenheit | – | Abends, falls nicht bestätigt | Nach 2 Tagen ohne Eintrag (an Lehrkraft) |
| Krankmeldung ohne Attest | 3 Tage nach Meldung | 7 Tage nach Meldung | – |

**Konfigurationsoptionen:**
- Benachrichtigungen komplett deaktivieren (pro Schule)
- Benachrichtigungen pro Kategorie an/aus
- Timing anpassen (Tage vor Deadline)
- Eskalation an Lehrkraft an/aus
- Kanal wählen: Push / E-Mail / Beides

---

### 4. Datenaufbewahrung

**Gesetzliche Grundlage (Bayern):** § 40 BaySchO regelt die Aufbewahrungsfristen für Schülerunterlagen.

| Dokumententyp | Aufbewahrungsfrist | Beginn der Frist |
|---------------|-------------------|------------------|
| Schülerstammblatt, Schullaufbahnbogen | 30 Jahre | Ende des Schuljahres, in dem Schüler die Schule verlässt |
| Zeugnisse (Abschriften) | 30 Jahre | Ende des Schuljahres, in dem Schüler die Schule verlässt |
| Leistungsnachweise | 2 Jahre | Ende des Schuljahres, in dem sie erstellt wurden |
| Sonstige Unterlagen | Bis Zweckerfüllung | – |

**Empfehlung für die App:**

- **Praktikumsdokumentation** (Berichtsheft, Beurteilungen, Verträge): Als Teil der Schullaufbahn → **10 Jahre** nach Schulabschluss aufbewahren (konservative Auslegung)
- **Tägliche Einträge, Check-ins**: Nach Abschluss des Praktikums in aggregierter Form speichern, Details nach **2 Jahren** löschen
- **Kommunikationsdaten** (Nachrichten): Nach **1 Jahr** löschen
- **Account-Daten Betriebe**: Solange aktive Praktikanten, danach **2 Jahre** (für Wiederverwendung)

**Implementierung:**
- Automatisches Löschkonzept mit Vorwarnung
- Export-Funktion vor Löschung (PDF-Archiv)
- Admin kann Löschung für Einzelfälle aufschieben (mit Begründung)
- Audit-Log der Löschungen

**Hinweis:** Diese Fristen sollten mit dem Datenschutzbeauftragten der Schule abgestimmt werden, da die App als Auftragsverarbeiter agiert.

---

### 5. Mehrere Lehrkräfte pro Schüler

**Entscheidung:** Ja, ein Schüler kann von mehreren Lehrkräften betreut werden.

**Use Cases:**
- Haupt-Betreuung + Fachbewertung durch verschiedene Lehrkräfte
- Krankheitsvertretung / Wechsel während des Schuljahres
- Team-Betreuung bei großen Schülergruppen

**Umsetzung:**
- Ein Schüler hat eine **primäre Betreuungslehrkraft** (Pflicht)
- Optional: Weitere Lehrkräfte mit Rolle (z.B. "Fachbewertung", "Vertretung")
- Alle zugewiesenen Lehrkräfte sehen den Schüler in ihrem Dashboard
- Primäre Lehrkraft erhält Eskalations-Benachrichtigungen
- Wechsel der primären Lehrkraft ist dokumentiert (Audit-Log)

---

### Bewusst ausgeschlossen

- Leaderboards / kompetitive Gamification
- Schüler ↔ Lehrkraft Chat (Schulmessenger existiert)
- Betrieb Self-Registration (zu viel Aufwand für Betriebe)
- Komplexe Workflow-Engine (Konfiguration statt Programmierung)

---

## Zukünftige Erweiterungen

### Mittelfristig (v2)

- Praktikumsplatz-Börse (Pool öffentlich für Schüler)
- Interne Schüler-Bewertungen für Betriebe
- QR-Code Anwesenheitsbestätigung
- Erweiterte Statistiken und Reports
- Digitale Signatur für Volljährige

### Langfristig (v3+)

- WebUntis-Integration für Schüler-Sync / SSO
- FOS-Modul (§ 13 FOBOSO)
- Andere Bundesländer
- KI-gestützte Reflexion
- Route-Optimierung für Lehrkraft-Besuche

---

## Anhang: Checkliste MVP

Minimale Features für erste nutzbare Version:

**Authentifizierung & Nutzer**
- [ ] Login (Benutzername/Passwort)
- [ ] Rollen (Schüler, Lehrkraft, Betrieb, Admin)
- [ ] Schüler anlegen und Lehrkraft zuweisen
- [ ] Mehrere Lehrkräfte pro Schüler möglich

**Konfiguration**
- [ ] Praktikumsprogramm konfigurieren (Tage, Zeitraum)
- [ ] Meilensteine mit Deadlines

**Betriebe**
- [ ] Betrieb anlegen (automatisch in Kartei)
- [ ] Betrieb-Login mit minimalem Aufwand
- [ ] Kartenansicht der Betriebe

**Praktikums-Workflow**
- [ ] Praktikum einem Schüler zuweisen
- [ ] Vertrag generieren (PDF)
- [ ] Vertrag-Upload (unterschrieben)
- [ ] Tage-Tracking (Schüler bestätigt, Betrieb bestätigt)
- [ ] Fortschrittsanzeige
- [ ] Krankmeldung mit Attest-Upload
- [ ] Einfaches Berichtsheft (Texteinträge)

**Abschluss**
- [ ] Bewertungsbogen für Betrieb
- [ ] Praktikumszertifikat generieren (PDF)

**Dashboards**
- [ ] Lehrkraft-Dashboard mit Ampel-Status
- [ ] Schüler-Dashboard mit Aufgaben
- [ ] Betrieb-Dashboard (meine Praktikanten)

**Technisch**
- [ ] Push-Benachrichtigungen
- [ ] Responsive Design (Mobile + Desktop)
- [ ] DSGVO-konform (Hosting Deutschland)