import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, accounts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { generatePlaceholderEmail } from '@/lib/auth/helpers';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Benutzer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, username, email, password, role, schoolId } = body;

    if (!firstName || !lastName || !username || !password || !role) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen haben' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Benutzername ist bereits vergeben' },
        { status: 400 }
      );
    }

    // Use provided email or generate placeholder
    const userEmail = email || generatePlaceholderEmail(username);

    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist bereits vergeben' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name: `${firstName} ${lastName}`,
        email: userEmail,
        firstName,
        lastName,
        username,
        displayUsername: username,
        role,
        schoolId: schoolId || null,
        emailVerified: true,
      })
      .returning();

    // Create account (for password login)
    await db.insert(accounts).values({
      userId: user.id,
      accountId: user.id,
      providerId: 'credential',
      password: passwordHash,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Fehler beim Anlegen des Benutzers' },
      { status: 500 }
    );
  }
}
