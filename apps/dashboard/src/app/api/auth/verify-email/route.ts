import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      );
    }

    // Find valid verification token
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, email.toLowerCase()),
          eq(verificationTokens.token, token),
          gt(verificationTokens.expires, new Date())
        )
      )
      .limit(1);

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's email verification status using transaction
    await db.transaction(async (tx) => {
      // Mark email as verified
      await tx
        .update(users)
        .set({ 
          emailVerified: new Date(),
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Delete the used verification token
      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, email.toLowerCase()));
    });

    return NextResponse.json({
      message: 'Email has been verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}