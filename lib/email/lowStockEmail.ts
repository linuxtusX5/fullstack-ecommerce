type LowStockProduct = {
  name: string;
  stock: number;
  slug: string;
};

export function lowStockEmailHtml({
  products,
}: {
  products: LowStockProduct[];
}) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Low Stock Alert</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;border-radius:16px 16px 0 0;padding:28px 36px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.04em;">⚠️ MyStore Admin</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:32px 36px;">
            <div style="background:#fef2f2;border:1px solid #fee2e2;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:15px;font-weight:700;color:#dc2626;">🚨 Low Stock Alert</p>
              <p style="margin:4px 0 0;font-size:13px;color:#ef4444;">
                ${products.length} product${products.length !== 1 ? "s are" : " is"} running low and need${products.length !== 1 ? "" : "s"} restocking.
              </p>
            </div>

            ${products
              .map(
                (p) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;border:1px solid #f1f5f9;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${p.name}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:${p.stock === 0 ? "#ef4444" : "#f59e0b"};font-weight:600;">
                    ${p.stock === 0 ? "❌ Out of stock" : `⚠️ Only ${p.stock} units left`}
                  </p>
                </td>
              </tr>
            </table>
            `,
              )
              .join("")}

            <div style="text-align:center;margin-top:28px;">
              <a href="${baseUrl}/admin/products"
                 style="display:inline-block;background:#0f172a;color:#fff;font-size:14px;font-weight:600;padding:13px 28px;border-radius:10px;text-decoration:none;">
                Manage Stock →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">MyStore Admin Notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}
