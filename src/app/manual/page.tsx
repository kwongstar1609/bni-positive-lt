export default function ManualPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Manual</h1>
      
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Accessing the System</h2>
        <p className="text-gray-700">Open the live URL. Use the Login page (demo mode — any email/password works for now).</p>
      </section>

      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Navigation</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li><strong>Dashboard</strong> – Chapter overview</li>
          <li><strong>Calendar</strong> – View and add events</li>
          <li><strong>Members</strong> – View and add members</li>
          <li><strong>Tasks</strong> – Track LT tasks (status can be updated)</li>
          <li><strong>Traffic Lights</strong> – Score calculator</li>
          <li><strong>Reports</strong> – Upload BNI Connect CSV for preview</li>
          <li><strong>Presentations</strong> – Archive of past presentations</li>
          <li><strong>Seating Plans</strong> – 萬怡酒店 table overview</li>
          <li><strong>Activities</strong> – Chapter workshops and events</li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Key Actions</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Tasks: Click “+ Add Task”, then change status via dropdown.</li>
          <li>Members: Click “+ Add Member”. Status is auto-calculated from score.</li>
          <li>Calendar: Click “+ Add Event” and choose type (color-coded).</li>
          <li>Reports: Upload a CSV to preview the first 20 rows.</li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">Current Status (Phase 1 MVP)</h2>
        <p className="text-gray-700">Tasks, Members, and Calendar data are saved in your browser. Full multi-user database, real Excel parsing, interactive seating editor, and role-based access are planned for future updates.</p>
      </section>
    </div>
  );
}
