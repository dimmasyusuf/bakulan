"use client";

import Image from "next/image";
import { signIn } from "@/auth";
import { useForm } from "react-hook-form";
import { RiAdminLine, RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { FaCashRegister } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  loginFormSchema,
  registerFormSchema,
  resetPasswordFormSchema,
  sendEmailFormSchema,
} from "@/lib/validator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { createUser, loginUser } from "@/lib/actions/auth.action";
import { Role } from "@prisma/client";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { sendEmail } from "@/lib/actions/resend.action";
import { useSearchParams } from "next/navigation";

export default function AuthForm({
  type,
  openAuth,
}: {
  type: string;
  openAuth: Dispatch<boolean>;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registerStep, setRegisterStep] = useState<number>(1);
  const [resetStep, setResetStep] = useState<number>(1);
  const [variant, setVariant] = useState<"login" | "reset">("login");
  const [userRole, setUserRole] = useState<Role>();
  const [authError, setAuthError] = useState<string>();
  const params = useSearchParams();

  const handleResetPassword = () => {
    const authName = params.get("auth");
    const token = params.get("token");

    if (authName === "reset-password" && token) {
      openAuth(true);
      setVariant("reset");
      setResetStep(3);
    }
  };

  useEffect(() => {
    handleResetPassword();
  }, [handleResetPassword]);

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "reset" : "login",
    );

    loginForm.reset();
    sendEmailForm.reset();
    resetPasswordForm.reset();
    setAuthError("");
    setResetStep(1);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const sendEmailForm = useForm<z.infer<typeof sendEmailFormSchema>>({
    resolver: zodResolver(sendEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onRegister(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsSubmitting(true);
      setTimeout(async () => {
        const user = await createUser({ values, role: userRole! });

        if (user.error) {
          setAuthError(user.error);
          setIsSubmitting(false);
        } else {
          registerForm.reset();
          setAuthError("");
          setIsSubmitting(false);
          openAuth(false);
        }
      }, 1000);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function onLogin(values: z.infer<typeof loginFormSchema>) {
    try {
      setIsSubmitting(true);

      setTimeout(async () => {
        const user = await loginUser(values);

        if (user?.error) {
          setAuthError(user?.error);
          setIsSubmitting(false);
        } else {
          loginForm.reset();
          setAuthError("");
          setIsSubmitting(false);
          openAuth(false);
        }
      }, 1000);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function onSendEmail(values: z.infer<typeof sendEmailFormSchema>) {
    try {
      setIsSubmitting(true);

      setTimeout(async () => {
        const email = await sendEmail(values);

        if (email?.error) {
          setAuthError(email.error);
          setIsSubmitting(false);
        } else {
          sendEmailForm.reset();
          setAuthError("");
          setIsSubmitting(false);
          setResetStep(2);
        }
      }, 1000);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function onResetPassword(values: z.infer<typeof resetPasswordFormSchema>) {
    try {
      setIsSubmitting(true);

      setTimeout(async () => {
        toast.success("Password reset successfully.");
        resetPasswordForm.reset();
        setIsSubmitting(false);
        openAuth(false);
      }, 1000);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <section className="my-auto flex min-w-full flex-col gap-8 rounded-none bg-background px-8 py-10 sm:min-w-[400px] sm:rounded-lg">
      <div className="flex w-full">
        <div
          onClick={() => openAuth(false)}
          className="relative flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-md"
        >
          <Image
            src="/logo.svg"
            alt="Bakulan Logo"
            width={48}
            height={48}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xl font-bold">
          {type === "register" && "Register"}
          {type && variant === "login" && "Login"}
          {variant === "reset" && "Reset Password"}
        </span>
        <span className="text-muted-foreground">to continue to Bakulan</span>
      </div>

      <div className="flex flex-col gap-10">
        {type === "register" && registerStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="sm"
                className={`${userRole === "Admin" && "bg-primary text-primary-foreground"} flex aspect-square h-full w-full flex-col gap-4 shadow-none focus:bg-primary focus:text-primary-foreground`}
                onClick={() => setUserRole("Admin")}
              >
                <RiAdminLine className="h-10 w-10" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${userRole === "Cashier" && "bg-primary text-primary-foreground"} flex aspect-square h-full w-full flex-col gap-4 shadow-none focus:bg-primary focus:text-primary-foreground`}
                onClick={() => setUserRole("Cashier")}
              >
                <FaCashRegister className="h-10 w-10" />
                Cashier
              </Button>
            </div>
            <Button
              size="sm"
              className="h-9 w-full"
              onClick={() => setRegisterStep(2)}
            >
              NEXT
            </Button>
          </div>
        )}

        {type === "register" && registerStep === 2 && (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shadow-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="shadow-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Password
                    </FormLabel>
                    <div className="relative flex w-full items-center">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      {showPassword ? (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(false)}
                          >
                            <RiEyeCloseLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      ) : (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(true)}
                          >
                            <RiEyeLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="flex h-9 items-center gap-x-2 rounded-md bg-destructive/15 px-3 py-1 text-sm text-destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                className="h-9 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "REGISTERING..." : "CONTINUE"}
              </Button>
            </form>
          </Form>
        )}

        {type && variant === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="shadow-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Password
                    </FormLabel>
                    <div className="relative flex w-full items-center">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      {showPassword ? (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(false)}
                          >
                            <RiEyeCloseLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      ) : (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(true)}
                          >
                            <RiEyeLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="flex h-9 items-center gap-x-2 rounded-md bg-destructive/15 px-3 py-1 text-sm text-destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                className="h-9 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "LOGGING IN..." : "CONTINUE"}
              </Button>
            </form>
          </Form>
        )}

        {variant === "reset" && resetStep === 1 && (
          <Form {...sendEmailForm}>
            <form
              onSubmit={sendEmailForm.handleSubmit(onSendEmail)}
              className="space-y-4"
            >
              <FormField
                control={sendEmailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="shadow-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="flex h-9 items-center gap-x-2 rounded-md bg-destructive/15 px-3 py-1 text-sm text-destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                className="h-9 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SENDING..." : "SEND EMAIL"}
              </Button>
            </form>
          </Form>
        )}

        {variant === "reset" && resetStep === 2 && (
          <div className="flex flex-col space-y-4">
            <div className="flex max-w-[336px] flex-col space-y-4 rounded-md border p-6">
              <CheckCircledIcon className="h-12 w-12 text-primary" />
              <span className="text-sm text-primary">
                We've sent an email to your email address. Please check your
                inbox and follow the instructions to reset your password.
              </span>
            </div>

            <Button
              size="sm"
              className="h-9 w-full"
              onClick={() => toggleVariant()}
            >
              BACK TO LOGIN
            </Button>
          </div>
        )}

        {variant === "reset" && resetStep === 3 && (
          <Form {...resetPasswordForm}>
            <form
              onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}
              className="space-y-4"
            >
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Password
                    </FormLabel>
                    <div className="relative flex w-full items-center">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      {showPassword ? (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(false)}
                          >
                            <RiEyeCloseLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      ) : (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowPassword(true)}
                          >
                            <RiEyeLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-sm text-primary">
                      Confirm Password
                    </FormLabel>
                    <div className="relative flex w-full items-center">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="shadow-none"
                          {...field}
                        />
                      </FormControl>
                      {showConfirmPassword ? (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowConfirmPassword(false)}
                          >
                            <RiEyeCloseLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      ) : (
                        <div className="absolute right-0.5 flex items-center justify-center rounded-e-md bg-background py-1 pl-2 pr-4">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent"
                            onClick={() => setShowConfirmPassword(true)}
                          >
                            <RiEyeLine className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </span>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="flex h-9 items-center gap-x-2 rounded-md bg-destructive/15 px-3 py-1 text-sm text-destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                className="h-9 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
              </Button>
            </form>
          </Form>
        )}
      </div>

      {type && variant === "login" && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">
            Forgot password?
          </span>

          <span
            onClick={() => toggleVariant()}
            className="cursor-pointer text-sm text-primary hover:underline"
          >
            Reset
          </span>
        </div>
      )}

      {variant === "reset" && resetStep === 1 && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Back to login?</span>

          <span
            onClick={() => toggleVariant()}
            className="cursor-pointer text-sm text-primary hover:underline"
          >
            Login
          </span>
        </div>
      )}
    </section>
  );
}
