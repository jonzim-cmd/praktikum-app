# Vollständigkeitsprüfung: Module vs. Flows

> Systematischer Abgleich aller Features aus den FLOW- und ENTSCHEIDUNGEN-Dokumenten gegen MODULE.md und EVENTS.md

**Stand:** 2024-12-10 (aktualisiert nach Admin-Flow)

---

## Legende

- ✅ Vollständig in MODULE.md dokumentiert
- ⚠️ Teilweise dokumentiert (Details fehlen)
- ❌ Fehlt komplett
- 🔍 Zu prüfen

---

## FLOW-SCHUELER.md + ENTSCHEIDUNGEN-SCHUELER.md

### Phase 1: Bewerbung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Bewerbung dokumentieren | `application_tracking` | ✅ | |
| Kontaktarten (E-Mail, Anruf, etc.) | `application_tracking` | ✅ | In Entität |
| Nachweis-Upload (Screenshot) | `application_tracking` | ✅ | `proof_file_id` |
| Status-Verwaltung | `application_tracking` | ✅ | |
| Warnung "schwer verifizierbar" | `application_tracking` | ✅ | `show_verifiability_warning` |
| Erinnerung nach 2 Wochen "Offen" | `application_tracking` | ✅ | `reminder_after_days` |
| Betrieb-Eingabe Autocomplete | `duplicate_detection` | ✅ | Photon API |
| Duplikaterkennung | `duplicate_detection` | ✅ | Fuzzy-Match |

### Phase 1b: Zusage

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Zusage erfassen | `commitment` | ✅ | |
| Zeitraum (noch nicht bekannt) | `commitment` | ✅ | `period_known` |
| E-Mail-Warnung Sammel-Adressen | `commitment` | ✅ | `contact_email_is_generic` |
| 36h Einspruchsfenster | `approval_window` | ✅ | |
| Wochenenden pausieren | `approval_window` | ✅ | `pause_on_weekends` |
| Ferien pausieren NICHT | `approval_window` | ✅ | `pause_on_holidays: false` |
| Einspruch mit Grund | `approval_window` | ✅ | `rejection_reasons` |
| Zusage zurückziehen | `commitment` | ✅ | `withdrawn`, Event |
| Zwei Zusagen verhindern | `commitment` | ✅ | `prevent_overlapping` |
| Teilzusage (mehrere Blöcke) | `commitment` | ✅ | CommitmentCoverage, Dringlichkeitsregeln |

### Phase 2: Vertrag

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Daten prüfen vor PDF | `contract` | ✅ | Implizit |
| PDF generieren | `contract` | ✅ | `generated_pdf_file_id` |
| Druck beantragen | `print_service` | ✅ | |
| "Druck erledigt" markieren | `print_service` | ✅ | Event |
| Unterschriften sammeln | `contract` | ✅ | `required_signatures` |
| Schule unterschreibt zuletzt | `contract` | ✅ | `school_signs_last` |
| Abgabe (physisch/digital) | `contract` | ✅ | `submitted_type` |
| In-App Scan | `contract` | ✅ | In Parameter erwähnt |
| Status "Bei Schulleitung" | `contract` | ✅ | `at_school` Status |
| Erinnerung Schulleitung | `contract` | ✅ | `at_school_reminder_days` |
| Ablehnung mit Grund | `contract` | ✅ | `rejection_reason` |

### Phase 3: Praktikum

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Täglicher Check-in | `attendance_tracking` | ✅ | |
| "Ich war heute da" | `attendance_tracking` | ✅ | Event |
| Erinnerung bei fehlendem Check-in | `attendance_tracking` | ✅ | `checkin_reminder_time` |
| Krankmeldung | `sick_reporting` | ✅ | |
| Krankheitszeitraum wählen | `sick_reporting` | ✅ | `sick_from`, `sick_until` |
| Attest hochladen | `sick_reporting` | ✅ | `certificate_file_id` |
| Attest-Frist | `sick_reporting` | ✅ | `certificate_deadline_days` |
| Attest-Löschung (DSGVO) | `sick_reporting` | ✅ | In Event erwähnt |
| E-Mail an Betrieb bei Krankheit | `sick_reporting` | ✅ | Event |
| Fortschrittsanzeige | `core` | ✅ | In Kern-Entitäten |

### Phase 4: Nachbereitung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Lernaufgaben | `reflection_tasks` | ✅ | |
| Deadline-Verwaltung | `reflection_tasks` | ✅ | `deadline` |
| Betrieb bewerten (anonym) | `business_rating` | ✅ | |
| Zertifikat herunterladen | `certificate` | ✅ | |
| Vorläufiger Nachweis | `certificate` | ✅ | `type` (complete/provisional) |

### Phase 5: Nachholen

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Nachweisbogen herunterladen | `catch_up` | ✅ | `proof_template_file_id` |
| Nachweis hochladen | `catch_up` | ✅ | `proof_file_id` |
| Lehrkraft prüft | `catch_up` | ✅ | Status-Workflow |
| LK + Admin können beide genehmigen | `catch_up` | ✅ | Schule entscheidet wer in Praxis |

### Dashboard/UI

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Zeitdruck-Ampel | `traffic_light` | ✅ | |
| Phasen-Anzeige | `core` | ✅ | Implizit |
| Onboarding | `onboarding` | ✅ | |

---

## FLOW-LEHRKRAFT.md + ENTSCHEIDUNGEN-LEHRKRAFT.md

### Dashboard

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Aufgaben-Queue | `inbox` | ✅ | |
| Sortierung nach Dringlichkeit | `inbox` | ✅ | `priority` |
| Schüler-Ampel sichtbar | `traffic_light` | ✅ | |
| Druckanfragen-Queue | `print_service` + `inbox` | ✅ | |

### Benachrichtigungen

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Push/E-Mail Einstellungen | `notification_settings` | ✅ | |
| Wöchentliche Zusammenfassung | `notification_settings` | ✅ | `weekly_summary` |
| Inhalt mit Details | `email_templates` | ⚠️ | **Für Lehrkraft nicht explizit** |

### Genehmigung/Einspruch

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| 36h Fenster | `approval_window` | ✅ | |
| Einspruch mit Grund | `approval_window` | ✅ | |
| Wochenend-Pause konfigurierbar | `approval_window` | ✅ | |

### Vertragsprozess (LK-Sicht)

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Status-Übersicht | `contract` | ✅ | |
| Erinnerungen an LK | `teacher_reminders` | ✅ | |
| Upload-Optionen | `contract` | ✅ | |

### Anwesenheit

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Zwei-Stufen-System anzeigen | `attendance_tracking` | ✅ | |
| Widerspruch anzeigen | `attendance_confirmation` | ✅ | |

### Betriebsbesuche

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Verfügbarkeits-Übersicht | `visit_scheduling` | ✅ | |
| Greedy-Algorithmus | `visit_scheduling` | ✅ | |
| Termin vorschlagen | `visit_scheduling` | ✅ | |
| Termin absagen | `visit_scheduling` | ✅ | Event |
| Haken "Besuch durchgeführt" | `visit_scheduling` | ✅ | |
| Telefonisch/Video als Option | `visit_scheduling` | ✅ | `visit_type` |

### Bewertung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Zentrale Bewertungs-Akte | `grading` | ✅ | |
| Abschnitte (Bewerbung, etc.) | `grading` | ✅ | `sections` |
| Mehrere beurteilende LK | `grading` | ✅ | `TeacherGradingRole` |
| Rollen-Zuweisung (3 Ebenen) | `grading` + `teacher_assignment` | ✅ | |
| Batch-Modus | `batch_operations` | ✅ | |
| Bewertungs-Deadline | `grading` | ✅ | `deadline` |
| Ohne Betriebsfeedback benoten | `grading` | ✅ | `fallback_without_business` |

### Betrieb-Feedback (intern)

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Sterne-Bewertung | `teacher_feedback` | ✅ | |
| Interne Notizen | `teacher_feedback` | ✅ | |
| "Auffällig" markieren | `teacher_feedback` | ✅ | |
| Blacklist durch Admin | `business_blacklist` | ✅ | |
| Override durch LK | `business_blacklist` | ✅ | |

### Betreuungswechsel

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Neuzuweisung | `teacher_assignment` | ✅ | |
| Historie bleibt erhalten | `teacher_assignment` | ✅ | |

### Archivierung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Account archivieren | `archival` | ✅ | |
| DSGVO-Löschung | `archival` | ✅ | |

### Erinnerungen

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| 6 Trigger | `teacher_reminders` | ✅ | |
| Alle abschaltbar | `teacher_reminders` | ✅ | |

---

## FLOW-ADMIN.md + ENTSCHEIDUNGEN-ADMIN.md

### Benutzerverwaltung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Import aus Schulverwaltung | `core` | ✅ | CSV/Excel Import |
| Schüler manuell anlegen | `core` | ✅ | Admin-Funktion |
| LK manuell anlegen | `core` | ✅ | Admin-Funktion |
| Admin-Rollen (3 Stufen) | `core` | ✅ | teacher, admin, restricted_admin, superadmin |
| Primary Admin | `core` | ✅ | `is_primary_admin` |

### Betreuungszuweisung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Algorithmus (Kapazität) | `supervision_algorithm` | ✅ | NEU |
| Prioritäten (ÜU→KL→Rest) | `supervision_algorithm` | ✅ | Prio 1/2/3 |
| Manuelle Zuweisung | `teacher_assignment` | ✅ | |
| Ausschluss von Betreuung | `teacher_assignment` | ✅ | `excluded_from_supervision` |

### Einstellungen

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Deadline-Verwaltung global | `deadline_management` | ✅ | NEU |
| Deadline einzeln verlängern | `deadline_management` | ✅ | NEU |
| Bewertungs-Rollen Default | `grading` | ✅ | `grading_role_default` |
| Bewertungs-Rollen 3-Ebenen | `grading` | ✅ | Schul-Default → LK → Selbst |
| Betrieb-Account-Trigger | `business_account` | ✅ | `business_account_trigger` |
| Wiederholer Tage anrechnen | `archival` | ✅ | `count_previous_days_on_repeat` |

### Sonderfälle

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Externe Praktikumstage | `external_days` | ✅ | NEU (Quereinsteiger) |
| Sitzenbleiben | `archival` | ✅ | Wiederholer-Handling |
| Nachholungen genehmigen | `catch_up` | ✅ | LK + Admin beide möglich |

### Reporting

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Fortschritts-Übersicht | `core` | ✅ | Implizit |
| Export-Funktionen | `core` | ⚠️ | Noch nicht detailliert dokumentiert |

---

## FLOW-BETRIEB.md + ENTSCHEIDUNGEN-BETRIEB.md

### Account & Auth

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Magic Link | `business_account` | ✅ | |
| Passwort-Option | `business_account` | ✅ | |
| Passkey/WebAuthn | `business_account` | ✅ | |
| E-Mail-Verifizierung | `business_account` | ✅ | |
| Browser 90 Tage vertraut | `business_account` | ✅ | `browser_trust_days` |
| "Problem melden" Flow | `business_account` | ✅ | `EmailCorrectionRequest` Entität |
| Link-Gültigkeit | `business_account` | ✅ | Dokumentiert (System vs. Kollegen-Invite) |
| Account-Aktivitäts-Tracking | `business_account` | ✅ | `BusinessActivity` Entität, `inactivity_warning_days` |
| Kollegen selbst einladen | `business_account` | ✅ | `colleague_invite_expires_days` |

### Onboarding

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| 3 Screens | `onboarding` | ✅ | |

### Dashboard

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Praktikanten-Liste | `core` | ✅ | Implizit über Placement-Relation |
| Aufgaben anzeigen | `core` | ✅ | Implizit über Status-Tracking |
| Historie (ohne Namen) | `praktikumsdatenbank` | ✅ | Datenschutz: Nur aggregierte Daten |

### Besuchstermine

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Verfügbarkeit angeben (2h-Slots) | `visit_scheduling` | ✅ | |
| Schnellauswahl | `visit_scheduling` | ✅ | UI-Detail (Implementierung) |
| Terminvorschlag annehmen/ablehnen | `visit_scheduling` | ✅ | |
| Termin absagen | `visit_scheduling` | ✅ | |
| Erinnerungen (3→5→7 Tage) | `visit_scheduling` + Erinnerungs-Schema | ✅ | Zentrales Schema dokumentiert |

### Krankmeldung (Info)

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| E-Mail erhalten | `sick_reporting` | ✅ | Event |
| Im Dashboard sehen | `sick_reporting` | ✅ | |

### Anwesenheit

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Wöchentliche Bestätigung | `attendance_confirmation` | ✅ | |
| KEINE stillschweigende Bestätigung | `attendance_confirmation` | ✅ | |
| Widerspruch mit Grund | `attendance_confirmation` | ✅ | |
| Erinnerungen (3→5→7 Tage) | `attendance_confirmation` | ✅ | Zentrales Schema |
| Bei mehreren: Sammel-Ansicht | `attendance_confirmation` | ✅ | Dokumentiert mit UI-Mockup |

### Beurteilung

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Formular ausfüllen | `business_feedback` | ✅ | |
| Auto-Save | `business_feedback` | ✅ | `auto_save`, `auto_save_interval_seconds` |
| "Speichern & Nächster" | `business_feedback` | ✅ | Sammel-Ansicht dokumentiert |
| Korrekturanfrage | `business_feedback` | ✅ | |
| Erinnerungen (3→7→10 Tage) | `business_feedback` | ✅ | Parameter |

### Praktikumsdatenbank

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Opt-in Frage | `praktikumsdatenbank` | ✅ | |
| Opt-out möglich | `praktikumsdatenbank` | ✅ | |
| Profil-Erstellung | `praktikumsdatenbank` | ✅ | |

### E-Mails

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| 6 E-Mail-Typen (Betrieb) | `email_templates` | ✅ | |
| 4 E-Mail-Typen (Lehrkraft) | `email_templates` | ✅ | NEU hinzugefügt |
| Sammel-Mails | `email_templates` | ✅ | `batch_similar_emails` |
| Footer "Feedback" | `email_templates` | ✅ | `include_feedback_link` |

### Ansprechpartner

| Feature | Modul | Status | Anmerkung |
|---------|-------|--------|-----------|
| Mehrere pro Betrieb | `business_account` | ✅ | `BusinessUser` + Kollegen-Invite |
| Ansprechpartner wechselt | `business_account` | ✅ | Flow dokumentiert |
| Selbst einladen | `business_account` | ✅ | `colleague_invite_expires_days` |

---

## Identifizierte Lücken

### ✅ Geschlossene Lücken (diese Session)

Die folgenden Lücken wurden in dieser Prüfung geschlossen:

| # | Lücke | Status | Wo dokumentiert |
|---|-------|--------|-----------------|
| 1 | "Problem melden" Flow | ✅ | `business_account` – `EmailCorrectionRequest` |
| 2 | Sammel-Ansicht Anwesenheit | ✅ | `attendance_confirmation` – UI-Mockup |
| 3 | Auto-Save Beurteilung | ✅ | `business_feedback` – `auto_save` Parameter |
| 4 | Ansprechpartner-Verwaltung | ✅ | `business_account` – `BusinessUser` + Kollegen-Invite |
| 5 | Account-Aktivitäts-Tracking | ✅ | `business_account` – `BusinessActivity` Entität |
| 6 | Erinnerungs-Schema | ✅ | MODULE.md – "Zentrales Erinnerungs-Schema" |
| 7 | E-Mail Footer | ✅ | `email_templates` – `include_feedback_link` |
| 8 | Sammel-Mails | ✅ | `email_templates` – `batch_similar_emails` |
| 9 | Lehrkraft-E-Mail-Templates | ✅ | `email_templates` – 4 neue Typen |
| 10 | Link-Gültigkeit | ✅ | `business_account` – Tabelle Link-Gültigkeit |

### ⚠️ Noch offene Lücken

| # | Lücke | Priorität | Empfehlung |
|---|-------|-----------|------------|
| 1 | **Export-Funktionen** | Mittel | Bei Implementierung dokumentieren |
| 2 | **Benachrichtigungs-Details für LK** | Gering | In `notification_settings` |

### ℹ️ Hinweise für spätere Implementierung

Diese Punkte sind konzeptionell klar, Details werden bei Implementierung festgelegt:

- **Betrieb-Dashboard**: Kein separates Modul nötig, da views/UI
- **Schnellauswahl Verfügbarkeit**: UI-Detail für Frontend
- **Export-Formate**: CSV/Excel, Details bei Implementierung

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Vollständigkeitsprüfung erstellt |
| 2024-12-10 | Teilzusage-Logik in commitment-Modul ergänzt (CommitmentCoverage, Dringlichkeitsregeln) → ✅ |
| 2024-12-10 | **ADMIN-FLOW:** Neue Sektion FLOW-ADMIN.md + ENTSCHEIDUNGEN-ADMIN.md |
| 2024-12-10 | Alle kritischen Lücken geschlossen (10 von 12) |
| 2024-12-10 | Aktualisiert: business_account, attendance_confirmation, business_feedback, email_templates |
| 2024-12-10 | NEU: Zentrales Erinnerungs-Schema in MODULE.md |
