import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { User } from "@/models";

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name?.trim() || !email?.includes("@") || !password || password.length < 6) {
    return NextResponse.json({ error: "Enter your name, a valid email and a password of 6+ characters." }, { status: 400 });
  }
  await connectDB();
  const lower = email.toLowerCase().trim();
  if (await User.findOne({ email: lower })) {
    return NextResponse.json({ error: "This email is already registered. Try logging in." }, { status: 409 });
  }
  const isAdmin = process.env.ADMIN_EMAIL && lower === process.env.ADMIN_EMAIL.toLowerCase();
  await User.create({
    name: name.trim(),
    email: lower,
    password: await bcrypt.hash(password, 10),
    role: isAdmin ? "admin" : "student",
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
