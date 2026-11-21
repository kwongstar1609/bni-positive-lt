"use client";

import { useState, useEffect } from "react";

type Presentation = { id: number; member: string; title: string; date: string; type: string };

const defaultPresentations: Presentation[] = [
  { id: 1, member: "Noelle Lee", title: "Beauty Products Feature", date: "2026-11-12", type: "5-min" },
  { id: 2, member: "Angel Lee", title: "Personal IP & New Media", date: "2026-11-05", type: "5-min" },
  { id: 3, member: "Jeff Hon", title: "Employee Benefits", date: "2026-10-29", type: "5-min" },
];

export default function PresentationsPage() {
  const [items, setItems] = useState<Presentation[]>(defaultPresentations);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ member: "", title: "", date: "", type: "5-min" });

  useEffect(() => {
    const saved = localStorage.getItem("bni-presentations");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-presentations", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!form.title) return;
    setItems([...items, { id: Date.now(), ...form }]);
    setForm({ member: "", title: "", date: "", type: "5-min" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Presentation Archive</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Presentation</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 flex-wrap">
          <input placeholder="Member" value={form.member} onChange={e => setForm({...form, member: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border rounded px-3 py-2 text-sm flex-1" />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="border rounded px-3 py-2 text-sm">
            <option>5-min</option>
            <option>Gains Profile</option>
            <option>20-sec</option>
          </select>
          <button onClick={addItem} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow divide-y">
        {items.map(p => (
          <div key={p.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-600">{p.member} • {p.date}</p>
            </div>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{p.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
