"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back to NovaHub.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {clerkErrors?.fields?.identifier?.message && (
              <p className="text-xs text-expense">
                {clerkErrors.fields.identifier.message}
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
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
