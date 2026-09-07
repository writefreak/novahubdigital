// components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type Step = "request" | "reset";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);

  const submitting = fetchStatus === "fetching";

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setEmailError("Enter your email address.");
      return;
    }

    setEmailError(undefined);

    if (!signIn) return;

    const { error: createError } = await signIn.create({
      identifier: email,
    });

    if (createError) {
      const msg =
        createError.longMessage ??
        "We couldn't find an account with that email.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();

    if (sendCodeError) {
      const msg =
        sendCodeError.longMessage ?? "Couldn't send the reset code. Try again.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    setStep("reset");
    showToast("success", "Verification code sent to your email.");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!signIn) return;

    let hasError = false;
    if (!code) {
      setCodeError("Enter the code we sent you.");
      hasError = true;
    } else {
      setCodeError(undefined);
    }

    if (hasError) return;

    const { error: verifyError } =
      await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });

    if (verifyError) {
      const msg = verifyError.longMessage ?? "Invalid or expired code.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    if (signIn.status === "needs_new_password") {
      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({ password });

      if (submitError) {
        const msg =
          submitError.longMessage ?? "Couldn't reset your password. Try again.";
        setFormError(msg);
        showToast("error", msg);
        return;
      }
    }

    if (signIn.status === "complete") {
      showToast("success", "Password reset successfully!");
      await signIn.finalize({
        navigate: async ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
            router.refresh();
          }
        },
      });
    } else {
      const msg = "Reset incomplete. Check the code and try again.";
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
          className="object-cover brightness-50 md:brightness-75"
        />
        <div className="absolute inset-0 bg-black/45 md:bg-black/45" />

        {/* Copy overlaid on the image, desktop only, matching the sign-in panel. */}
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
          <div className="mb-8 flex flex-col gap-2">
            {step === "reset" && (
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setFormError(null);
                  setCode("");
                  setPassword("");
                }}
                className="inline-flex items-center justify-center rounded-md p-1 -ml-1 text-white/70 hover:text-white md:text-muted-foreground md:hover:text-foreground transition-colors"
                aria-label="Back to request code"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h1 className="font-display font-semibold hidden md:block text-xl md:text-3xl text-white md:text-foreground">
                {step === "reset" ? "Set new password" : "Forgot password?"}
              </h1>
              <h1 className="font-display font-semibold md:hidden text-2xl text-white md:text-foreground">
                {step === "reset" ? "New password" : "Forgot password?"}
              </h1>
              <p className="mt-1.5 text-xs md:hidden text-white/80 md:text-muted-foreground">
                {step === "reset"
                  ? `Enter the code sent to ${email}`
                  : "We'll send a reset code to your email"}
              </p>
              <p className="mt-1.5 text-sm hidden md:block text-white/70 md:text-muted-foreground">
                {step === "reset"
                  ? `Enter the code sent to ${email} and choose a new password`
                  : "Enter your email and we'll send you a reset code"}
              </p>
            </div>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="bg-white/10 border-white/25 text-white placeholder:text-white/50 md:bg-background md:border-input md:text-foreground md:placeholder:text-muted-foreground"
                />
                {(emailError || clerkErrors?.fields?.identifier?.message) && (
                  <p className="text-xs text-expense">
                    {emailError ?? clerkErrors?.fields?.identifier?.message}
                  </p>
                )}
              </div>

              <div id="clerk-captcha" />

              {formError && <p className="text-sm text-expense">{formError}</p>}

              <Button
                className="bg-[#ff5a1f] border-none py-5 text-white hover:bg-[#ff5a1f]/90 md:bg-accent md:text-accent-foreground md:hover:bg-accent/90"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send reset code"}
              </Button>

              <p className="text-center text-xs pt-2 text-white/70 md:text-muted-foreground">
                Remembered it?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-white md:text-accent underline underline-offset-4 hover:opacity-80"
                >
                  Back to sign in
                </Link>
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
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
                {codeError && (
                  <p className="text-xs text-expense">{codeError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-white md:text-foreground"
                >
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
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
                {(passwordError || clerkErrors?.fields?.password?.message) && (
                  <p className="text-xs text-expense">
                    {passwordError ?? clerkErrors?.fields?.password?.message}
                  </p>
                )}
              </div>

              <div id="clerk-captcha" />

              {formError && <p className="text-sm text-expense">{formError}</p>}

              <Button
                className="bg-[#ff5a1f] border-none py-5 text-white hover:bg-[#ff5a1f]/90 md:bg-accent md:text-accent-foreground md:hover:bg-accent/90"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Resetting..." : "Reset password"}
              </Button>

              <p className="text-center text-xs pt-2 text-white/70 md:text-muted-foreground">
                Didn&apos;t get a code?{" "}
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={submitting}
                  className="font-medium text-white md:text-accent underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
