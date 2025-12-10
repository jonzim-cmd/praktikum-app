# Entscheidungen: Datenschutz

> Dokumentation aller Datenschutz-Entscheidungen für practical.
> Stand: 2024-12-09

---

## Grundprinzip

**UX first, Datenschutz nur wo rechtlich nötig.**

Wir wollen kein "Datenschutz-Theater" betreiben, sondern pragmatisch das erfüllen, was rechtlich absichert. Die UX wird nur dann eingeschränkt, wenn es nicht anders geht.

---

## 1. Rechtsgrundlagen

### Kernverarbeitung ohne Einwilligung

Die meisten Datenverarbeitungen erfolgen auf Basis von **Art. 6(1)(e) DSGVO + Art. 85 BayEUG** (öffentliche Aufgabe), nicht auf Einwilligung:

| Verarbeitung | Rechtsgrundlage | Consent nötig? |
|--------------|-----------------|----------------|
| Schüler-Stammdaten | Art. 6(1)(e) + BayEUG | Nein |
| Praktikumsplatzierung | Art. 6(1)(e) + Art. 6(1)(b) | Nein |
| Anwesenheitstracking | Art. 6(1)(e) | Nein |
| Bewertungen | Art. 6(1)(e) | Nein |
| Krankmeldungs-Daten (nur Datum) | Art. 6(1)(e) + Art. 9(2)(g) | Nein |

### Verarbeitung MIT Einwilligung

| Verarbeitung | Rechtsgrundlage | Consent nötig? |
|--------------|-----------------|----------------|
| Push-Benachrichtigungen | Art. 6(1)(a) | Ja |
| Praktikumsdatenbank (Betrieb) | Art. 6(1)(a) | Ja |
| Optionale Features (V2+) | Art. 6(1)(a) | Ja |

---

## 2. Authentifizierung pro Rolle

### Schüler

| Aspekt | Entscheidung |
|--------|--------------|
| **Login-Methode** | Passwort-Login (oder SSO falls Schule hat) |
| **2FA** | Nicht erforderlich |
| **Session-Timeout** | 24h auf persönlichem Gerät |
| **Biometrie (Face ID/Touch ID)** | Optional aktivierbar in App-Einstellungen |

### Lehrkraft

| Aspekt | Entscheidung |
|--------|--------------|
| **Login-Methode** | Passwort-Login (oder SSO falls Schule hat) |
| **2FA** | Optional anbieten, Default: Aus |
| **Session-Timeout** | 7 Tage |
| **Biometrie (Face ID/Touch ID)** | Optional aktivierbar in App-Einstellungen |

**Hinweis:** Biometrie-Login (Face ID/Touch ID) wird implementiert und ist für alle Nutzer optional aktivierbar. Das ist UX-freundlich und erhöht die Sicherheit ohne Aufwand.

### Betrieb

| Aspekt | Entscheidung |
|--------|--------------|
| **Login-Methode V1** | Magic Link + E-Mail-Code ODER Passwort ODER Passkey |
| **Passkey** | Nach erstem Login anbieten ("Schneller anmelden?") |
| **2FA** | Bei Magic Link integriert (E-Mail-Code), bei Passkey nicht nötig |
| **Session-Timeout** | 90 Tage (Browser vertraut) |
| **Fallback** | Magic Link bleibt immer verfügbar |

**Passkey-Flow für Betrieb:**
```
Erster Login: Magic Link + E-Mail-Code
        │
        ▼
"Möchten Sie sich künftig schneller anmelden?"
[Passkey einrichten]  [Später]
        │
        ▼
Nächster Login: Ein Klick (Face ID / Fingerabdruck / PIN)
```

**Warum Passkeys in V1:**
- UX-Gewinn: 1 Klick statt 4-5 (E-Mail öffnen, Code kopieren...)
- Funktioniert auf allen modernen Geräten inkl. Firmenlaptops (Windows Hello PIN)
- Kein Nachteil: Magic Link bleibt als Fallback
- Aufwand überschaubar (WebAuthn-Libraries ausgereift)

### Schuladmin

| Aspekt | Entscheidung |
|--------|--------------|
| **Login-Methode** | Passwort-Login |
| **2FA** | Pflicht (TOTP oder SMS) |
| **Session-Timeout** | 24h |

### Superadmin (Entwickler)

| Aspekt | Entscheidung |
|--------|--------------|
| **Login-Methode** | Passwort + 2FA + IP-Whitelist |
| **Session-Timeout** | 8h |

---

## 3. Gesundheitsdaten (Atteste)

### Problem
Atteste sind Gesundheitsdaten (Art. 9 DSGVO). Ärztliche Atteste dürfen laut Datenschutz-Leitlinien NICHT dauerhaft digital gespeichert werden.

### Lösung

```
Schüler meldet Krankheit
        │
        ▼
System speichert NUR:
  - Abwesend: Ja
  - Von: [Datum]
  - Bis: [Datum]
  - Attest eingereicht: Ja/Nein
        │
        ▼
Schüler lädt Attest-Foto hoch (temporär)
        │
        ▼
Lehrkraft sieht Foto, klickt "Attest gesehen"
        │
        ▼
Foto wird AUTOMATISCH GELÖSCHT
        │
        ▼
Nur Vermerk bleibt: "Attest eingereicht: Ja"
```

**Wichtig:**
- Keine dauerhafte Speicherung von Attest-Bildern
- Keine Diagnose-Informationen
- Betrieb sieht nur: "Abwesend (entschuldigt)" oder "Abwesend (unentschuldigt)"

---

## 4. Externe Dienste

### Google Places API → Ersetzt durch Photon

| Aspekt | Entscheidung |
|--------|--------------|
| **Problem** | Google = US-Unternehmen = Schrems II |
| **Lösung** | Photon API (OpenStreetMap-basiert) |
| **Hosting** | Selbst gehostet auf Hetzner oder öffentliche Instanz |
| **Kosten** | Kostenlos |
| **Qualität** | Vergleichbar mit Google Places |

**Alternative falls Photon nicht reicht:** SmartMaps (deutsche Firma, kostenpflichtig)

### E-Mail-Versand

| Aspekt | Entscheidung |
|--------|--------------|
| **Primär** | Deutscher Anbieter (mailbox.org oder Tuta) |
| **Alternative** | Schul-SMTP (optional konfigurierbar) |
| **Umsetzung** | Lehrkraft kann in Profil-Einstellungen eigene SMTP-Daten eingeben |
| **Vorteil** | Mails kommen von @schule.de statt @practical.de |

**Schul-SMTP ist freiwillig** – wer es nicht einrichtet, nutzt den App-eigenen deutschen Provider.

### Analytics

| Aspekt | Entscheidung |
|--------|--------------|
| **Anbieter** | Plausible Analytics (selbst gehostet auf Hetzner) |
| **Cookies** | Keine |
| **Consent** | Nicht erforderlich |

### Maps (für Betriebsbesuche)

| Aspekt | Entscheidung |
|--------|--------------|
| **Lösung** | OpenStreetMap (selbst gehostet oder Tile-Server) |
| **Alternative** | SmartMaps (deutsch) |
| **Google Maps** | Nicht verwenden |

---

## 5. Push-Benachrichtigungen

### Consent-Handling

| Aspekt | Entscheidung |
|--------|--------------|
| **Consent-Methode** | OS-nativer Dialog (iOS/Android) |
| **Kein Extra-Screen** | OS-Dialog reicht als Consent |
| **Einstellungen** | Granulare Kontrolle in App-Einstellungen |
| **Opt-out** | Jederzeit in Einstellungen möglich |

### Kategorien (einzeln abschaltbar)

- Vertragsstatus-Updates
- Erinnerungen (Bewerbung, Aufgaben)
- Krankmeldungen (nur Lehrkraft)
- Terminbestätigungen
- Bewertungs-Anfragen

---

## 6. Datensichtbarkeit

### Betrieb sieht NUR

| Daten | Beispiel |
|-------|----------|
| Vorname + Initial | "Max M." |
| Praktikumszeitraum | 03.-14.02.2025 |
| Anwesenheitsstatus | ✓ ✓ 🤒 ✓ ✓ |
| Lehrkraft-Kontakt | Name + E-Mail |
| Eigene Beurteilung | Nach Korrektur-Freigabe |

### Betrieb sieht NICHT

- Nachname
- Adresse/Telefon des Schülers
- Atteste (nur "entschuldigt/unentschuldigt")
- Klassenbezeichnung
- Bewertungen der Lehrkraft
- Andere Schüler

---

## 7. Bewerbungs-Screenshots

### Hinweis in Datenschutzinfo

In der Datenschutzerklärung/App-Info aufnehmen:

> "Bewerbungsnachweise (Screenshots von E-Mails, Fotos von Bewerbungen) können Kontaktdaten von Betriebsmitarbeitern enthalten. Diese Daten werden ausschließlich zur Dokumentation des Bewerbungsprozesses verarbeitet und sind nur für die betreuende Lehrkraft einsehbar."

---

## 8. Internes Betrieb-Feedback

### Dokumentation im VVT

| Aspekt | Eintrag |
|--------|---------|
| **Verarbeitungszweck** | Interne Qualitätssicherung für zukünftige Praktikumsplatzierungen |
| **Rechtsgrundlage** | Art. 6(1)(e) + Art. 6(1)(f) |
| **Betroffene** | Betriebe/Ansprechpartner |
| **Empfänger** | Nur Lehrkräfte + Admin derselben Schule |
| **Speicherdauer** | Solange Schule aktiv, dann Löschung |
| **Besonderheit** | Betrieb erfährt nichts von interner Bewertung |

---

## 9. Aufbewahrungsfristen

### Automatische Löschung

| Datentyp | Frist | Trigger |
|----------|-------|---------|
| Praktikumsdokumentation | 1 Jahr | Nach Schulabgang |
| Bewertungen | 1 Jahr | Nach Schulabgang |
| Zertifikate | 1 Jahr | Nach Schulabgang |
| Attest-Fotos | Sofort | Nach "Gesehen"-Klick |
| Betrieb-Account (inaktiv) | 2 Jahre | Nach letztem Praktikant |

### Admin-Workflow

1. System markiert Datensätze als "löschfällig"
2. Admin sieht: "X Datensätze zur Löschung fällig"
3. Vor Löschung: Archiv-Export anbieten (ohne Atteste)
4. Admin bestätigt Löschung

**Details werden bei Admin-Rolle konkretisiert.**

---

## 10. Datenweitergabe Schule ↔ Betrieb

### Im Praktikumsvertrag/AVV festhalten

| Aspekt | Regelung |
|--------|----------|
| **Geteilte Daten** | Vorname + Initial, Zeitraum, Anwesenheit |
| **Zweck** | Durchführung des Praktikums |
| **Speicherdauer Betrieb** | Nur während Praktikum + 30 Tage |
| **Nach Praktikum** | Betrieb muss Daten löschen |

---

## 11. Audit-Logging

### Was wird geloggt

| Ereignis | Geloggt |
|----------|---------|
| Zugriffe auf Bewertungen | Ja |
| Zugriffe auf Krankmeldungen | Ja |
| Datenänderungen | Ja (wer, wann, was) |
| Fehlgeschlagene Login-Versuche | Ja |
| Datenexporte | Ja (wer, wann) |

### Aufbewahrung

| Log-Typ | Frist |
|---------|-------|
| Detaillierte Logs | 7 Tage |
| Aggregierte Logs | 1 Jahr |

---

## 12. Datenexporte

| Aspekt | Entscheidung |
|--------|--------------|
| **Wer kann exportieren** | Nur Admin (V1) |
| **Exporte enthalten** | Keine Atteste |
| **Logging** | Alle Exporte werden geloggt |
| **Wasserzeichen** | Nicht implementiert (übertrieben) |

---

## 13. Sub-Processors

### Zu dokumentieren im AVV

| Dienst | Anbieter | Standort | Zweck |
|--------|----------|----------|-------|
| Hosting | Hetzner | Deutschland | Infrastruktur |
| E-Mail | mailbox.org / Tuta | Deutschland | Transaktions-Mails |
| Geocoding | Photon (selbst gehostet) | Deutschland | Adress-Autocomplete |
| Analytics | Plausible (selbst gehostet) | Deutschland | Nutzungsstatistiken |
| Maps | OpenStreetMap | - | Kartenansicht |

### Zu vermeiden

- Google (Analytics, Maps, Fonts, Places)
- AWS, Azure
- Cloudflare
- US-basierte E-Mail-Provider

---

## 14. Cookie-Banner

### Entscheidung: Nicht erforderlich

**Begründung:**
- Nur technisch notwendige Session-Cookies für Login
- Keine Tracking-Cookies
- Keine Third-Party-Cookies
- Analytics ohne Cookies (Plausible)

→ Kein Cookie-Banner nötig (§25 TTDSG)

---

## 15. 18. Geburtstag

### Aktueller Stand

Für V1 gibt es keine Verarbeitungen, die auf Einwilligung basieren und bei denen der 18. Geburtstag relevant wäre:
- Kerndaten: Art. 6(1)(e) – kein Consent
- Push: OS-Dialog, keine Eltern-Einwilligung nötig

### Für zukünftige Features merken

Wenn Consent-basierte Features hinzukommen:
- System flaggt Schüler 4 Wochen vor 18. Geburtstag
- Admin/Lehrkraft sieht Hinweis
- Neuer Consent direkt vom (nun volljährigen) Schüler einholen

**TODO für V2+:** Bei jedem neuen Feature prüfen, ob Consent-Refresh bei 18. Geburtstag nötig.

---

## 16. DSFA (Datenschutz-Folgenabschätzung)

### Erforderlich: Ja

**Trigger:**
- Minderjährige Daten ✓
- Gesundheitsdaten (Krankmeldungen) ✓
- Systematische Verarbeitung ✓
- Neue Technologie (SaaS) ✓

### Inhalt (vor Launch zu erstellen)

1. Beschreibung der Verarbeitungsvorgänge
2. Bewertung der Notwendigkeit/Verhältnismäßigkeit
3. Risikobewertung für Betroffene
4. Maßnahmen zur Risikominimierung
5. Restrisiko-Akzeptanz

---

## 17. VIDIS / BayernCloud Schule (ByCS) Login

> **Ziel:** Schüler und Lehrkräfte sollen sich später mit ihren bestehenden ByCS-Zugangsdaten einloggen können – kein separates Passwort nötig.

### Was ist VIDIS?

**VIDIS** (Vermittlungsdienst für digitales Identitätsmanagement in Schulen) ist ein länderübergreifendes Projekt aller 16 Bundesländer im Rahmen des DigitalPakts Schule. Es ermöglicht Single Sign-On (SSO) für digitale Bildungsangebote.

- **Betreiber:** FWU (Institut für Film und Bild)
- **Technologie:** OpenID Connect (OIDC)
- **Reichweite:** Alle 16 Bundesländer (nicht nur Bayern!)

### Strategie für practical

| Phase | Login-Methode | Status |
|-------|---------------|--------|
| **V1 (Pilot)** | Passwort-Login | Default |
| **V2 (nach Pilot)** | Passwort + VIDIS/ByCS als Option | Geplant |

**Begründung:**
- V1 soll schnell starten ohne Abhängigkeit von Drittanbietern
- VIDIS-Anbindung erfordert Prüfprozess durch FWU (Zeitaufwand unklar)
- Nach erfolgreichem Pilot: VIDIS-Registrierung starten

### VIDIS-Anforderungen (Vorbereitung)

Damit practical später VIDIS-kompatibel ist, müssen folgende Anforderungen **bereits in V1** berücksichtigt werden:

| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| **Datenverarbeitung nur in EU** | ✅ Erfüllt | Hetzner (Deutschland) |
| **Datensparsamkeit** | ✅ Erfüllt | Nur notwendige Daten |
| **Löschung nach 18 Monaten Inaktivität** | ⚠️ Prüfen | In Löschkonzept aufnehmen |
| **Recht auf Datenübertragbarkeit** | ⚠️ Planen | Export-Funktion vorsehen |
| **AVV mit VIDIS** | ⏳ Später | Bei Anbindung abschließen |
| **OIDC-fähige Authentifizierung** | ✅ Vorbereitet | Auth-System modular halten |

### Technische Vorbereitung (WICHTIG für Implementierung)

```
┌─────────────────────────────────────────────────────────────────┐
│  AUTHENTIFIZIERUNG MODULAR IMPLEMENTIEREN                       │
│                                                                 │
│  Auth-Provider so wählen/bauen, dass später OIDC ergänzt       │
│  werden kann ohne großes Refactoring.                          │
│                                                                 │
│  Empfohlene Libraries:                                         │
│  • Better Auth (unterstützt OIDC out-of-box)                   │
│  • NextAuth/Auth.js (OIDC-Provider verfügbar)                  │
│  • Lucia (flexibel, OIDC erweiterbar)                          │
│                                                                 │
│  Login-Screen vorbereiten:                                      │
│  • Platz für "Login mit ByCS"-Button vorsehen                  │
│  • Button in V1 ausgeblendet oder deaktiviert                  │
│  • Bei Aktivierung: OIDC-Flow zu VIDIS                         │
└─────────────────────────────────────────────────────────────────┘
```

### VIDIS-Datenfluss (bei späterer Anbindung)

```
Schüler/Lehrkraft klickt "Login mit ByCS"
        │
        ▼
Weiterleitung zu VIDIS (aai.vidis.schule)
        │
        ▼
VIDIS leitet zu Landes-IdP (ByCS für Bayern)
        │
        ▼
Login mit ByCS-Zugangsdaten
        │
        ▼
VIDIS sendet OIDC-Token an practical
        │
        ▼
practical erstellt/verknüpft lokalen Account
        │
        ▼
Nutzer ist eingeloggt
```

### Welche Daten liefert VIDIS?

| Attribut | Beschreibung | Nutzung |
|----------|--------------|---------|
| `sub` | Eindeutige User-ID | Account-Verknüpfung |
| `given_name` | Vorname | Anzeige |
| `family_name` | Nachname | Anzeige |
| `email` | E-Mail (falls freigegeben) | Kontakt |
| `org_id` | Schul-Kennung | Schul-Zuordnung |
| `role` | Rolle (Schüler/Lehrer) | Berechtigungen |

**Hinweis:** Exakte Claims hängen von Landes-IdP ab. Nicht alle Felder sind garantiert.

### Vorteile der VIDIS-Anbindung

1. **Kein separates Passwort** für Schüler/Lehrer
2. **Datenschutz-Bonus:** Staatlich geprüfte Infrastruktur
3. **Skalierung:** Mit einer VIDIS-Anbindung funktioniert Login in allen 16 Bundesländern
4. **Vertrauensvorsprung:** "Login mit ByCS" signalisiert offizielle Integration
5. **Weniger Support:** Kein "Passwort vergessen" für Schul-Nutzer

### Einschränkungen

- **Nur für Schüler + Lehrkräfte:** Betriebe haben keine ByCS-Accounts
- **Abhängigkeit:** Wenn ByCS/VIDIS down ist, funktioniert dieser Login nicht
- **Fallback nötig:** Passwort-Login muss parallel existieren bleiben

### Links & Ressourcen

| Ressource | URL |
|-----------|-----|
| **VIDIS für Bildungsanbieter** | https://www.vidis.schule/bildungsanbieter/ |
| **VIDIS Prüfkriterien (2024)** | https://www.vidis.schule/wp-content/uploads/sites/10/2024/12/Pruefkriterien-VIDIS-V0.2.pdf |
| **Whitepaper Service Provider** | https://www.vidis.schule/wp-content/uploads/sites/10/2024/08/Erweiterte-Inbetriebnahmephase-Whitepaper-zur-Anbindung-an-VIDIS-fuer-Service-Provider-v60-20240813_112511.pdf |
| **ByCS Login-Info** | https://www.bycs.de/uebersicht-und-funktionen/login-mit-bycs/index.html |
| **VIDIS Datenschutz** | https://www.vidis.schule/datenschutz-bei-vidis/ |
| **FWU Projektseite** | https://fwu.de/projekte/vidis-2/ |

### TODO für V2

- [ ] VIDIS-Portal-Registrierung starten (nach erfolgreichem Pilot)
- [ ] Datenschutz-Dokumente für VIDIS vorbereiten
- [ ] Pilotvertrag mit FWU abschließen
- [ ] Technische Anbindung am Testsystem (aai-test.vidis.schule)
- [ ] "Login mit ByCS"-Button aktivieren

---

## Noch offen

- [ ] Photon API testen und Setup dokumentieren
- [ ] DSFA erstellen
- [ ] VVT (Verzeichnis von Verarbeitungstätigkeiten) erstellen
- [ ] AVV-Template für Schulen erstellen
- [ ] Datenschutzerklärung formulieren
- [ ] TOM-Dokumentation (technisch-organisatorische Maßnahmen)

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-09 | Initiale Version mit allen Datenschutz-Entscheidungen |
| 2024-12-09 | Passkeys für Betrieb bereits in V1 (statt V2) |
| 2024-12-10 | NEU: Sektion 17 – VIDIS/ByCS-Login (SSO für Schüler/Lehrkräfte) |
| 2024-12-10 | Strategie: V1 Passwort, V2 + VIDIS als Option |
| 2024-12-10 | Technische Vorbereitung: Auth modular für spätere OIDC-Erweiterung |
| 2024-12-10 | VIDIS-Prüfkriterien und Ressourcen-Links dokumentiert |
