import { useState } from "react";
import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { activityOf, findMember, interpretFile, type Interpreted } from "@/lib/import-report";
import { scoreActivity } from "@/lib/scoring";

const SAMPLES = [
  { href: "/samples/traffic-lights.xlsx", name: "Member-Traffic-Light-Positive-2026-05.xlsx", label: "May 2026 traffic lights" },
  { href: "/samples/chapter-goals.xlsx", name: "Chapter-Team-Goals.xlsx", label: "Chapter goals" },
  { href: "/samples/msp.xlsx", name: "MSP-2026-11-11.xlsx", label: "11 Nov MSP sign-in" },
];

export function ReportsPage() {
  const members = useChapter((s) => s.members);
  const applyFile = useChapter((s) => s.applyFile);
  const [report, setReport] = useState<Interpreted | null>(null);
  const [createNew, setCreateNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async (file: File) => {
    setBusy(true);
    try {
      setReport(await interpretFile(file));
    } catch {
      toast.error("Could not read that file");
    } finally {
      setBusy(false);
    }
  };

  const loadSample = async (sample: (typeof SAMPLES)[number]) => {
    const res = await fetch(sample.href);
    if (!res.ok) {
      toast.error("Sample file is missing");
      return;
    }
    const blob = await res.blob();
    await load(new File([blob], sample.name));
  };

  return (
    <div>
      <PageTitle
        title="Read a file"
        lede="Drop in the chapter traffic-light workbook, the team-goals sheet, or an MSP sign-in. The desk recognises the layout, recalculates scores from the raw counts, and writes the result into members, goals or the training roster."
      />
      <section className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn">
            {busy ? "Reading…" : "Upload Excel or CSV"}
            <input
              className="sr-only"
              type="file"
              accept=".csv,.xlsx,.xls,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void load(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
          {SAMPLES.map((sample) => (
            <button key={sample.href} className="btn-ghost" onClick={() => void loadSample(sample)}>
              {sample.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Traffic lights: the P / A / L / M / S / G / R / V / 1-2-1 / T / Biz Give grid, including the Chinese chapter export. Goals: Current / 6 months / 12 months. MSP: the sign-in sheet with 分會. A printed total is checked against the Scoring sheet and not copied in if it disagrees.
        </p>
      </section>

      {report && (
        <section className="card mt-4 p-4">
          <h2 className="font-display text-2xl">{report.fileName}</h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">{report.kind}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {report.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          {report.kind === "traffic-lights" && (
            <>
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={createNew} onChange={(e) => setCreateNew(e.target.checked)} />
                Add unmatched names as new members
              </label>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-muted">
                    <tr>
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Match</th>
                      <th className="py-2 pr-3">Now</th>
                      <th className="py-2 pr-3">From counts</th>
                      <th className="py-2">File total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.slice(0, 40).map((row) => {
                      const member = findMember(members, row.name);
                      const now = member ? scoreActivity(activityOf(member)).total : null;
                      const clash = row.reportedScore !== null && row.reportedScore !== row.calculatedScore;
                      return (
                        <tr key={row.name} className="border-t border-border">
                          <td className="py-2 pr-3 font-semibold">{row.name}</td>
                          <td className="py-2 pr-3">{member ? "In the chapter" : "New"}</td>
                          <td className="py-2 pr-3">{now ?? "—"}</td>
                          <td className="py-2 pr-3">{row.calculatedScore}</td>
                          <td className={`py-2 ${clash ? "font-semibold text-red" : ""}`}>{row.reportedScore ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {report.rows.length > 40 && <p className="mt-2 text-sm text-muted">Showing 40 of {report.rows.length}.</p>}
            </>
          )}

          {report.kind === "goals" && (
            <ul className="mt-3 divide-y divide-border text-sm">
              {report.goals.map((goal) => (
                <li key={goal.key} className="flex justify-between gap-3 py-2">
                  <span className="font-semibold">{goal.label}</span>
                  <span className="text-muted">
                    6 months {goal.target6 ?? "—"} · 12 months {goal.target12 ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {report.kind === "msp" && (
            <p className="mt-3 text-sm">
              {report.date || "No date"} · {report.title}. Positive sign-ins: {report.positive.map((person) => person.name).join(", ") || "none"}.
            </p>
          )}

          <button
            className="btn mt-4"
            disabled={report.kind === "unknown"}
            onClick={() => {
              const result = applyFile(report, createNew);
              toast.success(result.notes[0] || "Applied");
            }}
          >
            Apply to the chapter
          </button>
        </section>
      )}
    </div>
  );
}
