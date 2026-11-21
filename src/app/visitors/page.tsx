"use client";

import { useState, useEffect } from "react";

type Visitor = { id: number; name: string; rating: number; notes: string; invitedBy: string };

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [form, setForm] = useState({ name: "", rating: 3, notes: "", invitedBy: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bni-visitors");
    if (saved) setVisitors(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-visitors", JSON.stringify(visitors));
  }, [visitors]);

  const addVisitor = () => {
    if (!form.name) return;
    setVisitors([...visitors, { id: Date.now(), ...form }]);
    setForm({ name: "", rating: 3, notes: "", invitedBy: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Visitors</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Visitor</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Invited by" value={form.invitedBy} onChange={e => setForm({...form, invitedBy: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <button onClick={addVisitor} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Invited By</th>
              <th className="text-left p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <tr key={v.id} className="border-t">
                <td className="p-3 font-medium">{v.name}</td>
                <td className="p-3">{v.rating}/5</td>
                <td className="p-3">{v.invitedBy}</td>
                <td className="p-3">{v.notes}</td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-gray-500">No visitors recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
