import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MockStorage } from '@/lib/mock-storage';
// import { db, portfolioSettings } from '@/lib/db';
// import { eq } from 'drizzle-orm';
import { defaultPortfolioSettings } from '@/types/portfolio';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get settings from persistent mock storage
    const settings = MockStorage.getPortfolioSettings(session.user.id);
    return NextResponse.json(settings);
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();

    // Update settings in persistent mock storage
    MockStorage.setPortfolioSettings(session.user.id, settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update portfolio settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}