import { NextRequest, NextResponse } from 'next/server';
import { db, users, userProfiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function GET() {
  try {
    // Use new authorization system
    const { user: authUser } = await requireAuth(["user", "admin", "premium"]);

    // Get user data from database
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user profile (optional)
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userRecord.id))
      .limit(1);

    return NextResponse.json({
      id: userRecord.id,
      name: userRecord.name || '',
      email: userRecord.email,
      image: userRecord.image,
      bio: profile?.bio || '',
      timezone: profile?.timezone || 'America/New_York',
      avatarUrl: profile?.avatarUrl,
    });
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Use new authorization system
    const { user: authUser } = await requireAuth(["user", "admin", "premium"]);

    const body = await request.json();
    const { name, bio, timezone, avatarUrl } = body;

    // Update user table
    await db
      .update(users)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, authUser.id));

    // Upsert user profile
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, authUser.id))
      .limit(1);

    if (existingProfile.length > 0) {
      // Update existing profile
      await db
        .update(userProfiles)
        .set({
          bio,
          timezone,
          avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, authUser.id));
    } else {
      // Create new profile
      await db.insert(userProfiles).values({
        userId: authUser.id,
        bio,
        timezone,
        avatarUrl,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}