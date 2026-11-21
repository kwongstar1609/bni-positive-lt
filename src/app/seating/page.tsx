export default function SeatingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Seating Plans</h1>
      <p className="text-gray-500 mb-6">萬怡酒店 • Fixed venue (6-month lock)</p>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-w-[800px] text-sm">
          <TableCard title="Table 1" type="Visitor" seats={8} color="yellow" />
          <TableCard title="Table 2" type="Visitor" seats={8} color="yellow" />
          <TableCard title="Table 3" type="Visitor" seats={8} color="yellow" />
          <TableCard title="Table 5" type="Visitor" seats={8} color="yellow" />
          <TableCard title="Table 6" type="Visitor" seats={8} color="yellow" />
          <TableCard title="Table 7" type="MS / CS" seats={10} color="blue" />
          <TableCard title="Table 8" type="FR / IT" seats={10} color="blue" />
          <TableCard title="Table 9" type="CE / LF" seats={10} color="blue" />
          <TableCard title="Table 10" type="FB / MP" seats={10} color="blue" />
          <TableCard title="Table 11" type="ET + Sub" seats={10} color="blue" />
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="px-3 py-1 bg-orange-100 rounded">D&A</span>
          <span className="px-3 py-1 bg-purple-100 rounded">Observer</span>
          <span className="px-3 py-1 bg-gray-100 rounded">Entrance</span>
          <span className="px-3 py-1 bg-gray-100 rounded">Mic Runner x 2</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-4">Interactive seating editor (drag-and-drop members & visitors) coming in next update.</p>
    </div>
  );
}

function TableCard({ title, type, seats, color }: { title: string; type: string; seats: number; color: string }) {
  const bg = color === "yellow" ? "bg-yellow-50 border-yellow-300" : "bg-blue-50 border-blue-300";
  return (
    <div className={`border-2 rounded-lg p-4 ${bg}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-gray-600">{type}</div>
      <div className="text-xs mt-1">{seats} Persons</div>
    </div>
  );
}
