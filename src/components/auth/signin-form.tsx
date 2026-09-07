"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function SignInForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const isSubmitting = fetchStatus === "fetching";

  async function finalizeSignIn() {
    if (!signIn) return;
    await signIn.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }
        const url = decorateUrl("/");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
          router.refresh();
        }
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!signIn) return;

    const { error } = await signIn.password({
      identifier: email,
      password,
    });

    if (error) {
      const msg = error.longMessage ?? "Incorrect email or password.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    if (signIn.status === "complete") {
      showToast("success", "Signed in successfully!");
      await finalizeSignIn();
    } else if (signIn.status === "needs_second_factor") {
      const msg = "This account requires a second verification step.";
      setFormError(msg);
      showToast("error", msg);
    } else if (signIn.status === "needs_client_trust") {
      const msg =
        "We don't recognize this device. Check your email to confirm it's you.";
      setFormError(msg);
      showToast("error", msg);
    } else {
      const msg = "Additional verification required.";
      setFormError(msg);
      showToast("error", msg);
    }
  }

  return (
    <div className="relative min-h-screen w-full md:flex">
      {/* Image panel. Fixed full-bleed background on mobile, left column on desktop. */}
      <div className="absolute inset-0 md:relative md:w-1/2 xl:w-[45%] md:min-h-screen">
        <Image
          src="/login.jpg"
          alt=""
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/45 md:bg-black/45" />

        {/* Copy overlaid on the image, desktop only, matching the reference panel. */}
        <div className="hidden md:flex relative z-10 h-full flex-col justify-center p-10 lg:p-14">
          <div className="max-w-md">
            <h2 className="font-display font-semibold text-4xl leading-tight text-white">
              NovaHub Digital Center Sales Dashboard
            </h2>
            <p className="mt-4 text-sm text-white/70 max-w-sm">
              Track and view comprehensive daily reports of customer service,
              and expenses in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel. Floating glass card on mobile, plain right column on desktop. */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-12 md:w-1/2 xl:w-[55%] md:bg-background">
        <div
          className="
            w-full max-w-sm rounded-2xl p-6
            bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl
            md:bg-transparent md:backdrop-blur-none md:border-0 md:shadow-none md:p-0
          "
        >
          <div className="mb-8">
            <h1 className="font-display font-semibold hidden md:block text-xl md:text-3xl text-white md:text-foreground">
              Sign into your account
            </h1>
            <h1 className="font-display font-semibold md:hidden text-2xl text-white md:text-foreground">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs md:hidden text-white/80 md:text-muted-foreground">
              Sign in to continue to access the Dashboard
            </p>
            <p className="mt-1.5 text-sm hidden md:block text-white/70 md:text-muted-foreground">
              Welcome back to NovaHub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-white md:text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/25 text-white placeholder:text-white/50 md:bg-background md:border-input md:text-foreground md:placeholder:text-muted-foreground"
              />
              {clerkErrors?.fields?.identifier?.message && (
                <p className="text-xs text-white md:text-accent">
                  {clerkErrors.fields.identifier.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-white md:text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-white/10 border-white/25 text-white placeholder:text-white/50 md:bg-background md:border-input md:text-foreground md:placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white md:text-muted-foreground md:hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {clerkErrors?.fields?.password?.message && (
                <p className="text-xs text-expense">
                  {clerkErrors.fields.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-white md:text-accent underline"
              >
                Forgot password?
              </Link>
            </div>

            <div id="clerk-captcha" />

            {formError && <p className="text-sm text-expense">{formError}</p>}

            <Button
              className="bg-[#ff5a1f] border-none py-5 text-white hover:bg-[#ff5a1f]/90 md:bg-accent md:text-accent-foreground md:hover:bg-accent/90"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-xs pt-2 text-white/70 md:text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-white md:text-accent underline underline-offset-4 hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
