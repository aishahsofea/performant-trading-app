import { NextRequest, NextResponse } from 'next/server';
import { db, tradingPreferences } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { defaultTradingPreferences } from '@/types/profile';
import { requireAuth } from '@/lib/auth/server';

export async function GET() {
  try {
    // Use new authorization system
    const { user: authUser } = await requireAuth(["user", "admin", "premium"]);

    // Get trading preferences from database
    const [preferences] = await db
      .select()
      .from(tradingPreferences)
      .where(eq(tradingPreferences.userId, authUser.id))
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
    // Use new authorization system
    const { user: authUser } = await requireAuth(["user", "admin", "premium"]);

    const preferences = await request.json();

    // Check if preferences already exist
    const existingPreferences = await db
      .select()
      .from(tradingPreferences)
      .where(eq(tradingPreferences.userId, authUser.id))
      .limit(1);

    if (existingPreferences.length > 0) {
      // Update existing preferences
      await db
        .update(tradingPreferences)
        .set({
          preferences,
          updatedAt: new Date(),
        })
        .where(eq(tradingPreferences.userId, authUser.id));
    } else {
      // Create new preferences
      await db.insert(tradingPreferences).values({
        userId: authUser.id,
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