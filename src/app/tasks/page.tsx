"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  team: string;
  task: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Done";
  due: string;
};

const defaultTasks: Task[] = [
  { id: 1, team: "ST", task: "Organise 5-min presentation rehearsal", assignee: "ST Sub-com", status: "In Progress", due: "2026-12-05" },
  { id: 2, team: "VH", task: "Prepare seating plan", assignee: "Visitor Hosts", status: "Pending", due: "2026-12-03" },
  { id: 3, team: "MC", task: "Review new applications", assignee: "VP + MCC", status: "Pending", due: "2026-12-02" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ team: "", task: "", assignee: "", due: "" });

  useEffect(() => {
    const saved = localStorage.getItem("bni-tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const updateStatus = (id: number, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const addTask = () => {
    if (!newTask.task) return;
    setTasks([...tasks, { id: Date.now(), ...newTask, status: "Pending" }]);
    setNewTask({ team: "", task: "", assignee: "", due: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Task</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Team" value={newTask.team} onChange={e => setNewTask({...newTask, team: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Task" value={newTask.task} onChange={e => setNewTask({...newTask, task: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Assignee" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input type="date" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <button onClick={addTask} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3">Team</th><th className="text-left p-3">Task</th><th className="text-left p-3">Assignee</th><th className="text-left p-3">Status</th><th className="text-left p-3">Due</th></tr></thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-3 font-medium">{t.team}</td>
                <td className="p-3">{t.task}</td>
                <td className="p-3">{t.assignee}</td>
                <td className="p-3">
                  <select value={t.status} onChange={e => updateStatus(t.id, e.target.value as any)} className={`px-2 py-1 rounded text-xs ${t.status === "Done" ? "bg-green-100" : t.status === "In Progress" ? "bg-blue-100" : "bg-yellow-100"}`}>
                    <option>Pending</option><option>In Progress</option><option>Done</option>
                  </select>
                </td>
                <td className="p-3">{t.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
