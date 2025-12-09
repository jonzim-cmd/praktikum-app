# Nächste Schritte

## Kontext

Die Grundkonzeption ist abgeschlossen:
- ✅ Schüler-Flow
- ✅ Lehrkraft-Flow
- ✅ Betrieb-Flow
- ✅ Alle Entscheidungen dokumentiert
- ✅ Skalierbarkeit als Pflicht definiert

---

## Aktueller Stand der Dokumente

| Dokument | Status |
|----------|--------|
| `KONZEPT-V2.md` | ✅ Fertig |
| `FLOW-SCHUELER.md` | ✅ Fertig |
| `FLOW-LEHRKRAFT.md` | ✅ Fertig |
| `FLOW-BETRIEB.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-SCHUELER.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-LEHRKRAFT.md` | ✅ Fertig |
| `ENTSCHEIDUNGEN-BETRIEB.md` | ✅ Fertig |
| `SKALIERBARKEIT.md` | ✅ Grundstruktur fertig |
| `EDGE-CASES.md` | ✅ In Arbeit |
| `V2-FEATURES.md` | ✅ Fertig |
| `FLOW-ADMIN.md` | ⏳ **TODO** |
| `FLOW-SUPERADMIN.md` | ⏳ **TODO** |

---

## TODO 1: Flows auf Konsistenz prüfen

### Alle drei Flows vergleichen

| Prüfpunkt | Dateien | Status |
|-----------|---------|--------|
| Synchronisation stimmt überein? | Alle FLOW-*.md | ⏳ |
| Begriffe konsistent? | Alle Dokumente | ⏳ |
| Keine widersprüchlichen Entscheidungen? | Alle ENTSCHEIDUNGEN-*.md | ⏳ |
| Alle Trigger/Reaktionen passen zusammen? | Alle FLOW-*.md | ⏳ |

### Konkrete Prüfpunkte

**Schüler → Betrieb:**
- [ ] Krankmeldung: Schüler meldet → Betrieb erhält Info (stimmt?)
- [ ] Anwesenheit: Schüler meldet täglich → Betrieb bestätigt wöchentlich (stimmt?)
- [ ] Zusage: Schüler gibt E-Mail ein → Warnung bei Sammel-Adresse (in beiden Flows?)

**Schüler → Lehrkraft:**
- [ ] Vertrag: Schüler lädt hoch → Lehrkraft prüft (Status-Übergänge konsistent?)
- [ ] Bewerbung: Schüler dokumentiert → Lehrkraft sieht Details (Zugriff definiert?)
- [ ] Krankmeldung: Schüler meldet → Lehrkraft erhält Info + Attest-Tracking

**Lehrkraft → Betrieb:**
- [ ] Besuchstermin: Lehrkraft schlägt vor → Betrieb reagiert (Flows passen?)
- [ ] Beurteilung: Lehrkraft erinnert → Betrieb füllt aus (Trigger konsistent?)
- [ ] Vertrag bestätigt → Betrieb erhält Account (Trigger korrekt?)

**Stillschweigende Bestätigung:**
- [ ] Nach 7 Tagen automatisch bestätigt (in allen Flows gleich?)
- [ ] Lehrkraft sieht "Automatisch bestätigt" Hinweis (dokumentiert?)

**Authentifizierung Betrieb:**
- [ ] Wahlmöglichkeit bei erster Mail (Passwort / Magic Link)
- [ ] Link-Anmeldung deaktivierbar
- [ ] Warnung "noch nicht final" in allen relevanten Stellen

---

## TODO 2: Admin-Flow erstellen

### Schuladmin (pro Schule)

**Aufgaben:**
- Schüler importieren/anlegen
- Lehrkräfte anlegen und Betreuungen zuweisen
- Praktikumszeiträume festlegen
- Ferien eintragen
- Schulkonfiguration anpassen
- Betriebe sperren (Blacklist)
- Duplikate zusammenführen
- Reports/Exporte

**Offene Fragen:**
- [ ] Wie funktioniert der Schüler-Import? (CSV? Excel? Schnittstelle zu Schulverwaltung?)
- [ ] Wie werden Betreuungen zugewiesen? (Klasse → Lehrkraft)
- [ ] Was kann Admin an der Schulkonfiguration ändern?
- [ ] Welche Reports gibt es?

### Superadmin (System-weit)

**Aufgaben:**
- Schulen anlegen
- Bundesland-Presets verwalten
- Schulart-Presets verwalten
- Systemweite Einstellungen
- Technische Wartung

**Offene Fragen:**
- [ ] Wie werden neue Schulen ongeboardet?
- [ ] Wie werden Bundesland-Presets gepflegt?
- [ ] Welche systemweiten Einstellungen gibt es?

---

## TODO 3: Skalierbarkeit ausarbeiten

### Flows auf Skalierbarkeit prüfen

Jeden Flow durchgehen und hardcodierte Annahmen finden:

| Flow | Zu prüfen |
|------|-----------|
| `FLOW-SCHUELER.md` | Begriffe, Phasen, Bewertung, Zeiträume |
| `FLOW-LEHRKRAFT.md` | Dashboard-Struktur, Bewertungskomponenten |
| `FLOW-BETRIEB.md` | Beurteilungsbogen, Anwesenheitsbestätigung |

### Checkliste pro Flow

- [ ] Welche Begriffe sind hardcoded? → Ins Glossar
- [ ] Welche Zahlen sind hardcoded? → In Config
- [ ] Welche Phasen werden vorausgesetzt? → Aktivierbar/Deaktivierbar?
- [ ] Welche Features werden vorausgesetzt? → Feature-Flags?
- [ ] Welche rechtlichen Annahmen? → Bundesland-spezifisch?

### SKALIERBARKEIT.md erweitern

- [ ] Konkrete Beispiele aus den Flows einarbeiten
- [ ] Mapping: Flow-Element → Konfigurationsparameter
- [ ] Bundesland-Unterschiede recherchieren (mindestens BY, BW, NRW)
- [ ] Schulart-Unterschiede dokumentieren (RS, MS, Gym)

---

## TODO 4: Technische Vorbereitung

Nach Abschluss der Konzeptphase:

- [ ] Datenmodell finalisieren (unter Berücksichtigung Skalierbarkeit)
- [ ] Tech-Stack festlegen
- [ ] Architektur-Entscheidungen dokumentieren
- [ ] MVP-Scope definieren (was ist Minimum für Pilot?)

---

## Empfohlene Reihenfolge

```
1. Flows auf Konsistenz prüfen
   └── Widersprüche finden und beheben

2. Flows auf Skalierbarkeit prüfen
   └── Hardcodierte Annahmen dokumentieren
   └── SKALIERBARKEIT.md erweitern

3. Admin-Flow erstellen
   └── Schuladmin-Flow
   └── Superadmin-Flow
   └── Konfigurationskonzept finalisieren

4. Finaler Review
   └── Alle Dokumente nochmal durchgehen
   └── Lücken schließen

5. Technische Phase starten
   └── Datenmodell
   └── Architektur
   └── MVP-Scope
```

---

## Bewährter Prozess

So haben wir bei den bisherigen Flows gearbeitet:

1. **Groben Flow verstehen** – Dokumente lesen, Zusammenhänge erfassen
2. **Rückfragen stellen & Challengen** – Unklarheiten ansprechen, Alternativen vorschlagen
3. **Wenn alle Fragen geklärt** → Flow-Diagramm erstellen
4. **Nochmal prüfen** – Gemeinsam durchgehen, Lücken finden, korrigieren

**Wichtig:** Nicht direkt das Diagramm erstellen! Erst verstehen und diskutieren.

---

## Letzte Änderung

**Datum:** 2024-12-08
**Session:** Betrieb-Flow abgeschlossen, Skalierbarkeit als Pflicht definiert, nächste Schritte aktualisiert
