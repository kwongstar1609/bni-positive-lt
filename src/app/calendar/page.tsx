"use client";

import { useState } from "react";

type Event = {
  id: number;
  date: string;
  title: string;
  type: string;
  color: string;
};

const initialEvents: Event[] = [
  { id: 1, date: "2026-12-01", title: "MSP Member Success Program", type: "training", color: "bg-blue-500" },
  { id: 2, date: "2026-12-04", title: "MC Follow Up Workshop", type: "training", color: "bg-blue-500" },
  { id: 3, date: "2026-12-03", title: "Weekly Chapter Meeting", type: "meeting", color: "bg-red-600" },
  { id: 4, date: "2026-12-05", title: "ST Rehearsal", type: "rehearsal", color: "bg-purple-500" },
  { id: 5, date: "2026-12-06", title: "Team Dinner – CS Group", type: "social", color: "bg-green-500" },
  { id: 6, date: "2026-12-15", title: "Member Birthday", type: "birthday", color: "bg-pink-500" },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", title: "", type: "meeting" });

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  const addEvent = () => {
    if (!form.title || !form.date) return;
    const colors: Record<string, string> = {
      training: "bg-blue-500", meeting: "bg-red-600", rehearsal: "bg-purple-500",
      social: "bg-green-500", birthday: "bg-pink-500"
    };
    setEvents([...events, { id: Date.now(), ...form, color: colors[form.type] || "bg-gray-500" }]);
    setForm({ date: "", title: "", type: "meeting" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Central Calendar</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
          + Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 flex-wrap">
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Event title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border rounded px-3 py-2 text-sm flex-1" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="border rounded px-3 py-2 text-sm">
            <option value="training">Training</option>
            <option value="meeting">Meeting</option>
            <option value="rehearsal">Rehearsal</option>
            <option value="social">Social</option>
            <option value="birthday">Birthday</option>
          </select>
          <button onClick={addEvent} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "training", "meeting", "rehearsal", "social", "birthday"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm capitalize ${filter === f ? "bg-red-700 text-white" : "bg-white border"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow divide-y">
        {filtered.map(event => (
          <div key={event.id} className="p-4 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${event.color}`} />
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{event.date} • {event.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
