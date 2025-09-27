import { e as createComponent, f as createAstro, r as renderTemplate } from '../../chunks/astro/server_DCP9PL5F.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getSessionTokenFromRequest, a as clearSessionCookie, b as verifySessionToken } from '../../chunks/auth_DGtw3xZq.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const GET = async ({ request }) => {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) {
      console.warn("Unauthorized: No session token found in request for /api/user.");
      const response = new Response(JSON.stringify({ error: "Unauthorized: No session token" }), {
        status: 401,
        // Unauthorized status.
        headers: { "Content-Type": "application/json" }
      });
      clearSessionCookie(response);
      return response;
    }
    const userSession = await verifySessionToken(token);
    if (!userSession) {
      console.warn("Unauthorized: Invalid or expired session token for /api/user.");
      const response = new Response(JSON.stringify({ error: "Unauthorized: Invalid or expired session" }), {
        status: 401,
        // Unauthorized status.
        headers: { "Content-Type": "application/json" }
      });
      clearSessionCookie(response);
      return response;
    }
    return new Response(JSON.stringify({
      user: {
        telegram_id: userSession.telegram_id,
        username: userSession.username,
        first_name: userSession.first_name,
        last_name: userSession.last_name,
        photo_url: userSession.photo_url
      }
    }), {
      status: 200,
      // OK status.
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("API /api/user (GET) error:", error);
    const response = new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
    clearSessionCookie(response);
    return response;
  }
};
const POST = async ({ request }) => {
  if (request.url.endsWith("/api/user/logout")) {
    console.log("Logout request received.");
    const response = new Response(JSON.stringify({ message: "Logged out successfully" }), {
      status: 200,
      // OK status.
      headers: { "Content-Type": "application/json" }
    });
    clearSessionCookie(response);
    return response;
  }
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    // Method Not Allowed status.
    headers: { "Content-Type": "application/json" }
  });
};
const $$User = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$User;
  return renderTemplate``;
}, "/workspaces/telegram-astro-miniapp/src/pages/api/user.astro", void 0);

const $$file = "/workspaces/telegram-astro-miniapp/src/pages/api/user.astro";
const $$url = "/api/user";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  default: $$User,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
