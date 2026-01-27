"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome To Task Manager
        </h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 rounded-lg mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => login()}
          disabled={loading}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold transition duration-200 mb-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={() => {
            router.push("/signup");
          }}
          className="cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-50 w-full py-3 rounded-lg font-semibold transition duration-200"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
