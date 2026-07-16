import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await db.user.findUnique({ where: { email } });

    // Always return 200 — don't reveal if email exists
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Store token in DB (you'll need a PasswordResetToken model in schema)
    await db.passwordResetToken.upsert({
      where: { email },
      create: { email, token, expires },
      update: { token, expires },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "MyStore <noreply@mystore.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
          Reset Password
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:14px">
          If you didn't request this, you can safely ignore this email.
        </p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
