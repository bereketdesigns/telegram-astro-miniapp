import { e as createComponent, r as renderTemplate, k as renderHead } from '../chunks/astro/server_GG320oEE.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Profile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-wwes6yjo> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Profile</title>', '</head> <body data-astro-cid-wwes6yjo> <div class="profile-card" data-astro-cid-wwes6yjo> <h1 data-astro-cid-wwes6yjo>Your Profile</h1> <div id="loading" class="loader" data-astro-cid-wwes6yjo></div> <div id="user-profile" style="display: none;" data-astro-cid-wwes6yjo> <img id="profile-photo" class="profile-picture" alt="Profile Picture" style="display: none;" data-astro-cid-wwes6yjo> <p data-astro-cid-wwes6yjo>Telegram ID: <strong id="telegram-id-display" data-astro-cid-wwes6yjo></strong></p> <p data-astro-cid-wwes6yjo>Username: <strong id="username-display" data-astro-cid-wwes6yjo></strong></p> <p data-astro-cid-wwes6yjo>Name: <strong id="full-name-display" data-astro-cid-wwes6yjo></strong></p> <button id="logout-button" data-astro-cid-wwes6yjo>Logout</button> </div> <div id="error-message" style="color: red; display: none;" data-astro-cid-wwes6yjo></div> </div> <!-- CORRECTION: Use relative path for src attribute with type="module" --> <script type="module" src="../scripts/profile.js"><\/script> </body> </html>'])), renderHead());
}, "/workspaces/telegram-astro-miniapp/src/pages/profile.astro", void 0);

const $$file = "/workspaces/telegram-astro-miniapp/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
