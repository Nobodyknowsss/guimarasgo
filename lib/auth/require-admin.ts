import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

type RequireAdminResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403 };

/**
 * Verifies the caller is an authenticated ADMIN.
 * Call this at the top of any admin-only route handler or server action.
 *
 * Returns { ok: true, userId } on success.
 * Returns { ok: false, status: 401 } when not authenticated.
 * Returns { ok: false, status: 403 } when authenticated but not ADMIN.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, status: 401 };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") return { ok: false, status: 403 };

  return { ok: true, userId: user.id };
}