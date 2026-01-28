import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await adminAuth.verifyIdToken(token);

  const taskRef = adminDB.collection("tasks").doc(id);
  const taskSnap = await taskRef.get();

  if (!taskSnap.exists) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (taskSnap.data()?.userId !== decoded.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await taskRef.delete();

  return NextResponse.json({ message: "Task deleted" });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const { title, status } = await req.json();

  await adminDB.collection("tasks").doc(id).update({
    title,
    status,
    userId: decoded.uid,
    updatedAt: new Date(),
  });

  return NextResponse.json({ message: "Task updated" });
}
