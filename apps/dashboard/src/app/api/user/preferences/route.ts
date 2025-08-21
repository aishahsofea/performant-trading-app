import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MockStorage } from '@/lib/mock-storage';
// import { db, tradingPreferences } from '@/lib/db';
// import { eq } from 'drizzle-orm';
import { defaultTradingPreferences } from '@/types/profile';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get preferences from persistent mock storage
    const preferences = MockStorage.getTradingPreferences(session.user.id);
    return NextResponse.json(preferences);
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

    // Update preferences in persistent mock storage
    MockStorage.setTradingPreferences(session.user.id, preferences);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update trading preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}