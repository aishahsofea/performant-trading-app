import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dashboardLayouts, dashboardPreferences } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);
    const { id } = params;
    const body = await request.json();
    
    const { name, layout, isDefault } = body;

    // Check if layout belongs to user
    const [existingLayout] = await db
      .select()
      .from(dashboardLayouts)
      .where(
        and(
          eq(dashboardLayouts.id, id),
          eq(dashboardLayouts.userId, user.id)
        )
      )
      .limit(1);

    if (!existingLayout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      // If this is being set as default, unset other defaults
      if (isDefault) {
        await tx
          .update(dashboardLayouts)
          .set({ isDefault: false })
          .where(eq(dashboardLayouts.userId, user.id));
      }

      // Update layout
      await tx
        .update(dashboardLayouts)
        .set({
          name: name || existingLayout.name,
          layout: layout || existingLayout.layout,
          isDefault: isDefault !== undefined ? isDefault : existingLayout.isDefault,
          updatedAt: new Date(),
        })
        .where(eq(dashboardLayouts.id, id));

      // If this is now the default layout, update user preferences
      if (isDefault) {
        await tx
          .update(dashboardPreferences)
          .set({ 
            currentLayoutId: id,
            updatedAt: new Date()
          })
          .where(eq(dashboardPreferences.userId, user.id));
      }
    });

    return NextResponse.json({ message: 'Layout updated successfully' });
  } catch (error) {
    console.error('Failed to update dashboard layout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);
    const { id } = params;

    // Check if layout belongs to user
    const [existingLayout] = await db
      .select()
      .from(dashboardLayouts)
      .where(
        and(
          eq(dashboardLayouts.id, id),
          eq(dashboardLayouts.userId, user.id)
        )
      )
      .limit(1);

    if (!existingLayout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      // Delete the layout
      await tx
        .delete(dashboardLayouts)
        .where(eq(dashboardLayouts.id, id));

      // If this was the current layout, clear it from preferences
      await tx
        .update(dashboardPreferences)
        .set({ 
          currentLayoutId: null,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(dashboardPreferences.userId, user.id),
            eq(dashboardPreferences.currentLayoutId, id)
          )
        );
    });

    return NextResponse.json({ message: 'Layout deleted successfully' });
  } catch (error) {
    console.error('Failed to delete dashboard layout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}