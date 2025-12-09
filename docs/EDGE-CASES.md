# Edge Cases & Sonderfälle

> Sammlung von Sonderfällen, die im System berücksichtigt werden müssen.
> Status: In Bearbeitung

---

## 1. Schüler-Wechsel & Schulkarriere

### 1.1 Neuzugang in Klasse 11
- Schüler kommt von anderer Schule
- Hat ggf. bereits Praktikumstage absolviert (extern)
- **Lösung:** Admin kann "bereits absolvierte Tage" eintragen (ohne Details, nur Anzahl)

### 1.2 Sitzenbleiben ✅ GEKLÄRT
- Schüler wiederholt Klasse 10 oder 11
- Praktikumstage aus Vorjahr: Zählen die?
- **Lösung:** Schulindividuelle Admin-Entscheidung
  - **Default:** Nicht anrechnen (konservativer Ansatz)
  - Admin kann Einstellung ändern: Vorherige Tage anrechnen
- Begründung: Rechtlich unklar, daher flexibel lassen

### 1.3 Schulwechsel während des Jahres
- Schüler verlässt Schule mitten im Praktikumsprozess
- **Lösung:** Account kann "archiviert" werden, Daten bleiben für Export

### 1.4 Abschluss / Schulabgang
- Schüler erreicht Abschluss oder verlässt Schule
- **Lösung:** Account-Status "Abgeschlossen" oder "Abgegangen"
- Daten bleiben X Jahre archiviert (Aufbewahrungspflicht?)

---

## 2. Betreuungswechsel

### 2.1 Neues Schuljahr, neuer Lehrer
- Klasse 10 → Klasse 11: Anderer Betreuer
- **Lösung:** Betreuungszuordnung ist zeitraumbasiert
- Neuer Lehrer sieht Historie, kann aber nur aktuellen Zeitraum bearbeiten

### 2.2 Wechsel innerhalb des Schuljahres
- Lehrkraft fällt aus (Krankheit, Versetzung)
- **Lösung:** Admin kann Betreuung neu zuweisen
- Alle laufenden Vorgänge gehen an neue Lehrkraft über

---

## 3. Praktikums-Abbruch & Reset

### 3.1 Betrieb sagt kurzfristig ab
- Praktikum war geplant, Betrieb springt ab
- **Lösung:** Status "Abgesagt durch Betrieb"
- Schüler muss neue Bewerbungen machen
- Bereits investierte Arbeit (Vertrag etc.) wird archiviert, nicht gelöscht

### 3.2 Schüler bricht ab
- Schüler erscheint nicht mehr / will nicht mehr
- **Lösung:** Lehrkraft kann Praktikum als "Abgebrochen" markieren
- Bereits absolvierte Tage zählen, Rest muss nachgeholt werden

### 3.3 Betrieb wird gesperrt
- Betrieb stellt sich als ungeeignet heraus (während Praktikum)
- **Lösung:** Lehrkraft kann Praktikum beenden + Grund dokumentieren
- Betrieb wird für zukünftige Schüler markiert/gesperrt

---

## 4. Zeitliche Probleme

### 4.1 Praktikum überschneidet sich mit Ferien/Feiertagen ✅ GEKLÄRT
- Praktikumszeiträume werden von Schule im Admin-Bereich festgelegt
- Schüler kann nur innerhalb dieser Zeiträume planen
- **Lösung:** Ferien-Überschneidung ist nicht möglich (rechtlich nicht erlaubt)
- **Ausnahme:** Nachholphase (Phase 5) findet außerhalb der Schulzeit statt

### 4.2 Deadline verpasst (Aufgaben)
- Schüler gibt Reflexion nicht rechtzeitig ab
- **Lösung:** Bereits geklärt → 0 Punkte, "Keine Abgabe" Option

### 4.3 Attest-Frist verpasst
- Schüler lädt Attest nicht innerhalb von 3 Tagen hoch
- **Lösung:** Bereits geklärt → Tag gilt als unentschuldigt

---

## 5. Mehrfach-Szenarien

### 5.1 Gleicher Betrieb, mehrere Schüler
- 3 Schüler machen Praktikum bei Müller GmbH
- **Lösung:** Betrieb hat einen Account, sieht alle "seine" Praktikanten
- Betriebsbesuch kann für alle gleichzeitig gelten

### 5.2 Gleicher Betrieb, mehrere Jahre
- Schüler war letztes Jahr schon bei Müller GmbH
- **Frage:** Zählt das als "unterschiedlicher Betrieb" für die 2-Betriebe-Regel?
- **Vermutung:** Nein, gleicher Betrieb = gleicher Betrieb

### 5.3 Schüler macht mehr Tage als nötig
- Freiwillig länger geblieben
- **Lösung:** System akzeptiert Überschuss, zeigt aber "Ziel erreicht"

---

## 6. Technische Edge Cases

### 6.1 Betrieb ohne E-Mail ✅ GEKLÄRT (V2)
- Kleinstbetrieb hat keine E-Mail-Adresse
- **Lösung für V1:** E-Mail ist Pflichtfeld
- **V2-Feature:** "Offline-Betrieb" Modus für absolute Ausnahmen
  - Lehrkraft trägt Anwesenheit manuell ein
  - Beurteilung via PDF + manuelle Eingabe
- Siehe: `docs/V2-FEATURES.md`

### 6.2 Schüler ohne Smartphone
- Selten, aber möglich
- **Lösung:** Web-Version muss vollständig funktionieren

### 6.3 Offline-Nutzung ✅ GEKLÄRT (Nicht V1)
- Schüler hat im Betrieb kein Internet
- **Entscheidung:** Nicht in V1 implementieren
- Begründung: 95% haben Mobilfunk, Rest kann abends nachtragen
- **Alternative:** Erinnerung bei fehlendem Check-in (Push-Benachrichtigung)

### 6.4 Betrieb-e ✅ GEKLÄRT
- Problem: Gleicher Betrieb wird mehrfach angelegt (Tippfehler, unterschiedliche Schreibweise)
- **Lösung (Goldstandard):**
  1. Google Places API für Adress-Autocomplete
  2. Fuzzy-Match auf normalisiertem Firmennamen + PLZ
  3. Bei Eingabe: "Meintest du einen dieser Betriebe?"
  4. Admin-Merge-Funktion falls e durchrutschen
- Wenn Betrieb existiert: Schüler wird zugewiesen (kein neuer Account)

---

## 7. Datenschutz & Löschung

### 7.1 Löschantrag durch Betrieb
- Betrieb will aus dem System entfernt werden
- **Lösung:** Account deaktivieren, historische Daten anonymisieren?

### 7.2 Aufbewahrungsfristen
- Wie lange müssen Verträge/Bewertungen aufbewahrt werden?
- **Frage:** Gibt es gesetzliche Vorgaben?
- **TODO:** Recherchieren

### 7.3 Anonymisierte Daten für Analysen
- Interessant wäre: Daten anonymisiert behalten für Analysen
- Beispiele: Durchschnittliche Bewerbungsanzahl bis Zusage, beliebte Branchen, etc.
- **Wichtig:** Muss rechtlich sauber sein (DSGVO-konform)
- Könnte Basis für neue Features/App-Ideen sein

---

## 8. Datensammeln-Strategie (Business Value)

> **Hintergrund:** Anonymisierte, aggregierte Daten könnten langfristig wertvoll sein – für Insights, neue Features oder potenzielle Geschäftsmodelle.

### 8.1 Welche Daten sammeln?

**Bewerbungsphase:**
- Durchschnittliche Anzahl Bewerbungen bis zur ersten Zusage
- Erfolgsquote nach Kontaktart (E-Mail vs. Anruf vs. Persönlich)
- Durchschnittliche Wartezeit auf Antwort
- Beliebte Branchen / Berufsfelder
- Zeitpunkt der ersten Bewerbung (wie früh fangen Schüler an?)
- Korrelation: Frühzeitige Bewerbung ↔ Wunschbetrieb bekommen

**Praktikum:**
- Durchschnittliche Krankheitstage
- Abbruchquote
- Betriebsbewertungen (aggregiert pro Branche)

**Nachbereitung:**
- Weiterempfehlungsrate der Betriebe
- Korrelation: Bewerbungsaufwand ↔ Zufriedenheit mit Praktikum

### 8.2 Aggregations-Level

| Level | Beispiel | DSGVO-relevant |
|-------|----------|----------------|
| **Schule** | "Schule X hat 85% Erfolgsquote bei E-Mail-Bewerbungen" | Ja, aber vertretbar |
| **Region** | "In München sind IT-Betriebe beliebter als Handwerk" | Weniger kritisch |
| **Bayern-weit** | "Durchschnittlich 4,2 Bewerbungen bis Zusage" | Unkritisch |

### 8.3 Rechtliche Grundlage

- **Opt-in bei Registrierung:** "Wir nutzen anonymisierte Daten zur Verbesserung der App"
- **Kein Personenbezug:** Daten müssen so aggregiert sein, dass keine Rückschlüsse auf Einzelpersonen möglich sind
- **Löschung vs. Anonymisierung:** Personenbezogene Daten werden gelöscht, anonymisierte Statistiken bleiben
- **TODO:** Datenschutzbeauftragten konsultieren

### 8.4 Potenzielle Nutzung

**Intern:**
- Bessere Tipps für Schüler ("E-Mail-Bewerbungen haben 2x höhere Erfolgsquote")
- Benchmarks für Schulen ("Ihre Schüler beginnen später als der Durchschnitt")
- Erkennung von Problemmustern (z.B. bestimmte Betriebe mit hoher Abbruchquote)

**Extern (langfristig):**
- Aggregierte Insights für Bildungsträger / Ministerien
- Branchen-Reports für IHK / Handwerkskammer
- Potenzielle Einnahmequelle (anonymisierte Studien)

### 8.5 Implementierungs-Strategie

1. **Jetzt:** Datenmodell so designen, dass Anonymisierung einfach möglich ist
2. **Jetzt:** Separate Tabelle für aggregierte Statistiken vorsehen
3. **Später:** Konkrete Analysen entwickeln, wenn Datenbasis groß genug
4. **Wichtig:** Von Anfang an DSGVO-konform arbeiten, nicht nachträglich flicken

---

## 9. Kommunikation

### 9.1 Krankmeldung: Eltern informieren? ✅ GEKLÄRT (V2)
- Aktuell: Betrieb + Lehrkraft werden informiert, Eltern nicht
- **V2-Feature:** Optional, pro Schule konfigurierbar
  - Wenn Eltern-E-Mail hinterlegt → automatische Info-Mail
  - Admin kann Feature aktivieren/deaktivieren
- Siehe: `docs/V2-FEATURES.md`

---

## Noch zu klären

- [x] ~~Sitzenbleiben: Werden Praktikumstage angerechnet?~~ → Admin-Entscheidung (Default: Nein)
- [x] ~~Ferien-Überschneidung: Warnung oder Sperre?~~ → Nicht möglich (Zeiträume durch Schule festgelegt)
- [x] ~~Betrieb ohne E-Mail: Wie handhaben?~~ → V1: Pflichtfeld, V2: Offline-Modus
- [x] ~~Offline-Nutzung: Nötig?~~ → Nicht V1 (Erinnerung bei fehlendem Check-in stattdessen)
- [ ] Aufbewahrungsfristen: Recherchieren

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version mit Grundfällen |
| 2024-12-08 | NEU: Abschnitt 8 "Datensammeln-Strategie (Business Value)" |
| 2024-12-08 | Sitzenbleiben: Admin-Entscheidung dokumentiert |
| 2024-12-08 | Ferien-Überschneidung: Durch Schul-Zeiträume gelöst |
| 2024-12-08 | Betrieb ohne E-Mail: V1 Pflichtfeld, V2 Feature |
| 2024-12-08 | Offline-Nutzung: Nicht V1, Erinnerung stattdessen |
| 2024-12-08 | NEU: Betrieb-erkennung (6.4) |
| 2024-12-08 | Krankmeldung Eltern: V2 Feature |
