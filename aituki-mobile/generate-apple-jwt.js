/**
 * Generate Apple Sign-In JWT for Supabase
 * 
 * Usage:
 * 1. Update the values below with your Apple Developer credentials
 * 2. Make sure your .p8 file is in the same directory or update the path
 * 3. Run: node generate-apple-jwt.js
 * 4. Copy the output JWT and paste it into Supabase Dashboard
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ============================================
// UPDATE THESE VALUES WITH YOUR CREDENTIALS
// ============================================

const KEY_ID = 'K5DK5LF6B2'; // From Apple Developer Console → Keys
const TEAM_ID = 'J2HMNHZVM9'; // From Apple Developer Console → Membership
const CLIENT_ID = 'com.aituki.mobile.service'; // Your Service ID
const PRIVATE_KEY_PATH = './AuthKey_K5DK5LF6B2.p8'; // Path to your .p8 file

// ============================================

// Read the private key
let privateKey;
try {
  privateKey = fs.readFileSync(path.resolve(__dirname, PRIVATE_KEY_PATH));
} catch (error) {
  console.error('❌ Error reading .p8 file:', error.message);
  console.error('   Make sure the file path is correct and the file exists.');
  process.exit(1);
}

// Generate the JWT
const now = Math.floor(Date.now() / 1000);
const token = jwt.sign(
  {
    iss: TEAM_ID,
    iat: now,
    exp: now + 86400 * 180, // Expires in 6 months (Apple requirement)
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    keyid: KEY_ID,
  }
);

console.log('\n✅ Apple Client Secret (JWT) Generated:\n');
console.log(token);
console.log('\n📋 Next Steps:');
console.log('1. Copy the JWT above (the long string)');
console.log('2. Go to Supabase Dashboard → Authentication → Providers → Apple');
console.log('3. Paste the JWT into the "Client Secret" field');
console.log('4. Enter your other credentials (Client ID, Team ID, Key ID)');
console.log('5. Save\n');

// Save JWT to file for easy access
const jwtFilePath = path.resolve(__dirname, 'apple-client-secret-jwt.txt');
fs.writeFileSync(jwtFilePath, token);
console.log(`💾 JWT also saved to: ${jwtFilePath}\n`);

