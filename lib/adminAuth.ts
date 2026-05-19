// Admin authentication utilities — uses Web Crypto API + otplib for TOTP

const SESSION_COOKIE = "cna_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string comparison to prevent timing attacks
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyTOTP(code: string): Promise<boolean> {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return false;
  try {
    const { verifySync } = await import("otplib");
    return verifySync({ token: code.replace(/\s/g, ""), secret }).valid;
  } catch {
    return false;
  }
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "fallback";
  const ts = Date.now().toString();
  const sig = await hmacSha256(secret, `admin:${ts}`);
  return `${ts}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;

  // Check expiry
  const issued = parseInt(ts, 10);
  if (isNaN(issued) || Date.now() - issued > SESSION_TTL_MS) return false;

  // Verify signature
  const secret = process.env.ADMIN_SESSION_SECRET ?? "fallback";
  const expected = await hmacSha256(secret, `admin:${ts}`);
  return safeEqual(expected, sig);
}

export { SESSION_COOKIE };
