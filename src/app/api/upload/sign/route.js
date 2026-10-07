import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const s = await getSession();
  if (s?.user?.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloudName || !apiKey || !secret) {
    return NextResponse.json({ error: "Cloudinary is not set up yet. Paste a video link instead." }, { status: 501 });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "lms-videos";
  const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
