import { createClient } from "@/lib/supabase/server";

type RequireUserResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; status: 401 };

/**
 * Verifies the caller is an authenticated user (any role).
 * Call this at the top of route handlers / actions that a logged-in customer
 * may perform (e.g. creating their own booking).
 *
 * Returns { ok: true, userId, email } on success, { ok: false, status: 401 }
 * when not authenticated.
 */
export async function requireUser(): Promise<RequireUserResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, status: 401 };

  return { ok: true, userId: user.id, email: user.email ?? "" };
}
