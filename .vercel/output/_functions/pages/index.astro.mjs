import { e as createComponent, r as renderTemplate, k as renderHead } from '../chunks/astro/server_DCP9PL5F.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Telegram Mini App Home</title>', '</head> <body data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Welcome to the Mini App!</h1> <div id="status" data-astro-cid-j7pv25f6>Loading...</div> <div id="loader" class="loader" data-astro-cid-j7pv25f6></div> <div id="user-info" style="display: none;" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Welcome, <strong id="username-display" data-astro-cid-j7pv25f6></strong>!</p> <a href="/profile" data-astro-cid-j7pv25f6> <button data-astro-cid-j7pv25f6>Go to Profile</button> </a> </div> <div id="error-message" style="color: red; display: none;" data-astro-cid-j7pv25f6></div> </div> <!-- CORRECTION: Use relative path for src attribute with type="module" and client:load --> <script type="module" src="../scripts/home.ts" client:load><\/script> </body> </html>'])), renderHead());
}, "/workspaces/telegram-astro-miniapp/src/pages/index.astro", void 0);

const $$file = "/workspaces/telegram-astro-miniapp/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
