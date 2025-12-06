import 'dotenv/config';
import { db } from './index';
import {
  schools,
  users,
  accounts,
  students,
  studentTeachers,
  companies,
  companyContacts,
  internships,
  internshipBlocks,
  timeEntries,
  reports,
  milestones,
  sickLeaves,
} from './schema';
import { hashPassword } from 'better-auth/crypto';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  console.log('🗑️  Clearing existing data...');
  await db.delete(milestones);
  await db.delete(reports);
  await db.delete(sickLeaves);
  await db.delete(timeEntries);
  await db.delete(internshipBlocks);
  await db.delete(internships);
  await db.delete(companyContacts);
  await db.delete(companies);
  await db.delete(studentTeachers);
  await db.delete(students);
  await db.delete(accounts);
  await db.delete(users);
  await db.delete(schools);

  // Create a test school
  const [school] = await db
    .insert(schools)
    .values({
      name: 'Staatliche Wirtschaftsschule München',
      slug: 'ws-muenchen',
      address: 'Luisenstraße 29, 80333 München',
      email: 'verwaltung@ws-muenchen.de',
      phone: '+49 89 123456',
      website: 'https://ws-muenchen.de',
      config: {
        internshipDays: 15,
        requireMinTwoCompanies: true,
        modules: {
          expectations: true,
          observations: false,
          portfolio: true,
          grading: true,
        },
        notifications: {
          enabled: true,
          reminderDaysBefore: [7, 2],
          escalationDaysAfter: 1,
        },
      },
    })
    .returning();

  console.log(`✅ Created school: ${school.name}`);

  // Hash password for test users
  const passwordHash = await hashPassword('test1234');

  // ============= USERS =============

  // Super Admin
  const [superAdmin] = await db
    .insert(users)
    .values({
      name: 'Super Admin',
      email: 'admin@praktikum.intern',
      firstName: 'Super',
      lastName: 'Admin',
      username: 'admin',
      displayUsername: 'admin',
      role: 'super_admin',
      emailVerified: true,
    })
    .returning();

  await db.insert(accounts).values({
    userId: superAdmin.id,
    accountId: superAdmin.id,
    providerId: 'credential',
    password: passwordHash,
  });
  console.log(`✅ Created super admin: ${superAdmin.username}`);

  // School Admin
  const [schoolAdmin] = await db
    .insert(users)
    .values({
      name: 'Maria Schulze',
      email: 'schulze@ws-muenchen.praktikum.intern',
      firstName: 'Maria',
      lastName: 'Schulze',
      username: 'schulze',
      displayUsername: 'schulze',
      role: 'school_admin',
      schoolId: school.id,
      emailVerified: true,
    })
    .returning();

  await db.insert(accounts).values({
    userId: schoolAdmin.id,
    accountId: schoolAdmin.id,
    providerId: 'credential',
    password: passwordHash,
  });
  console.log(`✅ Created school admin: ${schoolAdmin.username}`);

  // Teachers
  const [teacher1] = await db
    .insert(users)
    .values({
      name: 'Max Mustermann',
      email: 'mustermann@ws-muenchen.praktikum.intern',
      firstName: 'Max',
      lastName: 'Mustermann',
      username: 'mustermann',
      displayUsername: 'mustermann',
      role: 'teacher',
      schoolId: school.id,
      emailVerified: true,
    })
    .returning();

  await db.insert(accounts).values({
    userId: teacher1.id,
    accountId: teacher1.id,
    providerId: 'credential',
    password: passwordHash,
  });
  console.log(`✅ Created teacher: ${teacher1.username}`);

  const [teacher2] = await db
    .insert(users)
    .values({
      name: 'Sabine Weber',
      email: 'weber@ws-muenchen.praktikum.intern',
      firstName: 'Sabine',
      lastName: 'Weber',
      username: 'weber',
      displayUsername: 'weber',
      role: 'teacher',
      schoolId: school.id,
      emailVerified: true,
    })
    .returning();

  await db.insert(accounts).values({
    userId: teacher2.id,
    accountId: teacher2.id,
    providerId: 'credential',
    password: passwordHash,
  });
  console.log(`✅ Created teacher: ${teacher2.username}`);

  // Students
  const studentData = [
    { firstName: 'Anna', lastName: 'Schmidt', username: 'schmidt.anna', classYear: '10a' },
    { firstName: 'Ben', lastName: 'Müller', username: 'mueller.ben', classYear: '10a' },
    { firstName: 'Clara', lastName: 'Weber', username: 'weber.clara', classYear: '10a' },
    { firstName: 'David', lastName: 'Fischer', username: 'fischer.david', classYear: '10b' },
    { firstName: 'Emma', lastName: 'Bauer', username: 'bauer.emma', classYear: '10b' },
    { firstName: 'Felix', lastName: 'Braun', username: 'braun.felix', classYear: '10b' },
    { firstName: 'Greta', lastName: 'Hoffmann', username: 'hoffmann.greta', classYear: '10a' },
    { firstName: 'Henri', lastName: 'Koch', username: 'koch.henri', classYear: '10b' },
  ];

  const createdStudents: Array<{ user: typeof users.$inferSelect; student: typeof students.$inferSelect }> = [];

  for (const s of studentData) {
    const [studentUser] = await db
      .insert(users)
      .values({
        name: `${s.firstName} ${s.lastName}`,
        email: `${s.username}@ws-muenchen.praktikum.intern`,
        firstName: s.firstName,
        lastName: s.lastName,
        username: s.username,
        displayUsername: s.username,
        role: 'student',
        schoolId: school.id,
        emailVerified: true,
      })
      .returning();

    await db.insert(accounts).values({
      userId: studentUser.id,
      accountId: studentUser.id,
      providerId: 'credential',
      password: passwordHash,
    });

    const [studentRecord] = await db
      .insert(students)
      .values({
        userId: studentUser.id,
        schoolId: school.id,
        classYear: s.classYear,
        schoolYear: '2024/25',
        primaryTeacherId: s.classYear === '10a' ? teacher1.id : teacher2.id,
      })
      .returning();

    createdStudents.push({ user: studentUser, student: studentRecord });
    console.log(`✅ Created student: ${s.username} (${s.classYear})`);
  }

  // ============= COMPANIES =============

  const companyData = [
    {
      name: 'Müller GmbH',
      industry: 'IT-Dienstleistungen',
      street: 'Hauptstraße 15',
      zip: '80331',
      city: 'München',
      latitude: '48.1371079',
      longitude: '11.5753822',
      contact: { firstName: 'Thomas', lastName: 'Müller', position: 'Geschäftsführer' },
    },
    {
      name: 'Schmidt & Partner',
      industry: 'Steuerberatung',
      street: 'Bahnhofstraße 8',
      zip: '80335',
      city: 'München',
      latitude: '48.1396024',
      longitude: '11.5585474',
      contact: { firstName: 'Petra', lastName: 'Schmidt', position: 'Partnerin' },
    },
    {
      name: 'Tech Solutions AG',
      industry: 'Software-Entwicklung',
      street: 'Industriepark 22',
      zip: '85748',
      city: 'Garching',
      latitude: '48.2496587',
      longitude: '11.6518861',
      contact: { firstName: 'Michael', lastName: 'Wagner', position: 'HR Manager' },
    },
    {
      name: 'Sparkasse München',
      industry: 'Bankwesen',
      street: 'Marienplatz 1',
      zip: '80331',
      city: 'München',
      latitude: '48.1374295',
      longitude: '11.5754882',
      contact: { firstName: 'Sandra', lastName: 'Berger', position: 'Ausbildungsleitung' },
    },
    {
      name: 'Autohaus Bayern',
      industry: 'Automobilhandel',
      street: 'Leopoldstraße 100',
      zip: '80802',
      city: 'München',
      latitude: '48.1634287',
      longitude: '11.5866323',
      contact: { firstName: 'Klaus', lastName: 'Huber', position: 'Serviceberater' },
    },
    {
      name: 'MediaMarkt Zentrale',
      industry: 'Einzelhandel',
      street: 'Einsteinring 28',
      zip: '85609',
      city: 'Ingolstadt',
      latitude: '48.7823165',
      longitude: '11.4305195',
      contact: { firstName: 'Julia', lastName: 'Neumann', position: 'Personalreferentin' },
    },
  ];

  const createdCompanies: Array<{ company: typeof companies.$inferSelect; contact: typeof companyContacts.$inferSelect }> = [];

  for (const c of companyData) {
    // Create company user for login
    const [companyUser] = await db
      .insert(users)
      .values({
        name: c.name,
        email: `${c.name.toLowerCase().replace(/[^a-z]/g, '')}@praktikum.intern`,
        firstName: c.contact.firstName,
        lastName: c.contact.lastName,
        username: c.name.toLowerCase().replace(/[^a-z]/g, ''),
        displayUsername: c.name.toLowerCase().replace(/[^a-z]/g, ''),
        role: 'company_user',
        schoolId: school.id,
        emailVerified: true,
      })
      .returning();

    await db.insert(accounts).values({
      userId: companyUser.id,
      accountId: companyUser.id,
      providerId: 'credential',
      password: passwordHash,
    });

    const [company] = await db
      .insert(companies)
      .values({
        schoolId: school.id,
        name: c.name,
        industry: c.industry,
        street: c.street,
        zip: c.zip,
        city: c.city,
        latitude: c.latitude,
        longitude: c.longitude,
        phone: '+49 89 ' + Math.floor(1000000 + Math.random() * 9000000),
        email: `info@${c.name.toLowerCase().replace(/[^a-z]/g, '')}.de`,
        inPool: Math.random() > 0.3,
        totalInternships: Math.floor(Math.random() * 10),
      })
      .returning();

    const [contact] = await db
      .insert(companyContacts)
      .values({
        companyId: company.id,
        userId: companyUser.id,
        firstName: c.contact.firstName,
        lastName: c.contact.lastName,
        position: c.contact.position,
        phone: '+49 89 ' + Math.floor(1000000 + Math.random() * 9000000),
        email: `${c.contact.firstName.toLowerCase()}.${c.contact.lastName.toLowerCase()}@${c.name.toLowerCase().replace(/[^a-z]/g, '')}.de`,
        isPrimary: true,
      })
      .returning();

    createdCompanies.push({ company, contact });
    console.log(`✅ Created company: ${c.name} (Login: ${companyUser.username})`);
  }

  // ============= INTERNSHIPS =============

  // Create internships for students with different statuses
  const internshipConfigs = [
    { studentIdx: 0, status: 'in_progress' as const, completedDays: 5, companyIdx: 0 },
    { studentIdx: 1, status: 'in_progress' as const, completedDays: 8, companyIdx: 1 },
    { studentIdx: 2, status: 'confirmed' as const, completedDays: 0, companyIdx: 2 },
    { studentIdx: 3, status: 'in_progress' as const, completedDays: 3, companyIdx: 3 },
    { studentIdx: 4, status: 'searching' as const, completedDays: 0, companyIdx: null },
    { studentIdx: 5, status: 'in_progress' as const, completedDays: 12, companyIdx: 0 },
    { studentIdx: 6, status: 'completed' as const, completedDays: 15, companyIdx: 4 },
    { studentIdx: 7, status: 'draft' as const, completedDays: 0, companyIdx: null },
  ];

  for (const config of internshipConfigs) {
    const studentInfo = createdStudents[config.studentIdx];

    const [internship] = await db
      .insert(internships)
      .values({
        studentId: studentInfo.student.id,
        schoolId: school.id,
        requiredDays: 15,
        status: config.status,
        completedDays: config.completedDays,
        missedDays: config.status === 'in_progress' && config.completedDays > 3 ? 1 : 0,
        finalGrade: config.status === 'completed' ? '2' : null,
        gradedAt: config.status === 'completed' ? new Date() : null,
        gradedBy: config.status === 'completed' ? teacher1.id : null,
      })
      .returning();

    console.log(`✅ Created internship for ${studentInfo.user.firstName} ${studentInfo.user.lastName} (${config.status})`);

    // Create internship block if company is assigned
    if (config.companyIdx !== null) {
      const companyInfo = createdCompanies[config.companyIdx];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - config.completedDays - 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);

      const [block] = await db
        .insert(internshipBlocks)
        .values({
          internshipId: internship.id,
          companyId: companyInfo.company.id,
          contactId: companyInfo.contact.id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          plannedDays: 10,
          contractStatus: config.status === 'searching' ? 'pending' : 'signed',
          visitScheduledAt: config.status === 'in_progress' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null,
        })
        .returning();

      // Create time entries for completed days
      for (let i = 0; i < config.completedDays; i++) {
        const entryDate = new Date(startDate);
        entryDate.setDate(entryDate.getDate() + i);
        // Skip weekends
        if (entryDate.getDay() === 0 || entryDate.getDay() === 6) continue;

        await db.insert(timeEntries).values({
          blockId: block.id,
          date: entryDate.toISOString().split('T')[0],
          studentConfirmed: true,
          studentConfirmedAt: entryDate,
          companyConfirmed: i < config.completedDays - 2, // Last 2 days not yet confirmed by company
          companyConfirmedAt: i < config.completedDays - 2 ? entryDate : null,
          checkInTime: '08:00',
          checkOutTime: '16:30',
        });
      }

      // Create weekly reports
      const reportsCount = Math.ceil(config.completedDays / 5);
      for (let i = 0; i < reportsCount; i++) {
        const reportDate = new Date(startDate);
        reportDate.setDate(reportDate.getDate() + i * 7 + 4); // Friday of each week

        await db.insert(reports).values({
          blockId: block.id,
          reportDate: reportDate.toISOString().split('T')[0],
          reportType: 'weekly',
          content: `Woche ${i + 1}: Diese Woche habe ich viel über ${companyInfo.company.industry} gelernt. Die Aufgaben waren vielfältig und interessant. Besonders spannend war die Arbeit mit ${i === 0 ? 'Kunden' : i === 1 ? 'dem Team' : 'neuen Projekten'}.`,
          companyApproved: i < reportsCount - 1,
          companyApprovedAt: i < reportsCount - 1 ? reportDate : null,
          teacherReviewed: i < reportsCount - 2,
          teacherComment: i < reportsCount - 2 ? 'Guter Bericht, weiter so!' : null,
        });
      }

      // Add sick leave for some students
      if (config.status === 'in_progress' && config.completedDays > 5) {
        const sickDate = new Date(startDate);
        sickDate.setDate(sickDate.getDate() + 3);

        await db.insert(sickLeaves).values({
          blockId: block.id,
          startDate: sickDate.toISOString().split('T')[0],
          endDate: sickDate.toISOString().split('T')[0],
          days: 1,
          hasAttest: config.completedDays > 7,
          makeUpRequired: true,
          madeUpDays: 0,
        });
      }
    }

    // Create milestones
    const milestoneTypes = [
      { type: 'applications_sent', title: 'Bewerbungen verschickt', daysFromNow: -60 },
      { type: 'internship_found', title: 'Praktikumsplatz gefunden', daysFromNow: -30 },
      { type: 'contract_signed', title: 'Vertrag unterschrieben', daysFromNow: -14 },
      { type: 'expectations_written', title: 'Erwartungen formuliert', daysFromNow: -7 },
      { type: 'first_week_documented', title: 'Erste Woche dokumentiert', daysFromNow: 7 },
      { type: 'teacher_visit_completed', title: 'Lehrkraft-Besuch erfolgt', daysFromNow: 10 },
      { type: 'portfolio_submitted', title: 'Portfolio abgegeben', daysFromNow: 21 },
    ];

    for (const m of milestoneTypes) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + m.daysFromNow);

      const isCompleted =
        config.status === 'completed' ||
        (config.status === 'in_progress' && m.daysFromNow < 0) ||
        (config.status === 'confirmed' && m.type === 'internship_found');

      await db.insert(milestones).values({
        internshipId: internship.id,
        type: m.type,
        title: m.title,
        dueDate: dueDate.toISOString().split('T')[0],
        isCompleted,
        completedAt: isCompleted ? new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000) : null,
      });
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test accounts (password: test1234):');
  console.log('');
  console.log('   👤 Admins:');
  console.log('      - admin (Super Admin)');
  console.log('      - schulze (School Admin)');
  console.log('');
  console.log('   👨‍🏫 Lehrkräfte:');
  console.log('      - mustermann (Lehrer, Klasse 10a)');
  console.log('      - weber (Lehrerin, Klasse 10b)');
  console.log('');
  console.log('   👨‍🎓 Schüler:');
  console.log('      - schmidt.anna (10a, Praktikum läuft)');
  console.log('      - mueller.ben (10a, Praktikum läuft)');
  console.log('      - weber.clara (10a, Praktikum bestätigt)');
  console.log('      - fischer.david (10b, Praktikum läuft)');
  console.log('      - bauer.emma (10b, sucht Praktikum)');
  console.log('      - braun.felix (10b, Praktikum läuft)');
  console.log('      - hoffmann.greta (10a, Praktikum abgeschlossen)');
  console.log('      - koch.henri (10b, noch nicht begonnen)');
  console.log('');
  console.log('   🏢 Betriebe:');
  console.log('      - muellergmbh');
  console.log('      - schmidtpartner');
  console.log('      - techsolutionsag');
  console.log('      - sparkassemuenchen');
  console.log('      - autohausbayern');
  console.log('      - mediamarktzentrale');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
