import { NextRequest, NextResponse } from "next/server";
import { db, users, userProfiles, passwords } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateRegistrationForm } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validate the registration data
    const validation = validateRegistrationForm({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash the password with 12 salt rounds for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user and password in a transaction
    const result = await db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx
        .insert(users)
        .values({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          emailVerified: null,
          image: null,
        })
        .returning();

      if (!newUser) {
        throw new Error("Failed to create user");
      }

      // Store the password hash in the passwords table
      await tx.insert(passwords).values({
        userId: newUser.id,
        hashedPassword,
      });

      // Create user profile with default settings
      await tx.insert(userProfiles).values({
        userId: newUser.id,
        bio: null,
        timezone: "America/New_York",
        avatarUrl: null,
      });

      return newUser;
    });

    console.log(`User successfully registered: ${result.email}`);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("unique constraint")) {
        return NextResponse.json(
          { error: "User already exists with this email" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}