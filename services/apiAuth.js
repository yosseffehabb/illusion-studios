// services/apiAuth.ts
import { createClient } from "@/lib/supabase-client";

export const authService = {
  // Login
  async login({ email, password }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Signup
  async signup({ email, password, fullName }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Logout - UPDATED
  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Force hard navigation to clear all cached state
    // This prevents hydration mismatches after logout
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  // Get current session
  async getSession() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getCurrentUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Password reset
  async resetPassword(email) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  },
};
