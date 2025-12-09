# CLAUDE.md

## 🚨 AKTUELLER STATUS: KONZEPTPHASE

**Wir entwickeln ein neues Konzept von Grund auf.** Der frühere Code ist veraltet und wird nicht weiterverwendet. Fokus liegt ausschließlich auf der Konzeptarbeit.

---

## Projekt: practical

Eine App zur Verwaltung von Schülerpraktika – **skalierbar auf alle Schularten und Bundesländer**.

**Aktueller Fokus:** Bayerische Wirtschaftsschulen (Pilotphase)
**Sprache:** Deutsch (UI und Konzept)

---

## 🚨 WICHTIG: Skalierbarkeit ist Pflicht!

**Keine hardcodierten Werte!** Die App muss von Anfang an flexibel gebaut werden:
- Alles konfigurierbar pro Schule/Bundesland
- Siehe: `docs/SKALIERBARKEIT.md`

---

## Wichtige Konzept-Dokumente

| Dokument | Inhalt | Status |
|----------|--------|--------|
| `docs/SKALIERBARKEIT.md` | 🔴 **PFLICHT:** Konfigurierbarkeit, Bundesland-Support | ✅ Neu |
| `docs/KONZEPT-V2.md` | Hauptkonzept: Phasen, Rollen, Entscheidungen, Bewertung | ✅ In Arbeit |
| `docs/FLOW-SCHUELER.md` | Kompletter Schüler-Flow als ASCII-Diagramm | ✅ Fertig |
| `docs/FLOW-LEHRKRAFT.md` | Lehrkraft-Flow | ✅ Fertig |
| `docs/FLOW-BETRIEB.md` | Betrieb-Flow | ✅ Fertig |
| `docs/ENTSCHEIDUNGEN-*.md` | Detaillierte Entscheidungen pro Rolle | ✅ Fertig |
| `docs/EDGE-CASES.md` | Sonderfälle und Ausnahmen | ✅ In Arbeit |

---

## Arbeitsweise in der Konzeptphase

1. **Nicht einfach ja sagen.** Hinterfrage Entscheidungen, bringe eigene Ideen ein, schlage Alternativen vor.

2. **Mitdenken mit hoher Integrität.** Wenn etwas nicht zum Gesamtprozess passt oder zu Komplikationen führen könnte, ansprechen.

3. **Rollentausch.** Sich aktiv in alle Rollen hineinversetzen (Schüler, Lehrkraft, Betrieb, Admin) und aus deren Perspektive denken.

4. **Challenge statt Bestätigung.** Lieber einmal zu viel nachfragen als ein unklares Konzept durchwinken.

5. **Realitätscheck.** "Wird das in der Praxis wirklich so genutzt?" ist eine valide Frage.

---

## Rollen im System

| Rolle | Farbe | Gerät |
|-------|-------|-------|
| Schüler | Lila #6366F1 | Mobile-First |
| Lehrkraft | Grün #34D399 | Desktop + Mobile |
| Betrieb | Orange #FF6B35 | Browser/App |
| Admin | - | Desktop |

---

## Die 5 Phasen

```
Bewerbung → Vertrag → Praktikum → Nachbereitung → Nachholen (optional)
```

Details in `docs/KONZEPT-V2.md`

---

## Kernprinzipien

1. **Lehrkräfte müssen es lieben** → Weniger Stress, klarer Überblick
2. **Betriebe dürfen es nicht hassen** → Minimaler Aufwand
3. **Schüler zur Eigenverantwortung führen** → Klare Aufgaben, Nachweispflicht
4. **Skalierbarkeit von Tag 1** → Keine hardcodierten Werte, alles konfigurierbar

---

## Markt & Skalierung

| Zielgruppe | Schulen | Status |
|------------|---------|--------|
| Wirtschaftsschulen Bayern | ~70 | 🎯 Pilot |
| Realschulen Bayern | ~350 | ⏳ Phase 2 |
| Alle Schularten Bayern | ~1.750 | ⏳ Phase 2 |
| Deutschland gesamt | ~30.000 | ⏳ Langfristig |

Details: `docs/SKALIERBARKEIT.md`

---

## Hinweis zum alten Code

Der Ordner enthält noch Code aus einem früheren Implementierungsversuch. Dieser ist **nicht relevant** für die aktuelle Konzeptphase. Ignorieren und nicht referenzieren.
