# Skalierbarkeit & Flexibilität

> **PFLICHT VON ANFANG AN:** Keine hardcodierten Werte!
> Dieses Dokument definiert, was konfigurierbar sein MUSS.

---

## Warum Skalierbarkeit kritisch ist

### Ausgangslage

| Zielgruppe | Anzahl Schulen | Marktpotenzial |
|------------|----------------|----------------|
| Wirtschaftsschulen Bayern | ~70 | 🔴 Zu klein |
| + Realschulen Bayern | ~350 | 🟡 Besser |
| + Mittelschulen Bayern | ~900 | 🟢 Tragfähig |
| Bayern gesamt | ~1.750 | 🟢 Gut |
| Deutschland gesamt | ~30.000+ | 🟢 Sehr gut |

**Kernaussage:** 70 Schulen reichen nicht für ein nachhaltiges Produkt. Die Architektur MUSS von Tag 1 auf Skalierung ausgelegt sein.

---

## Prinzip: Konfiguration statt Code

### ❌ FALSCH (hardcoded)

```typescript
// NIEMALS SO:
const PRAKTIKUM_TAGE = 15;
const PHASEN = ['Bewerbung', 'Vertrag', 'Praktikum', 'Nachbereitung', 'Nachholen'];
const BEWERTUNG_BETRIEB_ANTEIL = 0.3;
```

### ✅ RICHTIG (konfigurierbar)

```typescript
// SO:
const schulConfig = await getSchulConfig(schulId);
const praktikumTage = schulConfig.praktikum.gesamtTage;
const aktivePhasen = schulConfig.phasen.filter(p => p.aktiv);
const bewertungSchema = schulConfig.bewertung;
```

---

## Konfigurationsebenen

```
┌─────────────────────────────────────────────────────────────┐
│  BUNDESLAND-EBENE                                           │
│  (Rechtliche Basis, Datenschutz, Standard-Texte)           │
├─────────────────────────────────────────────────────────────┤
│  SCHULART-EBENE                                             │
│  (Typische Konfiguration für Realschule, Gymnasium, etc.)  │
├─────────────────────────────────────────────────────────────┤
│  SCHUL-EBENE                                                │
│  (Individuelle Anpassungen der einzelnen Schule)           │
├─────────────────────────────────────────────────────────────┤
│  JAHRGANGS-EBENE                                            │
│  (Spezifische Einstellungen pro Schuljahr/Klasse)          │
└─────────────────────────────────────────────────────────────┘
```

**Vererbung:** Bundesland → Schulart → Schule → Jahrgang
Jede Ebene kann Werte der darüberliegenden überschreiben.

---

## Was MUSS konfigurierbar sein

### 1. Praktikums-Grunddaten

| Parameter | Beispiel WS Bayern | Beispiel RS Bayern | Konfigurierbar |
|-----------|-------------------|-------------------|----------------|
| Gesamttage | 15-20 | 5-10 | ✅ PFLICHT |
| Min. Betriebe | 2 | 1 | ✅ PFLICHT |
| Verteilung auf Jahre | Klasse 10+11 | Klasse 9 | ✅ PFLICHT |
| Blockform vs. Einzeltage | Block | Beides | ✅ PFLICHT |
| Praktikum am Wochenende | Nein (außer Nachholen) | Nein | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface PraktikumConfig {
  gesamtTage: number;                    // z.B. 15
  minTageProBlock: number;               // z.B. 5
  maxTageProBlock: number;               // z.B. 10
  minBetriebe: number;                   // z.B. 2
  verteilungAufJahre: JahrgangsConfig[]; // z.B. [{stufe: 10, tage: 5}, {stufe: 11, tage: 10}]
  blockformPflicht: boolean;             // true = nur Blöcke, false = auch Einzeltage
  wochenendePraktikumErlaubt: boolean;   // für reguläres Praktikum
  wochenendeNachholenErlaubt: boolean;   // für Nachhol-Phase
}
```

### 2. Phasen-System

| Phase | WS Bayern | Andere Schulen | Konfigurierbar |
|-------|-----------|----------------|----------------|
| Bewerbung | ✅ Aktiv | Optional | ✅ PFLICHT |
| Vertrag | ✅ Aktiv | Nicht überall nötig | ✅ PFLICHT |
| Praktikum | ✅ Aktiv | Immer | ✅ PFLICHT |
| Nachbereitung | ✅ Aktiv | Optional | ✅ PFLICHT |
| Nachholen | ✅ Aktiv | Optional | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface PhaseConfig {
  id: string;                    // 'bewerbung', 'vertrag', etc.
  name: string;                  // Anzeigename (übersetzbar)
  aktiv: boolean;                // Phase aktiviert?
  reihenfolge: number;           // Sortierung
  pflicht: boolean;              // Muss durchlaufen werden?
  deadlineConfig?: DeadlineConfig;
  aufgaben: AufgabeConfig[];     // Welche Aufgaben in dieser Phase
}
```

### 3. Bewertungssystem

| Komponente | WS Bayern | Andere | Konfigurierbar |
|------------|-----------|--------|----------------|
| Betriebsbeurteilung | 30% | 0-100% | ✅ PFLICHT |
| Bewerbungsprozess | 20% | Optional | ✅ PFLICHT |
| Lernaufgaben | 30% | Optional | ✅ PFLICHT |
| Gesamteindruck | 20% | Optional | ✅ PFLICHT |
| Notenskala | 1-6 | 1-6 oder Punkte | ✅ PFLICHT |
| Benotung aktiv | Ja | Ja/Nein | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface BewertungConfig {
  benotungAktiv: boolean;              // Überhaupt Noten vergeben?
  notenSkala: 'noten_1_6' | 'punkte_0_15' | 'bestanden_nicht_bestanden';
  komponenten: BewertungsKomponente[];
  rundungsRegel: 'mathematisch' | 'kaufmaennisch' | 'abrunden';
}

interface BewertungsKomponente {
  id: string;                    // 'betrieb', 'bewerbung', 'aufgaben', 'eindruck'
  name: string;                  // Anzeigename
  aktiv: boolean;
  gewichtung: number;            // 0.0 - 1.0 (Summe muss 1.0 ergeben)
  bewertetVon: 'lehrkraft' | 'betrieb' | 'system';
  kriterien?: Kriterium[];       // Detailkriterien (Likert-Skala etc.)
}
```

### 4. Vertragsvorlage

| Element | Konfigurierbar |
|---------|----------------|
| Schullogo | ✅ PFLICHT |
| Schulname + Adresse | ✅ PFLICHT |
| Rechtliche Texte | ✅ PFLICHT (pro Bundesland) |
| Unterschriftenfelder | ✅ PFLICHT (Eltern ja/nein, Schulleitung ja/nein) |
| Zusätzliche Felder | ✅ PFLICHT |

**Umsetzung:** Template-System mit Platzhaltern

```html
<!-- Vertragsvorlage als Template -->
<div class="vertrag">
  <img src="{{schule.logo}}" />
  <h1>Praktikumsvertrag</h1>
  <p>zwischen {{schule.name}} und {{betrieb.name}}</p>

  {{#if config.unterschriften.eltern}}
  <div class="unterschrift">Erziehungsberechtigte</div>
  {{/if}}

  {{#each config.zusatzfelder}}
  <div class="feld">{{this.label}}: _______________</div>
  {{/each}}
</div>
```

### 5. Begriffe / Glossar

| Begriff aktuell | Problem | Lösung |
|-----------------|---------|--------|
| "Wirtschaftsschule" | Hardcoded | `{{schulart}}` |
| "Praktikum" | Manche sagen "Betriebspraktikum" | `{{praktikumBezeichnung}}` |
| "Lehrkraft" | Manche sagen "Betreuungslehrer" | `{{lehrkraftBezeichnung}}` |
| "Betrieb" | Manche sagen "Unternehmen" | `{{betriebBezeichnung}}` |

**Datenmodell-Vorschlag:**

```typescript
interface Glossar {
  schulart: string;              // "Wirtschaftsschule", "Realschule", etc.
  praktikum: string;             // "Praktikum", "Betriebspraktikum", "Berufspraktikum"
  lehrkraft: string;             // "Lehrkraft", "Betreuungslehrer", "Praktikumsbetreuer"
  betrieb: string;               // "Betrieb", "Unternehmen", "Praktikumsstelle"
  schueler: string;              // "Schüler", "Praktikant", "Auszubildender"
  // ... weitere Begriffe
}
```

### 6. Zeiträume & Deadlines

| Parameter | Beispiel | Konfigurierbar |
|-----------|----------|----------------|
| Praktikumszeiträume pro Schuljahr | 03.-14.02.2025 | ✅ PFLICHT |
| Ferienzeiten (für Validierung) | Faschingsferien, Osterferien | ✅ PFLICHT |
| Attest-Frist (Tage) | 3 (Default) | ✅ PFLICHT |
| Bewertungs-Deadline (Datum) | 28.02.2025 | ✅ PFLICHT |
| Erinnerungs-Intervalle (Tage) | 3, 5, 7 | ✅ PFLICHT |
| Verfügbarkeits-Anfrage Vorlauf (Wochen) | 4 (Default) | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface DeadlineConfig {
  attestFristTage: number;           // z.B. 3
  bewertungsDeadline: Date | null;   // z.B. 2025-02-28, null = keine Frist
  verfuegbarkeitsAnfrageVorlaufWochen: number; // z.B. 4
  erinnerungsIntervalle: {
    ersteMail: number;               // z.B. 3 (Tage)
    zweiteMail: number;              // z.B. 5
    eskalation: number;              // z.B. 7
  };
  beurteilungIntervalle: {           // Längere Fristen für Beurteilung
    ersteMail: number;               // z.B. 3
    zweiteMail: number;              // z.B. 7
    eskalation: number;              // z.B. 10
  };
}
```

### 7. Authentifizierung (Betrieb)

| Option | Konfigurierbar |
|--------|----------------|
| Magic Link erlaubt | ✅ PFLICHT |
| Passwort-Login erlaubt | ✅ PFLICHT |
| E-Mail-Verifizierung Pflicht | ✅ PFLICHT |
| 2FA optional/Pflicht | ✅ PFLICHT |

**Grund:** Manche Schulträger/Bundesländer könnten strengere Anforderungen haben.

### 8. Features an/aus

| Feature | Default | Konfigurierbar |
|---------|---------|----------------|
| Bewerbungs-Tracking | An | ✅ PFLICHT |
| Betriebsbesuche | An | ✅ PFLICHT |
| Anwesenheitsbestätigung Betrieb | An | ✅ PFLICHT |
| Praktikumsdatenbank | An | ✅ PFLICHT |
| Internes Betrieb-Feedback | An | ✅ PFLICHT |
| Zertifikat-Download | An | ✅ PFLICHT |
| Krankmeldung über App | An | ✅ PFLICHT |

### 9. Vertragsprozess-Konfiguration

| Parameter | Beispiel | Konfigurierbar |
|-----------|----------|----------------|
| Betrieb-Account bei "Bei Schulleitung" | Ja (Default) / Nein | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface VertragConfig {
  accountErstellungBeiSchulleitung: boolean; // true = Account bei "Bei Schulleitung", false = erst bei "Fertig"
}
```

### 10. Bewertungs-Konfiguration

| Parameter | Beispiel | Konfigurierbar |
|-----------|----------|----------------|
| Mehrere beurteilende Lehrkräfte | Betreuend + Beurteilend | ✅ PFLICHT |
| Wer bewertet welchen Abschnitt | Konfigurierbar pro Schule | ✅ PFLICHT |
| Wer vergibt Gesamtnote | Beurteilende LK (Default) | ✅ PFLICHT |
| Rollen-Zuweisung änderbar durch LK | Ja (Default) | ✅ PFLICHT |

**Datenmodell-Vorschlag:**

```typescript
interface BewertungsRollenConfig {
  einzelneLehrkraft: boolean;          // true = eine LK macht alles
  lehrkraftKannRolleAendern: boolean;  // true = LK kann eigene Zuordnung ändern
  rollenZuordnung?: {
    bewerbungsprozess: 'betreuend' | 'beurteilend' | 'beide';
    lernaufgaben: 'betreuend' | 'beurteilend' | 'beide';
    gesamteindruck: 'betreuend' | 'beurteilend' | 'beide';
    gesamtnote: 'betreuend' | 'beurteilend';
  };
}

// Rollen-Zuweisung Hierarchie:
// 1. Schul-Default (Admin legt fest)
// 2. Pro Lehrkraft (Admin kann individuell abweichen)
// 3. Selbständerung (Lehrkraft passt eigene Rolle an)
// Priorität: Selbständerung > Pro Lehrkraft > Schul-Default
```

**Typische Konfigurationen:**

| Schultyp | Betreuende LK | Beurteilende LK |
|----------|---------------|-----------------|
| Default | Alles | - |
| Getrennt | Bewerbung, Praktikum | Lernaufgaben, Note |
| Komplex | Teil 1 | Teil 2, Note |

---

## Bundesland-Unterschiede (Recherche nötig)

### Bayern (bekannt)

- Wirtschaftsschule: §15 WSO, 15-20 Tage
- Realschule: Betriebspraktikum Klasse 9
- Mittelschule: Berufsorientierung ab Klasse 7

### Andere Bundesländer (TODO: Recherche)

| Bundesland | Status | Besonderheiten |
|------------|--------|----------------|
| Baden-Württemberg | ❓ Recherche nötig | BORS/BOGY Programme |
| NRW | ❓ Recherche nötig | Berufsfelderkundung |
| Niedersachsen | ❓ Recherche nötig | |
| Hessen | ❓ Recherche nötig | |
| ... | | |

**Empfehlung:** Vor Expansion in neues Bundesland:
1. Rechtliche Grundlage recherchieren
2. Typische Praktikumsformen dokumentieren
3. Bundesland-Preset erstellen
4. Mit Pilotschule validieren

---

## Datenbank-Schema: Flexibel von Anfang an

### Schulkonfiguration (vereinfacht)

```sql
-- Bundesland-Presets
CREATE TABLE bundesland_config (
  id UUID PRIMARY KEY,
  bundesland VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  config JSONB NOT NULL,  -- Flexible Konfiguration
  rechtliche_texte JSONB,
  created_at TIMESTAMP
);

-- Schulart-Presets (erbt von Bundesland)
CREATE TABLE schulart_config (
  id UUID PRIMARY KEY,
  bundesland_config_id UUID REFERENCES bundesland_config,
  schulart VARCHAR(100) NOT NULL,  -- 'wirtschaftsschule', 'realschule', etc.
  name VARCHAR(100),
  config JSONB NOT NULL,  -- Überschreibt Bundesland-Config
  created_at TIMESTAMP
);

-- Einzelne Schule (erbt von Schulart)
CREATE TABLE schule (
  id UUID PRIMARY KEY,
  schulart_config_id UUID REFERENCES schulart_config,
  name VARCHAR(200) NOT NULL,
  adresse JSONB,
  logo_url VARCHAR(500),
  config JSONB,  -- Überschreibt Schulart-Config (nur Abweichungen)
  glossar JSONB, -- Schulspezifische Begriffe
  created_at TIMESTAMP
);

-- Schuljahr/Jahrgang (erbt von Schule)
CREATE TABLE schuljahr (
  id UUID PRIMARY KEY,
  schule_id UUID REFERENCES schule,
  jahr VARCHAR(10),  -- '2024/25'
  praktikum_zeitraeume JSONB,
  ferien JSONB,
  config JSONB,  -- Überschreibt Schul-Config (nur Abweichungen)
  created_at TIMESTAMP
);
```

### Config-Auflösung (Code)

```typescript
async function getEffectiveConfig(schuljahrId: string): Promise<FullConfig> {
  const schuljahr = await db.schuljahr.findUnique({ id: schuljahrId });
  const schule = await db.schule.findUnique({ id: schuljahr.schuleId });
  const schulart = await db.schulartConfig.findUnique({ id: schule.schulartConfigId });
  const bundesland = await db.bundeslandConfig.findUnique({ id: schulart.bundeslandConfigId });

  // Merge: Bundesland → Schulart → Schule → Schuljahr
  return deepMerge(
    bundesland.config,
    schulart.config,
    schule.config,
    schuljahr.config
  );
}
```

---

## Checkliste für Entwicklung

Bei JEDER neuen Funktion fragen:

- [ ] Ist dieser Wert hardcoded? → Konfigurierbar machen!
- [ ] Gilt das für alle Schularten? → Feature-Flag einbauen!
- [ ] Ist der Text/Begriff universell? → Ins Glossar!
- [ ] Ist die Regel bundesland-spezifisch? → In Bundesland-Config!

---

## Roadmap

### Phase 1: MVP (Wirtschaftsschulen Bayern)
- Grundlegende Konfigurierbarkeit einbauen
- Hardcoded Werte in Config auslagern
- 3-5 Pilotschulen

### Phase 2: Bayern-weit
- Realschul-Preset erstellen
- Mittelschul-Preset erstellen
- Bundesland-Config für Bayern finalisieren

### Phase 3: Weitere Bundesländer
- Recherche pro Bundesland
- Bundesland-Presets erstellen
- Regionale Partner finden

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version |
| 2024-12-09 | ERWEITERT: Zeiträume & Deadlines mit Datenmodell |
| 2024-12-09 | NEU: Attest-Frist konfigurierbar |
| 2024-12-09 | NEU: Erinnerungsintervalle konfigurierbar (3→5→7 Default, Beurteilung 3→7→10) |
| 2024-12-09 | NEU: Bewertungs-Deadline konfigurierbar |
| 2024-12-09 | NEU: Abschnitt 9 – Vertragsprozess-Konfiguration (Account bei Schulleitung) |
| 2024-12-09 | NEU: Abschnitt 10 – Bewertungs-Konfiguration (mehrere Lehrkräfte, Rollen-Zuweisung) |
| 2024-12-09 | NEU: Verfügbarkeits-Anfrage Vorlauf konfigurierbar (4 Wochen Default) |
| 2024-12-09 | NEU: Rollen-Zuweisung mit 3 Ebenen (Schul-Default, Pro LK, Selbständerung) |

