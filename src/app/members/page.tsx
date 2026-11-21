"use client";

import { useState, useEffect } from "react";

type Member = { id: number; name: string; category: string; score: number; status: string };

const defaultMembers: Member[] = [
  { id: 1, name: "Hettina Cheng", category: "MS", score: 95, status: "Green" },
  { id: 2, name: "Eva Yu", category: "MS", score: 90, status: "Green" },
  { id: 3, name: "Benny Chan", category: "CS", score: 90, status: "Green" },
  { id: 4, name: "Andrew Kwong", category: "IT", score: 70, status: "Green" },
  { id: 5, name: "Sam Sze", category: "IT", score: 40, status: "Yellow" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", score: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("bni-members");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-members", JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (!form.name) return;
    const status = form.score >= 70 ? "Green" : form.score >= 50 ? "Yellow" : "Red";
    setMembers([...members, { id: Date.now(), ...form, status }]);
    setForm({ name: "", category: "", score: 0 });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Member</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 flex-wrap">
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border rounded px-3 py-2 text-sm w-24" />
          <input type="number" placeholder="Score" value={form.score || ""} onChange={e => setForm({...form, score: Number(e.target.value)})} className="border rounded px-3 py-2 text-sm w-20" />
          <button onClick={addMember} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-left p-3">Score</th><th className="text-left p-3">Status</th></tr></thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-3 font-medium">{m.name}</td>
                <td className="p-3">{m.category}</td>
                <td className="p-3">{m.score}</td>
                <td className="p-3"><span className={`px-3 py-1 rounded-full text-xs ${m.status === "Green" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
