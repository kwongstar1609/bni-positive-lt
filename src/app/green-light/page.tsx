"use client";

import { useState, useEffect } from "react";

type FollowUp = { id: number; member: string; status: string; notes: string; date: string };

export default function GreenLightPage() {
  const [items, setItems] = useState<FollowUp[]>([]);
  const [form, setForm] = useState({ member: "", status: "Yellow", notes: "", date: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bni-greenlight");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-greenlight", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!form.member) return;
    setItems([...items, { id: Date.now(), ...form }]);
    setForm({ member: "", status: "Yellow", notes: "", date: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Green Light Follow-up</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Follow-up</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Member name" value={form.member} onChange={e => setForm({...form, member: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border rounded px-3 py-2 text-sm">
            <option>Yellow</option><option>Red</option><option>Black</option><option>Edge Green</option>
          </select>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Notes / action" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <button onClick={addItem} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Member</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-3 font-medium">{i.member}</td>
                <td className="p-3">{i.status}</td>
                <td className="p-3">{i.date}</td>
                <td className="p-3">{i.notes}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No follow-ups recorded</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
