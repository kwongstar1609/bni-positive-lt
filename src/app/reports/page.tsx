"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setMessage("Processing...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const parsed = lines.slice(0, 30).map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
      setRows(parsed);
      setMessage(`Loaded ${lines.length} rows. Preview shown below.`);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">BNI Connect Reports</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-gray-700 mb-4">Upload a CSV export from BNI Connect (Traffic Lights, PALMS, or Member Ranking).</p>
        <input type="file" accept=".csv" onChange={handleUpload} className="mb-3" />
        {fileName && <p className="text-sm text-green-700">{message}</p>}
      </div>
      {rows.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-xs">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i === 0 ? "bg-gray-100 font-medium" : "border-t"}>
                  {row.map((cell, j) => <td key={j} className="p-2 whitespace-nowrap">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
