import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { validateAndNormalizeEmail } from '@/lib/email-validation';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate and normalize email
    const emailValidation = validateAndNormalizeEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const normalizedEmail = emailValidation.normalizedEmail!;

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    // Always return success to prevent user enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link.' }
      );
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Delete any existing reset tokens for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, normalizedEmail));

    // Insert new reset token
    await db.insert(verificationTokens).values({
      identifier: normalizedEmail,
      token: resetToken,
      expires: expiresAt,
    });

    // TODO: Send password reset email
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);

    return NextResponse.json({
      message: 'If an account with that email exists, you will receive a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}