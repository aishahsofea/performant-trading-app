import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dashboardPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

const defaultPreferences = {
  autoSave: true,
  theme: 'dark',
  compactMode: false,
  showTips: true,
  preferences: {},
};

export async function GET() {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);

    // Get user preferences
    const [preferences] = await db
      .select()
      .from(dashboardPreferences)
      .where(eq(dashboardPreferences.userId, user.id))
      .limit(1);

    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json(defaultPreferences);
    }

    return NextResponse.json({
      currentLayoutId: preferences.currentLayoutId,
      autoSave: preferences.autoSave,
      theme: preferences.theme,
      compactMode: preferences.compactMode,
      showTips: preferences.showTips,
      preferences: preferences.preferences,
    });
  } catch (error) {
    console.error('Failed to get dashboard preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);
    const body = await request.json();
    
    const {
      currentLayoutId,
      autoSave,
      theme,
      compactMode,
      showTips,
      preferences: additionalPrefs
    } = body;

    // Check if preferences already exist
    const [existingPreferences] = await db
      .select()
      .from(dashboardPreferences)
      .where(eq(dashboardPreferences.userId, user.id))
      .limit(1);

    if (existingPreferences) {
      // Update existing preferences
      await db
        .update(dashboardPreferences)
        .set({
          currentLayoutId: currentLayoutId !== undefined ? currentLayoutId : existingPreferences.currentLayoutId,
          autoSave: autoSave !== undefined ? autoSave : existingPreferences.autoSave,
          theme: theme || existingPreferences.theme,
          compactMode: compactMode !== undefined ? compactMode : existingPreferences.compactMode,
          showTips: showTips !== undefined ? showTips : existingPreferences.showTips,
          preferences: additionalPrefs !== undefined ? additionalPrefs : existingPreferences.preferences,
          updatedAt: new Date(),
        })
        .where(eq(dashboardPreferences.userId, user.id));
    } else {
      // Create new preferences
      await db.insert(dashboardPreferences).values({
        userId: user.id,
        currentLayoutId,
        autoSave: autoSave !== undefined ? autoSave : defaultPreferences.autoSave,
        theme: theme || defaultPreferences.theme,
        compactMode: compactMode !== undefined ? compactMode : defaultPreferences.compactMode,
        showTips: showTips !== undefined ? showTips : defaultPreferences.showTips,
        preferences: additionalPrefs || defaultPreferences.preferences,
      });
    }

    return NextResponse.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Failed to update dashboard preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}