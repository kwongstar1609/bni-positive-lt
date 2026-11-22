import { Link } from "@tanstack/react-router";
import { LightPill, PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { memberScore } from "@/lib/insights";
import type { Light } from "@/lib/scoring";

export function LightsPage() {
  const members = useChapter((s) => s.members);
  const settings = useChapter((s) => s.settings);
  const updateSettings = useChapter((s) => s.updateSettings);
  const rows = members
    .filter((member) => member.active)
    .map((member) => ({ member, score: memberScore(member) }))
    .sort((a, b) => b.score.total - a.score.total);
  const counts: Record<Light, number> = { green: 0, yellow: 0, red: 0, black: 0 };
  rows.forEach((row) => {
    counts[row.score.light] += 1;
  });

  return (
    <div>
      <PageTitle
        title="Traffic lights"
        lede="Rules from the chapter Scoring sheet. Absences 15, on time 10, referrals/week 20, visitors/week 20, 1-2-1s/week 10, skills modules 10, TYFCB 15. Green 70+, yellow 50–69, red 30–49, black under 30."
      />
      <label className="mb-4 block max-w-sm text-sm font-semibold">
        Meetings in this window
        <input
          className="field mt-1"
          type="number"
          min={1}
          value={settings.meetingsHeld}
          onChange={(e) => updateSettings({ meetingsHeld: Math.max(1, Number(e.target.value) || 1) })}
        />
      </label>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(counts) as Light[]).map((light) => (
          <div key={light} className="card p-3">
            <LightPill light={light} />
            <p className="mt-2 font-display text-3xl">{counts[light]}</p>
          </div>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              {["Member", "Total", "A", "L", "G", "V", "1-2-1", "T", "Biz"].map((heading) => (
                <th key={heading} className="px-3 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ member, score }) => (
              <tr key={member.id} className="border-t border-border">
                <td className="px-3 py-3">
                  <Link to="/members/$memberId" params={{ memberId: member.id }} className="font-semibold hover:underline">
                    {member.name}
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <LightPill light={score.light} score={score.total} />
                </td>
                <td className="px-3 py-3">{score.absent}</td>
                <td className="px-3 py-3">{score.late}</td>
                <td className="px-3 py-3">{score.referrals}</td>
                <td className="px-3 py-3">{score.visitors}</td>
                <td className="px-3 py-3">{score.oneToOnes}</td>
                <td className="px-3 py-3">{score.training}</td>
                <td className="px-3 py-3">{score.tyfcb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
