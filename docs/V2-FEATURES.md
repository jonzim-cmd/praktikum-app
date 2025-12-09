# V2 Features & Erweiterungen

> Features, die für V1 nicht priorisiert sind, aber später implementiert werden sollen.
> Stand: 2024-12-08

---

## Priorisierung

| Priorität | Bedeutung |
|-----------|-----------|
| **P1** | Sollte bald nach V1 kommen |
| **P2** | Nice-to-have, wenn Zeit |
| **P3** | Langfristig / "Irgendwann" |

---

## 1. Kommunikation & Benachrichtigungen

### 1.1 Eltern-Benachrichtigung bei Krankmeldung (P2)

**Beschreibung:**
Wenn Schüler sich krank meldet, erhalten Eltern automatisch eine Info-E-Mail.

**Voraussetzungen:**
- Eltern-E-Mail muss hinterlegt sein (optional im Schüler-Profil)
- SMTP-Konfiguration pro Schule (Schul-E-Mail als Absender)

**Implementierung:**
- Konfigurierbar pro Schule (Admin-Einstellung: aktiv/inaktiv)
- E-Mail-Template: "Ihr Kind [Name] hat sich heute krank gemeldet."
- Absender: noreply@[schule].de oder schulspezifische Adresse

**Technisch:**
- Nodemailer mit SMTP-Daten der Schule
- Oder: Externer E-Mail-Service (SendGrid, AWS SES)

---

## 2. Gamification & Engagement

### 2.1 Badges / Achievements (P3)

**Beschreibung:**
Schüler können Badges verdienen für vorbildliches Verhalten.

**Mögliche Badges:**
- "Frühstarter" – Erste Bewerbung innerhalb von 2 Wochen nach App-Start
- "Fleißig" – 5+ Bewerbungen dokumentiert
- "Pünktlich" – Alle Anwesenheiten am gleichen Tag gemeldet
- "Reflektiert" – Reflexion vor Deadline abgegeben
- "Vollständig" – Alle Pflichtaufgaben erledigt

**Anzeige:**
- Im Schüler-Profil
- Optional: Auf Zertifikat anzeigen

**Hinweis:** Gamification muss sensibel umgesetzt werden – kein Druck, kein Bloßstellen.

### 2.2 Tageschallenges während Praktikum (P3)

**Beschreibung:**
Kleine tägliche Reflexionsaufgaben während des Praktikums.

**Beispiele:**
- "Was war heute deine wichtigste Aufgabe?"
- "Nenne eine Sache, die du heute gelernt hast."
- "Bewerte deinen Tag: 😊 😐 😔"

**Optional:** Lehrkraft kann dies aktivieren/deaktivieren.

---

## 3. Betrieb-Erweiterungen

### 3.1 Betrieb ohne E-Mail / Offline-Betrieb (P2)

**Beschreibung:**
Fallback für Betriebe, die keinen digitalen Zugang haben oder nutzen wollen.

**Lösung:**
- Lehrkraft kann Betrieb als "Offline-Betrieb" markieren
- Anwesenheitsbestätigung: Lehrkraft trägt manuell ein
- Beurteilungsbogen: PDF ausdrucken, ausfüllen lassen, Lehrkraft digitalisiert
- Besuchstermine: Direkt telefonisch vereinbaren

**Wichtig:** Dies sollte die absolute Ausnahme sein. Standard ist digitaler Zugang.

### 3.2 QR-Code Check-in (P2)

**Beschreibung:**
Alternative zur manuellen Anwesenheitsbestätigung.

**Ablauf:**
- Betrieb erhält einmaligen QR-Code (pro Praktikumszeitraum)
- Schüler scannt morgens den Code
- Anwesenheit wird automatisch bestätigt (kein wöchentliches Bestätigen nötig)

**Vorteile:**
- Schneller für Betriebe
- Schwerer zu fälschen als Selbstmeldung

**Nachteile:**
- Technisch aufwändiger
- Nicht alle Betriebe haben geeigneten Ort für QR-Code

---

## 4. Reporting & Analytics

### 4.1 Lehrkraft-Exporte (P1)

**Beschreibung:**
Lehrkraft kann Übersichten exportieren (nicht nur Admin).

**Exporte:**
- Klassen-Übersicht als PDF (alle Schüler mit Status, Betrieb, Note)
- Einzelbericht pro Schüler (für Zeugnis-Beilage)

### 4.2 Schul-Statistiken (P2)

**Beschreibung:**
Aggregierte Statistiken für Schulleitung.

**Inhalte:**
- Durchschnittsnote
- Häufigste Branchen
- Durchschnittliche Bewerbungsanzahl bis Zusage
- Vergleich zu Vorjahren

### 4.3 Anonymisierte Bayern-Statistiken (P3)

**Beschreibung:**
Schulübergreifende, anonymisierte Insights.

**Voraussetzungen:**
- DSGVO-konforme Anonymisierung
- Opt-in der Schulen

---

## 5. Offline & Performance

### 5.1 Offline-Modus für Schüler (P3)

**Beschreibung:**
Schüler kann Check-in auch ohne Internet machen.

**Technisch:**
- Service Worker + IndexedDB
- Sync bei nächster Verbindung

**Bewertung:**
- Technisch aufwändig
- In 95% der Fälle hat Schüler Mobilfunk
- Workaround: Abends zu Hause nachtragen

**Entscheidung:** Nicht priorisiert, da Edge-Case.

---

## 6. Sonstige Features

### 6.1 Praktikums-Datenbank / Pool (P2)

**Beschreibung:**
Betriebe können sich in einen Pool eintragen, aus dem Schüler Praktikumsplätze finden können.

**Details:**
- Opt-in durch Betrieb (nach Praktikum gefragt)
- Zeigt: Branche, Ort, bisherige Bewertungen (anonym/aggregiert)
- Schüler können Betriebe "vormerken" oder direkt kontaktieren

### 6.2 In-App Bewerbungsversand (P3)

**Beschreibung:**
Schüler kann Bewerbung direkt aus der App versenden.

**Details:**
- Bewerbungsvorlage ausfüllen
- PDF generieren
- Per E-Mail an Betrieb senden
- Automatisch in Bewerbungsliste dokumentiert

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-08 | Initiale Version mit gesammelten V2-Features |
