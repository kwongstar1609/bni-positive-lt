import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";

export function ManualPage() {
  const reset = useChapter((s) => s.resetDemo);
  return (
    <div>
      <PageTitle
        title="How the desk fits together"
        lede="One chapter record. Files update it. Scores, coaching, tasks, seating and training all read it back."
      />
      <div className="grid gap-3">
        <Block
          title="Where the numbers come from"
          body="Upload the Positive traffic-light workbook on Reports. The desk finds the P A L M S G R V 1-2-1 T Biz Give columns, ignores the Perfect row, and recalculates every score from the Scoring sheet in that file. If Total PTs disagrees with the counts, the counts win and the row is flagged. The May 2026 export is already loaded, 89 members, and every calculated score matches that file."
        />
        <Block
          title="How a score is made"
          body="Out of 100: absences 15 (0 absences = 15, 1 = 10, 2 = 5, more than 2 = 0), on time 10, referrals per week 20, visitors per week 20, 1-2-1s per week 10, skills modules 10 (0 / 1 / 2 or more), TYFCB 15 at HK$100,000, HK$200,000 and HK$500,000. Green is 70 or above, yellow 50–69, red 30–49, black under 30. Absences and lates cannot be coached away inside the same window."
        />
        <Block
          title="Coaching, goals and tasks"
          body="The desk asks for the next scoring band only — two more 1-2-1s, or the next visitor rate — not a jump to the maximum. Red and black members are listed with that one move. Green members on 70–74 are marked as on the edge. Chapter goals from the team-goals sheet sit next to the live totals. Create tasks writes the gaps that are still open: coaching, policy (3 absences or 3 substitutes), members with no skills module, the next two overdue 5-minutes, unseated visitors, open applications, and goals that are behind. It will not duplicate a task that is still open."
        />
        <Block
          title="Visitors, applications, new members"
          body="A confirmed visitor is seated on a visitor table next to the member who invited them. Marking the visitor as applied opens an interview and a task for the VP. Approving the application creates the member at zero, closes the interview task, and opens a mentor task plus an MSP booking within 30 days."
        />
        <Block
          title="Training sign-ins"
          body="An MSP sign-in sheet is matched to Positive members, including when the surname and given name are reversed. It is stored as a roster and a calendar item. It does not add to the skills-module count, because that count already comes from the 6-month report."
        />
        <Block
          title="What is kept on this browser"
          body="The chapter is stored in this browser. Reset below returns the May 2026 snapshot, the goal targets, and the sample visitors. A shared login is not turned on."
        />
      </div>
      <button className="btn mt-6" onClick={() => reset()}>
        Reset to the May 2026 chapter
      </button>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <section className="card p-4">
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </section>
  );
}
