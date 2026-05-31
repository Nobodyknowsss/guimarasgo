-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'PARTNER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "role" "user_role",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ─────────────────────────────────────────────────────────────
-- Sync auth.users  ──►  public.users
--
-- public.users.id mirrors auth.users.id (same UUID) but is NOT
-- a foreign key. The link is maintained by these triggers.
--
--   INSERT on auth.users → create public.users row (role = NULL)
--   UPDATE on auth.users → keep email in sync
--   DELETE on auth.users → remove the public.users row
--
-- Functions use SECURITY DEFINER so they run with the function
-- owner's privileges (needed to write to public.users from a
-- trigger fired by Supabase Auth's internal role).
-- ─────────────────────────────────────────────────────────────

-- INSERT handler
CREATE OR REPLACE FUNCTION public.handle_auth_user_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    NEW.raw_user_meta_data ->> 'full_name',  -- NULL if not provided at signup
    NULL,                                    -- role NULL = no access until admin assigns
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- UPDATE handler (email only)
CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.users
       SET email      = NEW.email,
           updated_at = NOW()
     WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- DELETE handler (cascade)
CREATE OR REPLACE FUNCTION public.handle_auth_user_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_insert();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_update();

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_delete();
