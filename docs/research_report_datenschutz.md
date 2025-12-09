# GDPR compliance for German school internship apps

A school internship management SaaS targeting Bavarian Wirtschaftsschulen can achieve solid legal compliance without excessive complexity by understanding one core principle: **most student data processing relies on legal mandate, not consent**. Public schools process data under Article 6(1)(e) DSGVO (public task) combined with state school laws—specifically Art. 85 BayEUG and BaySchO in Bavaria. This eliminates consent fatigue for core functionality while requiring genuine consent only for truly optional features like website photos.

The primary compliance challenges center on three areas: handling health data (sick notes) correctly, structuring the Auftragsverarbeitungsvertrag (AVV) with each school, and building state-configurable elements for eventual expansion beyond Bavaria. German-hosted infrastructure (Hetzner) simplifies third-country transfer analysis, and careful architecture choices can eliminate cookie consent banners entirely.

---

## Legal bases: consent is rarely the answer

**Article 6(1)(e) DSGVO is the primary legal basis** for processing student data at German public schools—not consent. Schools perform a public educational mandate, making legitimate interest (Art. 6(1)(f)) explicitly unavailable and consent legally problematic because students cannot freely refuse data processing necessary for education.

The BfDI (Federal Data Protection Authority) and Bavarian guidance confirm this hierarchy:
- **Art. 6(1)(e) + Art. 85 BayEUG**: Core educational data processing (attendance, grades, internship assignments)
- **Art. 6(1)(c)**: Specific statutory requirements (statistics, reporting obligations)
- **Art. 6(1)(b)**: Contract performance between school and businesses for internship agreements
- **Art. 6(1)(a) consent**: Only for processing beyond legal mandate (website photos, optional features)

For **business/employer data**, Article 6(1)(b) (contract) applies for the internship placement relationship, supplemented by Article 6(1)(f) (legitimate interest) for maintaining a provider database—businesses, unlike schools, can rely on legitimate interest.

| Processing Activity | Legal Basis | Consent Needed? |
|---------------------|-------------|-----------------|
| Student enrollment data | Art. 6(1)(e) + Art. 85 BayEUG | No |
| Internship placements | Art. 6(1)(e) + Art. 6(1)(b) | No |
| Attendance tracking | Art. 6(1)(e) | No |
| Performance evaluations | Art. 6(1)(e) | No |
| Sick note dates (not diagnosis) | Art. 6(1)(e) + Art. 9(2)(g) | No |
| Website photos | Art. 6(1)(a) | Yes |
| Optional push notifications | Art. 6(1)(a) | Yes |

---

## Age thresholds create a dual-consent system in Bavaria

Germany retained the **16-year threshold** for digital services consent under GDPR Article 8, but Bavarian school regulations create a more nuanced picture for minors:

- **Under 14**: Parents consent alone
- **14-17**: **Both** parent AND student must consent (Bavarian dual-consent requirement)
- **16+**: Student can consent independently for digital services (Art. 8 DSGVO)
- **18+**: Student alone, previous parental consents should be refreshed

This creates a practical issue: when a student turns 18 during school, consents previously obtained from parents may no longer be valid. The app should flag students approaching 18 for consent renewal directly from the now-adult student.

**Critical distinction**: Schools cannot "consent on behalf of" students. Instead, they have *legal authority to process* under school laws—a separate basis that doesn't require individual consent. For processing based on Art. 6(1)(e), only an information notice is required, not consent collection.

---

## Health data requires careful handling but not paralysis

Sick notes (Atteste/Krankmeldungen) constitute **special category data** under Article 9 DSGVO, even without diagnosis information—the mere fact someone is ill qualifies as health data. However, schools have valid exceptions:

**Applicable Article 9(2) exceptions:**
- **Art. 9(2)(g)**: Substantial public interest (school's educational mandate)
- **Art. 9(2)(b)**: Employment/social security law obligations (for quasi-employment internship context)

**What can be processed:**
- Fact of illness (yes/no)
- Duration of incapacity
- Start and expected end dates

**What cannot be required:** Diagnosis, symptoms, or detailed medical information. German employer sick notes (AU-Bescheinigungen) deliberately exclude diagnosis on the employer copy—mirror this standard.

**Critical NRW guidance (applicable by analogy):** Medical certificates **may NOT be digitally processed**—they must remain in paper form. This means the app should track *absence dates*, but not store uploaded Atteste images. If photo upload of sick notes is offered, treat it as a temporary transmission mechanism, not permanent storage—delete after school staff acknowledge the absence.

**Access restrictions for health data:**
- Teachers: Only that illness exists, not diagnosis
- Businesses: Only if directly relevant for workplace safety
- School administration: Absence dates for records
- Health data should be stored separately with additional encryption

---

## Bavarian school law specifics shape your data model

**Art. 85 BayEUG** defines permissible student data categories explicitly:
- Name, address data, nationality
- Religious affiliation (only if required for school practice)
- Migration background (birth country, arrival year, mother tongue)
- **Leistungsdaten** (performance data)
- **Educational and vocational background data**

**BaySchO §§ 37-42** govern Schülerunterlagen (student records):

| Record Type | Retention | Notes |
|-------------|-----------|-------|
| Schülerstammblatt (master data) | **50 years** | LfD Bayern criticizes as excessive; recommends 30 max |
| Abschlusszeugnisse | **50 years** | Final certificates |
| Schullaufbahnbogen (education history) | **1 year** | After leaving school |
| Notenbögen (grade records) | **1 year** | After leaving school |
| Written performance tests | **2 years** | From end of school year when created |
| Internship documentation | **1 year** | Falls under "other essential records" |


---

## AVV contracts require school principal signature

A common compliance error: **Schulträger (school authorities) cannot sign AVVs for individual schools**. Even when Schulträger purchase licenses centrally, each school principal must sign separately because the school is the data controller under GDPR.

**Mandatory AVV elements (Art. 28 DSGVO):**
1. Subject and duration of processing
2. Nature and purpose of processing
3. Types of personal data processed
4. Categories of data subjects (students, teachers, businesses)
5. Controller rights and obligations
6. Processor obligations: instruction-bound processing, confidentiality, TOMs, sub-processor conditions, breach notification, deletion/return procedures, audit rights

**Bavarian public sector additions:**
- Explicit exclusion of data use for non-school purposes
- Prohibition on commercial use, sale, or rental of data
- Specific provisions for minors' data
- Clear data retention/deletion periods matching BaySchO requirements

**Sub-processor requirements:**
- Complete list (name, address, processing scope, data center location)
- Prior notification mechanism before changes
- Controller objection right
- Equivalent contractual obligations flowing down
- Processor remains liable for sub-processor failures

**Audit provisions:** Per LfD Bayern, processors cannot charge disproportionate fees for audits—this is a legal duty, not a premium service.

---

## Data sharing with businesses needs clear boundaries

For schools sharing student data with internship providers, the legal framework depends on school type:

**FOS with fachpraktische Ausbildung (FOBOSO § 13):**
- Built-in legal basis for assessment exchange
- Businesses provide "Beurteilungsbeitrag" (performance contribution)
- Weekly reports signed by both student and Praktikumsstelle
- School can share: basic identification data, placement details, attendance
- Business provides to school: performance assessment (middle grade value)

**Wirtschaftsschule or optional external placements:**
- No automatic legal basis for business data access
- Likely requires informed consent
- Minimize shared data to what's absolutely necessary

**Best practice for your app's role-based access:**

| Role | Access Scope |
|------|--------------|
| Teacher | Own assigned students only; absence dates but not health details |
| School Admin | All students; full attendance; limited health (dates only) |
| Business Supervisor | Only their assigned intern(s); attendance; evaluations |
| Student | Own data only |
| Parent (of minor) | Child's data until student turns 18 |

---

## Data subject requests route through schools, not your app

**Schools remain data controllers**—your SaaS is the processor. This has important implications:

- **Data subject requests go to schools**: Processor must forward requests immediately (Art. 28(3)(e))
- **Response deadline**: 1 month, starting when request reaches processor
- **Students 14+**: Have independent right to inspect their own records (§ 41 BaySchO)
- **Parents**: Retain access rights until student reaches 18; limited access until 21 for specific purposes

**Right to deletion conflicts with retention:**
- Art. 17(3)(b) DSGVO: Deletion not required when legal retention obligations exist
- Students cannot demand early deletion of legally-required records
- After retention expires: must delete (or offer to state archives)

**Right to portability is largely inapplicable:**
- Art. 20(3) explicitly excludes processing for public interest tasks
- Schools perform public educational functions
- However, Art. 15 access right still requires providing data copies

---

## Technical architecture can eliminate cookie banners

**§25 TTDSG** requires consent only for non-essential cookies. A school SaaS can operate without cookie banners if architected correctly:

**Essential (no consent needed):**
- Session cookies for login authentication
- CSRF tokens for form security
- Load balancing cookies
- Cookie consent preference storage

**Requires consent:**
- Analytics with cookies or user identification
- Third-party embedded content (YouTube, Google Maps)
- Marketing/tracking pixels

**Architecture for banner-free operation:**
1. **Analytics**: Use Plausible Analytics (German Hetzner servers, no cookies, no personal data) or cookieless Matomo
2. **Maps**: SmartMaps (German company, no consent needed) or self-hosted OpenStreetMap proxy
3. **Email**: mailbox.org or Tuta Mail (German, GDPR-native)
4. **Fonts**: Self-host instead of Google Fonts
5. **Session management**: Server-side storage instead of persistent cookies

Your Hetzner Germany hosting choice is ideal—no Schrems II issues, no CLOUD Act exposure, no Standard Contractual Clauses needed.

---

## DSFA is likely required given your data profile

A **Datenschutz-Folgenabschätzung (Data Protection Impact Assessment)** is triggered when meeting 2+ criteria from the DSK blacklist. Your app likely qualifies:

| Criterion | Your App | Impact |
|-----------|----------|--------|
| Minors' data | ✓ Students 14-18 | Trigger factor |
| Health data (Art. 9) | ✓ Sick note handling | Strong trigger |
| New technology/platform | ✓ SaaS | Trigger factor |
| Systematic processing | ✓ Regular attendance tracking | Trigger factor |

**Conclusion:** With health data + minors + systematic SaaS processing, DSFA is almost certainly required before launch. Document: identified risks, mitigation measures, necessity/proportionality assessment, and residual risk acceptance.

---

## Multi-state expansion requires configurable elements

German states have different school data laws, though GDPR provides a common baseline. **Build to Bavaria's strict standards first**, then add state-specific configurations:

**Strictest states:**
1. **Baden-Württemberg**: Most restrictive on cloud services, critical of US providers
2. **Bavaria**: Comprehensive requirements but excellent documentation
3. **Hessen**: Strong data protection tradition

**Elements requiring state configuration:**

| Feature | State Variation |
|---------|-----------------|
| Consent form templates | State-specific legal language |
| Retention periods | Per state school law |
| Parent portal features | Different requirements |
| VVT export formats | State-specific templates |
| Supervisory authority links | State DPA contact |
| Privacy notice references | Cite state law |

**Common baseline (all states):**
- GDPR/DSGVO compliance
- Art. 30 processing records (VVT)
- Art. 13/14 information notices
- TOM documentation
- 72-hour breach notification
- DPO coordination

---

## What can you skip without legal risk?

**Unnecessary "data protection theater":**
- Cookie banners (if only essential cookies used)
- Consent collection for legally-mandated processing
- Consent for basic service functionality
- Repeated consent requests for same processing
- Overly dramatic risk warnings for routine operations

**Keep and do well:**
- Layered, readable privacy notices
- Real choices for genuinely optional features
- Easy consent withdrawal mechanisms
- Clear third-party disclosure
- Audit-ready documentation

---

## Practical implementation priorities

**Before MVP:**
1. Verzeichnis von Verarbeitungstätigkeiten (VVT) for all processing activities
2. TOM documentation aligned with § 64 BDSG catalog
3. Layered privacy notice (short + full version)
4. AVV template ready for school signature
5. Role-based access control matching § 38 BaySchO

**Before launch:**
1. DSFA completion (given health data + minors)
2. Sub-processor documentation
3. Data subject request routing workflow
4. Breach notification procedures
5. DPO consultation process for schools

**Architecture decisions:**
- Health data in separate encrypted container
- Audit logging for all data access
- Automatic retention period flagging
- No permanent storage of Attest images
- Consent age triggers at 14, 16, 18

The goal is compliance that enables rather than blocks good UX—relying on legal bases where they exist, collecting consent only where truly required, and building technical architecture that minimizes regulatory overhead from the start.