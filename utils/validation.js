// Enhanced URL validation with comprehensive checks
export const validateUrl = (url) => {
  // Basic checks
  if (!url || typeof url !== "string") {
    return { isValid: false, error: "URL is required" }
  }

  // Remove whitespace
  url = url.trim()

  if (url.length === 0) {
    return { isValid: false, error: "URL cannot be empty" }
  }

  // Check URL length (reasonable limits)
  if (url.length > 2048) {
    return { isValid: false, error: "URL is too long (maximum 2048 characters)" }
  }

  if (url.length < 4) {
    return { isValid: false, error: "URL is too short" }
  }

  // Add protocol if missing
  if (!url.match(/^https?:\/\//i)) {
    url = "https://" + url
  }

  try {
    const urlObj = new URL(url)

    // Check protocol
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { isValid: false, error: "Only HTTP and HTTPS protocols are allowed" }
    }

    // Check for valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { isValid: false, error: "Invalid hostname" }
    }

    // Check for localhost/private IPs in production
    if (isPrivateOrLocalhost(urlObj.hostname)) {
      return { isValid: false, error: "Private/localhost URLs are not allowed" }
    }

    // Check for suspicious patterns
    if (hasSuspiciousPatterns(url)) {
      return { isValid: false, error: "URL contains suspicious patterns" }
    }

    // Check for malicious domains (basic check)
    if (isMaliciousDomain(urlObj.hostname)) {
      return { isValid: false, error: "This domain is flagged as potentially malicious" }
    }

    // Check for valid TLD
    if (!hasValidTLD(urlObj.hostname)) {
      return { isValid: false, error: "Invalid top-level domain" }
    }

    // Check for excessive subdomains
    if (hasExcessiveSubdomains(urlObj.hostname)) {
      return { isValid: false, error: "Too many subdomains detected" }
    }

    return { isValid: true, normalizedUrl: url, error: null }
  } catch (error) {
    return { isValid: false, error: "Invalid URL format" }
  }
}

// Check if hostname is private/localhost
const isPrivateOrLocalhost = (hostname) => {
  const privatePatterns = [
    /^localhost$/i,
    /^127\./,
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^::1$/,
    /^fe80:/i,
    /\.local$/i,
  ]

  return privatePatterns.some((pattern) => pattern.test(hostname))
}

// Check for suspicious URL patterns
const hasSuspiciousPatterns = (url) => {
  const suspiciousPatterns = [
    // Multiple redirects
    /redirect.*redirect/i,
    // Suspicious query parameters
    /[?&](exec|eval|script|javascript|vbscript)/i,
    // Excessive dots or dashes
    /\.{4,}|--{4,}/,
    // Suspicious file extensions in URL
    /\.(exe|bat|cmd|scr|pif|com|jar)(\?|$)/i,
    // Base64 encoded suspicious content
    /data:.*base64.*script/i,
    // Excessive URL encoding
    /%[0-9a-f]{2}.*%[0-9a-f]{2}.*%[0-9a-f]{2}.*%[0-9a-f]{2}/i,
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(url))
}

// Basic malicious domain check (you would expand this with a real blocklist)
const isMaliciousDomain = (hostname) => {
  const maliciousDomains = [
    "malware.com",
    "phishing.net",
    "spam.org",
    "virus.info",
    // Add more known malicious domains
  ]

  const suspiciousTLDs = [
    ".tk",
    ".ml",
    ".ga",
    ".cf", // Free TLDs often used for malicious purposes
  ]

  return (
    maliciousDomains.includes(hostname.toLowerCase()) ||
    suspiciousTLDs.some((tld) => hostname.toLowerCase().endsWith(tld))
  )
}

// Check for valid TLD
const hasValidTLD = (hostname) => {
  const validTLDs = [
    ".com",
    ".org",
    ".net",
    ".edu",
    ".gov",
    ".mil",
    ".int",
    ".co",
    ".io",
    ".ai",
    ".app",
    ".dev",
    ".tech",
    ".info",
    ".biz",
    ".name",
    ".pro",
    ".museum",
    ".aero",
    ".coop",
    ".travel",
    ".jobs",
    ".mobi",
    ".tel",
    ".asia",
    ".cat",
    ".xxx",
    ".post",
    ".geo",
    ".local",
    ".localhost",
    // Country codes
    ".us",
    ".uk",
    ".ca",
    ".au",
    ".de",
    ".fr",
    ".jp",
    ".cn",
    ".in",
    ".br",
    ".mx",
    ".es",
    ".it",
    ".nl",
    ".se",
    ".no",
    ".dk",
    ".fi",
    ".pl",
    ".ru",
    ".za",
    ".kr",
    ".sg",
    ".hk",
  ]

  return validTLDs.some((tld) => hostname.toLowerCase().endsWith(tld)) || /\.[a-z]{2,}$/i.test(hostname) // Allow other valid TLDs
}

// Check for excessive subdomains (potential DGA)
const hasExcessiveSubdomains = (hostname) => {
  const parts = hostname.split(".")
  return parts.length > 5 // More than 5 parts might be suspicious
}

// Enhanced shortcode validation
export const isValidShortcode = (shortcode) => {
  if (!shortcode || typeof shortcode !== "string") {
    return { isValid: false, error: "Shortcode is required" }
  }

  shortcode = shortcode.trim()

  if (shortcode.length < 3) {
    return { isValid: false, error: "Shortcode must be at least 3 characters long" }
  }

  if (shortcode.length > 20) {
    return { isValid: false, error: "Shortcode must be 20 characters or less" }
  }

  // Only alphanumeric characters and hyphens/underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(shortcode)) {
    return { isValid: false, error: "Shortcode can only contain letters, numbers, hyphens, and underscores" }
  }

  // Cannot start or end with hyphen/underscore
  if (/^[-_]|[-_]$/.test(shortcode)) {
    return { isValid: false, error: "Shortcode cannot start or end with hyphen or underscore" }
  }

  // Check for reserved words
  const reservedWords = [
    "admin",
    "api",
    "www",
    "mail",
    "ftp",
    "localhost",
    "root",
    "test",
    "demo",
    "sample",
    "example",
    "null",
    "undefined",
    "statistics",
    "stats",
    "analytics",
    "dashboard",
    "login",
    "register",
    "signup",
    "signin",
    "logout",
    "profile",
    "settings",
    "help",
    "support",
    "contact",
    "about",
    "terms",
    "privacy",
    "legal",
    "copyright",
    "trademark",
    "patent",
    "license",
  ]

  if (reservedWords.includes(shortcode.toLowerCase())) {
    return { isValid: false, error: "This shortcode is reserved and cannot be used" }
  }

  // Check for profanity (basic list)
  const profanityWords = [
    "damn",
    "hell",
    "crap",
    "shit",
    "fuck",
    "bitch",
    "ass",
    // Add more as needed
  ]

  if (profanityWords.some((word) => shortcode.toLowerCase().includes(word))) {
    return { isValid: false, error: "Shortcode contains inappropriate content" }
  }

  // Check for confusing characters
  if (/[0O1lI]/.test(shortcode)) {
    return { isValid: false, error: "Shortcode contains confusing characters (0, O, 1, l, I)" }
  }

  return { isValid: true, error: null }
}

// Enhanced validity period validation
export const validateValidityPeriod = (minutes) => {
  if (minutes === null || minutes === undefined || minutes === "") {
    return { isValid: true, normalizedMinutes: 30, error: null } // Default to 30 minutes
  }

  const numMinutes = Number(minutes)

  if (isNaN(numMinutes)) {
    return { isValid: false, error: "Validity period must be a number" }
  }

  if (!Number.isInteger(numMinutes)) {
    return { isValid: false, error: "Validity period must be a whole number" }
  }

  if (numMinutes < 1) {
    return { isValid: false, error: "Validity period must be at least 1 minute" }
  }

  if (numMinutes > 525600) {
    // 1 year in minutes
    return { isValid: false, error: "Validity period cannot exceed 1 year (525,600 minutes)" }
  }

  // Warn about very short periods
  if (numMinutes < 5) {
    return {
      isValid: true,
      normalizedMinutes: numMinutes,
      warning: "Very short validity period - URL will expire quickly",
    }
  }

  // Warn about very long periods
  if (numMinutes > 43200) {
    // 30 days
    return {
      isValid: true,
      normalizedMinutes: numMinutes,
      warning: "Very long validity period - consider shorter duration for security",
    }
  }

  return { isValid: true, normalizedMinutes: numMinutes, error: null }
}

// Generate secure shortcode with better randomness
export const generateShortcode = () => {
  // Use crypto.getRandomValues for better randomness if available
  const getRandomInt = (max) => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1)
      crypto.getRandomValues(array)
      return array[0] % max
    }
    return Math.floor(Math.random() * max)
  }

  // Exclude confusing characters
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""

  // Generate 6-8 character shortcode
  const length = 6 + getRandomInt(3)

  for (let i = 0; i < length; i++) {
    result += chars.charAt(getRandomInt(chars.length))
  }

  return result
}

// Validate complete URL entry
export const validateUrlEntry = (entry, existingShortcodes = []) => {
  const errors = {}
  const warnings = {}

  // Validate URL
  const urlValidation = validateUrl(entry.longUrl)
  if (!urlValidation.isValid) {
    errors.longUrl = urlValidation.error
  }

  // Validate shortcode if provided
  if (entry.shortcode && entry.shortcode.trim()) {
    const shortcodeValidation = isValidShortcode(entry.shortcode)
    if (!shortcodeValidation.isValid) {
      errors.shortcode = shortcodeValidation.error
    } else if (existingShortcodes.includes(entry.shortcode.trim())) {
      errors.shortcode = "This shortcode is already in use"
    }
  }

  // Validate validity period
  const validityValidation = validateValidityPeriod(entry.validityMinutes)
  if (!validityValidation.isValid) {
    errors.validityMinutes = validityValidation.error
  } else if (validityValidation.warning) {
    warnings.validityMinutes = validityValidation.warning
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    normalizedUrl: urlValidation.normalizedUrl,
    normalizedMinutes: validityValidation.normalizedMinutes,
  }
}
