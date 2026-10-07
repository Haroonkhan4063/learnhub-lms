import { redirect } from "next/navigation";
import { getSession } from "./auth";

export async function requireUser() {
  const s = await getSession();
  if (!s) redirect("/login");
  return s.user;
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.user.role !== "admin") redirect("/");
  return s.user;
}
