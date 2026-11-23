/* global addEventListener, btoa, fetch, PCO_APP_ID, PCO_SECRET, Request, Response, URL */

const proxyEndpoint = "/proxy/";
const planningCenterOrigin = "https://api.planningcenteronline.com";
const demoApiUrl = "https://examples.cloudflareworkers.com/demos/demoapi";
const proxyMethods = new Set(["GET", "HEAD", "POST"]);
const allowedMethods = "GET, HEAD, POST, OPTIONS";
const corsHeaders = { "Access-Control-Allow-Origin": "*" };
const preflightHeaders = {
  ...corsHeaders,
  "Access-Control-Allow-Methods": allowedMethods,
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "600",
};

function handleOptions(request) {
  const isPreflight =
    request.headers.has("Origin") &&
    request.headers.has("Access-Control-Request-Method");

  return new Response(null, {
    status: 204,
    headers: isPreflight ? preflightHeaders : { Allow: allowedMethods },
  });
}

function proxyError(request, status, message) {
  return new Response(request.method === "HEAD" ? null : message, {
    status,
    headers: corsHeaders,
  });
}

async function proxyRequest(request, url) {
  let target;
  try {
    target = new URL(url.searchParams.get("apiurl"));
  } catch {
    return proxyError(request, 400, "Provide a valid apiurl.");
  }

  if (target.username || target.password) {
    return proxyError(request, 400, "apiurl must omit embedded credentials.");
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return proxyError(request, 400, "apiurl must use HTTP or HTTPS.");
  }

  const upstreamRequest = new Request(target.href, request);
  upstreamRequest.headers.set("Origin", target.origin);

  if (target.origin === planningCenterOrigin) {
    const appId = typeof PCO_APP_ID === "string" ? PCO_APP_ID.trim() : "";
    const secret = typeof PCO_SECRET === "string" ? PCO_SECRET.trim() : "";
    if (!appId || !secret) {
      return proxyError(
        request,
        503,
        "Planning Center credentials are unavailable.",
      );
    }

    upstreamRequest.headers.set(
      "Authorization",
      `Basic ${btoa(`${appId}:${secret}`)}`,
    );
  }

  let upstream;
  try {
    // Return redirects to the caller so authorization stays scoped to this upstream.
    upstream = await fetch(upstreamRequest, { redirect: "manual" });
  } catch {
    return proxyError(request, 502, "Upstream request failed.");
  }

  const response = new Response(upstream.body, upstream);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

function handleRequest(request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(proxyEndpoint)) {
    return new Response(request.method === "HEAD" ? null : demoPage, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  }

  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  if (!proxyMethods.has(request.method)) {
    return new Response(null, {
      status: 405,
      headers: { ...corsHeaders, Allow: allowedMethods },
    });
  }

  return proxyRequest(request, url);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const demoPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CORS proxy demo</title>
</head>
<body>
  <h1>CORS proxy demo</h1>
  <h2>Direct GET</h2>
  <code id="direct">Waiting</code>
  <h2>Proxied GET</h2>
  <code id="proxy">Waiting</code>
  <h2>Proxied POST with preflight</h2>
  <code id="post">Waiting</code>
  <script>
    const apiUrl = "${demoApiUrl}";
    const proxyUrl = new URL("${proxyEndpoint}", window.location.origin);
    proxyUrl.searchParams.set("apiurl", apiUrl);

    async function showResult(id, url, options) {
      const output = document.getElementById(id);
      try {
        const response = await fetch(url, options);
        output.textContent = JSON.stringify(await response.json());
      } catch (error) {
        output.textContent = String(error);
      }
    }

    showResult("direct", apiUrl);
    showResult("proxy", proxyUrl);
    showResult("post", proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg: "Hello world!" }),
    });
  </script>
</body>
</html>`;
