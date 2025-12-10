# Kern-Entitäten

> Basis-Datenmodell – diese Entitäten existieren IMMER, unabhängig von aktivierten Modulen.

---

## Übersicht

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  School  │────<│  Class   │────<│ Student  │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                       │ hat mehrere
                                       ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Business │────<│Placement │>────│  Period  │
└──────────┘     └────┬─────┘     └──────────┘
                      │
                      │ hat mehrere
                      ▼
                ┌──────────┐
                │Attendance│
                └──────────┘
```

---

## School (Schule)

```
School {
  id: UUID
  name: string                    // "Städtische Wirtschaftsschule München"
  address: string
  city: string
  postal_code: string
  state: string                   // "BY" (Bundesland)
  school_type: string             // "ws", "ms", "rs", "fos"
  profile_id: string              // Referenz auf Profil
  logo_file_id: UUID              // Für Zertifikate
  settings: JSON                  // Profil-Überschreibungen
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- Multi-Tenant: Jede Schule ist ein Tenant
- `profile_id` verweist auf ein Profil (z.B. "ws_bayern")
- `settings` überschreibt einzelne Profil-Parameter

---

## Class (Klasse)

```
Class {
  id: UUID
  school_id: UUID → School
  name: string                    // "10a", "9b"
  year: number                    // Schuljahr, z.B. 2024
  teacher_id: UUID → Teacher      // Klassenleitung (optional)
  created_at: timestamp
}
```

**Notizen:**
- Schüler gehören zu einer Klasse
- Klassen können verschiedenen Praktikumszeiträumen zugeordnet sein

---

## Student (Schüler)

```
Student {
  id: UUID
  school_id: UUID → School
  class_id: UUID → Class
  first_name: string
  last_name: string
  email: string                   // Schul-E-Mail oder private
  phone: string                   // Optional
  address: string                 // Für Vertrag
  city: string
  postal_code: string
  birth_date: date                // Für Jugendarbeitsschutz
  parent_email: string            // Optional, für Benachrichtigungen
  status: enum                    // active, inactive, graduated
  is_repeater: boolean            // Wiederholer (sitzengeblieben)
  count_previous_days: boolean    // Bei Wiederholer: Vorjahres-Tage anrechnen?
  created_by: enum                // import, manual
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- Wird durch Admin/Import angelegt
- E-Mail kann Schul-E-Mail oder private sein
- `parent_email` für optionale Eltern-Benachrichtigungen (V2)
- `is_repeater`: Markiert Schüler als Wiederholer
- `count_previous_days`: Kann pro Schüler überschrieben werden (Default aus Schul-Einstellung)
- `created_by`: Unterscheidet zwischen Import und manueller Anlage

---

## Teacher (Lehrkraft)

```
Teacher {
  id: UUID
  school_id: UUID → School
  first_name: string
  last_name: string
  email: string
  phone: string                   // Optional
  role: enum                      // teacher, admin, restricted_admin, superadmin
  is_primary_admin: boolean       // Haupt-Admin der Schule
  excluded_from_supervision: boolean  // Von Betreuungs-Algorithmus ausgeschlossen
  grading_role: enum              // supervising, assessing, both (oder null = aus Schul-Default)
  notification_settings: JSON     // Push/E-Mail-Präferenzen
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- `role: teacher` = Normale Lehrkraft
- `role: admin` = Schuladmin (volle Rechte)
- `role: restricted_admin` = Schuladmin (eingeschränkt, z.B. Sekretariat)
- `role: superadmin` = System-Admin (schulübergreifend, für Betreiber)
- `is_primary_admin`: Erster Admin einer Schule, nur dieser kann andere Admins degradieren
- `excluded_from_supervision`: Für Schulleitung, Verwaltung, etc. – werden nie automatisch zugewiesen
- `grading_role`: Überschreibt Schul-Default für Bewertungs-Rolle (kann von LK selbst geändert werden)
- Betreuungszuweisung separat (Teacher ↔ Class/Student)

---

## TeacherAssignment (Betreuungszuweisung)

```
TeacherAssignment {
  id: UUID
  teacher_id: UUID → Teacher
  class_id: UUID → Class          // ODER
  student_id: UUID → Student      // Einzelzuweisung
  period_id: UUID → Period        // Für welchen Zeitraum
  created_at: timestamp
}
```

**Notizen:**
- Lehrkraft kann ganze Klasse oder einzelne Schüler betreuen
- Pro Praktikumszeitraum kann Zuweisung unterschiedlich sein

---

## Business (Betrieb)

```
Business {
  id: UUID
  school_id: UUID → School        // Betrieb gehört zu Schule (Multi-Tenancy)
  name: string
  name_normalized: string         // Für Duplikaterkennung (lowercase, ohne Sonderzeichen)
  address: string
  address_normalized: string      // Für Duplikaterkennung
  city: string
  postal_code: string
  coordinates_lat: decimal        // Für Entfernungsberechnung
  coordinates_lng: decimal
  contact_person: string          // Optional
  contact_email: string           // Optional
  contact_phone: string           // Optional
  industry: string                // Branche (optional)
  status: enum                    // active, flagged, blocked
  flagged_reason: string          // Bei status=flagged
  blocked_reason: string          // Bei status=blocked
  created_at: timestamp
  created_by_type: enum           // student, teacher, admin
  created_by_id: UUID
  updated_at: timestamp
}
```

**Notizen:**
- `name_normalized` + `address_normalized` für Fuzzy-Matching
- `status: flagged` = Auffällig markiert (internes Lehrkraft-Feedback)
- `status: blocked` = Gesperrt (Admin-Blacklist, Schüler können nicht auswählen)
- Betrieb kann von Schüler, Lehrkraft oder Admin angelegt werden

---

## Period (Praktikumszeitraum)

```
Period {
  id: UUID
  school_id: UUID → School
  name: string                    // "Praktikum Februar 2025", "Block 1"
  start_date: date
  end_date: date
  registration_deadline: date     // Bis wann muss Zusage vorliegen?
  class_ids: UUID[]               // Welche Klassen betroffen
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- Pro Schule können mehrere Periods parallel existieren (verschiedene Klassen)
- `registration_deadline` für Ampel-Berechnung

---

## Placement (Praktikumsplatz)

```
Placement {
  id: UUID
  student_id: UUID → Student
  business_id: UUID → Business
  period_id: UUID → Period
  start_date: date                // Kann von Period abweichen
  end_date: date
  days_planned: number            // Geplante Tage
  days_completed: number          // Tatsächlich absolviert (berechnet)
  days_to_catch_up: number        // Nachzuholen (berechnet)
  status: enum                    // draft, pending_approval, approved,
                                  // active, completed, cancelled
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- Zentrale Entität: Verbindet Student + Business + Period
- Ein Student kann mehrere Placements haben (mehrere Betriebe)
- `status: draft` = Zusage eingetragen, aber noch nicht freigegeben
- `status: pending_approval` = Im Einspruchsfenster
- `status: approved` = Freigegeben, Vertrag kann erstellt werden
- `status: active` = Praktikum läuft gerade
- `status: completed` = Praktikum abgeschlossen
- `status: cancelled` = Abgebrochen/Zurückgezogen

---

## Attendance (Anwesenheit)

```
Attendance {
  id: UUID
  placement_id: UUID → Placement
  date: date
  is_workday: boolean             // false bei Wochenende/Feiertag
  student_status: enum            // pending, present, sick, absent
  student_reported_at: timestamp
  business_status: enum           // pending, confirmed, disputed
  business_confirmed_at: timestamp
  business_dispute_reason: string // Falls disputed
  requires_catch_up: boolean      // Muss nachgeholt werden?
  caught_up_at: date              // Wann nachgeholt?
  caught_up_record_id: UUID       // Referenz auf CatchUpRecord
  notes: string                   // Interne Notizen
  created_at: timestamp
  updated_at: timestamp
}
```

**Notizen:**
- Ein Eintrag pro Tag pro Placement
- Zwei-Stufen-Bestätigung: Schüler meldet → Betrieb bestätigt
- `student_status: pending` = Noch nicht gemeldet
- `student_status: present` = "Ich war da"
- `student_status: sick` = Krank gemeldet
- `student_status: absent` = Abwesend (ohne Krankmeldung)
- `business_status: disputed` = Betrieb widerspricht Anwesenheit

---

## Kern-Parameter (immer konfigurierbar)

Diese Parameter gehören zum Kern, nicht zu einzelnen Modulen:

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `required_days` | number | 20 | Gesamtzahl benötigter Praktikumstage |
| `min_businesses` | number | 2 | Minimum verschiedene Betriebe |
| `max_days_per_business` | number | – | Maximum Tage bei einem Betrieb (optional) |
| `allow_parallel_placements` | boolean | false | Mehrere Placements gleichzeitig aktiv? |
| `allow_weekend_internship` | boolean | false | Praktikum am Wochenende? |
| `allow_weekend_catch_up` | boolean | true | Nachholen am Wochenende? |

---

## Begriffe (Glossar)

| Begriff | Default | Beschreibung |
|---------|---------|--------------|
| `terms.internship` | "Praktikum" | Hauptbegriff |
| `terms.placement` | "Praktikumsplatz" | Ein Platz bei einem Betrieb |
| `terms.business` | "Betrieb" | Praktikumsgeber |
| `terms.period` | "Praktikumszeitraum" | Zeitfenster |
| `terms.contract` | "Vertrag" | Formelle Vereinbarung |
| `terms.commitment` | "Zusage" | Mündliche/schriftliche Zusage |

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version aus FLOW-SCHUELER.md |
| 2024-12-10 | Teacher: Admin-Rollen, excluded_from_supervision, grading_role |
| 2024-12-10 | Student: is_repeater, count_previous_days, created_by |
