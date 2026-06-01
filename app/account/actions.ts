"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type UpdateProfileResult =
  | { ok: true }
  | { ok: false; error: string };

function trimStr(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfile(
  formData: FormData,
): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in to update your profile." };
  }

  const firstName = trimStr(formData.get("firstName"));
  const lastName = trimStr(formData.get("lastName"));
  const phone = trimStr(formData.get("phone"));
  const fbLink = trimStr(formData.get("fbLink"));

  if (!firstName) return { ok: false, error: "First name is required." };
  if (!lastName) return { ok: false, error: "Last name is required." };
  if (!phone) return { ok: false, error: "Phone number is required." };
  if (firstName.length > 100 || lastName.length > 100) {
    return { ok: false, error: "Name fields are too long." };
  }
  if (phone.length > 40) {
    return { ok: false, error: "Phone number is too long." };
  }

  if (fbLink) {
    if (fbLink.length > 255) {
      return { ok: false, error: "Facebook link is too long." };
    }
    try {
      // Will throw on invalid URL.
      new URL(fbLink);
    } catch {
      return { ok: false, error: "Facebook link must be a valid URL." };
    }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone,
        fbLink: fbLink.length > 0 ? fbLink : null,
      },
    });
  } catch {
    return { ok: false, error: "Could not save your profile. Try again." };
  }

  revalidatePath("/account");
  return { ok: true };
}
