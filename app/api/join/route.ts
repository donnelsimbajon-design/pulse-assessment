import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyPrivacyOffset, isValidLatLng } from "@/lib/geo";
import { hashSessionToken } from "@/lib/session-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/join — body { id, token, lat, lng } (raw coords).
// Applies a 1–3 km privacy offset. Raw coordinates and token are never stored.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const { id, token, lat, lng } = (body ?? {}) as Record<string, unknown>;

  if (typeof id !== "string" || id.length < 8 || id.length > 64) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }
  if (!isValidLatLng(lat, lng)) {
    return Response.json({ error: "invalid coordinates" }, { status: 400 });
  }
  if (typeof token !== "string" || token.length < 32 || token.length > 256) {
    return Response.json({ error: "invalid session token" }, { status: 400 });
  }

  const offset = applyPrivacyOffset(lat as number, lng as number);

  try {
    await prisma.presence.create({
      data: {
        id,
        tokenHash: hashSessionToken(token),
        lat: offset.lat,
        lng: offset.lng,
        busy: false,
        lastSeen: new Date(),
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json({ error: "session already exists" }, { status: 409 });
    }
    throw error;
  }

  return Response.json({ ok: true });
}
