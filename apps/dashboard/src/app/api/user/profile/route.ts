import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MockStorage } from '@/lib/mock-storage';
// import { db, users, userProfiles } from '@/lib/db';
// import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile from persistent mock storage
    let profile = MockStorage.getUserProfile(session.user.id);
    
    if (!profile) {
      // Initialize with session data if profile doesn't exist
      const initialProfile = {
        id: session.user.id,
        name: session.user.name || 'Test User',
        email: session.user.email || 'test@example.com',
        image: session.user.image || null,
        bio: 'Experienced crypto trader focused on DeFi and portfolio optimization.',
        timezone: 'America/New_York',
        avatarUrl: null,
      };
      MockStorage.setUserProfile(session.user.id, initialProfile);
      profile = initialProfile;
    }

    return NextResponse.json(profile);
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

    // Update profile in persistent mock storage
    MockStorage.setUserProfile(session.user.id, {
      name,
      bio,
      timezone,
      avatarUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}