"use client";

import { useState, useEffect } from "react";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([
    "MSP Workshop – 1 Dec 2026",
    "MC Follow Up Workshop – 4 Dec 2026",
    "Member Testimonial Video Contest 2026",
  ]);
  const [newActivity, setNewActivity] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bni-activities");
    if (saved) setActivities(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bni-activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = () => {
    if (!newActivity.trim()) return;
    setActivities([...activities, newActivity]);
    setNewActivity("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chapter Activities</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3">
        <input
          placeholder="Add new activity or workshop"
          value={newActivity}
          onChange={e => setNewActivity(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <button onClick={addActivity} className="bg-red-700 text-white px-4 py-2 rounded text-sm">Add</button>
      </div>
      <div className="bg-white rounded-xl shadow divide-y">
        {activities.map((a, i) => (
          <div key={i} className="p-4 text-gray-800">{a}</div>
        ))}
      </div>
    </div>
  );
}
