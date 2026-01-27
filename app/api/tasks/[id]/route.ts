import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify token
  const decoded = await adminAuth.verifyIdToken(token);

  // Reference the task document
  const taskRef = adminDB.collection("tasks").doc(id);
  const taskSnap = await taskRef.get();

  // Check if task exists
  if (!taskSnap.exists) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Check if the logged-in user owns the task
  if (taskSnap.data()?.userId !== decoded.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete the task
  await taskRef.delete();

  return NextResponse.json({ message: "Task deleted" });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // ✅ REQUIRED in your Next version

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const { title } = await req.json();

  await adminDB.collection("tasks").doc(id).update({
    title,
    userId: decoded.uid,
    updatedAt: new Date(),
  });

  return NextResponse.json({ message: "Task updated" });
}
