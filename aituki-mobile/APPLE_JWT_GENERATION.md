# How to Generate Apple Sign-In JWT for Supabase

## Problem
You're getting the error: **"Secret key should be a JWT"** when trying to configure Apple Sign-In in Supabase.

## Solution
Supabase requires a **JWT (JSON Web Token)** generated from your `.p8` file, NOT the raw `.p8` file itself.

---

## Method 1: Use Online JWT Generator (Easiest - Recommended)

Since Supabase's built-in generator may not be available, use this online tool:

1. **Go to JWT Generator for Apple**:
   - Visit: https://appleid.apple.com/signinwithapple/jwt
   - Or use: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
   - Or use this tool: https://www.npmjs.com/package/apple-signin-auth (has online generator)

2. **Alternative: Use jwt.io with manual construction**:
   - Go to: https://jwt.io
   - You'll need to manually construct the JWT (see Method 3 below for details)

3. **Gather Your Information**:
   - **Key ID**: From Apple Developer Console → Keys (the key you created)
   - **Team ID**: From Apple Developer Console → Membership
   - **Client ID**: `com.aituki.mobile.service` (your Service ID)
   - **Private Key**: Open your `.p8` file in a text editor and copy the entire contents

4. **Generate the JWT**:
   - Enter all the information in the generator
   - Copy the generated JWT (it will be a long string starting with `eyJ...`)

5. **Paste in Supabase**:
   - Go to Supabase Dashboard → Authentication → Providers → Apple
   - Paste the JWT into the **Client Secret** field (NOT a file upload)
   - Enter your other credentials
   - Save

---

## Method 2: Use Supabase Dashboard Generator

Some Supabase dashboards have a built-in generator:

1. Go to **Authentication** → **Providers** → **Apple**
2. Look for a **"Generate Client Secret"** or **"Generate JWT"** button
3. Enter:
   - Key ID
   - Team ID
   - Client ID
   - Private Key (paste contents of `.p8` file)
4. Click Generate
5. Copy the generated JWT
6. Paste it into the Client Secret field

---

## Method 2: Use Supabase Dashboard (If Available)

Some Supabase dashboards have a built-in generator:

1. Go to **Authentication** → **Providers** → **Apple**
2. Look for a **"Generate Client Secret"** or **"Generate JWT"** button
3. If you see it, enter:
   - Key ID
   - Team ID
   - Client ID
   - Private Key (paste contents of `.p8` file)
4. Click Generate
5. Copy the generated JWT
6. Paste it into the Client Secret field

**Note**: If you don't see this button, use Method 1 or Method 3 instead.

## Method 3: Generate Using Node.js (Recommended - Most Reliable)

**I've created a script for you!** Use the `generate-apple-jwt.js` file in your project.

### Quick Steps:

1. **Install the required package**:
   ```bash
   cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
   npm install jsonwebtoken
   ```

2. **Update the script**:
   - Open `generate-apple-jwt.js`
   - Replace these values:
     - `YOUR_KEY_ID` → Your Key ID from Apple Developer Console
     - `YOUR_TEAM_ID` → Your Team ID from Apple Developer Console
     - Update `PRIVATE_KEY_PATH` → Path to your `.p8` file

3. **Run the script**:
   ```bash
   node generate-apple-jwt.js
   ```

4. **Copy the output JWT** and paste it into Supabase Dashboard

### Manual Script (if you prefer):

If you want to create your own script, here's the code:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const keyId = 'YOUR_KEY_ID'; // From Apple Developer Console
const teamId = 'YOUR_TEAM_ID'; // From Apple Developer Console
const clientId = 'com.aituki.mobile.service'; // Your Service ID
const privateKey = fs.readFileSync('path/to/your/key.p8');

const token = jwt.sign(
  {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
    aud: 'https://appleid.apple.com',
    sub: clientId,
  },
  privateKey,
  {
    algorithm: 'ES256',
    keyid: keyId,
  }
);

console.log(token);
```

**Quick Setup:**
```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
npm install jsonwebtoken
```

Then create a file `generate-jwt.js` with the script above, update the values, and run:
```bash
node generate-jwt.js
```

Copy the output JWT string.

---

## What the JWT Looks Like

A valid JWT will look like this (much longer in reality):
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJURUFNX0lEIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MTYxNjAwMDAsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20uYWl0dWtpLm1vYmlsZS5zZXJ2aWNlIn0.SIGNATURE_HERE
```

It's a single string with three parts separated by dots (`.`).

---

## Important Notes

1. **JWT Expiration**: JWTs expire after 6 months. You'll need to regenerate it.
2. **Not a File**: The Client Secret field expects a **text string**, not a file upload
3. **Keep Your `.p8` File Safe**: You'll need it to regenerate the JWT every 6 months
4. **Format**: The JWT is a single long string - don't add line breaks

---

## Quick Checklist

- [ ] Have your Key ID ready
- [ ] Have your Team ID ready
- [ ] Have your Service ID ready: `com.aituki.mobile.service`
- [ ] Have your `.p8` file contents ready (open in text editor)
- [ ] Generate JWT using one of the methods above
- [ ] Copy the entire JWT string
- [ ] Paste into Supabase **Client Secret** field (text field, not file upload)
- [ ] Enter Key ID, Team ID, and Client ID
- [ ] Save

---

## Still Getting Errors?

1. **"Secret key should be a JWT"**:
   - Make sure you're pasting the JWT string, not uploading the `.p8` file
   - Verify the JWT was generated correctly
   - Check that you copied the entire JWT (it's very long)

2. **"Invalid client_secret"**:
   - Regenerate the JWT
   - Verify all information (Key ID, Team ID, Client ID) is correct
   - Check that the JWT hasn't expired

3. **"Invalid client_id"**:
   - Verify Client ID matches your Service ID exactly: `com.aituki.mobile.service`
   - Check for typos

---

## Need Help?

If you're still having issues:
1. Double-check all your Apple Developer Console credentials
2. Verify the Service ID is correctly configured
3. Try regenerating the JWT
4. Make sure you're using the JWT string, not the `.p8` file

