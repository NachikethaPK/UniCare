import api from "../services/api";

// Known disposable / burner email domains for instant zero-latency client feedback
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.biz",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "pokemail.net",
  "spam4.me",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "trashmail.me",
  "getnada.com",
  "dispostable.com",
  "crazymailing.com",
  "fakemailgenerator.com",
  "mohmal.com",
  "maildrop.cc",
  "inboxkitten.com",
  "generator.email",
  "mytemp.email",
  "emailondeck.com",
  "burnermail.io",
  "tempail.com",
  "dropmail.me",
  "disposablemail.com",
  "nada.ltd",
  "nada.email",
  "getairmail.com",
  "zillamail.com",
  "trashcanmail.com",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "einrot.com",
  "meltmail.com",
  "harakirimail.com",
  "mailcatch.com"
]);

const DEMO_DOMAINS = new Set(["hospital.unicare", "unicare.app", "unicare.internal", "localhost"]);

/**
 * Fast synchronous check on syntax and disposable blacklist.
 */
export function quickValidateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email is required." };
  }

  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(clean)) {
    return { valid: false, reason: "Please enter a valid email format (e.g., name@example.com)." };
  }

  const parts = clean.split("@");
  if (parts.length !== 2) {
    return { valid: false, reason: "Invalid email format." };
  }

  const [localPart, domain] = parts;
  if (localPart.length > 64) {
    return { valid: false, reason: "Email username is too long (max 64 characters)." };
  }

  if (DEMO_DOMAINS.has(domain) || domain.endsWith(".unicare")) {
    return { valid: true, isDemo: true };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable or burner email addresses are not permitted. Please use a permanent email.",
    };
  }

  return { valid: true, domain };
}

/**
 * Complete legitimacy verification: checks syntax, disposable lists,
 * and calls the server to verify active DNS MX mail servers.
 */
export async function verifyEmailLegitimacy(email) {
  // 1. Quick client-side check first
  const quick = quickValidateEmail(email);
  if (!quick.valid) {
    return quick;
  }

  if (quick.isDemo) {
    return { valid: true, isDemo: true };
  }

  // 2. Call backend DNS MX resolution
  try {
    const res = await api.post("/auth/validate-email", { email: email.trim().toLowerCase() });
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    // If backend returns a 400 validation error with reason
    if (err.response?.data?.message) {
      return { valid: false, reason: err.response.data.message };
    }
    // If backend is offline or unreachable, rely on quick client validation
  }

  return { valid: true, domain: quick.domain };
}
