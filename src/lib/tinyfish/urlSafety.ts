/**
 * SSRF and URL Safety Validator for Server-Side Web Fetching.
 * Strictly verifies that URLs target safe, public HTTP/HTTPS endpoints.
 */


const DISALLOWED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "metadata.google.internal",
  "instance-data",
]);

const DISALLOWED_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".arpa",
  ".onion",
];

function isPrivateIpv4(ipStr: string): boolean {
  const parts = ipStr.split(".");
  if (parts.length !== 4) return false;
  const octets = parts.map((p) => parseInt(p, 10));
  if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) return true; // Malformed -> treat as unsafe

  // Check 10.0.0.0/8
  if (octets[0] === 10) return true;
  // Check 172.16.0.0/12
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  // Check 192.168.0.0/16
  if (octets[0] === 192 && octets[1] === 168) return true;
  // Check 127.0.0.0/8 (Loopback)
  if (octets[0] === 127) return true;
  // Check 169.254.0.0/16 (Link-local / Cloud metadata: 169.254.169.254)
  if (octets[0] === 169 && octets[1] === 254) return true;
  // Check 0.0.0.0/8
  if (octets[0] === 0) return true;
  // Check 100.64.0.0/10
  if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;
  // Check Multicast & Reserved (>= 224)
  if (octets[0] >= 224) return true;

  return false;
}

function isPrivateIpv6(host: string): boolean {
  const clean = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (clean === "::1" || clean === "::") return true;
  // IPv6 ULA (fc00::/7)
  if (clean.startsWith("fc") || clean.startsWith("fd")) return true;
  // IPv6 Link-Local (fe80::/10)
  if (clean.startsWith("fe8") || clean.startsWith("fe9") || clean.startsWith("fea") || clean.startsWith("feb")) {
    return true;
  }
  // IPv4-mapped IPv6 (::ffff:192.168.1.1 or ::ffff:c0a8:0101)
  if (clean.startsWith("::ffff:")) {
    const v4Part = clean.replace("::ffff:", "");
    if (v4Part.includes(".")) {
      return isPrivateIpv4(v4Part);
    }
  }
  return false;
}

export interface UrlSafetyResult {
  safe: boolean;
  reason?: string;
  normalizedUrl?: string;
}

/**
 * Validates whether a URL is a safe public HTTP/HTTPS endpoint.
 */
export function validateSafePublicUrl(urlString: unknown): UrlSafetyResult {
  if (typeof urlString !== "string" || !urlString.trim()) {
    return { safe: false, reason: "URL must be a non-empty string" };
  }

  const trimmed = urlString.trim();

  // Basic length sanity check
  if (trimmed.length > 2048) {
    return { safe: false, reason: "URL exceeds maximum permitted length of 2048 characters" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { safe: false, reason: "Invalid URL syntax" };
  }

  // Protocol check: Only http and https permitted
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      safe: false,
      reason: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted`,
    };
  }

  const rawHost = parsed.hostname.toLowerCase();
  const cleanHost = rawHost.replace(/^\[|\]$/g, "");

  if (!cleanHost) {
    return { safe: false, reason: "URL missing hostname" };
  }

  // Exact disallowed hostnames
  if (DISALLOWED_HOSTNAMES.has(rawHost) || DISALLOWED_HOSTNAMES.has(cleanHost)) {
    return { safe: false, reason: `Access to local/internal host "${rawHost}" is forbidden` };
  }

  // Disallowed domain suffixes (.internal, .local, etc.)
  for (const suffix of DISALLOWED_SUFFIXES) {
    if (cleanHost.endsWith(suffix) || rawHost.endsWith(suffix)) {
      return { safe: false, reason: `Access to internal domain zone "${suffix}" is forbidden` };
    }
  }

  // Disallow single-label internal hostnames without a dot (e.g. http://router, http://intranet)
  if (!cleanHost.includes(".") && !cleanHost.includes(":")) {
    return { safe: false, reason: "Single-label internal hostnames without a public domain extension are disallowed" };
  }

  // Check if hostname is an integer or hex (IP obfuscation trick, e.g. http://2130706433)
  if (/^\d+$/.test(rawHost) || /^0x[0-9a-f]+$/i.test(rawHost)) {
    return { safe: false, reason: "Numeric/hexadecimal IP representations are disallowed" };
  }

  // IPv4 check
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(rawHost)) {
    if (isPrivateIpv4(rawHost)) {
      return { safe: false, reason: `Access to private/link-local IP address "${rawHost}" is forbidden` };
    }
  }

  // IPv6 check
  if (rawHost.includes(":") || (rawHost.startsWith("[") && rawHost.endsWith("]"))) {
    if (isPrivateIpv6(rawHost)) {
      return { safe: false, reason: `Access to private IPv6 address "${rawHost}" is forbidden` };
    }
  }

  // Disallow user credentials embedded in URL (e.g., http://user:pass@host)
  if (parsed.username || parsed.password) {
    return { safe: false, reason: "URLs containing embedded user credentials are not permitted" };
  }

  // Port checks: standard 80/443 or typical web ports only
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    const ALLOWED_PORTS = new Set([80, 443, 8080, 8443]);
    if (!ALLOWED_PORTS.has(portNum)) {
      return {
        safe: false,
        reason: `Port ${portNum} is not permitted for live web extraction. Only standard web ports (80, 443, 8080, 8443) are allowed`,
      };
    }
  }

  return {
    safe: true,
    normalizedUrl: parsed.href,
  };
}
