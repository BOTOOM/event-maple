# EventMaple Email Templates

Professional, branded email templates for Supabase authentication flows.

## 📧 Templates Included

1. **email-confirmation.html** - Welcome & Email Confirmation
2. **email-reset-password.html** - Password Reset
3. **email-reauthentication.html** - Identity Verification (OTP Code)
4. **email-invite.html** - User Invitation

## 🎨 Design Features

- **Brand Colors**: Purple gradient (#221b69 → #3730a3)
- **Logo**: White background container for visibility
- **Responsive**: Mobile-friendly design
- **Modern UI**: Clean, professional aesthetic
- **Security Indicators**: Visual cues for important actions

## 🚀 How to Configure in Supabase

### Option 1: Via Supabase Dashboard

1. Go to **Authentication** → **Email Templates**
2. Select the template type (Confirm signup, Magic Link, etc.)
3. Copy the HTML content from the corresponding file
4. Paste into the template editor
5. Update the subject line:
   - **Confirm signup**: `Welcome to EventMaple - Confirm Your Email`
   - **Reset password**: `Reset Your EventMaple Password`
   - **Reauthentication**: `EventMaple - Verify Your Identity`
   - **Invite user**: `You've Been Invited to EventMaple`
6. Save changes

### Option 2: Via Supabase CLI

```bash
# Navigate to your project
cd /home/botom/Projects/Personal/event-planner

# Update email templates using Supabase CLI
supabase init
supabase link --project-ref YOUR_PROJECT_REF

# Add to your supabase/config.toml:
```

Add to `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "Welcome to EventMaple - Confirm Your Email"
content_path = "./supabase/email-confirmation.html"

[auth.email.template.recovery]
subject = "Reset Your EventMaple Password"
content_path = "./supabase/email-reset-password.html"

[auth.email.template.reauthentication]
subject = "EventMaple - Verify Your Identity"
content_path = "./supabase/email-reauthentication.html"

[auth.email.template.invite]
subject = "You've Been Invited to EventMaple"
content_path = "./supabase/email-invite.html"
```

## 🔧 Template Variables

These Supabase variables are used in the templates:

- `{{ .ConfirmationURL }}` - Action link for confirmation/reset
- `{{ .Token }}` - OTP code for reauthentication
- `{{ .SiteURL }}` - Your application URL
- `{{ .Email }}` - User's email address (optional)

## 🎯 Customization Tips

### Change Logo
Replace this URL in all templates:
```
https://tfpdrgwwxdexsflpxmce.supabase.co/storage/v1/object/sign/event-images/banners/logo.svg?token=...
```

### Adjust Colors
Find and replace these color values:
- **Primary gradient**: `#221b69` to `#3730a3`
- **Text dark**: `#111827`
- **Text medium**: `#6b7280`
- **Text light**: `#9ca3af`

### Update Footer
Modify the footer section in each template to add:
- Support email
- Social media links
- Privacy policy link

## ✅ Testing

1. **Local Testing**: Open HTML files in browser
2. **Email Testing**: Use services like:
   - [Litmus](https://litmus.com/)
   - [Email on Acid](https://www.emailonacid.com/)
   - [Mailtrap](https://mailtrap.io/)

3. **Supabase Testing**:
   ```bash
   # Trigger a test email
   supabase auth signup --email test@example.com
   ```

## 📱 Email Client Compatibility

Tested and optimized for:
- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook (Desktop & Web)
- ✅ Apple Mail (macOS & iOS)
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile apps (iOS Mail, Gmail App, etc.)

## 🔒 Security Notes

- Links expire automatically (configured in Supabase)
- OTP codes are time-limited
- All templates include security warnings
- HTTPS links only

## 📝 Maintenance

When updating templates:
1. Test in multiple email clients
2. Verify all variables render correctly
3. Check mobile responsiveness
4. Validate HTML (avoid JavaScript)
5. Keep inline styles (email clients strip `<style>` tags in some cases)

---

**Created for EventMaple** | Your events, simplified.
