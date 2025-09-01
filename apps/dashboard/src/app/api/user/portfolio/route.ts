import { NextRequest, NextResponse } from 'next/server';
import { db, portfolioSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { defaultPortfolioSettings } from '@/types/portfolio';
import { requireAuth } from '@/lib/auth/server';

export async function GET() {
  try {
    // Use new authorization system
    const { user: authUser } = await requireAuth(["user", "admin", "premium"]);

    // Get portfolio settings from database
    const [settings] = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.userId, authUser.id))
      .limit(1);

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json(defaultPortfolioSettings);
    }

    return NextResponse.json(settings.settings);
  } catch (error) {
    console.error('Failed to get portfolio settings:', error);
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

    const settings = await request.json();

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(portfolioSettings)
      .where(eq(portfolioSettings.userId, authUser.id))
      .limit(1);

    if (existingSettings.length > 0) {
      // Update existing settings
      await db
        .update(portfolioSettings)
        .set({
          settings,
          updatedAt: new Date(),
        })
        .where(eq(portfolioSettings.userId, authUser.id));
    } else {
      // Create new settings
      await db.insert(portfolioSettings).values({
        userId: authUser.id,
        settings,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update portfolio settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}