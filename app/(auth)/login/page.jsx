"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function Page() {
  const { register, handleSubmit } = useForm();
  const { login, isLoggingIn, loginError } = useAuth();

  function onSubmit(data) {
    login(data);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Brand Panel - Visible on all screens */}
      <div className="relative w-full lg:w-1/2 bg-primarygreen-500 text-primarygreen-50 flex flex-col justify-between p-6 sm:p-8 lg:p-12 min-h-[280px] sm:min-h-[320px] lg:min-h-screen overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full bg-primarygreen-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] rounded-full bg-brand-dark/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 rounded-full bg-accent/10 blur-2xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-primarygreen-50">
            System
          </h1>
        </div>

        {/* Main branding */}
        <div
          className="relative z-10 space-y-4 sm:space-y-6 my-4 lg:my-0 animate-slide-in-left"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight text-primarygreen-50">
            ILLUSION
            <br />
            <span className="text-primary-foreground/90">STUDIOS</span>
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-primary-foreground/40 rounded-full" />
          <p className="text-xs sm:text-sm tracking-wide text-neutral-400 max-w-[280px] sm:max-w-xs leading-relaxed">
            NOTHING OF THIS IS REAL. IT&apos;S ALL AN ILLUSION.
          </p>
        </div>

        {/* Footer */}
        <p
          className="relative z-10 text-[10px] sm:text-xs tracking-wider  text-neutral-400 animate-fade-in hidden sm:block"
          style={{ animationDelay: "0.3s" }}
        >
          © 2024 ALL RIGHTS RESERVED
        </p>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-card min-h-[calc(100vh-280px)] sm:min-h-[calc(100vh-320px)] lg:min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md space-y-8 sm:space-y-10 animate-fade-in-up">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primarygreen-500">
              Log in
            </h2>
            <p className="text-sm tracking-wide text-neutral-400">
              Enter your credentials below
            </p>
          </div>

          <form
            className="space-y-5 sm:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Error Message */}
            {loginError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {loginError.message}
              </div>
            )}

            <div className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-primarygreen-500"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  disabled={isLoggingIn}
                  className="h-11 sm:h-12 px-4 text-sm bg-primarygreen-50 border-border placeholder:text-neutral-400/60 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primarygreen-500 border-none"
                  {...register("email")}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-primarygreen-500"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoggingIn}
                  className="h-11 sm:h-12 px-4 text-sm bg-primarygreen-50 border-border placeholder:text-neutral-400/60 transition-all duration-200 focus-visible:ring-1 focus-visible:ring-primarygreen-500 border-none"
                  {...register("password")}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-11 sm:h-12 bg-primarygreen-500 text-primarygreen-50 hover:bg-primarygreen-700 font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <p className="text-[10px] sm:text-xs text-center tracking-wide text-neutral-400 leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primarygreen-500 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primarygreen-500 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
