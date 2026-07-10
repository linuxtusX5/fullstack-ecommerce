"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

// ── Schemas ───────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ── Register ──────────────────────────────────────────────────────────────────

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. Validate
  const parsed = RegisterSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    // 2. Check duplicate email
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      return {
        success: false,
        message: "Please fix the errors below.",
        errors: { email: ["An account with this email already exists."] },
      };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    await db.user.create({
      data: { name, email, password: hashedPassword },
    });
  } catch (error) {
    console.error("[REGISTER_ACTION]", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  // 5. Redirect to login with success flag
  redirect("/login?registered=true");
}

// ── Login (Zod validation only — NextAuth handles the actual sign in) ─────────

export async function validateLoginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Return success — LoginForm.tsx picks this up and calls signIn("credentials")
  return { success: true, message: "ok" };
}
