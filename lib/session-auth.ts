import { createHash, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function isAuthorizedSession(id: string, token: unknown) {
  if (typeof token !== "string" || token.length < 32 || token.length > 256) {
    return false;
  }

  const presence = await prisma.presence.findUnique({
    where: { id },
    select: { tokenHash: true },
  });
  if (!presence) return false;

  const actual = Buffer.from(hashSessionToken(token), "hex");
  const expected = Buffer.from(presence.tokenHash, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
