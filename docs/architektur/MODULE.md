# Module

> Optionale Fähigkeiten, die pro Schulart/Profil aktiviert werden können.
> Jedes Modul ist eine unabhängige Einheit mit klaren Schnittstellen.

---

## Modul-Schema

Jedes Modul wird dokumentiert mit:

| Feld | Beschreibung |
|------|--------------|
| **Verantwortung** | Was macht das Modul? |
| **Entitäten** | Eigene Datenstrukturen |
| **Input** | Was braucht es? (Daten, Events) |
| **Output** | Was produziert es? (Events) |
| **Parameter** | Konfigurierbare Werte |
| **Wenn deaktiviert** | Was passiert dann? |

---

## Modul-Übersicht

| Modul | Kurzbeschreibung | Abhängig von |
|-------|------------------|--------------|
| `application_tracking` | Bewerbungen dokumentieren | – |
| `commitment` | Zusagen verwalten | – |
| `approval_window` | Einspruchsfenster | commitment |
| `contract` | Formeller Vertrag | commitment |
| `attendance_tracking` | Täglicher Check-in | – |
| `sick_reporting` | Krankmeldung + Attest | attendance_tracking |
| `catch_up` | Versäumte Tage nachholen | attendance_tracking |
| `reflection_tasks` | Lernaufgaben | – |
| `business_rating` | Schüler bewertet Betrieb | – |
| `business_feedback` | Betrieb bewertet Schüler | – |
| `teacher_feedback` | Lehrkraft bewertet Betrieb intern | – |
| `grading` | Benotung des Praktikums | – |
| `certificate` | Zertifikat zum Download | – |
| `traffic_light` | Ampel-System | commitment |
| `print_service` | Druckservice für Verträge | contract |
| `visit_scheduling` | Praxisbesuche planen | contract |
| `inbox` | Aufgaben-Queue für Lehrkraft | – |
| `batch_operations` | Mehrere Schüler gleichzeitig bearbeiten | – |
| `notification_settings` | Benachrichtigungs-Einstellungen | – |
| `teacher_reminders` | Erinnerungen an Lehrkräfte | – |
| `business_blacklist` | Betrieb-Sperrliste | teacher_feedback |
| `onboarding` | Einführung beim ersten Login | – |
| `duplicate_detection` | Betrieb-Duplikaterkennung | – |
| `teacher_assignment` | Betreuungs-Zuweisung | – |
| `supervision_algorithm` | Betreuungs-Algorithmus | teacher_assignment |
| `archival` | Archivierung abgeschlossener Accounts | – |
| `external_days` | Externe Praktikumstage (Quereinsteiger) | – |
| `deadline_management` | Individuelle Fristverlängerung | – |
| `business_account` | Account-Erstellung für Betriebe | contract |
| `attendance_confirmation` | Wöchentliche Anwesenheitsbestätigung durch Betrieb | attendance_tracking |
| `praktikumsdatenbank` | Opt-in Praktikumsplatz-Datenbank | – |
| `email_templates` | E-Mail-Vorlagen für Betriebe | – |

---

## application_tracking

### Verantwortung
Bewerbungen bei Betrieben dokumentieren und tracken. Status-Verwaltung von "Offen" bis "Zusage/Absage".

### Entitäten

```
Application {
  id: UUID
  student_id: UUID → Student
  business_id: UUID → Business
  contact_type: enum              // email, phone, in_person, mail
  contact_date: date
  contact_details: string         // Telefonnummer bei Anruf, etc.
  proof_file_id: UUID             // Screenshot/Nachweis
  status: enum                    // open, interview, accepted,
                                  // rejected, no_response, withdrawn
  response_date: date
  notes: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Input
- `core.Student`
- `core.Business` (oder neu anlegen)

### Output (Events)
- `application.submitted` – Neue Bewerbung dokumentiert
- `application.status_changed` – Status geändert
- `application.accepted` – Zusage erhalten → triggert Commitment

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `reminder_after_days` | number | 14 | Nach X Tagen ohne Update: Erinnerung |
| `proof_required_for` | string[] | ["email", "mail"] | Für welche Kontaktarten ist Nachweis Pflicht? |
| `show_verifiability_warning` | boolean | true | Warnung bei schwer verifizierbaren Kontaktarten |

### Wenn deaktiviert
- Schüler gibt direkt Zusage ein (ohne Bewerbungs-Tracking)
- Weniger Transparenz für Lehrkraft
- Bewertungskomponente "Bewerbungsprozess" nicht möglich

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 1

---

## commitment

### Verantwortung
Zusagen von Betrieben erfassen und verwalten. Zeiträume und Ansprechpartner dokumentieren.
**Teilzusagen:** Unterstützt Szenarien, in denen ein Betrieb nur einen Teil der erforderlichen Tage anbietet.

### Entitäten

```
Commitment {
  id: UUID
  student_id: UUID → Student
  business_id: UUID → Business
  application_id: UUID → Application  // Optional
  internship_period_id: UUID → InternshipPeriod  // Welcher Praktikumszeitraum
  period_start: date
  period_end: date
  period_known: boolean               // false wenn noch nicht bekannt
  days_count: number
  contact_person: string
  contact_email: string
  contact_email_is_generic: boolean   // true bei info@, kontakt@, etc.
  status: enum                        // draft, pending_approval, approved,
                                      // rejected, withdrawn, converted
  withdrawn_reason: string            // Bei status=withdrawn
  withdrawn_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}

// Für Teilzusagen: Berechnung der Abdeckung
CommitmentCoverage {
  student_id: UUID → Student
  internship_period_id: UUID → InternshipPeriod
  required_days: number               // Gesamttage laut Praktikumszeitraum
  covered_days: number                // Summe aller approved Commitments
  missing_days: number                // required - covered
  is_complete: boolean                // missing_days == 0
  commitments: UUID[]                 // Liste aller Commitments für diesen Zeitraum

  // Für getrennte Blöcke (z.B. Februar + Juli)
  blocks: [{
    period_start: date
    period_end: date
    required_days: number
    covered_days: number
    is_complete: boolean
  }]
}
```

### Input
- `core.Student`
- `core.Business`
- `Event: application.accepted` (wenn application_tracking aktiv)

### Output (Events)
- `commitment.submitted` – Neue Zusage eingetragen
- `commitment.approved` – Freigegeben (nach Einspruchsfenster oder direkt)
- `commitment.rejected` – Abgelehnt durch Lehrkraft
- `commitment.withdrawn` – Zurückgezogen durch Schüler
- `commitment.coverage_changed` – Abdeckung hat sich geändert (für Dashboard-Updates)
- `commitment.coverage_complete` – Alle erforderlichen Tage sind abgedeckt
- `commitment.coverage_incomplete` – Abdeckung unvollständig (löst Warnung aus)

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `warn_on_generic_email` | boolean | true | Warnung bei info@, kontakt@, etc. |
| `period_required` | boolean | false | Muss Zeitraum sofort angegeben werden? |
| `allow_withdraw` | boolean | true | Kann Schüler Zusage zurückziehen? |
| `prevent_overlapping` | boolean | true | Verhindert zwei Zusagen für gleichen Zeitraum |
| `min_block_days` | number | 5 | Mindest-Blockgröße bei Teilzusagen (0 = keine Mindestgröße) |
| `allow_partial_commitments` | boolean | true | Erlaubt Zusagen für weniger als alle erforderlichen Tage |

### Regeln
- **Überlappungs-Verhinderung:** Wenn `prevent_overlapping: true`, kann kein Commitment für einen bereits belegten Zeitraum erstellt werden.
- **Zurückziehen:** Nur möglich solange `status` nicht `converted` (zu Placement geworden).

### Teilzusage-Logik

**Szenario:** Schüler bekommt Zusage für nur einen Teil der erforderlichen Tage.

**Ablauf:**
1. Schüler trägt Zusage ein (z.B. 5 von 10 Tagen)
2. System prüft Mindest-Blockgröße (`min_block_days`)
3. System berechnet `CommitmentCoverage`:
   - Wie viele Tage sind abgedeckt?
   - Welche Tage/Zeiträume fehlen noch?
4. Dashboard zeigt Status:
   - Bei vollständiger Abdeckung: "Alle Tage abgedeckt ✓"
   - Bei Teilabdeckung: "X von Y Tagen gesichert – noch Z Tage für [Zeitraum] nötig"

**Dringlichkeitsregeln:**
- **Zusammenhängende Blöcke** (z.B. 2 Wochen am Stück):
  - Hohe Dringlichkeit: Alle Zusagen müssen vor Start des ersten Blocks vorliegen
  - System zeigt deutliche Warnung, wenn Praktikum 1 beginnt ohne gesicherte Tage für den Rest
- **Getrennte Blöcke** (z.B. Februar + Juli):
  - Normale Priorität: Zweiter Block kann später gesichert werden
  - System zeigt Info, aber keine dringende Warnung

**Hinweis:** System verhindert NICHT den Start eines Praktikums bei fehlenden Folge-Tagen. Dies ist Entscheidung der Lehrkraft. Fehlende Tage können in Phase 5 (Nachholen) aufgeholt werden.

**Bewertung bei mehreren Betrieben:**
Wenn Schüler bei verschiedenen Betrieben Teilzusagen hat, bewertet jeder Betrieb "seine" Tage. Die Gesamtnote ergibt sich als gewichteter Durchschnitt (nach Tagen).

### Wenn deaktiviert
- Nicht sinnvoll – Kern-Funktionalität
- Sollte immer aktiv sein

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 1b

---

## approval_window

### Verantwortung
Einspruchsfenster für Lehrkraft nach Zusage. Automatische Freigabe nach Ablauf.

### Entitäten

```
(Erweitert Commitment)

Commitment += {
  approval_deadline: timestamp
  approved_at: timestamp
  approved_by: UUID → Teacher         // null = automatisch
  approved_automatically: boolean
  rejection_reason: string
}
```

### Input
- `Event: commitment.submitted`

### Output (Events)
- `commitment.approved` – Nach Ablauf oder manueller Freigabe
- `commitment.rejected` – Bei Einspruch durch Lehrkraft

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `wait_hours` | number | 36 | Stunden bis automatische Freigabe |
| `pause_on_weekends` | boolean | true | Wochenenden zählen nicht (konfigurierbar durch LK) |
| `pause_on_holidays` | boolean | false | Ferien zählen NICHT (Schüler können in Ferien Zusagen bekommen) |
| `rejection_reasons` | string[] | [...] | Vordefinierte Einspruch-Gründe (Dropdown) |
| `require_rejection_comment` | boolean | false | Freitext-Kommentar bei Einspruch Pflicht? |

### Einspruch-Workflow

1. Schüler meldet Zusage
2. Lehrkraft erhält Benachrichtigung mit Details (Schülername, Betrieb, Zeitraum)
3. 36h Zeit für Einspruch (Wochenenden pausieren optional)
4. Kein Einspruch → automatisch freigegeben
5. Einspruch → Schüler wird sofort informiert mit Grund, Vertragsprozess gesperrt

**Einspruch-Gründe (Default):**
- Betrieb ungeeignet
- Zu weit entfernt
- Zeitraum passt nicht
- Sonstiges (Freitext)

### Wenn deaktiviert
- Zusage wird sofort freigegeben (`commitment.approved` direkt nach `commitment.submitted`)
- Lehrkraft hat kein Einspruchsrecht
- Schnellerer Prozess, weniger Kontrolle

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 1b, `ENTSCHEIDUNGEN-LEHRKRAFT.md` Genehmigung/Einspruch

---

## contract

### Verantwortung
Formeller Vertrag mit Unterschriften-Workflow. PDF-Generierung und Abgabe-Tracking.

### Entitäten

```
Contract {
  id: UUID
  commitment_id: UUID → Commitment
  student_id: UUID → Student
  business_id: UUID → Business
  pdf_template_id: UUID               // Vertragsvorlage
  generated_pdf_file_id: UUID         // Generiertes PDF
  status: enum                        // draft, pending_signatures,
                                      // submitted, at_teacher, at_school,
                                      // approved, rejected
  print_requested: boolean
  print_requested_at: timestamp
  print_completed_at: timestamp
  submitted_at: timestamp
  submitted_type: enum                // physical, digital
  signed_pdf_file_id: UUID            // Hochgeladenes unterschriebenes PDF

  // Lehrkraft-Prüfung
  reviewed_by: UUID → Teacher
  reviewed_at: timestamp

  // Status "Bei Schulleitung" (optionaler Vermerk)
  at_school_since: timestamp          // Wann an Schulleitung übergeben
  at_school_reminder_sent: boolean    // Erinnerung bereits gesendet?

  approval_status: enum               // pending, approved, rejected
  rejection_reason: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Status-Workflow

| Status | Beschreibung | Nächste Schritte |
|--------|--------------|------------------|
| `draft` | Vertrag generiert | Schüler sammelt Unterschriften |
| `pending_signatures` | Unterschriften werden gesammelt | Abgabe bei Lehrkraft |
| `at_teacher` | Bei Lehrkraft (physisch oder digital) | Prüfung durch LK |
| `at_school` | Bei Schulleitung/Sekretariat (nur Vermerk!) | LK fragt nach |
| `approved` | Vertrag bestätigt | → Placement wird erstellt |
| `rejected` | Abgelehnt (mit Grund) | Schüler muss korrigieren |

### Status "Bei Schulleitung" – Details

- **Nur ein Vermerk:** Kein echter Workflow-Schritt, Schulleitung ist außerhalb des Systems
- **Erinnerung nach X Tagen:** "Vertrag seit X Tagen bei Schulleitung – bitte Status aktualisieren"
- Lehrkraft muss manuell bei Schulleitung nachfragen wenn es dauert
- **Blockiert den Prozess NICHT** (kann parallel Betrieb-Account erstellen)

### Input
- `Event: commitment.approved`
- `core.Student` (Vertragsdaten)
- `core.Business` (Vertragsdaten)

### Output (Events)
- `contract.created` – Vertrag generiert
- `contract.print_requested` – Druckservice beantragt
- `contract.print_completed` – Druck erledigt
- `contract.submitted` – Vertrag abgegeben
- `contract.at_school` – An Schulleitung übergeben (Vermerk)
- `contract.approved` – Vertrag bestätigt → triggert Placement-Erstellung
- `contract.rejected` – Vertrag abgelehnt

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `required_signatures` | string[] | ["parent", "business", "school"] | Benötigte Unterschriften |
| `school_signs_last` | boolean | true | Schule unterschreibt zuletzt |
| `allow_digital_submission` | boolean | true | Scan/Foto-Upload erlaubt (In-App Scan mit Kantenerkennung) |
| `at_school_reminder_days` | number | 7 | Nach X Tagen bei Schulleitung: Erinnerung an LK |
| `business_account_trigger` | enum | "at_school" | Wann Betrieb-Account erstellen: "at_school" oder "approved" |
| `rejection_reasons` | string[] | [...] | Vordefinierte Ablehnungsgründe |

### Betrieb-Account: Wann erstellen?

| Option | Trigger | Wann sinnvoll |
|--------|---------|---------------|
| `at_school` (Default) | Bei Status "Bei Schulleitung" | Schulleitung-Unterschrift ist nur Formalie |
| `approved` | Erst bei Status "Fertig" | Schulleitung muss rechtlich erst genehmigen |

→ **Im Admin konfigurierbar** pro Schule

### Prüfungs-Checkliste (Lehrkraft)

- Unterschrift Schüler vorhanden?
- Unterschrift Eltern vorhanden?
- Unterschrift Betrieb vorhanden?
- Daten korrekt?

### Wenn deaktiviert
- Kein formeller Vertrag nötig
- `commitment.approved` wird direkt zu Placement konvertiert
- Betrieb bekommt Account ohne Vertrag
- Weniger Bürokratie, aber weniger rechtliche Absicherung

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 2, `ENTSCHEIDUNGEN-LEHRKRAFT.md` Vertragsprozess

---

## print_service

### Verantwortung
Druckservice für Schüler ohne eigenen Drucker.

### Entitäten
(Nutzt `Contract.print_requested`, `Contract.print_completed_at`)

### Input
- `Event: contract.print_requested`

### Output (Events)
- `contract.print_completed` – Druck erledigt, zur Abholung bereit

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `enabled` | boolean | true | Druckservice anbieten? |
| `pickup_location` | string | "Sekretariat" | Wo abholen? |
| `notify_on_ready` | boolean | true | Schüler benachrichtigen |

### Wenn deaktiviert
- Kein "Druck beantragen" Button
- Schüler muss selbst drucken

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 2 (Druck beantragen)

---

## attendance_tracking

### Verantwortung
Tägliche Anwesenheitsmeldung durch Schüler. Wöchentliche Bestätigung durch Betrieb.

### Entitäten
(Nutzt `core.Attendance`)

### Input
- `core.Placement` (aktives Praktikum)
- `core.Period`

### Output (Events)
- `attendance.student_reported` – Schüler hat gemeldet
- `attendance.business_confirmed` – Betrieb hat bestätigt
- `attendance.business_disputed` – Betrieb widerspricht
- `attendance.missed_checkin` – Kein Check-in bis Erinnerungszeit

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `checkin_reminder_time` | string | "18:00" | Wann Erinnerung wenn kein Check-in |
| `business_confirmation_day` | string | "friday" | Wann Betrieb zur Bestätigung aufgefordert |
| `business_confirmation_deadline_days` | number | 7 | Nach X Tagen gilt als stillschweigend bestätigt |

### Wenn deaktiviert
- Kein tägliches Tracking
- Nur Gesamt-Bestätigung am Ende
- Weniger Aufwand, weniger Kontrolle

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 3

---

## sick_reporting

### Verantwortung
Krankmeldungen erfassen und Atteste verwalten. DSGVO-konforme Löschung nach Bestätigung.

### Entitäten

```
SickReport {
  id: UUID
  student_id: UUID → Student
  placement_id: UUID → Placement
  sick_from: date
  sick_until: date
  reported_at: timestamp
  certificate_file_id: UUID           // Attest (wird gelöscht!)
  certificate_uploaded_at: timestamp
  certificate_deadline: date
  certificate_status: enum            // pending, uploaded, confirmed,
                                      // rejected, deadline_missed
  certificate_confirmed_by: UUID → Teacher
  certificate_confirmed_at: timestamp
  certificate_rejection_reason: string
  created_at: timestamp
}
```

### Input
- `core.Attendance`
- `core.Placement`

### Output (Events)
- `sick.reported` – Krankmeldung eingereicht
- `sick.certificate_uploaded` – Attest hochgeladen
- `sick.certificate_confirmed` – Attest bestätigt → Datei wird gelöscht
- `sick.certificate_rejected` – Attest abgelehnt
- `sick.certificate_deadline_missed` – Frist verpasst

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `certificate_deadline_days` | number | 3 | Tage bis Attest hochgeladen sein muss |
| `auto_delete_after_confirmation` | boolean | true | Attest-Datei nach Bestätigung löschen |
| `mark_as_catch_up` | boolean | true | Kranktage müssen nachgeholt werden |
| `notify_business` | boolean | true | Betrieb über Krankmeldung informieren |
| `notify_teacher` | boolean | true | Lehrkraft über Krankmeldung informieren |

### Wenn deaktiviert
- Krankmeldung nur als Status in Attendance (`student_status: sick`)
- Kein Attest-Upload
- Kein automatisches Nachhol-Tracking

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 3 (Krank melden)

---

## catch_up

### Verantwortung
Versäumte Tage nachholen. Nachweisbogen und Bestätigung durch Lehrkraft oder Admin.

### Entitäten

```
CatchUpRecord {
  id: UUID
  student_id: UUID → Student
  original_attendance_id: UUID → Attendance  // Welcher Tag versäumt
  catch_up_date: date
  business_id: UUID → Business               // Kann anderer sein
  business_name_manual: string               // Falls nicht im System
  proof_file_id: UUID                        // Nachweisbogen
  status: enum                               // pending, submitted,
                                             // approved, rejected
  submitted_at: timestamp
  reviewed_by: UUID → User                   // Teacher oder Admin
  reviewed_at: timestamp
  rejection_reason: string
  created_at: timestamp
}
```

### Input
- `core.Attendance` (mit `requires_catch_up: true`)
- `Event: sick.certificate_confirmed`

### Output (Events)
- `catch_up.proof_submitted` – Nachweis hochgeladen
- `catch_up.approved` – Bestätigt → Tag gutgeschrieben
- `catch_up.rejected` – Abgelehnt

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `allow_different_business` | boolean | true | Bei anderem Betrieb nachholen |
| `proof_template_enabled` | boolean | true | Nachweisbogen-PDF zum Download |
| `rejection_reasons` | string[] | [...] | Vordefinierte Ablehnungsgründe |

### Zuständigkeit: LK + Admin

Sowohl Lehrkraft als auch Admin haben Berechtigung zur Genehmigung.

| Wer | Wann sinnvoll |
|-----|---------------|
| **Betreuende LK** | Kennt Schüler, kann Plausibilität einschätzen |
| **Admin/Sekretariat** | Zentralisierte Bearbeitung, Entlastung der LK |

**In der Praxis:**
- Schule entscheidet selbst, wer Nachholungen prüft
- Beide haben die Berechtigung im System
- Kein konfigurierter "Default" – wer zuerst handelt, bearbeitet
- Flexible Handhabung je nach Schulorganisation

### Prüfungs-Checkliste

- Unterschrift lesbar/vorhanden?
- Betrieb plausibel?
- Datum im erlaubten Zeitraum?

**Hinweis:** Bei Zweifeln kann beim Betrieb nachgefragt werden.

### Wenn deaktiviert
- Versäumte Tage werden nicht getrackt
- Keine Nachhol-Pflicht

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 5, `ENTSCHEIDUNGEN-LEHRKRAFT.md` Phase 5: Nachholen

---

## reflection_tasks

### Verantwortung
Lernaufgaben und Reflexionsbögen nach dem Praktikum. Deadlines und Abgabe-Tracking.

### Entitäten

```
TaskDefinition {
  id: UUID
  school_id: UUID → School
  name: string                        // "Reflexionsbogen", "Erwartungen"
  description: string
  type: enum                          // form, file_upload, text
  form_schema: JSON                   // Bei type=form: Formular-Definition
  deadline_type: enum                 // relative, fixed
  deadline_days_after_end: number     // Bei relative
  deadline_date: date                 // Bei fixed
  is_required: boolean
  points_max: number                  // Für Bewertung (optional)
  sort_order: number
  created_at: timestamp
}

TaskSubmission {
  id: UUID
  task_definition_id: UUID → TaskDefinition
  student_id: UUID → Student
  placement_id: UUID → Placement
  submitted_at: timestamp
  content: JSON                       // Formular-Antworten oder Datei-Referenz
  file_id: UUID                       // Bei file_upload
  status: enum                        // pending, submitted, graded, missed
  grade_points: number                // Erreichte Punkte
  grade_comment: string               // Feedback
  graded_by: UUID → Teacher
  graded_at: timestamp
  created_at: timestamp
}
```

### Input
- `Event: placement.completed`
- `core.Placement`

### Output (Events)
- `task.assigned` – Aufgabe zugewiesen
- `task.submitted` – Abgegeben
- `task.graded` – Bewertet
- `task.deadline_missed` – Frist verpasst

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `tasks` | TaskDefinition[] | [] | Welche Aufgaben? Pro Schule konfigurierbar |
| `reminder_days_before_deadline` | number | 3 | Erinnerung X Tage vor Deadline |
| `allow_late_submission` | boolean | false | Verspätete Abgabe erlaubt? |

### Wenn deaktiviert
- Keine Lernaufgaben nach Praktikum
- Praktikum endet mit letztem Tag

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 4

---

## business_rating

### Verantwortung
Anonyme Bewertung des Betriebs durch Schüler. Hilft zukünftigen Schülern bei der Wahl.

### Entitäten

```
BusinessRating {
  id: UUID
  business_id: UUID → Business
  placement_id: UUID → Placement      // Für Validierung
  student_id: UUID → Student          // Nicht angezeigt!
  would_recommend: enum               // yes, rather_yes, rather_no, no
  supervision_rating: number          // 1-5
  learning_rating: number             // 1-5 (optional)
  atmosphere_rating: number           // 1-5 (optional)
  comment: string
  is_anonymous: boolean               // Default: true
  created_at: timestamp
}
```

### Input
- `Event: placement.completed`
- `core.Placement`

### Output (Events)
- `business_rating.submitted` – Bewertung abgegeben

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `is_anonymous` | boolean | true | Bewertung anonym |
| `min_ratings_to_show` | number | 3 | Ab wie vielen Bewertungen wird Durchschnitt angezeigt |
| `rating_categories` | string[] | ["supervision"] | Welche Kategorien? |

### Wenn deaktiviert
- Keine Schüler-Bewertungen von Betrieben
- Nur internes Lehrkraft-Feedback

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 4

---

## business_feedback

### Verantwortung
Betrieb bewertet Schüler. Fließt in Gesamtbewertung ein. Korrektur-Workflow bei nachträglichen Änderungen.

### Entitäten

```
BusinessFeedback {
  id: UUID
  placement_id: UUID → Placement
  business_id: UUID → Business
  student_id: UUID → Student

  // Bewertungskriterien (jeweils 1-5)
  punctuality: number
  reliability: number
  independence: number
  teamwork: number
  engagement: number
  friendliness: number

  overall_rating: number              // Gesamtnote 1-5
  comment: string
  would_hire: enum                    // yes, maybe, no

  // Workflow-Status
  status: enum                        // requested, submitted, correction_requested,
                                      // correction_approved, correction_denied
  requested_at: timestamp
  reminder_sent_at: timestamp
  submitted_at: timestamp

  // Korrektur-Workflow
  correction_requested_at: timestamp
  correction_requested_by: UUID → BusinessUser
  correction_approved_at: timestamp
  correction_approved_by: UUID → Teacher
  correction_denied_at: timestamp
  correction_denied_by: UUID → Teacher

  created_at: timestamp
  updated_at: timestamp
}
```

### Status-Workflow

| Status | Beschreibung | Nächste Schritte |
|--------|--------------|------------------|
| `requested` | Anfrage an Betrieb gesendet | Betrieb füllt aus |
| `submitted` | Betrieb hat abgesendet | → Sichtbar in Bewertungs-Akte |
| `correction_requested` | Betrieb möchte korrigieren | Lehrkraft entscheidet |
| `correction_approved` | Korrektur freigegeben | Betrieb kann bearbeiten |
| `correction_denied` | Korrektur abgelehnt | Status bleibt "submitted" |

### Korrektur-Workflow

1. Betrieb fragt Korrektur an (nach Absenden)
2. Lehrkraft erhält Benachrichtigung + Inbox-Item
3. Lehrkraft entscheidet:
   - **Freigeben** → Betrieb erhält E-Mail mit Bearbeiten-Link
   - **Ablehnen** → Betrieb erhält Info "Korrektur nicht möglich"
4. Nach erneuter Bearbeitung: Status → `submitted`

**Keine automatische Freigabe:** Verhindert Missbrauch (z.B. schlechte Bewertung "verschwinden lassen")

### Input
- `Event: placement.ending_soon` oder `placement.completed`
- `core.Placement`

### Output (Events)
- `business_feedback.requested` – Anfrage gesendet
- `business_feedback.submitted` – Feedback eingereicht
- `business_feedback.reminder_sent` – Erinnerung gesendet
- `business_feedback.correction_requested` – Betrieb möchte korrigieren
- `business_feedback.correction_approved` – Lehrkraft gibt frei
- `business_feedback.correction_denied` – Lehrkraft lehnt ab

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `request_days_before_end` | number | 3 | X Tage vor Ende anfragen |
| `reminder_after_days` | number | 5 | Erinnerung nach X Tagen |
| `auto_close_after_days` | number | 14 | Nach X Tagen ohne Feedback abschließen |
| `rating_criteria` | string[] | [...] | Welche Kriterien bewerten? |
| `allow_correction` | boolean | true | Korrektur-Anfrage ermöglichen? |
| `auto_save` | boolean | true | Bewertung automatisch zwischenspeichern? |
| `auto_save_interval_seconds` | number | 30 | Auto-Save Intervall |

### Auto-Save

Bewertungen werden automatisch zwischengespeichert:

- Bei Unterbrechung (Browser schließen, Timeout): Weiter wo man war
- Status `draft` während Bearbeitung, erst `submitted` nach Absenden
- Betrieb sieht "Entwurf gespeichert" Hinweis
- Kein Datenverlust bei technischen Problemen

### Sammel-Ansicht (mehrere Praktikanten)

Wenn ein Betrieb mehrere Praktikanten bewerten muss:

```
BEURTEILUNGEN – 2 ausstehend

┌─────────────────────────────────────────────────────┐
│ Max M.                              [Bewerten]      │
│ Praktikum: 03.-14.02.2025                          │
├─────────────────────────────────────────────────────┤
│ Anna S.                             [Bewerten]      │
│ Praktikum: 03.-14.02.2025                          │
└─────────────────────────────────────────────────────┘
```

Nach Bewertung: "Speichern & Nächster" Button

**E-Mail:** Eine E-Mail: "Bitte bewerten Sie Ihre 2 Praktikanten"

### Wenn deaktiviert
- Kein Betriebs-Feedback
- Bewertung nur durch Lehrkraft

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` (Bewertungen, Reaktiver Flow 6), `FLOW-BETRIEB.md`, `ENTSCHEIDUNGEN-LEHRKRAFT.md` Beurteilung-Korrektur

---

## teacher_feedback

### Verantwortung
Internes Feedback der Lehrkraft zum Betrieb. Nicht sichtbar für Schüler oder Betrieb.

### Entitäten

```
TeacherFeedback {
  id: UUID
  business_id: UUID → Business
  placement_id: UUID → Placement      // Optional
  teacher_id: UUID → Teacher
  overall_rating: number              // 1-5
  comment: string                     // Interne Notizen
  is_flagged: boolean                 // Als auffällig markieren
  flag_reason: string
  created_at: timestamp
}
```

### Input
- Nach Praxisbesuch oder Bewertungsabschluss

### Output (Events)
- `teacher_feedback.submitted`
- `teacher_feedback.flagged` – Betrieb als auffällig markiert

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `prompt_after_visit` | boolean | true | Nach Praxisbesuch zur Bewertung auffordern |
| `flag_threshold` | number | 2 | Ab X Flags: Warnung bei neuen Bewerbungen |

### Wenn deaktiviert
- Kein internes Betrieb-Feedback
- Keine "Auffällig"-Markierung

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` (Internes Betrieb-Feedback)

---

## grading

### Verantwortung
Benotung des Praktikums. Zusammenführung verschiedener Bewertungskomponenten. Zentrale "Bewertungs-Akte" pro Schüler.

### Entitäten

```
Grade {
  id: UUID
  student_id: UUID → Student
  placement_id: UUID → Placement      // Oder period_id für Gesamtnote
  period_id: UUID → Period

  // Komponenten (je nach Konfiguration)
  application_process_grade: number
  application_process_graded_by: UUID → Teacher
  tasks_grade: number
  tasks_graded_by: UUID → Teacher
  business_feedback_grade: number     // Von Betrieb
  teacher_impression_grade: number
  teacher_impression_graded_by: UUID → Teacher
  teacher_impression_notes: string

  // Berechnung
  calculated_average: number
  final_grade: number                 // Kann von calculated abweichen
  grade_override_reason: string       // Wenn manuell geändert

  // Status
  status: enum                        // draft, pending_business,
                                      // pending_review, final
  without_business_feedback: boolean  // Fallback aktiviert?
  without_business_reason: string     // Warum ohne Betrieb?

  finalized_at: timestamp
  finalized_by: UUID → Teacher
  created_at: timestamp
  updated_at: timestamp
}

TeacherGradingRole {
  id: UUID
  teacher_id: UUID → Teacher
  school_id: UUID → School
  role: enum                          // supervising, assessing, both
  source: enum                        // school_default, admin_override, self
  created_at: timestamp
}
```

### Bewertungs-Akte (Abschnitte)

| Abschnitt | Bewertet durch | Beschreibung |
|-----------|----------------|--------------|
| Bewerbungsprozess | Lehrkraft (supervising) | Qualität der Bewerbungen |
| Lernaufgaben | Lehrkraft (assessing) | Reflexionsbögen, Aufgaben |
| Betriebsbeurteilung | Betrieb | Nur lesen für Lehrkraft |
| Gesamteindruck | Lehrkraft (assessing) | Persönliche Einschätzung |
| Endnote | Lehrkraft (assessing) | Finale Note |

### Mehrere beurteilende Lehrkräfte

| Rolle | Bewertet typischerweise |
|-------|-------------------------|
| `supervising` (betreuend) | Bewerbungsprozess, Praktikum (Besuch, Anwesenheit) |
| `assessing` (beurteilend) | Nachbereitungsaufgaben, Gesamteindruck, Gesamtnote |
| `both` | Alles |

### Rollen-Zuweisung (3 Ebenen)

| Ebene | Wer konfiguriert | Priorität |
|-------|------------------|-----------|
| **Schul-Default** | Admin | Niedrigste (3) |
| **Pro Lehrkraft** | Admin | Mittel (2) |
| **Selbständerung** | Lehrkraft selbst | Höchste (1) |

**Schul-Default-Optionen:**
- Klassenleitung = betreuend + beurteilend (Standard)
- Klassenleitung = nur betreuend, Fachlehrer = beurteilend
- Alle LK = beides (flexibel)

**Admin-Konfiguration:** `Einstellungen > Bewertung > Rollen-Zuweisung`

**Lehrkraft-Selbständerung:**
- LK kann eigene Rolle in ihren Einstellungen anpassen
- Überschreibt Admin-Einstellungen für diese LK
- Admin sieht Abweichungen in Lehrkraft-Übersicht

### Input
- `Event: task.graded`
- `Event: business_feedback.submitted`
- `core.Placement`

### Output (Events)
- `grade.section_completed` – Abschnitt ausgefüllt
- `grade.finalized` – Endnote vergeben

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `enabled` | boolean | true | Benotung aktiv? |
| `components` | object | {...} | Welche Komponenten, welche Gewichtung |
| `scale` | string | "1-6" | Notenskala ("1-6", "1-5", "points") |
| `allow_override` | boolean | true | Manuelle Änderung erlaubt? |
| `require_business_feedback` | boolean | false | Betriebs-Feedback Pflicht? |
| `allow_without_business` | boolean | true | "Ohne Betriebsfeedback benoten" erlauben? |
| `deadline_days_after_end` | number | 30 | Bewertungs-Deadline nach Praktikumsende |
| `deadline_warning_days` | number | 5 | Warnung X Tage vor Deadline |
| `multiple_placements_handling` | enum | "weighted" | "weighted" (nach Tagen) oder "separate" |
| `grading_role_default` | enum | "both" | Standard-Rolle: "supervising", "assessing", "both" |

### Beispiel-Komponenten (WS Bayern)

```yaml
components:
  application_process:
    weight: 0.2
    source: "teacher_assessment"
    assessed_by: "supervising"
  tasks:
    weight: 0.3
    source: "task_submissions"
    assessed_by: "assessing"
  business_feedback:
    weight: 0.3
    source: "business_feedback"
    fallback: "teacher_impression"  # Wenn kein Feedback
  teacher_impression:
    weight: 0.2
    source: "teacher_assessment"
    assessed_by: "assessing"
```

### Bewertung ohne Betriebsfeedback (Fallback)

Wenn Betrieb trotz Erinnerungen nicht bewertet:
1. Lehrkraft sieht "Betrieb hat nicht bewertet"
2. Option "Ohne Betriebsfeedback benoten" verfügbar
3. **Begründung dokumentieren** (Pflicht)
4. Betriebsteil entfällt aus Gesamtnote (Gewichtung wird angepasst)

### Mehrere Blöcke

Bei 2+ Praktikumsblöcken bei verschiedenen Betrieben:
- System zeigt alle Betriebsbewertungen einzeln
- Automatischer gewichteter Durchschnitt nach Tagen
- Lehrkraft sieht Einzelwerte + Gesamtdurchschnitt
- Default: Pro Schuljahr eine Gesamtnote

### Wenn deaktiviert
- Keine Benotung
- Praktikum ist "bestanden" wenn Tage absolviert

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` (Bewertungen), `ENTSCHEIDUNGEN-LEHRKRAFT.md` Bewertung

---

## certificate

### Verantwortung
Praktikums-Zertifikat zum Download nach Abschluss.

### Entitäten

```
Certificate {
  id: UUID
  student_id: UUID → Student
  period_id: UUID → Period
  type: enum                          // full, preliminary
  placements_included: UUID[]         // Welche Placements
  total_days: number
  days_remaining: number              // Bei preliminary
  pdf_file_id: UUID
  generated_at: timestamp
  created_at: timestamp
}
```

### Input
- `Event: all_requirements_completed` (oder manuell)
- `core.Student`
- `core.Placement[]`

### Output (Events)
- `certificate.generated`

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `allow_preliminary` | boolean | true | Vorläufiges Zertifikat wenn Tage fehlen |
| `include_school_logo` | boolean | true | Schullogo einbinden |
| `include_business_names` | boolean | true | Betriebsnamen auflisten |
| `include_total_days` | boolean | true | Gesamttage anzeigen |
| `include_grade` | boolean | false | Note anzeigen (wenn grading aktiv) |

### Zertifikat-Varianten

| Typ | Wann | Inhalt |
|-----|------|--------|
| **full** | Alle Tage absolviert | Vollständige Bestätigung |
| **preliminary** | Tage noch offen | Mit Vermerk "X Tage noch zu absolvieren" |

### Wenn deaktiviert
- Kein automatisches Zertifikat
- Schule stellt manuell aus

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 4

---

## traffic_light

### Verantwortung
Ampel-System zur Visualisierung des Zeitdrucks. Automatische Erinnerungen bei Statuswechsel.

### Entitäten
(Keine eigenen – berechnet aus Period + Commitment)

### Input
- `core.Period` (Praktikumsstart)
- `commitment` (aktuelle Zusagen)

### Output (Events)
- `traffic_light.changed` – Ampel wechselt (green→yellow, yellow→red)

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `green_threshold_days` | number | 90 | Grün wenn > X Tage bis Praktikum |
| `yellow_threshold_days` | number | 30 | Gelb wenn < X Tage |
| `red_threshold_days` | number | 14 | Rot wenn < X Tage |
| `notify_on_change` | boolean | true | Push bei Wechsel |

### Wenn deaktiviert
- Keine Ampel im Dashboard
- Keine automatischen Zeitdruck-Warnungen

**Flow-Referenz:** `FLOW-SCHUELER.md` Phase 1a

---

## visit_scheduling

### Verantwortung
Praxisbesuche bei Betrieben planen und dokumentieren. Kalender-basierte Terminierung mit Verfügbarkeits-Übersicht.

### Entitäten

```
Visit {
  id: UUID
  placement_id: UUID → Placement
  teacher_id: UUID → Teacher
  business_id: UUID → Business
  students: UUID[] → Student[]            // Alle Schüler bei diesem Betrieb

  // Terminierung
  status: enum                            // pending, proposed, confirmed,
                                          // completed, cancelled
  proposed_slots: Slot[]                  // Vorgeschlagene Termine
  confirmed_slot: Slot
  proposed_by: enum                       // teacher, business
  proposed_at: timestamp
  confirmed_at: timestamp

  // Durchführung
  visit_type: enum                        // in_person, phone, video
  visited_at: timestamp
  notes: string

  created_at: timestamp
  updated_at: timestamp
}

Slot {
  date: date
  time_start: time
  time_end: time
}

BusinessAvailability {
  id: UUID
  business_id: UUID → Business
  period_id: UUID → Period                // Für welchen Praktikumszeitraum
  slots: Slot[]                           // Verfügbare 2h-Blöcke
  created_at: timestamp
  updated_at: timestamp
}
```

### Input
- `Event: contract.approved` (Besuch kann geplant werden)
- `core.Placement`
- `core.Period`

### Output (Events)
- `visit.proposed` – Lehrkraft schlägt Termin vor
- `visit.confirmed` – Betrieb bestätigt
- `visit.rejected` – Betrieb lehnt ab
- `visit.alternative_proposed` – Betrieb schlägt Alternative vor
- `visit.completed` – Besuch durchgeführt
- `visit.cancelled` – Termin abgesagt

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `required_visits_per_period` | number | 1 | Wie viele Besuche pro Zeitraum Pflicht |
| `allow_phone_video` | boolean | true | Telefonat/Videocall als Alternative erlaubt |
| `slot_duration_minutes` | number | 120 | Länge der Verfügbarkeits-Slots |
| `allow_early_scheduling` | boolean | true | Vor Praktikumsbeginn planen |
| `optimization_algorithm` | string | "greedy" | Algorithmus für System-Vorschläge |

### Betrieb-Verfügbarkeit

Der Betrieb gibt seine Verfügbarkeit in 2h-Blöcken an:

```
Betrieb-Dashboard zeigt:
┌────────────────────────────────────────────┐
│ Wann können wir Sie besuchen?              │
│                                            │
│ Praktikumszeitraum: 15.03. - 15.04.        │
│                                            │
│ Verfügbare Zeiten (2h-Blöcke):             │
│ ┌──────┬──────┬──────┬──────┬──────┐       │
│ │      │ Mo   │ Di   │ Mi   │ Do   │ Fr   │
│ ├──────┼──────┼──────┼──────┼──────┤       │
│ │08-10 │  ☐   │  ☐   │  ☑   │  ☐   │  ☐   │
│ │10-12 │  ☐   │  ☑   │  ☑   │  ☐   │  ☐   │
│ │14-16 │  ☑   │  ☑   │  ☐   │  ☐   │  ☐   │
│ └──────┴──────┴──────┴──────┴──────┘       │
│                                            │
│ [Speichern]                                │
└────────────────────────────────────────────┘
```

### Verfügbarkeits-Anfrage (E-Mail)

```
Betreff: Besuchstermin für Praktikum von Max Müller

Guten Tag,

wir möchten Max Müller während des Praktikums besuchen.

Bitte geben Sie Ihre verfügbaren Zeiten an:
[Verfügbarkeit angeben →]

Oder: Der Besuch kann auch telefonisch stattfinden.

Mit freundlichen Grüßen
Frau Müller
```

### Terminvorschlag durch Lehrkraft

Wenn Betrieb Verfügbarkeit angegeben hat:

```
Betrieb erhält:
┌────────────────────────────────────────────┐
│ Terminvorschlag für Praxisbesuch           │
│                                            │
│ Frau Müller (Wirtschaftsschule) möchte     │
│ Max Müller am Arbeitsplatz besuchen.       │
│                                            │
│ Vorgeschlagene Termine:                    │
│ ○ Di, 25.03. 10:00-12:00                   │
│ ○ Mi, 26.03. 08:00-10:00                   │
│                                            │
│ [Termin bestätigen]                        │
│ [Keiner passt - Alternative vorschlagen]   │
└────────────────────────────────────────────┘
```

### Greedy-Algorithmus (V1)

```
1. Sortiere Betriebe nach Anzahl verfügbarer Slots (aufsteigend)
2. "Schwierige" Betriebe (wenige Slots) werden zuerst geplant
3. Für jeden Betrieb: Ersten freien Slot zuweisen
4. Konflikte anzeigen, wenn kein Slot mehr frei
```

### Wenn deaktiviert
- Keine Terminplanung über App
- Lehrkraft organisiert Besuche manuell (außerhalb System)
- Dokumentation nur als "Besuch durchgeführt" (Datum + Notizen)

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Proaktiver Flow 2

---

## inbox

### Verantwortung
Zentrale Aufgaben-Queue für Lehrkräfte. Sammelt alle reaktiven Aufgaben aus anderen Modulen.

### Entitäten

```
InboxItem {
  id: UUID
  teacher_id: UUID → Teacher
  type: enum                              // contract_review, print_request,
                                          // catch_up_review, approval_decision,
                                          // feedback_correction
  priority: enum                          // urgent, normal, low
  reference_id: UUID                      // ID des zugehörigen Objekts
  reference_type: string                  // "Contract", "CatchUpRecord", etc.
  title: string
  description: string
  created_at: timestamp
  completed_at: timestamp
  completed_by: UUID → Teacher
  status: enum                            // pending, completed, dismissed
}
```

### Input (Events, die Inbox-Items erzeugen)
- `contract.submitted` → "Vertrag prüfen"
- `contract.print_requested` → "Druckanfrage"
- `commitment.submitted` → "Einspruch möglich" (wenn approval_window aktiv)
- `catch_up.proof_submitted` → "Nachholnachweis prüfen"
- `business_feedback.correction_requested` → "Korrekturanfrage"
- `sick.certificate_uploaded` → "Attest prüfen" (optional)

### Output (Events)
- `inbox.item_created` – Neue Aufgabe
- `inbox.item_completed` – Aufgabe erledigt

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `urgent_after_days` | number | 7 | Nach X Tagen wird Aufgabe als dringend markiert |
| `show_age` | boolean | true | "vor X Tagen" anzeigen |
| `group_by` | string | "priority" | Gruppierung: priority, type, date |

### Wenn deaktiviert
- Aufgaben erscheinen nur als Benachrichtigungen
- Kein zentraler Überblick über offene Aufgaben

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Dashboard + alle reaktiven Flows

---

## batch_operations

### Verantwortung
Effiziente Bearbeitung mehrerer Schüler gleichzeitig. Batch-Modus für Bewertungen und Erinnerungen.

### Entitäten

```
(Keine eigenen Entitäten – arbeitet auf bestehenden Daten)
```

### Input
- Liste von Schülern (aus Filter/Selektion)
- Kontext-abhängig: Grade, Student, etc.

### Output (Events)
- `batch.reminders_sent` – Mehrere Erinnerungen gesendet
- `batch.grades_saved` – Mehrere Bewertungen gespeichert

### Funktionen

| Funktion | Beschreibung |
|----------|--------------|
| Batch-Erinnerung | Mehrere Schüler gleichzeitig erinnern |
| Bewertungs-Modus | "Speichern & Nächster" für effizientes Arbeiten |
| Checkbox-Selektion | Mehrere Einträge auswählen |
| Filter-Export | Gefilterte Liste exportieren (V2) |

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `max_batch_size` | number | 100 | Maximale Anzahl pro Batch |
| `show_progress` | boolean | true | Fortschrittsanzeige bei Batch-Operationen |

### Wenn deaktiviert
- Alle Operationen nur einzeln möglich
- Bewertungen ohne "Nächster"-Button

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Bewertungen (Batch-Modus), Schüler-Übersicht

---

## notification_settings

### Verantwortung
Individuelle Benachrichtigungs-Einstellungen pro Nutzer. Push, E-Mail, Zusammenfassungen.

### Entitäten

```
NotificationPreferences {
  id: UUID
  user_id: UUID → User

  // Kanal-Einstellungen
  push_enabled: boolean
  email_enabled: boolean

  // Event-spezifische Einstellungen
  event_settings: {
    [event_type: string]: {
      push: boolean
      email: boolean
    }
  }

  // Zusammenfassungen
  weekly_summary_enabled: boolean
  weekly_summary_day: enum                // monday, tuesday, etc.

  // Spezielle Einstellungen (Lehrkraft)
  approval_weekend_pause: boolean         // Wochenend-Pause für Timer

  created_at: timestamp
  updated_at: timestamp
}
```

### Input
- Nutzer-Interaktion (Einstellungs-Screen)

### Output
- Filter für Notification-Service

### Konfigurierbare Events (Lehrkraft)

| Event-Typ | Default Push | Default E-Mail |
|-----------|--------------|----------------|
| new_commitment | ✓ | ○ |
| contract_submitted | ✓ | ○ |
| print_request | ✓ | ○ |
| sick_report | ○ | ○ |
| visit_confirmed | ✓ | ○ |
| business_feedback_received | ✓ | ○ |
| weekly_summary | – | ✓ |

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `default_push` | boolean | true | Standard für neue Nutzer |
| `default_email` | boolean | false | Standard für neue Nutzer |
| `allow_all_off` | boolean | false | Darf Nutzer alles deaktivieren? |

### Wenn deaktiviert
- Alle Benachrichtigungen nach System-Defaults
- Keine individuelle Anpassung möglich

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Benachrichtigungs-Einstellungen

---

## teacher_reminders

### Verantwortung
System-generierte Erinnerungen AN Lehrkräfte. Proaktive Hinweise bei Handlungsbedarf.

### Entitäten

```
TeacherReminder {
  id: UUID
  teacher_id: UUID → Teacher
  type: enum                              // task_overdue, deadline_warning,
                                          // student_inactive, missing_checkin,
                                          // business_not_rated, grading_deadline
  reference_ids: UUID[]                   // Betroffene Objekte
  triggered_at: timestamp
  dismissed_at: timestamp
  snoozed_until: timestamp
}
```

### Trigger

| Trigger | Typ | Bedingung |
|---------|-----|-----------|
| `task_overdue` | Aufgabe liegt zu lange | Inbox-Item > `overdue_days` |
| `deadline_warning` | Praktikum naht | Praktikumsbeginn < `warning_days` UND Schüler ohne Vertrag |
| `student_inactive` | Schüler inaktiv | Keine Aktivität > `inactive_days` in Bewerbungsphase |
| `missing_checkin` | Kein Check-in heute | Während Praktikum, Check-in fehlt nach `checkin_deadline` |
| `business_not_rated` | Betrieb hat nicht bewertet | > `rating_reminder_days` nach Praktikumsende |
| `grading_deadline` | Bewertungs-Deadline naht | < `grading_warning_days` bis Deadline |

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `overdue_days` | number | 7 | Aufgabe gilt als überfällig nach X Tagen |
| `warning_days` | number | 14 | Warnung X Tage vor Praktikumsbeginn |
| `inactive_days` | number | 14 | Schüler gilt als inaktiv nach X Tagen |
| `checkin_deadline` | string | "18:00" | Bis wann Check-in erwartet |
| `rating_reminder_days` | number | 7 | Erinnerung X Tage nach Praktikumsende |
| `grading_warning_days` | number | 5 | Warnung X Tage vor Bewertungs-Deadline |
| `all_dismissible` | boolean | true | Alle Erinnerungen können weggeklickt werden |

### Output (Events)
- `reminder.triggered` – Erinnerung ausgelöst
- `reminder.dismissed` – Erinnerung weggeklickt

### Wenn deaktiviert
- Keine proaktiven System-Erinnerungen
- Lehrkraft muss selbst Überblick behalten

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Erinnerungen an Lehrkraft

---

## business_blacklist

### Verantwortung
Sperrliste für Betriebe. Admin-Funktion mit Lehrkraft-Override-Möglichkeit.

### Entitäten

```
BlacklistEntry {
  id: UUID
  business_id: UUID → Business
  school_id: UUID → School
  reason: string
  blocked_by: UUID → Admin
  blocked_at: timestamp
  is_active: boolean
}

BlacklistOverride {
  id: UUID
  blacklist_entry_id: UUID → BlacklistEntry
  student_id: UUID → Student
  teacher_id: UUID → Teacher
  justification: string                   // Pflicht-Begründung
  approved_at: timestamp
}
```

### Input
- `Event: teacher_feedback.flagged` (mehrfach) → Trigger für Admin-Review
- Admin-Aktion: Betrieb sperren
- Lehrkraft-Aktion: Override für Einzelfall

### Output (Events)
- `business.blocked` – Betrieb gesperrt
- `business.unblocked` – Sperre aufgehoben
- `business.override_granted` – Einzelfall-Freigabe

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `flag_threshold` | number | 2 | Ab X Flags: Admin-Warnung |
| `allow_teacher_override` | boolean | true | Lehrkraft kann freigeben |
| `notify_admin_on_override` | boolean | true | Admin informieren bei Override |

### Wenn deaktiviert
- Keine Betrieb-Sperre möglich
- Nur Warnungen über teacher_feedback (Flags)

**Flow-Referenz:** `FLOW-LEHRKRAFT.md` Proaktiver Flow 4 (Gesperrter Betrieb)

---

## onboarding

### Verantwortung
Einführung für neue Nutzer beim allerersten Login. Rollenspezifische Tutorials.

### Entitäten

```
OnboardingStatus {
  id: UUID
  user_id: UUID → User
  role: enum                              // student, teacher, business, admin
  completed: boolean
  completed_at: timestamp
  skipped: boolean
  skipped_at: timestamp
  current_step: number
  created_at: timestamp
}
```

### Onboarding-Inhalte pro Rolle

| Rolle | Inhalte |
|-------|---------|
| **Schüler** | Übersicht Phasen, Erste Bewerbung, Ampel-System |
| **Lehrkraft** | Schülerübersicht, Praktikumszeitraum, Aufgaben-Queue, Was passiert als nächstes |
| **Betrieb** | Dashboard-Überblick, Anwesenheit bestätigen (wöchentlich), Beurteilung am Ende |
| **Admin** | Schul-Konfiguration, Import, Betreuungen |

### Betrieb-Onboarding (3 Screens)

```
Screen 1: "Willkommen!"
- Max Müller macht ab 15.03. Praktikum bei Ihnen
- Betreuende Lehrkraft: Frau Müller
- Ihr Dashboard auf einen Blick

Screen 2: "Wöchentlich: Anwesenheit bestätigen"
- Jeden Freitag erhalten Sie eine E-Mail
- Bestätigen Sie, dass der Schüler anwesend war
- Bei Unstimmigkeiten: Einfach widersprechen

Screen 3: "Am Ende: Beurteilung"
- Kurzes Formular (5 Min)
- Hilft bei der Bewertung des Praktikums
- [Zum Dashboard →]
```

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `enabled` | boolean | true | Onboarding anzeigen? |
| `allow_skip` | boolean | true | Überspringen erlauben? |
| `show_on_role_change` | boolean | false | Bei Rollenwechsel erneut zeigen? |

### Wenn deaktiviert
- Kein Tutorial beim ersten Login
- Nutzer muss sich selbst zurechtfinden

**Flow-Referenz:** `ENTSCHEIDUNGEN-LEHRKRAFT.md` Onboarding

---

## duplicate_detection

### Verantwortung
Erkennung und Zusammenführung von Betrieb-Duplikaten. Photon API für Adress-Normalisierung.

### Entitäten

```
DuplicateCandidate {
  id: UUID
  business_id_1: UUID → Business
  business_id_2: UUID → Business
  similarity_score: number              // 0-1
  match_reasons: string[]               // ["name_fuzzy", "address_exact", "plz_match"]
  status: enum                          // pending, merged, dismissed
  merged_into: UUID → Business          // Bei status=merged
  reviewed_by: UUID → Admin
  reviewed_at: timestamp
  created_at: timestamp
}
```

### Algorithmus (Goldstandard)

1. **Photon API** (OSM-basiert, DSGVO-konform) für Adress-Autocomplete
2. **Normalisierung:** Adresse wird standardisiert
3. **Fuzzy-Match:** Firmennamen vergleichen (Levenshtein, etc.)
4. **PLZ-Match:** Exakte Übereinstimmung Postleitzahl
5. **Score-Berechnung:** Kombinierter Ähnlichkeitswert

### Bei Eingabe (Schüler)

```
"Meintest du einen dieser Betriebe?"
- Müller GmbH, Industriestr. 5, 12345 Stadt
- Mueller GmbH, Industriestraße 5, 12345 Stadt

[Ja, auswählen]  [Nein, neuer Betrieb]
```

### Bestehender Account

- Wenn Betrieb existiert: Schüler wird zugewiesen (kein neuer Account)
- Betrieb erhält Nachricht: "Neuer Praktikant: Max Müller"

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `fuzzy_threshold` | number | 0.8 | Ab welchem Score als Duplikat vorschlagen? |
| `require_plz_match` | boolean | true | PLZ muss übereinstimmen |
| `auto_suggest` | boolean | true | Bei Eingabe automatisch vorschlagen |

### Admin-Merge-Funktion

Falls Duplikate durchrutschen:
- Admin kann Betriebe manuell zusammenführen
- Alle Praktikanten werden übertragen
- Historie bleibt erhalten

### Wenn deaktiviert
- Keine Duplikat-Erkennung
- Manuelle Prüfung durch Admin nötig
- Potentiell viele doppelte Einträge

**Flow-Referenz:** `ENTSCHEIDUNGEN-LEHRKRAFT.md` Betrieb-Duplikaterkennung

---

## teacher_assignment

### Verantwortung
Zuweisung von Lehrkräften zu Schülern/Klassen. Betreuungswechsel und Archivierung.

### Entitäten

```
TeacherAssignment {
  id: UUID
  teacher_id: UUID → Teacher
  student_id: UUID → Student            // Einzelzuweisung
  class_id: UUID → Class                // Oder Klassenzuweisung
  period_id: UUID → Period              // Für welchen Zeitraum
  role: enum                            // supervising, assessing, both
  assigned_by: UUID → Admin
  assigned_at: timestamp
  valid_from: date
  valid_until: date                     // null = unbegrenzt
  created_at: timestamp
}
```

### Zuweisungs-Arten

| Art | Beschreibung |
|-----|--------------|
| Klasse → Lehrkraft | Alle Schüler einer Klasse |
| Einzeln | Spezifischer Schüler |
| Zeitraum-gebunden | Nur für bestimmten Praktikumszeitraum |

### Betreuungswechsel

**Innerhalb Schuljahr:**
1. Admin weist neue Betreuung zu
2. Alle laufenden Vorgänge gehen an neue Lehrkraft
3. Neue Lehrkraft sieht vollständige Historie

**Neues Schuljahr:**
1. Admin weist neue Betreuungen zu
2. Schüler-Accounts bleiben
3. Neue Lehrkraft macht da weiter, wo es steht

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `allow_class_assignment` | boolean | true | Klassenzuweisung möglich? |
| `allow_individual` | boolean | true | Einzelzuweisung möglich? |
| `keep_history` | boolean | true | Historie bei Wechsel erhalten? |

### Ausschluss von Betreuung

Manche LK sollen nie automatisch zugewiesen werden (z.B. Schulleitung, Verwaltung).

**Entität:** `Teacher.excluded_from_supervision: boolean`

| Einstellung | Verhalten |
|-------------|-----------|
| `false` (Default) | LK nimmt am Zuweisungs-Algorithmus teil |
| `true` | LK wird nie automatisch zugewiesen |

**Wichtig:**
- Ausgeschlossene LK können manuell zugewiesen werden (Ausnahmen)
- Admin verwaltet die Liste unter "Betreuung > Algorithmus"
- Typische Ausschlüsse: Schulleitung, Stellvertretung, Elternzeit

### Wenn deaktiviert
- Keine explizite Zuweisung nötig
- Alle Lehrkräfte sehen alle Schüler (?)
- Nicht empfohlen

**Flow-Referenz:** `ENTSCHEIDUNGEN-ADMIN.md` Betreuungszuweisung

---

## supervision_algorithm

### Verantwortung
Automatische Berechnung und Zuweisung von Schüler-Betreuungen basierend auf Lehrkraft-Kapazitäten.

### Algorithmus

**Grundprinzip:** Je mehr Unterrichtsstunden einer LK "wegfallen", wenn Schüler im Praktikum sind, desto mehr Betreuungskapazität hat sie.

### Prioritäten

| Prio | Regel | Beschreibung |
|------|-------|--------------|
| **1** | LK Übungsunternehmen | Bekommt die Schüler, die sie im ÜU unterrichtet |
| **2** | Klassenleitung | Bekommt verbleibende Schüler ihrer Klasse |
| **3** | Verteilungsschlüssel | Rest nach gewichteter Kapazität |

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

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `mode` | enum | "hours_based" | Modus: "hours_based", "equal", "manual" |
| `prio_1_enabled` | boolean | true | ÜU-LK bekommt ihre Schüler zuerst |
| `prio_2_enabled` | boolean | true | KL bekommt Klassen-Schüler als zweites |
| `min_capacity_threshold` | number | 2 | Unter X Stunden: Keine automatische Zuweisung |
| `manual_weight_override` | boolean | false | Admin kann Gewichtung überschreiben |

### Modus-Optionen

| Modus | Beschreibung | Wann sinnvoll |
|-------|--------------|---------------|
| `hours_based` (Default) | Kapazität = wegfallende Stunden | Standard, fair |
| `equal` | Gleichverteilung | Wenn alle gleich viel betreuen sollen |
| `manual` | Kein Algorithmus | Kleine Schulen, Sonderfälle |

### Sonderregeln

| Fall | Behandlung |
|------|------------|
| Teilzeit-LK | Gleich behandeln (wegfallende h zählen, nicht Deputat) |
| LK ohne Unterricht Kl.10/11 | Kapazität = 0, keine automatische Zuweisung |
| LK ausgeschlossen | Markiert als `excluded_from_supervision` |
| Mehrere ÜU-LK pro Klasse | Proportional nach ÜU-Stunden aufteilen |
| Rundungsdifferenzen | LK mit höchster Kapazität auffüllen |

### Output (Events)
- `supervision.calculated` – Berechnung abgeschlossen
- `supervision.assigned` – Zuweisung durchgeführt
- `supervision.manual_change` – Manuelle Änderung

**Flow-Referenz:** `FLOW-ADMIN.md` Flow 3 & 12, `ENTSCHEIDUNGEN-ADMIN.md` Betreuungszuweisung

---

## archival

### Verantwortung
Archivierung abgeschlossener Schüler-Accounts. DSGVO-konforme Aufbewahrung und Löschung.

### Entitäten

```
ArchivedStudent {
  id: UUID
  original_student_id: UUID
  school_id: UUID → School
  reason: enum                          // graduated, left_school, transferred
  archived_at: timestamp
  archived_by: UUID → Admin
  scheduled_deletion: date              // Wann endgültig löschen?
  data_snapshot: JSON                   // Minimale Daten für Nachweise
  created_at: timestamp
}
```

### Archivierungs-Gründe

| Grund | Beschreibung | Aktion |
|-------|--------------|--------|
| `graduated` | Abschluss bestanden | Archivieren |
| `left_school` | Schulabgang | Archivieren |
| `transferred` | Schulwechsel | Archivieren |
| `repeat_year` | Sitzenbleiber | Account bleibt aktiv |

### Sitzenbleiben

- **Admin-Entscheidung:** Ob vorherige Praktikumstage angerechnet werden
- **Default:** Nicht anrechnen (konservativer Ansatz)
- Im Admin konfigurierbar

### Löschfristen (DSGVO)

| Datentyp | Aufbewahrung | Danach |
|----------|--------------|--------|
| Basisdaten | 18 Monate Inaktivität | Löschen |
| Atteste | Sofort nach Bestätigung | Löschen |
| Bewertungen | Schuljahr + 2 Jahre | Anonymisieren |
| Verträge | Schuljahr + 10 Jahre | Löschen |

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `auto_archive_on_graduation` | boolean | true | Automatisch bei Abschluss |
| `deletion_after_months` | number | 18 | Löschung nach X Monaten Inaktivität |
| `count_previous_days_on_repeat` | boolean | false | Bei Sitzenbleiben Tage anrechnen? |

### Sitzenbleiben / Wiederholer

Der Parameter `count_previous_days_on_repeat` regelt, ob Vorjahres-Praktikumstage angerechnet werden:

| Einstellung | Verhalten |
|-------------|-----------|
| `false` (Default) | Wiederholer muss alle Tage neu absolvieren |
| `true` | Vorjahres-Tage werden gutgeschrieben |

**Konfiguration:**
- Schulweit einstellbar durch Admin
- Kann pro Schüler überschrieben werden (Ausnahmen)
- Bei Anrechnung: System zeigt "X Tage aus Vorjahr angerechnet"
- LK sieht Hinweis: "Wiederholer mit angerechneten Tagen"

### Wenn deaktiviert
- Keine automatische Archivierung
- Manuelle Löschung durch Admin
- DSGVO-Risiko!

**Flow-Referenz:** `ENTSCHEIDUNGEN-ADMIN.md` Sitzenbleiben, `ENTSCHEIDUNGEN-DATENSCHUTZ.md`

---

## external_days

### Verantwortung
Erfassung von Praktikumstagen, die an einer anderen Schule absolviert wurden (Neuzugänge/Quereinsteiger).

### Entitäten

```
ExternalDaysRecord {
  id: UUID
  student_id: UUID → Student
  school_id: UUID → School
  days_count: number                    // Anzahl absolvierter Tage
  school_year: string                   // z.B. "2023/24"
  source_school_name: string            // Herkunftsschule (optional)
  proof_file_id: UUID                   // Nachweis (optional)
  comment: string                       // Zusätzliche Infos
  created_by: UUID → Admin
  created_at: timestamp
}
```

### Input
- Admin-Eingabe bei Schüler-Anlage oder später
- Optional: Nachweis-Upload (Zertifikat der Vorschule)

### Output (Events)
- `external_days.recorded` – Externe Tage eingetragen
- `external_days.updated` – Externe Tage geändert

### Verwendung

**Bei Neuzugang in Klasse 11:**
- Schüler kommt von anderer Schule
- Hat ggf. bereits Praktikumstage absolviert
- Admin trägt Tage ein → werden auf Gesamtzahl angerechnet

**Anzeige:**
- Im Schüler-Dashboard: "X Tage (davon Y extern)"
- In Reports: Separate Spalte "Extern absolviert"
- Lehrkraft sieht Hinweis: "Quereinsteiger mit externen Tagen"

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `enabled` | boolean | true | Feature aktiv? |
| `require_proof` | boolean | false | Nachweis-Upload Pflicht? |

### Wenn deaktiviert
- Keine Erfassung externer Tage möglich
- Quereinsteiger müssen alle Tage neu absolvieren

**Flow-Referenz:** `FLOW-ADMIN.md` Flow 10, `ENTSCHEIDUNGEN-ADMIN.md` Neuzugänge

---

## deadline_management

### Verantwortung
Zentrale Verwaltung und individuelle Verlängerung von Fristen/Deadlines.

### Entitäten

```
DeadlineExtension {
  id: UUID
  student_id: UUID → Student
  deadline_type: enum                   // task, certificate, grading
  reference_id: UUID                    // Task-ID, SickReport-ID, etc.
  original_deadline: date
  extended_deadline: date
  reason: string                        // Begründung (Pflicht)
  extended_by: UUID → Admin/Teacher
  extended_at: timestamp
  student_notified: boolean
  teacher_notified: boolean
}
```

### Input
- Admin-Aktion in Schüler-Detail
- Optional auch durch Lehrkraft

### Output (Events)
- `deadline.extended` – Frist verlängert
- `deadline.extension_notified` – Betroffene informiert

### Verwaltete Deadlines

| Deadline-Typ | Beschreibung | Standard |
|--------------|--------------|----------|
| `task` | Lernaufgaben (Reflexion, etc.) | Aus Profil |
| `certificate` | Attest-Frist | 3 Tage |
| `grading` | Bewertungs-Deadline für LK | Datum |

### Funktionen

**Global (alle Schüler):**
- Admin ändert Deadline in Einstellungen
- Gilt für alle zukünftigen Fälle

**Einzelner Schüler:**
- Admin/LK öffnet Schüler-Detail
- "Deadline verlängern" für spezifische Aufgabe
- Begründung erforderlich (wird dokumentiert)

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `allow_teacher_extension` | boolean | true | Lehrkraft darf verlängern? |
| `max_extension_days` | number | 30 | Maximale Verlängerung in Tagen |
| `require_reason` | boolean | true | Begründung Pflicht? |

### Wenn deaktiviert
- Keine individuellen Fristverlängerungen möglich
- Nur globale Deadline-Änderung durch Admin

**Flow-Referenz:** `FLOW-ADMIN.md` Flow 14, `ENTSCHEIDUNGEN-ADMIN.md` Deadline-Verwaltung

---

## business_account

### Verantwortung
Account-Erstellung und Authentifizierung für Betriebe. Multi-Auth-System mit Magic Link, Passwort und Passkeys.

### Entitäten

```
BusinessUser {
  id: UUID
  business_id: UUID → Business
  email: string                             // Ansprechpartner-E-Mail
  email_verified: boolean
  email_verified_at: timestamp

  // Auth-Methoden
  auth_methods: enum[]                      // magic_link, password, passkey
  password_hash: string                     // Nur wenn password aktiviert
  passkey_credentials: JSON[]               // WebAuthn Credentials

  // Status
  status: enum                              // pending, active, suspended
  first_login_at: timestamp
  last_login_at: timestamp
  onboarding_completed: boolean

  // Einstellungen
  notification_preferences: JSON

  created_at: timestamp
  updated_at: timestamp
}

BusinessInvite {
  id: UUID
  business_id: UUID → Business
  email: string
  token: string                             // Einmal-Token für Magic Link
  token_expires_at: timestamp

  // Kontext
  student_id: UUID → Student                // Welcher Schüler löste dies aus?
  placement_id: UUID → Placement

  // Invite-Typ
  invite_type: enum                         // system (vom System bei Vertrag),
                                            // colleague (vom Betrieb selbst erstellt)
  invited_by: UUID → BusinessUser           // null bei system

  status: enum                              // pending, accepted, expired
  accepted_at: timestamp
  created_at: timestamp
}

EmailCorrectionRequest {
  id: UUID
  business_id: UUID → Business
  original_email: string                    // Die falsche E-Mail
  requested_email: string                   // Die vom Betrieb gewünschte E-Mail
  status: enum                              // pending, approved, rejected
  requested_at: timestamp
  reviewed_by: UUID → Teacher
  reviewed_at: timestamp
  rejection_reason: string
}

BusinessActivity {
  id: UUID
  business_user_id: UUID → BusinessUser
  activity_type: enum                       // login, invite_clicked, action_completed
  timestamp: timestamp
  metadata: JSON                            // z.B. Browser-Info, IP (gehashed)
}
```

### Auth-Optionen

| Methode | Beschreibung | Wann anbieten |
|---------|--------------|---------------|
| **Magic Link** | Link per E-Mail, kein Passwort | Standard (Default) |
| **Passwort** | Klassisches Login | Bei erster E-Mail oder später einrichten |
| **Passkey** | WebAuthn/FIDO2 | Nach erstem Login anbieten |

### Einladungs-Flow

```
1. Vertrag bestätigt (oder "Bei Schulleitung", je nach business_account_trigger)
2. E-Mail an Betrieb:
   "Max Müller macht Praktikum bei Ihnen. Klicken Sie hier für Zugang."
3. Betrieb klickt → Wahl: Magic Link ODER Passwort setzen
4. Bei Magic Link: Link kommt per E-Mail
5. Bei Passwort: Passwort setzen + E-Mail-Verifikation
6. Betrieb im Dashboard
```

### Input
- `Event: contract.approved` (oder `contract.at_school`, je nach Konfiguration)
- `core.Business`
- `core.Placement`

### Output (Events)
- `business_account.invited` – Einladung gesendet
- `business_account.activated` – Account erstellt und aktiv
- `business_account.auth_method_added` – Neue Auth-Methode aktiviert
- `business_account.login` – Erfolgreicher Login
- `business_account.colleague_invited` – Betrieb hat Kollegen eingeladen
- `business_account.email_correction_requested` – "Problem melden" bei falscher E-Mail
- `business_account.email_correction_approved` – LK hat E-Mail-Korrektur genehmigt
- `business_account.inactive_warning` – Betrieb hat lange nicht reagiert

### "Problem melden" Flow (falsche E-Mail)

```
1. Betrieb klickt Magic Link
2. Code-Eingabe-Screen zeigt: "Code wurde an w***r@firma.de gesendet"
3. Betrieb klickt "Kein Zugriff auf diese E-Mail? [Problem melden]"
4. Formular: "Bitte geben Sie Ihre korrekte E-Mail ein"
5. Lehrkraft erhält Benachrichtigung + Inbox-Item
6. Lehrkraft prüft und genehmigt/lehnt ab
7. Bei Genehmigung: Neuer Code geht an korrigierte Adresse
```

### Kollegen einladen (selbst)

```
1. Betrieb im Dashboard: "Weiteren Zugang erstellen"
2. E-Mail des Kollegen eingeben
3. System sendet Magic Link (30 Tage gültig)
4. Beide Accounts bleiben aktiv (kein Ersatz)
```

### Aktivitäts-Tracking

Das System trackt, ob ein Betrieb reagiert hat:

| Trigger | Aktion |
|---------|--------|
| X Tage nach Einladung ohne Klick | Lehrkraft wird informiert |
| Praktikumsstart ohne Aktivität | Warnung: "⚠️ Betrieb hat keinen aktiven Zugang" |

### Link-Gültigkeit

| Link-Typ | Gültigkeit |
|----------|------------|
| System-Invite (bei Praktikum) | Bis neuer Praktikant zugewiesen wird |
| Kollegen-Invite (selbst erstellt) | 30 Tage |
| Nach "Neuen Link anfordern" | Alter Link wird ungültig |

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `default_auth_method` | string | "magic_link" | Standard-Auth bei Einladung |
| `allow_password` | boolean | true | Passwort-Auth erlauben? |
| `allow_passkey` | boolean | true | Passkey-Auth erlauben? |
| `magic_link_expires_hours` | number | 48 | Gültigkeit Magic Link |
| `invite_resend_after_days` | number | 3 | Nach X Tagen Erinnerung |
| `prompt_passkey_after_logins` | number | 3 | Nach X Logins Passkey vorschlagen |
| `require_email_verification` | boolean | true | E-Mail-Bestätigung bei Passwort-Registrierung |
| `colleague_invite_expires_days` | number | 30 | Gültigkeit Kollegen-Einladung |
| `allow_colleague_invite` | boolean | true | Darf Betrieb Kollegen einladen? |
| `inactivity_warning_days` | number | 5 | Nach X Tagen ohne Reaktion: LK warnen |
| `browser_trust_days` | number | 90 | Wie lange bleibt Browser "vertraut" |

### ⚠️ Auth-System noch nicht final

> **Hinweis:** Das Auth-System für Betriebe ist konzeptionell noch nicht abgeschlossen.
> Magic Link vs. Passwort-First, E-Mail-Verifizierung, und das genaue UX sind noch in Diskussion.
> Siehe: `ENTSCHEIDUNGEN-BETRIEB.md` Sektion 2

### Wenn deaktiviert
- Kein Betrieb-Zugang
- Betrieb erhält nur E-Mails, kein Dashboard
- Keine Anwesenheitsbestätigung durch Betrieb möglich

**Flow-Referenz:** `FLOW-BETRIEB.md` Phase 0+1, `ENTSCHEIDUNGEN-BETRIEB.md` Authentifizierung

---

## attendance_confirmation

### Verantwortung
Wöchentliche Bestätigung der Schüler-Anwesenheit durch den Betrieb. **KEINE stillschweigende Bestätigung** – Betrieb muss aktiv handeln.

### Entitäten

```
AttendanceConfirmationRequest {
  id: UUID
  business_id: UUID → Business
  placement_id: UUID → Placement
  student_id: UUID → Student
  week_start: date
  week_end: date

  // Zu bestätigende Tage
  days: AttendanceDay[]

  // Status
  status: enum                              // pending, confirmed, disputed, expired
  requested_at: timestamp
  reminder_sent_at: timestamp
  confirmed_at: timestamp
  confirmed_by: UUID → BusinessUser

  created_at: timestamp
}

AttendanceDay {
  date: date
  student_reported: enum                    // present, sick, absent
  student_reported_at: timestamp
  business_status: enum                     // confirmed, disputed, unknown
  dispute_reason: string
}
```

### Wöchentlicher Flow

```
1. Freitag 18:00: E-Mail an Betrieb
   "Bitte bestätigen Sie die Anwesenheit von Max Müller für diese Woche"

2. Betrieb sieht Übersicht:
   | Tag | Schüler meldet | Betrieb bestätigt |
   |-----|----------------|-------------------|
   | Mo  | ✓ Anwesend     | [ ] Stimmt        |
   | Di  | ✓ Anwesend     | [ ] Stimmt        |
   | Mi  | Krank          | (Info)            |
   | Do  | ✓ Anwesend     | [ ] Stimmt        |
   | Fr  | ✓ Anwesend     | [ ] Stimmt        |

3. Betrieb bestätigt oder widerspricht

4. Bei Widerspruch: Lehrkraft wird informiert
```

### ⚠️ Keine stillschweigende Bestätigung

> **Wichtig:** Anders als ursprünglich überlegt gibt es für Betriebe **KEINE** stillschweigende Bestätigung.
> Der Betrieb muss aktiv bestätigen. Bei Nicht-Handeln:
> - Erinnerung nach 3 Tagen
> - Eskalation an Lehrkraft nach 7 Tagen
> → Lehrkraft muss dann manuell entscheiden

### Input
- `core.Attendance` (Schüler-Meldungen der Woche)
- `core.Placement`
- Zeitlicher Trigger: Freitagabend

### Output (Events)
- `attendance_confirmation.requested` – Anfrage an Betrieb
- `attendance_confirmation.confirmed` – Betrieb hat bestätigt
- `attendance_confirmation.disputed` – Betrieb widerspricht
- `attendance_confirmation.reminder_sent` – Erinnerung gesendet
- `attendance_confirmation.expired` – Keine Reaktion → Eskalation

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `request_day` | string | "friday" | Wann Anfrage senden |
| `request_time` | string | "18:00" | Uhrzeit der Anfrage |
| `reminder_after_days` | number | 3 | Erinnerung nach X Tagen |
| `escalate_after_days` | number | 7 | Eskalation an LK nach X Tagen |
| `allow_partial_confirmation` | boolean | true | Einzelne Tage bestätigen |

### Widerspruch-Workflow

1. Betrieb markiert Tag als "Nicht korrekt"
2. Betrieb gibt Grund an (Dropdown + Freitext)
3. Lehrkraft erhält Benachrichtigung + Inbox-Item
4. Lehrkraft klärt mit Schüler
5. Lehrkraft entscheidet: Schüler-Meldung korrigieren oder Betrieb-Einwand ablehnen

### Sammel-Ansicht (mehrere Praktikanten)

Wenn ein Betrieb mehrere Praktikanten betreut:

```
ANWESENHEIT BESTÄTIGEN – KW 06

┌─────────────────────────────────────────────────────┐
│ Max M. (03.-14.02.)                                 │
│ Mo ✓  Di ✓  Mi 🤒  Do ✓  Fr ✓                      │
│ [Alle bestätigen]  [Mit Änderungen]                 │
├─────────────────────────────────────────────────────┤
│ Anna S. (03.-14.02.)                                │
│ Mo ✓  Di ✓  Mi ✓  Do ✓  Fr ✓                       │
│ [Alle bestätigen]  [Mit Änderungen]                 │
└─────────────────────────────────────────────────────┘

[Alle Praktikanten bestätigen]
```

**E-Mail:** Eine E-Mail für alle Praktikanten des Ansprechpartners (nicht pro Schüler).

### Wenn deaktiviert
- Keine Betrieb-Bestätigung
- Schüler-Meldung wird direkt übernommen
- Weniger Kontrolle, aber weniger Aufwand für Betrieb

**Flow-Referenz:** `FLOW-BETRIEB.md` Anwesenheitsbestätigung, `ENTSCHEIDUNGEN-BETRIEB.md` Sektion 6

---

## praktikumsdatenbank

### Verantwortung
Opt-in Datenbank für Betriebe, die als Praktikumsplätze gefunden werden möchten. Schüler können durchsuchen, aber kein Matching-System.

### Entitäten

```
PraktikumsdatenbankEntry {
  id: UUID
  business_id: UUID → Business
  school_id: UUID → School                  // Für welche Schule sichtbar?

  // Opt-in
  is_visible: boolean
  opted_in_at: timestamp
  opted_in_by: UUID → BusinessUser

  // Profilinfo (öffentlich)
  description: string                       // Kurzbeschreibung
  industries: string[]                      // Branchen
  tasks_description: string                 // "Was macht ihr?"
  requirements: string                      // "Was erwarten wir?"
  capacity: number                          // Wie viele Praktikanten möglich?

  // Kontakt
  show_contact_email: boolean
  show_contact_phone: boolean
  contact_note: string                      // z.B. "Bitte per Mail anfragen"

  // Erfahrungen (aggregiert)
  avg_rating: number                        // Durchschnitt aus business_rating
  rating_count: number
  last_placement_year: number               // Letztes Praktikum wann?

  created_at: timestamp
  updated_at: timestamp
}
```

### Opt-in Flow (Betrieb)

```
1. Dashboard zeigt Banner/Card:
   "Möchten Sie als Praktikumsplatz gefunden werden?"

2. Betrieb klickt "Ja, Profil anlegen"

3. Formular:
   - Kurzbeschreibung
   - Branchen (Multi-Select)
   - Was erwartet Praktikanten?
   - Kapazität
   - Kontakt-Einstellungen

4. Profil wird sichtbar für Schüler der Schule
```

### Schüler-Suche

```
Schüler sieht:
- Liste verfügbarer Betriebe
- Filter: Branche, Ort, Bewertung
- Sortierung: Bewertung, Entfernung, Alphabet

Schüler klickt:
- Profil-Details
- "Mehr erfahren" → Kontaktinfo (wenn freigegeben)
- Schüler-Bewertungen (wenn > 3)
```

### ⚠️ Kein automatisches Matching

> **Absichtlich:** Das System vermittelt NICHT automatisch.
> Schüler sollen selbstständig Betriebe finden und sich bewerben.
> Die Datenbank ist nur eine Hilfestellung.

### Input
- Betrieb-Interaktion (Dashboard)
- `business_rating` (für aggregierte Bewertungen)

### Output (Events)
- `praktikumsdatenbank.opted_in` – Betrieb hat Profil erstellt
- `praktikumsdatenbank.opted_out` – Betrieb hat Profil deaktiviert
- `praktikumsdatenbank.profile_updated` – Profil aktualisiert

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `enabled` | boolean | true | Feature aktiv? |
| `min_ratings_to_show` | number | 3 | Ab X Bewertungen: Durchschnitt zeigen |
| `scope` | enum | "school" | "school" (nur eigene) oder "region" (alle im Umkreis) |
| `show_capacity` | boolean | true | Kapazität anzeigen? |

### Wenn deaktiviert
- Keine Praktikumsdatenbank
- Schüler müssen Betriebe komplett selbst finden
- Kein In-App-Verzeichnis

**Flow-Referenz:** `FLOW-BETRIEB.md` Praktikumsdatenbank, `ENTSCHEIDUNGEN-BETRIEB.md` Sektion 9

---

## email_templates

### Verantwortung
Standardisierte E-Mail-Vorlagen für Betriebskommunikation. 6 Haupt-E-Mail-Typen mit konsistentem Design.

### E-Mail-Typen (Betrieb)

| E-Mail | Auslöser | Inhalt |
|--------|----------|--------|
| **Einladung** | Vertrag bestätigt | "Max Müller macht Praktikum bei Ihnen" + Login-Link |
| **Erinnerung** | 3 Tage kein Login | "Haben Sie unsere Einladung gesehen?" |
| **Krankmeldung** | Schüler meldet krank | "Max Müller ist heute krank" |
| **Anwesenheits-Anfrage** | Freitagabend | "Bitte Anwesenheit dieser Woche bestätigen" |
| **Besuch-Terminvorschlag** | LK schlägt Termin vor | "Lehrkraft möchte Sie besuchen" + Terminauswahl |
| **Beurteilungs-Anfrage** | Praktikum endet bald | "Bitte beurteilen Sie Max Müller" |

### E-Mail-Typen (Lehrkraft)

| E-Mail | Auslöser | Inhalt |
|--------|----------|--------|
| **Wöchentliche Zusammenfassung** | Montagmorgen | Übersicht: Offene Aufgaben, Ampeln, Deadlines |
| **Sofort-Benachrichtigung** | Je nach Einstellung | Neue Zusage, Widerspruch, Krankmeldung, etc. |
| **Erinnerung** | Deadline naht | "3 Bewertungen fehlen noch" |
| **Eskalation** | Betrieb reagiert nicht | "Betrieb X hat seit 7 Tagen nicht bestätigt" |

### Sammel-E-Mails

Wenn ein Betrieb mehrere Praktikanten betreut, werden E-Mails zusammengefasst:

**Statt:**
- E-Mail 1: "Max M. war krank"
- E-Mail 2: "Anna S. war krank"

**Besser:**
- E-Mail: "2 Ihrer Praktikanten waren heute krank"

**Anwendung:**
- Krankmeldungen am gleichen Tag → eine Sammel-E-Mail
- Anwesenheits-Anfrage Freitag → eine E-Mail für alle Praktikanten
- Beurteilungs-Anfrage → eine E-Mail: "Bitte bewerten Sie Ihre 2 Praktikanten"

**Konfiguration:** `batch_similar_emails: true` (Default)

### Entitäten

```
EmailTemplate {
  id: UUID
  school_id: UUID → School                  // null = System-Default
  type: enum                                // invite, reminder, sick_info,
                                            // attendance_request, visit_proposal,
                                            // feedback_request
  subject: string
  body_html: string
  body_text: string

  // Platzhalter
  available_variables: string[]             // {{student_name}}, {{business_name}}, etc.

  is_default: boolean
  created_at: timestamp
  updated_at: timestamp
}

EmailLog {
  id: UUID
  template_id: UUID → EmailTemplate
  recipient_email: string
  business_id: UUID → Business
  student_id: UUID → Student                // Kontext

  sent_at: timestamp
  opened_at: timestamp                      // Tracking (optional)
  clicked_at: timestamp                     // Link geklickt?

  status: enum                              // sent, delivered, bounced, failed
  error_message: string
}
```

### E-Mail-Design-Prinzipien

1. **Minimalistisch:** Nur das Nötigste, keine Marketing-Floskeln
2. **Klar:** Was soll der Betrieb tun? → CTA prominent
3. **Mobil-optimiert:** Viele lesen auf Smartphone
4. **Absender:** schule@praktikum-app.de (oder Custom Domain)

### Beispiel: Einladungs-E-Mail

```
Betreff: Praktikum von Max Müller bei Ihrem Unternehmen

---

Guten Tag,

Max Müller (Klasse 10a, Wirtschaftsschule München)
absolviert ab dem 15.03.2025 ein Praktikum bei Ihnen.

Über unsere Praktikums-App können Sie:
• Anwesenheit bestätigen
• Besuchstermine vereinbaren
• Eine Beurteilung abgeben

[Zum Dashboard →]

Bei Fragen wenden Sie sich an die betreuende Lehrkraft:
Frau Müller (mueller@schule.de)

---

Diese E-Mail wurde automatisch generiert.
Wirtschaftsschule München | praktikum-app.de

Feedback zur App? → [Link zur Feedback-Seite]
```

### E-Mail-Footer

Jede E-Mail enthält einen Standard-Footer:

```
---
Diese E-Mail wurde automatisch generiert.
[Schulname] | praktikum-app.de

Feedback zur App? → [Link]
```

**Feedback-Link:** Führt zu kurzer Umfrage (3 Fragen max), hilft bei App-Verbesserung.

### Parameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `allow_school_customization` | boolean | true | Schule kann Vorlagen anpassen? |
| `track_opens` | boolean | false | Öffnungs-Tracking? (Datenschutz!) |
| `track_clicks` | boolean | true | Klick-Tracking auf CTAs? |
| `reply_to` | string | "teacher" | Antworten gehen an: "teacher", "school", "noreply" |
| `batch_similar_emails` | boolean | true | Sammel-E-Mails für mehrere Praktikanten? |
| `include_feedback_link` | boolean | true | Feedback-Link im Footer? |
| `teacher_weekly_summary` | boolean | true | Wöchentliche Zusammenfassung für LK? |
| `teacher_weekly_summary_day` | string | "monday" | Wochentag für Zusammenfassung |

### Wenn deaktiviert
- Keine automatischen E-Mails an Betriebe
- Lehrkraft müsste manuell kommunizieren
- Nicht empfohlen

**Flow-Referenz:** `FLOW-BETRIEB.md` (alle E-Mail-Erwähnungen), `ENTSCHEIDUNGEN-BETRIEB.md` E-Mail-Kommunikation

---

## Zentrales Erinnerungs-Schema

> Einheitliches Schema für Erinnerungen und Eskalationen im gesamten System.

### Standard-Schema: 3 → 5 → 7 Tage

| Tag | Aktion | Empfänger |
|-----|--------|-----------|
| **Tag 3** | 1. Erinnerung (freundlich) | Betrieb/Schüler |
| **Tag 5** | 2. Erinnerung (dringender) | Betrieb/Schüler |
| **Tag 7** | Eskalation | Lehrkraft wird informiert |

### Anwendung

| Kontext | Tag 3 | Tag 5 | Tag 7 |
|---------|-------|-------|-------|
| **Betrieb-Einladung** | "Haben Sie unsere Einladung gesehen?" | "Zugang noch nicht aktiviert" | LK: "Betrieb nicht erreichbar" |
| **Anwesenheitsbestätigung** | "Bitte Woche bestätigen" | "Dringend: Bestätigung ausstehend" | LK: "Betrieb hat nicht bestätigt" |
| **Beurteilung** | "Bitte Praktikant bewerten" | "Bewertung ausstehend" | LK: "Bewertung fehlt" |
| **Besuchstermin** | "Bitte Termin wählen" | "Terminauswahl noch offen" | LK: "Betrieb reagiert nicht" |

### Konfigurierbare Abweichungen

In manchen Modulen sind andere Intervalle sinnvoll:

| Modul | Parameter | Default |
|-------|-----------|---------|
| `business_account` | `inactivity_warning_days` | 5 |
| `attendance_confirmation` | `reminder_after_days` | 3 |
| `attendance_confirmation` | `escalate_after_days` | 7 |
| `business_feedback` | `reminder_after_days` | 5 |
| `business_feedback` | `auto_close_after_days` | 14 |
| `sick_reporting` | `certificate_deadline_days` | 3 |

### Design-Prinzipien

1. **Freundlich, nicht nervig:** Maximal 2 Erinnerungen vor Eskalation
2. **Klar im Ton:** Erste Erinnerung neutral, zweite dringender
3. **Lehrkraft nicht überfluten:** Eskalation nur bei echtem Problem
4. **Wochenenden überspringen:** Erinnerungen zählen nur Werktage

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version aus FLOW-SCHUELER.md |
| 2024-12-10 | Ergänzt: Zusage zurückziehen (commitment) |
| 2024-12-10 | Ergänzt: Überlappungs-Verhinderung (commitment) |
| 2024-12-10 | Ergänzt: Zertifikat-Varianten (certificate) |
| 2024-12-10 | Ergänzt: business_feedback, teacher_feedback, grading |
| 2024-12-10 | NEU: visit_scheduling (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | NEU: inbox (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | NEU: batch_operations (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | NEU: notification_settings (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | NEU: teacher_reminders (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | NEU: business_blacklist (aus FLOW-LEHRKRAFT.md) |
| 2024-12-10 | ERWEITERT: approval_window (Einspruch-Workflow, Ferien-Logik) |
| 2024-12-10 | ERWEITERT: contract (Status "Bei Schulleitung", business_account_trigger) |
| 2024-12-10 | ERWEITERT: catch_up (Zuständigkeit konfigurierbar) |
| 2024-12-10 | ERWEITERT: grading (Mehrere LK, Rollen-Zuweisung, Fallback ohne Betrieb) |
| 2024-12-10 | ERWEITERT: business_feedback (Korrektur-Workflow) |
| 2024-12-10 | NEU: onboarding (aus ENTSCHEIDUNGEN-LEHRKRAFT.md) |
| 2024-12-10 | NEU: duplicate_detection (aus ENTSCHEIDUNGEN-LEHRKRAFT.md) |
| 2024-12-10 | NEU: teacher_assignment (aus ENTSCHEIDUNGEN-LEHRKRAFT.md) |
| 2024-12-10 | NEU: archival (aus ENTSCHEIDUNGEN-LEHRKRAFT.md) |
| 2024-12-10 | NEU: business_account (aus FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md) |
| 2024-12-10 | NEU: attendance_confirmation (aus FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md) |
| 2024-12-10 | NEU: praktikumsdatenbank (aus FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md) |
| 2024-12-10 | NEU: email_templates (aus FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md) |
| 2024-12-10 | ERWEITERT: business_account ("Problem melden" Flow, Kollegen einladen, Aktivitäts-Tracking) |
| 2024-12-10 | ERWEITERT: attendance_confirmation (Sammel-Ansicht für mehrere Praktikanten) |
| 2024-12-10 | ERWEITERT: business_feedback (Auto-Save, Sammel-Ansicht) |
| 2024-12-10 | NEU: VOLLSTAENDIGKEITSPRUEFUNG.md (Checkliste gegen Flows) |
| 2024-12-10 | NEU: catch_up Zuständigkeit LK + Admin (statt nur reviewer) |
| 2024-12-10 | NEU: supervision_algorithm (Betreuungs-Algorithmus mit Kapazität) |
| 2024-12-10 | NEU: external_days (Quereinsteiger externe Tage) |
| 2024-12-10 | NEU: deadline_management (individuelle Fristverlängerung) |
| 2024-12-10 | ERWEITERT: teacher_assignment (excluded_from_supervision) |
| 2024-12-10 | ERWEITERT: archival (Wiederholer-Handling mit count_previous_days) |
| 2024-12-10 | ERWEITERT: grading (grading_role_default, 3-Ebenen-Rollen) |
| 2024-12-10 | ERWEITERT: email_templates (Lehrkraft-Mails, Sammel-Mails, Footer) |
| 2024-12-10 | NEU: Zentrales Erinnerungs-Schema (3→5→7 Tage) |
