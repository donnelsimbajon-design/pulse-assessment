import type { PeerDot } from "@/lib/types";

const DEMO_COMPANIONS = [
  { id: "demo-mika", label: "Mika" },
  { id: "demo-jordan", label: "Jordan" },
  { id: "demo-kai", label: "Kai" },
] as const;

const OFFSETS: Array<[number, number]> = [
  [0.12, 0.1],
  [-0.16, 0.12],
  [0.04, -0.2],
];

export function getDemoPeers(location: { lat: number; lng: number }): PeerDot[] {
  return DEMO_COMPANIONS.map((companion, index) => {
    const [latOffset, lngOffset] = OFFSETS[index];
    const lng = ((location.lng + lngOffset + 540) % 360) - 180;

    return {
      id: companion.id,
      label: companion.label,
      lat: Math.max(-85, Math.min(85, location.lat + latOffset)),
      lng,
      busy: false,
      demo: true,
    };
  });
}

export function getDemoReply(message: string): string {
  const normalized = message.toLowerCase();
  if (/\b(hi|hello|hey|kamusta|kumusta)\b/.test(normalized)) {
    return "Hey! I'm a simulated demo companion, here so you can try Pulse while no one else is online.";
  }
  if (/\b(where|saan|location|lugar)\b/.test(normalized)) {
    return "I'm only a demo, so I don't have a real location. The other demo dots are just examples too.";
  }
  return "Thanks for trying Pulse! This reply is simulated; a real stranger can join when they're online.";
}
