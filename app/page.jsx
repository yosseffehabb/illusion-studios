"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

function Page() {
  const [isloading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  function onSubmit(data) {
    console.log(data);
    reset;
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 ">
      {/* Left Panel */}

      <div className="hidden lg:flex lg:w-1/2 bg-primarygreen-500 text-primary-50 flex-col justify-between p-12 ">
        <h1 className="text-sm font-bold tracking-widest uppercase text-primarygreen-50">
          System
        </h1>

        <div className="space-y-6">
          <p className="text-6xl font-bold leading-tight tracking-tight text-primarygreen-50">
            ILLUSION
            <br />
            STUDIOS
          </p>
          <div className="w-24 h-[2px] bg-primary-50/60" />
          <p className="text-sm tracking-wide opacity-70 max-w-xs text-primarygreen-50">
            NOTHING OF THIS IS REAL. IT’S ALL AN ILLUSION.
          </p>
        </div>

        <p className="text-xs tracking-wider opacity-40 text-neutral-400">
          © 2024 ALL RIGHTS RESERVED
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-50">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-primarygreen-500">
              Log in
            </h2>
            <p className="text-sm tracking-wide text-neutral-400">
              Enter your credentials below
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold tracking-wider uppercase text-primarygreen-500"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="
                    h-11 px-4 text-sm
                    border-neutral-200
                    placeholder:text-neutral-400
                    transition-all
                    focus-visible:ring-1
                    focus-visible:ring-primarygreen-500
                    focus-visible:border-primarygreen-500
                  "
                  {...register("email")}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-bold tracking-wider uppercase text-primarygreen-500"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="
                    h-11 px-4 text-sm
                    border-neutral-200
                    placeholder:text-neutral-400
                    transition-all
                    focus-visible:ring-1
                    focus-visible:ring-primarygreen-500
                    focus-visible:border-primarygreen-500
                  "
                  {...register("password")}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="
                w-full
                bg-primarygreen-500
                text-primarygreen-50
                hover:bg-primarygreen-700
                transition-all
                duration-300
              "
              disabled={isloading}
            >
              {isloading ? <Spinner /> : "Log in"}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center tracking-wide text-neutral-400">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primarygreen-500"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primarygreen-500"
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
