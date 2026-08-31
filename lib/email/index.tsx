import { Resend } from "resend";
import { welcomeEmailHtml } from "./welcomeemail";
import { orderConfirmationEmailHtml } from "./orderconfirmationemail";
import { lowStockEmailHtml } from "./lowStockEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const TO_OVERRIDE = process.env.RESEND_TO_EMAIL;
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.RESEND_TO_EMAIL ?? "";

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: TO_OVERRIDE ?? email,
      subject: `Welcome to MyStore, ${name || "there"}! 🎉`,
      html: welcomeEmailHtml({ name }),
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}

export async function sendOrderConfirmationEmail({
  name,
  email,
  order,
}: {
  name: string;
  email: string;
  order: any;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: TO_OVERRIDE ?? email,
      subject: `Order Confirmed — #${order.id.slice(-8).toUpperCase()} 📦`,
      html: orderConfirmationEmailHtml({ name, order }),
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendLowStockEmail(
  products: { name: string; stock: number; slug: string }[],
) {
  if (!ADMIN_EMAIL || products.length === 0) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `⚠️ Low Stock Alert — ${products.length} product${products.length !== 1 ? "s need" : " needs"} restocking`,
      html: lowStockEmailHtml({ products }),
    });
  } catch (err) {
    console.error("Failed to send low stock email:", err);
  }
}
