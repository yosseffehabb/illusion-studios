"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const { login, isLoggingIn, loginError } = useAuth();

  function onSubmit(data) {
    login(data);
  }
  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            <Spinner className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Log in"
        )}
      </Button>
    </form>
  );
}
