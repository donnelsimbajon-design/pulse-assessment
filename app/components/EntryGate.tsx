"use client";

import { useState } from "react";

export default function EntryGate({
  onReady,
}: {
  onReady: (lat: number, lng: number) => Promise<void>;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");
  const [error, setError] = useState<string>("");

  function enter() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void onReady(pos.coords.latitude, pos.coords.longitude).catch(() => {
          setStatus("error");
          setError("Couldn't join Pulse right now. Please try again.");
        });
      },
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      // High accuracy + maximumAge:0 forces a fresh fix (Wi-Fi/GPS scan)
      // instead of reusing the browser's cached IP-based location.
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#080b0b] px-5 py-12 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(16,185,129,0.16),transparent_42%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/10 shadow-[0_0_120px_rgba(16,185,129,0.08),inset_0_0_100px_rgba(16,185,129,0.04)]" />
      <section className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-zinc-950/75 p-7 shadow-[0_32px_100px_rgba(0,0,0,.6)] backdrop-blur-xl sm:p-12">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-zinc-950 shadow-[0_0_28px_rgba(52,211,153,.28)]">P</span>
          <span className="text-sm font-semibold tracking-[0.22em] text-zinc-300">PULSE <span className="ml-1 text-zinc-600">/ LIVE</span></span>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Somewhere, someone is here</p>
        <h1 className="max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl">Make the world feel a little smaller.</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">A quiet place to meet a stranger. No profiles, no performance. Just a real conversation, wherever you are.</p>

        <button
          onClick={enter}
          disabled={status === "locating"}
          className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-300 px-6 py-4 font-semibold text-zinc-950 transition hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "locating" ? "Finding your place…" : "Step onto the map"}
          {status !== "locating" && <span aria-hidden="true">↗</span>}
        </button>

        {status === "error" && (
          <p role="alert" className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>
        )}

        <div className="mt-7 grid gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-zinc-400 sm:grid-cols-2">
          <p><span className="mb-1 block text-zinc-200">Your location stays yours</span>Your map dot is offset by 1–3 km. Your precise coordinates are not stored.</p>
          <p><span className="mb-1 block text-zinc-200">Here for this moment</span>Messages stay peer-to-peer. Leave whenever you like; your session fades away.</p>
        </div>
      </section>
    </div>
  );
}
