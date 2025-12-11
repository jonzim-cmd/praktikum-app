# Profile

> Vordefinierte Kombinationen aus Modulen + Parametern für verschiedene Schularten.
> Profile machen das Onboarding neuer Schulen einfach.

---

## Profil-Konzept

```
┌─────────────────────────────────────────────────────────────────┐
│  PROFIL                                                         │
│  ─────────────────────────────────────────────────────────────  │
│  • Aktiviert bestimmte Module                                  │
│  • Setzt Default-Parameter                                     │
│  • Kann von Schule überschrieben werden                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCHUL-EINSTELLUNGEN                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • Basis: Profil X                                             │
│  • Überschreibungen: { param_a: anderer_wert }                 │
│  • Effektiv = Profil + Überschreibungen                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Profil: Wirtschaftsschule Bayern (Pilot)

> **Hinweis:** Die Wirtschaftsschule Bayern gibt es in zwei Varianten mit unterschiedlichen Praktikumsanforderungen (§15 WSO Bayern):
> - **Zweistufig** (Jgst. 10 + 11): 15 Tage Praktikum
> - **Drei-/Vierstufig** (Jgst. 8-10): 20 Tage Praktikum
>
> Das System verwendet **ein Profil** mit `required_days` als **Schul-überschreibbaren Parameter**.
> Jede Schule setzt beim Onboarding ihren korrekten Wert (15 oder 20).

```yaml
id: ws_bayern
name: "Wirtschaftsschule Bayern"
description: "Pflichtpraktikum mit Benotung, mind. 2 Betriebe (15 oder 20 Tage je nach Schulform)"
state: BY
school_types: [ws]

# ============================================================
# KERN-PARAMETER
# ============================================================
# Hinweis: required_days ist ein Schul-überschreibbarer Parameter!
# - Zweistufige WS: 15 Tage (Schule setzt in settings: required_days: 15)
# - Drei-/Vierstufige WS: 20 Tage (Default)

core:
  required_days: 20                 # Default für Drei-/Vierstufig, Schule kann auf 15 setzen
  min_businesses: 2
  max_days_per_business: 15
  allow_parallel_placements: false
  allow_weekend_internship: false   # Während Praktikum: NEIN (muss während Schulzeit sein)
  allow_weekend_catch_up: true      # Beim Nachholen: JA (außerhalb Schulzeit erlaubt)

terms:
  internship: "Praktikum"
  placement: "Praktikumsplatz"
  business: "Betrieb"
  contract: "Vertrag"
  commitment: "Zusage"

# ============================================================
# MODULE
# ============================================================

modules:

  # --- Bewerbung & Zusage ---

  application_tracking:
    enabled: true
    reminder_after_days: 14
    proof_required_for: ["email", "mail"]
    show_verifiability_warning: true

  commitment:
    enabled: true  # Immer aktiv
    warn_on_generic_email: true
    period_required: false
    allow_withdraw: true
    prevent_overlapping: true
    min_block_days: 5               # Mindest-Blockgröße bei Teilzusagen
    allow_partial_commitments: true # Erlaubt Zusagen für weniger als alle erforderlichen Tage

  approval_window:
    enabled: true
    wait_hours: 36
    pause_on_weekends: true
    pause_on_holidays: false

  traffic_light:
    enabled: true
    green_threshold_days: 90
    yellow_threshold_days: 30
    red_threshold_days: 14
    notify_on_change: true

  # --- Vertrag ---

  contract:
    enabled: true
    required_signatures: ["parent", "business", "school"]
    school_signs_last: true
    allow_digital_submission: true    # In-App Scan mit Kantenerkennung möglich
    at_school_reminder_days: 7        # Nach X Tagen bei Schulleitung: Erinnerung an LK
    business_account_trigger: "at_school"  # Wann Betrieb-Account erstellen: "at_school" oder "approved"

  print_service:
    enabled: true
    pickup_location: "Sekretariat"
    notify_on_ready: true

  # --- Praktikum ---

  attendance_tracking:
    enabled: true
    checkin_reminder_time: "18:00"
    business_confirmation_day: "friday"
    business_confirmation_deadline_days: 7

  sick_reporting:
    enabled: true
    certificate_deadline_days: 3
    auto_delete_after_confirmation: true
    mark_as_catch_up: true
    notify_business: true
    notify_teacher: true

  catch_up:
    enabled: true
    allow_different_business: true
    proof_template_enabled: true
    # reviewer entfernt: Sowohl LK als auch Admin können genehmigen (siehe MODULE.md)

  # --- Nachbereitung ---

  reflection_tasks:
    enabled: true
    reminder_days_before_deadline: 3
    allow_late_submission: false
    tasks:
      - name: "Erwartungen vor dem Praktikum"
        type: form
        deadline_type: relative
        deadline_days_after_end: -7  # VOR dem Praktikum
        is_required: true
        points_max: 5
      - name: "Beobachtungsauftrag"
        type: form
        deadline_type: relative
        deadline_days_after_end: 7
        is_required: true
        points_max: 5
      - name: "Reflexion nach dem Praktikum"
        type: form
        deadline_type: relative
        deadline_days_after_end: 7
        is_required: true
        points_max: 5

  business_rating:
    enabled: true
    is_anonymous: true
    min_ratings_to_show: 3
    rating_categories: ["supervision", "learning", "atmosphere"]

  certificate:
    enabled: true
    allow_preliminary: true
    include_school_logo: true
    include_business_names: true
    include_total_days: true
    include_grade: false

  # --- Bewertung ---

  business_feedback:
    enabled: true
    request_days_before_end: 3
    reminder_after_days: 5
    auto_close_after_days: 14
    rating_criteria:
      - punctuality
      - reliability
      - independence
      - teamwork
      - engagement
      - friendliness

  teacher_feedback:
    enabled: true
    prompt_after_visit: true
    flag_threshold: 2

  grading:
    enabled: true
    scale: "1-6"
    allow_override: true
    require_business_feedback: false
    components:
      application_process:
        weight: 0.20
        source: teacher_assessment
      tasks:
        weight: 0.30
        source: task_submissions
      business_feedback:
        weight: 0.30
        source: business_feedback
        fallback: teacher_impression
      teacher_impression:
        weight: 0.20
        source: teacher_assessment

# ============================================================
# ADMIN-KONFIGURATION
# ============================================================
# Diese Parameter werden beim Schul-Onboarding gesetzt.
# Sie sind nicht im Profil fixiert, sondern Schul-individuell.

admin_config:
  # Betreuungs-Algorithmus
  supervision:
    mode: "hours_based"           # hours_based, equal, manual
    prio_1_enabled: true          # ÜU-LK zuerst
    prio_2_enabled: true          # Klassenleitung
    min_capacity_threshold: 2     # Mindest-Stunden für Auto-Zuweisung

  # Bewertungs-Rollen (betreuend vs. beurteilend)
  grading_roles:
    role_default: "both"          # supervising, assessing, both
    allow_teacher_override: true  # LK kann selbst ändern

  # Wiederholer
  archival:
    count_previous_days_on_repeat: false   # Default: Vorherige Tage NICHT anrechnen

  # Deadlines
  deadlines:
    certificate_deadline_days: 3           # Attest-Frist in Tagen
    grading_deadline: null                 # Datum für Noteneingabe, von Admin gesetzt
    allow_teacher_extension: true          # LK darf Fristen verlängern
    max_extension_days: 30                 # Maximale Verlängerung in Tagen
```

---

## Profil: Mittelschule Bayern (Entwurf)

> Basierend auf ISB-Handreichung "Betriebspraktikum – komplett und sicher"

```yaml
id: ms_bayern
name: "Mittelschule Bayern"
description: "2 Wochen Pflichtpraktikum in Jgst. 8, keine Benotung"
state: BY
school_types: [ms]

# ============================================================
# KERN-PARAMETER
# ============================================================

core:
  required_days: 10
  min_businesses: 1              # Nur ein Betrieb nötig
  max_days_per_business: null    # Kein Limit
  allow_parallel_placements: false
  allow_weekend_internship: false
  allow_weekend_catch_up: true

terms:
  internship: "Betriebspraktikum"
  placement: "Praktikumsplatz"
  business: "Betrieb"
  contract: "Praktikumsvereinbarung"
  commitment: "Zusage"

# ============================================================
# MODULE
# ============================================================

modules:

  application_tracking:
    enabled: true
    reminder_after_days: 14
    proof_required_for: []       # Weniger streng
    show_verifiability_warning: false

  commitment:
    enabled: true
    warn_on_generic_email: false
    period_required: false
    allow_withdraw: true
    prevent_overlapping: true

  approval_window:
    enabled: false               # Kein Einspruchsfenster nötig

  traffic_light:
    enabled: true
    green_threshold_days: 60
    yellow_threshold_days: 21
    red_threshold_days: 7

  contract:
    enabled: true
    required_signatures: ["parent", "business"]  # Schule unterschreibt nicht
    school_signs_last: false
    allow_digital_submission: true

  print_service:
    enabled: true

  attendance_tracking:
    enabled: true
    checkin_reminder_time: "18:00"
    business_confirmation_day: "friday"
    business_confirmation_deadline_days: 7

  sick_reporting:
    enabled: true
    certificate_deadline_days: 3
    auto_delete_after_confirmation: true
    mark_as_catch_up: true

  catch_up:
    enabled: true
    allow_different_business: true

  reflection_tasks:
    enabled: true
    tasks:
      - name: "Praktikumsmappe"
        type: file_upload
        deadline_type: relative
        deadline_days_after_end: 14
        is_required: true

  business_rating:
    enabled: true
    is_anonymous: true
    min_ratings_to_show: 3

  certificate:
    enabled: true
    allow_preliminary: true

  # --- Keine Benotung ---

  business_feedback:
    enabled: false               # Kein Betriebs-Feedback

  teacher_feedback:
    enabled: true                # Internes Feedback schon

  grading:
    enabled: false               # Keine Benotung
```

---

## Profil-Vergleich

| Feature | WS Bayern | MS Bayern |
|---------|-----------|-----------|
| Tage | **15 oder 20** (je nach Schulform) | 10 |
| Betriebe min. | 2 | 1 |
| Einspruchsfenster | 36h | Nein |
| Formeller Vertrag | Ja (3 Unterschriften) | Ja (2 Unterschriften) |
| Benotung | Ja | Nein |
| Betriebs-Feedback | Ja | Nein |
| Lernaufgaben | 3 Formulare | Praktikumsmappe |
| Teilzusagen | Ja (min. 5 Tage pro Block) | Ja |

---

## Custom-Profil

Schulen können auch ein Custom-Profil verwenden:

```yaml
id: custom
name: "Individuell"
description: "Alle Module einzeln konfigurierbar"

# Schule wählt selbst:
# - Welche Module aktiv
# - Welche Parameter
```

---

## Profil-Überschreibung durch Schule

### Beispiel: Zweistufige Wirtschaftsschule

```yaml
# In school.settings:

school:
  id: "..."
  name: "Städtische Wirtschaftsschule München"
  profile_id: ws_bayern
  school_type_variant: "zweistufig"   # Für Dokumentation/Klarheit

  # Überschreibungen:
  settings:
    core:
      required_days: 15           # Zweistufig: 15 statt 20 Tage
    modules:
      approval_window:
        wait_hours: 48            # Längeres Fenster
      print_service:
        pickup_location: "Raum 101"
```

**Effektiv:** Profil ws_bayern + Überschreibungen

### Beispiel: Drei-/Vierstufige Wirtschaftsschule

```yaml
school:
  id: "..."
  name: "Staatliche Wirtschaftsschule Nürnberg"
  profile_id: ws_bayern
  school_type_variant: "vierstufig"

  # Keine required_days-Überschreibung nötig, da Default = 20
  settings:
    modules:
      print_service:
        pickup_location: "Sekretariat Haus B"
```

---

## Implementierungshinweise (Admin-Konfiguration)

> Diese Sektion enthält Notizen für die spätere Implementierung.

### Profil vs. Schul-Einstellung vs. Admin-Konfiguration

```
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 1: PROFIL (vom System vorgegeben)                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Definition durch Entwickler/Superadmin                       │
│  • Gilt für Schulart/Bundesland                                 │
│  • Schule kann NICHT ändern                                     │
│  • Beispiel: Schulart-spezifische Lernaufgaben                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 2: SCHUL-EINSTELLUNG (Admin überschreibt Profil)         │
│  ─────────────────────────────────────────────────────────────  │
│  • Admin konfiguriert im Dashboard                              │
│  • Überschreibt Profil-Defaults                                 │
│  • Beispiel: wait_hours, pickup_location                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 3: INDIVIDUELLE ANPASSUNG (pro Schüler/LK/Fall)          │
│  ─────────────────────────────────────────────────────────────  │
│  • Admin oder LK kann für Einzelfälle überschreiben             │
│  • Beispiel: Deadline verlängern, Wiederholer-Tage anrechnen    │
└─────────────────────────────────────────────────────────────────┘
```

### Hinweise für spätere Profile

| Parameter | Typ | Profil-gebunden? | Schule überschreibbar? | Hinweis |
|-----------|-----|------------------|------------------------|---------|
| `required_days` | number | Ja | Mit Warnung | KMK-Vorgaben beachten |
| `min_businesses` | number | Ja | Mit Warnung | Schulart-abhängig |
| `wait_hours` | number | Nein | Ja | Schulorganisatorisch |
| `business_account_trigger` | enum | Nein | Ja | Admin entscheidet |
| `grading_role_default` | enum | Nein | Ja | Schulorganisatorisch |
| `repeat_year_count_days` | boolean | Nein | Ja | Schulindividuell |
| `supervision_algorithm.mode` | enum | Nein | Ja | Schulorganisatorisch |

### Admin-Konfiguration zu ergänzen (bei Implementierung)

Diese Parameter sind in `ENTSCHEIDUNGEN-ADMIN.md` definiert, müssen aber noch in Profile integriert werden:

```yaml
# Zu ergänzen in jedem Profil:

admin_config:
  # Betreuungs-Algorithmus
  supervision:
    mode: "hours_based"           # hours_based, equal, manual
    prio_1_enabled: true          # ÜU-LK zuerst
    prio_2_enabled: true          # Klassenleitung
    min_capacity_threshold: 2     # Mindest-Stunden für Auto-Zuweisung

  # Bewertungs-Rollen
  grading:
    role_default: "both"          # supervising, assessing, both
    allow_teacher_override: true  # LK kann selbst ändern

  # Vertrag & Betrieb
  contract:
    business_account_trigger: "at_school"  # at_school, approved

  # Wiederholer
  archival:
    count_previous_days_on_repeat: false   # Default: Nicht anrechnen

  # Deadlines
  deadlines:
    certificate_deadline_days: 3
    grading_deadline: null                 # Datum, von Admin gesetzt
    allow_teacher_extension: true          # LK darf verlängern
    max_extension_days: 30
```

### Profilspezifische Unterschiede

| Aspekt | WS Bayern | MS Bayern | Hinweis |
|--------|-----------|-----------|---------|
| Betreuungs-Algo | hours_based | hours_based | LK-Kapazität aus Stundenplan |
| Bewertungs-Rollen | beide separat | nicht relevant | WS hat Benotung |
| Wiederholer-Tage | nicht anrechnen | nicht anrechnen | Schulindividuell entscheidbar |
| Account-Trigger | at_school | at_school | Gleich für beide |

### TODO bei Implementierung

- [ ] Admin-Dashboard: Einstellungs-Tabs gemäß `ENTSCHEIDUNGEN-ADMIN.md`
- [ ] Profil-Überschreibungen: Welche Parameter warnen, welche blocken?
- [ ] Audit-Log: Alle Profil-Abweichungen dokumentieren
- [ ] Import: Profil bestimmt Default-Werte für neue Entitäten
- [ ] Migration: Bestehende Schulen auf neue Parameter migrieren

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version mit WS Bayern |
| 2024-12-10 | Entwurf MS Bayern hinzugefügt |
| 2024-12-10 | NEU: Implementierungshinweise für Admin-Konfiguration |
| 2024-12-10 | KORRIGIERT: required_days ist Schul-überschreibbar (15 für Zweistufig, 20 für Drei-/Vierstufig) |
| 2024-12-10 | NEU: Teilzusagen-Parameter (min_block_days, allow_partial_commitments) |
| 2024-12-10 | NEU: contract-Parameter (at_school_reminder_days, business_account_trigger) |
| 2024-12-10 | NEU: admin_config Sektion im WS Bayern Profil |
| 2024-12-10 | KORRIGIERT: Profil-Vergleich zeigt jetzt "15 oder 20" statt fix "20" |
| 2024-12-10 | NEU: Beispiele für Zweistufige vs. Drei-/Vierstufige Schul-Überschreibungen |
