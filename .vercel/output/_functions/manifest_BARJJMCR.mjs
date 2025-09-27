import 'kleur/colors';
import { l as decodeKey } from './chunks/astro/server_DCP9PL5F.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_kmBu0ONe.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///workspaces/telegram-astro-miniapp/","cacheDir":"file:///workspaces/telegram-astro-miniapp/node_modules/.astro/","outDir":"file:///workspaces/telegram-astro-miniapp/dist/","srcDir":"file:///workspaces/telegram-astro-miniapp/src/","publicDir":"file:///workspaces/telegram-astro-miniapp/public/","buildClientDir":"file:///workspaces/telegram-astro-miniapp/dist/client/","buildServerDir":"file:///workspaces/telegram-astro-miniapp/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth","isIndex":false,"type":"page","pattern":"^\\/api\\/auth\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth.astro","pathname":"/api/auth","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/user","isIndex":false,"type":"page","pattern":"^\\/api\\/user\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/user.astro","pathname":"/api/user","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"body{font-family:Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;margin:0;background-color:var(--tg-theme-bg-color, #ffffff);color:var(--tg-theme-text-color, #000000);transition:background-color .3s ease,color .3s ease}.profile-card[data-astro-cid-wwes6yjo]{text-align:center;padding:30px;background-color:var(--tg-theme-secondary-bg-color, #f0f0f0);border-radius:8px;box-shadow:0 4px 8px #0000001a;max-width:400px;width:90%}h1[data-astro-cid-wwes6yjo]{color:var(--tg-theme-text-color, #000000);margin-bottom:20px}.profile-picture[data-astro-cid-wwes6yjo]{width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:20px;border:3px solid var(--tg-theme-link-color, #3498db)}p[data-astro-cid-wwes6yjo]{margin:10px 0;line-height:1.5}strong[data-astro-cid-wwes6yjo]{color:var(--tg-theme-link-color, #007bff)}button[data-astro-cid-wwes6yjo]{background-color:var(--tg-theme-button-color, #dc3545);color:var(--tg-theme-button-text-color, #ffffff);border:none;padding:10px 20px;border-radius:5px;cursor:pointer;font-size:1em;margin-top:30px;transition:background-color .3s ease,opacity .3s ease}button[data-astro-cid-wwes6yjo]:hover{opacity:.9}.loader[data-astro-cid-wwes6yjo]{border:4px solid var(--tg-theme-hint-color, #f3f3f3);border-top:4px solid var(--tg-theme-link-color, #3498db);border-radius:50%;width:30px;height:30px;animation:spin 2s linear infinite;margin:20px auto}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"}],"routeData":{"route":"/profile","isIndex":false,"type":"page","pattern":"^\\/profile\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.astro","pathname":"/profile","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"body{font-family:Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;margin:0;background-color:var(--tg-theme-bg-color, #ffffff);color:var(--tg-theme-text-color, #000000);transition:background-color .3s ease,color .3s ease}.container[data-astro-cid-j7pv25f6]{text-align:center;padding:20px;background-color:var(--tg-theme-secondary-bg-color, #f0f0f0);border-radius:8px;box-shadow:0 4px 8px #0000001a}h1[data-astro-cid-j7pv25f6]{color:var(--tg-theme-text-color, #000000)}button[data-astro-cid-j7pv25f6]{background-color:var(--tg-theme-button-color, #007bff);color:var(--tg-theme-button-text-color, #ffffff);border:none;padding:10px 20px;border-radius:5px;cursor:pointer;font-size:1em;margin-top:20px;transition:background-color .3s ease,opacity .3s ease}button[data-astro-cid-j7pv25f6]:hover{opacity:.9}.loader[data-astro-cid-j7pv25f6]{border:4px solid var(--tg-theme-hint-color, #f3f3f3);border-top:4px solid var(--tg-theme-link-color, #3498db);border-radius:50%;width:30px;height:30px;animation:spin 2s linear infinite;margin:20px auto}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/workspaces/telegram-astro-miniapp/src/pages/profile.astro",{"propagation":"none","containsHead":true}],["/workspaces/telegram-astro-miniapp/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/auth@_@astro":"pages/api/auth.astro.mjs","\u0000@astro-page:src/pages/api/user@_@astro":"pages/api/user.astro.mjs","\u0000@astro-page:src/pages/profile@_@astro":"pages/profile.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BARJJMCR.mjs","/workspaces/telegram-astro-miniapp/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_kT-vtTlt.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"QeHJTe3UrLeOo1KIwp4BYgpM6UsYio0pOuuX4ecozv4="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
