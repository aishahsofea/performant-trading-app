import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, users, userProfiles } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user profile (optional)
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      id: user.id,
      name: user.name || '',
      email: user.email,
      image: user.image,
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, timezone, avatarUrl } = body;

    // Update user table
    await db
      .update(users)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    // Upsert user profile
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
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
        .where(eq(userProfiles.userId, session.user.id));
    } else {
      // Create new profile
      await db.insert(userProfiles).values({
        userId: session.user.id,
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