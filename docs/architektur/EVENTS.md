# Event-Katalog

> Events sind die Kommunikation zwischen Modulen.
> Neue Module können auf bestehende Events reagieren, ohne andere Module zu ändern.

---

## Event-Schema

```
event_name {
  produzent: Modul das Event auslöst
  payload: Daten die mitgesendet werden
  konsumenten: Module die darauf reagieren
}
```

---

## Übersicht nach Modul

| Produzent | Event | Konsumenten |
|-----------|-------|-------------|
| application_tracking | `application.submitted` | notification |
| application_tracking | `application.status_changed` | notification |
| application_tracking | `application.accepted` | commitment |
| commitment | `commitment.submitted` | approval_window, notification |
| commitment | `commitment.withdrawn` | notification |
| approval_window | `commitment.approved` | contract, notification |
| approval_window | `commitment.rejected` | notification |
| contract | `contract.created` | notification |
| contract | `contract.print_requested` | print_service, notification |
| contract | `contract.submitted` | notification |
| contract | `contract.approved` | core (Placement), business_account, notification |
| contract | `contract.rejected` | notification |
| print_service | `contract.print_completed` | notification |
| attendance_tracking | `attendance.student_reported` | – |
| attendance_tracking | `attendance.business_confirmed` | – |
| attendance_tracking | `attendance.business_disputed` | notification |
| attendance_tracking | `attendance.missed_checkin` | notification |
| sick_reporting | `sick.reported` | notification (LK + Betrieb) |
| sick_reporting | `sick.certificate_uploaded` | notification |
| sick_reporting | `sick.certificate_confirmed` | catch_up, notification |
| sick_reporting | `sick.certificate_rejected` | notification |
| sick_reporting | `sick.certificate_deadline_missed` | notification |
| catch_up | `catch_up.proof_submitted` | notification |
| catch_up | `catch_up.approved` | core (Attendance), notification |
| catch_up | `catch_up.rejected` | notification |
| reflection_tasks | `task.assigned` | notification |
| reflection_tasks | `task.submitted` | notification |
| reflection_tasks | `task.graded` | grading, notification |
| reflection_tasks | `task.deadline_missed` | grading, notification |
| business_rating | `business_rating.submitted` | – |
| business_feedback | `business_feedback.requested` | notification |
| business_feedback | `business_feedback.submitted` | grading, notification |
| business_feedback | `business_feedback.reminder_sent` | – |
| teacher_feedback | `teacher_feedback.submitted` | – |
| teacher_feedback | `teacher_feedback.flagged` | core (Business.status) |
| grading | `grade.finalized` | notification, certificate |
| certificate | `certificate.generated` | notification |
| traffic_light | `traffic_light.changed` | notification |
| core | `placement.created` | attendance_tracking |
| core | `placement.started` | attendance_tracking, notification |
| core | `placement.completed` | reflection_tasks, business_rating, business_feedback |
| core | `placement.ending_soon` | business_feedback |
| core | `all_requirements_completed` | certificate |
| visit_scheduling | `visit.proposed` | notification |
| visit_scheduling | `visit.confirmed` | notification |
| visit_scheduling | `visit.rejected` | notification |
| visit_scheduling | `visit.alternative_proposed` | notification |
| visit_scheduling | `visit.completed` | teacher_feedback (optional prompt) |
| visit_scheduling | `visit.cancelled` | notification |
| inbox | `inbox.item_created` | notification |
| inbox | `inbox.item_completed` | – |
| batch_operations | `batch.reminders_sent` | – |
| batch_operations | `batch.grades_saved` | – |
| teacher_reminders | `reminder.triggered` | notification |
| teacher_reminders | `reminder.dismissed` | – |
| business_blacklist | `business.blocked` | notification (Admin) |
| business_blacklist | `business.unblocked` | – |
| business_blacklist | `business.override_granted` | notification (Admin) |
| business_feedback | `business_feedback.correction_requested` | inbox, notification |
| business_feedback | `business_feedback.correction_approved` | notification |
| business_feedback | `business_feedback.correction_denied` | notification |
| contract | `contract.at_school` | notification (optional) |
| grading | `grade.section_completed` | – |
| duplicate_detection | `duplicate.suggested` | – |
| duplicate_detection | `duplicate.merged` | notification |
| teacher_assignment | `assignment.created` | notification |
| teacher_assignment | `assignment.transferred` | notification |
| archival | `student.archived` | – |
| archival | `student.scheduled_deletion` | notification (Admin) |
| supervision_algorithm | `supervision.calculated` | – |
| supervision_algorithm | `supervision.assigned` | notification |
| supervision_algorithm | `supervision.manual_change` | notification |
| external_days | `external_days.recorded` | notification |
| external_days | `external_days.updated` | – |
| deadline_management | `deadline.extended` | notification |
| deadline_management | `deadline.extension_notified` | – |
| business_account | `business_account.invited` | email_templates |
| business_account | `business_account.activated` | onboarding |
| business_account | `business_account.auth_method_added` | – |
| business_account | `business_account.login` | – |
| attendance_confirmation | `attendance_confirmation.requested` | email_templates |
| attendance_confirmation | `attendance_confirmation.confirmed` | attendance_tracking |
| attendance_confirmation | `attendance_confirmation.disputed` | inbox, notification |
| attendance_confirmation | `attendance_confirmation.reminder_sent` | – |
| attendance_confirmation | `attendance_confirmation.expired` | inbox, notification |
| praktikumsdatenbank | `praktikumsdatenbank.opted_in` | – |
| praktikumsdatenbank | `praktikumsdatenbank.opted_out` | – |
| praktikumsdatenbank | `praktikumsdatenbank.profile_updated` | – |
| email_templates | `email.sent` | – |
| email_templates | `email.bounced` | notification (Admin) |
| email_templates | `email.clicked` | – |

---

## Event-Details

### application.submitted

```yaml
event: application.submitted
produzent: application_tracking
payload:
  application_id: UUID
  student_id: UUID
  business_id: UUID
  contact_type: string
konsumenten:
  - notification: "Bewerbung dokumentiert"
```

### application.accepted

```yaml
event: application.accepted
produzent: application_tracking
payload:
  application_id: UUID
  student_id: UUID
  business_id: UUID
konsumenten:
  - commitment: Erstellt neues Commitment (oder zeigt Formular)
```

---

### commitment.submitted

```yaml
event: commitment.submitted
produzent: commitment
payload:
  commitment_id: UUID
  student_id: UUID
  business_id: UUID
  period_start: date
  period_end: date
  days_count: number
konsumenten:
  - approval_window: Startet Timer (wenn aktiv)
  - notification: Benachrichtigt Lehrkraft
```

### commitment.approved

```yaml
event: commitment.approved
produzent: approval_window (oder commitment direkt wenn approval_window deaktiviert)
payload:
  commitment_id: UUID
  student_id: UUID
  business_id: UUID
  approved_by: UUID | null  # null = automatisch
  approved_automatically: boolean
konsumenten:
  - contract: Zeigt "Vertrag starten" (wenn contract aktiv)
  - core: Erstellt Placement direkt (wenn contract deaktiviert)
  - notification: Benachrichtigt Schüler
```

### commitment.rejected

```yaml
event: commitment.rejected
produzent: approval_window
payload:
  commitment_id: UUID
  student_id: UUID
  rejected_by: UUID
  rejection_reason: string
konsumenten:
  - notification: Benachrichtigt Schüler mit Grund
```

### commitment.withdrawn

```yaml
event: commitment.withdrawn
produzent: commitment
payload:
  commitment_id: UUID
  student_id: UUID
  withdrawn_reason: string
konsumenten:
  - notification: Loggt Ereignis für Lehrkraft
```

---

### contract.approved

```yaml
event: contract.approved
produzent: contract
payload:
  contract_id: UUID
  commitment_id: UUID
  student_id: UUID
  business_id: UUID
  period_start: date
  period_end: date
konsumenten:
  - core: Erstellt Placement, ändert Status
  - business_account: Erstellt/aktiviert Business-User
  - notification: Benachrichtigt Schüler + Betrieb
```

---

### sick.reported

```yaml
event: sick.reported
produzent: sick_reporting
payload:
  sick_report_id: UUID
  student_id: UUID
  placement_id: UUID
  business_id: UUID
  sick_from: date
  sick_until: date
konsumenten:
  - notification: E-Mail an Betrieb + Push an Lehrkraft
```

### sick.certificate_confirmed

```yaml
event: sick.certificate_confirmed
produzent: sick_reporting
payload:
  sick_report_id: UUID
  student_id: UUID
  days_affected: date[]
konsumenten:
  - catch_up: Markiert Tage als nachzuholen
  - notification: Benachrichtigt Schüler
  - file_cleanup: Löscht Attest-Datei (DSGVO)
```

---

### placement.completed

```yaml
event: placement.completed
produzent: core
payload:
  placement_id: UUID
  student_id: UUID
  business_id: UUID
  days_completed: number
  days_to_catch_up: number
konsumenten:
  - reflection_tasks: Weist Aufgaben zu (wenn aktiv)
  - business_rating: Zeigt Bewertungs-Prompt (wenn aktiv)
  - business_feedback: Sendet Anfrage an Betrieb (wenn aktiv)
```

### all_requirements_completed

```yaml
event: all_requirements_completed
produzent: core
payload:
  student_id: UUID
  period_id: UUID
  total_days: number
  placements: UUID[]
konsumenten:
  - certificate: Generiert Zertifikat (wenn aktiv)
  - notification: Benachrichtigt Schüler
```

---

### traffic_light.changed

```yaml
event: traffic_light.changed
produzent: traffic_light
payload:
  student_id: UUID
  previous_status: string  # green, yellow, red
  new_status: string
  days_until_start: number
konsumenten:
  - notification: Push + In-App-Banner
```

---

### grade.finalized

```yaml
event: grade.finalized
produzent: grading
payload:
  grade_id: UUID
  student_id: UUID
  period_id: UUID
  final_grade: number
konsumenten:
  - certificate: Kann Note in Zertifikat aufnehmen
  - notification: Benachrichtigt Schüler
```

---

## Event-Fluss: Beispiel Zusage → Praktikum

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Schüler meldet Zusage                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              commitment.submitted
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
   approval_window                             notification
   (startet 36h Timer)                         (an Lehrkraft)
        │
        │ ... 36h später (oder manuell) ...
        │
        ▼
              commitment.approved
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
     contract                                  notification
     (Vertrag erstellen)                       (an Schüler)
        │
        │ ... Unterschriften gesammelt ...
        │
        ▼
              contract.approved
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
      core              business_account       notification
  (Placement            (Account für          (an Schüler
   erstellen)            Betrieb)              + Betrieb)
        │
        ▼
              placement.created
                              │
                              ▼
                     attendance_tracking
                     (generiert Attendance-
                      Einträge für jeden Tag)
```

---

## Event-Details: Lehrkraft-Flow

### visit.proposed

```yaml
event: visit.proposed
produzent: visit_scheduling
payload:
  visit_id: UUID
  teacher_id: UUID
  business_id: UUID
  proposed_slots: Slot[]
  message: string              # Optionale Nachricht
konsumenten:
  - notification: E-Mail an Betrieb mit Terminauswahl
```

### visit.confirmed

```yaml
event: visit.confirmed
produzent: visit_scheduling
payload:
  visit_id: UUID
  teacher_id: UUID
  business_id: UUID
  confirmed_slot: Slot
konsumenten:
  - notification: Push an Lehrkraft
  - calendar: Termin wird eingetragen
```

### visit.completed

```yaml
event: visit.completed
produzent: visit_scheduling
payload:
  visit_id: UUID
  business_id: UUID
  visit_type: string           # in_person, phone, video
  visited_at: timestamp
konsumenten:
  - teacher_feedback: Optional Prompt "Betrieb intern bewerten?"
```

### business_feedback.correction_requested

```yaml
event: business_feedback.correction_requested
produzent: business_feedback
payload:
  feedback_id: UUID
  business_id: UUID
  student_id: UUID
  teacher_id: UUID
  requested_at: timestamp
konsumenten:
  - inbox: Erstellt Item "Korrekturanfrage"
  - notification: Push an Lehrkraft
```

### business.blocked

```yaml
event: business.blocked
produzent: business_blacklist
payload:
  blacklist_entry_id: UUID
  business_id: UUID
  school_id: UUID
  reason: string
  blocked_by: UUID
konsumenten:
  - notification: Info an alle Admins der Schule
```

---

## Event-Details: Admin-Flow

### supervision.calculated

```yaml
event: supervision.calculated
produzent: supervision_algorithm
payload:
  calculation_id: UUID
  school_id: UUID
  period_id: UUID
  mode: string                    # hours_based, equal, manual
  teachers: TeacherCapacity[]     # LK mit berechneter Kapazität
konsumenten:
  - (internes Event, keine Konsumenten)
```

### supervision.assigned

```yaml
event: supervision.assigned
produzent: supervision_algorithm
payload:
  school_id: UUID
  period_id: UUID
  assignments: Assignment[]       # Schüler-LK-Zuweisungen
  assigned_by: UUID               # Admin der Zuweisung gestartet hat
  auto_assigned_count: number
  manual_assigned_count: number
konsumenten:
  - notification: Info an alle betroffenen Lehrkräfte
```

### supervision.manual_change

```yaml
event: supervision.manual_change
produzent: supervision_algorithm
payload:
  student_id: UUID
  old_teacher_id: UUID
  new_teacher_id: UUID
  changed_by: UUID                # Admin
  reason: string                  # Optional
konsumenten:
  - notification: Info an alte + neue Lehrkraft
```

### external_days.recorded

```yaml
event: external_days.recorded
produzent: external_days
payload:
  record_id: UUID
  student_id: UUID
  days_count: number
  school_year: string
  source_school_name: string
  created_by: UUID                # Admin
konsumenten:
  - notification: Info an betreuende Lehrkraft
```

### deadline.extended

```yaml
event: deadline.extended
produzent: deadline_management
payload:
  extension_id: UUID
  student_id: UUID
  deadline_type: string           # task, certificate, grading
  reference_id: UUID
  original_deadline: date
  extended_deadline: date
  reason: string
  extended_by: UUID               # Admin oder LK
konsumenten:
  - notification: Info an Schüler (optional an LK)
```

### business.override_granted

```yaml
event: business.override_granted
produzent: business_blacklist
payload:
  override_id: UUID
  business_id: UUID
  student_id: UUID
  teacher_id: UUID
  justification: string
konsumenten:
  - notification: Info an Admin
```

### reminder.triggered

```yaml
event: reminder.triggered
produzent: teacher_reminders
payload:
  reminder_id: UUID
  teacher_id: UUID
  type: string                 # task_overdue, deadline_warning, etc.
  reference_ids: UUID[]
  message: string
konsumenten:
  - notification: Push/E-Mail an Lehrkraft (nach Preferences)
```

---

## Event-Fluss: Beispiel Betriebsbesuch planen

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Vertrag wird bestätigt                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              contract.approved
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
   visit_scheduling                             (andere...)
   (Besuch kann geplant werden)
        │
        │ ... Betrieb gibt Verfügbarkeit an ...
        │
        │ ... Lehrkraft schlägt Termin vor ...
        │
        ▼
              visit.proposed
                              │
                              ▼
                         notification
                         (E-Mail an Betrieb)
                              │
        │ ... Betrieb bestätigt ...
        │
        ▼
              visit.confirmed
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
   notification                                 calendar
   (Push an LK)                                 (Eintrag)
        │
        │ ... Besuch durchgeführt ...
        │
        ▼
              visit.completed
                              │
                              ▼
                     teacher_feedback
                     (Optional: "Betrieb
                      intern bewerten?")
```

---

## Event-Fluss: Beispiel Korrekturanfrage

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Betrieb hat Beurteilung abgesendet                           │
└─────────────────────────────────────────────────────────────────┘
                              │
        │ ... Betrieb möchte korrigieren ...
        │
        ▼
              business_feedback.correction_requested
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
      inbox                                    notification
   (Item: Korrektur-                           (Push an LK)
    anfrage)
        │
        │ ... Lehrkraft gibt frei oder lehnt ab ...
        │
        ▼
              <Lehrkraft entscheidet>
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                           ▼
   Freigegeben                                  Abgelehnt
        │                                           │
        ▼                                           ▼
   notification                                notification
   (E-Mail an Betrieb                          (Info an Betrieb)
    mit Bearbeiten-Link)
```

---

## Event-Details: Betrieb-Flow

### business_account.invited

```yaml
event: business_account.invited
produzent: business_account
payload:
  invite_id: UUID
  business_id: UUID
  email: string
  student_id: UUID
  placement_id: UUID
  expires_at: timestamp
konsumenten:
  - email_templates: Sendet Einladungs-E-Mail
```

### business_account.activated

```yaml
event: business_account.activated
produzent: business_account
payload:
  business_user_id: UUID
  business_id: UUID
  auth_method: string               # magic_link, password
konsumenten:
  - onboarding: Startet Betrieb-Onboarding (3 Screens)
```

### attendance_confirmation.requested

```yaml
event: attendance_confirmation.requested
produzent: attendance_confirmation
payload:
  request_id: UUID
  business_id: UUID
  student_id: UUID
  placement_id: UUID
  week_start: date
  week_end: date
  days: AttendanceDay[]
konsumenten:
  - email_templates: Sendet Anwesenheits-Anfrage E-Mail
```

### attendance_confirmation.confirmed

```yaml
event: attendance_confirmation.confirmed
produzent: attendance_confirmation
payload:
  request_id: UUID
  business_id: UUID
  student_id: UUID
  confirmed_days: date[]
  confirmed_by: UUID
konsumenten:
  - attendance_tracking: Markiert Tage als bestätigt
```

### attendance_confirmation.disputed

```yaml
event: attendance_confirmation.disputed
produzent: attendance_confirmation
payload:
  request_id: UUID
  business_id: UUID
  student_id: UUID
  disputed_days: date[]
  dispute_reasons: string[]
konsumenten:
  - inbox: Erstellt Item "Anwesenheits-Widerspruch"
  - notification: Push an Lehrkraft
```

### attendance_confirmation.expired

```yaml
event: attendance_confirmation.expired
produzent: attendance_confirmation
payload:
  request_id: UUID
  business_id: UUID
  student_id: UUID
  week_start: date
  days_without_response: number
konsumenten:
  - inbox: Erstellt Item "Anwesenheit nicht bestätigt"
  - notification: E-Mail an Lehrkraft
```

---

## Event-Fluss: Beispiel Betrieb-Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Vertrag bestätigt (oder "Bei Schulleitung")                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              contract.approved / contract.at_school
                              │
                              ▼
                     business_account
                     (Einladung erstellen)
                              │
                              ▼
              business_account.invited
                              │
                              ▼
                     email_templates
                     (Einladungs-E-Mail senden)
                              │
                              │ ... Betrieb klickt Link ...
                              │
                              ▼
              business_account.activated
                              │
                              ▼
                       onboarding
                       (3 Screens zeigen)
                              │
                              ▼
                     Betrieb im Dashboard
```

---

## Event-Fluss: Beispiel Wöchentliche Anwesenheitsbestätigung

```
┌─────────────────────────────────────────────────────────────────┐
│ Freitag 18:00 (während Praktikum)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              attendance_confirmation.requested
                              │
                              ▼
                     email_templates
                     (Anfrage-E-Mail an Betrieb)
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
   Betrieb reagiert                            Keine Reaktion
        │                                           │
   ┌────┴────┐                                      │
   ▼         ▼                                      │
Bestätigt  Widerspruch                              │
   │         │                                      │
   ▼         ▼                                      │
confirmed  disputed                            Nach 3 Tagen:
   │         │                                reminder_sent
   ▼         ▼                                      │
attendance inbox +                                  │
_tracking  notification                        Nach 7 Tagen:
                                                   │
                                                   ▼
                                               expired
                                                   │
                                              ┌────┴────┐
                                              ▼         ▼
                                           inbox   notification
                                        (Eskalation an LK)
```

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version aus FLOW-SCHUELER.md |
| 2024-12-10 | NEU: Events aus FLOW-LEHRKRAFT.md (visit_scheduling, inbox, etc.) |
| 2024-12-10 | NEU: Event-Flüsse für Betriebsbesuch und Korrekturanfrage |
| 2024-12-10 | NEU: Events aus ENTSCHEIDUNGEN-LEHRKRAFT.md (contract.at_school, Korrektur-Events, etc.) |
| 2024-12-10 | NEU: Events für duplicate_detection, teacher_assignment, archival |
| 2024-12-10 | NEU: Events aus FLOW-BETRIEB.md (business_account, attendance_confirmation, praktikumsdatenbank, email_templates) |
| 2024-12-10 | NEU: Event-Flüsse für Betrieb-Onboarding und Wöchentliche Anwesenheitsbestätigung |
| 2024-12-10 | NEU: Admin-Events (supervision_algorithm, external_days, deadline_management) |
