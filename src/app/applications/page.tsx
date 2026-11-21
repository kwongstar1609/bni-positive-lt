"use client";

import { useState, useEffect } from "react";

type Application = { id: number; name: string; status: string; interviewer: string; notes: string };

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [form, setForm] = useState({ name: "", status: "Interview Scheduled", interviewer: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bni-applications");
    if (saved) setApps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-applications", JSON.stringify(apps));
  }, [apps]);

  const addApp = () => {
    if (!form.name) return;
    setApps([...apps, { id: Date.now(), ...form }]);
    setForm({ name: "", status: "Interview Scheduled", interviewer: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Application</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Applicant name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border rounded px-3 py-2 text-sm">
            <option>Interview Scheduled</option>
            <option>Interview Done</option>
            <option>Voting</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <input placeholder="Interviewer / VP" value={form.interviewer} onChange={e => setForm({...form, interviewer: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="border rounded px-3 py-2 text-sm" />
          <button onClick={addApp} className="bg-green-600 text-white rounded px-4 py-2 text-sm">Save</button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Interviewer</th>
              <th className="text-left p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">{a.interviewer}</td>
                <td className="p-3">{a.notes}</td>
              </tr>
            ))}
            {apps.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No applications recorded</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
