import { supabase } from "./supabase";

/** Real Supabase Auth helpers (PRD §5.1). */

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithPassword(
  name: string,
  email: string,
  password: string,
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: "developer" } },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}
