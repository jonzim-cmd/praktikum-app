# practical - Praktikumsverwaltungs-App für bayerische Wirtschaftsschulen

## Inhaltsverzeichnis

1. [Corporate Identity / Branding](#corporate-identity--branding)
2. [Rollen und Beziehungen](#rollen-und-beziehungen)
3. [Admin-Rollen](#admin-rollen)
4. [Gesetzliche Anforderungen](#gesetzliche-anforderungen)
5. [Phase: Bewerbung](#phase-bewerbung)
6. [Phase: Von Zusage bis Praktikumsstart](#phase-von-zusage-bis-praktikumsstart)
7. [Phase: Praktikum](#phase-praktikum)
8. [Phase: Direkte Nachbereitung eines abgeleisteten Praktikums](#phase-direkte-nachbereitung-eines-abgeleisteten-praktikums)
9. [Phase: Nachholen versäumter Tage](#phase-nachholen-versäumter-tage)
10. [Hinweise Phasen / Unklarheiten](#hinweise-phasen--unklarheiten)

---

## Corporate Identity / Branding

### App-Name
**practical**

### Logo
Drei überlappende Kreise in den Hauptfarben (Grün, Orange, Lila/Blau)

### Farbpalette

| Farbe | Hex-Code | Verwendung |
|-------|----------|------------|
| Lila/Blau | #6366F1 | Schüler |
| Grün | #34D399 | Lehrer |
| Orange | #FF6B35 | Betrieb |
| Rot/Magenta | #E11D48 | Akzent |
| Grau (Hintergrund) | #52525B | Hintergrund |

### Button-Styles
- Lila Button (Primary)
- Grün Button (Secondary)
- Orange Button (Tertiary)
- Rot Button (Warning/Danger)

---

## Rollen und Beziehungen

### Hauptrollen

Es gibt drei Rollen:
- Schüler zu Lehrer
- Schüler zu Betrieb
- Lehrer zu Betrieb

### Beziehungsdiagramm

```
┌──────────┐     ┌──────────┐
│  Schüler │     │  Schüler │
│  (lila)  │     │  (lila)  │
└────┬─────┘     └────┬─────┘
     │                │
     ▼                ▼
┌──────────┐     ┌──────────┐
│  Lehrer  │     │  Betrieb │
│  (grün)  │     │ (orange) │
└──────────┘     └──────────┘

┌──────────┐
│  Lehrer  │
│  (grün)  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  Betrieb │
│ (orange) │
└──────────┘
```

### Admin-Rollen (separiert)

- Superadmin (lila)
- Schuladmin (pink)

---

## Admin-Rollen

### Phase Gesamtzeitraum / Superadmin/Admin

#### Superadmin

- Legt Schulen an
- Entwickleraufgaben

#### Schuladmin

- Kann Schüler importieren
- Lehreraccounts importieren
- Lehrer und Schülerzuordnung vornehmen
- ggf. Betriebe anlegen (sollte vom System automatisch passieren)

---

## Gesetzliche Anforderungen

### § 15 Fachpraktische Tätigkeiten

**(1)** In den Jahrgangsstufen 8 bis 10 der drei- und vierstufigen Wirtschaftsschule erfolgen während der Unterrichtszeit Fachpraktische Tätigkeiten von insgesamt 20 Tagen, in den Jahrgangsstufen 10 und 11 der zweistufigen Wirtschaftsschule von insgesamt 15 Tagen in einer außerschulischen Einrichtung oder Schulwerkstätte. Die Vor- und Nachbereitung der Fachpraktischen Tätigkeiten soll in geeigneten Unterrichtsfächern in der Unterrichtszeit nach dem schuleigenen Konzept für die Fachpraktischen Tätigkeiten erfolgen.

**(2)** Die Verteilung der Zeiträume der Fachpraktischen Tätigkeiten auf die Jahrgangsstufen legt die Schulleiterin oder der Schulleiter in Absprache mit der Lehrerkonferenz fest. In der Regel erfolgen die Fachpraktischen Tätigkeiten in Blockform und erstrecken sich über den ganzen Tag. Die §§ 3 und 5 des Arbeitszeitgesetzes (ArbZG) oder die §§ 4, 8, 11 und 13 bis 18 des Jugendarbeitsschutzgesetzes (JArbSchG) sind zu beachten.

**(3)** Die Fachpraktischen Tätigkeiten sollen in mindestens zwei unterschiedlichen Einrichtungen abgeleistet werden.

**(4)** 
1. Versäumte Tage der Fachpraktischen Tätigkeiten sind außerhalb der Unterrichtszeit nachzuholen. 
2. Wurden im Abschlussjahr die Fachpraktischen Tätigkeiten bis zum Beginn der schriftlichen Abschlussprüfung nicht vollumfänglich abgeleistet, erfolgt zunächst eine vorläufige Zulassung zur Abschlussprüfung. 
3. Versäumte Tage sind bis zum Ende des Schuljahres abzuleisten. 
4. In Härtefällen entscheidet die Schulleiterin oder der Schulleiter auf Vorschlag der Klassenkonferenz. 
5. Über die Anzahl der Tage von Schülerinnen und Schülern, die nach § 4 Abs. 2 und 3 oder § 8 eingeschult sind, entscheidet die Schulleiterin oder der Schulleiter auf Vorschlag der Klassenkonferenz.

**(5)** 
1. Die Leistung der Schülerinnen und Schüler in den Fachpraktischen Tätigkeiten wird durch die Schule mit einer Note bewertet, wobei von der Schule für die Einschätzung der Leistung ein Beitrag der Einrichtung eingeholt wird. 
2. Die Schule stellt der jeweiligen Einrichtung einen Bewertungsbogen zur Verfügung. 
3. In Jahrgangsstufe 8 bildet die Note der Fachpraktischen Tätigkeiten eine Teilleistung im Fach Ökonomische Bildung, in den anderen Jahrgangsstufen eine Teilleistung im Fach Übungsunternehmen. 
4. Die Note ist einfach zu gewichten.

**(6)** Bei Schülerinnen und Schülern mit sonderpädagogischem Förderbedarf kann die Schule von Abs. 1 Satz 1 und den Abs. 2 bis 4 abweichende Regelungen treffen.

---

## Phase: Bewerbung

### Schüler

1. Wird informiert, dass er sich die App runterladen soll.

2. Lädt sich die practical App runter. Er ist Smartphone Nutzer und wird die App hauptsächlich **mobile** benutzen.

3. öffnet die App und erhält **Intro** (Infos zum Praktikum)

4. er gelangt zum Dashboard. Welche **Aufgaben** stehen als nächstes an? Er erkennt, in welcher **Phase** er gerade ist.

5. bewirbt sich und muss Nachweise bringen, dass er sich beworben hat (Screenshots von Mails zb). **Übersicht** von seinen Bewerbungen mit **Stammdaten** von Betrieb (Name des Betriebs, Ansprechpartner, Adresse) und **Status** (offen, abgelehnt, Gespräch,...)

6. bekommt automatisch wöchentlich **Erinnerungen** an seine Aufgaben und auch, wenn es in die nächste Bewerbungsphase geht (kritischer!)

7. erhält Zusage vom Betrieb (über Mail etc.). Der Status der Bewerbung in der Übersicht wird auf Zusage geändert. Er muss auf Bewilligung von Lehrer Betreuer warten. **Zeitraum** für Praktikum eintragen. Es kann sein, dass die Zusage nur für die erste x Tage ist und für die zweiten x Tage, muss immer noch eine Stelle gesucht werden.

8. Dashboard verändert sich: Was sind die neuen Aufgaben?
   - **Praktikumsvertrag** erstellen
   - PDF Vertrag runterladen oder Ausdruck von Lehrkraft anfordern
   - Unterschreiben von Betrieb, Eltern und Schule
   
   Schüler kann weiterhin in Bewerbungsphase stecken und gleichzeitig in Vertragsprozess, wenn er in

### Lehrer

1. Wird informiert, dass es die practical App gibt.

2. Lädt sich die practical App runter. Er wird die App sowohl **mobile** als auch **desktop** nutzen.

3. öffnet die App

4. er gelangt zum Dashboard. Er sieht, welche Schüler er **betreut**. Die aktuelle **Phase**. **Terminvereinbarung** möglich.

5. Kann **Details** bei jedem Schüler einsehen. **Übersicht** von den Bewerbungen mit **Stammdaten** von Betrieb (Name des Betriebs, Ansprechpartner, Adresse) und **Status** (offen, abgelehnt, Gespräch,...)

6. schicken personalisierte **Erinnerungen** an Schüler

7. erhält Nachricht, wenn ein Schüler eine Zusage bekommen hat. Er muss das Praktikum bewilligen und Vertragsprozess freischalten. Wenn Vertrag bewilligt, geht automatisch E-Mail-Nachricht mit Accountdaten an Betrieb raus. Lehrer wird davor gewarnt. Kann E-Mail auch später manuell anstoßen.

8. Schule unterzeichnet Vertrag und Lehrer lädt unterschrieben, fertigen Vertrag hoch.

### Betrieb

1. Erhält nach Bestätigung der Zusage durch Lehrkraft einen Account. Erhält diesen Account über eine E-Mail-Nachricht, die von der Lehrkraft verschickt wird. Kann App verwenden oder Browserlink

2. Sieht seine Praktikannten, Praktikumsstart und Ende, Kontaktdaten Schüler, Kontaktdaten betreuende Lehrkraft, kann Vertrag einsehen

3. Kann anfallende Aufgaben mit Hinweis ab wann einsehen, zB Check-ins und Check-outs (Anwesenheit) des Schülers (oder nur Bestätigung der Eingaben des Schülers). Beurteilungsbogen (nur Leserechte bis Praktikumsende)

4. Kann Besuchstermine des Lehrers bestätigen, ablehnen, Alternativen vorschlagen

---

## Phase: Von Zusage bis Praktikumsstart

### Schüler

1. Muss Aufgaben bearbeiten (z.B. Erwartungen an das Praktikum und Beobachtungsaufträge formulieren). Aber nur, wenn im System freigeschaltet.

2. Wird an Aufgaben erinnert in bestimmten Abständen vor Deadline.

3. Gibt Aufgaben ab.

### Lehrer

1. Diese Phase hängt von Schüler ab. Andere zu betreuende Schüler können sich noch in der Bewerbungsphase befinden

2. Kann Aufgabe einsehen.

3. Kann individuell an Aufgaben erinnern.

4. Kann abgegebene Aufgaben bewerten, z.B. grobe Skala. Kann abgegeben Aufgaben wieder zur Bearbeitung öffnen.

5. Kann Besuchstermine für Besuch im Betrieb dem Betrieb vorschlagen. Hat einen Kalender als Übersicht.

6. Sieht eine Karte mit allen Standorten der Betriebe seiner Praktikanten mit bestätigten Zusagen, sieht

### Betrieb

1. Kann abgegebene Aufgaben einsehen sofern dafür freigeschaltet

---

## Phase: Praktikum

### Schüler

1. Schüler checkt sich zum Tagesstart ein und zum Tagesende aus. Schüler meldet sich krank und lädt Arbeitsunfähigkeitsbescheinigung hoch.

2. Schüler bearbeitet Aufgaben während Praktikum, sofern Aufgaben angelegt und freigeschaltet wurden (z.B. Beobachtungsauftrag)

3. Schüler erhält ggf. Gamification Tageschallenges, sofern freigeschaltet

4. Schüler sieht weiterhin den Zeitraum des Praktikums und seinen Fortschritt. Und hat weiterhin Gesamtüberblick der Phasen und Etappen insgesamt.

### Lehrer

1. Kann Anwesenheiten der Schüler einsehen. Atteste einsehen und einfordern.

2. Kann Besuchstermine für Besuch im Betrieb dem Betrieb vorschlagen. Hat einen Kalender als Übersicht.

3. Sieht eine Karte mit allen Standorten der Betriebe seiner Praktikanten mit bestätigten Zusagen, sieht

### Betrieb

1. Betrieb führt check in und check out durch oder bestätigt die Eingaben des Schülers. Bei Bestätigung: Sieht offene Aufgabe: Anwesenheit für Tag x bestätigen

2. Kann Besuchstermine des Lehrers bestätigen, ablehnen, Alternativen vorschlagen

---

## Phase: Direkte Nachbereitung eines abgeleisteten Praktikums

### Schüler

1. Schüler erhält neue Aufgaben: Muss Reflexionsbogen ausfüllen. Muss zB Bewerbungsmappe hochladen, sofern diese Aufgabe freigeschaltet und erstellt ist

2. Wird an Aufgaben erinnert.

3. kann Praktikum und Betrieb bewerten bzw. weiterempfehlen

### Lehrer

1. Kann neue offene Aufgabe von Schüler und Betrieb einsehen und erkennen, wenn Schüler/Betrieb sie abgibt.

2. Kann abgegebene Aufgabe von Schüler und Betribe wieder öffnen und beurteilen. Kann angeben, keine Beurteilung möglich, weil Schüler zB im Praktikum vollständig krank. Sinnvoll, dass dann diese Aufgaben freigeschaltet werden? Wahrscheinlich nicht.

3. Kann an Aufgaben individuell erinnern.

### Betrieb

1. Erhält neue Aufgabe: Schülerbeurteilung, kann diese Aufgabe auch bereits in der letzten Phase des Praktikums erhalten. Muss nicht unbedingt nach Ende.

2. Kann Aufgaben einsehen und abgeben.

3. Erhält Mitteilung, wenn Schüler Praktikum weiterempfiehlt

4. Erhält Möglichkeit Feedback zur App und zum Prozess zu geben.

5. Erhält Option in die dauerhafte Datenbank aufgenommen zu werden, sodass die App künftigen Schülern die Möglichkeit eines Praktikums dort vorschlägt. Erhält Hinweisung zur Löschung und Datenschutz

---

## Phase: Nachholen versäumter Tage

### Schüler

Noch unklar. Siehe "Hinweise Phasen"

### Lehrer

Noch unklar. Siehe "Hinweise Phasen"

### Betrieb

Noch unklar. Siehe "Hinweise Phasen"

---

## Hinweise Phasen / Unklarheiten

1. **Schüler können sich in mehrere Phasen gleichzeitig befinden.** z.B. Bewerbungsphase und in Vertragsprozess

2. **Unklar:** Kann Schüler sich auch während des Praktikums in anderen Phasen befinden? Theoretisch ja, aber sinnvoll?

3. **Wie bewahrt man Übersichtlichkeit und Klarheit für alle Rollen, insbesondere Schüler und Betriebe?**

4. **Was passiert, wenn Aufgaben durch Betrieb oder Schüler nicht bearbeitet werden? Wie wird nächste Aufgabe freigeschaltet?**

5. **Wie Vorgehen bei nachzuholenden versäumten Tagen außerhalb der Schulzeit?** Wird nicht betreut von der Lehrkraft, aber das App für jeden Schüler ein vollständiges Bild bietet, muss auch dies getrackt werden. Separater Reiter, wo ein Nachweisbogen heruntergeladen und hochgeladen werden kann, das Praktikum von x Tagen abgeleistet wurde mit Betriebsdaten, Tage und Bestätigung Betrieb? Möglichkeit der Beurteilung geben?

---

## Zusammenfassung der Kernfunktionen

### Für Schüler
- Mobile-First App-Nutzung
- Dashboard mit aktueller Phase und Aufgaben
- Bewerbungsverwaltung mit Status-Tracking
- Automatische Erinnerungen
- Vertragsprozess digital abwickeln
- Check-in/Check-out während Praktikum
- Krankmeldung mit AU-Upload
- Aufgaben bearbeiten und abgeben
- Reflexion und Bewertung nach Praktikum

### Für Lehrer
- Desktop und Mobile Nutzung
- Übersicht aller betreuten Schüler
- Bewerbungs- und Status-Einsicht
- Praktikum bewilligen und Vertrag freischalten
- Besuchstermine koordinieren
- Kartenansicht aller Praktikumsbetriebe
- Aufgaben erstellen, einsehen, bewerten
- Erinnerungen versenden
- Anwesenheitskontrolle

### Für Betriebe
- Browser oder App-Nutzung
- Account nach Zusage-Bestätigung
- Praktikanten-Übersicht
- Anwesenheit bestätigen
- Besuchstermine koordinieren
- Beurteilungsbogen ausfüllen
- Feedback geben
- Option zur Aufnahme in Praktikumsdatenbank

### Für Admins
- **Superadmin:** Schulen anlegen, Entwickleraufgaben
- **Schuladmin:** Import von Schülern/Lehrern, Zuordnungen, Betriebe verwalten