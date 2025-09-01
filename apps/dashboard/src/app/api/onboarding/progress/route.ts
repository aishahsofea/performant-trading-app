import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { onboardingProgress } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/server';

const defaultProgress = {
  currentStepId: 'welcome',
  completedSteps: [],
  skippedSteps: [],
  completedTours: [],
  progress: 0,
  isComplete: false,
  showTooltips: true,
  tourSpeed: 'normal',
  preferences: {},
};

export async function GET() {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);

    // Get user's onboarding progress
    const [progress] = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, user.id))
      .limit(1);

    if (!progress) {
      // Create default progress if none exists, handle race condition with ON CONFLICT
      try {
        const [newProgress] = await db
          .insert(onboardingProgress)
          .values({
            userId: user.id,
            ...defaultProgress,
          })
          .onConflictDoNothing({ target: onboardingProgress.userId })
          .returning();

        if (newProgress) {
          return NextResponse.json(newProgress);
        }
        
        // If no record returned due to conflict, fetch the existing one
        const [existingProgress] = await db
          .select()
          .from(onboardingProgress)
          .where(eq(onboardingProgress.userId, user.id))
          .limit(1);
          
        return NextResponse.json(existingProgress);
      } catch (error) {
        // Fallback: try to fetch existing record if insert fails
        const [existingProgress] = await db
          .select()
          .from(onboardingProgress)
          .where(eq(onboardingProgress.userId, user.id))
          .limit(1);
          
        if (existingProgress) {
          return NextResponse.json(existingProgress);
        }
        throw error;
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to get onboarding progress:', error);
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
      currentStepId,
      completedSteps,
      skippedSteps,
      completedTours,
      progress,
      isComplete,
      showTooltips,
      tourSpeed,
      preferences
    } = body;

    // Check if progress exists
    const [existingProgress] = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, user.id))
      .limit(1);

    const updateData = {
      currentStepId: currentStepId !== undefined ? currentStepId : existingProgress?.currentStepId,
      completedSteps: completedSteps !== undefined ? completedSteps : existingProgress?.completedSteps || [],
      skippedSteps: skippedSteps !== undefined ? skippedSteps : existingProgress?.skippedSteps || [],
      completedTours: completedTours !== undefined ? completedTours : existingProgress?.completedTours || [],
      progress: progress !== undefined ? progress : existingProgress?.progress || 0,
      isComplete: isComplete !== undefined ? isComplete : existingProgress?.isComplete || false,
      showTooltips: showTooltips !== undefined ? showTooltips : existingProgress?.showTooltips !== false,
      tourSpeed: tourSpeed || existingProgress?.tourSpeed || 'normal',
      preferences: preferences !== undefined ? preferences : existingProgress?.preferences || {},
      completedAt: isComplete ? new Date() : existingProgress?.completedAt,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingProgress) {
      // Update existing progress
      await db
        .update(onboardingProgress)
        .set(updateData)
        .where(eq(onboardingProgress.userId, user.id));
    } else {
      // Create new progress
      await db.insert(onboardingProgress).values({
        userId: user.id,
        ...updateData,
      });
    }

    return NextResponse.json({ message: 'Onboarding progress updated successfully' });
  } catch (error) {
    console.error('Failed to update onboarding progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Complete a specific onboarding step
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(['user', 'admin', 'premium']);
    const body = await request.json();
    
    const { stepId, action = 'complete' } = body; // action can be 'complete' or 'skip'

    if (!stepId) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      );
    }

    // Get current progress
    let [currentProgress] = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, user.id))
      .limit(1);

    if (!currentProgress) {
      // Create default progress
      [currentProgress] = await db
        .insert(onboardingProgress)
        .values({
          userId: user.id,
          ...defaultProgress,
        })
        .returning();
    }

    const completedSteps = Array.isArray(currentProgress?.completedSteps) 
      ? currentProgress.completedSteps as string[]
      : [];
    const skippedSteps = Array.isArray(currentProgress?.skippedSteps)
      ? currentProgress.skippedSteps as string[]
      : [];

    if (action === 'complete' && !completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
      // Remove from skipped if it was there
      const skippedIndex = skippedSteps.indexOf(stepId);
      if (skippedIndex > -1) {
        skippedSteps.splice(skippedIndex, 1);
      }
    } else if (action === 'skip' && !skippedSteps.includes(stepId)) {
      skippedSteps.push(stepId);
      // Remove from completed if it was there
      const completedIndex = completedSteps.indexOf(stepId);
      if (completedIndex > -1) {
        completedSteps.splice(completedIndex, 1);
      }
    }

    // Calculate progress percentage (assuming 5 main steps)
    const totalSteps = 5;
    const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);
    const isComplete = progressPercentage >= 100;

    // Update progress
    await db
      .update(onboardingProgress)
      .set({
        completedSteps,
        skippedSteps,
        progress: progressPercentage,
        isComplete,
        completedAt: isComplete ? new Date() : currentProgress?.completedAt,
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(onboardingProgress.userId, user.id));

    return NextResponse.json({ 
      message: `Step ${action}d successfully`,
      progress: progressPercentage,
      isComplete
    });
  } catch (error) {
    console.error('Failed to update onboarding step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}