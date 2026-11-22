import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import type { AppStatus } from "@/lib/types";
import { CATEGORIES } from "@/lib/tables";

export function ApplicationsPage() {
  const applications = useChapter((s) => s.applications);
  const add = useChapter((s) => s.addApplication);
  const setStatus = useChapter((s) => s.setApplicationStatus);
  const setVotes = useChapter((s) => s.setVotes);
  const approve = useChapter((s) => s.approveApplication);

  return (
    <div>
      <PageTitle
        title="Applications"
        lede="An applied visitor opens an interview here. Approving creates the member at zero, closes the interview task, and asks Mentor and Education to book MSP within 30 days."
      />
      <form
        className="card mb-4 grid gap-3 p-4 md:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          add({
            name: String(data.get("name") || ""),
            company: String(data.get("company") || ""),
            category: String(data.get("category") || "CS"),
            interviewer: "VP",
            status: "interview",
            votesFor: 0,
            votesAgainst: 0,
            notes: "",
          });
          e.currentTarget.reset();
          toast.success("Application opened");
        }}
      >
        <input className="field" name="name" placeholder="Applicant" required />
        <input className="field" name="company" placeholder="Company" />
        <select className="field" name="category" defaultValue="CS">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn md:col-span-2" type="submit">
          Open application
        </button>
      </form>
      <ul className="space-y-3">
        {applications.map((app) => (
          <li key={app.id} className="card grid gap-3 p-4 md:grid-cols-[1fr_160px_120px_120px]">
            <div>
              <p className="font-semibold">
                {app.name} · {app.category}
              </p>
              <p className="text-sm text-muted">{app.company || "No company"} · {app.interviewer}</p>
              {app.notes ? <p className="mt-1 text-sm">{app.notes}</p> : null}
              <p className="mt-2 text-sm">
                Votes {app.votesFor} for / {app.votesAgainst} against
              </p>
            </div>
            <select className="field" value={app.status} onChange={(e) => setStatus(app.id, e.target.value as AppStatus)}>
              <option value="interview">Interview</option>
              <option value="voting">Voting</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <label className="text-xs font-semibold">
              For
              <input
                className="field mt-1"
                type="number"
                min={0}
                value={app.votesFor}
                onChange={(e) => setVotes(app.id, Number(e.target.value) || 0, app.votesAgainst)}
              />
            </label>
            <label className="text-xs font-semibold">
              Against
              <input
                className="field mt-1"
                type="number"
                min={0}
                value={app.votesAgainst}
                onChange={(e) => setVotes(app.id, app.votesFor, Number(e.target.value) || 0)}
              />
            </label>
            {app.status !== "approved" && (
              <button
                className="btn md:col-span-4"
                onClick={() => {
                  approve(app.id);
                  toast.success(`${app.name} is now a member`);
                }}
              >
                Approve and add as member
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
