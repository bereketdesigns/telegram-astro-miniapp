import { e as createComponent, r as renderTemplate } from '../../chunks/astro/server_GG320oEE.mjs';
import 'kleur/colors';
import 'clsx';
import { sql } from '@vercel/postgres';
import { v as verifyTelegramInitData, c as createSessionToken, s as setSessionCookie } from '../../chunks/auth_DGtw3xZq.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { initData } = await request.json();
    if (!initData || !verifyTelegramInitData(initData)) {
      console.warn("Invalid or missing initData received.");
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid initData" }), {
        status: 403,
        // Forbidden status code.
        headers: { "Content-Type": "application/json" }
      });
    }
    const params = new URLSearchParams(initData);
    const userParam = params.get("user");
    if (!userParam) {
      console.warn("initData does not contain user information.");
      return new Response(JSON.stringify({ error: "Bad Request: User data not found in initData" }), {
        status: 400,
        // Bad Request status code.
        headers: { "Content-Type": "application/json" }
      });
    }
    const telegramUser = JSON.parse(userParam);
    console.log("Telegram User Data:", telegramUser);
    let userRecord = null;
    const { rows } = await sql`
      SELECT telegram_id, username, first_name, last_name, photo_url
      FROM users
      WHERE telegram_id = ${telegramUser.id}
    `;
    if (rows.length > 0) {
      userRecord = rows[0];
      console.log(`User ${telegramUser.id} (${userRecord.username || userRecord.first_name}) found in DB.`);
    } else {
      console.log(`User ${telegramUser.id} not found. Creating new user...`);
      const { rows: newRows } = await sql`
        INSERT INTO users (telegram_id, username, first_name, last_name, photo_url)
        VALUES (
          ${telegramUser.id},
          ${telegramUser.username || null},     -- Use null if username is not provided by Telegram.
          ${telegramUser.first_name || null},   -- Use null if first_name is not provided.
          ${telegramUser.last_name || null},    -- Use null if last_name is not provided.
          ${telegramUser.photo_url || null}     -- Use null if photo_url is not provided.
        )
        RETURNING telegram_id, username, first_name, last_name, photo_url; -- Return the newly inserted data.
      `;
      userRecord = newRows[0];
      console.log(`New user ${telegramUser.id} created successfully.`);
    }
    if (!userRecord) {
      throw new Error("Authentication failed: Could not retrieve or create user record.");
    }
    const sessionToken = await createSessionToken(userRecord);
    const response = new Response(JSON.stringify({
      message: "Authentication successful",
      user: {
        telegram_id: userRecord.telegram_id,
        username: userRecord.username,
        first_name: userRecord.first_name,
        last_name: userRecord.last_name,
        photo_url: userRecord.photo_url
      }
    }), {
      status: 200,
      // OK status code.
      headers: { "Content-Type": "application/json" }
    });
    setSessionCookie(response, sessionToken);
    return response;
  } catch (error) {
    console.error("Authentication API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error during authentication" }), {
      status: 500,
      // Internal Server Error status code.
      headers: { "Content-Type": "application/json" }
    });
  }
};
const $$Auth = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/workspaces/telegram-astro-miniapp/src/pages/api/auth.astro", void 0);

const $$file = "/workspaces/telegram-astro-miniapp/src/pages/api/auth.astro";
const $$url = "/api/auth";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  default: $$Auth,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
