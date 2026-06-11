import crypto from "node:crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "noreva_admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "noreva2026";
}

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.POSTGRES_PASSWORD ||
    "noreva-admin-dev-secret"
  );
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return "";

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
}

export function isValidAdminPassword(password: string) {
  return safeEqual(password || "", adminPassword());
}

export function createAdminToken() {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminRequest(request: Request) {
  const token = readCookie(request.headers.get("cookie"), COOKIE_NAME);
  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;

  return safeEqual(signature, sign(expiresAt));
}

export function setAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: createAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}
