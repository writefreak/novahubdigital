"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
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

    const { error } = await signUp.password({
      emailAddress: email,
      password,
    });

    if (error) {
      const msg = error.longMessage ?? "Failed to create account.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    if (signUp.status === "complete") {
      showToast("success", "Account created successfully!");
      await finalizeSignUp();
      return;
    }

    // In Clerk's new API, unverified email requires sending the verification code
    const isEmailUnverified =
      signUp.unverifiedFields?.includes("email_address") ||
      signUp.status === "missing_requirements";

    if (isEmailUnverified) {
      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) {
        setFormError(codeError.longMessage ?? "Failed to send code.");
        showToast("error", codeError.longMessage ?? "Failed to send code.");
        return;
      }
      setPendingVerification(true);
      showToast("success", "Verification code sent to your email.");
    } else {
      const msg = "Additional verification steps are required.";
      setFormError(msg);
      showToast("error", msg);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!signUp) return;

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      const msg = error.longMessage ?? "Invalid verification code.";
      setFormError(msg);
      showToast("error", msg);
      return;
    }

    if (signUp.status === "complete") {
      showToast("success", "Account created successfully!");
      await finalizeSignUp();
    } else {
      const msg = "Verification incomplete. Please check your details.";
      setFormError(msg);
      showToast("error", msg);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {pendingVerification ? "Verify Email" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {pendingVerification
            ? `Enter the code sent to ${email}`
            : "Get started with NovaHub today."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!pendingVerification ? (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {clerkErrors?.fields?.emailAddress?.message && (
                <p className="text-xs text-expense">
                  {clerkErrors.fields.emailAddress.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
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

            <div id="clerk-captcha" />

            {formError && <p className="text-sm text-expense">{formError}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
              {clerkErrors?.fields?.code?.message && (
                <p className="text-xs text-expense">
                  {clerkErrors.fields.code.message}
                </p>
              )}
            </div>

            {formError && <p className="text-sm text-expense">{formError}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
