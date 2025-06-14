# Email Functionality Setup Guide (Using Resend)

## Overview

TalentFlux uses [Resend](https://resend.com) for email functionality - a modern email API designed for developers. This allows sending professionally formatted CVs directly to users with just an API key.

## Why Resend?

- **Simple Setup**: Just one API key, no complex SMTP configuration
- **Developer Friendly**: Modern API with great documentation
- **Reliable Delivery**: Built-in retry logic and delivery tracking
- **Beautiful Emails**: Full HTML support with attachments
- **Free Tier**: 100 emails/day free, perfect for getting started

## Features

- **Send CV via Email**: Users can email their generated CV to themselves or others
- **Custom Email Recipients**: Option to send to any email address
- **Beautiful HTML Email Templates**: Professional email design with CV attachment
- **Graceful Fallback**: Simulates email sending when not configured (for development)

## Quick Setup

### 1. Get Your Resend API Key

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your email** address
3. Go to **[API Keys](https://resend.com/api-keys)**
4. Click **"Create API Key"**
5. Copy your API key (starts with `re_`)

### 2. Configure Environment Variable

Add to your `.env` file:

```env
RESEND_API_KEY=re_your_api_key_here
```

That's it! You're ready to send emails.

### 3. (Optional) Custom Domain Setup

To send from your own domain instead of `onboarding@resend.dev`:

1. Go to **[Domains](https://resend.com/domains)** in Resend
2. Click **"Add Domain"**
3. Follow the DNS verification steps
4. Update your `.env`:

```env
EMAIL_FROM=TalentFlux <hello@yourdomain.com>
```

## Usage

### For Users

1. **Generate CV**: Complete the CV creation process
2. **Click "Send via Email"**: In the preview step
3. **Enter Email** (optional): Leave blank to send to your email or enter a custom address
4. **Receive Email**: Check inbox for the beautifully formatted CV

### For Developers

The email service is implemented in `server/emailService.ts`:

```typescript
// Send any email
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Your Subject',
  html: '<h1>HTML Content</h1>',
  attachments: [
    {
      filename: 'document.pdf',
      content: Buffer.from(base64Data, 'base64')
    }
  ]
});

// Send CV email specifically
await sendCVEmail(
  recipientEmail,
  recipientName,
  pdfBase64,
  cvData
);
```

## Testing Without Configuration

If `RESEND_API_KEY` is not set:
- The system will **simulate** email sending
- Console logs will show email details
- Users will see success messages
- Perfect for development/testing

## Email Template

The CV email includes:
- 🎉 Engaging header with emoji
- 📊 Professional HTML design
- 📎 CV PDF attachment
- 🎯 Clear call-to-action
- 📱 Mobile-responsive layout

## Monitoring & Analytics

Track your emails in the [Resend Dashboard](https://resend.com/emails):
- Delivery status
- Open rates (if enabled)
- Failed deliveries with reasons
- Email preview

## Troubleshooting

### Common Issues

1. **"Failed to send email"**
   - Check your API key is correct
   - Ensure it starts with `re_`
   - Verify it's in your `.env` file

2. **"From address must be a verified domain"**
   - You're using a custom from address
   - Verify your domain in Resend dashboard
   - Or remove `EMAIL_FROM` to use default

3. **Rate limit exceeded**
   - Free tier: 100 emails/day, 10/second
   - Upgrade plan or implement queuing

### Debug Mode

Check server logs for detailed information:
```
[email] Email sent to user@example.com: 6f7d8a9b-1234-5678-90ab-cdef12345678
[email] [SIMULATED] Email to: user@example.com, Subject: Your CV
```

## Pricing

- **Free**: 100 emails/day
- **Pro**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

See [Resend Pricing](https://resend.com/pricing) for details.

## Security Best Practices

1. **Keep API Key Secret**: Never commit to version control
2. **Use Environment Variables**: Always store in `.env`
3. **Domain Verification**: Verify your domain for better deliverability
4. **Monitor Usage**: Check dashboard for unusual activity
5. **Rate Limiting**: Implement in production to prevent abuse

## API Reference

### Send Email Response
```json
{
  "id": "6f7d8a9b-1234-5678-90ab-cdef12345678"
}
```

### Error Response
```json
{
  "name": "validation_error",
  "message": "The from address must be a verified domain"
}
```

## Future Enhancements

- Email templates customization
- Batch sending for multiple recipients
- Webhook integration for delivery tracking
- Email scheduling
- A/B testing for templates 