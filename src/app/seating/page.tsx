"use client";

import { useState, useEffect } from "react";

type SeatNote = { table: string; note: string };

export default function SeatingPage() {
  const [notes, setNotes] = useState<SeatNote[]>([]);
  const [table, setTable] = useState("Table 1");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bni-seating-notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-seating-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([...notes, { table, note }]);
    setNote("");
  };

  const tables = ["Table 1", "Table 2", "Table 3", "Table 5", "Table 6", "Table 7", "Table 8", "Table 9", "Table 10", "Table 11"];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Seating Plans</h1>
      <p className="text-gray-600 mb-6">萬怡酒店 • Fixed venue</p>

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 flex-wrap">
        <select value={table} onChange={e => setTable(e.target.value)} className="border rounded px-3 py-2 text-sm">
          {tables.map(t => <option key={t}>{t}</option>)}
        </select>
        <input
          placeholder="Add note (e.g. visitor names, special arrangement)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <button onClick={addNote} className="bg-red-700 text-white px-4 py-2 rounded text-sm">Add Note</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {tables.map(t => (
          <div key={t} className="bg-white border rounded-lg p-3 text-sm">
            <div className="font-semibold">{t}</div>
            <div className="text-xs text-gray-500 mt-1">
              {notes.filter(n => n.table === t).map((n, i) => <div key={i}>• {n.note}</div>) || "No notes"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
