import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await adminAuth.verifyIdToken(token);

  const snap = await adminDB
    .collection("tasks")
    .where("userId", "==", decoded.uid)
    .get();

  const tasks = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = await adminAuth.verifyIdToken(token);
  const { title } = await req.json();

  await adminDB.collection("tasks").add({
    userId: decoded.uid,
    title,
    completed: false,
  });

  return NextResponse.json({ message: "Task created" });
}
