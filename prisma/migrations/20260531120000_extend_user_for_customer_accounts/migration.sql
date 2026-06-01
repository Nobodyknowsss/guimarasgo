-- Extend user model for customer accounts:
--   1. Swap user_role enum:  ADMIN | PARTNER  →  ADMIN | CUSTOMER
--   2. Split full_name into first_name + last_name; add fb_link.
--   3. Update auth.users → public.users INSERT trigger:
--      - read first_name / last_name / phone / fb_link from raw_user_meta_data
--      - default role to CUSTOMER (was NULL); admin is promoted manually.

-- ── 1. Enum swap ─────────────────────────────────────────────────────────
-- Postgres can't drop an enum value in-place; rename → create new → migrate column → drop old.
ALTER TYPE "user_role" RENAME TO "user_role_old";

CREATE TYPE "user_role" AS ENUM ('ADMIN', 'CUSTOMER');

ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "user_role" USING (
    CASE
      WHEN "role"::text = 'ADMIN' THEN 'ADMIN'::"user_role"
      ELSE NULL  -- PARTNER (never used) becomes NULL
    END
  );

DROP TYPE "user_role_old";

-- ── 2. Column restructure ───────────────────────────────────────────────
ALTER TABLE "users" DROP COLUMN "full_name";
ALTER TABLE "users" ADD COLUMN "first_name" TEXT;
ALTER TABLE "users" ADD COLUMN "last_name"  TEXT;
ALTER TABLE "users" ADD COLUMN "fb_link"    TEXT;

-- ── 3. Trigger update ───────────────────────────────────────────────────
-- INSERT handler: reads from raw_user_meta_data, defaults role to CUSTOMER.
CREATE OR REPLACE FUNCTION public.handle_auth_user_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id, email, phone, first_name, last_name, fb_link, role, created_at, updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'fb_link',
    'CUSTOMER'::"user_role",
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;
