"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState<null | any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState(""); // Edit task
  const [editStatus, setEditStatus] = useState("pending");
  const [completedCount, setCompletedCount] = useState(0);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: any) => {
      if (!u) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));

      if (snap.exists()) {
        setUserName(snap.data().email);
      }

      setUser(u);
      await loadTasks(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

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
      setCompletedCount(
        data.filter((task: any) => task.completed === true)?.length,
      );
      setIncompleteCount(
        data.filter((task: any) => task.completed === false)?.length,
      );
    } catch (err: any) {
      console.error("Error loading tasks:", err.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return toast.error("Please login again");

    const token = await user.getIdToken();
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await loadTasks(user);
      toast.success("task deleted successfully");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const editTask = (task: any) => {
    setEditingTask(task);
    setEditTitle(task?.title);
    setEditStatus(task.completed ? "completed" : "pending");
  };

  const updateTask = async () => {
    if (!user) return toast.error("Please login again");
    if (editTitle.length === 0) return toast.error("title can not be empty");

    const token = await user.getIdToken();

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, status: editStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setEditingTask(null);
      setTitle("");
      await loadTasks(user);
      toast.success("task updated successfully");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addTask = async () => {
    if (!user) return toast.error("Please login again");
    if (!title.trim()) return toast.error("title can not be empty");

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
      await loadTasks(user);
      toast.success("task added successfully"); // reload tasks
    } catch (err: any) {
      console.error("Error adding task:", err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-end gap-4">
        <div className="text-sm text-gray-700">
          Hello, <span className="font-semibold">{userName}</span>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-lg bg-white p-6 shadow-lg h-auto">
            <h2 className="mb-4 text-lg font-semibold">Edit Task</h2>

            <input
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <div className="mt-3">
              <label className="mb-1 block text-sm text-gray-600">Status</label>

              <select
                value={editStatus === "pending" ? "pending" : "completed"}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm h-[45px]"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setTitle("");
                }}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="mb-4 text-2xl font-semibold flex items-center gap-4">
        <span>
          Tasks <span className="text-sm text-gray-400">({tasks.length})</span>
        </span>

        <span className="text-base font-medium text-emerald-600">
          Complete{" "}
          <span className="text-sm text-gray-400">({completedCount})</span>
        </span>

        <span className="text-base font-medium text-yellow-500">
          Incomplete{" "}
          <span className="text-sm text-gray-400">({incompleteCount})</span>
        </span>
      </h1>

      <div className="mb-6 flex gap-2">
        <input
          className="h-[48px] flex-1 rounded-md border px-3 "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new task"
        />
        <button
          onClick={addTask}
          className="rounded-md bg-emerald-600 px-5 text-white hover:bg-emerald-700 cursor-pointer"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one 🚀</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task?.id}
              task={task}
              editTask={editTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
