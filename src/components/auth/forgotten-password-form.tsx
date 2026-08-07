// components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="w-full max-w-sm p-4">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
            {step === "reset" && (
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setFormError(null);
                  setCode("");
                  setPassword("");
                }}
                className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Back to request code"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {step === "reset" ? "Set new password" : "Forgot password?"}
          </CardTitle>
          <CardDescription>
            {step === "reset"
              ? `Enter the code sent to ${email} and choose a new password.`
              : "Enter your email and we'll send you a reset code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "request" ? (
            <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                />
                {(emailError || clerkErrors?.fields?.identifier?.message) && (
                  <p className="text-xs text-expense">
                    {emailError ?? clerkErrors?.fields?.identifier?.message}
                  </p>
                )}
              </div>

              <div id="clerk-captcha" />

              {formError && <p className="text-sm text-expense">{formError}</p>}

              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send reset code"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Remembered it?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
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
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="text-center tracking-widest"
                />
                {codeError && (
                  <p className="text-xs text-expense">{codeError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

              <Button type="submit" disabled={submitting}>
                {submitting ? "Resetting..." : "Reset password"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Didn&apos;t get a code?{" "}
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={submitting}
                  className="font-medium text-accent underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
