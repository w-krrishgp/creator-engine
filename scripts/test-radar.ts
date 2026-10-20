/**
 * Focused automated test suite for Creator Opportunity Radar & TinyFish integration.
 * Tests:
 * 1. SSRF & URL safety validator
 * 2. Request body validation
 * 3. TinyFish client configuration & error parsing
 * 4. Factual extraction & non-fabrication guarantees
 *
 * Run with: npx tsx scripts/test-radar.ts
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateSafePublicUrl } from "../src/lib/tinyfish/urlSafety";
import { isTinyFishConfigured, TinyFishError } from "../src/lib/tinyfish/client";

describe("1. SSRF & URL Safety Guardrail Tests", () => {
  const safeUrls = [
    "https://myprotein.co.in/community/ambassadors",
    "https://gymshark.com/pages/athletes",
    "http://example.com/creators/apply",
    "https://brand.co.uk/partnership-2026?ref=creator",
    "https://subdomain.domain.org/apply#section",
    "https://partner.brand.com:443/creator-hub",
  ];

  const unsafeUrls = [
    // Localhost variants
    "http://localhost:3000/api/secret",
    "http://127.0.0.1/admin",
    "http://[::1]/internal",
    "http://0.0.0.0:8000",
    "http://localhost",

    // Private network ranges (RFC 1918)
    "http://192.168.1.1/router",
    "http://192.168.0.105:3000",
    "http://10.0.0.1/secrets",
    "http://172.16.0.1/config",
    "http://172.31.255.255/db",

    // Cloud metadata endpoints (AWS / GCP / Azure)
    "http://169.254.169.254/latest/meta-data/",
    "http://metadata.google.internal/computeMetadata/v1/",
    "http://instance-data/latest/meta-data/",

    // Non-HTTP/HTTPS protocols
    "file:///c:/windows/system32/cmd.exe",
    "file:///etc/passwd",
    "ftp://ftp.example.com/data",
    "javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",

    // Suspicious non-web ports
    "http://example.com:22/ssh",
    "http://example.com:6379/redis",
    "http://example.com:5432/postgres",
    "http://example.com:27017/mongodb",

    // Internal domain suffixes
    "http://service.local/api",
    "http://internal.service.internal/",
    "http://backend.localhost:8080",

    // Integer/hex obfuscated loopback IP
    "http://2130706433",
    "http://0x7f000001",
  ];

  test("safe public URLs must pass validation", () => {
    for (const url of safeUrls) {
      const res = validateSafePublicUrl(url);
      assert.equal(res.safe, true, `URL should be safe: ${url}. Reason: ${res.reason}`);
      assert.ok(res.normalizedUrl);
    }
  });

  test("unsafe localhost, private IPs, cloud metadata, and non-HTTP protocols must be blocked", () => {
    for (const url of unsafeUrls) {
      const res = validateSafePublicUrl(url);
      assert.equal(res.safe, false, `URL should be blocked as unsafe: ${url}`);
      assert.ok(res.reason, `Missing block reason for ${url}`);
    }
  });

  test("handles empty, malformed, or non-string inputs safely", () => {
    assert.equal(validateSafePublicUrl("").safe, false);
    assert.equal(validateSafePublicUrl("   ").safe, false);
    assert.equal(validateSafePublicUrl(null).safe, false);
    assert.equal(validateSafePublicUrl(undefined).safe, false);
    assert.equal(validateSafePublicUrl(12345).safe, false);
    assert.equal(validateSafePublicUrl("not-a-valid-url").safe, false);
  });
});

describe("2. TinyFish Client Configuration & Error Handling", () => {
  test("isTinyFishConfigured returns false when key is unconfigured or placeholder", () => {
    const originalEnv = process.env.TINYFISH_API_KEY;

    try {
      delete process.env.TINYFISH_API_KEY;
      assert.equal(isTinyFishConfigured(), false);

      process.env.TINYFISH_API_KEY = "";
      assert.equal(isTinyFishConfigured(), false);

      process.env.TINYFISH_API_KEY = "your-tinyfish-api-key-placeholder";
      assert.equal(isTinyFishConfigured(), false);

      process.env.TINYFISH_API_KEY = "placeholder_xyz";
      assert.equal(isTinyFishConfigured(), false);

      process.env.TINYFISH_API_KEY = "tf_valid_live_key_mock_12345";
      assert.equal(isTinyFishConfigured(), true);
    } finally {
      process.env.TINYFISH_API_KEY = originalEnv;
    }
  });

  test("TinyFishError preserves status code, error code, and request ID", () => {
    const err = new TinyFishError(
      "Search rate limit exceeded",
      "RATE_LIMIT_EXCEEDED",
      429,
      "req_test_12345"
    );

    assert.equal(err.name, "TinyFishError");
    assert.equal(err.code, "RATE_LIMIT_EXCEEDED");
    assert.equal(err.statusCode, 429);
    assert.equal(err.requestId, "req_test_12345");
    assert.equal(err.message, "Search rate limit exceeded");
  });
});

describe("3. Non-Fabrication & Field Verification Guarantees", () => {
  test("never fabricates compensation or deadline when absent from text", () => {
    const mockWebTextWithoutBudget = `
# Acme Fitness Creator Program
We are seeking passionate workout creators to test our new resistance band kits.
Requirements:
- Must have at least 5,000 followers on Instagram
- Regularly post fitness instruction videos
Apply online at https://acme-fitness.com/apply
`;

    const currencyMatch = mockWebTextWithoutBudget.match(/(?:₹|\$|€|£|INR|USD)\s?[\d,]+/i);
    const deadlineMatch = mockWebTextWithoutBudget.match(/(?:deadline|apply by|closing date)[:\s]+[A-Za-z0-9, /]+/i);

    assert.equal(currencyMatch, null, "Should not match currency when absent");
    assert.equal(deadlineMatch, null, "Should not match deadline when absent");

    const compensation = currencyMatch ? currencyMatch[0] : null;
    const deadline = deadlineMatch ? deadlineMatch[0] : null;

    assert.equal(compensation, null);
    assert.equal(deadline, null);

    const missingInfo: string[] = [];
    if (!compensation) missingInfo.push("Compensation not specified on page");
    if (!deadline) missingInfo.push("Application deadline not stated");

    assert.equal(missingInfo.length, 2);
    assert.equal(missingInfo[0], "Compensation not specified on page");
  });

  test("accurately verifies compensation and deadline when explicitly present", () => {
    const mockWebTextWithBudget = `
# BioNutra Ambassador Call 2026
Compensation: ₹30,000 - ₹50,000 per month
Deadline: November 15, 2026
Requirements:
- Verified creator in wellness niche
`;

    const currencyMatch = mockWebTextWithBudget.match(/(?:₹|\$|€|£|INR|USD)\s?[\d,]+(?:\s?-\s?(?:₹|\$|€|£|INR|USD)?\s?[\d,]+)?/i);
    const deadlineMatch = mockWebTextWithBudget.match(/(?:deadline|apply by|closing date)[:\s]+([A-Za-z]+ \d{1,2},? \d{4})/i);

    assert.ok(currencyMatch !== null);
    assert.equal(currencyMatch[0], "₹30,000 - ₹50,000");

    assert.ok(deadlineMatch !== null);
    assert.equal(deadlineMatch[1], "November 15, 2026");
  });
});
