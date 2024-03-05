"use client";

import Image from "next/image";
import { signIn } from "@/auth";
import { useForm } from "react-hook-form";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { loginFormSchema } from "@/lib/validator";
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
import { Dispatch, useState } from "react";

export default function AuthForm({
  openAuth,
}: {
  openAuth: Dispatch<boolean>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log("values:", values);

    // try {
    //   setIsSubmitting(true);

    //   setTimeout(async () => {
    //     const response = await signIn("credentials", {
    //       email: values.email,
    //       password: values.password,
    //       redirect: false,
    //     });

    //     if (response?.error === null) {
    //       form.reset();
    //       setIsSubmitting(false);
    //     } else {
    //       toast.error(`${response?.error}`, {
    //         position: "top-right",
    //       });
    //       form.reset();
    //       setIsSubmitting(false);
    //     }
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }
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
        <span className="text-xl font-bold">Login</span>
        <span className="text-muted-foreground">to continue to Bakulan</span>
      </div>

      <div className="flex flex-col gap-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Forgot password?</span>

        <span className="cursor-pointer text-sm text-primary hover:underline">
          Reset
        </span>
      </div>
    </section>
  );
}
