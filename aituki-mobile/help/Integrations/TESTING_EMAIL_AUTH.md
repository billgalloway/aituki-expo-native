# Testing Email Authentication

## How to Test Email Confirmation and Password Reset

### Prerequisites
✅ SMTP configured in Supabase  
✅ Email confirmations enabled  
✅ Redirect URLs configured: `aitukinative://auth/callback` and `aitukinative://auth/reset-password`

---

## Test 1: Email Confirmation (New User Registration)

### Steps:
1. **Open your app** (development build or production)
2. **Navigate to Registration screen**
3. **Enter a new email address** (use a real email you can access)
4. **Enter a password** (at least 6 characters)
5. **Tap "Sign Up"**

### Expected Results:
- ✅ Success message: "Account created! Please check your email to verify your account."
- ✅ You're redirected to the login screen
- ✅ **Check your email inbox** (and spam folder)
- ✅ You should receive an email from Supabase with subject like "Confirm your signup"
- ✅ The email contains a confirmation link

### Testing the Email Link:
1. **Click the confirmation link** in the email
2. The link should open your app (via deep link)
3. You should be automatically logged in
4. You should see the main app (tabs screen)

### Troubleshooting:
- **No email received?**
  - Check spam folder
  - Check Supabase email logs: Dashboard → Authentication → Users → [Your User] → Email Logs
  - Verify SMTP is configured correctly
  - Wait a few minutes (emails can be delayed)

- **Link doesn't open app?**
  - Make sure `aitukinative://auth/callback` is in Supabase redirect URLs
  - Check that your app scheme is `aitukinative` in `app.json`
  - Try opening the link on the same device where the app is installed

---

## Test 2: Password Reset (Forgot Password)

### Steps:
1. **Open your app**
2. **Navigate to Login screen**
3. **Tap "Forgot password?"** (below the Sign In button)
4. **Enter your email address** (an email that's already registered)
5. **Tap "Send Reset Email"**

### Expected Results:
- ✅ Success message: "Password Reset Email Sent. Please check your email for instructions..."
- ✅ **Check your email inbox** (and spam folder)
- ✅ You should receive an email with subject like "Reset Your Password"
- ✅ The email contains a password reset link

### Testing the Reset Link:
1. **Click the reset link** in the email
2. The link should open your app (via deep link)
3. You should see the "Reset Password" screen
4. **Enter a new password** (at least 6 characters)
5. **Confirm the password**
6. **Tap "Reset Password"**

### Expected Results:
- ✅ Success message: "Your password has been reset successfully!"
- ✅ You're redirected to the login screen
- ✅ You can now log in with your new password

### Troubleshooting:
- **No email received?**
  - Check spam folder
  - Verify the email is registered in Supabase
  - Check Supabase email logs
  - Verify SMTP is configured

- **Reset link doesn't work?**
  - Make sure `aitukinative://auth/reset-password` is in Supabase redirect URLs
  - Links expire after a certain time (usually 1 hour)
  - Request a new reset email if the link expired

- **"Invalid Reset Link" error?**
  - The link may have expired (request a new one)
  - The link may have been used already
  - Check that redirect URL is configured correctly

---

## Test 3: Verify Email Logs in Supabase

### Check if Emails Are Being Sent:
1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Find the user you tested with
4. Click on the user
5. Go to **Email Logs** tab
6. You should see:
   - Email type (confirmation, password reset, etc.)
   - Status (sent, failed, etc.)
   - Timestamp

### What to Look For:
- ✅ **Status: "Sent"** - Email was successfully sent
- ❌ **Status: "Failed"** - Check error message, verify SMTP settings
- ⏳ **No entry** - Email wasn't attempted (check Supabase settings)

---

## Quick Test Checklist

### Email Confirmation:
- [ ] Register new user
- [ ] Receive confirmation email
- [ ] Click email link
- [ ] App opens and user is logged in

### Password Reset:
- [ ] Click "Forgot password?"
- [ ] Enter email
- [ ] Receive reset email
- [ ] Click reset link
- [ ] App opens to reset password screen
- [ ] Set new password
- [ ] Log in with new password

### Verification:
- [ ] Check Supabase email logs
- [ ] Verify emails are marked as "Sent"
- [ ] Test on both iOS and Android (if applicable)

---

## Testing Tips

1. **Use Real Email Addresses**: Use email addresses you can actually access
2. **Check Spam Folder**: Emails might go to spam initially
3. **Wait a Few Minutes**: Emails can take 1-5 minutes to arrive
4. **Test on Device**: Deep links work best on actual devices, not simulators
5. **Clear App Data**: If testing multiple times, clear app data between tests
6. **Check Console Logs**: Look for any error messages in the app console

---

## Common Issues

### Issue: Emails not sending
**Solution**: 
- Verify SMTP is configured in Supabase
- Check email logs in Supabase dashboard
- Test SMTP connection in Supabase settings

### Issue: Links don't open app
**Solution**:
- Verify redirect URLs in Supabase match your app scheme
- Check `app.json` has correct `scheme: "aitukinative"`
- Test deep link manually: `aitukinative://auth/callback`

### Issue: "Invalid link" error
**Solution**:
- Links expire after 1 hour
- Each link can only be used once
- Request a new email if needed

---

## Next Steps After Testing

Once everything works:
1. ✅ Test with multiple email providers (Gmail, Outlook, etc.)
2. ✅ Test email templates customization in Supabase
3. ✅ Monitor email delivery rates
4. ✅ Set up email analytics (optional)


