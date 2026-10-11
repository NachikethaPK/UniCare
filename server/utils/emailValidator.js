import dns from "dns";

// Configure reliable DNS resolvers to ensure consistency across environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Fallback to system DNS if setServers is restricted
}

// Popular and common disposable / temporary email domains
export const DISPOSABLE_DOMAINS = new Set([
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

// Special internal/demo domains permitted for local development and demos
const DEMO_DOMAINS = new Set(["hospital.unicare", "unicare.app", "unicare.internal", "localhost"]);

/**
 * Validates whether an email address is syntactically sound, not disposable,
 * and belongs to a domain with active Mail Exchange (MX) servers.
 *
 * @param {string} email - The email to check
 * @returns {Promise<{ valid: boolean, reason?: string, details?: object }>}
 */
export async function validateEmailLegitimacy(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email address is required." };
  }

  const clean = email.trim().toLowerCase();

  // 1. RFC 5322 standard syntax regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return {
      valid: false,
      reason: "Invalid email format. Please provide a standard address like name@domain.com.",
      details: { step: "syntax" }
    };
  }

  const [localPart, domain] = clean.split("@");

  if (!localPart || localPart.length > 64) {
    return {
      valid: false,
      reason: "Email username portion cannot exceed 64 characters.",
      details: { step: "syntax" }
    };
  }

  if (!domain || domain.length > 255) {
    return {
      valid: false,
      reason: "Email domain portion is invalid.",
      details: { step: "syntax" }
    };
  }

  // 2. Demo & local development exemption
  if (DEMO_DOMAINS.has(domain) || domain.endsWith(".unicare")) {
    return {
      valid: true,
      domain,
      isDemo: true,
      details: { step: "demo_pass" }
    };
  }

  // 3. Disposable / burner domain check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable and temporary email providers are not permitted. Please use a valid personal or hospital email.",
      details: { step: "disposable", domain }
    };
  }

  // 4. DNS MX Record lookup (checks if domain actually exists and accepts email)
  const dnsPromise = dns.promises.resolveMx(domain);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("DNS_TIMEOUT")), 4000)
  );

  try {
    const mxRecords = await Promise.race([dnsPromise, timeoutPromise]);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        reason: `Domain "${domain}" does not have active mail servers and cannot receive email.`,
        details: { step: "dns_mx_empty", domain }
      };
    }

    // RFC 7505: "Null MX" record (exchange: "" or ".") means the domain explicitly refuses mail
    const hasActiveMailExchange = mxRecords.some(
      (mx) => mx.exchange && mx.exchange !== "." && mx.exchange !== ""
    );

    if (!hasActiveMailExchange) {
      return {
        valid: false,
        reason: `Domain "${domain}" does not accept incoming emails (Null MX).`,
        details: { step: "dns_null_mx", domain }
      };
    }

    return {
      valid: true,
      domain,
      mxCount: mxRecords.length,
      details: { step: "verified", primaryExchange: mxRecords[0].exchange }
    };
  } catch (err) {
    if (err.message === "DNS_TIMEOUT") {
      // If DNS times out, fall back to A-record lookup
      try {
        const aRecords = await dns.promises.resolve4(domain);
        if (aRecords && aRecords.length > 0) {
          return { valid: true, domain, details: { step: "fallback_a" } };
        }
      } catch {
        // Fallback failed
      }
      return {
        valid: false,
        reason: `Could not verify mail server for "${domain}". DNS resolution timed out.`,
        details: { step: "dns_timeout", domain }
      };
    }

    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      return {
        valid: false,
        reason: `The email domain "${domain}" does not exist or has no mail exchange (MX) records.`,
        details: { step: "dns_not_found", domain, code: err.code }
      };
    }

    return {
      valid: false,
      reason: `Could not reach mail servers for "${domain}". Please verify that this domain is correct.`,
      details: { step: "dns_error", domain, code: err.code }
    };
  }
}
