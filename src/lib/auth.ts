// src/lib/auth.ts
// This file contains utility functions for Telegram initData verification,
// JWT-based session management (creation, verification), and HTTP cookie handling.

import { createHmac } from 'node:crypto'; // Node.js crypto module for HMAC-SHA256 hashing.
import * as jose from 'jose';            // JOSE (JSON Object Signing and Encryption) library for JWTs.
import { serialize, parse } from 'cookie'; // 'cookie' library for setting and getting HTTP cookies.

// --- Configuration ---
// Retrieve environment variables. They must be defined in your .env and src/env.d.ts.
// `import.meta.env` is Astro's way to access environment variables during build/runtime.
const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const JWT_SECRET_KEY = new TextEncoder().encode(import.meta.env.JWT_SECRET); // JWT secret for signing/verifying tokens.
                                                                                // `TextEncoder().encode()` converts the string secret into a Uint8Array,
                                                                                // which `jose` requires for cryptographic operations.
const COOKIE_NAME = 'telegram_session'; // The name of the HTTP cookie that will store our session token.

// --- Types ---
// Define the structure of data we'll store inside our JWT payload.
// We extend jose.JWTPayload to make our UserSession type compatible with JOSE's expectations.
// JWTPayload is a base type that allows arbitrary properties, and we add our specific ones.
export interface UserSession extends jose.JWTPayload { // <-- THIS IS THE KEY CORRECTION
  telegram_id: number;
  username?: string | null;     // Optional Telegram username.
  first_name?: string | null;   // Optional first name.
  last_name?: string | null;    // Optional last name.
  photo_url?: string | null;    // Optional URL to user's profile photo.
  // Add any other user-specific data you want in the session here.
  // Note: Standard JWT claims (like exp, iat, sub, etc.) are handled by jose automatically
  // when you extend JWTPayload, so you don't need to declare them here.
}

// --- `initData` Verification Function ---
// This function verifies the authenticity of the `initData` string received from Telegram.
// It's critical for security to prevent unauthorized access or spoofed login attempts.
export function verifyTelegramInitData(initData: string): boolean {
  const params = new URLSearchParams(initData); // Parse the initData string into URL parameters.
  const hash = params.get('hash');             // Extract the 'hash' parameter, which is the cryptographic signature.
  params.delete('hash');                       // Remove 'hash' from parameters before checking, as it's not part of the data to be hashed.

  // Sort all remaining parameters by key and concatenate them into a string.
  // This is the specific format Telegram expects for hash verification.
  const dataCheckString = Array.from(params.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort alphabetically by key.
    .map(([key, value]) => `${key}=${value}`)          // Format as "key=value".
    .join('\n');                                       // Join with newline characters.

  // Calculate the secret key for HMAC. This key is derived from your bot token.
  // It's a HMAC-SHA256 hash of the string "WebAppData" using the bot token as the key.
  const secretKey = createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest();

  // Calculate the HMAC-SHA256 hash of the dataCheckString using the derived secretKey.
  const _hash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // Compare the calculated hash with the hash received from Telegram.
  // If they match, the initData is considered authentic.
  return _hash === hash;
}

// --- Session Token (JWT) Functions ---

// Creates a new JSON Web Token (JWT) for the user session.
// The JWT payload will contain the essential `UserSession` data.
export async function createSessionToken(user: UserSession): Promise<string> {
  const jwt = await new jose.SignJWT(user)        // Create a new JWT with the user data as payload.
    .setProtectedHeader({ alg: 'HS256' })         // Set the header to indicate HMAC-SHA256 algorithm.
    .setIssuedAt()                                // Set the token's issuance timestamp.
    .setExpirationTime('7d')                      // Set the token to expire in 7 days for persistent login.
    .sign(JWT_SECRET_KEY);                        // Sign the token using our secret key to ensure its integrity and authenticity.
  return jwt;
}

// Verifies a given JWT and returns its payload if it's valid.
// If the token is invalid, expired, or tampered with, it throws an error or returns null.
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    // Attempt to verify the token using our secret key and expected algorithm.
    const { payload } = await jose.jwtVerify(token, JWT_SECRET_KEY, {
      algorithms: ['HS256'], // Specify the algorithm that was used for signing.
    });
    // Casting is now safe because UserSession extends JWTPayload,
    // and we know our payload structure (including telegram_id) from createSessionToken.
    return payload as UserSession;
  } catch (error) {
    // Log any errors during verification (e.g., token expired, invalid signature).
    console.error('JWT verification failed:', error);
    return null; // Return null to indicate an invalid session.
  }
}

// --- Cookie Functions ---

// Sets the session token in an HTTP cookie in the response headers.
// This cookie will be sent by the browser with subsequent requests to our domain.
export function setSessionCookie(response: Response, token: string): void {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true, // IMPORTANT: Prevents client-side JavaScript from accessing the cookie, enhancing security (XSS protection).
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production environments.
    sameSite: 'lax', // Provides a reasonable balance between security and usability for CSRF protection.
    maxAge: 60 * 60 * 24 * 7, // Cookie expiration in seconds (7 days).
    path: '/', // The cookie is valid for all paths on our domain.
  });
  response.headers.set('Set-Cookie', cookie); // Add the 'Set-Cookie' header to the HTTP response.
}

// Clears the session cookie, effectively logging the user out.
export function clearSessionCookie(response: Response): void {
  const cookie = serialize(COOKIE_NAME, '', { // Set cookie value to empty.
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Set maxAge to 0 to expire the cookie immediately, instructing the browser to delete it.
    path: '/',
  });
  response.headers.set('Set-Cookie', cookie); // Add the 'Set-Cookie' header.
}

// Retrieves the session token from the incoming request's cookies.
export function getSessionTokenFromRequest(request: Request): string | null {
  // Get the 'cookie' header from the request.
  const cookieHeader = request.headers.get('cookie') || '';
  // Parse the cookie header string into an object of key-value pairs.
  const cookies = parse(cookieHeader);
  // Return the value of our specific session cookie, or null if not found.
  return cookies[COOKIE_NAME] || null;
}