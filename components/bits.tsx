import type { Light } from "@/lib/scoring";
import { cn } from "@/lib/utils";

const LIGHT_CLASS: Record<Light, string> = {
  green: "bg-green-bg text-green",
  yellow: "bg-yellow-bg text-yellow",
  red: "bg-red-bg text-red",
  black: "bg-gray-bg text-gray",
};

export function LightPill({ light, score }: { light: Light; score?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase", LIGHT_CLASS[light])}>
      {light}
      {score !== undefined ? <span className="font-semibold">{score}</span> : null}
    </span>
  );
}

export function PageTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-4xl text-fg">{title}</h1>
      {lede ? <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
