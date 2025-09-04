import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dashboardLayouts, dashboardPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/server";
import { LayoutConfiguration } from "@/types/dashboard";

export async function GET() {
  try {
    const { user } = await requireAuth(["user", "admin", "premium"]);

    // Get all layouts for the user
    const layouts = await db
      .select()
      .from(dashboardLayouts)
      .where(eq(dashboardLayouts.userId, user.id))
      .orderBy(dashboardLayouts.createdAt);

    return NextResponse.json(layouts);
  } catch (error) {
    console.error("Failed to get dashboard layouts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(["user", "admin", "premium"]);
    const body = await request.json();

    const { name, layout, isDefault = false } = body;

    if (!name || !layout) {
      return NextResponse.json(
        { error: "Name and layout configuration are required" },
        { status: 400 }
      );
    }

    // Validate layout structure
    if (!layout.widgets || !Array.isArray(layout.widgets)) {
      return NextResponse.json(
        { error: "Invalid layout configuration" },
        { status: 400 }
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

      // Create new layout
      const [newLayout] = await tx
        .insert(dashboardLayouts)
        .values({
          userId: user.id,
          name,
          layout: layout as LayoutConfiguration,
          isDefault,
        })
        .returning();

      // If this is the default layout, update user preferences
      if (isDefault) {
        await tx
          .update(dashboardPreferences)
          .set({
            currentLayoutId: newLayout?.id,
            updatedAt: new Date(),
          })
          .where(eq(dashboardPreferences.userId, user.id));
      }

      return newLayout;
    });

    return NextResponse.json({ message: "Layout saved successfully" });
  } catch (error) {
    console.error("Failed to save dashboard layout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
