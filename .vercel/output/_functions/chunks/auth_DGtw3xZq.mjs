import { createHmac } from 'node:crypto';
import * as jose from 'jose';
import { serialize, parse } from 'cookie';

const TELEGRAM_BOT_TOKEN = "8017064660:AAEcE6Cw_QkAsZolHdArDw0aGosF9-XwrJo";
const JWT_SECRET_KEY = new TextEncoder().encode("ead42d30867643cf8a362368acae50e6116b169050912761935862fa2ab2289c");
const COOKIE_NAME = "telegram_session";
function verifyTelegramInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");
  const dataCheckString = Array.from(params.entries()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([key, value]) => `${key}=${value}`).join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(TELEGRAM_BOT_TOKEN).digest();
  const _hash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return _hash === hash;
}
async function createSessionToken(user) {
  const jwt = await new jose.SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET_KEY);
  return jwt;
}
async function verifySessionToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET_KEY, {
      algorithms: ["HS256"]
      // Specify the algorithm that was used for signing.
    });
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
function setSessionCookie(response, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    // IMPORTANT: Prevents client-side JavaScript from accessing the cookie, enhancing security (XSS protection).
    secure: process.env.NODE_ENV === "production",
    // Only send over HTTPS in production environments.
    sameSite: "lax",
    // Provides a reasonable balance between security and usability for CSRF protection.
    maxAge: 60 * 60 * 24 * 7,
    // Cookie expiration in seconds (7 days).
    path: "/"
    // The cookie is valid for all paths on our domain.
  });
  response.headers.set("Set-Cookie", cookie);
}
function clearSessionCookie(response) {
  const cookie = serialize(COOKIE_NAME, "", {
    // Set cookie value to empty.
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    // Set maxAge to 0 to expire the cookie immediately, instructing the browser to delete it.
    path: "/"
  });
  response.headers.set("Set-Cookie", cookie);
}
function getSessionTokenFromRequest(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  return cookies[COOKIE_NAME] || null;
}

export { clearSessionCookie as a, verifySessionToken as b, createSessionToken as c, getSessionTokenFromRequest as g, setSessionCookie as s, verifyTelegramInitData as v };
