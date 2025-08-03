const OLLAMA_PROXY_CACHE = "ollama-proxy-v1";

// Service Worker for proxying Ollama API requests
// This allows the app to make requests to local Ollama instances
// even when served from a public domain (bypasses CORS)

self.addEventListener("install", (_event) => {
  console.log("Ollama Proxy Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Ollama Proxy Service Worker activated");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Check if this is an Ollama API request that needs proxying
  if (event.request.headers.get("X-Ollama-Proxy") === "true") {
    event.respondWith(handleOllamaRequest(event.request));
    return;
  }

  // Let other requests pass through normally
  return;
});

async function handleOllamaRequest(request) {
  try {
    // Get the actual Ollama URL from the custom header
    const targetUrl = request.headers.get("X-Ollama-Target-URL");

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: "Missing X-Ollama-Target-URL header" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Clone the request and modify it for the actual Ollama endpoint
    const requestClone = request.clone();
    const body = await requestClone.text();

    // Create new request with the target URL
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        // Remove proxy-specific headers
        ...Object.fromEntries(
          Array.from(request.headers.entries()).filter(
            ([key]) => !key.startsWith("X-Ollama-"),
          ),
        ),
      },
      body: request.method !== "GET" ? body : undefined,
      mode: "cors",
      credentials: "omit",
    });

    // Make the actual request to Ollama
    const response = await fetch(proxyRequest);

    // Clone the response to modify headers
    const responseClone = response.clone();
    const responseBody = await responseClone.text();

    // Return response with CORS headers
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Ollama-Proxy, X-Ollama-Target-URL",
      },
    });
  } catch (error) {
    console.error("Ollama proxy error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to proxy request to Ollama",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

// Handle preflight OPTIONS requests
self.addEventListener("fetch", (event) => {
  if (
    event.request.method === "OPTIONS" &&
    event.request.headers.get("X-Ollama-Proxy") === "true"
  ) {
    event.respondWith(
      new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Ollama-Proxy, X-Ollama-Target-URL",
          "Access-Control-Max-Age": "86400",
        },
      }),
    );
  }
});
