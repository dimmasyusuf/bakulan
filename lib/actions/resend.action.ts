"use server";

import { Resend } from "resend";
import { z } from "zod";
import { sendEmailFormSchema } from "../validator";
import Email from "@/components/Email";
import { getUserByEmail } from "./user.action";
import { getVerificationTokenByEmail } from "./auth.action";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  values: z.infer<typeof sendEmailFormSchema>,
) => {
  const existingUser = await getUserByEmail(values.email);
  const verificationToken = await getVerificationTokenByEmail(values.email);
  const name = existingUser?.name || "there";
  const token = verificationToken?.token || "";

  try {
    if (existingUser && verificationToken) {
      await resend.emails.send({
        from: "Bakulan <onboarding@resend.dev>",
        to: values.email,
        subject: "Reset Password",
        react: Email({ name, token }),
      });

      return {
        status: 200,
        message: "Email sent successfully",
      };
    }

    return {
      status: 404,
      error: "Email not found",
    };
  } catch (error) {
    return {
      status: 500,
      error: "Failed to send email",
    };
  }
};
