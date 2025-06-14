import { Resend } from 'resend';
import { log } from './vite';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      // Simulate email sending if not configured
      log(`[SIMULATED] Email to: ${options.to}, Subject: ${options.subject}`, 'email');
      return {
        success: true,
        message: 'Email simulated (Resend API key not configured)',
      };
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'TalentFlux <onboarding@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    if (error) {
      throw new Error(error.message);
    }

    log(`Email sent to ${options.to}: ${data?.id}`, 'email');
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendCVEmail(
  recipientEmail: string,
  recipientName: string,
  pdfBase64: string,
  cvData?: any
): Promise<{ success: boolean; message: string }> {
  try {
    // Extract base64 data from data URL if needed
    const base64Data = pdfBase64.includes('base64,') 
      ? pdfBase64.split('base64,')[1] 
      : pdfBase64;

    // Create email HTML content
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { background: #ffffff; padding: 40px 30px; }
            .content p { margin: 0 0 20px 0; color: #4a5568; }
            .content ul { margin: 20px 0; padding-left: 20px; }
            .content li { margin: 10px 0; color: #4a5568; }
            .button { display: inline-block; padding: 14px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .button:hover { background: #5a67d8; }
            .footer { background: #f7fafc; padding: 30px; text-align: center; color: #718096; font-size: 14px; }
            .footer a { color: #667eea; text-decoration: none; }
            .divider { height: 1px; background: #e2e8f0; margin: 30px 0; }
            @media (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 30px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Professional CV is Ready! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              
              <p>Great news! Your professionally crafted CV has been generated using TalentFlux AI and is attached to this email.</p>
              
              <p><strong>What's included in your CV:</strong></p>
              <ul>
                <li>✨ Professional formatting optimized for ATS systems</li>
                <li>📊 AI-enhanced content that highlights your strengths</li>
                <li>🎯 Industry-specific keywords for better visibility</li>
                <li>💼 Clean, modern design that stands out</li>
              </ul>
              
              <div class="divider"></div>
              
              <p><strong>Next steps:</strong></p>
              <ul>
                <li>Review your CV for accuracy</li>
                <li>Save a copy for your records</li>
                <li>Start applying to your dream positions!</li>
              </ul>
              
              <p>Need to make changes? You can always create a new version or edit your CV through the TalentFlux platform.</p>
              
              <center>
                <a href="${process.env.APP_URL || 'https://talentflux.com'}/dashboard" class="button">
                  View Your Dashboard
                </a>
              </center>
            </div>
            <div class="footer">
              <p>© 2024 TalentFlux. Empowering careers with AI.</p>
              <p>This email was sent to ${recipientEmail}</p>
              <p style="margin-top: 20px; font-size: 12px;">
                If you didn't request this CV, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email with PDF attachment
    const result = await sendEmail({
      to: recipientEmail,
      subject: `${recipientName} - Your Professional CV from TalentFlux`,
      html,
      attachments: [
        {
          filename: `${recipientName.replace(/\s+/g, '_')}_CV.pdf`,
          content: Buffer.from(base64Data, 'base64'),
        },
      ],
    });

    return result;
  } catch (error) {
    console.error('CV email error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send CV email',
    };
  }
} 