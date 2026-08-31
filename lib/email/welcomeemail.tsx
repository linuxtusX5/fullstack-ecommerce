export function welcomeEmailHtml({ name }: { name: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to MyStore</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0ea5e9;box-shadow:0 0 10px rgba(14,165,233,0.7);"></span>
                <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.04em;">MyStore</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:40px;">
              <h1 style="font-size:28px;font-weight:700;color:#0f172a;margin:0 0 8px;letter-spacing:-0.02em;">
                Welcome, ${name || "there"}! 👋
              </h1>
              <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 28px;">
                We're so excited to have you at MyStore. Your account is ready and you can start shopping our curated collections right away.
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  {
                    icon: "🛍️",
                    title: "Shop Collections",
                    desc: "Browse thousands of curated products",
                  },
                  {
                    icon: "❤️",
                    title: "Save to Wishlist",
                    desc: "Keep track of items you love",
                  },
                  {
                    icon: "📦",
                    title: "Track Orders",
                    desc: "Real-time updates on your orders",
                  },
                ]
                  .map(
                    (f) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;font-size:20px;">${f.icon}</td>
                        <td>
                          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${f.title}</p>
                          <p style="margin:0;font-size:12px;color:#94a3b8;">${f.desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`,
                  )
                  .join("")}
              </table>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/products"
                   style="display:inline-block;background:#0ea5e9;color:#fff;font-size:15px;font-weight:600;padding:14px 36px;border-radius:12px;text-decoration:none;">
                  Start Shopping →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} MyStore. All rights reserved.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">
                You received this email because you created an account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
