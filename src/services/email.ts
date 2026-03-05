import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  total: number;
  status: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
}

export interface WelcomeEmailData {
  email: string;
  name: string;
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (result.error) {
      throw new Error(`Resend error: ${result.error.message}`);
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const itemsHtml = data.items
    ? data.items
        .map(
          (item) =>
            `<tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>`
        )
        .join('')
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { margin-bottom: 20px; }
          .order-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .total { font-size: 18px; font-weight: bold; color: #2c3e50; margin-top: 15px; }
          .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #2c3e50;">Confirmation de Commande</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${data.customerName},</p>
            <p>Merci pour votre commande ! Voici les détails :</p>
            
            <div class="order-details">
              <p><strong>Numéro de commande :</strong> ${data.orderId}</p>
              <p><strong>Statut :</strong> ${data.status}</p>
              
              ${
                data.items && data.items.length > 0
                  ? `
                <table>
                  <thead>
                    <tr style="background-color: #f0f0f0;">
                      <th style="padding: 8px; text-align: left;">Produit</th>
                      <th style="padding: 8px; text-align: center;">Quantité</th>
                      <th style="padding: 8px; text-align: right;">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              `
                  : ''
              }
              
              <div class="total">
                Total : $${data.total.toFixed(2)}
              </div>
            </div>
            
            <p>Nous vous tiendrons informé de l'évolution de votre commande.</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre directement.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Confirmation de commande #${data.orderId}`,
    html,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { margin-bottom: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #2c3e50;">Bienvenue !</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${data.name},</p>
            <p>Merci de vous être inscrit ! Nous sommes heureux de vous accueillir.</p>
            <p>Vous pouvez maintenant accéder à votre compte et explorer nos services.</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre directement.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: data.email,
    subject: 'Bienvenue !',
    html,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  newStatus: string
) {
  const statusMessages: Record<string, string> = {
    Processing: 'Votre commande est en cours de traitement',
    Shipped: 'Votre commande a été expédiée',
    Delivered: 'Votre commande a été livrée',
    Cancelled: 'Votre commande a été annulée',
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .status-box { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 15px 0; }
          .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #2c3e50;">Mise à jour de votre commande</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${customerName},</p>
            
            <div class="status-box">
              <p style="margin: 0; font-weight: bold; color: #2e7d32;">
                ${statusMessages[newStatus] || `Statut : ${newStatus}`}
              </p>
            </div>
            
            <p><strong>Numéro de commande :</strong> ${orderId}</p>
            <p>Nous vous tiendrons informé de toute évolution supplémentaire.</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre directement.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Mise à jour de votre commande #${orderId}`,
    html,
  });
}
