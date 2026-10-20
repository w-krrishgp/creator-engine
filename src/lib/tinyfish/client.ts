import {
  TinyFishSearchParams,
  TinyFishSearchResponse,
  TinyFishFetchOptions,
  TinyFishFetchResponse,
} from "@/types/radar";

const TINYFISH_SEARCH_ENDPOINT = "https://api.search.tinyfish.ai";
const TINYFISH_FETCH_ENDPOINT = "https://api.fetch.tinyfish.ai";
const DEFAULT_TIMEOUT_MS = 15000;

export class TinyFishError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly requestId?: string;

  constructor(message: string, code: string, statusCode?: number, requestId?: string) {
    super(message);
    this.name = "TinyFishError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
  }
}

/**
 * Checks whether the server environment has a non-placeholder TinyFish API key configured.
 * This function NEVER returns or logs the key value.
 */
export function isTinyFishConfigured(): boolean {
  if (typeof window !== "undefined") {
    return false; // Server-only
  }
  const key = process.env.TINYFISH_API_KEY;
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed === "" || trimmed.includes("placeholder") || trimmed.includes("your-tinyfish-api-key")) {
    return false;
  }
  return true;
}

/**
 * Securely retrieves the API key for server-side requests only.
 * Throws a typed TinyFishError if unconfigured or attempted from client.
 */
function getSecureApiKey(): string {
  if (typeof window !== "undefined") {
    throw new TinyFishError(
      "TinyFish client cannot be called from browser / client-side code.",
      "CLIENT_INVOCATION_FORBIDDEN"
    );
  }

  const key = process.env.TINYFISH_API_KEY;
  if (!key || !key.trim() || key.includes("placeholder") || key.includes("your-tinyfish-api-key")) {
    throw new TinyFishError(
      "TINYFISH_API_KEY is not configured in server environment. Add TINYFISH_API_KEY to .env.local to enable live-web scanning.",
      "MISSING_API_KEY"
    );
  }

  return key.trim();
}

/**
 * Executes a live web search using the official TinyFish Search API.
 * Endpoint: GET https://api.search.tinyfish.ai
 * Authentication: Header X-API-Key
 */
export async function searchTinyFish(
  params: TinyFishSearchParams,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<TinyFishSearchResponse> {
  const apiKey = getSecureApiKey();

  if (!params.query || !params.query.trim()) {
    throw new TinyFishError("Query string is required for TinyFish search.", "INVALID_INPUT", 400);
  }

  const cleanQuery = params.query.trim().slice(0, 300); // Guard query length

  const url = new URL(TINYFISH_SEARCH_ENDPOINT);
  url.searchParams.set("query", cleanQuery);

  if (params.purpose) {
    url.searchParams.set("purpose", params.purpose.trim().slice(0, 500));
  }
  if (params.location) {
    url.searchParams.set("location", params.location.trim().toUpperCase().slice(0, 10));
  }
  if (params.language) {
    url.searchParams.set("language", params.language.trim().toLowerCase().slice(0, 5));
  }
  if (params.include_domains) {
    url.searchParams.set("include_domains", params.include_domains.trim());
  }
  if (params.exclude_domains) {
    url.searchParams.set("exclude_domains", params.exclude_domains.trim());
  }
  if (params.recency_minutes && params.recency_minutes > 0) {
    url.searchParams.set("recency_minutes", Math.min(params.recency_minutes, 5256000).toString());
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const requestId = res.headers.get("x-request-id") || undefined;
    const rawText = await res.text();
    let data: unknown;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new TinyFishError(
        `Failed to parse TinyFish Search response as JSON: ${rawText.slice(0, 200)}`,
        "MALFORMED_RESPONSE",
        res.status,
        requestId
      );
    }

    const json = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;

    if (!res.ok) {
      const errObj = (json.error && typeof json.error === "object" ? json.error : {}) as Record<string, unknown>;
      const errCode = typeof errObj.code === "string" ? errObj.code : `HTTP_${res.status}`;
      const errMsg = typeof errObj.message === "string" ? errObj.message : `TinyFish Search request failed with status ${res.status}`;

      if (res.status === 401) {
        throw new TinyFishError(
          "TinyFish authentication failed. Please check that TINYFISH_API_KEY in .env.local is valid and active.",
          "INVALID_API_KEY",
          401,
          requestId
        );
      }
      if (res.status === 429) {
        throw new TinyFishError(
          "TinyFish Search rate limit exceeded. Please wait a moment before trying again.",
          "RATE_LIMIT_EXCEEDED",
          429,
          requestId
        );
      }
      if (res.status === 402 || res.status === 403) {
        throw new TinyFishError(
          "TinyFish request limit exceeded or payment required for this account.",
          "BILLING_QUOTA_EXCEEDED",
          res.status,
          requestId
        );
      }

      throw new TinyFishError(errMsg, errCode, res.status, requestId);
    }

    // Validate response structure
    const results = Array.isArray(json.results) ? json.results : [];
    const validResults = results.map((item, idx) => {
      const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        position: typeof rec.position === "number" ? rec.position : idx + 1,
        site_name: typeof rec.site_name === "string" ? rec.site_name : "",
        title: typeof rec.title === "string" ? rec.title : "Untitled Opportunity",
        snippet: typeof rec.snippet === "string" ? rec.snippet : "",
        url: typeof rec.url === "string" ? rec.url : "",
      };
    });

    return {
      query: typeof json.query === "string" ? json.query : cleanQuery,
      results: validResults,
      total_results: typeof json.total_results === "number" ? json.total_results : validResults.length,
      page: typeof json.page === "number" ? json.page : 0,
      request_id: requestId,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof TinyFishError) {
      throw err;
    }

    if (err instanceof Error && err.name === "AbortError") {
      throw new TinyFishError(
        `TinyFish Search request timed out after ${timeoutMs}ms.`,
        "REQUEST_TIMEOUT",
        408
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    throw new TinyFishError(
      `Network or server connection error while contacting TinyFish Search: ${message}`,
      "NETWORK_ERROR"
    );
  }
}

/**
 * Executes live webpage context extraction using the official TinyFish Fetch API.
 * Endpoint: POST https://api.fetch.tinyfish.ai
 * Authentication: Header X-API-Key
 */
export async function fetchTinyFish(
  urls: string[],
  options: TinyFishFetchOptions = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<TinyFishFetchResponse> {
  const apiKey = getSecureApiKey();

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    throw new TinyFishError("At least one URL is required for TinyFish Fetch.", "INVALID_INPUT", 400);
  }

  // Maximum 10 URLs per request per TinyFish API specification
  const targetUrls = urls.slice(0, 10);

  const payload: Record<string, unknown> = {
    urls: targetUrls,
    format: options.format || "markdown",
    ttl: options.ttl !== undefined ? options.ttl : 0, // Default to 0 for live, fresh fetching
  };

  if (options.purpose) {
    payload.purpose = options.purpose.slice(0, 2000);
  }
  if (options.links !== undefined) {
    payload.links = Boolean(options.links);
  }
  if (options.image_links !== undefined) {
    payload.image_links = Boolean(options.image_links);
  }
  if (options.iframe_links !== undefined) {
    payload.iframe_links = Boolean(options.iframe_links);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(TINYFISH_FETCH_ENDPOINT, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const requestId = res.headers.get("x-request-id") || undefined;
    const rawText = await res.text();
    let data: unknown;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new TinyFishError(
        `Failed to parse TinyFish Fetch response as JSON: ${rawText.slice(0, 200)}`,
        "MALFORMED_RESPONSE",
        res.status,
        requestId
      );
    }

    const json = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;

    if (!res.ok) {
      const errObj = (json.error && typeof json.error === "object" ? json.error : {}) as Record<string, unknown>;
      const errCode = typeof errObj.code === "string" ? errObj.code : `HTTP_${res.status}`;
      const errMsg = typeof errObj.message === "string" ? errObj.message : `TinyFish Fetch request failed with status ${res.status}`;

      if (res.status === 401) {
        throw new TinyFishError(
          "TinyFish authentication failed. Please verify that TINYFISH_API_KEY in .env.local is valid and active.",
          "INVALID_API_KEY",
          401,
          requestId
        );
      }
      if (res.status === 429) {
        throw new TinyFishError(
          "TinyFish Fetch rate limit exceeded. Please wait a moment before trying again.",
          "RATE_LIMIT_EXCEEDED",
          429,
          requestId
        );
      }

      throw new TinyFishError(errMsg, errCode, res.status, requestId);
    }

    const results = Array.isArray(json.results) ? json.results : [];
    const errors = Array.isArray(json.errors) ? json.errors : [];

    const parsedResults = results.map((item) => {
      const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        url: typeof rec.url === "string" ? rec.url : "",
        final_url: typeof rec.final_url === "string" ? rec.final_url : undefined,
        title: typeof rec.title === "string" ? rec.title : undefined,
        description: typeof rec.description === "string" ? rec.description : undefined,
        language: typeof rec.language === "string" ? rec.language : undefined,
        format: typeof rec.format === "string" ? rec.format : "markdown",
        text: typeof rec.text === "string" ? rec.text : "",
        links: Array.isArray(rec.links) ? rec.links.filter((l): l is string => typeof l === "string") : undefined,
      };
    });

    const parsedErrors = errors.map((item) => {
      const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        url: typeof rec.url === "string" ? rec.url : "",
        error: typeof rec.error === "string" ? rec.error : "Unknown fetch failure",
      };
    });

    return {
      results: parsedResults,
      errors: parsedErrors,
      request_id: requestId,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof TinyFishError) {
      throw err;
    }

    if (err instanceof Error && err.name === "AbortError") {
      throw new TinyFishError(
        `TinyFish Fetch request timed out after ${timeoutMs}ms.`,
        "REQUEST_TIMEOUT",
        408
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    throw new TinyFishError(
      `Network or server connection error while contacting TinyFish Fetch: ${message}`,
      "NETWORK_ERROR"
    );
  }
}
