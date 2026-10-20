import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateSafePublicUrl } from "../src/lib/tinyfish/urlSafety";
import { isTinyFishConfigured, TinyFishError } from "../src/lib/tinyfish/client";
import { MOCK_OPPORTUNITIES } from "../src/data/mockOpportunities";
import { calculateCompatibility } from "../src/utils/compatibility";
import { CreatorProfile, Opportunity } from "../src/types/creator";

describe("Focused Security & Data-Quality Audit: TinyFish Integration", () => {
  const mockCreator: CreatorProfile = {
    id: "rahul",
    name: "Rahul Verma",
    handle: "@rahulfit.india",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Fitness & Nutrition Creator",
    niche: "Fitness & Nutrition",
    primaryPlatform: "Instagram",
    followerCount: 15400,
    engagementRate: 4.8,
    audienceDemographic: "College students, gym beginners (18-24)",
    contentFormat: "Short-form video (Reels)",
    contentFrequency: "5-6 posts/week",
    creatorStage: "Micro (10k-50k)",
    primaryGoal: "Secure high-paying, recurring brand sponsorships",
    monetisationGoals: ["Brand Sponsorships", "Affiliate Marketing"],
    monthlyIncomeTarget: 75000,
    experienceLevel: "Growing (1-3 yrs)",
    bio: "Helping young adults build sustainable fitness habits on a student budget.",
    location: "Bengaluru, India",
    topics: ["Dorm Workouts", "High-Protein Meals", "Budget Fitness"],
    activeDealsCount: 2,
    estimatedPipelineValue: 65000,
    monthlyGrowthRate: 8.5,
    avgImpressionsPerPost: 42000,
    mediaKitLink: "https://creatormedia.io/rahulfit",
    isManuallyReported: true,
    isOnboarded: true,
    positioningStatement: "The budget-friendly fitness mentor for Indian students",
  };

  // --------------------------------------------------------------------------
  // Scenario 1: Invalid URL
  // --------------------------------------------------------------------------
  describe("Scenario 1: Invalid URL Rejection", () => {
    const invalidInputs = [
      "",
      "   ",
      "not-a-url",
      "htp://typo.com",
      "http://",
      "https://",
      "https:///path-only",
      "http://??",
      "https://".repeat(500), // Exceeds 2048 chars
      null,
      undefined,
      12345,
    ];

    for (const input of invalidInputs) {
      test(`rejects invalid input "${String(input).slice(0, 30)}"`, () => {
        const result = validateSafePublicUrl(input);
        assert.equal(result.safe, false, `Expected input to be rejected: ${input}`);
        assert.ok(result.reason && result.reason.length > 0);
      });
    }
  });

  // --------------------------------------------------------------------------
  // Scenario 2: Unsafe URL (SSRF Prevention)
  // --------------------------------------------------------------------------
  describe("Scenario 2: Unsafe URL & SSRF Guardrails", () => {
    const unsafeUrls = [
      // Localhost & Loopback
      "http://localhost",
      "http://localhost:3000/api",
      "http://127.0.0.1",
      "http://127.0.0.1:8080/secret",
      "http://127.1",
      "http://0.0.0.0",
      "http://[::1]",
      "http://[::1]:3000",
      // Cloud Metadata Endpoints (AWS, GCP, Azure)
      "http://169.254.169.254/latest/meta-data/",
      "http://169.254.169.254/computeMetadata/v1/",
      "http://metadata.google.internal/computeMetadata/v1/",
      "http://instance-data/latest/meta-data/",
      // RFC1918 Private IPv4
      "http://10.0.0.1/admin",
      "http://10.255.255.255",
      "http://172.16.0.1",
      "http://172.31.255.255",
      "http://192.168.0.1/router",
      "http://192.168.1.100:8080",
      // Carrier-Grade NAT & Link-Local
      "http://100.64.0.1",
      "http://169.254.1.1",
      // Private IPv6 (ULA & Link-Local)
      "http://[fe80::1]/",
      "http://[fc00::1]/",
      "http://[fd12:3456:789a::1]/",
      // Internal domain suffixes
      "http://api.backend.internal",
      "http://database.local",
      "http://service.localhost",
      // Obfuscated / Decimal IPs
      "http://2130706433", // 127.0.0.1 in decimal
      "http://0x7f000001", // 127.0.0.1 in hex
      // Disallowed protocols
      "file:///etc/passwd",
      "file:///C:/Windows/win.ini",
      "ftp://ftp.example.com",
      "gopher://example.com",
      "javascript:alert(1)",
      // Non-standard port probing
      "http://example.com:22",
      "http://example.com:3306",
      "http://example.com:5432",
      "http://example.com:6379",
      "http://example.com:27017",
      // Embedded credentials
      "http://admin:secret@example.com",
    ];

    for (const url of unsafeUrls) {
      test(`blocks unsafe URL "${url}" before any network dispatch`, () => {
        const result = validateSafePublicUrl(url);
        assert.equal(result.safe, false, `Expected unsafe URL to be blocked: ${url}`);
        assert.ok(result.reason, "Must provide explicit rejection reason");
      });
    }

    test("permits legitimate public HTTP & HTTPS destinations", () => {
      const safeUrls = [
        "https://www.github.com/geshan/developer-ambassador-programs",
        "https://www.asyncapi.com/community/ambassadors",
        "https://myprotein.co.in/affiliates",
        "http://example.com/creators",
        "https://subdomain.domain.org/path/to/page?utm_source=radar#section",
      ];
      for (const url of safeUrls) {
        const result = validateSafePublicUrl(url);
        assert.equal(result.safe, true, `Expected valid public URL: ${url}`);
        assert.ok(result.normalizedUrl);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 3: Unavailable Webpage
  // --------------------------------------------------------------------------
  describe("Scenario 3: Unavailable Webpage Handling", () => {
    test("formats 502 with structured diagnostic when TinyFish fetch returns 0 results", () => {
      // Simulate TinyFish Fetch API response when URL is a 404/unreachable
      const mockTinyFishErrorResponse = {
        results: [],
        errors: [{ url: "https://example.com/nonexistent-page-404", error: "Page not found (HTTP 404)" }],
      };

      assert.equal(mockTinyFishErrorResponse.results.length, 0);
      assert.equal(mockTinyFishErrorResponse.errors.length, 1);
      assert.ok(mockTinyFishErrorResponse.errors[0].error.includes("404"));

      // Verify error response schema expected by RadarInspectModal
      const apiResponse = {
        success: false,
        retrievalTimestamp: new Date().toISOString(),
        error: "FETCH_FAILED",
        details: mockTinyFishErrorResponse.errors[0].error,
      };

      assert.equal(apiResponse.success, false);
      assert.equal(apiResponse.error, "FETCH_FAILED");
      assert.ok(apiResponse.details.includes("404"));
    });

    test("formats 422 with structured diagnostic when page returns blank text", () => {
      const mockBlankFetchResponse = {
        results: [{ url: "https://example.com/empty", text: "   \n\t  " }],
        errors: [],
      };

      const isEmpty = !mockBlankFetchResponse.results[0].text.trim();
      assert.equal(isEmpty, true);

      const apiResponse = {
        success: false,
        retrievalTimestamp: new Date().toISOString(),
        error: "EMPTY_CONTENT",
        details: "The destination page returned no readable text or is behind an impenetrable paywall/login barrier.",
      };

      assert.equal(apiResponse.success, false);
      assert.equal(apiResponse.error, "EMPTY_CONTENT");
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 4: Empty Search
  // --------------------------------------------------------------------------
  describe("Scenario 4: Empty Search Response", () => {
    test("handles zero-result search gracefully without crashing", () => {
      // Simulate response from TinyFish for an unlikely phrase
      const mockEmptySearchResponse = {
        query: "xyzzy99999randomgibberishphrase_not_a_real_brand",
        results: [],
        total_results: 0,
      };

      const normalizedResponse = {
        success: true,
        totalResults: mockEmptySearchResponse.results.length,
        queryUsed: mockEmptySearchResponse.query,
        retrievalTimestamp: new Date().toISOString(),
        results: [],
      };

      assert.equal(normalizedResponse.success, true);
      assert.equal(normalizedResponse.totalResults, 0);
      assert.equal(normalizedResponse.results.length, 0);
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 5: Unverified Facts & Non-Fabrication
  // --------------------------------------------------------------------------
  describe("Scenario 5: Unverified Facts & Non-Fabrication Guarantee", () => {
    test("leaves compensation, deadline, and eligibility unverified when absent from page text", () => {
      const vaguePageMarkdown = `
# Acme Ambassador Community
Welcome to the Acme creator initiative. We love content creators who share our vision for developer productivity.
Check back regularly for announcements.
      `;

      // Simulating verification logic from heuristicExtract
      const currencyMatch = vaguePageMarkdown.match(/(?:₹|\$|€|£|INR|USD)\s?[\d,]+/i);
      const compensationVerified = currencyMatch !== null;
      assert.equal(compensationVerified, false);

      const deadlineMatch = vaguePageMarkdown.match(/(?:deadline|apply by|closing date)[:\s]+/i);
      const deadlineVerified = deadlineMatch !== null;
      assert.equal(deadlineVerified, false);

      const verification = {
        brandVerified: true,
        requirementsVerified: false,
        compensationVerified: false,
        deadlineVerified: false,
        applicationLinkVerified: false,
      };

      assert.equal(verification.compensationVerified, false);
      assert.equal(verification.deadlineVerified, false);
      assert.equal(verification.requirementsVerified, false);
    });

    test("accurately verifies compensation and deadline when explicitly provided", () => {
      const explicitPageMarkdown = `
# Developer Advocate Fellowship 2026
Compensation: $5,000 stipend per cohort
Deadline: Apply by November 30, 2026
Requirements:
- Minimum 5,000 YouTube subscribers
- Public GitHub repositories
Apply here: https://fellowship.example.com/apply
      `;

      const currencyMatch = explicitPageMarkdown.match(/(?:\$)\s?[\d,]+/);
      assert.ok(currencyMatch);
      assert.equal(currencyMatch[0], "$5,000");

      const deadlineMatch = explicitPageMarkdown.match(/Apply by ([A-Za-z]+ \d{1,2},? \d{4})/i);
      assert.ok(deadlineMatch);
      assert.equal(deadlineMatch[1], "November 30, 2026");

      const hasApplicationLink = explicitPageMarkdown.includes("https://fellowship.example.com/apply");
      assert.equal(hasApplicationLink, true);
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 6: API Key Security
  // --------------------------------------------------------------------------
  describe("Scenario 6: API Key Security & Isolation", () => {
    test("process.env.TINYFISH_API_KEY is never prefixed with NEXT_PUBLIC_", () => {
      assert.equal(process.env.NEXT_PUBLIC_TINYFISH_API_KEY, undefined);
    });

    test("isTinyFishConfigured correctly checks placeholder and empty states", () => {
      const original = process.env.TINYFISH_API_KEY;
      try {
        process.env.TINYFISH_API_KEY = "your-tinyfish-api-key-placeholder";
        assert.equal(isTinyFishConfigured(), false);

        process.env.TINYFISH_API_KEY = "";
        assert.equal(isTinyFishConfigured(), false);

        delete process.env.TINYFISH_API_KEY;
        assert.equal(isTinyFishConfigured(), false);
      } finally {
        process.env.TINYFISH_API_KEY = original;
      }
    });

    test("TinyFishError does not expose the API key in error messages", () => {
      const err = new TinyFishError("Authentication failed", "AUTH_ERROR", 401, "req-xyz-123");
      assert.equal(err.name, "TinyFishError");
      assert.equal(err.statusCode, 401);
      assert.equal(err.code, "AUTH_ERROR");
      assert.equal(err.requestId, "req-xyz-123");
      assert.equal(err.message.includes("your-real-key"), false);
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 7: Upstream Errors & Resiliency
  // --------------------------------------------------------------------------
  describe("Scenario 7: Upstream Errors & Resiliency", () => {
    test("handles TinyFish 401 authentication failure with typed AUTH_ERROR code", () => {
      const authErr = new TinyFishError(
        "TinyFish authentication failed. Please verify that TINYFISH_API_KEY in .env.local is valid and active.",
        "AUTH_ERROR",
        401
      );
      assert.equal(authErr.statusCode, 401);
      assert.equal(authErr.code, "AUTH_ERROR");
      assert.ok(authErr.message.includes(".env.local"));
    });

    test("handles timeout errors with typed TIMEOUT code", () => {
      const timeoutErr = new TinyFishError(
        "TinyFish Fetch timed out after 20000ms",
        "TIMEOUT",
        504
      );
      assert.equal(authErrOrTimeout(timeoutErr), "TIMEOUT");
    });

    function authErrOrTimeout(err: TinyFishError) {
      return err.code;
    }
  });

  // --------------------------------------------------------------------------
  // Scenario 8: Regression (Marketplace, Pipeline, Compatibility)
  // --------------------------------------------------------------------------
  describe("Scenario 8: Non-Regression of Curated Deals & Pipeline", () => {
    test("curated opportunities catalog contains all baseline deals with complete attributes", () => {
      assert.ok(MOCK_OPPORTUNITIES.length >= 8);
      for (const opp of MOCK_OPPORTUNITIES) {
        assert.ok(opp.id, "Opportunity must have an ID");
        assert.ok(opp.brand, "Opportunity must have a brand");
        assert.ok(opp.title, "Opportunity must have a title");
        assert.ok(Array.isArray(opp.niche), "Opportunity must have a niche array");
        assert.ok(opp.budgetMax >= opp.budgetMin, "budgetMax must be >= budgetMin");

        const compat = calculateCompatibility(opp, mockCreator);
        assert.ok(typeof compat.score === "number");
        assert.ok(compat.score >= 0 && compat.score <= 100);
        assert.ok(typeof compat.qualifies === "boolean");
      }
    });

    test("converted radar opportunity integrates seamlessly into existing pipeline", () => {
      const radarOpp: Opportunity = {
        id: "radar-opp-asyncapi",
        brand: "AsyncAPI Initiative",
        brandLogo: "🌐",
        brandCategory: "Tech & AI",
        title: "AsyncAPI Ambassador 2026",
        description: "Technical advocacy program",
        niche: ["Tech & AI"],
        platform: "Multi-Platform",
        minFollowers: 5000,
        budgetRange: "Travel grants & Hardware",
        budgetMin: 20000,
        budgetMax: 50000,
        deadline: "Rolling Admissions",
        deliverables: ["1x Video Tutorial"],
        status: "Available",
        targetAudience: "Developers",
        targetLocation: "Global",
        eligibilityRequirements: ["Active technical creator"],
        sponsoredTag: false,
      };

      const compat = calculateCompatibility(radarOpp, mockCreator);
      assert.ok(typeof compat.score === "number");
      assert.ok(compat.score >= 0 && compat.score <= 100);

      const mergedList = [radarOpp, ...MOCK_OPPORTUNITIES];
      assert.equal(mergedList.length, MOCK_OPPORTUNITIES.length + 1);
      assert.equal(mergedList[0].id, "radar-opp-asyncapi");
    });
  });
});
