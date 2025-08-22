import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db, tradingPreferences } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { defaultTradingPreferences } from '@/types/profile';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get trading preferences from database
    const [preferences] = await db
      .select()
      .from(tradingPreferences)
      .where(eq(tradingPreferences.userId, session.user.id))
      .limit(1);

    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json(defaultTradingPreferences);
    }

    return NextResponse.json(preferences.preferences);
  } catch (error) {
    console.error('Failed to get trading preferences:', error);
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

    const preferences = await request.json();

    // Check if preferences already exist
    const existingPreferences = await db
      .select()
      .from(tradingPreferences)
      .where(eq(tradingPreferences.userId, session.user.id))
      .limit(1);

    if (existingPreferences.length > 0) {
      // Update existing preferences
      await db
        .update(tradingPreferences)
        .set({
          preferences,
          updatedAt: new Date(),
        })
        .where(eq(tradingPreferences.userId, session.user.id));
    } else {
      // Create new preferences
      await db.insert(tradingPreferences).values({
        userId: session.user.id,
        preferences,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update trading preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}