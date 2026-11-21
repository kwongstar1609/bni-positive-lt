"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      const parsed = lines.slice(0, 20).map(l => l.split(",").map(c => c.trim().replace(/"/g, "")));
      setRows(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">BNI Connect Reports</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-gray-600 mb-4">Upload a CSV export from BNI Connect (Traffic Lights or PALMS).</p>
        <input type="file" accept=".csv" onChange={handleUpload} />
        {fileName && <p className="text-sm mt-2 text-green-600">Loaded: {fileName}</p>}
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
          <p className="text-xs text-gray-400 p-3">Showing first 20 rows. Full parsing & Traffic Lights update coming next.</p>
        </div>
      )}
    </div>
  );
}
