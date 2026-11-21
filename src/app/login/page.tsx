"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-2">Logged In</h1>
          <p className="text-gray-600 mb-4">Welcome to BNI Positive LT System</p>
          <a href="/" className="text-red-700 underline">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-red-800 mb-6 text-center">BNI Positive LT</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          onClick={() => setLoggedIn(true)}
          className="w-full bg-red-700 text-white py-2 rounded font-medium"
        >
          Login
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center">Demo login — any email/password works for now</p>
      </div>
    </div>
  );
}
