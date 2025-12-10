# Entscheidungen: Admin-Flow

> Dokumentation aller Entscheidungen für Schuladmin und Superadmin.
> Stand: 2024-12-10

---

## Rollen-Hierarchie

### Drei Admin-Ebenen

| Rolle | Bereich | Typische Person |
|-------|---------|-----------------|
| **Superadmin** | Systemweit | Entwickler/Betreiber |
| **Schuladmin** | Eine Schule (volle Rechte) | Schulleitung, IT-Beauftragter |
| **Schuladmin (eingeschränkt)** | Eine Schule (begrenzte Rechte) | Sekretariat |

### Rechte-Abstufung

| Funktion | Superadmin | Schuladmin | Schuladmin (eingeschränkt) |
|----------|------------|------------|---------------------------|
| Schulen anlegen | ✅ | ❌ | ❌ |
| Profile verwalten | ✅ | ❌ | ❌ |
| System-Wartung | ✅ | ❌ | ❌ |
| In Schule einloggen (Support) | ✅ | ❌ | ❌ |
| Feature-Flags pro Schule | ✅ | ❌ | ❌ |
| Schulkonfiguration | ❌ | ✅ | ❌ |
| Betriebe sperren | ❌ | ✅ | ❌ |
| Admin-Rechte vergeben | ❌ | ✅ (nur Haupt-Admin) | ❌ |
| Löschvorgänge bestätigen | ❌ | ✅ | ❌ |
| Schüler/LK importieren | ❌ | ✅ | ✅ |
| Betreuung zuweisen | ❌ | ✅ | ✅ |
| Reports ziehen | ❌ | ✅ | ✅ |
| Duplikate zusammenführen | ❌ | ✅ | ❌ |
| Nachholungen genehmigen | ❌ | ✅ | ✅ |
| Schüler-Passwort zurücksetzen | ❌ | ✅ | ✅ |
| Schüler/LK manuell anlegen | ❌ | ✅ | ✅ |
| Externe Praktikumstage eintragen | ❌ | ✅ | ✅ |
| Bewertungs-Rollen konfigurieren | ❌ | ✅ | ❌ |
| Algorithmus-Parameter ändern | ❌ | ✅ | ❌ |

### Haupt-Admin

- Erster Admin einer Schule = Haupt-Admin
- Wird von Superadmin bei Schulerstellung angelegt
- Nur Haupt-Admin kann andere Admins degradieren
- Haupt-Admin kann weitere Admins ernennen

### Multi-Schul-Admin

- Ein Admin kann mehrere Schulen verwalten (z.B. Verbundschulen)
- Implementierung: Admin-Account hat Zugriff auf mehrere `school_ids`

---

## Authentifizierung

> Bereits in ENTSCHEIDUNGEN-DATENSCHUTZ.md dokumentiert:

| Rolle | Methode |
|-------|---------|
| Schuladmin | Passwort + 2FA Pflicht (TOTP oder SMS) |
| Superadmin | Passwort + 2FA + IP-Whitelist |

---

## Import-System

### Datenquellen

| Quelle | Status | Anmerkung |
|--------|--------|-----------|
| **Excel-Upload** | Pflicht (V1) | Muss vollwertig funktionieren |
| **MySQL-Direktanbindung** | Pilotschule | Schule hat zentrale DB |
| **WebUntis API** | Bayern-Standard | Für Skalierung wichtig |
| **Atlantis API** | Optional | Alternative prüfen |

**Wichtig:** Excel ist keine "Fallback-Lösung", sondern muss alle Funktionen unterstützen:
- Alle Felder die APIs liefern
- Inkl. Stundenplan-Daten für Betreuungs-Algorithmus
- Excel-Vorlage zum Download

### WebUntis-Integration

**Gelieferte Daten:**
- Schüler: Name, Klasse, Geburtsdatum
- Lehrkräfte: Name, Fächer, Stunden pro Klasse
- Klassen: Bezeichnung, Klassenleitung
- Stundenplan: Wer unterrichtet welche Klasse in welchem Fach
- Fach "Übungsunternehmen": Welche LK unterrichtet wo

**Nicht geliefert (muss ergänzt werden):**
- E-Mail-Adressen der Schüler (werden von Schülern selbst nachgetragen)

### Synchronisation

| Aspekt | Entscheidung |
|--------|--------------|
| Häufigkeit | Wöchentlich (automatisch) |
| Schuljahresanfang | Häufiger (viel Bewegung) |
| Neue Schüler | Automatisch anlegen |
| Abgegangene Schüler | Automatisch archivieren (wenn Praktikum abgeschlossen) |
| Schüler mit offenen Tagen | Flag setzen, NICHT archivieren |

### Manuelle Anlage

- Nach Import können Schüler/LK auch manuell angelegt werden
- Wichtig wenn Import nicht alle erfasst hat
- Alle Pflichtfelder müssen ausgefüllt werden

**Anwendungsfälle:**
- Nachzügler (Schüler kommt nach Import)
- Vertretungslehrkraft
- Quereinsteiger aus anderer Schule
- Schüler ohne WebUntis-Account (Sonderfälle)

### Schüler-Accounts

| Aspekt | Entscheidung |
|--------|--------------|
| Login | Username (nicht E-Mail) |
| Username | Identisch zu WebUntis-Benutzername |
| Passwort | Wird bei Erstanmeldung gesetzt |
| E-Mail | Schüler trägt selbst nach (für Passwort-Reset) |
| Account-Verteilung | Lehrkräfte verteilen Zugangsdaten an Schüler |
| Passwort-Reset | LK oder Admin kann Passwort zurücksetzen |

### E-Mail-Handling

- E-Mail ist **nicht Pflicht** zum Login
- System erinnert Schüler, E-Mail nachzutragen
- Lehrkraft sieht Flag "Keine E-Mail hinterlegt"
- Ohne E-Mail: Kein Passwort-Self-Service, LK muss zurücksetzen
- Schulen mit eigenen Schüler-E-Mails (@schule.de): Können beim Import mitgeliefert werden

### Import-Flow

```
SCHRITT 1: Quelle verbinden
────────────────────────────────────────────────────────────────
[WebUntis verbinden]  [Atlantis verbinden]  [Excel hochladen]

SCHRITT 2: Daten synchronisieren
────────────────────────────────────────────────────────────────
☑️ Schüler (127 gefunden)
☑️ Lehrkräfte (45 gefunden)
☑️ Klassen (4 gefunden)
☑️ Stundenpläne (für Betreuungszuweisung)

[Vorschau anzeigen]

SCHRITT 3: Validierung
────────────────────────────────────────────────────────────────
⚠️ 3 Schüler ohne Klasse
⚠️ 1 Lehrkraft ohne Stundenplan

[Probleme beheben]  [Trotzdem importieren]

SCHRITT 4: Bestätigung
────────────────────────────────────────────────────────────────
• 127 Schüler werden angelegt
• 45 Lehrkräfte werden angelegt
• Betreuungszuweisung: [Automatisch] / [Manuell später]

[Importieren]
```

---

## Betreuungszuweisung

### Algorithmus

**Grundprinzip:** Je mehr Unterrichtsstunden einer LK "wegfallen", wenn Schüler im Praktikum sind, desto mehr Betreuungskapazität hat sie.

**Prioritäten:**

| Prio | Regel | Beschreibung |
|------|-------|--------------|
| 1 | LK Übungsunternehmen | Bekommt die Schüler, die sie im ÜU unterrichtet |
| 2 | Klassenleitung | Bekommt verbleibende Schüler ihrer Klasse |
| 3 | Verteilungsschlüssel | Rest nach gewichteter Kapazität |

### Kapazitätsberechnung

```
Für jede Lehrkraft:

1. Wegfallende Stunden berechnen:
   wegfallende_h_kl10 = Summe aller Stunden in Klasse 10
   wegfallende_h_kl11 = Summe aller Stunden in Klasse 11

2. Gewichtung nach Praktikumstagen:
   Beispiel: 10 Tage Kl.10, 5 Tage Kl.11
   → gewicht_kl10 = 10/15 = 0.67
   → gewicht_kl11 = 5/15 = 0.33

3. Gewichtete Kapazität:
   kapazität = (wegfallende_h_kl10 × gewicht_kl10)
             + (wegfallende_h_kl11 × gewicht_kl11)

4. Anteil an Gesamtkapazität:
   anteil = kapazität_LK / summe_aller_kapazitäten

5. Zuzuweisende Schüler:
   schüler = anteil × anzahl_schüler_gesamt
```

### Sonderregeln

| Fall | Behandlung |
|------|------------|
| Teilzeit-LK | Gleich behandeln (wegfallende h zählen, nicht Deputat) |
| LK ohne Unterricht in Kl.10/11 | Kapazität = 0, keine automatische Zuweisung, manuell zuweisenbar |
| LK explizit ausgeschlossen | Admin markiert LK als "nicht betreuend" (z.B. Schulleitung) |
| Mehrere ÜU-LK pro Klasse | Proportional nach ÜU-Stunden aufteilen |
| Rundungsdifferenzen | LK mit höchster Kapazität auffüllen |

### Alternative Algorithmen (konfigurierbar)

| Modus | Beschreibung | Wann sinnvoll |
|-------|--------------|---------------|
| **Wegfallende Stunden** (Default) | Kapazität = Stunden die wegfallen wenn Schüler im Praktikum | Standard, fair |
| **Nur Kapazität** | Gleichverteilung nach verfügbarer Zeit | Wenn alle gleich viel betreuen sollen |
| **Rein manuell** | Kein Algorithmus, Admin weist alles zu | Kleine Schulen, Sonderfälle |

### Ausschluss von Betreuung

Manche LK sollen nie automatisch zugewiesen werden:
- Schulleitung
- Verwaltungspersonal mit Lehrauftrag
- LK in Elternzeit/Sabbatical

**Implementierung:** Feld `excluded_from_supervision: boolean` an Teacher-Entität
- Default: false
- Admin kann setzen/entfernen
- Diese LK erscheinen nicht im Zuweisungs-Algorithmus
- Können aber manuell zugewiesen werden (Ausnahmefälle)

### Manuelle Anpassung

- Admin kann jede Zuweisung manuell ändern
- Änderungen werden im Audit-Log dokumentiert
- Bei WebUntis-Sync: Manuelle Änderungen bleiben erhalten (außer explizit zurückgesetzt)

### Betreuungswechsel

| Szenario | Verhalten |
|----------|-----------|
| LK verlässt Schule | Schüler müssen neu zugewiesen werden (manuell oder automatisch) |
| Neue LK kommt | Ohne Betreuung angelegt, manuell zuweisen |
| Schüler wechselt Klasse | Betreuung bleibt (außer Admin ändert) |

### Historie

- Betreuungswechsel werden dokumentiert (wer → wer, wann, warum)
- Alle laufenden Vorgänge gehen automatisch an neue LK über
- Neue LK sieht vollständige Historie

### Algorithmus-Parameter (konfigurierbar)

| Parameter | Default | Beschreibung |
|-----------|---------|--------------|
| `prio_1_enabled` | true | ÜU-LK bekommt ihre Schüler zuerst |
| `prio_2_enabled` | true | KL bekommt Klassen-Schüler als zweites |
| `min_capacity_threshold` | 2h | Unter diesem Wert: Keine automatische Zuweisung |
| `manual_weight_override` | false | Admin kann Gewichtung überschreiben |
| `excluded_teachers` | [] | LK-IDs, die nicht betreuen (z.B. Schulleitung) |

---

## Praktikumszeiträume

### Anlage

- Admin legt Zeiträume in Kalenderansicht an
- Ferien/Feiertage sind aus API markiert (sichtbar)
- System warnt bei Überschneidung mit Ferien
- System **blockt** Speichern bei Ferien-Kollision

### Konfiguration pro Zeitraum

| Parameter | Beschreibung |
|-----------|--------------|
| Name | z.B. "Praktikum Februar 2026" |
| Start-Datum | Erster Tag |
| End-Datum | Letzter Tag |
| Klassen | Welche Klassen betroffen |
| Pflicht-Tage | Wie viele Tage in diesem Block |
| Min. Blockgröße | z.B. 5 Tage am Stück |

### Blockgröße-Verstoß

- System lehnt Zusage ab, wenn unter Mindest-Blockgröße
- Admin kann in Ausnahmefällen freigeben (mit Begründung)

**Wichtig:** Mindest-Blockgröße gilt NUR für reguläres Praktikum, NICHT für Nachholen.
- Nachholen findet außerhalb der Schulzeit statt
- Schüler organisiert es selbst
- Kann auch 1 Tag sein

### Unterbrochene Zeiträume

- Möglich (z.B. Woche 1, Ferien, Woche 2)
- Schüler kann zwei Praktika machen oder bei einem Betrieb bleiben
- Realität: Betriebe nehmen meist nur eine Woche wenn Pause dazwischen

---

## Ferien-Management

### Datenquelle

- Automatischer Abruf über Holiday-API (openholidaysapi.org)
- Bundesland: Bayern (konfigurierbar)
- Enthält: Schulferien + Feiertage

### Manuelle Ergänzung

- Admin kann schulinterne freie Tage hinzufügen (Studientage, Projekttage)
- Diese werden im Schüler-Kalender angezeigt
- Markierung: "Schulinterner Termin" vs. "Ferien (API)"

### Fehlerkorrektur

- Admin kann API-Einträge überschreiben (falls fehlerhaft)
- Komplettes manuelles Backup möglich

### Google Calendar Import

- V2-Feature: Import von schulinternen Terminen aus Google Calendar

---

## Schuljahreswechsel

### Zeitpunkt

- Erste Schulwoche oder letzte Ferienwoche (Sommerferien)
- Admin bestätigt Wechsel (kein automatischer Wechsel ohne Aktion)

### Ablauf

```
SCHULJAHRESWECHSEL VORBEREITEN
────────────────────────────────────────────────────────────────

Aktuelles Schuljahr: 2024/25
Neues Schuljahr: 2025/26

SCHÜLER-ÜBERNAHME:
────────────────────────────────────────────────────────────────
• Klasse 10 → Klasse 11 (Standardfall)
• Klasse 11 → archiviert (Abschluss)
• Wiederholer: Manuell markieren

⚠️ 5 Schüler mit offenen Praktikumstagen
   → Werden NICHT archiviert
   → Nachholen gehört zum neuen Schuljahr

BETREUUNGEN:
────────────────────────────────────────────────────────────────
• Alle Zuweisungen werden zurückgesetzt
• Neue Zuweisung nötig (WebUntis-Sync oder manuell)

PRAKTIKUMSZEITRÄUME:
────────────────────────────────────────────────────────────────
• Müssen neu angelegt werden

[Schuljahr 2025/26 aktivieren]
```

### Praktikumstage-Übertragung

- Absolvierte Tage werden ins neue Schuljahr übernommen
- Beispiel: Schüler hatte 10/15 Tage → neues Jahr startet mit 10/15

### Nachholen und Schuljahreswechsel

- Nachholungen werden beim **ursprünglichen Schuljahr** angerechnet (wo sie versäumt wurden)
- Beispiel: Max versäumt 2 Tage in 24/25, holt sie im Oktober 25 nach → zählen für 24/25
- Schüler mit offenen Tagen werden NICHT archiviert (Flag "Praktikum unvollständig")
- Für Reports/Statistiken: Tage werden korrekt dem Ursprungs-Schuljahr zugeordnet

---

## Schulkonfiguration

### Vollständige Parameter-Liste

| Parameter | Default | Beschreibung | Profil-Ebene? |
|-----------|---------|--------------|---------------|
| `required_days` | 20 | Gesamtzahl Pflicht-Tage | Ja |
| `min_businesses` | 2 | Minimum verschiedene Betriebe | Ja |
| `min_block_size` | 5 | Mindest-Tage am Stück | Ja |
| `approval_window_hours` | 36 | Einspruchsfenster | Ja |
| `approval_pause_weekends` | true | WE pausiert Einspruchsfrist | Ja |
| `business_account_trigger` | "at_school" | Wann Betrieb-Account erstellen | Ja |
| `repeat_year_count_days` | false | Sitzenbleiben: Tage anrechnen | Nein |
| `certificate_deadline_days` | 3 | Attest-Frist | Ja |
| `reminder_intervals_business` | [3,5,7] | Erinnerungen an Betrieb | Nein |
| `feedback_intervals_business` | [3,7,10] | Beurteilungs-Erinnerungen | Nein |
| `feedback_unlock_days_before` | 3 | Beurteilung freischalten | Nein |
| `availability_request_weeks_before` | 4 | Verfügbarkeitsanfrage | Nein |
| `grading_deadline` | (Datum) | Bewertungs-Deadline | Nein |
| `grading_role_default` | "both" | Bewertungs-Rollen Default | Nein |

### Profil vs. Schul-Einstellung

- **Profil-Ebene:** Parameter, die durch Schulart/Bundesland vorgegeben sind
- **Schul-Ebene:** Parameter, die jede Schule individuell anpassen kann
- Schule kann Profil-Parameter überschreiben (wird dokumentiert)

### Betrieb-Account-Erstellung

| Option | `business_account_trigger` | Wann Account erstellt |
|--------|---------------------------|----------------------|
| **Bei Schulleitung** (Default) | `"at_school"` | Sobald LK Vertrag an Schulleitung weitergibt |
| **Erst bei Fertig** | `"approved"` | Erst wenn Vertrag komplett bestätigt |

→ Im Admin unter: Einstellungen > Vertrag > Account-Erstellung

---

## Reports & Exporte

### Verfügbare Reports (V1)

| Report | Inhalt | Format |
|--------|--------|--------|
| Klassenübersicht | Alle Schüler mit Status, Betrieb, Note | Excel |
| Schulweite Übersicht | Zusagen-Quote, Anwesenheit, Bewertungen | Excel |
| Anwesenheitsübersicht | Tagesgenaue Anwesenheit aller Schüler | Excel |
| Bewertungsübersicht | Noten aller Schüler | Excel |
| Betriebe-Liste | Alle Betriebe inkl. Blacklist-Status | Excel |
| Export für Zeugnisse | Noten + Tage für Schulverwaltung | Excel |

### Export-Logging

- Alle Exporte werden im Audit-Log dokumentiert
- Enthält: Wer, wann, welcher Report

### V2: Lehrkraft-Exporte

- Lehrkräfte können eigene Klassen exportieren (nicht schulweit)

---

## Betriebe-Verwaltung

### Blacklist

- Nur Schuladmin kann Betriebe sperren
- Gesperrter Betrieb: Schüler sieht "Dieser Betrieb ist nicht verfügbar"
- Lehrkraft kann im Einzelfall freigeben (mit Begründungspflicht)
- Freigabe wird dokumentiert + Admin wird informiert

### Duplikate zusammenführen

- System erkennt potenzielle Duplikate (Fuzzy-Matching auf Name + PLZ)
- Admin sieht: "Mögliche Duplikate erkannt"
- Merge-Funktion: Wähle Haupt-Eintrag, andere werden zusammengeführt
- Alle Referenzen (Placements, Bewertungen) werden übernommen

### "Auffällig" markieren

- Lehrkraft kann Betrieb intern als "auffällig" markieren
- Admin sieht alle auffälligen Betriebe
- Von dort: Optionen "Zur Blacklist hinzufügen" oder "Markierung entfernen"

---

## Neuzugänge & Sonderfälle

### Neuzugang in Klasse 11

- Schüler kommt von anderer Schule
- Hat ggf. bereits Praktikumstage absolviert (extern)
- Admin kann "bereits absolvierte Tage" eintragen

**Eintragung externer Tage:**

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| Anzahl Tage | Ja | Wie viele Tage wurden absolviert |
| Herkunftsschule | Optional | Name der vorherigen Schule |
| Schuljahr | Ja | In welchem Schuljahr absolviert |
| Nachweis | Optional | Scan/PDF des Nachweises (z.B. Zertifikat) |
| Kommentar | Optional | Zusätzliche Infos |

- Extern eingetragene Tage werden im System als "extern absolviert" markiert
- Fließen in Gesamttagezählung ein
- Werden in Reports separat ausgewiesen

### Sitzenbleiben

- Schüler wiederholt Klasse 10 oder 11
- Schulindividuelle Entscheidung ob Vorjahres-Tage zählen
- Default: Nicht anrechnen
- Admin kann Einstellung ändern

**Einstellung:** `repeat_year_count_days` (Schulweit)
- `false` (Default): Schüler muss alle Tage neu absolvieren
- `true`: Vorjahres-Tage werden angerechnet

**Bei Anrechnung:**
- System zeigt: "X Tage aus Vorjahr angerechnet"
- LK sieht Hinweis: "Wiederholer mit angerechneten Tagen"

---

## Löschvorgänge

> Fristen bereits in ENTSCHEIDUNGEN-DATENSCHUTZ.md dokumentiert

### Admin-Workflow

1. System markiert Datensätze als "löschfällig"
2. Admin sieht Dashboard: "X Datensätze zur Löschung fällig"
3. Vor Löschung: Archiv-Export anbieten (ohne Atteste)
4. Admin bestätigt Löschung

### Schüler mit offenen Tagen

- Werden NICHT automatisch archiviert
- Flag: "Praktikum unvollständig"
- Admin muss manuell entscheiden

---

## Audit-Log

### Geloggte Aktionen

| Kategorie | Beispiele |
|-----------|-----------|
| Import | "127 Schüler aus WebUntis synchronisiert" |
| Betreuung | "Betreuung geändert: Max M. von Hr. Schmidt → Fr. Weber" |
| Konfiguration | "Einspruchsfenster von 36h auf 48h geändert" |
| Blacklist | "Betrieb XY GmbH gesperrt. Grund: ..." |
| Löschung | "5 Schüler-Datensätze gelöscht (Schulabgang > 1 Jahr)" |
| Export | "Klassenübersicht exportiert" |
| Admin-Rechte | "Fr. Müller zu Admin ernannt" |

### Aufbewahrung

| Log-Typ | Frist |
|---------|-------|
| Detaillierte Logs | 7 Tage |
| Aggregierte Logs | 1 Jahr |

---

## Admin-Dashboard (Cockpit)

### Design-Prinzip

- Fokus auf **Einstellungen + Reports/Analyse**
- NICHT auf Handlungsbedarf (das ist Lehrkraft-Dashboard)
- Seitliche Navigation (Tabs), ähnlich Anthropic-Settings
- Browser-fokussiert (Desktop-First)

### Struktur

```
┌────────────────┬────────────────────────────────────────────────────────┐
│                │                                                        │
│  📊 Analyse    │  [Inhalt des aktiven Tabs]                            │
│                │                                                        │
│  👥 Schüler    │                                                        │
│                │                                                        │
│  👩‍🏫 Lehrkräfte │                                                        │
│                │                                                        │
│  🔗 Betreuung  │                                                        │
│                │                                                        │
│  🏢 Betriebe   │                                                        │
│                │                                                        │
│  📥 Import     │                                                        │
│                │                                                        │
│  📅 Zeiträume  │                                                        │
│                │                                                        │
│  🗓️ Ferien     │                                                        │
│                │                                                        │
│  ⚙️ Einstellung│                                                        │
│                │                                                        │
│  👤 Admins     │                                                        │
│                │                                                        │
│  📜 Audit-Log  │                                                        │
│                │                                                        │
│  🗑️ Löschungen │                                                        │
│                │                                                        │
└────────────────┴────────────────────────────────────────────────────────┘
```

---

## Superadmin-Bereich

### Funktionen

| Funktion | Beschreibung |
|----------|--------------|
| Schulen verwalten | Anlegen, Status ändern, Support-Login |
| Profile verwalten | Schulart-Profile erstellen/bearbeiten |
| Feature-Flags | Features pro Schule aktivieren/deaktivieren |
| System-Status | API-Status (WebUntis, Ferien), Logs |
| Wartungsmodus | System in Wartung schalten |

### Neue Schule anlegen

**Pflichtfelder:**
1. Schulname
2. Adresse, Stadt, PLZ
3. Bundesland
4. Schulart (→ bestimmt Default-Profil)
5. E-Mail des ersten Admins

**Optional:**
- Schullogo (für Zertifikate)

**Ablauf:**
1. Superadmin legt Schule an
2. System erstellt Schule mit gewähltem Profil
3. Einladungs-Mail an ersten Admin
4. Admin setzt Passwort + 2FA
5. Admin kann Konfiguration anpassen

### Support-Login

- Superadmin kann sich in jede Schule "einloggen"
- Wird im Audit-Log der Schule dokumentiert
- Für Support-Zwecke

---

## Lernaufgaben

### Quelle

- **Profil:** Definiert Standard-Lernaufgaben für Schulart (z.B. Reflexion, Beobachtungsauftrag)
- **Admin:** Kann zusätzliche Aufgaben anlegen oder Profil-Aufgaben anpassen

### Admin kann

- Neue Lernaufgaben erstellen
- Bestehende Aufgaben bearbeiten (Name, Typ, Deadline, Punkte)
- Aufgaben deaktivieren
- Reihenfolge ändern

---

## Deadline-Verwaltung

Admin kontrolliert alle zeitkritischen Fristen zentral.

### Übersicht aller Deadlines

| Deadline | Beschreibung | Default | Wo eingestellt |
|----------|--------------|---------|----------------|
| `certificate_deadline_days` | Attest-Frist nach Krankmeldung | 3 Tage | Einstellungen > Fristen |
| `grading_deadline` | Bewertungs-Deadline für LK | (Datum) | Einstellungen > Fristen |
| `availability_request_weeks_before` | Verfügbarkeit anfragen | 4 Wochen | Einstellungen > Fristen |
| `feedback_unlock_days_before` | Beurteilung für Betrieb freischalten | 3 Tage | Einstellungen > Fristen |
| Lernaufgaben-Deadlines | Pro Aufgabe individuell | aus Profil | Einstellungen > Lernaufgaben |

### Deadline verlängern

**Global (alle Schüler):**
- Admin ändert Deadline in Einstellungen
- Gilt für alle zukünftigen Fälle

**Einzelner Schüler:**
- Admin öffnet Schüler-Detail
- "Deadline verlängern" für spezifische Aufgabe
- Mit Begründung (wird dokumentiert)

### Bewertungs-Deadline für Lehrkräfte

- Admin setzt Stichtag für Noteneingabe
- Erinnerungen an LK: 14 Tage, 7 Tage, 3 Tage vor Deadline
- Nach Deadline: Keine automatische Sperre (Kulanz möglich)
- Admin kann für einzelne LK verlängern

---

## Bewertungs-Rollen (Betreuend/Beurteilend)

> Detaillierte Beschreibung der Rollen siehe ENTSCHEIDUNGEN-LEHRKRAFT.md

### Admin-Konfiguration

Verschiedene Lehrkräfte können verschiedene Teile der Bewertung übernehmen:

| Rolle | Bewertet typischerweise |
|-------|------------------------|
| **Betreuende LK** | Bewerbungsprozess, Praktikum (Besuch, Anwesenheit) |
| **Beurteilende LK** | Nachbereitungsaufgaben, Gesamteindruck, Gesamtnote |

### Drei Ebenen der Zuweisung

| Ebene | Wer konfiguriert | Priorität |
|-------|------------------|-----------|
| **Schul-Default** | Admin | Niedrigste |
| **Pro Lehrkraft** | Admin | Mittel |
| **Selbständerung** | Lehrkraft selbst | Höchste |

### Admin-Einstellungen

**Schul-Default festlegen:**
```
Einstellungen > Bewertung > Rollen-Zuweisung

Standard-Zuweisung:
☑️ Klassenleitung = betreuend + beurteilend (Default)
○ Klassenleitung = nur betreuend, Fachlehrer = beurteilend
○ Alle LK = beides
```

**Pro Lehrkraft überschreiben:**
- Admin öffnet Lehrkraft-Detail
- "Bewertungs-Rolle" ändern
- Überschreibt Schul-Default für diese LK

**Lehrkraft-Selbständerung:**
- LK kann eigene Rolle in ihren Einstellungen anpassen
- Überschreibt Admin-Einstellungen
- Admin sieht Abweichungen in Lehrkraft-Übersicht

---

## Nachholungen genehmigen

### Wer prüft?

Sowohl Lehrkraft als auch Admin können Nachholungen genehmigen.

| Wer | Wann sinnvoll |
|-----|---------------|
| **Betreuende LK** | Kennt Schüler, kann Plausibilität einschätzen |
| **Admin/Sekretariat** | Zentralisierte Bearbeitung, Entlastung der LK |

**In der Praxis:**
- Schule entscheidet selbst, wer Nachholungen prüft
- Beide haben die Berechtigung
- Kein konfigurierter "Default" – wer zuerst handelt, bearbeitet

### Prüfung

1. Nachweis hochgeladen? (Scan/Foto des unterschriebenen Bogens)
2. Unterschrift des Betriebs vorhanden?
3. Zeitraum außerhalb der Schulzeit?
4. Tage plausibel?

Bei Zweifeln: Rücksprache mit Betrieb möglich

---

## Betreuungs-UI

### Ansicht

- **Tabelle:** Übersicht aller LK mit Kapazität, Zuweisungen, Status
- **Detail-Ansicht:** Bei Klick auf LK → Liste der zugewiesenen Schüler
- **Drag & Drop:** Optional für manuelle Umverteilung

### Funktionen

- Automatische Zuweisung starten
- Einzelne Schüler verschieben
- LK als "nicht betreuend" markieren
- Algorithmus-Modus wählen
- Gewichtung manuell überschreiben (Notfall)

### Algorithmus-Parameter (UI)

```
Einstellungen > Betreuung > Algorithmus

MODUS:
○ Wegfallende Stunden (empfohlen)
○ Gleichverteilung
○ Rein manuell

PRIORITÄTEN:
☑️ ÜU-LK bekommt eigene Schüler zuerst
☑️ Klassenleitung bekommt Klassen-Schüler

SCHWELLWERTE:
Mindest-Kapazität für Auto-Zuweisung: [2] Stunden
(LK unter diesem Wert werden nicht automatisch zugewiesen)

AUSGESCHLOSSENE LEHRKRÄFTE:
┌────────────────────────────────────────┐
│ Fr. Direktor (Schulleitung)      [x]  │
│ Hr. Stellv. (Stellvertretung)    [x]  │
│ + Lehrkraft hinzufügen                 │
└────────────────────────────────────────┘
```

---

## Noch offen

- [ ] WebUntis API: Genaue Authentifizierung und Endpoints recherchieren
- [ ] MySQL-Anbindung Pilotschule: Schema klären
- [ ] Excel-Vorlagen: Genaue Struktur (später bei Implementierung)
- [ ] UI/UX: Mockups für Admin-Dashboard

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version mit allen Admin-Entscheidungen |
| 2024-12-10 | ERGÄNZT: Neuzugang externe Tage – vollständige Erfassung |
| 2024-12-10 | ERGÄNZT: Sitzenbleiben – Einstellung mit UI |
| 2024-12-10 | ERGÄNZT: Deadline-Verwaltung – zentrale Übersicht |
| 2024-12-10 | ERGÄNZT: Bewertungs-Rollen – Admin-Konfiguration mit 3 Ebenen |
| 2024-12-10 | ERGÄNZT: Nachholungen – LK + Admin können genehmigen |
| 2024-12-10 | ERGÄNZT: Algorithmus-Parameter – UI-Mockup |
| 2024-12-10 | ERGÄNZT: Betrieb-Account-Erstellung – Konfiguration |
| 2024-12-10 | ERGÄNZT: Manuelle Anlage – Anwendungsfälle |
| 2024-12-10 | ERGÄNZT: Rechte-Tabelle erweitert |
