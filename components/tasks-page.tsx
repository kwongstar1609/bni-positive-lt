import { useState } from "react";
import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import type { TaskStatus } from "@/lib/types";
import { todayISO } from "@/lib/utils";

const TEAMS = ["ST", "Visitor Hosts", "MC", "Green Light", "CGC", "Webmaster"];

export function TasksPage() {
  const tasks = useChapter((s) => s.tasks);
  const addTask = useChapter((s) => s.addTask);
  const setStatus = useChapter((s) => s.setTaskStatus);
  const [team, setTeam] = useState("all");
  const visible = tasks.filter((t) => (team === "all" ? true : t.team === team));

  return (
    <div>
      <PageTitle title="Tasks" lede="Tasks created from the dashboard already point at a member, a visitor seating gap, or an open application." />
      <form
        className="card mb-4 grid gap-3 p-4 md:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const title = String(data.get("title") || "").trim();
          if (!title) return;
          addTask({
            source: "",
            team: String(data.get("team") || "ST"),
            title,
            detail: String(data.get("detail") || ""),
            assignee: String(data.get("assignee") || ""),
            due: String(data.get("due") || todayISO()),
            status: "pending",
          });
          e.currentTarget.reset();
          toast.success("Task added");
        }}
      >
        <input className="field md:col-span-2" name="title" placeholder="What needs doing" required />
        <select className="field" name="team" defaultValue="ST">
          {TEAMS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input className="field" name="assignee" placeholder="Who" />
        <input className="field" type="date" name="due" defaultValue={todayISO()} />
        <button className="btn" type="submit">
          Add task
        </button>
        <input className="field md:col-span-6" name="detail" placeholder="Why it matters" />
      </form>
      <div className="mb-3 flex flex-wrap gap-2">
        {["all", ...TEAMS].map((t) => (
          <button key={t} className={team === t ? "btn" : "btn-ghost"} onClick={() => setTeam(t)}>
            {t}
          </button>
        ))}
      </div>
      <ul className="card divide-y divide-border">
        {visible.map((task) => (
          <li key={task.id} className="grid gap-2 p-4 md:grid-cols-[1fr_160px_140px]">
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-muted">
                {task.team} · {task.assignee || "Unassigned"} · due {task.due}
              </p>
              {task.detail ? <p className="mt-1 text-sm">{task.detail}</p> : null}
            </div>
            <select
              className="field"
              value={task.status}
              onChange={(e) => setStatus(task.id, e.target.value as TaskStatus)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <p className="self-center text-sm text-muted">{task.source ? "Linked" : "Manual"}</p>
          </li>
        ))}
        {visible.length === 0 && <li className="p-6 text-sm text-muted">No tasks in this team.</li>}
      </ul>
    </div>
  );
}
