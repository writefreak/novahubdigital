"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Eye, EyeOff, ArrowLeft, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function SignUpForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { signUp, errors: clerkErrors, fetchStatus } = useSignUp();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState(false);

  const isSubmitting = fetchStatus === "fetching";

  async function finalizeSignUp() {
    if (!signUp) return;
    await signUp.finalize({
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

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!signUp) return;

    // 1. If an abandoned attempt exists for this email, jump straight to verification
    if (
      signUp.status === "missing_requirements" &&
      signUp.emailAddress === email
    ) {
      const codeRes = await signUp.verifications.sendEmailCode();
      if (codeRes?.error) {
        const msg =
          codeRes.error.longMessage ??
          codeRes.error.message ??
          "Failed to send code.";
        setFormError(msg);
        showToast("error", msg);
        return;
      }
      setPendingVerification(true);
      showToast("success", "Resent code for your pending verification.");
      return;
    }

    // 2. Normal fresh registration flow
    const res = await signUp.password({
      emailAddress: email,
      password,
    });

    if (res?.error) {
      const msg =
        res.error.longMessage ??
        res.error.message ??
        "Failed to create account.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    // 3. Check status after the password attempt
    const currentStatus = signUp.status as string;

    if (currentStatus === "complete") {
      showToast("success", "Account created successfully!");
      await finalizeSignUp();
      return;
    }

    const codeRes = await signUp.verifications.sendEmailCode();

    if (codeRes?.error) {
      const msg =
        codeRes.error.longMessage ??
        codeRes.error.message ??
        "Failed to send verification code.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    setPendingVerification(true);
    showToast("success", "Verification code sent to your email.");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!signUp) return;

    const res = await signUp.verifications.verifyEmailCode({ code });

    if (res?.error) {
      const msg =
        res.error.longMessage ??
        res.error.message ??
        "Invalid verification code.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    if (signUp.status === "complete") {
      try {
        showToast("success", "Account verified successfully!");
        await finalizeSignUp();
      } catch (finalizeErr: any) {
        const msg = finalizeErr?.message ?? "Error finalizing registration.";
        setFormError(msg);
        showToast("error", msg);
      }
    } else {
      setFormError(
        `Registration incomplete. Status: ${signUp.status}. Check required attributes in Clerk Dashboard.`,
      );
    }
  }

  async function handleResendCode() {
    if (!signUp) return;
    setFormError(null);
    setIsResending(true);

    const res = await signUp.verifications.sendEmailCode();
    setIsResending(false);

    if (res?.error) {
      const msg =
        res.error.longMessage ?? res.error.message ?? "Failed to resend code.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    showToast("success", "A new code has been sent to your email.");
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
            bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl
            md:bg-transparent md:backdrop-blur-none md:border-0 md:shadow-none md:p-0
          "
        >
          <div className="mb-8 flex items-center gap-2">
            {pendingVerification && (
              <button
                type="button"
                onClick={() => {
                  setPendingVerification(false);
                  setFormError(null);
                  setCode("");
                }}
                className="inline-flex items-center justify-center rounded-md p-1 -ml-1 text-white/70 hover:text-white md:text-muted-foreground md:hover:text-foreground transition-colors"
                aria-label="Back to registration"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h1 className="font-display font-semibold text-2xl md:text-3xl text-white md:text-foreground">
                {pendingVerification ? "Verify email" : "Create account"}
              </h1>
              <p className="mt-1.5 text-xs md:text-sm text-white/70 md:text-muted-foreground">
                {pendingVerification
                  ? `Enter the verification code sent to ${email}`
                  : "Create an account to access your dashboard"}
              </p>
            </div>
          </div>

          {!pendingVerification ? (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-white md:text-foreground"
                >
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
                {clerkErrors?.fields?.emailAddress?.message && (
                  <p className="text-xs text-expense">
                    {clerkErrors.fields.emailAddress.message}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              <div id="clerk-captcha" />

              {formError && <p className="text-sm text-expense">{formError}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ff5a1f] border-none py-5 text-white hover:bg-[#ff5a1f]/90 md:bg-accent md:text-accent-foreground md:hover:bg-accent/90"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>

              <p className="text-center text-xs pt-2 text-white/70 md:text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-white md:text-accent underline underline-offset-4 hover:opacity-80"
                >
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="code" className="text-white md:text-foreground">
                  Verification code
                </Label>
                <Input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="text-center tracking-widest bg-white/10 border-white/25 text-white placeholder:text-white/50 md:bg-background md:border-input md:text-foreground md:placeholder:text-muted-foreground"
                />
                {clerkErrors?.fields?.code?.message && (
                  <p className="text-xs text-expense">
                    {clerkErrors.fields.code.message}
                  </p>
                )}
              </div>

              {formError && <p className="text-sm text-expense">{formError}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ff5a1f] border-none py-5 text-white hover:bg-[#ff5a1f]/90 md:bg-accent md:text-accent-foreground md:hover:bg-accent/90"
              >
                {isSubmitting ? "Verifying..." : "Verify code"}
              </Button>

              <div className="flex items-center justify-between pt-2 text-xs text-white/70 md:text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setPendingVerification(false);
                    setFormError(null);
                    setCode("");
                  }}
                  className="flex items-center gap-1 hover:underline"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || isSubmitting}
                  className="flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`}
                  />
                  {isResending ? "Resending..." : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
