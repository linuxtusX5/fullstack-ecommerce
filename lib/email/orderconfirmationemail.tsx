type OrderItem = {
  quantity: number;
  price: number;
  product: { name: string; images: string[] };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
};

export function orderConfirmationEmailHtml({
  name,
  order,
}: {
  name: string;
  order: Order;
}) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <div style="margin-bottom:16px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0ea5e9;"></span>
                <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.04em;vertical-align:middle;margin-left:6px;">MyStore</span>
              </div>
              <div style="display:inline-block;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:100px;padding:6px 18px;">
                <span style="font-size:13px;font-weight:600;color:#10b981;">✓ Order Confirmed</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:40px;">
              <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 8px;letter-spacing:-0.02em;">
                Thanks for your order, ${name || "there"}!
              </h1>
              <p style="font-size:14px;color:#64748b;margin:0 0 24px;line-height:1.7;">
                Your order <strong style="color:#0f172a;">#${order.id.slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.
              </p>

              <!-- Order summary box -->
              <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Order Summary</p>

                ${order.items
                  .map(
                    (item) => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                  <tr>
                    <td style="width:52px;vertical-align:top;">
                      <div style="width:48px;height:58px;border-radius:8px;background:#e2e8f0;overflow:hidden;">
                        ${
                          item.product.images?.[0]
                            ? `<img src="${item.product.images[0]}" width="48" height="58" style="object-fit:cover;display:block;" />`
                            : `<div style="width:48px;height:58px;background:#e2e8f0;"></div>`
                        }
                      </div>
                    </td>
                    <td style="vertical-align:middle;padding-left:12px;">
                      <p style="margin:0;font-size:13px;font-weight:600;color:#0f172a;">${item.product.name}</p>
                      <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">Qty: ${item.quantity}</p>
                    </td>
                    <td style="vertical-align:middle;text-align:right;">
                      <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">$${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </td>
                  </tr>
                </table>
                `,
                  )
                  .join("")}

                <div style="border-top:1px solid #e2e8f0;padding-top:14px;margin-top:4px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:15px;font-weight:700;color:#0f172a;">Total</td>
                      <td style="text-align:right;font-size:18px;font-weight:700;color:#0f172a;">$${Number(order.total).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${baseUrl}/account/orders"
                   style="display:inline-block;background:#0f172a;color:#fff;font-size:14px;font-weight:600;padding:13px 32px;border-radius:12px;text-decoration:none;">
                  View My Orders →
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
                You received this because you placed an order at MyStore.
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
