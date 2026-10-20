export type SupportedPlatform = "youtube" | "instagram" | "linkedin";

export interface ParsedProfileUrl {
  platform: SupportedPlatform;
  rawUrl: string;
  normalizedUrl: string;
  identifier: string; // e.g. "@mkbhd", "UCbjqE5vH4Yn_mYmK6_fH27Q", "alexcreates"
  identifierType: "handle" | "channel_id" | "username" | "vanity_slug";
  isValid: boolean;
  error?: string;
}

/**
 * Validates, normalizes, and classifies a public profile or channel URL across YouTube, Instagram, and LinkedIn.
 * Strict URL parsing prevents injection and ensures predictable API parameter resolution.
 */
export function parseAndValidateProfileUrl(input: string, platformHint?: SupportedPlatform): ParsedProfileUrl {
  if (!input || typeof input !== "string") {
    return {
      platform: platformHint || "youtube",
      rawUrl: "",
      normalizedUrl: "",
      identifier: "",
      identifierType: "handle",
      isValid: false,
      error: "Please enter a valid channel or profile URL.",
    };
  }

  const trimmed = input.trim();

  // 1. YouTube Detection & Parsing
  if (
    platformHint === "youtube" ||
    trimmed.includes("youtube.com") ||
    trimmed.includes("youtu.be") ||
    trimmed.startsWith("@") ||
    trimmed.startsWith("UC")
  ) {
    return parseYouTubeUrl(trimmed);
  }

  // 2. Instagram Detection & Parsing
  if (
    platformHint === "instagram" ||
    trimmed.includes("instagram.com") ||
    trimmed.startsWith("ig:") ||
    trimmed.startsWith("instagram:")
  ) {
    return parseInstagramUrl(trimmed);
  }

  // 3. LinkedIn Detection & Parsing
  if (
    platformHint === "linkedin" ||
    trimmed.includes("linkedin.com") ||
    trimmed.startsWith("li:") ||
    trimmed.startsWith("linkedin:")
  ) {
    return parseLinkedInUrl(trimmed);
  }

  return {
    platform: "youtube",
    rawUrl: trimmed,
    normalizedUrl: "",
    identifier: "",
    identifierType: "handle",
    isValid: false,
    error: "Unable to detect a supported social platform (YouTube, Instagram, or LinkedIn).",
  };
}

function parseYouTubeUrl(input: string): ParsedProfileUrl {
  const cleanInput = input.replace(/^(https?:\/\/)?(www\.)?/, "");

  // Direct handle format: "@mkbhd" or "youtube.com/@mkbhd"
  const handleMatch = cleanInput.match(/(?:youtube\.com\/)?@([a-zA-Z0-9_.-]{3,60})(?:\/.*)?$/);
  if (handleMatch) {
    const handle = `@${handleMatch[1]}`;
    return {
      platform: "youtube",
      rawUrl: input,
      normalizedUrl: `https://www.youtube.com/${handle}`,
      identifier: handle,
      identifierType: "handle",
      isValid: true,
    };
  }

  // Canonical Channel ID: "youtube.com/channel/UCxxxxxxxxxxxxxx" or raw "UC..."
  const channelIdMatch = cleanInput.match(/(?:youtube\.com\/channel\/)?(UC[a-zA-Z0-9_-]{22})(?:\/.*)?$/);
  if (channelIdMatch) {
    const channelId = channelIdMatch[1];
    return {
      platform: "youtube",
      rawUrl: input,
      normalizedUrl: `https://www.youtube.com/channel/${channelId}`,
      identifier: channelId,
      identifierType: "channel_id",
      isValid: true,
    };
  }

  // Custom vanity URL: "youtube.com/c/CustomName"
  const customMatch = cleanInput.match(/youtube\.com\/c\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/);
  if (customMatch) {
    const customName = customMatch[1];
    return {
      platform: "youtube",
      rawUrl: input,
      normalizedUrl: `https://www.youtube.com/c/${customName}`,
      identifier: customName,
      identifierType: "vanity_slug",
      isValid: true,
    };
  }

  // Legacy user URL: "youtube.com/user/UserName"
  const userMatch = cleanInput.match(/youtube\.com\/user\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/);
  if (userMatch) {
    const username = userMatch[1];
    return {
      platform: "youtube",
      rawUrl: input,
      normalizedUrl: `https://www.youtube.com/user/${username}`,
      identifier: username,
      identifierType: "username",
      isValid: true,
    };
  }

  // Handle plain alphanumeric string if passed without @
  if (/^[a-zA-Z0-9_.-]{3,30}$/.test(input.trim())) {
    const handle = `@${input.trim()}`;
    return {
      platform: "youtube",
      rawUrl: input,
      normalizedUrl: `https://www.youtube.com/${handle}`,
      identifier: handle,
      identifierType: "handle",
      isValid: true,
    };
  }

  return {
    platform: "youtube",
    rawUrl: input,
    normalizedUrl: "",
    identifier: "",
    identifierType: "handle",
    isValid: false,
    error: "Invalid YouTube URL format. Expected 'https://www.youtube.com/@handle' or 'https://www.youtube.com/channel/UC...'",
  };
}

function parseInstagramUrl(input: string): ParsedProfileUrl {
  const cleanInput = input
    .replace(/^ig:/i, "")
    .replace(/^instagram:/i, "")
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .trim();

  // Match instagram.com/username or @username or raw username
  const igMatch = cleanInput.match(/(?:instagram\.com\/)?@?([a-zA-Z0-9_.-]{1,30})(?:\/.*)?$/);
  if (igMatch && igMatch[1]) {
    const username = igMatch[1].replace(/^\./, "").replace(/\.$/, "");
    // Disallow reserved paths
    const reserved = ["p", "reel", "stories", "explore", "direct", "accounts", "legal", "about"];
    if (reserved.includes(username.toLowerCase())) {
      return {
        platform: "instagram",
        rawUrl: input,
        normalizedUrl: "",
        identifier: "",
        identifierType: "username",
        isValid: false,
        error: `URL points to an Instagram system path ('/${username}'), not a creator profile.`,
      };
    }

    return {
      platform: "instagram",
      rawUrl: input,
      normalizedUrl: `https://www.instagram.com/${username}/`,
      identifier: username,
      identifierType: "username",
      isValid: true,
    };
  }

  return {
    platform: "instagram",
    rawUrl: input,
    normalizedUrl: "",
    identifier: "",
    identifierType: "username",
    isValid: false,
    error: "Invalid Instagram profile URL. Expected 'https://www.instagram.com/username' or '@username'.",
  };
}

function parseLinkedInUrl(input: string): ParsedProfileUrl {
  const cleanInput = input
    .replace(/^li:/i, "")
    .replace(/^linkedin:/i, "")
    .replace(/^(https?:\/\/)?(www\.)?([a-z]{2}\.)?/, "")
    .trim();

  // Personal profile: linkedin.com/in/username
  const personalMatch = cleanInput.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]{3,100})(?:\/.*)?$/);
  if (personalMatch) {
    const slug = personalMatch[1];
    return {
      platform: "linkedin",
      rawUrl: input,
      normalizedUrl: `https://www.linkedin.com/in/${slug}/`,
      identifier: slug,
      identifierType: "username",
      isValid: true,
    };
  }

  // Company profile: linkedin.com/company/vanity
  const companyMatch = cleanInput.match(/linkedin\.com\/company\/([a-zA-Z0-9_-]{2,100})(?:\/.*)?$/);
  if (companyMatch) {
    const slug = companyMatch[1];
    return {
      platform: "linkedin",
      rawUrl: input,
      normalizedUrl: `https://www.linkedin.com/company/${slug}/`,
      identifier: slug,
      identifierType: "vanity_slug",
      isValid: true,
    };
  }

  // Fallback slug if user pasted only their in-slug
  if (/^[a-zA-Z0-9_-]{3,100}$/.test(cleanInput)) {
    return {
      platform: "linkedin",
      rawUrl: input,
      normalizedUrl: `https://www.linkedin.com/in/${cleanInput}/`,
      identifier: cleanInput,
      identifierType: "username",
      isValid: true,
    };
  }

  return {
    platform: "linkedin",
    rawUrl: input,
    normalizedUrl: "",
    identifier: "",
    identifierType: "username",
    isValid: false,
    error: "Invalid LinkedIn URL format. Expected 'https://www.linkedin.com/in/username' or 'https://www.linkedin.com/company/organization'.",
  };
}
