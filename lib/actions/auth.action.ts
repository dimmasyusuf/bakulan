"use server";

import { z } from "zod";
import { loginFormSchema, registerFormSchema } from "../validator";
import bcrypt from "bcryptjs";
import prisma from "../db";
import { getUserByEmail } from "./user.action";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const createUser = async (
  values: z.infer<typeof registerFormSchema>,
) => {
  const validatedFields = registerFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: send verification email token

  return { success: "User created!" };
};

export const loginUser = async (values: z.infer<typeof loginFormSchema>) => {
  const validatedFields = loginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
