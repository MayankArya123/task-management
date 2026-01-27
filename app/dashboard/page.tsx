"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<null | any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState(""); // Edit task

  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u:any) => {
      if (!u) {
        router.push("/login"); // redirect if not logged in
        return;
      }

      // Firestore user document
      const snap = await getDoc(doc(db, "users", u.uid));

      if (snap.exists()) {
        setUserName(snap.data().email);
      }

      setUser(u);
      await loadTasks(u); // load tasks immediately
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Fetch tasks from server
  const loadTasks = async (u: User) => {
    const token = await u.getIdToken();

    try {
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      console.error("Error loading tasks:", err.message);
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    if (!user) return;

    const token = await user.getIdToken();
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await loadTasks(user);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // Start editing
  const editTask = (task: any) => {
    setEditingTask(task);
    setEditTitle(task?.title);
  };

  const updateTask = async () => {
    if (!user) return;

    const token = await user.getIdToken();

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setEditingTask(null);
      setTitle("");
      await loadTasks(user);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!user || !title.trim()) return alert("title can not be empty");

    const token = await user.getIdToken();

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      setTitle(""); // clear input
      await loadTasks(user); // reload tasks
    } catch (err: any) {
      console.error("Error adding task:", err.message);
    }
  };

  // Optional: logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[350px]">
            <h2 className="text-xl mb-4">Edit Task</h2>

            <input
              className="border p-2 w-full mb-4"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setTitle("");
                }}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                className="px-4 py-2 bg-black text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        {
          <div className="mr-[10px]  justify-self flex items-center">
            Hello,{" "}
            <span className="font-semibold text-gray-900">{userName}</span>
          </div>
        }

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl mb-4">Tasks</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded-[6px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new task"
        />
        <button
          onClick={addTask}
          className="bg-black text-white px-4 rounded cursor-pointer"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>{task.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editTask(task)}
                className="bg-yellow-400 px-2 py-1 rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
