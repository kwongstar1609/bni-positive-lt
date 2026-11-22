import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LightPill, PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { memberScore } from "@/lib/insights";
import type { Light } from "@/lib/scoring";

const LIGHTS: Array<Light | "all"> = ["all", "green", "yellow", "red", "black"];

export function MembersPage() {
  const members = useChapter((s) => s.members);
  const [q, setQ] = useState("");
  const [light, setLight] = useState<(typeof LIGHTS)[number]>("all");
  const rows = useMemo(() => {
    return members
      .map((member) => ({ member, score: memberScore(member) }))
      .filter(({ score }) => (light === "all" ? true : score.light === light))
      .filter(({ member }) => member.name.toLowerCase().includes(q.toLowerCase()) || member.company.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.score.total - a.score.total);
  }, [members, q, light]);

  return (
    <div>
      <PageTitle title="Members" lede="Same activity as the coaching queue and the file import. Open a member to change a count — the score, the queue and the tasks that follow all move with it." />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input className="field" placeholder="Search name or company" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field sm:w-40" value={light} onChange={(e) => setLight(e.target.value as (typeof LIGHTS)[number])}>
          {LIGHTS.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All lights" : item}
            </option>
          ))}
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              {["Member", "Score", "Absences", "Ref / wk", "Vis / wk", "Training", "TYFCB"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ member, score }) => (
              <tr key={member.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link to="/members/$memberId" params={{ memberId: member.id }} className="font-semibold hover:underline">
                    {member.name}
                  </Link>
                  <p className="text-muted">{[member.category, member.company].filter(Boolean).join(" · ") || "No category yet"}</p>
                </td>
                <td className="px-4 py-3">
                  <LightPill light={score.light} score={score.total} />
                </td>
                <td className="px-4 py-3">{member.absent}</td>
                <td className="px-4 py-3">{score.rates.referralsPerWeek.toFixed(2)}</td>
                <td className="px-4 py-3">{score.rates.visitorsPerWeek.toFixed(2)}</td>
                <td className="px-4 py-3">{member.training}</td>
                <td className="px-4 py-3">{score.tyfcb}/15</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
