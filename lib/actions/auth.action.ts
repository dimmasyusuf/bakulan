"use server";

import { z } from "zod";
import { loginFormSchema, registerFormSchema } from "../validator";
import bcrypt from "bcryptjs";
import prisma from "../db";
import { getUserByEmail } from "./user.action";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const createUser = async ({
  values,
  role,
}: {
  values: z.infer<typeof registerFormSchema>;
  role: Role;
}) => {
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
      role,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  return { success: "Confirmation email sent!" };
};

export const loginUser = async (values: z.infer<typeof loginFormSchema>) => {
  const validatedFields = loginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.email_verified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email or password is incorrect!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const logoutUser = async () => {
  await signOut();
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
