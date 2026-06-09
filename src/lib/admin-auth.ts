import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const ADMIN_EMAIL = "9spasovski@gmail.com";

export async function requireAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress.toLowerCase();
  if (email !== ADMIN_EMAIL) notFound();
  return user;
}
