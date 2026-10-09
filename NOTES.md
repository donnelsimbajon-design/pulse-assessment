# Pulse assessment notes

## Phase 1 — Make it run

- Fixed the heartbeat query so polling refreshes only the caller. Previously, one active user kept every presence row alive indefinitely.
- Ending a connection now clears both participants' busy state. Signaling also checks that the sender has a live session and rejects malformed or offline sessions.
- Added a separate random session bearer token. The database stores only its SHA-256 hash; map-visible session IDs alone no longer authorize polling, signaling, or leaving.
- Kept stale-row cleanup as a fallback for tabs that close without a successful `sendBeacon`.
- Could not run a two-browser/database session: no PostgreSQL or Mapbox credentials were supplied. The build and lint checks pass locally; database behavior still needs a credentialed smoke test.

## Phase 2 — Make it good

- Reworked the entry screen with a clearer privacy explanation, location permission state, accessible error message, and responsive dark visual treatment.
- Added a map header and a compact connection panel so presence and next steps are easy to understand on desktop and mobile.

## Phase 3 — Make it secure

- Highest risk found: session IDs were public on the map but accepted as identity by every API. Added private bearer tokens and server-side hashes, and stopped `/api/join` from replacing an existing session.
- Fixed global heartbeat refresh and added ID, coordinate, token, signal type, and payload validation.
- Removed the hard-coded Mapbox demo-token fallback. A configured public Mapbox token is required for the map.
- Updated Next.js to 16.4.0 to address the critical `npm audit` finding, and aligned Prisma packages at 7.10.0.
- Remaining: the full dependency audit reports 9 high advisories (none critical). Four are in Prisma CLI/config dependency paths; npm's suggested automatic fix downgrades Prisma to 6.19.3 and conflicts with the Prisma 7 adapter/config setup. I left that downgrade unapplied. Add rate limiting and tighter server-side connection-state checks before a high-traffic public launch.
- File review found no obvious malicious source file, obfuscated payload, or unexpected outbound request. Expected network use is limited to the app APIs, Postgres, Mapbox tiles, and Google STUN for WebRTC. This was a source review, not a malware sandbox scan.

## Phase 4 — Make it better

- Added **Drift to someone**, which selects a random available stranger and starts the same consent-based connection request as clicking a map dot. Busy peers are excluded.
- Next steps: allow a user to opt out of discovery, add request throttling, and test the consent and busy-state transitions with two real sessions.

## Setup and delivery notes

- `npm install`, Prisma client generation (with a temporary local-only placeholder URL), `npm run lint`, and `npm run build` completed. The temporary URL was not saved to disk.
- `npm audit` currently reports 9 high advisories and 0 critical; `npm audit --omit=dev` reports 4 high advisories from Prisma dependency paths.
- No `.env`, database URL, or Mapbox token was available. `prisma db push`, local end-to-end use, and Vercel deployment therefore still need real credentials.
- Vercel project linking was attempted after pushing the public repo, but the connected Vercel team has no GitHub integration installed. The Vercel API rejected project creation; a team admin must enable that integration. A usable deployment also needs the real database URL and Mapbox token.
- Next.js 16.4.0's local Route Handler and environment-variable guides were reviewed before implementation.
