import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LightPill, PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { memberScore, rosterHits } from "@/lib/insights";
import { activityOf } from "@/lib/import-report";
import { TARGETS, planToTarget, type Activity, type ScoreBreakdown } from "@/lib/scoring";
import { CATEGORIES } from "@/lib/tables";
import { formatDate, todayISO } from "@/lib/utils";

const FIELDS: { key: keyof Activity; label: string }[] = [
  { key: "present", label: "Present (P)" },
  { key: "absent", label: "Absences (A)" },
  { key: "late", label: "Late (L)" },
  { key: "medical", label: "Medical (M)" },
  { key: "substitute", label: "Substitutes (S)" },
  { key: "referrals", label: "Referrals given (G)" },
  { key: "referralsReceived", label: "Referrals received (R)" },
  { key: "visitors", label: "Visitors (V)" },
  { key: "oneToOnes", label: "1-2-1s" },
  { key: "training", label: "Skills modules (T)" },
  { key: "tyfcbAmount", label: "TYFCB given (HKD)" },
];

export function MemberDetailPage({ memberId }: { memberId: string }) {
  const member = useChapter((s) => s.members.find((item) => item.id === memberId));
  const weeks = useChapter((s) => s.settings.meetingsHeld);
  const rosters = useChapter((s) => s.rosters);
  const update = useChapter((s) => s.updateMember);
  const addTask = useChapter((s) => s.addTask);
  const addPresentation = useChapter((s) => s.addPresentation);

  if (!member) {
    return (
      <div>
        <PageTitle title="Member not found" />
        <Link to="/members" className="font-semibold text-primary">
          Back to members
        </Link>
      </div>
    );
  }

  const score = memberScore(member);
  const plans = TARGETS.map((target) => ({ target, actions: planToTarget(activityOf(member), target) }));
  const attended = rosterHits(member, rosters);
  const flags = [
    member.absent >= 3 ? `${member.absent} absences — at the policy limit` : member.absent === 2 ? "One more absence scores 0 for attendance" : "",
    member.late >= 2 ? `${member.late} lates — punctuality points are 0` : "",
    member.substitute >= 3 ? `${member.substitute} substitutes — at the interview limit` : "",
    member.training < 1 ? "No skills module in this window" : "",
  ].filter(Boolean);

  return (
    <div>
      <Link to="/members" className="text-sm font-semibold text-primary">
        All members
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <PageTitle
          title={member.name}
          lede={[member.company, member.category || "No category", member.pitch || "No 20-second line yet."].filter(Boolean).join(" · ")}
        />
        <LightPill light={score.light} score={score.total} />
      </div>

      {flags.length > 0 && (
        <ul className="mb-4 space-y-1">
          {flags.map((flag) => (
            <li key={flag} className="text-sm font-semibold text-red">
              {flag}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="card p-4">
          <h2 className="font-display text-2xl">Counts in this window</h2>
          <p className="mt-1 text-sm text-muted">
            {weeks} meetings. Editing a count updates this score, the coaching queue and any task you create from it.
          </p>
          <label className="mt-4 block text-sm font-semibold">
            Category
            <select className="field mt-1" value={member.category} onChange={(e) => update(member.id, { category: e.target.value })}>
              <option value="">Not set</option>
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <label key={field.key} className="text-sm font-semibold">
                {field.label}
                <input
                  className="field mt-1"
                  type="number"
                  min={0}
                  value={member[field.key]}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isFinite(n)) return;
                    update(member.id, { [field.key]: Math.max(0, Math.round(n)) });
                  }}
                />
              </label>
            ))}
          </div>
        </section>
        <ScoreCard score={score} />
      </div>

      {attended.length > 0 && (
        <section className="card mt-4 p-4">
          <h2 className="font-display text-2xl">Training sign-ins</h2>
          <ul className="mt-2 text-sm">
            {attended.map((roster) => (
              <li key={roster.id}>
                {formatDate(roster.date)} · {roster.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card mt-4 p-4">
        <h2 className="font-display text-2xl">What moves the score</h2>
        <ul className="mt-3 divide-y divide-border">
          {plans.map((plan) => (
            <li key={plan.target} className="py-3">
              <p className="font-semibold">{plan.target} points</p>
              {score.total >= plan.target ? (
                <p className="text-sm text-green">Already there.</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {plan.actions.map((action) => (
                    <li key={action.key}>
                      {action.label}
                      {action.pointsGain ? ` · +${action.pointsGain}` : ""}
                      <span className="block">{action.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <button
          className="btn mt-3"
          onClick={() => {
            const next = plans.find((plan) => score.total < plan.target);
            const step = next?.actions.find((action) => action.pointsGain > 0);
            addTask({
              source: `coach:${member.id}`,
              team: "Green Light",
              title: `Coach ${member.name} toward ${next?.target ?? 70}`,
              detail: step ? `${step.label}. ${step.detail}` : "Hold the current score.",
              assignee: "Green Light Coordinator",
              due: todayISO(),
              status: "pending",
              memberId: member.id,
            });
            toast.success("Coaching task added");
          }}
        >
          Create coaching task
        </button>
      </section>

      <section className="card mt-4 p-4">
        <h2 className="font-display text-2xl">Record a presentation</h2>
        <p className="mt-1 text-sm text-muted">Saving a 5-minute date clears an open scheduling task for this member and puts them on the feature queue only once 10 weeks have passed.</p>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-[1fr_160px_140px_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            addPresentation({
              memberId: member.id,
              date: String(data.get("date") || todayISO()),
              title: String(data.get("title") || "Feature presentation"),
              kind: String(data.get("kind") || "5-min") as "5-min" | "gains" | "20-sec",
            });
            e.currentTarget.reset();
            toast.success("Presentation saved on this member");
          }}
        >
          <input className="field" name="title" placeholder="Title" required />
          <input className="field" type="date" name="date" defaultValue={todayISO()} />
          <select className="field" name="kind" defaultValue="5-min">
            <option value="5-min">5-min</option>
            <option value="gains">Gains</option>
            <option value="20-sec">20-sec</option>
          </select>
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </section>
    </div>
  );
}

function ScoreCard({ score }: { score: ScoreBreakdown }) {
  const rows = [
    ["Absences", score.absent, 15],
    ["On time", score.late, 10],
    ["Referrals", score.referrals, 20],
    ["Visitors", score.visitors, 20],
    ["1-2-1s", score.oneToOnes, 10],
    ["Training", score.training, 10],
    ["TYFCB", score.tyfcb, 15],
  ] as const;
  return (
    <section className="card p-4">
      <h2 className="font-display text-2xl">Score breakdown</h2>
      <p className="mt-1 text-sm text-muted">
        Referrals {score.rates.referralsPerWeek.toFixed(2)}/wk · Visitors {score.rates.visitorsPerWeek.toFixed(2)}/wk · 1-2-1s{" "}
        {score.rates.oneToOnesPerWeek.toFixed(2)}/wk
      </p>
      <ul className="mt-4 space-y-2">
        {rows.map(([label, pts, max]) => (
          <li key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-semibold">
                {pts}/{max}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-2">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${max ? (pts / max) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
