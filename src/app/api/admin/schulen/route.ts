import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schools } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSchools = await db.select().from(schools);
    return NextResponse.json(allSchools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Schulen' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, address, email, phone, website, internshipDays } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name und Slug sind erforderlich' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(schools)
      .where(eq(schools.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Eine Schule mit diesem Slug existiert bereits' },
        { status: 400 }
      );
    }

    const [school] = await db
      .insert(schools)
      .values({
        name,
        slug,
        address: address || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        config: {
          internshipDays: internshipDays || 15,
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

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Fehler beim Anlegen der Schule' },
      { status: 500 }
    );
  }
}
