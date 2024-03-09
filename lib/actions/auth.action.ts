"use server";

import { z } from "zod";
import { registerFormSchema } from "../validator";
import bcrypt from "bcrypt";
import prisma from "../db";
import { getUserByEmail } from "./user.action";

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
