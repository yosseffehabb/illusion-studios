// lib/hooks/useAuth.js
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query for current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/admin");
      router.refresh();
    },
  });

  // Logout mutation - UPDATED
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear React Query cache
      queryClient.clear();

      // Force hard redirect to clear all cached state
      // This prevents hydration mismatches
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, force redirect
      window.location.href = "/login";
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
