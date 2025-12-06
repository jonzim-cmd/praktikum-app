import type { UserRole } from '@/lib/db/schema/users';

/**
 * Generates a placeholder email for users who sign up with username only.
 * This is needed because Better Auth requires an email field.
 *
 * Format: {username}@{schoolSlug}.praktikum.intern
 *
 * The user never sees this email - they log in with their username.
 */
export function generatePlaceholderEmail(username: string, schoolSlug?: string): string {
  const slug = schoolSlug || 'default';
  return `${username.toLowerCase()}@${slug}.praktikum.intern`;
}

/**
 * Checks if an email is a placeholder email (not a real email address)
 */
export function isPlaceholderEmail(email: string): boolean {
  return email.endsWith('.praktikum.intern');
}

/**
 * Creates the full name from first and last name
 */
export function createFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Data required to create a new user via Better Auth
 */
export interface CreateUserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  schoolSlug?: string;
}

/**
 * Transforms our user data format to Better Auth's expected format
 */
export function toBetterAuthSignUpData(data: CreateUserData) {
  return {
    email: generatePlaceholderEmail(data.username, data.schoolSlug),
    password: data.password,
    name: createFullName(data.firstName, data.lastName),
    username: data.username,
    // Additional fields that Better Auth will store
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    schoolId: data.schoolId,
  };
}
